import XCTest
@testable import CodebergClient

@MainActor
final class ViewModelTests: XCTestCase {

    func testIssueListFiltersOutPullRequests() async {
        let api = MockForgejoAPI()
        let repo = makeRepo()
        api.issuesByRepo["owner/repo"] = [
            Fixture.issue(number: 1, title: "Real issue"),
            Fixture.issue(number: 2, title: "Sneaky PR", isPR: true),
        ]
        let model = IssueListViewModel(api: api, repo: repo)
        await model.reload()
        XCTAssertEqual(model.issues.count, 1)
        XCTAssertEqual(model.issues.first?.title, "Real issue")
    }

    func testPostCommentAppendsAndClearsDraft() async {
        let api = MockForgejoAPI()
        let preview = Fixture.issue(number: 7, comments: 2)
        let model = IssueDetailViewModel(api: api, owner: "owner", repoName: "repo", issueNumber: 7, preview: preview)
        model.draft = "  Looks good to me  "

        await model.postComment()

        XCTAssertEqual(api.postedComments, ["Looks good to me"], "body should be trimmed")
        XCTAssertEqual(model.state.value?.comments.count, 1)
        XCTAssertEqual(model.state.value?.issue.commentsCount, 3, "count should optimistically bump")
        XCTAssertTrue(model.draft.isEmpty, "draft should clear on success")
        XCTAssertNil(model.commentError)
    }

    func testPostEmptyCommentIsIgnored() async {
        let api = MockForgejoAPI()
        let preview = Fixture.issue(number: 7)
        let model = IssueDetailViewModel(api: api, owner: "owner", repoName: "repo", issueNumber: 7, preview: preview)
        model.draft = "   "
        await model.postComment()
        XCTAssertTrue(api.postedComments.isEmpty)
        XCTAssertFalse(model.canSubmit)
    }

    func testMyIssuesFiltersPullRequests() async {
        let api = MockForgejoAPI()
        api.searchIssuesResult = [
            Fixture.issue(number: 1),
            Fixture.issue(number: 2, isPR: true),
            Fixture.issue(number: 3),
        ]
        let model = MyIssuesViewModel(api: api)
        await model.reload()
        XCTAssertEqual(model.issues.count, 2)
    }

    // MARK: - Helpers

    private func makeRepo() -> Repository {
        Repository(
            id: 1,
            name: "repo",
            fullName: "owner/repo",
            owner: User(id: 9, login: "owner", fullName: nil, email: nil, avatarURL: nil, htmlURL: nil),
            description: nil,
            isPrivate: false,
            fork: false,
            archived: false,
            starsCount: 0,
            forksCount: 0,
            openIssuesCount: 0,
            defaultBranch: "main",
            htmlURL: nil,
            updatedAt: nil,
            hasIssues: true,
            hasPullRequests: true
        )
    }
}
