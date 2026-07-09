import Foundation

enum Formatting {
    private static let relativeFormatter: RelativeDateTimeFormatter = {
        let formatter = RelativeDateTimeFormatter()
        formatter.unitsStyle = .abbreviated
        return formatter
    }()

    /// Human-readable relative string such as "3d ago", using a fixed reference for testability.
    static func relative(_ date: Date?, now: Date = Date()) -> String {
        guard let date else { return "" }
        return relativeFormatter.localizedString(for: date, relativeTo: now)
    }
}
