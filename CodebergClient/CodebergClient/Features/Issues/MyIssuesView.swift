import SwiftUI
import Observation

@MainActor
@Observable
final class MyIssuesViewModel {
    private let api: ForgejoAPIProtocol

    var state: LoadState<[Issue]> = .idle
    var stateFilter: IssueState = .open {
        didSet { if stateFilter != oldValue { Task { await reload() } } }
    }
    var relationFilter: IssueSearchFilter = .createdByMe {
        didSet { if relationFilter != oldValue { Task { await reload() } } }
    }

    init(api: ForgejoAPIProtocol) { self.api = api }

    var issues: [Issue] { state.value ?? [] }

    func loadInitial() async {
        guard state.value == nil else { return }
        await reload()
    }

    func reload() async {
        state = .loading
        do {
            let result = try await api.searchIssues(
                state: stateFilter,
                filter: relationFilter,
                page: 1,
                limit: 50
            )
            state = .loaded(result.items.filter { !$0.isPullRequest })
        } catch {
            state = .failed((error as? LocalizedError)?.errorDescription ?? error.localizedDescription)
        }
    }
}

/// Cross-repository issue dashboard: issues created by, assigned to, or mentioning the user.
struct MyIssuesView: View {
    @Environment(AuthStore.self) private var auth
    @State private var model: MyIssuesViewModel?

    var body: some View {
        NavigationStack {
            Group {
                if let model { content(model) } else { ProgressView() }
            }
            .navigationTitle("My Issues")
        }
        .task {
            if model == nil { model = MyIssuesViewModel(api: auth.api) }
            await model?.loadInitial()
        }
    }

    @ViewBuilder
    private func content(_ model: MyIssuesViewModel) -> some View {
        @Bindable var model = model
        VStack(spacing: 0) {
            Picker("Relationship", selection: $model.relationFilter) {
                ForEach(IssueSearchFilter.allCases) { Text($0.title).tag($0) }
            }
            .pickerStyle(.segmented)
            .padding(.horizontal)
            .padding(.top, 8)

            Picker("State", selection: $model.stateFilter) {
                Text("Open").tag(IssueState.open)
                Text("Closed").tag(IssueState.closed)
                Text("All").tag(IssueState.all)
            }
            .pickerStyle(.segmented)
            .padding()

            switch model.state {
            case .idle, .loading:
                Spacer(); ProgressView("Loading…"); Spacer()
            case let .failed(message):
                ErrorStateView(message: message) { Task { await model.reload() } }
            case .loaded:
                list(model)
            }
        }
    }

    private func list(_ model: MyIssuesViewModel) -> some View {
        List {
            if model.issues.isEmpty {
                ContentUnavailableView(
                    "Nothing Here",
                    systemImage: "tray",
                    description: Text("No \(model.stateFilter.title.lowercased()) issues \(model.relationFilter.title.lowercased()).")
                )
            }
            ForEach(model.issues) { issue in
                if let ref = issue.repository {
                    NavigationLink(value: issue) {
                        VStack(alignment: .leading, spacing: 4) {
                            Text(ref.fullName)
                                .font(.caption2)
                                .foregroundStyle(.tint)
                            IssueRow(issue: issue)
                        }
                    }
                }
            }
        }
        .listStyle(.plain)
        .refreshable { await model.reload() }
        .navigationDestination(for: Issue.self) { issue in
            if let ref = issue.repository {
                IssueDetailView(
                    owner: ref.owner,
                    repoName: ref.name,
                    issueNumber: issue.number,
                    preview: issue
                )
            }
        }
    }
}
