# Drew's Browser

Made by Drew. A small, no-frills web browser for Windows 11 built on Chromium (via Electron).
It is not pretty, but it works: tabs, bookmarks, history, downloads, find in
page, zoom, private windows, and tracking protection that is on by default.

## Features

**Browsing**
- Tabs: open, close, reorder by drag, middle-click to close, right-click menu
  (duplicate, mute, close others / to the right, reopen closed tab)
- Address bar with search-or-URL detection and suggestions from history and
  bookmarks (DuckDuckGo by default; Brave, Startpage, Google, Bing or custom)
- Back / forward / reload / stop / home, mouse back-forward buttons, zoom,
  find in page, print, full screen, developer tools
- Bookmarks with a bookmarks bar, folders, a manager page, and HTML
  import/export compatible with Chrome, Edge and Firefox
- History page with search and clearing by time range
- Downloads with progress, pause/resume/cancel, "show in folder"
- Private windows (nothing is written to disk when the window closes)
- Restores your open tabs on the next start
- Right-click context menus for links, images, media, text and forms
- Internal pages: `drew://newtab`, `drew://bookmarks`,
  `drew://history`, `drew://downloads`, `drew://settings`

**Privacy and security (all can be changed in Settings)**
- Tracker and ad blocking: a built-in list of ~275 advertising/analytics
  domains plus first-party tracking endpoints, extended by a remote hosts list
  (Peter Lowe's ad-server list by default) that is refreshed every few days.
  The shield button shows what was blocked on the current page and lets you
  turn protection off for a single site.
- Third-party cookies are blocked (both sending and setting)
- Tracking parameters (`utm_*`, `fbclid`, `gclid`, `msclkid`, ...) are
  stripped from the addresses you open
- `http://` navigations are upgraded to `https://`, falling back only when the
  secure version fails
- Sends `DNT: 1` and `Sec-GPC: 1` (Global Privacy Control) on every request
- Camera, microphone, location, notifications, clipboard reading and screen
  capture ask you first; USB/HID/serial/Bluetooth access is denied
- Invalid certificates cannot be bypassed
- Pop-ups open as tabs; links to other apps (`mailto:`, `ms-settings:`, ...)
  ask before leaving the browser
- Every web page runs sandboxed with context isolation and no Node access;
  the browser's own pages run under a strict Content Security Policy
- Chromium's ad-tech APIs (Topics, Attribution Reporting, Privacy Sandbox)
  are disabled, and the user agent does not reveal Electron
- No telemetry, no accounts, no cloud sync

## Build on Windows 11

Requirements: [Node.js](https://nodejs.org) 20 or newer (LTS is fine).

```powershell
cd browser
npm install
npm start          # run the browser directly from source
npm run dist       # build release\Drew's Browser Setup 0.1.0.exe and a portable .exe
```

`npm run dist` writes two files into `browser\release\`:

- `Drew's Browser Setup 0.1.0.exe` – a normal installer (adds a Start menu
  entry, lets you pick the folder, uninstalls from Settings > Apps)
- `Drew's Browser 0.1.0.exe` – a portable build that runs from anywhere

The installer is unsigned, so Windows SmartScreen will show "Windows protected
your PC" the first time; click *More info > Run anyway*.

## Test

```powershell
npm test
```

Starts the real browser against a throwaway local web server and checks tabs,
internal pages, tracker blocking, header hardening, parameter stripping,
bookmarks, history, find in page, downloads, private windows and session
restore (49 checks). On Linux it runs under `xvfb-run` automatically.

## Keyboard shortcuts

| Keys | Action |
| --- | --- |
| Ctrl+T / Ctrl+W / Ctrl+Shift+T | New tab / close tab / reopen closed tab |
| Ctrl+Tab, Ctrl+Shift+Tab, Ctrl+1…9 | Switch tabs |
| Ctrl+N / Ctrl+Shift+N | New window / new private window |
| Ctrl+L, Alt+D, F6 | Focus the address bar |
| Alt+Left / Alt+Right | Back / forward |
| F5, Ctrl+R / Ctrl+Shift+R | Reload / reload ignoring cache |
| Ctrl+D / Ctrl+Shift+B | Bookmark page / toggle bookmarks bar |
| Ctrl+H / Ctrl+J | History / downloads |
| Ctrl+F | Find in page |
| Ctrl+P | Print |
| Ctrl++ / Ctrl+- / Ctrl+0 | Zoom |
| F11 / F12 | Full screen / developer tools |
| Ctrl+Shift+Delete | Clear browsing data |

## Layout

```
main/        Electron main process
  main.js        startup, global navigation policy, certificate policy
  windows.js     BaseWindow + one WebContentsView per tab, shortcuts, state sync
  privacy.js     tracker blocking, cookie/header rules, HTTPS upgrade, param stripping
  sessions.js    permission prompts, device access policy, user agent
  downloads.js   download tracking
  protocol.js    the drew:// scheme
  context-menu.js, ipc.js, store.js, urls.js, bookmarks-io.js, app-state.js
preload/     contextBridge APIs for the toolbar UI and the internal pages
ui/          tab strip, toolbar, bookmarks bar, find bar, popups
pages/       new tab, bookmarks, history, downloads, settings, error, about
data/        built-in tracker list (trackers.json)
build/       icon (regenerate with `node build/make-icon.js`)
```

Data lives in `%APPDATA%\Drew's Browser\` (settings, bookmarks, history,
downloads list, saved permissions, cached remote blocklist).
