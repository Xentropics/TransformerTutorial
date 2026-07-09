import SwiftUI

struct SettingsView: View {
    @Environment(AuthStore.self) private var auth
    @State private var showingSignOutConfirmation = false

    var body: some View {
        NavigationStack {
            List {
                if let user = auth.currentUser {
                    Section {
                        HStack(spacing: 12) {
                            AvatarView(urlString: user.avatarURL, fallbackText: user.login, size: 52)
                            VStack(alignment: .leading, spacing: 2) {
                                Text(user.displayName)
                                    .font(.headline)
                                Text("@\(user.login)")
                                    .font(.subheadline)
                                    .foregroundStyle(.secondary)
                            }
                        }
                        .padding(.vertical, 4)
                    }
                }

                Section("Instance") {
                    LabeledContent("Server", value: auth.credentials?.serverURL.host ?? "—")
                }

                Section {
                    Button(role: .destructive) {
                        showingSignOutConfirmation = true
                    } label: {
                        SwiftUI.Label("Sign Out", systemImage: "rectangle.portrait.and.arrow.right")
                    }
                }

                Section {
                    LabeledContent("Version", value: Self.appVersion)
                } footer: {
                    Text("A Codeberg client. Phase 1: Issues & comments.")
                }
            }
            .navigationTitle("Settings")
            .confirmationDialog(
                "Sign out of Codeberg?",
                isPresented: $showingSignOutConfirmation,
                titleVisibility: .visible
            ) {
                Button("Sign Out", role: .destructive) { auth.signOut() }
                Button("Cancel", role: .cancel) {}
            }
        }
    }

    private static var appVersion: String {
        let version = Bundle.main.infoDictionary?["CFBundleShortVersionString"] as? String ?? "1.0"
        let build = Bundle.main.infoDictionary?["CFBundleVersion"] as? String ?? "1"
        return "\(version) (\(build))"
    }
}
