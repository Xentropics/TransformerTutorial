import SwiftUI

/// Circular avatar loaded from a URL, with a monogram placeholder.
struct AvatarView: View {
    let urlString: String?
    let fallbackText: String
    var size: CGFloat = 32

    var body: some View {
        Group {
            if let urlString, let url = URL(string: urlString) {
                AsyncImage(url: url) { phase in
                    switch phase {
                    case let .success(image):
                        image.resizable().scaledToFill()
                    default:
                        placeholder
                    }
                }
            } else {
                placeholder
            }
        }
        .frame(width: size, height: size)
        .clipShape(Circle())
        .overlay(Circle().strokeBorder(.quaternary, lineWidth: 0.5))
    }

    private var placeholder: some View {
        ZStack {
            Color.secondary.opacity(0.2)
            Text(monogram)
                .font(.system(size: size * 0.42, weight: .semibold))
                .foregroundStyle(.secondary)
        }
    }

    private var monogram: String {
        String(fallbackText.prefix(1)).uppercased()
    }
}

/// Small colored capsule for an issue label.
struct LabelChip: View {
    let label: Label

    var body: some View {
        Text(label.name)
            .font(.caption2.weight(.medium))
            .lineLimit(1)
            .padding(.horizontal, 8)
            .padding(.vertical, 3)
            .background(label.swiftUIColor, in: Capsule())
            .foregroundStyle(Color.readableForeground(onHex: label.color))
    }
}

/// Full-screen error state with a retry button.
struct ErrorStateView: View {
    let message: String
    var retry: (() -> Void)?

    var body: some View {
        ContentUnavailableView {
            SwiftUI.Label("Something went wrong", systemImage: "exclamationmark.triangle")
        } description: {
            Text(message)
        } actions: {
            if let retry {
                Button("Try Again", action: retry)
                    .buttonStyle(.borderedProminent)
            }
        }
    }
}

/// State badge that mirrors Forgejo's open/closed coloring.
struct IssueStateBadge: View {
    let state: IssueState
    var isPullRequest: Bool = false

    var body: some View {
        SwiftUI.Label(state.title, systemImage: symbol)
            .font(.caption.weight(.semibold))
            .padding(.horizontal, 8)
            .padding(.vertical, 4)
            .background(tint.opacity(0.18), in: Capsule())
            .foregroundStyle(tint)
    }

    private var symbol: String {
        switch state {
        case .open: return isPullRequest ? "arrow.triangle.pull" : "smallcircle.circle"
        case .closed: return "checkmark.circle"
        case .all: return "circle"
        }
    }

    private var tint: Color {
        switch state {
        case .open: return .green
        case .closed: return .purple
        case .all: return .secondary
        }
    }
}
