# ChatGPT Theme Controller

Unlock all ChatGPT accent colors for free — a Chrome extension that removes color restrictions, giving you full control over ChatGPT's interface colors.

## Features

- 🎨 8 preset themes: Default, Blue, Green, Yellow, Pink, Orange, Purple, Black
- 🔓 Premium colors unlocked: Purple and Black are available without Plus/Pro restrictions
- 💾 Persistent settings: uses Chrome Sync Storage to keep your preferences across devices
- ⚡ Instant effect: switching themes takes effect immediately without page refresh
- 🔄 Easy toggle: one-click enable/disable to revert to the original state

## Installation

1. Download or clone this repository
2. Open Chrome and visit `chrome://extensions/`
3. Enable "Developer mode" in the top-right corner
4. Click "Load unpacked"
5. Select the project folder
6. The extension is now installed

## Usage

1. Visit [ChatGPT](https://chatgpt.com)
2. Click the extension icon in the browser toolbar
3. Toggle "Enabled" if needed
4. Pick a theme color you like
5. Optional: click "Refresh Page" to re-apply across dynamic content
6. Optional: click "Reset Settings" to clear saved preferences

## How It Works

The extension controls the theme by:

1. Applying and maintaining the `data-chat-theme` attribute on `document.documentElement`
2. Continuous enforcement using a MutationObserver plus a lightweight periodic check
3. Persisting your selection via `chrome.storage.sync`
4. Messaging between popup and content script through `chrome.runtime` to change/apply themes

## Project Structure

```
chatgpt-color/
├── manifest.json       # Extension manifest
├── content.js          # Core content script injected into the page
├── popup.html          # Extension popup UI
├── popup.js            # Popup logic
├── popup.css           # Popup styles
├── README.md           # Documentation
└── icons/              # Icon assets
    ├── icon16.png      # 16x16 icon
    ├── icon48.png      # 48x48 icon
    └── icon128.png     # 128x128 icon
```

## Notes

- The extension only takes effect on ChatGPT domains
- To restore the original theme, you can toggle the switch off or click "Reset Settings"
- Theme preferences are stored locally (Chrome Sync), and do not change your ChatGPT account settings on the server

## Changelog

- 2025-08-11
  - add icon (ca3e386)
  - add logo (17694ce)
  - update .gitignore (ca56c18)
- 2025-08-10
  - redesign popup UI; simplify theme control; remove unsupported red theme (b5a33d6)
  - refresh UI with neutral palette, compact spacing, and clearer states (ca599f6)
  - style(popup.css): set `.theme-option` label text color to white for better contrast (147dcff)
  - add .gitignore (effc17c)

## License

MIT