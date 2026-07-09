import SwiftUI

@main
struct CodebergClientApp: App {
    @State private var auth = AuthStore()

    var body: some Scene {
        WindowGroup {
            RootView()
                .environment(auth)
                .task {
                    if case .restoring = auth.state {
                        await auth.restore()
                    }
                }
        }
    }
}
