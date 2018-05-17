import React from 'react';
import { updateRecentEmoji } from '../../../lib/apiRequests/emoji';
import { saveMessage } from '../../../lib/apiRequests/messages';
import EmojiPicker from './EmojiPicker/EmojiPicker';
import { uploadImage } from '../../../lib/apiRequests/images';
import LoadingSpinner from '../../LoadingSpinner';
import ErrorModal from '../../errorModal';
import Dropzone from 'react-dropzone';
import TextField from 'material-ui/TextField';

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
            showModal: false,
            dropzoneActive: false,
            sendIcon: 'static/images/Emoji_Foggy_PNG.png',
            emojiIcon: 'static/images/Slightly_Smiling_Face_Emoji.png'
        };

        this.numberOfRecentEmoji = props.numberOfRecentEmoji || 15;

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.onEmojiSelect = this.onEmojiSelect.bind(this);
        this.onShowPickerButtonClick = this.onShowPickerButtonClick.bind(this);
        this.onInputPressKey = this.onInputPressKey.bind(this);
        this.handleEscape = this.handleEscape.bind(this);
        this.onFileInputChange = this.onFileInputChange.bind(this);
        this.handleCloseModal = this.handleCloseModal.bind(this);
        this.onDragLeave = this.onDragLeave.bind(this);
        this.onDragEnter = this.onDragEnter.bind(this);
        this.onDrop = this.onDrop.bind(this);
        this.handleOutsideEmojiClick = this.handleOutsideEmojiClick.bind(this);
    }

    handleCloseModal() {
        this.setState({ showModal: false });
    }

    componentDidMount() {
        // eslint-disable-next-line
        document.addEventListener('keydown', this.handleEscape, false);
        document.addEventListener('click', this.handleOutsideEmojiClick); // eslint-disable-line
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (!prevState.recentEmoji || !prevState.recentEmoji.length) {
            return {
                shownRecentEmoji: nextProps.recentEmoji || [],
                recentEmoji: nextProps.recentEmoji || []
            };
        }
    }

    componentWillUnmount() {
        // eslint-disable-next-line
        document.removeEventListener('keydown', this.handleEscape, false);
    }

    handleEscape(event) {
        if (event.keyCode === 27) {
            this.setState({ showPicker: false });
        }
    }

    handleChange(event) {
        this.setState({ messageText: event.target.value });
    }

    async handleSubmit(event) {
        event.preventDefault();
        const messageText = this.state.messageText.replace(/\n/g, '\n\n');

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
        uploadImage(file)
            .then(res => {
                if (res.data.error) {
                    this.setState({
                        loading: false,
                        showModal: true,
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
        uploadImage(files[0])
            .then(res => {
                if (res.data.error) {
                    this.setState({
                        loading: false,
                        showModal: true,
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
        if (!this.pickerContainer.contains(event.target) &&
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
                        showModal={this.state.showModal}
                        error={this.state.error}
                        handleCloseModal={this.handleCloseModal}
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
                            // className='chat-input__textarea'
                            multiline
                            rowsMax='1'
                            value={this.state.messageText}
                            placeholder='Привет'
                            onChange={this.handleChange}
                            onKeyPress={this.onInputPressKey}
                            margin='normal'
                            autoFocus
                        />
                        <div className='chat-input__show-picker-button'
                            onClick={this.onShowPickerButtonClick}
                            ref={pickerButton => {
                                this.pickerButton = pickerButton;
                            }}
                        >
                            <img className='chat-input__emoji-icon' src={this.state.emojiIcon} />
                        </div>
                        <label className='chat-input__file-label' htmlFor='file-input'>
                            <img className='chat-input__file-icon' src={this.state.sendIcon} />
                        </label>

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
