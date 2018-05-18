/* eslint-disable complexity */
import React from 'react';
import { updateRecentEmoji } from '../../../lib/apiRequests/emoji';
import { saveMessage } from '../../../lib/apiRequests/messages';
import EmojiPicker from './EmojiPicker/EmojiPicker';
import { uploadImage as requestUploadImage } from '../../../lib/apiRequests/images';
import LoadingSpinner from '../../LoadingSpinner';
import ErrorModal from '../../errorModal';
import Dropzone from 'react-dropzone';
import TextField from 'material-ui/TextField';

import Recognizer from '../../../lib/Recognizer/Recognizer';
import './styles.css';
import 'emoji-mart/css/emoji-mart.css';

export default class ChatInput extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            messageText: '',
            files: [],
            showPicker: false,
            loading: false,
            showErrorModal: false,
            dropzoneActive: false,
            isRecognitionStarted: false,
            recognizedText: ''
        };

        this.numberOfRecentEmoji = props.numberOfRecentEmoji || 15;
        this._bindHandlers();
    }

    _bindHandlers() {
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.onEmojiSelect = this.onEmojiSelect.bind(this);
        this.onShowPickerButtonClick = this.onShowPickerButtonClick.bind(this);
        this.onInputPressKey = this.onInputPressKey.bind(this);
        this.handleEscape = this.handleEscape.bind(this);
        this.onFileInputChange = this.onFileInputChange.bind(this);
        this.handleCloseErrorModal = this.handleCloseErrorModal.bind(this);
        this.onDragLeave = this.onDragLeave.bind(this);
        this.onDragEnter = this.onDragEnter.bind(this);
        this.onDrop = this.onDrop.bind(this);
        this.handleOutsideEmojiClick = this.handleOutsideEmojiClick.bind(this);
        this.handleRecognitionResult = this.handleRecognitionResult.bind(this);
        this.startRecognition = this.startRecognition.bind(this);
        this.stopRecognition = this.stopRecognition.bind(this);
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (!prevState.recentEmoji || !prevState.recentEmoji.length) {
            return {
                shownRecentEmoji: nextProps.recentEmoji || [],
                recentEmoji: nextProps.recentEmoji || []
            };
        }
    }

    componentDidMount() {
        // eslint-disable-next-line
        document.addEventListener('keydown', this.handleEscape, false);
        document.addEventListener('click', this.handleOutsideEmojiClick); // eslint-disable-line
    }

    componentWillUnmount() {
        // eslint-disable-next-line
        document.removeEventListener('keydown', this.handleEscape, false);
    }

    handleCloseErrorModal() {
        this.setState({ showErrorModal: false });
    }

    handleEscape(event) {
        if (event.keyCode === 27) {
            this.setState({ showPicker: false });
        }
    }

    handleChange(event) {
        if (this.state.isRecognitionStarted) {
            return;
        }
        this.setState({ messageText: event.target.value });
    }

    handleRecognitionResult({ text, isFinal }) {
        if (!this.state.isRecognitionStarted) {
            return;
        }

        if (!isFinal) {
            this.setState({ recognizedText: text });

            return;
        }

        this.setState({
            messageText: `${this.state.messageText} ${text}`,
            recognizedText: ''
        });
    }

    startRecognition() {
        if (!this.recognizer) {
            this.recognizer = new Recognizer();
            this.recognizer.onResult = this.handleRecognitionResult;
        }

        this.recognizer.startRecognition();
        this.setState({ isRecognitionStarted: true });
        this.chatInput.focus();
    }

    async stopRecognition() {
        if (this.recognizer) {
            this.recognizer.stopRecognition();
        }

        await this.setState({
            isRecognitionStarted: false,
            messageText: `${this.state.messageText} ${this.state.recognizedText}`,
            recognizedText: ''
        });

        this.chatInput.focus();
    }

    async handleSubmit(event) {
        event.preventDefault();
        await this.stopRecognition();
        const messageText = this.state.messageText.replace(/\n/g, '\n\n').trim();

        const message = {
            type: 'text',
            conversationId: this.props.conversationId,
            text: messageText,
            author: this.props.currentUser
        };

        this.props.socket.emit('message', message);

        saveMessage(message, this.props.conversationId);
        updateRecentEmoji(this.state.recentEmoji);

        this.setState({
            messageText: '',
            shownRecentEmoji: this.state.recentEmoji
        });
    }

    onFileInputChange(event, file = event.target.files[0]) {
        event.preventDefault();
        this.setState({ loading: true });
        this.uploadImage(file);
        event.target.value = '';
    }

    onDragEnter() {
        this.setState({
            dropzoneActive: true
        });
    }

    onDragLeave() {
        this.setState({
            dropzoneActive: false
        });
    }

    onDrop(files) {
        this.setState({
            files,
            dropzoneActive: false,
            loading: true
        });
        this.uploadImage(files[0]);
    }

    uploadImage(file) {
        requestUploadImage(file)
            .then(res => {
                if (res.data.error) {
                    this.setState({
                        loading: false,
                        showErrorModal: true,
                        error: res.data.error.message
                    });
                } else {
                    this.setState({ loading: false });
                    const message = {
                        type: 'image',
                        conversationId: this.props.conversationId,
                        imageUrl: `/api/images/${res.data.imageId}`,
                        author: this.props.currentUser
                    };
                    this.props.socket.emit('message', message);
                    saveMessage(message, message.conversationId);
                }
            });
    }

    onEmojiSelect(emoji) {
        const updatedRecentEmoji = this.state.recentEmoji.filter(el => el !== emoji.id);
        updatedRecentEmoji.unshift(emoji.id);
        updatedRecentEmoji.splice(this.numberOfRecentEmoji);

        this.setState({
            messageText: this.state.messageText + emoji.native,
            recentEmoji: updatedRecentEmoji
        });

        this.chatInput.focus();
    }

    onShowPickerButtonClick() {
        this.setState({
            showPicker: !this.state.showPicker
        });
        this.chatInput.focus();
    }

    onInputPressKey(e) {
        if (e.shiftKey && e.charCode === 13) { // shift+enter
            return true;
        }
        if (e.charCode === 13) { // enter
            this.handleSubmit(e);

            return false;
        }
    }

    handleOutsideEmojiClick(event) {
        if (this.pickerContainer && !this.pickerContainer.contains(event.target) &&
            !this.pickerButton.contains(event.target)) {
            this.setState({
                showPicker: false
            });
        }
    }

    render() {
        const loading = this.state.loading;
        const { dropzoneActive } = this.state;
        const overlayStyle = {
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            zIndex: 9999,
            padding: '2.5em 0',
            background: 'rgba(0,0,0,0.5)',
            textAlign: 'center',
            color: '#fff'
        };

        return (
            <Dropzone
                disableClick
                style={{ position: 'relative' }}
                onDrop={this.onDrop}
                onDragEnter={this.onDragEnter}
                onDragLeave={this.onDragLeave}
            >
                {dropzoneActive && <div style={overlayStyle}>Drop images...</div>}
                <div className='chat-input'>
                    <ErrorModal
                        showModal={this.state.showErrorModal}
                        error={this.state.error}
                        handleCloseModal={this.handleCloseErrorModal}
                    />

                    {loading ? <LoadingSpinner /> : null}

                    {this.state.showPicker
                        ? <div className='picker-container' ref={pickerContainer => {
                            this.pickerContainer = pickerContainer;
                        }}>
                            <EmojiPicker
                                recentEmoji={this.state.shownRecentEmoji}
                                onEmojiSelect={this.onEmojiSelect}
                            />
                        </div>
                        : null
                    }

                    <div className='chat-input__input-elements'>
                        <TextField
                            id='multiline-flexible'
                            label='Введите новое сообщение'
                            multiline
                            rowsMax='1'
                            value={this.state.messageText + this.state.recognizedText}
                            placeholder='Привет'
                            onChange={this.handleChange}
                            onKeyPress={this.onInputPressKey}
                            margin='normal'
                            autoFocus
                            required
                            inputRef={chatInput => {
                                this.chatInput = chatInput;
                            }}
                        />

                        <div className='chat-input__buttons'>
                            <div className='chat-input__show-picker-button'
                                onClick={this.onShowPickerButtonClick}
                                ref={pickerButton => {
                                    this.pickerButton = pickerButton;
                                }}
                            >
                                <div className='chat-input__sprite chat-input__sprite-emoji' />
                            </div>

                            {Recognizer.isAvailable() &&
                                <div className='chat-input__recognition-button'>
                                    {!this.state.isRecognitionStarted
                                        ? <div
                                            className='chat-input__sprite chat-input__sprite-mic'
                                            onClick={this.startRecognition}
                                        />
                                        : <div
                                            className={`chat-input__sprite
                                                chat-input__sprite-crossed-mic`}
                                            onClick={this.stopRecognition}
                                        />
                                    }
                                </div>
                            }

                            <label className='chat-input__file-label' htmlFor='file-input'>
                                <div className='chat-input__sprite chat-input__sprite-file' />
                            </label>
                        </div>

                        {this.state.isRecognitionStarted &&
                            <div className='chat-input__red-dot' />}

                        <input
                            type='file'
                            onChange={this.onFileInputChange}
                            className='file-input'
                            id='file-input'
                        />
                    </div>
                </div>
            </Dropzone>
        );
    }
}
