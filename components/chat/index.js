import React from 'react';

import ChatInput from './ChatInput/ChatInput.js';
import AddPersonForm from './AddPersonForm/AddPersonForm.js';
import ParticipantsModal from './ParticipantsModal/ParticipantsModal.js';
import ProfileModal from '../ProfileModal/ProfileModal.js';
import Messages from './Messages/Messages.js';
import LoadingSpinner from '../LoadingSpinner';
import ErrorModal from '../errorModal';
import Dropzone from 'react-dropzone';
import io from 'socket.io-client';

import { getRecentEmoji } from '../../lib/apiRequests/emoji';
import './styles.css';
import { saveMessage } from '../../lib/apiRequests/messages';
import { uploadImage as requestUploadImage } from '../../lib/apiRequests/images';

export default class Chat extends React.Component {
// eslint-disable-next-line max-statements
    constructor(props) {
        super(props);

        this.state = {
            showProfileModal: false,
            showParticipantsModal: false,
            messages: props.messagesInfo.messages,
            currentUser: props.messagesInfo.currentUser,
            currentConversation: props.messagesInfo.currentConversation,
            participantsVisible: false,
            ignore: true,
            disableActiveWindow: true,
            loading: false,
            showErrorModal: false,
            dropzoneActive: false,
            title: ''
        };

        getRecentEmoji()
            .then(res => res.data)
            .then(recentEmoji => this.setState({ recentEmoji }));

        this.socket = io();

        this.closeProfileModal = this.closeProfileModal.bind(this);
        this.openProfileModal = this.openProfileModal.bind(this);

        this.openParticipantsModal = this.openParticipantsModal.bind(this);
        this.closeParticipantsModal = this.closeParticipantsModal.bind(this);

        this.handleMessage = this.handleMessage.bind(this);
        this.handleNotification = this.handleNotification.bind(this);
        this.handleNotSupported = this.handleNotSupported.bind(this);
        this.handlePermissionGranted = this.handlePermissionGranted.bind(this);
        this.handlePermissionDenied = this.handlePermissionDenied.bind(this);

        this.handleCloseErrorModal = this.handleCloseErrorModal.bind(this);
        this.onDragLeave = this.onDragLeave.bind(this);
        this.onDragEnter = this.onDragEnter.bind(this);
        this.onDrop = this.onDrop.bind(this);
    }

    handleCloseErrorModal() {
        this.setState({ showErrorModal: false });
    }

    handlePermissionGranted() {
        this.setState({
            ignore: false
        });
    }
    handlePermissionDenied() {
        this.setState({
            ignore: true
        });
    }
    handleNotSupported() {
        this.setState({
            ignore: true
        });
    }

    closeProfileModal() {
        this.setState({ showProfileModal: false });
    }

    openProfileModal(username) {
        this.setState({
            showProfileModal: true,
            profileUsername: username,
            profileAvatarUrl: `/api/avatar/${username}`
        });
    }

    openParticipantsModal() {
        this.setState({ showParticipantsModal: true });
    }

    closeParticipantsModal() {
        this.setState({ showParticipantsModal: false });
    }


    componentDidMount() {
        this.socket.on(`message_${this.props.messagesInfo.conversationId}`,
            this.handleNotification);
    }

    componentWillUnmount() {
        this.socket.removeListener(`message_${this.props.messagesInfo.conversationId}`);
    }

    handleNotification(message) {
        if (this.state.currentUser === message.author) {
            return this.handleMessage(message);
        }

        const options = {
            tag: Date.now(),
            body: message.type === 'text'
                ? message.text
                : 'Image received',
            icon: '',
            dir: 'ltr'
        };
        this.setState({
            title: message.author,
            options: options
        });
        this.handleMessage(message);
    }

    handleMessage(message) {
        const newMessages = this.state.messages.slice();
        newMessages.push(message);
        this.setState({
            messages: newMessages
        });
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
        files.map(file=> this.uploadImage(file));
    }

    uploadImage(file) {
        requestUploadImage(file)
            .then(res => {
                if (res.data.error) {
                    this.setState({
                        loading: false,
                        showErrorModal: true,
                        error: `Error on file ${file.name}
                         ${res.data.error.message}`
                    });
                } else {
                    this.setState({ loading: false });
                    const message = {
                        type: 'image',
                        conversationId: this.props.messagesInfo.conversationId,
                        imageUrl: `/api/images/${res.data.imageId}`,
                        author: this.state.currentUser
                    };
                    this.socket.emit('message', message);
                    saveMessage(message, message.conversationId);
                }
            });
    }


    render() {
        const loading = this.state.loading;
        const { dropzoneActive } = this.state;
        const overlayStyle = {
            position: 'fixed',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            zIndex: 9999,
            padding: '23.5em 0',
            background: 'rgba(0,0,0,0.5)',
            textAlign: 'center',
            color: '#fff'
        };

        return (
            <section className='chat-container'>
                <ErrorModal
                    showModal={this.state.showErrorModal}
                    error={this.state.error}
                    handleCloseModal={this.handleCloseErrorModal}
                />

                {loading ? <LoadingSpinner /> : null}
                <ProfileModal
                    showModal={this.state.showProfileModal}
                    handleCloseModal={this.closeProfileModal}
                    username={this.state.profileUsername}
                    avatarUrl={this.state.profileAvatarUrl}
                />

                <div className='chat-container__controls'>
                    {!this.state.currentConversation.isPrivate &&
                        <AddPersonForm
                            conversationId={this.props.messagesInfo.conversationId}
                        />}
                    <button
                        className='chat-container__show-participants-button'
                        onClick={this.openParticipantsModal}>
                        О&nbsp;беседе
                    </button>
                </div>

                <ParticipantsModal
                    showModal={this.state.showParticipantsModal}
                    handleCloseModal={this.closeParticipantsModal}
                    conversationId={this.props.messagesInfo.conversationId}
                />
                <Dropzone
                    disableClick
                    onDrop={this.onDrop}
                    onDragEnter={this.onDragEnter}
                    onDragLeave={this.onDragLeave}
                    style={{ position: 'relative', display: 'contents' }}
                >
                    {dropzoneActive && <div style={overlayStyle}>Drop images...</div>}
                    <Messages
                        messages={this.state.messages}
                        currentUser={this.state.currentUser}
                        onMessageTitleClick={this.openProfileModal}
                    />

                    <ChatInput
                        conversationId={this.props.messagesInfo.conversationId}
                        socket={this.socket} currentUser={this.state.currentUser}
                        recentEmoji={this.state.recentEmoji}
                    />
                </Dropzone>
            </section>
        );
    }
}
