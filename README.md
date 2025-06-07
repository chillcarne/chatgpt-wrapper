# ChatGPT Wrapper
Electron wrapper for ChatGPT (https://chat.openai.com)

## Features

#### Startup
- **Temporary chat by default**  
  Launches ChatGPT in temporary chat mode by appending `?temporary-chat=true` to the URL.  
  The setting is saved between sessions but applied **only when the app starts**.

- **Default model selection on launch**  
  Choose a default GPT model to load on startup by appending `?model=...` to the URL.  
  Available models:
  
  - Default model  
  - GPT-4o  
  - GPT-o3  
  - GPT-o4-mini  
  - GPT-o4-mini-high  
  - GPT-4-5  
  - GPT-4-1  
  - GPT-4-1-mini  
  
  Like temporary chat, this setting is saved but only applied **on app startup**.

- **Open external links in default browser**  
  When enabled, any link that points to a domain outside the app’s internal domains will open in your system’s default web browser instead of within the app window.  
  This setting is saved and applied immediately.  
  The list of internal domains can be modified manually in the configuration file (`settings.json`).

> ℹ️ Press `Alt` to open the settings menu.

## Installation

Download prebuilt installers from the [Releases page](https://github.com/chillcarne/chatgpt-wrapper/releases):

- Windows: `.exe` installer
- Linux: `.deb` package

> ℹ️ For other distributions (macOS, Fedora, Arch, etc.), build from source.

## Building from source

Make sure you have the following installed:

- Node.js
- npm
- Git

Then clone and install dependencies:

```bash
git clone https://github.com/chillcarne/chatgpt-wrapper.git
cd chatgpt-wrapper
npm install
```

**Run in development mode**

```bash
npm start
```

## Create distribution builds

Platform-specific builds are created with:


#### Windows
```bash
npm run dist-windows
```

#### Linux (DEB)
```bash
npm run dist-linux
```

#### macOS
```bash
npm run dist-macos
```
> ⚠️ **Note**: macOS builds have not been tested. Use at your own risk or build from source if needed.

#### All platforms (if supported on your system)
```bash
npm run dist-all
```

## Project structure

`main.js` — Main entry point for the Electron app

`resources/icon.*` — Platform-specific icons

`settings.json` — Saved in the user data directory (app.getPath('userData')), stores app preferences like window state, last URL, etc.

## Authors

[@Chillcarne](https://github.com/chillcarne/chatgpt-wrapper)
## License

This project is licensed under the [MIT License](https://choosealicense.com/licenses/mit/). See the `LICENSE` file for more details.
