import Foundation
import Observation

/// Owns the app's authentication state and the shared `ForgejoAPI` instance.
///
/// Injected into the SwiftUI environment; features read `api` from it and observe
/// `state` to decide whether to show the login screen or the main UI.
@MainActor
@Observable
final class AuthStore {
    enum State: Equatable {
        case restoring
        case signedOut
        case signedIn(User)
    }

    private(set) var state: State = .restoring
    /// Non-nil error shown on the login screen after a failed sign-in.
    var signInError: String?
    private(set) var isSigningIn = false

    /// Shared API client. Its credentials mirror the signed-in session.
    let api: ForgejoAPIProtocol

    /// Default Codeberg instance offered on the login screen.
    static let defaultServerURLString = "https://codeberg.org"

    init(api: ForgejoAPIProtocol = ForgejoAPI()) {
        self.api = api
    }

    var currentUser: User? {
        if case let .signedIn(user) = state { return user }
        return nil
    }

    var credentials: Credentials? { api.credentials }

    /// Restores a previously saved session from the Keychain, validating the token.
    func restore() async {
        guard let data = KeychainHelper.load(),
              let credentials = try? JSONCoding.decoder.decode(Credentials.self, from: data) else {
            state = .signedOut
            return
        }
        api.credentials = credentials
        do {
            let user = try await api.currentUser()
            state = .signedIn(user)
        } catch {
            // Token no longer valid or offline; fall back to signed out but keep the
            // stored credentials so an offline launch doesn't silently wipe them.
            if case APIError.unauthorized = error {
                KeychainHelper.delete()
                api.credentials = nil
            }
            state = .signedOut
        }
    }

    /// Signs in with the given server URL and personal access token.
    func signIn(serverURLString: String, token: String) async {
        signInError = nil
        isSigningIn = true
        defer { isSigningIn = false }

        let trimmedServer = serverURLString.trimmingCharacters(in: .whitespacesAndNewlines)
        let trimmedToken = token.trimmingCharacters(in: .whitespacesAndNewlines)

        guard !trimmedToken.isEmpty else {
            signInError = "Please enter a personal access token."
            return
        }
        guard let url = Self.normalizedURL(from: trimmedServer) else {
            signInError = "Please enter a valid server URL."
            return
        }

        let credentials = Credentials(serverURL: url, token: trimmedToken)
        api.credentials = credentials
        do {
            let user = try await api.currentUser()
            try? persist(credentials)
            state = .signedIn(user)
        } catch {
            api.credentials = nil
            signInError = (error as? LocalizedError)?.errorDescription ?? error.localizedDescription
        }
    }

    func signOut() {
        KeychainHelper.delete()
        api.credentials = nil
        state = .signedOut
    }

    // MARK: - Helpers

    private func persist(_ credentials: Credentials) throws {
        let data = try JSONCoding.encoder.encode(credentials)
        try KeychainHelper.save(data)
    }

    /// Normalizes user input into an `https` base URL, defaulting the scheme when omitted.
    static func normalizedURL(from string: String) -> URL? {
        var text = string.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !text.isEmpty else { return nil }
        if !text.contains("://") {
            text = "https://" + text
        }
        // Drop a trailing slash and any accidental /api/v1 suffix the user pasted.
        while text.hasSuffix("/") { text.removeLast() }
        if text.hasSuffix("/api/v1") {
            text.removeLast("/api/v1".count)
        }
        guard let url = URL(string: text), url.host != nil else { return nil }
        return url
    }
}
