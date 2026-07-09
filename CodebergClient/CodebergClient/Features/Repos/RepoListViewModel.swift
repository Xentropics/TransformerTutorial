import Foundation
import Observation

@MainActor
@Observable
final class RepoListViewModel {
    private let api: ForgejoAPIProtocol

    var state: LoadState<[Repository]> = .idle
    var searchText = ""
    private(set) var isLoadingMore = false

    private var page = 1
    private var canLoadMore = true
    private let limit = 30

    /// Non-empty when the current results come from a search query.
    private var activeQuery: String?

    init(api: ForgejoAPIProtocol) {
        self.api = api
    }

    var repositories: [Repository] { state.value ?? [] }

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

    func loadMoreIfNeeded(currentItem: Repository) async {
        guard let items = state.value,
              !isLoadingMore, canLoadMore,
              let index = items.firstIndex(of: currentItem),
              index >= items.count - 5 else { return }
        await fetch(reset: false)
    }

    /// Runs a search, or clears back to the user's repositories when the query empties.
    func search() async {
        let trimmed = searchText.trimmingCharacters(in: .whitespacesAndNewlines)
        activeQuery = trimmed.isEmpty ? nil : trimmed
        await reload()
    }

    private func fetch(reset: Bool) async {
        if reset {
            page = 1
        } else {
            isLoadingMore = true
            page += 1
        }
        defer { isLoadingMore = false }

        do {
            let result: Page<Repository>
            if let query = activeQuery {
                result = try await api.searchRepositories(query: query, page: page, limit: limit)
            } else {
                result = try await api.userRepositories(page: page, limit: limit)
            }
            canLoadMore = result.hasMore
            let existing = reset ? [] : (state.value ?? [])
            let merged = dedupe(existing + result.items)
            state = .loaded(merged)
        } catch {
            if reset {
                state = .failed(Self.message(for: error))
            }
            // On a pagination failure keep what we have and stop paging.
            canLoadMore = false
        }
    }

    private func dedupe(_ repos: [Repository]) -> [Repository] {
        var seen = Set<Int>()
        return repos.filter { seen.insert($0.id).inserted }
    }

    private static func message(for error: Error) -> String {
        (error as? LocalizedError)?.errorDescription ?? error.localizedDescription
    }
}
