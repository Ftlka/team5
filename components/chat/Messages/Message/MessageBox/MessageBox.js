import React from 'react';
import moment from 'moment';
const ReactMarkdown = require('react-markdown');
import Lightbox from 'react-image-lightbox';
import ImageMessage from './imageMessage/imageMessage';
import { Picker } from 'emoji-mart';
import Reactions from './Reactions/Reactions';
import { updateReactions } from '../../../../../lib/apiRequests/reactions';

import 'emoji-mart/css/emoji-mart.css';
import './styles.css';

export default class Message extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: props.id,
            currentUser: props.currentUser,
            position: props.position,
            text: props.text,
            author: props.title,
            date: props.date,
            type: props.type,
            image: props.image,
            avatar: props.avatar,
            metadata: props.metadata,
            reactions: props.reactions,
            isAvatarOpen: false,
            onMessageTitleClick: props.onMessageTitleClick,
            saveElementForScroll: props.saveElementForScroll,
            curTime: props.date && !isNaN(props.date) && (
                moment(props.date).fromNow()
            ),
            showPicker: false,
            showPickerButton: false
        };

        this.onEmojiSelect = this.onEmojiSelect.bind(this);
        this.onShowPickerButtonClick = this.onShowPickerButtonClick.bind(this);
        this.handleEscape = this.handleEscape.bind(this);
        this.handleOutsideEmojiClick = this.handleOutsideEmojiClick.bind(this);
        this.socket = props.socket;
    }

    componentDidMount() {
        console.info('MessageBox componentDidMount');
        setInterval(() => {
            this.setState({
                curTime: this.state.date && !isNaN(this.state.date) && (
                    moment(this.state.date).fromNow()
                )
            });
        }, 60000);
        document.addEventListener('keydown', this.handleEscape, false); // eslint-disable-line
        document.addEventListener('click', this.handleOutsideEmojiClick); // eslint-disable-line
        console.info(`updateMessage_${this.state.id}`);
        this.socket.on(`updateMessage_${this.state.id}`, this.updateMessage.bind(this));
    }

    componentWillUnmount() {
        console.info('MessageBox componentWillUnmount');
        document.removeEventListener('keydown', this.handleEscape, false); // eslint-disable-line
        document.removeEventListener('click', this.handleOutsideEmojiClick); // eslint-disable-line
        this.socket.removeListener(`updateMessage_${this.state._id}`);
    }

    handleEscape(event) {
        if (event.keyCode === 27) {
            this.setState({
                showPicker: false,
                showPickerButton: false
            });
        }
    }

    handleOutsideEmojiClick(event) {
        if (!this.pickerButton.contains(event.target) &&
            !this.picker.contains(event.target)) {
            this.setState({
                showPicker: false,
                showPickerButton: false
            });
        }
    }

    onShowPickerButtonClick() {
        this.setState({
            showPicker: !this.state.showPicker,
            showPickerButton: true
        });
    }

    patchReaction(emoji) {
        const username = this.state.currentUser;
        if (!this.state.reactions) {
            this.state.reactions = [];
        }
        const index = this.state.reactions.findIndex(
            r => r.emoji === emoji && r.username === username);
        if (index !== -1) {
            this.state.reactions.splice(index, 1);
        } else {
            this.state.reactions.push({ username, emoji });
        }
    }

    updateMessage(message) {
        this.setState({
            id: message._id,
            text: message.text,
            author: message.author,
            type: message.type,
            image: message.image,
            metadata: message.metadata,
            reactions: message.reactions
        });
    }

    onEmojiSelect(emoji) {
        this.patchReaction(emoji.id);
        this.setState({
            reactions: this.state.reactions,
            showPicker: !this.state.showPicker
        });
        const { type, text, reactions, author, date, id, metadata } = this.state;
        const message = { type, text, reactions, author,
            date, conversationId: this.props.conversationId, _id: id, metadata };
        this.socket.emit('updateMessage', message);
        updateReactions(emoji.id, this.state.id);
    }

    render() {
        return <div className='messages-container'>
            {this.state.showPicker &&
                <div className={`${this.state.position}-picker-container`}
                    ref={picker => {
                        this.picker = picker;
                    }}>
                    <Picker
                        className={`${this.state.position}-picker-window`}
                        onClick={this.onEmojiSelect}
                        showPreview={false}
                        color='lightsalmon'
                        set='emojione'
                        perLine='6'
                        set='apple'
                        style={{
                            zIndex: '100',
                            opacity: '.99',
                            transform: 'translateX(0)',
                            height: '150px',
                            overflow: 'hidden',
                            border: '2px sold #f0f'
                        }}
                        l18n={{ search: null }}
                        exclude={['recent']}
                    /></div>
            }
            <li
                className={this.state.position}>
                <div
                    className='avatar' > <img
                        onClick={() => this.setState({ isAvatarOpen: true })}
                        src={this.state.avatar}
                        draggable='false' />
                    {this.state.isAvatarOpen && (
                        <Lightbox
                            mainSrc={this.state.avatar}
                            onCloseRequest={() => this.setState({ isAvatarOpen: false })}
                            imageCaption={this.state.author}
                        />
                    )}</div>
                <div className='msg'
                    onMouseEnter={() => this.setState({ showPickerButton: true })}
                    onMouseLeave={() => this.setState({ showPickerButton: this.state.showPicker })}
                    onMouseMove={() => this.setState({ showPickerButton: true })}>
                    <a
                        className='message__user-link'
                        onClick={this.props.onTitleClick}>{this.state.author}</a>
                    {this.state.showPickerButton
                        ? <div className={`show-picker-button ${this.state.position}-picker`}
                            onClick={this.onShowPickerButtonClick}
                            ref={pickerButton => {
                                this.pickerButton = pickerButton;
                            }}
                        >&#9786; </div>
                        : <div className={`empty-div ${this.state.position}-picker`}></div>}
                    {this.state.type === 'image'
                        ? (<ImageMessage
                            image={this.state.image}
                            author={this.state.author}
                        />)
                        : null
                    }
                    <ReactMarkdown renderers={{
                        linkReference: (reference) => {
                            if (!reference.href) {
                                return `[ ${reference.children[0]} ]`;
                            }

                            return <a href={reference.$ref}>{reference.children}</a>;
                        }
                    }}
                    source={this.state.text} />
                    <time>{this.state.curTime}</time>
                    <br />
                    <Reactions
                        className='reactions'
                        reactions={this.state.reactions}
                        onEmojiSelect={this.onEmojiSelect}
                        currentUser={this.state.currentUser}
                    />
                </div>
            </li>

            {this.props.renderAddCmp()}

        </div>;
    }
}
