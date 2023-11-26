const player = require('play-sound')(opts = {});

class AudioPlayer {
    constructor(audioFilePath) {
        this.audioFilePath = audioFilePath;
    }

    play() {
        player.play(this.audioFilePath, function(err){
            if (err) {
                console.error("Error playing sound:", err);
            }
        });
    }
}

module.exports = AudioPlayer;
