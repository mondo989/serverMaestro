// src/speech/VoskService.js

const vosk = require('vosk');
const fs = require('fs');

class VoskService {
    constructor(modelPath) {
        this.modelPath = modelPath;
        this.model = null;
        this.recognizer = null;
    }

    async init() {
        if (!fs.existsSync(this.modelPath)) {
            throw new Error(`Model path ${this.modelPath} does not exist`);
        }

        vosk.setLogLevel(-1); // Disable logs for cleaner output
        this.model = new vosk.Model(this.modelPath);
    }

    createRecognizer() {
        if (!this.model) {
            throw new Error("Vosk model is not initialized");
        }

        this.recognizer = new vosk.Recognizer({model: this.model, sampleRate: 16000});
        this.recognizer.setWords(true); // Enable to get words in results
    }

    recognizeStream(audioStream) {
        return new Promise((resolve, reject) => {
            let recognizedText = '';
    
            audioStream.on('data', (data) => {
                if (this.recognizer.acceptWaveform(data)) {
                    let result = this.recognizer.result();
                    recognizedText += result.text + ' ';
                    console.log(result.text); // Log each recognized segment
                }
            });
    
            audioStream.on('end', () => {
                recognizedText += this.recognizer.finalResult().text;
                console.log('Final recognized text:', recognizedText.trim()); // Log final combined text
                resolve(recognizedText.trim());
            });
    
            audioStream.on('error', (err) => {
                reject(err);
            });
        });
    }    
}

module.exports = VoskService;
