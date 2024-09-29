// src/bot/speechRecognition.js

const VoskService = require('./VoskService');
const AudioProcessor = require('./AudioProcessor');
const AudioPlayer = require('./AudioPlayer');
const ttsService = require('./ttsService');
const { gotoWebsiteForLightControl } = require('../automation/shortcuts');

const modelPath = './models/vosk-model--sm';
const chimePath = './sounds/bottle.aiff';
const chimePath2 = './sounds/response.mp3';
const successChimePath = './sounds/accepted.aiff';
const failureChimePath = './sounds/rejected.aiff';
const acceptedCommands = ['end', 'and', 'end chrome'];

let isListening = false;
let isTriggered = false; // This will become true after attention word is detected
let isSpeaking = false;
let mode = 'Listening'; // Default mode is listening, switch to 'Processing' when attention phrase is spoken
let commandTimeout; // To reset the attention after inactivity

// Define AudioPlayer instances at a higher scope to make them accessible throughout the file
const audioPlayer = new AudioPlayer(chimePath);
const audioPlayer2 = new AudioPlayer(chimePath2);
const successChimePlayer = new AudioPlayer(successChimePath);
const failureChimePlayer = new AudioPlayer(failureChimePath);

const resetAlarmSettings = () => {
  alarmTime = '';
  alarmMusic = '';
};

const genesisResponses = [
  "Genesis is here",
  "At your service",
  "How can I assist?",
  "Ready to help",
  "Hello, how may I assist you today?",
  "Greetings! Genesis at your command.",
  "Welcome! What can I do for you?",
  "G-G's in the Chat.",
  "Let's Go.",
  "Hi there!?",
  "Welcome back?",
];

// Reset to 'Listening' mode after a certain time of inactivity
const resetListeningMode = () => {
  isTriggered = false;
  mode = 'Listening';
  console.log("Switching back to Listening mode.");
};

const startSpeechRecognition = async () => {
  if (isListening) return;
  isListening = true;

  const voskService = new VoskService(modelPath);
  const audioProcessor = new AudioProcessor();

  try {
    await voskService.init();
    voskService.createRecognizer();

    const audioStream = audioProcessor.getAudioStream();
    console.log("Listening for commands...");

    audioStream.on('data', (data) => {
      if (isSpeaking) return;

      if (voskService.recognizer.acceptWaveform(data)) {
        let result = voskService.recognizer.result();
        console.log(`Recognized text: ${result.text}`); // Log recognized text

        if (result.text.toLowerCase().includes('hey jarvis')) {
          console.log("Attention phrase 'hey Jarvis' detected. Switching to Processing mode.");
          ttsService.speak("Yes, how can I help?");
          isTriggered = true;
          mode = 'Processing';

          // Reset command mode after 10 seconds of inactivity
          if (commandTimeout) clearTimeout(commandTimeout);
          commandTimeout = setTimeout(resetListeningMode, 10000); // 10 seconds timeout for processing commands
        } else if (mode === 'Processing') {
          console.log(`Processing command: ${result.text.toLowerCase()}`); // Log command processing
          processCommand(result.text.toLowerCase());

          // Reset attention after processing a command
          isTriggered = false;
          mode = 'Listening';
        } else {
          console.log(`Listening mode: ${result.text}`); // Log in listening mode
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
};

const processCommand = (command) => {
  console.log(`Received command: ${command}`); // Add logging for debugging

  // Check for stopping active mode first
  if (command.includes('stop active mode')) {
    mode = 'Listening';
    ttsService.speak("Okay then, switching back to listening mode.");
  }
  // Process other commands only in 'Processing' mode
  else if (mode === 'Processing') {
    if (command.includes('romeo')) {
      ttsService.speak("Dogs are cool");
    } else if (command.includes('mother')) {
      ttsService.speak("Your mother is the best mother in the whole world.");
    }
    else if (command.includes('lights bathroom')) {
      ttsService.speak("Getting the bathroom lights.", () => {});
      console.log("Attempting to execute gotoWebsiteForLightControl");
      gotoWebsiteForLightControl('bath room');
    }
    else if (command.includes('lights living room')) {
      ttsService.speak("Getting the living room lights.", () => {});
      console.log("Attempting to execute gotoWebsiteForLightControl");
      gotoWebsiteForLightControl('living room');
    }
    else if (command.includes('lights kitchen')) {
      ttsService.speak("Getting the kitchen lights.", () => {});
      gotoWebsiteForLightControl('kitchen');
    } else if (command.includes('what do you think of my dad')) {
      ttsService.speak("He is a cool guy, except for when he says wild words");
    } else if (acceptedCommands.includes(command)) {
      console.log(`Executing command: ${command}`);
      executeCommand(command); // Execute the command logic
      successChimePlayer.play();
    } else {
      console.log(`Unknown command: ${command}`);
      failureChimePlayer.play();
    }
  } else {
    console.log("Ignoring command since not in 'Processing' mode.");
  }
};

module.exports = {
  startSpeechRecognition,
  stopSpeechRecognition
};
