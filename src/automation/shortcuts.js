const { keyboard, Key } = require('@nut-tree/nut-js');

const openTerminalAndRun = async (alias) => {
    // Open terminal and type in the alias using nut.js

    // Open terminal using Spotlight (Cmd + Space)
    await keyboard.type(Key.LeftSuper, Key.Space);
    await keyboard.type("terminal");
    await keyboard.type(Key.Enter);
    
    // Wait for terminal to open (this delay may need to be adjusted)
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Type in the alias and execute it
    await keyboard.type(alias);
    await keyboard.type(Key.Enter);
};

module.exports = {
    openTerminalAndRun
};
