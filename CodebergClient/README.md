# Codeberg iOS Client

A native SwiftUI client for [Codeberg](https://codeberg.org) (and any
[Forgejo](https://forgejo.org)/Gitea instance).

This is being built in phases:

| Phase | Scope | Status |
|-------|-------|--------|
| **1** | **Issues + commenting** | ✅ Implemented |
| 2 | Pull requests & common git actions (merge, labels, close/reopen) | 🔜 Planned |
| 3 | CI / Actions status | 🔜 Planned |
| 4 | Code browsing | 🔜 Planned |
| 5 | Editing files | 🔜 Planned |

## Phase 1 features

- **Sign in** to any Forgejo/Gitea server with a personal access token, stored
  securely in the **Keychain**. Sessions are restored and re-validated on launch.
- **Repositories** tab — your repositories plus full-text repo search, with
  infinite scroll and pull-to-refresh.
- **Issues** per repository — filter by Open / Closed / All, with labels,
  author and comment counts.
- **Issue detail** — the original post and full comment thread, rendered as
  Markdown.
- **Commenting** — write and post a comment; it appears in the thread
  immediately (optimistic update).
- **My Issues** tab — a cross-repository dashboard of issues you created, are
  assigned to, or are mentioned in.
- **Settings** — account info, current server, and sign out.

## Requirements

- Xcode 16+
- iOS 17.0+ (uses the Observation framework `@Observable` and `NavigationStack`)

## Getting started

### Option A — open the checked-in project

```bash
open CodebergClient/CodebergClient.xcodeproj
```

Select the **CodebergClient** scheme and run on a simulator or device.

> If Xcode ever reports the project file is damaged (the `.pbxproj` here is
> hand-authored), regenerate it with XcodeGen using Option B — that project is
> the source of truth and includes the unit-test target.

### Option B — regenerate with XcodeGen (recommended, includes tests)

```bash
brew install xcodegen
cd CodebergClient
xcodegen generate
open CodebergClient.xcodeproj
```

`project.yml` is the canonical project definition. Regenerating with XcodeGen
also wires up the **CodebergClientTests** target.

## Getting a token

In Codeberg: **Settings → Applications → Manage Access Tokens → Generate New
Token**. Grant these scopes:

- `read:user`
- `read:repository`
- `read:issue` and `write:issue`

Paste the token (and, for a self-hosted instance, your server URL) into the
app's sign-in screen. Codeberg is the default server.

## Architecture

```
CodebergClient/
  App/                     App entry point & top-level routing
    CodebergClientApp.swift
    RootView.swift         restoring / signedOut / signedIn switch + TabView
  Core/
    Models/                Codable models (User, Repository, Issue, Comment, Label)
    Networking/            ForgejoAPI (URLSession), APIError, JSON coding, paging
    Auth/                  AuthStore (session state) + Keychain storage
    Support/               LoadState, formatting, shared SwiftUI views
  Features/
    Auth/                  LoginView
    Repos/                 RepoListView + view model
    Issues/                Issue list, detail (commenting), and cross-repo "My Issues"
    Settings/              SettingsView
```

Design notes:

- **MVVM.** Each screen has an `@MainActor @Observable` view model that talks to
  `ForgejoAPIProtocol`; views observe `LoadState` to render loading / loaded /
  error states.
- **`ForgejoAPIProtocol`** abstracts the network layer so view models are unit
  tested against `MockForgejoAPI`, and so later phases add endpoints in one place.
- **Codeberg = Forgejo API v1.** All calls target `<server>/api/v1` with a
  `token` auth header. Pagination is read from the `X-Total-Count` header and
  page-fill heuristics.
- **Extensible for later phases.** Pull requests already decode through the same
  `Issue`/state models (Phase 1 filters them out with `type=issues`); the tab bar
  and API client have obvious seams for PRs, CI, code browsing and editing.

## Tests

Unit tests live in `CodebergClientTests/` and cover model decoding, URL
normalization, request construction / auth headers (via a mocked `URLProtocol`),
and view-model behavior (comment posting, PR filtering). Run them from Xcode
(⌘U) after generating the project with XcodeGen.
