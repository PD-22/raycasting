function logAudioJSON_sel() {
    getAudioBufferJSON_sel().then(console.log);
}

function getStoredVolume() {
    let volume = sessionStorage.getItem('volume');
    if (volume == undefined) return;
    return parseInt(volume);
}

function loadAudio_sel() {
    let input = document.createElement('input');
    document.body.appendChild(input);
    input.setAttribute('type', 'file');
    let promise = new Promise(resolve => {
        input.addEventListener("change", () => {
            let file = input.files[0];
            resolve(file);
        });
    });
    input.click();
    input.remove();
    return promise;
}

function getAudioBufferJSON_sel() {
    let promise = resolve => loadAudio_sel().then(file => {
        let reader = new FileReader();
        reader.addEventListener('load', () => {
            audioContext?.decodeAudioData(reader.result)
                .then(res => {
                    let json = AudioBufferToJSON(res);
                    resolve(json);
                });
        })
        reader.readAsArrayBuffer(file);
    })
    return new Promise(promise);
}

function AudioBufferToJSON(buffer) {
    let downMixed = buffer;
    if (buffer.numberOfChannels > 1)
        downMixed = downMixAudioBuffer(buffer);
    let data = downMixed.getChannelData(0);
    let array = Array.from(data);
    let json = JSON.stringify(array);
    return json;
}

function bufferFromArray(array) {
    let buffer = audioContext.createBuffer(
        1, array.length, audioContext.sampleRate);
    buffer.copyToChannel(Float32Array.from(array), 0);
    return buffer;
}

function downMixAudioBuffer(buffer) {
    let left = buffer.getChannelData(0);
    let right = buffer.getChannelData(1);
    let mix = left.map((l, i) => (l + right[i]) / 2);
    return bufferFromArray(mix);
}