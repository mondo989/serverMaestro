// Filename: shortcuts.js

const { keyboard, Key } = require('@nut-tree/nut-js');

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

module.exports = {
    openTerminalAndRun
};
