import Foundation

/// Open/closed state shared by issues and pull requests.
enum IssueState: String, Codable, CaseIterable, Identifiable {
    case open
    case closed
    /// Used only as a query filter, never returned by the API on an item.
    case all

    var id: String { rawValue }

    var title: String {
        switch self {
        case .open: return "Open"
        case .closed: return "Closed"
        case .all: return "All"
        }
    }
}

/// A lightweight reference embedded on an issue when it is actually a pull request.
struct PullRequestRef: Codable, Hashable {
    let merged: Bool?
    let mergedAt: Date?

    enum CodingKeys: String, CodingKey {
        case merged
        case mergedAt = "merged_at"
    }
}

/// An issue on a Forgejo/Codeberg instance.
///
/// In the Forgejo API pull requests are also returned by the issues endpoints; such
/// items carry a non-nil `pullRequest`. `IssueListViewModel` filters those out for
/// Phase 1 (Issues); Phase 2 will surface them in a dedicated Pull Requests feature.
struct Issue: Codable, Identifiable, Hashable {
    let id: Int
    /// The per-repository issue number shown to users (e.g. `#42`).
    let number: Int
    let title: String
    let body: String?
    let state: IssueState
    let user: User?
    let labels: [Label]
    let assignees: [User]?
    let commentsCount: Int
    let createdAt: Date?
    let updatedAt: Date?
    let closedAt: Date?
    let htmlURL: String?
    let pullRequest: PullRequestRef?
    /// The owning repository, when the API includes it (e.g. cross-repo issue search).
    let repository: RepositoryRef?

    var isPullRequest: Bool { pullRequest != nil }

    enum CodingKeys: String, CodingKey {
        case id, number, title, body, state, user, labels, assignees, repository
        case commentsCount = "comments"
        case createdAt = "created_at"
        case updatedAt = "updated_at"
        case closedAt = "closed_at"
        case htmlURL = "html_url"
        case pullRequest = "pull_request"
    }
}

/// A compact repository reference embedded in cross-repo issue search results.
struct RepositoryRef: Codable, Hashable {
    let id: Int
    let name: String
    let fullName: String
    let owner: String

    enum CodingKeys: String, CodingKey {
        case id, name, owner
        case fullName = "full_name"
    }
}
