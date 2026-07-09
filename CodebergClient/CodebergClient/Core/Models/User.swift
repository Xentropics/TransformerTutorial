import Foundation

/// A Forgejo/Codeberg user (or organization).
struct User: Codable, Identifiable, Hashable {
    let id: Int
    let login: String
    let fullName: String?
    let email: String?
    let avatarURL: String?
    let htmlURL: String?

    enum CodingKeys: String, CodingKey {
        case id, login, email
        case fullName = "full_name"
        case avatarURL = "avatar_url"
        case htmlURL = "html_url"
    }

    /// Best display name available: full name if present, otherwise the login.
    var displayName: String {
        if let fullName, !fullName.isEmpty { return fullName }
        return login
    }
}
