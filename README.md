# serverMaestro

`serverMaestro` is a Telegram bot-powered automation system designed to remotely control and manage projects on a macOS system. It combines Telegram's Bot API and desktop automation to perform a range of commands, from starting servers to updating projects via git.

## Features

- **Remote Server Control**: Start specific or all servers using pre-defined aliases.
- **Project Management**: List all managed projects, add new ones, or remove existing ones.
- **Git Integration**: Pull the latest changes for a given project.
- **Desktop Automation**: Perform a range of actions, like ending all server processes.

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
    - Update `src/config/settings.js` with your Telegram Bot Token and Chat ID.
    - Configure your projects and server aliases in `src/config/projects.json`.

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

## Security

Ensure only the predefined chat ID can control the bot to maintain security. All activities are logged for audit and debugging purposes. 

## Dependencies

Refer to the `package.json` file for the complete list of dependencies.

## Contribution & Support

For any issues, suggestions, or contributions, please open an issue in the repository.

