import Foundation

/// A repository on a Forgejo/Codeberg instance.
struct Repository: Codable, Identifiable, Hashable {
    let id: Int
    let name: String
    let fullName: String
    let owner: User
    let description: String?
    let isPrivate: Bool
    let fork: Bool
    let archived: Bool
    let starsCount: Int
    let forksCount: Int
    let openIssuesCount: Int
    let defaultBranch: String?
    let htmlURL: String?
    let updatedAt: Date?
    let hasIssues: Bool
    let hasPullRequests: Bool

    enum CodingKeys: String, CodingKey {
        case id, name, owner, description, fork, archived
        case fullName = "full_name"
        case isPrivate = "private"
        case starsCount = "stars_count"
        case forksCount = "forks_count"
        case openIssuesCount = "open_issues_count"
        case defaultBranch = "default_branch"
        case htmlURL = "html_url"
        case updatedAt = "updated_at"
        case hasIssues = "has_issues"
        case hasPullRequests = "has_pull_requests"
    }
}
