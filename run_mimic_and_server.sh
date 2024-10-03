#!/bin/bash
# Copy generator.onnx to the mimic3 directory
cp ~/projects/serverMaestro/generator.onnx ~/.local/share/mycroft/mimic3/voices/en_US/cmu-arctic_low/

# Start the Mimic3 server
mimic3-server --port 59125 &

# Start your Node.js server
npm start

