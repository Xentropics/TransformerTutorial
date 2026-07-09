import SwiftUI

struct IssueRow: View {
    let issue: Issue

    var body: some View {
        VStack(alignment: .leading, spacing: 6) {
            HStack(alignment: .top, spacing: 8) {
                Image(systemName: issue.state == .open ? "smallcircle.circle" : "checkmark.circle")
                    .foregroundStyle(issue.state == .open ? .green : .purple)
                    .font(.body)
                Text(issue.title)
                    .font(.headline)
                    .lineLimit(2)
            }

            if !issue.labels.isEmpty {
                ScrollView(.horizontal, showsIndicators: false) {
                    HStack(spacing: 6) {
                        ForEach(issue.labels) { LabelChip(label: $0) }
                    }
                }
            }

            HStack(spacing: 6) {
                Text("#\(issue.number)")
                if let login = issue.user?.login {
                    Text("• \(login)")
                }
                if let updated = issue.updatedAt {
                    Text("• \(Formatting.relative(updated))")
                }
                Spacer()
                if issue.commentsCount > 0 {
                    SwiftUI.Label("\(issue.commentsCount)", systemImage: "bubble.left")
                }
            }
            .font(.caption)
            .foregroundStyle(.secondary)
        }
        .padding(.vertical, 2)
    }
}
