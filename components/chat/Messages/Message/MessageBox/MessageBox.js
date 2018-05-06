import React from 'react';
import moment from 'moment';
const ReactMarkdown = require('react-markdown');
import Lightbox from 'react-image-lightbox';
import ImageMessage from './imageMessage/imageMessage';
import { Picker } from 'emoji-mart';
import Reactions from '../MessageBox/Reactions/Reactions';

import 'emoji-mart/css/emoji-mart.css';
import './styles.css';

const maxAmount = 6;

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
    }

    componentDidMount() {
        setInterval(() => {
            this.setState({
                curTime: this.state.date && !isNaN(this.state.date) && (
                    moment(this.state.date).fromNow()
                )
            });
        }, 60000);
    }

    onShowPickerButtonClick() {
        this.setState({
            showPicker: !this.state.showPicker
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
        this.state.reactions.splice(maxAmount);
        this.setState({
            reactions: this.state.reactions,
            showPicker: !this.state.showPicker
        });
    }

    render() {
        return <div className="messages-container">
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
                    onMouseLeave={() => this.setState({ showPickerButton: false })}>
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
                        ? <div className="show-picker-button"
                            onClick={this.onShowPickerButtonClick}
                        >&#9786;
                        </div>
                        : null}
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
                    <Reactions className="reactions" reactions={this.state.reactions} />
                </div>
                {this.state.showPicker
                    ? <Picker
                        onClick={this.onEmojiSelect}
                        showPreview={false}
                        color='lightsalmon'
                        set='emojione'
                        perLine='6'
                        style={{
                            zIndex: '100',
                            right: '7%',
                            position: 'absolute',
                            margin: '8%',
                            top: '18px',
                            height: '150px',
                            overflow: 'hidden'
                        }}
                        l18n={{ search: null }}
                        exclude={['recent']}
                    />
                    : null
                }
            </li>
            {this.props.renderAddCmp()}

        </div>;
    }
}
