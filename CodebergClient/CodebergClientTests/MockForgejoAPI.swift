import Foundation
@testable import CodebergClient

/// In-memory `ForgejoAPIProtocol` used to drive view-model tests without networking.
final class MockForgejoAPI: ForgejoAPIProtocol {
    var credentials: Credentials?

    var user = User(id: 1, login: "tester", fullName: "Test User", email: nil, avatarURL: nil, htmlURL: nil)
    var repos: [Repository] = []
    var issuesByRepo: [String: [Issue]] = [:]
    var singleIssue: Issue?
    var commentsList: [Comment] = []
    var searchIssuesResult: [Issue] = []

    /// Records the last comment body posted.
    private(set) var postedComments: [String] = []
    var addCommentResult: Comment?

    func currentUser() async throws -> User { user }

    func userRepositories(page: Int, limit: Int) async throws -> Page<Repository> {
        Page(items: repos, totalCount: repos.count, page: page, hasMore: false)
    }

    func searchRepositories(query: String, page: Int, limit: Int) async throws -> Page<Repository> {
        Page(items: repos, totalCount: repos.count, page: page, hasMore: false)
    }

    func issues(owner: String, repo: String, state: IssueState, page: Int, limit: Int) async throws -> Page<Issue> {
        let items = issuesByRepo["\(owner)/\(repo)"] ?? []
        return Page(items: items, totalCount: items.count, page: page, hasMore: false)
    }

    func issue(owner: String, repo: String, number: Int) async throws -> Issue {
        singleIssue ?? issuesByRepo["\(owner)/\(repo)"]?.first { $0.number == number } ?? {
            fatalError("no issue configured")
        }()
    }

    func searchIssues(state: IssueState, filter: IssueSearchFilter, page: Int, limit: Int) async throws -> Page<Issue> {
        Page(items: searchIssuesResult, totalCount: searchIssuesResult.count, page: page, hasMore: false)
    }

    func comments(owner: String, repo: String, number: Int) async throws -> [Comment] {
        commentsList
    }

    @discardableResult
    func addComment(owner: String, repo: String, number: Int, body: String) async throws -> Comment {
        postedComments.append(body)
        return addCommentResult ?? Comment(
            id: Int.random(in: 1000...9999),
            body: body,
            user: user,
            createdAt: Date(timeIntervalSince1970: 0),
            updatedAt: nil,
            htmlURL: nil
        )
    }
}

/// Factory helpers for building fixtures.
enum Fixture {
    static func issue(number: Int, title: String = "Issue", isPR: Bool = false, comments: Int = 0) -> Issue {
        Issue(
            id: number * 100,
            number: number,
            title: title,
            body: "Body of \(title)",
            state: .open,
            user: User(id: 1, login: "author", fullName: nil, email: nil, avatarURL: nil, htmlURL: nil),
            labels: [],
            assignees: nil,
            commentsCount: comments,
            createdAt: Date(timeIntervalSince1970: 0),
            updatedAt: Date(timeIntervalSince1970: 0),
            closedAt: nil,
            htmlURL: nil,
            pullRequest: isPR ? PullRequestRef(merged: false, mergedAt: nil) : nil,
            repository: RepositoryRef(id: 1, name: "repo", fullName: "owner/repo", owner: "owner")
        )
    }
}
