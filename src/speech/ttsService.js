const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');
const player = require('play-sound')();

const MIMIC_URL = 'http://localhost:59125'; // Update with your Mimic 3 server URL
const VOICE_KEY = 'en_US/cmu-arctic#slt'; // Update with the correct voice key
// const VOICE_KEY = 'en_US/vctk_low#p236'; //Current Voice

// const VOICE_KEY = 'en_US/vctk_low#p227'; //Current Voice

// const VOICE_KEY = 'en_US/cmu-arctic_low#1rms';
// const VOICE_ID = 75; // The ID of the voice you want to use
// const SPEAKER_ID = 'p254'; // The speaker ID
// const VOICE_ID = 2; // The ID of the voice you want to use
// const SPEAKER_ID = 'slt'; // The speaker ID

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

// const ttsService = {
//   speak(text) {
//       return new Promise(async (resolve, reject) => {
//           try {
//               console.log("Sending to TTS:", text);

//               const response = await fetch(`${MIMIC_URL}/api/tts`, {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'text/plain' },
//                 body: text
//             });


//               if (!response.ok) {
//                   const errorText = await response.text();
//                   throw new Error(`Network response was not ok: ${response.status} - ${errorText}`);
//               }

//               const audioData = await response.blob();
//               console.log("Received audio data:", audioData.size, audioData.type);

//               // Save audio data to file for testing
//               const audioBuffer = Buffer.from(await audioData.arrayBuffer());
//               const fs = require('fs');
//               fs.writeFileSync('test_output.wav', audioBuffer);

//               // Add your audio playback logic here

//               resolve();
//           } catch (error) {
//               reject(error);
//           }
//       });
//   }
// };

module.exports = ttsService;