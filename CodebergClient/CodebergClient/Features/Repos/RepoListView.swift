import SwiftUI

struct RepoListView: View {
    @Environment(AuthStore.self) private var auth
    @State private var model: RepoListViewModel?

    var body: some View {
        NavigationStack {
            Group {
                if let model {
                    content(model)
                } else {
                    ProgressView()
                }
            }
            .navigationTitle("Repositories")
        }
        .task {
            if model == nil {
                model = RepoListViewModel(api: auth.api)
            }
            await model?.loadInitial()
        }
    }

    @ViewBuilder
    private func content(_ model: RepoListViewModel) -> some View {
        @Bindable var model = model
        switch model.state {
        case .idle, .loading where model.repositories.isEmpty:
            ProgressView("Loading repositories…")
                .frame(maxWidth: .infinity, maxHeight: .infinity)
        case let .failed(message):
            ErrorStateView(message: message) {
                Task { await model.reload() }
            }
        default:
            list(model)
        }
    }

    private func list(_ model: RepoListViewModel) -> some View {
        @Bindable var model = model
        return List {
            if model.repositories.isEmpty {
                ContentUnavailableView("No Repositories", systemImage: "folder", description: Text("Nothing matched your search."))
            }
            ForEach(model.repositories) { repo in
                NavigationLink(value: repo) {
                    RepoRow(repo: repo)
                }
                .task { await model.loadMoreIfNeeded(currentItem: repo) }
            }
            if model.isLoadingMore {
                HStack { Spacer(); ProgressView(); Spacer() }
            }
        }
        .listStyle(.plain)
        .searchable(text: $model.searchText, prompt: "Search all repositories")
        .onSubmit(of: .search) {
            Task { await model.search() }
        }
        .refreshable { await model.reload() }
        .navigationDestination(for: Repository.self) { repo in
            IssueListView(repo: repo)
        }
    }
}

private struct RepoRow: View {
    let repo: Repository

    var body: some View {
        VStack(alignment: .leading, spacing: 4) {
            HStack(spacing: 6) {
                Image(systemName: repo.isPrivate ? "lock.fill" : "folder")
                    .font(.caption)
                    .foregroundStyle(.secondary)
                Text(repo.fullName)
                    .font(.headline)
                    .lineLimit(1)
            }
            if let description = repo.description, !description.isEmpty {
                Text(description)
                    .font(.subheadline)
                    .foregroundStyle(.secondary)
                    .lineLimit(2)
            }
            HStack(spacing: 14) {
                stat(icon: "star", value: repo.starsCount)
                stat(icon: "tuningfork", value: repo.forksCount)
                if repo.hasIssues {
                    stat(icon: "smallcircle.circle", value: repo.openIssuesCount)
                }
                Spacer()
                if let updated = repo.updatedAt {
                    Text(Formatting.relative(updated))
                        .font(.caption2)
                        .foregroundStyle(.tertiary)
                }
            }
            .font(.caption)
            .foregroundStyle(.secondary)
        }
        .padding(.vertical, 2)
    }

    private func stat(icon: String, value: Int) -> some View {
        SwiftUI.Label("\(value)", systemImage: icon)
            .labelStyle(.titleAndIcon)
    }
}
