import Foundation

/// Errors surfaced by `ForgejoAPI`.
enum APIError: LocalizedError, Equatable {
    case invalidServerURL
    case notAuthenticated
    case unauthorized
    case forbidden
    case notFound
    case rateLimited
    /// A non-2xx response with the decoded server message, if any.
    case server(status: Int, message: String?)
    case decoding(String)
    case transport(String)

    var errorDescription: String? {
        switch self {
        case .invalidServerURL:
            return "The server URL is not valid."
        case .notAuthenticated:
            return "You are not signed in."
        case .unauthorized:
            return "Your token was rejected. Please sign in again."
        case .forbidden:
            return "You don't have permission to do that. Check your token's scopes."
        case .notFound:
            return "The requested item was not found."
        case .rateLimited:
            return "Rate limit reached. Please try again shortly."
        case let .server(status, message):
            if let message, !message.isEmpty {
                return message
            }
            return "The server returned an error (\(status))."
        case let .decoding(detail):
            return "Couldn't read the server response. \(detail)"
        case let .transport(detail):
            return detail
        }
    }
}

/// Shape of the JSON error body Forgejo returns, e.g. `{"message": "...", "url": "..."}`.
struct ForgejoErrorBody: Decodable {
    let message: String?
}
