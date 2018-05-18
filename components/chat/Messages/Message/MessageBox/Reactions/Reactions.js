import React from 'react';
import 'emoji-mart/css/emoji-mart.css';
import './styles.css';
import { Emoji } from 'emoji-mart';
import ReactedPopup from '../ReactedPopup/ReactedPopup';

export default class Reactions extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            reactions: props.reactions
        };
        this.onReactionClick = this.onReactionClick.bind(this);
        this.update = this.update.bind(this);
        this.checkForZeros = this.checkForZeros.bind(this);
    }

    update(emoji) {
        for (let reaction of this.state.reactions) {
            if (reaction.emoji === emoji && reaction.self === 'not-pressed') {
                reaction.amount++;
                reaction.self = 'pressed';
            } else if (reaction.emoji === emoji) {
                reaction.amount--;
                reaction.self = 'not-pressed';
            }
        }
    }

    checkForZeros() {
        for (let i = 0; i < this.state.reactions.length; i++) {
            if (this.state.reactions[i].amount === 0) {
                this.state.reactions.splice(i, 1);

                return;
            }
        }
    }

    onReactionClick(emoji) {
        // тут запрос в axios
        this.update(emoji);
        this.checkForZeros();
        this.setState({
            reactions: this.state.reactions,
            showPicker: !this.state.showPicker
        });
    }

    render() {
        return (<div className='reactions'>
            {this.state.reactions.map((reaction, idx) =>
                (
                    <div key={idx} className={`container ${reaction.self}`}
                        onClick={() => this.onReactionClick(reaction.emoji)}
                        onMouseEnter={event => {
                            console.info(event.target);
                            console.info('state', this.state);
                            console.info('reacted', reaction.reacted);
                            this.setState({ [reaction.emoji]: true });
                        }}
                        onMouseLeave={() => this.setState({ [reaction.emoji]: false })}>
                        <Emoji className='emoji' key={idx} emoji={reaction.emoji} size={16} />
                        <div className='amount'>{reaction.amount}</div>
                        {this.state[reaction.emoji] &&
                            <ReactedPopup reacted={reaction.reacted.slice()}/>}
                    </div>
                )
            )}
        </div>);
    }
}
