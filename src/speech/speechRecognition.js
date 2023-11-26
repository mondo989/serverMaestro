const VoskService = require('./VoskService');
const AudioProcessor = require('./AudioProcessor');
const AudioPlayer = require('./AudioPlayer');

const modelPath = './models/vosk-model';
const chimePath = './sounds/bottle.aiff';
const chimePath2 = './sounds/response.mp3';
const successChimePath = './sounds/accepted.aiff';
const failureChimePath = './sounds/rejected.aiff';
const acceptedCommands = ['start chrome', 'end chrome'];

let isListening = false;

const startSpeechRecognition = async () => {
    if (isListening) return;
    isListening = true;

    const voskService = new VoskService(modelPath);
    const audioProcessor = new AudioProcessor();
    const audioPlayer = new AudioPlayer(chimePath);
    const audioPlayer2 = new AudioPlayer(chimePath2);
    const successChimePlayer = new AudioPlayer(successChimePath);
    const failureChimePlayer = new AudioPlayer(failureChimePath);

    try {
        await voskService.init();
        voskService.createRecognizer();

        const audioStream = audioProcessor.getAudioStream();
        console.log("Listening for commands...");

        let isTriggered = false;

        audioStream.on('data', (data) => {
            if (voskService.recognizer.acceptWaveform(data)) {
              let result = voskService.recognizer.result();
              console.log(result.text);
      
              if (!isTriggered && result.text.toLowerCase().includes('hey jarvis')) {
                console.log('Hey Jarvis heard - waiting for command');
                audioPlayer.play();
                isTriggered = true;
              } else if (isTriggered) {
                const command = result.text.toLowerCase().trim();
                if (acceptedCommands.includes(command)) {
                  console.log(`Executing command: ${command}`);
                  executeCommand(command); // Execute the command logic
                  successChimePlayer.play();
                } else {
                  console.log(`Unknown command: ${command}`);
                  failureChimePlayer.play();
                }
                isTriggered = false; // Reset trigger for next command
              } else if (!isTriggered && result.text.toLowerCase().includes('teen teen')) {
                console.log('Hey Jarvis heard - waiting for command');
                audioPlayer2.play();
                isTriggered = true;
              } else if (isTriggered) {
                const command = result.text.toLowerCase().trim();
                if (acceptedCommands.includes(command)) {
                  console.log(`Executing command: ${command}`);
                  executeCommand(command); // Execute the command logic
                  successChimePlayer.play();
                } else {
                  console.log(`Unknown command: ${command}`);
                  failureChimePlayer.play();
                }
                isTriggered = false; // Reset trigger for next command
              }
              else if (!isTriggered && result.text.toLowerCase().includes('baby')) {
                console.log('Hey Jarvis heard - waiting for command');
                audioPlayer2.play();
                isTriggered = true;
              } else if (isTriggered) {
                const command = result.text.toLowerCase().trim();
                if (acceptedCommands.includes(command)) {
                  console.log(`Executing command: ${command}`);
                  executeCommand(command); // Execute the command logic
                  successChimePlayer.play();
                } else {
                  console.log(`Unknown command: ${command}`);
                  failureChimePlayer.play();
                }
                isTriggered = false; // Reset trigger for next command
              }
            }
          });

        audioStream.on('end', () => {
            let finalText = voskService.recognizer.finalResult().text;
            console.log('Final recognized text:', finalText);
            isListening = false;
        });

        audioStream.on('error', (err) => {
            console.error('Error:', err);
            isListening = false;
        });

    } catch (error) {
        console.error('Error:', error.message);
        isListening = false;
    }
};

const stopSpeechRecognition = () => {
    if (!isListening) return;
    isListening = false;
    // Logic to stop the audio stream and clean up resources
};

const executeCommand = (text) => {
    // Extract and execute commands from the recognized text
    // This function needs to be implemented based on your command handling logic
};

module.exports = {
    startSpeechRecognition,
    stopSpeechRecognition
};
