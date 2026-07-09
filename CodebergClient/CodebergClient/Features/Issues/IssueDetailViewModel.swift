import Foundation
import Observation

@MainActor
@Observable
final class IssueDetailViewModel {
    private let api: ForgejoAPIProtocol
    let owner: String
    let repoName: String
    let issueNumber: Int

    /// Combined issue + comments loading state.
    var state: LoadState<Loaded> = .idle

    var draft = ""
    private(set) var isPostingComment = false
    var commentError: String?

    struct Loaded: Equatable {
        var issue: Issue
        var comments: [Comment]
    }

    init(api: ForgejoAPIProtocol, owner: String, repoName: String, issueNumber: Int, preview: Issue?) {
        self.api = api
        self.owner = owner
        self.repoName = repoName
        self.issueNumber = issueNumber
        if let preview {
            state = .loaded(Loaded(issue: preview, comments: []))
        }
    }

    var canSubmit: Bool {
        !draft.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty && !isPostingComment
    }

    func load() async {
        if state.value == nil { state = .loading }
        do {
            async let issueTask = api.issue(owner: owner, repo: repoName, number: issueNumber)
            async let commentsTask = api.comments(owner: owner, repo: repoName, number: issueNumber)
            let (issue, comments) = try await (issueTask, commentsTask)
            state = .loaded(Loaded(issue: issue, comments: comments))
        } catch {
            if state.value == nil {
                state = .failed(Self.message(for: error))
            }
        }
    }

    func postComment() async {
        let body = draft.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !body.isEmpty else { return }
        commentError = nil
        isPostingComment = true
        defer { isPostingComment = false }

        do {
            let comment = try await api.addComment(
                owner: owner,
                repo: repoName,
                number: issueNumber,
                body: body
            )
            if var loaded = state.value {
                loaded.comments.append(comment)
                loaded.issue = Self.bumpCommentCount(loaded.issue)
                state = .loaded(loaded)
            }
            draft = ""
        } catch {
            commentError = Self.message(for: error)
        }
    }

    private static func bumpCommentCount(_ issue: Issue) -> Issue {
        // Issue is a value type with `let` fields; rebuild with an incremented count.
        Issue(
            id: issue.id,
            number: issue.number,
            title: issue.title,
            body: issue.body,
            state: issue.state,
            user: issue.user,
            labels: issue.labels,
            assignees: issue.assignees,
            commentsCount: issue.commentsCount + 1,
            createdAt: issue.createdAt,
            updatedAt: issue.updatedAt,
            closedAt: issue.closedAt,
            htmlURL: issue.htmlURL,
            pullRequest: issue.pullRequest,
            repository: issue.repository
        )
    }

    private static func message(for error: Error) -> String {
        (error as? LocalizedError)?.errorDescription ?? error.localizedDescription
    }
}
