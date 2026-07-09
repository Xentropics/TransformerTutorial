import SwiftUI

struct LoginView: View {
    @Environment(AuthStore.self) private var auth

    @State private var serverURL = AuthStore.defaultServerURLString
    @State private var token = ""
    @FocusState private var tokenFocused: Bool

    var body: some View {
        NavigationStack {
            Form {
                Section {
                    VStack(spacing: 8) {
                        Image(systemName: "mountain.2.fill")
                            .font(.system(size: 44))
                            .foregroundStyle(.tint)
                        Text("Codeberg")
                            .font(.title.bold())
                        Text("Sign in with a personal access token")
                            .font(.subheadline)
                            .foregroundStyle(.secondary)
                    }
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 8)
                    .listRowBackground(Color.clear)
                }

                Section("Server") {
                    TextField("https://codeberg.org", text: $serverURL)
                        .textInputAutocapitalization(.never)
                        .autocorrectionDisabled()
                        .keyboardType(.URL)
                        .submitLabel(.next)
                        .onSubmit { tokenFocused = true }
                }

                Section {
                    SecureField("Personal access token", text: $token)
                        .textInputAutocapitalization(.never)
                        .autocorrectionDisabled()
                        .focused($tokenFocused)
                        .submitLabel(.go)
                        .onSubmit(signIn)
                } header: {
                    Text("Access Token")
                } footer: {
                    tokenHelp
                }

                if let error = auth.signInError {
                    Section {
                        SwiftUI.Label(error, systemImage: "exclamationmark.triangle.fill")
                            .font(.footnote)
                            .foregroundStyle(.red)
                    }
                }

                Section {
                    Button(action: signIn) {
                        HStack {
                            Spacer()
                            if auth.isSigningIn {
                                ProgressView()
                            } else {
                                Text("Sign In").bold()
                            }
                            Spacer()
                        }
                    }
                    .disabled(auth.isSigningIn || token.isEmpty)
                }
            }
            .navigationTitle("Sign In")
            .navigationBarTitleDisplayMode(.inline)
        }
    }

    private var tokenHelp: some View {
        VStack(alignment: .leading, spacing: 6) {
            Text("Create a token in Codeberg under Settings → Applications. Grant these scopes:")
            Text("• read:user\n• read:repository\n• read:issue and write:issue")
                .font(.footnote.monospaced())
            if let url = tokenSettingsURL {
                Link("Open token settings", destination: url)
                    .font(.footnote)
            }
        }
    }

    private var tokenSettingsURL: URL? {
        guard let base = AuthStore.normalizedURL(from: serverURL) else { return nil }
        return base.appendingPathComponent("user/settings/applications")
    }

    private func signIn() {
        Task { await auth.signIn(serverURLString: serverURL, token: token) }
    }
}
