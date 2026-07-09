import Foundation

/// Credentials for a Forgejo/Codeberg instance.
struct Credentials: Codable, Equatable {
    /// Base instance URL, e.g. `https://codeberg.org`.
    var serverURL: URL
    /// A personal access token.
    var token: String

    /// The API v1 base, e.g. `https://codeberg.org/api/v1`.
    var apiBaseURL: URL {
        serverURL.appendingPathComponent("api").appendingPathComponent("v1")
    }
}

/// Relationship filter for the cross-repo issue search.
enum IssueSearchFilter: String, CaseIterable, Identifiable {
    case createdByMe
    case assignedToMe
    case mentioningMe

    var id: String { rawValue }

    var title: String {
        switch self {
        case .createdByMe: return "Created"
        case .assignedToMe: return "Assigned"
        case .mentioningMe: return "Mentioned"
        }
    }

    /// Maps to the boolean query flag Forgejo's `/repos/issues/search` expects.
    var queryItem: (key: String, value: String) {
        switch self {
        case .createdByMe: return ("created", "true")
        case .assignedToMe: return ("assigned", "true")
        case .mentioningMe: return ("mentioned", "true")
        }
    }
}

/// A page of results plus paging metadata parsed from Forgejo response headers.
struct Page<Element> {
    let items: [Element]
    /// Total number of items across all pages, from `X-Total-Count` when present.
    let totalCount: Int?
    let page: Int
    let hasMore: Bool
}

/// Abstraction over the Forgejo REST API so features can be tested against a mock.
protocol ForgejoAPIProtocol: AnyObject {
    var credentials: Credentials? { get set }

    func currentUser() async throws -> User

    func userRepositories(page: Int, limit: Int) async throws -> Page<Repository>
    func searchRepositories(query: String, page: Int, limit: Int) async throws -> Page<Repository>

    func issues(
        owner: String,
        repo: String,
        state: IssueState,
        page: Int,
        limit: Int
    ) async throws -> Page<Issue>

    func issue(owner: String, repo: String, number: Int) async throws -> Issue

    /// Issues across every repository the signed-in user can access.
    func searchIssues(
        state: IssueState,
        filter: IssueSearchFilter,
        page: Int,
        limit: Int
    ) async throws -> Page<Issue>

    func comments(owner: String, repo: String, number: Int) async throws -> [Comment]

    @discardableResult
    func addComment(owner: String, repo: String, number: Int, body: String) async throws -> Comment
}

/// Concrete `URLSession`-backed Forgejo client.
final class ForgejoAPI: ForgejoAPIProtocol {
    var credentials: Credentials?
    private let session: URLSession

    init(credentials: Credentials? = nil, session: URLSession = .shared) {
        self.credentials = credentials
        self.session = session
    }

    // MARK: - Endpoints

    func currentUser() async throws -> User {
        try await get("/user")
    }

    func userRepositories(page: Int = 1, limit: Int = 30) async throws -> Page<Repository> {
        try await getPage("/user/repos", query: [
            "page": String(page),
            "limit": String(limit),
        ], page: page, limit: limit)
    }

    func searchRepositories(query: String, page: Int = 1, limit: Int = 30) async throws -> Page<Repository> {
        // /repos/search wraps results in { ok, data: [...] }.
        let wrapper: SearchWrapper<Repository> = try await get("/repos/search", query: [
            "q": query,
            "page": String(page),
            "limit": String(limit),
        ])
        let items = wrapper.data ?? []
        return Page(items: items, totalCount: nil, page: page, hasMore: items.count >= limit)
    }

    func issues(
        owner: String,
        repo: String,
        state: IssueState = .open,
        page: Int = 1,
        limit: Int = 30
    ) async throws -> Page<Issue> {
        try await getPage("/repos/\(owner)/\(repo)/issues", query: [
            "state": state.rawValue,
            "type": "issues", // exclude pull requests at the source
            "page": String(page),
            "limit": String(limit),
        ], page: page, limit: limit)
    }

    func issue(owner: String, repo: String, number: Int) async throws -> Issue {
        try await get("/repos/\(owner)/\(repo)/issues/\(number)")
    }

    func searchIssues(
        state: IssueState = .open,
        filter: IssueSearchFilter = .createdByMe,
        page: Int = 1,
        limit: Int = 30
    ) async throws -> Page<Issue> {
        let flag = filter.queryItem
        return try await getPage("/repos/issues/search", query: [
            "state": state.rawValue,
            "type": "issues",
            flag.key: flag.value,
            "page": String(page),
            "limit": String(limit),
        ], page: page, limit: limit)
    }

    func comments(owner: String, repo: String, number: Int) async throws -> [Comment] {
        try await get("/repos/\(owner)/\(repo)/issues/\(number)/comments")
    }

    @discardableResult
    func addComment(owner: String, repo: String, number: Int, body: String) async throws -> Comment {
        try await post("/repos/\(owner)/\(repo)/issues/\(number)/comments", body: ["body": body])
    }

    // MARK: - Request plumbing

    private func makeRequest(
        path: String,
        method: String = "GET",
        query: [String: String] = [:],
        body: Data? = nil
    ) throws -> URLRequest {
        guard let credentials else { throw APIError.notAuthenticated }

        guard var components = URLComponents(
            url: credentials.apiBaseURL.appendingPathComponent(path.trimmingSlashes),
            resolvingAgainstBaseURL: false
        ) else {
            throw APIError.invalidServerURL
        }
        if !query.isEmpty {
            components.queryItems = query
                .sorted { $0.key < $1.key }
                .map { URLQueryItem(name: $0.key, value: $0.value) }
        }
        guard let url = components.url else { throw APIError.invalidServerURL }

        var request = URLRequest(url: url)
        request.httpMethod = method
        request.setValue("token \(credentials.token)", forHTTPHeaderField: "Authorization")
        request.setValue("application/json", forHTTPHeaderField: "Accept")
        if let body {
            request.httpBody = body
            request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        }
        return request
    }

    private func perform(_ request: URLRequest) async throws -> (Data, HTTPURLResponse) {
        let data: Data
        let response: URLResponse
        do {
            (data, response) = try await session.data(for: request)
        } catch {
            throw APIError.transport(error.localizedDescription)
        }
        guard let http = response as? HTTPURLResponse else {
            throw APIError.transport("Unexpected response type.")
        }
        try Self.validate(status: http.statusCode, data: data)
        return (data, http)
    }

    private static func validate(status: Int, data: Data) throws {
        guard !(200...299).contains(status) else { return }
        let message = (try? JSONCoding.decoder.decode(ForgejoErrorBody.self, from: data))?.message
        switch status {
        case 401: throw APIError.unauthorized
        case 403: throw APIError.forbidden
        case 404: throw APIError.notFound
        case 429: throw APIError.rateLimited
        default: throw APIError.server(status: status, message: message)
        }
    }

    private func decode<T: Decodable>(_ data: Data) throws -> T {
        do {
            return try JSONCoding.decoder.decode(T.self, from: data)
        } catch {
            throw APIError.decoding(String(describing: error))
        }
    }

    private func get<T: Decodable>(_ path: String, query: [String: String] = [:]) async throws -> T {
        let request = try makeRequest(path: path, query: query)
        let (data, _) = try await perform(request)
        return try decode(data)
    }

    private func getPage<T: Decodable>(
        _ path: String,
        query: [String: String],
        page: Int,
        limit: Int
    ) async throws -> Page<T> {
        let request = try makeRequest(path: path, query: query)
        let (data, http) = try await perform(request)
        let items: [T] = try decode(data)
        let total = (http.value(forHTTPHeaderField: "X-Total-Count")).flatMap(Int.init)
        // If the server filled the page, assume there may be more.
        let hasMore = items.count >= limit
        return Page(items: items, totalCount: total, page: page, hasMore: hasMore)
    }

    private func post<T: Decodable>(_ path: String, body: [String: String]) async throws -> T {
        let payload = try JSONCoding.encoder.encode(body)
        let request = try makeRequest(path: path, method: "POST", body: payload)
        let (data, _) = try await perform(request)
        return try decode(data)
    }
}

/// Wrapper Forgejo uses for search endpoints: `{ "ok": true, "data": [...] }`.
private struct SearchWrapper<T: Decodable>: Decodable {
    let ok: Bool?
    let data: [T]?
}

private extension String {
    /// Removes leading/trailing slashes so path components join cleanly.
    var trimmingSlashes: String {
        trimmingCharacters(in: CharacterSet(charactersIn: "/"))
    }
}
