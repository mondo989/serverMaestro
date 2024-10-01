# serverMaestro

`serverMaestro` is a Telegram bot-powered automation system built for remote management of projects and servers on macOS. It leverages the Telegram Bot API for command execution, nut.js for desktop automation, Vosk for speech recognition, and Mimic3 TTS for voice feedback. With integrated Git management and custom automation scripts, serverMaestro simplifies tasks like starting servers, updating projects via Git, and automating media playback (e.g., YouTube) for alarms or notifications.
## Features

## Features

- **Remote Server Control**: Start specific or all servers using pre-defined aliases.
- **Project & Git Management**: Manage projects, list, add, or remove them, and pull the latest changes using Git.
- **Desktop Automation**: Use scripts for custom actions like ending server processes or automating tasks via macOS Shortcuts.
- **Speech Recognition (Vosk)**: Integrated with Vosk for speech-to-text functionality.
- **Alarm Clock**: Play a YouTube video using **nut.js** for automation.
- **Text-to-Speech (TTS)**: Provides voice feedback or audio prompts via Mimic3 TTS.
- **Media Integration**: Automatically play media (YouTube) for alarms or notifications.

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
- **/lights on/off**: Trigger Siri Shortcuts to control lights or other smart home devices.
- **/custom [script]**: Run a custom automation script from the automation directory.

## Speech Recognition

Vosk is integrated for speech-to-text functionality, allowing the system to respond to voice commands.

- **/speech start**: Begin listening for specific commands like "Turn off the lights" or "Start the server."
- **Wake Words**: `"Hey Genesis"`, `"Hey Jarvis"`

## Siri Shortcuts Integration

Control macOS-specific automation tasks using Siri Shortcuts with commands like:
- **/lights on/off**: Runs the "Wakeup" or "Sleep" Siri Shortcuts.

## Security

Ensure only the predefined chat ID can control the bot to maintain security. All activities are logged for audit and debugging purposes. 

## Dependencies

Refer to the `package.json` file for the complete list of dependencies, which includes:
- **Vosk**: Speech recognition
- **Siri Shortcuts**: macOS automation
- **Telegram Bot API**: Communication

## Contribution & Support

For any issues, suggestions, or contributions, please open an issue in the repository.
