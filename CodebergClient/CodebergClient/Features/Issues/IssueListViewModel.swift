import Foundation
import Observation

@MainActor
@Observable
final class IssueListViewModel {
    private let api: ForgejoAPIProtocol
    let repo: Repository

    var state: LoadState<[Issue]> = .idle
    var filter: IssueState = .open {
        didSet { if filter != oldValue { Task { await reload() } } }
    }
    private(set) var isLoadingMore = false

    private var page = 1
    private var canLoadMore = true
    private let limit = 30

    init(api: ForgejoAPIProtocol, repo: Repository) {
        self.api = api
        self.repo = repo
    }

    var issues: [Issue] { state.value ?? [] }

    func loadInitial() async {
        guard state.value == nil else { return }
        await reload()
    }

    func reload() async {
        page = 1
        canLoadMore = true
        state = .loading
        await fetch(reset: true)
    }

    func loadMoreIfNeeded(currentItem: Issue) async {
        guard let items = state.value,
              !isLoadingMore, canLoadMore,
              let index = items.firstIndex(of: currentItem),
              index >= items.count - 5 else { return }
        await fetch(reset: false)
    }

    private func fetch(reset: Bool) async {
        if reset { page = 1 } else { isLoadingMore = true; page += 1 }
        defer { isLoadingMore = false }

        do {
            let result = try await api.issues(
                owner: repo.owner.login,
                repo: repo.name,
                state: filter,
                page: page,
                limit: limit
            )
            canLoadMore = result.hasMore
            // Defensively drop pull requests even though we request type=issues.
            let onlyIssues = result.items.filter { !$0.isPullRequest }
            let existing = reset ? [] : (state.value ?? [])
            let merged = dedupe(existing + onlyIssues)
            state = .loaded(merged)
        } catch {
            if reset {
                state = .failed(Self.message(for: error))
            }
            canLoadMore = false
        }
    }

    private func dedupe(_ issues: [Issue]) -> [Issue] {
        var seen = Set<Int>()
        return issues.filter { seen.insert($0.id).inserted }
    }

    private static func message(for error: Error) -> String {
        (error as? LocalizedError)?.errorDescription ?? error.localizedDescription
    }
}
