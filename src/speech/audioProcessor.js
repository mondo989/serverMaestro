const record = require('node-record-lpcm16');

class AudioProcessor {
    constructor() {
        // The constructor doesn't need an input source anymore
        // as it's fixed to the system's default microphone
    }

    // Method to return a readable stream of audio data
    getAudioStream() {
        // This starts recording from the microphone and returns a stream
        return record.record({
            sampleRate: 16000,
            channels: 1,
            audioType: 'raw'
        }).stream();
    }
}

module.exports = AudioProcessor;
