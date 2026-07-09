import SwiftUI

struct IssueDetailView: View {
    @Environment(AuthStore.self) private var auth
    let owner: String
    let repoName: String
    let issueNumber: Int
    let preview: Issue?

    @State private var model: IssueDetailViewModel?
    @FocusState private var composerFocused: Bool

    var body: some View {
        Group {
            if let model {
                content(model)
            } else {
                ProgressView()
            }
        }
        .navigationTitle("#\(issueNumber)")
        .navigationBarTitleDisplayMode(.inline)
        .task {
            if model == nil {
                model = IssueDetailViewModel(api: auth.api, owner: owner, repoName: repoName, issueNumber: issueNumber, preview: preview)
            }
            await model?.load()
        }
    }

    @ViewBuilder
    private func content(_ model: IssueDetailViewModel) -> some View {
        @Bindable var model = model
        switch model.state {
        case .idle, .loading:
            ProgressView("Loading…").frame(maxWidth: .infinity, maxHeight: .infinity)
        case let .failed(message):
            ErrorStateView(message: message) { Task { await model.load() } }
        case let .loaded(loaded):
            VStack(spacing: 0) {
                thread(loaded, model: model)
                composer(model)
            }
        }
    }

    private func thread(_ loaded: IssueDetailViewModel.Loaded, model: IssueDetailViewModel) -> some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 16) {
                header(loaded.issue)
                Divider()
                if let body = loaded.issue.body, !body.isEmpty {
                    CommentCard(
                        author: loaded.issue.user,
                        date: loaded.issue.createdAt,
                        body: body,
                        isOriginalPost: true
                    )
                }
                ForEach(loaded.comments) { comment in
                    CommentCard(
                        author: comment.user,
                        date: comment.createdAt,
                        body: comment.body,
                        isOriginalPost: false
                    )
                }
                if loaded.comments.isEmpty && (loaded.issue.body?.isEmpty ?? true) {
                    Text("No description provided.")
                        .font(.subheadline)
                        .foregroundStyle(.secondary)
                }
            }
            .padding()
        }
        .refreshable { await model.load() }
    }

    private func header(_ issue: Issue) -> some View {
        VStack(alignment: .leading, spacing: 10) {
            Text(issue.title)
                .font(.title3.bold())
            HStack {
                IssueStateBadge(state: issue.state)
                if let login = issue.user?.login {
                    Text("opened by \(login)")
                        .font(.caption)
                        .foregroundStyle(.secondary)
                }
                Spacer()
                if let url = issue.htmlURL.flatMap(URL.init(string:)) {
                    Link(destination: url) {
                        Image(systemName: "safari")
                    }
                }
            }
            if !issue.labels.isEmpty {
                ScrollView(.horizontal, showsIndicators: false) {
                    HStack(spacing: 6) {
                        ForEach(issue.labels) { LabelChip(label: $0) }
                    }
                }
            }
        }
    }

    private func composer(_ model: IssueDetailViewModel) -> some View {
        @Bindable var model = model
        return VStack(spacing: 8) {
            if let error = model.commentError {
                SwiftUI.Label(error, systemImage: "exclamationmark.triangle.fill")
                    .font(.caption)
                    .foregroundStyle(.red)
                    .frame(maxWidth: .infinity, alignment: .leading)
            }
            HStack(alignment: .bottom, spacing: 8) {
                TextField("Add a comment…", text: $model.draft, axis: .vertical)
                    .lineLimit(1...5)
                    .textFieldStyle(.roundedBorder)
                    .focused($composerFocused)

                Button {
                    composerFocused = false
                    Task { await model.postComment() }
                } label: {
                    if model.isPostingComment {
                        ProgressView()
                            .frame(width: 28, height: 28)
                    } else {
                        Image(systemName: "arrow.up.circle.fill")
                            .font(.system(size: 28))
                    }
                }
                .disabled(!model.canSubmit)
            }
        }
        .padding(.horizontal)
        .padding(.vertical, 10)
        .background(.bar)
    }
}

/// A single comment (or the issue's original post) styled as a card.
private struct CommentCard: View {
    let author: User?
    let date: Date?
    let body: String
    let isOriginalPost: Bool

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            HStack(spacing: 8) {
                AvatarView(urlString: author?.avatarURL, fallbackText: author?.login ?? "?", size: 28)
                Text(author?.login ?? "unknown")
                    .font(.subheadline.weight(.semibold))
                if let date {
                    Text(Formatting.relative(date))
                        .font(.caption)
                        .foregroundStyle(.secondary)
                }
                Spacer()
                if isOriginalPost {
                    Text("OP")
                        .font(.caption2.weight(.bold))
                        .padding(.horizontal, 6)
                        .padding(.vertical, 2)
                        .background(.tint.opacity(0.15), in: Capsule())
                }
            }
            // Markdown rendering; falls back to raw text if parsing fails.
            Text(attributed(body))
                .font(.body)
                .textSelection(.enabled)
                .frame(maxWidth: .infinity, alignment: .leading)
        }
        .padding(12)
        .background(Color(.secondarySystemBackground), in: RoundedRectangle(cornerRadius: 12))
    }

    private func attributed(_ markdown: String) -> AttributedString {
        (try? AttributedString(
            markdown: markdown,
            options: .init(interpretedSyntax: .inlineOnlyPreservingWhitespace)
        )) ?? AttributedString(markdown)
    }
}
