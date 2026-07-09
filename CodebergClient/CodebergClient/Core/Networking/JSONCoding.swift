import Foundation

/// JSON decoders/encoders configured for the Forgejo API.
enum JSONCoding {
    /// Forgejo emits RFC3339 timestamps, sometimes with fractional seconds and varying
    /// timezone offsets. `ISO8601DateFormatter` with a couple of option sets covers the cases.
    static let decoder: JSONDecoder = {
        let decoder = JSONDecoder()
        let withFractional = ISO8601DateFormatter()
        withFractional.formatOptions = [.withInternetDateTime, .withFractionalSeconds]
        let plain = ISO8601DateFormatter()
        plain.formatOptions = [.withInternetDateTime]

        decoder.dateDecodingStrategy = .custom { decoder in
            let container = try decoder.singleValueContainer()
            let string = try container.decode(String.self)
            if let date = withFractional.date(from: string) ?? plain.date(from: string) {
                return date
            }
            // Forgejo uses "0001-01-01T00:00:00Z" as a null-ish sentinel for empty dates.
            throw DecodingError.dataCorruptedError(
                in: container,
                debugDescription: "Unrecognized date format: \(string)"
            )
        }
        return decoder
    }()

    static let encoder: JSONEncoder = {
        let encoder = JSONEncoder()
        encoder.dateEncodingStrategy = .iso8601
        return encoder
    }()
}
