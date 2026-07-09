import Foundation
import SwiftUI

/// An issue/PR label.
struct Label: Codable, Identifiable, Hashable {
    let id: Int
    let name: String
    /// Hex color without the leading `#`, e.g. `"00aabb"`.
    let color: String
    let description: String?

    /// The label color parsed into a SwiftUI `Color`. Falls back to gray.
    var swiftUIColor: Color {
        Color(hex: color) ?? .gray
    }
}

extension Color {
    /// Creates a color from a hex string such as `"ff8800"` or `"#ff8800"`.
    init?(hex: String) {
        var string = hex.trimmingCharacters(in: .whitespacesAndNewlines)
        if string.hasPrefix("#") { string.removeFirst() }
        guard string.count == 6, let value = UInt32(string, radix: 16) else { return nil }
        let r = Double((value & 0xFF0000) >> 16) / 255.0
        let g = Double((value & 0x00FF00) >> 8) / 255.0
        let b = Double(value & 0x0000FF) / 255.0
        self = Color(red: r, green: g, blue: b)
    }

    /// Returns a legible foreground color (black or white) for text on top of this label color.
    static func readableForeground(onHex hex: String) -> Color {
        var string = hex.trimmingCharacters(in: .whitespacesAndNewlines)
        if string.hasPrefix("#") { string.removeFirst() }
        guard string.count == 6, let value = UInt32(string, radix: 16) else { return .primary }
        let r = Double((value & 0xFF0000) >> 16) / 255.0
        let g = Double((value & 0x00FF00) >> 8) / 255.0
        let b = Double(value & 0x0000FF) / 255.0
        // Perceived luminance.
        let luminance = 0.299 * r + 0.587 * g + 0.114 * b
        return luminance > 0.6 ? .black : .white
    }
}
