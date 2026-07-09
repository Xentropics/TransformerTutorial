import SwiftUI

struct IssueListView: View {
    @Environment(AuthStore.self) private var auth
    let repo: Repository
    @State private var model: IssueListViewModel?

    var body: some View {
        Group {
            if let model {
                content(model)
            } else {
                ProgressView()
            }
        }
        .navigationTitle(repo.name)
        .navigationBarTitleDisplayMode(.inline)
        .task {
            if model == nil {
                model = IssueListViewModel(api: auth.api, repo: repo)
            }
            await model?.loadInitial()
        }
    }

    @ViewBuilder
    private func content(_ model: IssueListViewModel) -> some View {
        @Bindable var model = model
        VStack(spacing: 0) {
            Picker("State", selection: $model.filter) {
                Text("Open").tag(IssueState.open)
                Text("Closed").tag(IssueState.closed)
                Text("All").tag(IssueState.all)
            }
            .pickerStyle(.segmented)
            .padding(.horizontal)
            .padding(.vertical, 8)

            switch model.state {
            case .idle, .loading where model.issues.isEmpty:
                Spacer()
                ProgressView("Loading issues…")
                Spacer()
            case let .failed(message):
                ErrorStateView(message: message) { Task { await model.reload() } }
            default:
                list(model)
            }
        }
    }

    private func list(_ model: IssueListViewModel) -> some View {
        List {
            if model.issues.isEmpty {
                ContentUnavailableView(
                    "No \(model.filter.title) Issues",
                    systemImage: "smallcircle.circle",
                    description: Text("There's nothing here yet.")
                )
            }
            ForEach(model.issues) { issue in
                NavigationLink(value: issue) {
                    IssueRow(issue: issue)
                }
                .task { await model.loadMoreIfNeeded(currentItem: issue) }
            }
            if model.isLoadingMore {
                HStack { Spacer(); ProgressView(); Spacer() }
            }
        }
        .listStyle(.plain)
        .refreshable { await model.reload() }
        .navigationDestination(for: Issue.self) { issue in
            IssueDetailView(
                owner: repo.owner.login,
                repoName: repo.name,
                issueNumber: issue.number,
                preview: issue
            )
        }
    }
}
