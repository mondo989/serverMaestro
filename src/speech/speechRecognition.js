// src/bot/speechRecognition.js

const VoskService = require('./VoskService');
const AudioProcessor = require('./AudioProcessor');
const AudioPlayer = require('./AudioPlayer');
const ttsService = require('./ttsService');
const triggerService = require('../automation/triggerService');
const {
  gotoWebsiteForLightControl
} = require('../automation/shortcuts');

const modelPath = './models/vosk-model--lg';
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
  "Whats up?",
  "Hello, how may I assist you today?",
  "G-G's in the Chat.",
  "I'm here.",
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
  const normalizedCommand = command.toLowerCase().trim();

  // Check for stopping active mode first
  if (command.includes('inactive mode') ||
    command.includes('stop listening') ||
    command.includes('stop') ||
    command.includes("go sleep")) {
    mode = 'Inactive';
    ttsService.speak("Okay then, my fingers will be in my ears now");
  }
  // Then check for activating active mode
  else if (command.includes('active mode') ||
    command.includes('active loud') ||
    command.includes('active go') ||
    command.includes("let's cook")) {
    mode = 'Active';
    ttsService.speak("I'm listening for all your requests");
    failureChimePlayer.play();
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

    } else if (normalizedCommand === 'introduce yourself' ||
      normalizedCommand === 'who are you' ||
      normalizedCommand === 'who you') {

      ttsService.speak("I am Genesis, your personal home automation assistant. I help control your home with voice commands, making your life easier and more efficient.");

    } if (command.includes('good morning') ||
    command.includes('all lights on') ||
    command.includes('hey good morning') ||
    command.includes("new day") ||
    command.includes("turn on all the lights")) {

      // Turn All lights on
      triggerService.runCommand('allLightsOn');

      ttsService.speak("Wakey wakey, hands off snakey");
      console.log("AllLights on shortcut ran");
    } else if (command.includes('good night') ||
      command.includes('lights out') ||
      command.includes("all lights out") ||
      command.includes("all lights off") ||
      command.includes("nighty night") ||
      command.includes("ninety night") ||
      command.includes("get some sleep")) {

      ttsService.speak("Lights out bitches");
      // Turn All lights off
      triggerService.runCommand('allLightsOff');
      console.log("AllLightsOff shortcut ran");

    } else if (normalizedCommand === 'lights on bathroom' ||
      normalizedCommand === 'bathroom lights on' ||
      normalizedCommand === 'using the bathroom' ||
      normalizedCommand === "I'm using the bathroom" ||
      normalizedCommand === 'dropping a stinker' ||
      normalizedCommand === 'need to poop' ||
      normalizedCommand === 'i need to poop' ||
      normalizedCommand === 'take a shit') {

      // Turn All lights on
      triggerService.runCommand('bathroomLightsOn');

      ttsService.speak("Wash your hands, you nasty human");
      console.log("Bathroom lights on");
    } else if (normalizedCommand === 'lights off bathroom' ||
      normalizedCommand === 'bathroom lights off' ||
      normalizedCommand === 'turn off the bathroom' ||
      normalizedCommand === "done in the bathroom" ||
      normalizedCommand === 'no lights in bathroom' ||
      normalizedCommand === 'bathroom done' ||
      normalizedCommand === 'done in bathroom') {

      // Turn All lights on
      triggerService.runCommand('bathroomLightsOff');
      ttsService.speak("Even though I dont have a nose, I still smell you");
      console.log("Bathroom lights off");
    } else if (command.includes('smoky room on') ||
      command.includes('smoky room lights') ||
      command.includes("i'm working late tonight") ||
      command.includes("smoky lights")) {
      triggerService.runCommand('smokeyLightsOn');
      ttsService.speak("Lights are on in the stinky room. I mean smokey room");
      console.log("Lights on in Smokey room");
    } else if (command.includes('smoky room off') ||
      command.includes('lights off smoky room') ||
      command.includes('lights off smokey room') ||
      command.includes("i'm working late tonight") ||
      command.includes("smoky light off, smells better")) {
      triggerService.runCommand('smokeyLightsOff');
      ttsService.speak("Smokey room lights are off, smells better like that");
      console.log("Smokey Room lights off...");
    } else if (command.includes('kitchen lights on') ||
      command.includes('lights on kitchen') ||
      command.includes('going to cook') ||
      command.includes("need lights in the kitchen") ||
      command.includes("start kitchen lights")) {
      triggerService.runCommand('kitchenLightsOn');
      ttsService.speak("I really hope your wife makes something nice, for the both of us.");
      console.log("Kitchen lights on...");
    } else if (command.includes('bedroom lights on') ||
    command.includes('lights on kitchen') ||
    command.includes('going to cook') ||
    command.includes("need lights in the kitchen") ||
    command.includes("start kitchen lights")) {
    triggerService.runCommand('kitchenLightsOn');
    console.log("Bedroom lights on");
  }
    else if (command.includes('kitchen lights off') ||
      command.includes('lights off kitchen') ||
      command.includes('done cooking') ||
      command.includes("need lights off in the kitchen") ||
      command.includes("stop kitchen lights")) {
      triggerService.runCommand('kitchenLightsOff');
      ttsService.speak("Kitchen lights are off.");
      console.log("Kitchen lights off...");
    } else {
      console.log(`Unknown command: ${command}`);
      // failureChimePlayer.play();
      return;
    }
  }
};

module.exports = {
  startSpeechRecognition,
  stopSpeechRecognition
};