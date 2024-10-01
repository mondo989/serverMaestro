// src/bot/speechRecognition.js

const VoskService = require('./VoskService');
const AudioProcessor = require('./AudioProcessor');
const AudioPlayer = require('./AudioPlayer');
const ttsService = require('./ttsService');
const triggerService = require('../automation/triggerService');
const { gotoWebsiteForLightControl } = require('../automation/shortcuts');

const modelPath = './models/vosk-model--sm';
const chimePath = './sounds/bottle.aiff';
const chimePath2 = './sounds/response.mp3';
const successChimePath = './sounds/accepted.aiff';
const failureChimePath = './sounds/rejected.aiff';
const acceptedCommands = ['end', 'and', 'end chrome'];

let isListening = false;
let isTriggered = false;
let isSpeaking = false;
let mode = 'Active';

// Needs to be updated
let awaitingAlarmTime = false;
let awaitingMusicChoice = false;
let confirmingAlarm = false;
let alarmTime = '';
let alarmMusic = '';
let isConfirmingTime = false;

// Define AudioPlayer instances at a higher scope to make them accessible throughout the file
const audioPlayer = new AudioPlayer(chimePath);
const audioPlayer2 = new AudioPlayer(chimePath2);
const successChimePlayer = new AudioPlayer(successChimePath);
const failureChimePlayer = new AudioPlayer(failureChimePath);

const resetAlarmSettings = () => {
  alarmTime = '';
  alarmMusic = '';
  awaitingAlarmTime = false;
  awaitingMusicChoice = false;
  confirmingAlarm = false;
};

// Define an array of responses for Genesis
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

function convertSpokenTimeToStandardFormat(spokenTime) {
  const numberMap = {
    "one": 1,
    "two": 2,
    "three": 3,
    "four": 4,
    "five": 5,
    "six": 6,
    "seven": 7,
    "eight": 8,
    "nine": 9,
    "ten": 10,
    "eleven": 11,
    "twelve": 12,
    "thirty": 30,
    "forty": 40,
    "fifty": 50,
    "o'clock": 0
    // Add more mappings as needed
  };

  let parts = spokenTime.split(' ');
  let hours = numberMap[parts[0]];
  let minutes = parts[1] && parts[1] !== "o'clock" ? numberMap[parts[1]] : 0;
  let ampm = parts[parts.length - 1];

  return `${hours}:${minutes < 10 ? '0' : ''}${minutes} ${ampm}`;
}

const handleAlarmResponse = (text) => {
  if (awaitingAlarmTime) {
    try {
      let convertedTime = convertSpokenTimeToStandardFormat(text);
      alarmTime = convertedTime;
      ttsService.speak(`You wanted ${alarmTime} correct?`);
      awaitingAlarmTime = false;
      isConfirmingTime = true;
    } catch (error) {
      ttsService.speak("I couldn't understand the time. Please tell me a time, like '6:50 am' or '7:30 pm'.");
    }
  } else if (isConfirmingTime) {
    if (text.toLowerCase().includes('yes')) {
      ttsService.speak('Ok great, what music would you like to wake up to?');
      isConfirmingTime = false;
      awaitingMusicChoice = true;
    } else if (text.toLowerCase().includes('no')) {
      ttsService.speak('Alright, what time then?');
      isConfirmingTime = false;
      awaitingAlarmTime = true;
    } else {
      ttsService.speak(`I didn't catch that. Did you want to set the alarm for ${alarmTime}?`);
    }
  } else if (awaitingMusicChoice) {
    alarmMusic = text;
    ttsService.speak(`To confirm, you want an alarm clock for ${alarmTime} and I'll play the ${alarmMusic}`);
    awaitingMusicChoice = false;
    confirmingAlarm = true;
  } else if (confirmingAlarm) {
    if (text.toLowerCase().includes('yes')) {
      // Integrate with the Telegram bot to set the alarm here
      console.log(`Setting alarm for ${alarmTime} with ${alarmMusic}`);
      ttsService.speak("Great! I'll wake you up at " + alarmTime + ", sleep nice!");
      resetAlarmSettings();
    } else if (text.toLowerCase().includes('no')) {
      ttsService.speak("Okay, let's try setting the alarm again.");
      resetAlarmSettings();
    } else {
      ttsService.speak("I didn't catch that. Could you please confirm if you want to set the alarm?");
    }
  }
};

const originalSpeakFunction = ttsService.speak;
ttsService.speak = (text) => {
  isSpeaking = true;
  originalSpeakFunction(text).finally(() => {
    isSpeaking = false;
  });
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
        console.log(result.text);

        if (result.text.toLowerCase().includes('genesis')) {
          const randomResponse = genesisResponses[Math.floor(Math.random() * genesisResponses.length)];
          ttsService.speak(randomResponse);
          isTriggered = true;
        } else if (isTriggered || mode === 'Active') {
          processCommand(result.text.toLowerCase());
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
};

const processCommand = (command) => {
  // Check for stopping active mode first
  if (command.includes('stop active mode')) {
    mode = 'Inactive';
    ttsService.speak("Okay then, my fingers will be in my ears now");
  }
  // Then check for activating active mode
  else if (command.includes('active mode')) {
    mode = 'Active';
    ttsService.speak("I'm listening for all your requests");
  }
  // Process other commands if in Active mode or Genesis is triggered
  else if (mode === 'Active' || command.includes('genesis')) {
    if (command.includes('romeo')) {
      ttsService.speak("Dogs shouldn't eat their poop! Unless they are really hungry.");
    } else if (command.includes('mother')) {
      ttsService.speak("Your mother is the best mother in the whole world.");
    } else if (command.includes('what do you think of my dad')) {
      ttsService.speak("He is a cool guy, except for when he says wild words");
    } else if (acceptedCommands.includes(command)) {
      console.log(`Executing command: ${command}`);
      executeCommand(command);
      successChimePlayer.play();
    } else if (command.includes('set alarm')) {
      ttsService.speak('Great! What time?');
      awaitingAlarmTime = true;
    } else if (awaitingAlarmTime || awaitingMusicChoice || confirmingAlarm) {
      handleAlarmResponse(command);
    } else if (command.toLowerCase().includes('good day') || command.toLowerCase().includes('new day') || command.toLowerCase().includes('top of the top')) {
        ttsService.speak("Wakey wakey");
        console.log("Running 'Turn on Lights' shortcut...");
        triggerService.runCommand('lightsOn');
        ttsService.speak("Sunshine, let's start a new day");
    } else if (command.includes('turn off lights')) {
      console.log("Running 'Turn off Lights' shortcut...");
      ttsService.speak("Lights out ");
      triggerService.runCommand('allLightsOff');
    } else if (command.includes('run a test')) {
      console.log("Doing a Test");
      ttsService.speak("Test test test. we test in production over here");
      triggerService.runCommand('testShortcut');
    }
     else if (command.includes('wake up')) {
      console.log("Running 'Wakeup' shortcut...");
      triggerService.runCommand('wakeup');
    } else {
      console.log(`Unknown command: ${command}`);
      // failureChimePlayer.play();
    }
  }
};

module.exports = {
  startSpeechRecognition,
  stopSpeechRecognition
};