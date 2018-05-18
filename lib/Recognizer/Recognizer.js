/* eslint-disable no-undef */
const RECOGNITION_LANGUAGE = 'ru-Latn';

export default class Recognizer {
    constructor() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        this._recognizer = SpeechRecognition && this._createRecognizer(SpeechRecognition);
    }

    _createRecognizer(SpeechRecognition) {
        const speechRecognizer = new SpeechRecognition();
        speechRecognizer.lang = RECOGNITION_LANGUAGE;
        speechRecognizer.continuous = true;
        speechRecognizer.interimResults = true;

        return speechRecognizer;
    }

    set onResult(onResult) {
        this._onResult = onResult;
    }

    startRecognition() {
        this._recognizer.onresult = e => {
            const index = e.resultIndex;
            const result = e.results[index];
            const text = result[0].transcript.trim();
            const isFinal = result.isFinal;
            this._onResult({ text, isFinal });
        };

        this._recognizer.start();
    }

    stopRecognition() {
        this._recognizer.stop();
    }

    static isAvailable() {
        if (window.SpeechRecognition || window.webkitSpeechRecognition) {
            return true;
        }

        return false;
    }
}
