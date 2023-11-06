// Filename: shortcuts.js

const {
    keyboard,
    Key
} = require('@nut-tree/nut-js');

function delay(duration) {
    return new Promise(resolve => setTimeout(resolve, duration));
}

const openTerminalAndRun = async (alias) => {
    // Create a mutable copy to modify
    let executableAlias = alias;

    // Check if alias ends with a '/', suggesting it's a directory path
    if (executableAlias.endsWith('/')) {
        // Handle directories differently, appending 'npm start' for demonstration purposes
        executableAlias += 'npm start';
    }

    // Open terminal using Spotlight (Cmd + Space)
    await keyboard.pressKey(Key.LeftSuper, Key.Space);
    await keyboard.releaseKey(Key.LeftSuper, Key.Space);

    await keyboard.type("iterm");
    await keyboard.pressKey(Key.Enter);
    await keyboard.releaseKey(Key.Enter);

    await keyboard.pressKey(Key.LeftSuper, Key.T);
    await keyboard.releaseKey(Key.LeftSuper, Key.T);

    // Wait for terminal to open (this delay may need to be adjusted)
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Type in the executableAlias and execute it
    await keyboard.type(executableAlias);
    await keyboard.type(Key.Enter);
};

// Added function to perform the restart sequence
const restartSequence = async () => {
    // Quit iTerm (Cmd + Q)
    // await keyboard.pressKey(Key.LeftSuper, Key.Q);
    // await keyboard.releaseKey(Key.LeftSuper, Key.Q);

    // // Need to press enter to confirm quit, if required
    // await keyboard.pressKey(Key.Enter);
    // await keyboard.releaseKey(Key.Enter);

    // // Open Spotlight search (Cmd + Space)
    // await keyboard.pressKey(Key.LeftSuper, Key.Space);
    // await keyboard.releaseKey(Key.LeftSuper, Key.Space);

    // // Wait for Spotlight to open
    // await delay(500);  // Delay might need to be adjusted based on system speed

    // // Type 'iterm' to open iTerm
    // await keyboard.type('iterm');
    // await keyboard.pressKey(Key.Enter);
    // await keyboard.releaseKey(Key.Enter);

    // // Wait for iTerm to open
    // await delay(1000);  // Delay might need to be adjusted based on system speed

    // // Type the alias for serverMaestro and press enter
    // await keyboard.type('cd ~/projects/serverMaestro && npm start');
    // await keyboard.pressKey(Key.Enter);
    // await keyboard.releaseKey(Key.Enter);
};

module.exports = {
    openTerminalAndRun,
    restartSequence  // Export the new function
};
