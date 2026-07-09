import Foundation

/// A comment on an issue or pull request.
struct Comment: Codable, Identifiable, Hashable {
    let id: Int
    let body: String
    let user: User?
    let createdAt: Date?
    let updatedAt: Date?
    let htmlURL: String?

    enum CodingKeys: String, CodingKey {
        case id, body, user
        case createdAt = "created_at"
        case updatedAt = "updated_at"
        case htmlURL = "html_url"
    }
}
