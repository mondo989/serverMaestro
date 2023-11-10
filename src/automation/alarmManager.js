// Filename: automation/alarmManager.js

const cron = require('node-cron');
const {
  keyboard,
  Key
} = require('@nut-tree/nut-js');

// Single array to store the scheduled alarms
let scheduledAlarms = [];

const parseTimeToEST = (timeString) => {
  // Parse the time string
  let [hours, minutes] = timeString.match(/\d+/g).map(Number);
  const isPM = timeString.toLowerCase().includes('pm');

  if (isPM && hours < 12) hours += 12;
  if (!isPM && hours === 12) hours = 0;

  // Create a new Date object for today
  const currentDate = new Date();

  // Set hours and minutes based on the input time
  currentDate.setHours(hours, minutes, 0, 0);

  // Convert to EST (considering daylight saving time)
  const estTime = new Date(currentDate.toLocaleString('en-US', {
    timeZone: 'America/New_York'
  }));

  return estTime;
};


// Function to check if an alarm time conflicts with existing alarms
const isAlarmConflict = (alarmTime) => {
  return scheduledAlarms.some(alarm => alarm.alarmTime.getTime() === alarmTime.getTime());
};

const executeAlarmSequence = async (youtubeUrl) => {
  try {

     // Volume control - start by turning volume down completely
     for (let i = 0; i < 15; i++) {
      await keyboard.pressKey(Key.AudioVolDown);
      await keyboard.releaseKey(Key.AudioVolDown);
    }

    await keyboard.pressKey(Key.LeftSuper, Key.Space);
    await keyboard.releaseKey(Key.LeftSuper, Key.Space);
    await keyboard.type("chrome");
    await keyboard.pressKey(Key.Return);
    await keyboard.releaseKey(Key.Return);

    // Wait for Chrome to open
    await new Promise(resolve => setTimeout(resolve, 2000));

    await keyboard.pressKey(Key.LeftSuper, Key.T);
    await keyboard.releaseKey(Key.LeftSuper, Key.T);
    await keyboard.type(youtubeUrl);
    await keyboard.pressKey(Key.Return);
    await keyboard.releaseKey(Key.Return);

    // Increment volume every 20 seconds
    for (let i = 0; i < 16; i++) {
      await keyboard.pressKey(Key.AudioVolUp);
      await keyboard.releaseKey(Key.AudioVolUp);
      await new Promise(resolve => setTimeout(resolve, 10000)); // Wait 20 seconds
    }
  } catch (error) {
    console.error(`Error executing alarm sequence: ${error}`);
  }
};

const scheduleAlarm = (alarmTime, youtubeUrl) => {
  console.log(`Received alarm time: ${alarmTime}`);

  const localAlarmTime = new Date(alarmTime.toLocaleString('en-US', {
    timeZone: 'America/New_York'
  }));
  const cronTime = `${localAlarmTime.getMinutes()} ${localAlarmTime.getHours()} * * *`;

  console.log(`Cron time: ${cronTime}`);

  const job = cron.schedule(cronTime, () => {
    console.log(`Alarm going off for: ${youtubeUrl}`);
    executeAlarmSequence(youtubeUrl);
  }, {
    scheduled: true,
    timezone: "America/New_York"
  });

  scheduledAlarms.push({
    alarmTime: localAlarmTime,
    youtubeUrl,
    cronTime,
    job
  });

  console.log(`Alarm scheduled for ${youtubeUrl} at ${localAlarmTime}`);
};


const listAlarms = () => {
  return scheduledAlarms;
};

const clearAlarms = () => {
  scheduledAlarms.forEach(alarm => alarm.job.stop());
  scheduledAlarms = [];
  console.log("All alarms cleared");
};

module.exports = {
  parseTimeToEST,
  isAlarmConflict,
  scheduleAlarm,
  listAlarms,
  clearAlarms,
};