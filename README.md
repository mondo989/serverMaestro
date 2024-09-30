# serverMaestro

`serverMaestro` is a Telegram bot-powered automation system designed to remotely control and manage projects on a macOS system. It combines Telegram's Bot API and desktop automation to perform a range of commands, from starting servers to updating projects via git.

## Features

- **Remote Server Control**: Start specific or all servers using pre-defined aliases.
- **Project Management**: List all managed projects, add new ones, or remove existing ones.
- **Git Integration**: Pull the latest changes for a given project.
- **Desktop Automation**: Perform a range of actions, like ending all server processes.
- **Speech Recognition (Vosk)**: Integrated with Vosk for speech-to-text functionality.
- **Siri Shortcuts Integration**: Uses macOS Shortcuts to automate system tasks.
- **OCR Integration**: Tesseract.js is used for Optical Character Recognition (OCR) on screen content.
- **Custom Automation**: Use scripts for custom automation and home management.

## Setup

1. **Clone the Repository**:
    ```bash
    git clone [repository-link] serverMaestro
    cd serverMaestro
    ```

2. **Install Dependencies**:
    ```bash
    npm install
    ```

3. **Configuration**:
    - Update `src/config/settings.js` with your Telegram Bot Token, Chat ID, and other configuration details.
    - Configure your projects and server aliases in `src/config/projects.json`.
    - Set up environment variables by creating a `.env` file in the root directory (e.g., Telegram bot token, Vosk model paths, etc.).

4. **Running the Bot**:
    ```bash
    npm start
    ```

## Commands

- **/server [serverName]**: Start the specified server.
- **/server runAll**: Start all servers in separate terminal tabs.
- **/server listAll**: List all managed servers and projects.
- **/server add [newProject]**: Add a new project to the management list.
- **/server remove [existingProject]**: Remove a project from the management list.
- **/server endAll**: Close the terminal, effectively ending all running servers.
- **/server [existingProject] pull**: Pull the latest updates for the specified project from GitHub.
- **/readScreen**: Capture the screen content and perform OCR using Tesseract.js.
- **/lights on/off**: Trigger Siri Shortcuts to control lights or other smart home devices.
- **/custom [script]**: Run a custom automation script from the automation directory.

## Speech Recognition

Vosk is integrated for speech-to-text functionality, allowing the system to respond to voice commands.

- **/speech start**: Begin listening for specific commands like "Turn off the lights" or "Start the server."
- **Wake Words**: `"Hey Genesis"`, `"Hey Jarvis"`

## OCR Functionality

The `/readScreen` command can be used to process the content on the screen via Tesseract.js.

## Siri Shortcuts Integration

Control macOS-specific automation tasks using Siri Shortcuts with commands like:
- **/lights on/off**: Runs the "Wakeup" or "Sleep" Siri Shortcuts.

## Security

Ensure only the predefined chat ID can control the bot to maintain security. All activities are logged for audit and debugging purposes. 

## Dependencies

Refer to the `package.json` file for the complete list of dependencies, which includes:
- **Vosk**: Speech recognition
- **Tesseract.js**: OCR functionality
- **Siri Shortcuts**: macOS automation
- **Telegram Bot API**: Communication

## Contribution & Support

For any issues, suggestions, or contributions, please open an issue in the repository.
