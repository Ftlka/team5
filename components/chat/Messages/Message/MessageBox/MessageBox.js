import React from 'react';
import moment from 'moment';
const ReactMarkdown = require('react-markdown');
import Lightbox from 'react-image-lightbox';
import ImageMessage from './imageMessage/imageMessage';
import { Picker } from 'emoji-mart';
import Reactions from '../MessageBox/Reactions/Reactions';

import 'emoji-mart/css/emoji-mart.css';
import './styles.css';

export default class Message extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            position: props.position,
            text: props.text,
            author: props.title,
            date: props.date,
            type: props.type,
            image: props.image,
            avatar: props.avatar,
            metadata: props.metadata,
            isAvatarOpen: false,
            onMessageTitleClick: props.onMessageTitleClick,
            saveElementForScroll: props.saveElementForScroll,
            curTime: props.date && !isNaN(props.date) && (
                moment(props.date).fromNow()
            ),
            reactions: [{ emoji: 'barber', amount: 1, self: 'pressed' },
                { emoji: 'crystal_ball', amount: 3, self: 'not-pressed' }],
            showPicker: false,
            showPickerButton: false
        };
        this.onEmojiSelect = this.onEmojiSelect.bind(this);
        this.onShowPickerButtonClick = this.onShowPickerButtonClick.bind(this);
        this.checkForZeros = this.checkForZeros.bind(this);
        this.handleEscape = this.handleEscape.bind(this);
        this.handleOutsideEmojiClick = this.handleOutsideEmojiClick.bind(this);
    }

    componentDidMount() {
        setInterval(() => {
            this.setState({
                curTime: this.state.date && !isNaN(this.state.date) && (
                    moment(this.state.date).fromNow()
                )
            });
        }, 60000);
        document.addEventListener('keydown', this.handleEscape, false); // eslint-disable-line
        document.addEventListener('click', this.handleOutsideEmojiClick); // eslint-disable-line
    }

    componentWillUnmount() {
        document.removeEventListener('keydown', this.handleEscape, false); // eslint-disable-line
        document.removeEventListener('click', this.handleOutsideEmojiClick); // eslint-disable-line
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

    isUpdated(emoji) {
        for (let reaction of this.state.reactions) {
            if (reaction.emoji === emoji && reaction.self === 'not-pressed') {
                reaction.amount++;
                reaction.self = 'pressed';

                return true;
            } else if (reaction.emoji === emoji) {
                reaction.amount--;
                reaction.self = 'not-pressed';

                return true;
            }
        }

        return false;
    }

    checkForZeros() {
        for (let i = 0; i < this.state.reactions.length; i++) {
            if (this.state.reactions[i].amount === 0) {
                this.state.reactions.splice(i, 1);

                return;
            }
        }
    }

    onEmojiSelect(emoji) {
        // здесь запрос в axois
        if (!this.isUpdated(emoji.id)) {
            this.state.reactions.push({ emoji: emoji.id, amount: 1, self: 'pressed' });
        }
        this.checkForZeros();
        this.setState({
            reactions: this.state.reactions,
            showPicker: !this.state.showPicker,
            showPickerButton: false
        });
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
                    onMouseLeave={() => this.setState({ showPickerButton: this.state.showPicker })}>
                    <a
                        className='message__user-link'
                        onClick={this.props.onTitleClick}>{this.state.author}</a>
                    {this.state.type === 'image'
                        ? (<ImageMessage
                            image={this.state.image}
                            author={this.state.author}
                        />)
                        : null
                    }
                    {this.state.showPickerButton
                        ? <div className={`show-picker-button ${this.state.position}-picker`}
                            onClick={this.onShowPickerButtonClick}
                            ref={pickerButton => {
                                this.pickerButton = pickerButton;
                            }}
                        >&#9786; </div>
                        : <div className={`empty-div ${this.state.position}-picker`}></div>}
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
                    <Reactions className='reactions' reactions={this.state.reactions} />
                </div>
            </li>

            {this.props.renderAddCmp()}

        </div>;
    }
}
