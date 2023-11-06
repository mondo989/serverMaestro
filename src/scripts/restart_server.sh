#!/bin/bash

# Define the path to the lock file and the server directory
LOCK_FILE="/tmp/serverMaestro.lock"
SERVER_DIR="~/projects/serverMaestro" # Using home directory shortcut

# Function to check if the server is running
is_server_running() {
  if [ -f "$LOCK_FILE" ]; then
    return 0
  else
    return 1
  fi
}

# Function to start the server
start_server() {
  cd "$SERVER_DIR"
  nohup npm start > /dev/null 2>&1 &
  echo $! > "$LOCK_FILE"
}

# Function to stop the server
stop_server() {
  if is_server_running; then
    kill $(cat "$LOCK_FILE")
    rm "$LOCK_FILE"
  fi
}

# Restart the server
stop_server
start_server
