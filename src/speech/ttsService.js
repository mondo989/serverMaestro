const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');
const player = require('play-sound')();

const MIMIC_URL = 'http://127.0.0.1:59125';  // Force IPv4
const VOICE_KEY = 'en_US/cmu-arctic_low'; // Update with the correct voice key

const ttsService = {
  speak(text) {
    return new Promise(async (resolve, reject) => {
      try {
        console.log("Speaking:", text); // Log the text being spoken

        const response = await fetch(`${MIMIC_URL}/api/tts?voice=${VOICE_KEY}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'text/plain'
          },
          body: text
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Network response was not ok: ${response.status} - ${errorText}`);
        }

        const audioData = await response.arrayBuffer();
        const audioBuffer = Buffer.from(audioData);
        const audioFilePath = path.join(__dirname, 'temp_audio.wav');

        fs.writeFile(audioFilePath, audioBuffer, (err) => {
          if (err) {
            reject(err);
            return;
          }

          // Play the audio file after saving
          player.play(audioFilePath, function (err) {
            if (err) reject(err);
            else resolve();
          });
        });
      } catch (error) {
        reject(error);
      }
    });
  }
};

module.exports = ttsService;
