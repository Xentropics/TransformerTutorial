import XCTest
@testable import CodebergClient

final class AuthURLTests: XCTestCase {
    func testAddsHTTPSSchemeWhenMissing() {
        let url = AuthStore.normalizedURL(from: "codeberg.org")
        XCTAssertEqual(url?.absoluteString, "https://codeberg.org")
    }

    func testKeepsExistingScheme() {
        let url = AuthStore.normalizedURL(from: "https://git.example.com")
        XCTAssertEqual(url?.absoluteString, "https://git.example.com")
    }

    func testStripsTrailingSlash() {
        let url = AuthStore.normalizedURL(from: "https://codeberg.org/")
        XCTAssertEqual(url?.absoluteString, "https://codeberg.org")
    }

    func testStripsAccidentalAPISuffix() {
        let url = AuthStore.normalizedURL(from: "https://codeberg.org/api/v1")
        XCTAssertEqual(url?.absoluteString, "https://codeberg.org")
    }

    func testRejectsEmpty() {
        XCTAssertNil(AuthStore.normalizedURL(from: "   "))
    }

    func testAPIBaseURLIsAppended() {
        let creds = Credentials(serverURL: URL(string: "https://codeberg.org")!, token: "t")
        XCTAssertEqual(creds.apiBaseURL.absoluteString, "https://codeberg.org/api/v1")
    }
}
