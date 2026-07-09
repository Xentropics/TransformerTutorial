import SwiftUI

/// Switches between the launch splash, the login flow, and the signed-in app.
struct RootView: View {
    @Environment(AuthStore.self) private var auth

    var body: some View {
        switch auth.state {
        case .restoring:
            LaunchView()
        case .signedOut:
            LoginView()
        case .signedIn:
            MainTabView()
        }
    }
}

/// Simple branded splash shown while the stored session is validated.
struct LaunchView: View {
    var body: some View {
        VStack(spacing: 16) {
            Image(systemName: "mountain.2.fill")
                .font(.system(size: 52))
                .foregroundStyle(.tint)
            ProgressView()
        }
    }
}

/// Top-level tab layout. Phase 1 ships Repositories, My Issues and Settings.
/// Future phases add Pull Requests, CI and Code tabs here.
struct MainTabView: View {
    var body: some View {
        TabView {
            RepoListView()
                .tabItem { SwiftUI.Label("Repositories", systemImage: "folder") }

            MyIssuesView()
                .tabItem { SwiftUI.Label("Issues", systemImage: "smallcircle.circle") }

            SettingsView()
                .tabItem { SwiftUI.Label("Settings", systemImage: "gearshape") }
        }
    }
}
