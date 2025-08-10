# ChatGPT Theme Controller

A Chrome extension to customize ChatGPT's theme. It overrides server-side theme settings so you have full control over ChatGPT's interface colors.

## Features

- 🎨 9 preset themes: Default, Blue, Green, Yellow, Pink, Orange, Black, Purple, Red
- 🔒 Fully override server settings: intercept all theme-related operations to prevent overrides
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
3. Pick a theme color you like
4. The theme applies instantly

## How It Works

The extension controls the theme by:

1. Intercepting DOM attributes: observing and overriding `document.documentElement.dataset.chatTheme`
2. Intercepting localStorage: reading/writing theme-related keys to enforce your selection
3. Intercepting API requests: preventing theme settings from syncing to the server
4. Continuous monitoring: using MutationObserver to enforce the selected theme

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

## License

MIT