import XCTest
@testable import CodebergClient

/// Intercepts URLSession requests so we can assert on them and return canned responses.
final class MockURLProtocol: URLProtocol {
    /// Handler set per-test: given a request, return status + headers + body.
    nonisolated(unsafe) static var handler: ((URLRequest) throws -> (Int, [String: String], Data))?
    nonisolated(unsafe) static var lastRequest: URLRequest?

    override class func canInit(with request: URLRequest) -> Bool { true }
    override class func canonicalRequest(for request: URLRequest) -> URLRequest { request }

    override func startLoading() {
        MockURLProtocol.lastRequest = request
        guard let handler = MockURLProtocol.handler else {
            client?.urlProtocol(self, didFailWithError: URLError(.badServerResponse))
            return
        }
        do {
            let (status, headers, data) = try handler(request)
            let response = HTTPURLResponse(
                url: request.url!,
                statusCode: status,
                httpVersion: "HTTP/1.1",
                headerFields: headers
            )!
            client?.urlProtocol(self, didReceive: response, cacheStoragePolicy: .notAllowed)
            client?.urlProtocol(self, didLoad: data)
            client?.urlProtocolDidFinishLoading(self)
        } catch {
            client?.urlProtocol(self, didFailWithError: error)
        }
    }

    override func stopLoading() {}
}

final class ForgejoAPITests: XCTestCase {
    private func makeAPI() -> ForgejoAPI {
        let config = URLSessionConfiguration.ephemeral
        config.protocolClasses = [MockURLProtocol.self]
        let session = URLSession(configuration: config)
        let api = ForgejoAPI(session: session)
        api.credentials = Credentials(serverURL: URL(string: "https://codeberg.org")!, token: "secret")
        return api
    }

    override func tearDown() {
        MockURLProtocol.handler = nil
        MockURLProtocol.lastRequest = nil
        super.tearDown()
    }

    func testCurrentUserSendsTokenAndHitsCorrectURL() async throws {
        MockURLProtocol.handler = { _ in
            let body = #"{"id":1,"login":"tester","full_name":"Test User"}"#
            return (200, [:], Data(body.utf8))
        }
        let api = makeAPI()
        let user = try await api.currentUser()

        XCTAssertEqual(user.login, "tester")
        XCTAssertEqual(MockURLProtocol.lastRequest?.url?.absoluteString, "https://codeberg.org/api/v1/user")
        XCTAssertEqual(MockURLProtocol.lastRequest?.value(forHTTPHeaderField: "Authorization"), "token secret")
    }

    func testAddCommentPostsBodyAndDecodesResponse() async throws {
        MockURLProtocol.handler = { request in
            // URLProtocol strips httpBody into a stream; assert on method/url instead.
            XCTAssertEqual(request.httpMethod, "POST")
            let body = #"{"id":99,"body":"Nice work","user":{"id":1,"login":"tester"}}"#
            return (201, [:], Data(body.utf8))
        }
        let api = makeAPI()
        let comment = try await api.addComment(owner: "o", repo: "r", number: 4, body: "Nice work")

        XCTAssertEqual(comment.id, 99)
        XCTAssertEqual(comment.body, "Nice work")
        XCTAssertEqual(
            MockURLProtocol.lastRequest?.url?.absoluteString,
            "https://codeberg.org/api/v1/repos/o/r/issues/4/comments"
        )
    }

    func testUnauthorizedMapsToAPIError() async {
        MockURLProtocol.handler = { _ in
            (401, [:], Data(#"{"message":"token required"}"#.utf8))
        }
        let api = makeAPI()
        do {
            _ = try await api.currentUser()
            XCTFail("expected unauthorized error")
        } catch {
            XCTAssertEqual(error as? APIError, .unauthorized)
        }
    }

    func testIssuesRequestIncludesStateAndTypeFilters() async throws {
        MockURLProtocol.handler = { _ in (200, ["X-Total-Count": "0"], Data("[]".utf8)) }
        let api = makeAPI()
        _ = try await api.issues(owner: "o", repo: "r", state: .closed, page: 2, limit: 10)

        let url = MockURLProtocol.lastRequest?.url?.absoluteString ?? ""
        XCTAssertTrue(url.contains("state=closed"), url)
        XCTAssertTrue(url.contains("type=issues"), url)
        XCTAssertTrue(url.contains("page=2"), url)
    }
}
