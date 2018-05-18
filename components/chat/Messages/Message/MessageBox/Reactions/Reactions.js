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
        this.onEmojiSelect = props.onEmojiSelect;
    }

    render() {
        return (<div className='reactions'>
            {this.state.reactions.map((reaction, idx) =>
                (
                    <div key={idx} className={`container ${reaction.self}`}
                        onClick={() => this.onEmojiSelect({ id: reaction.emoji })}
                        onMouseEnter={() => {
                            this.setState({ [reaction.emoji]: true });
                        }}
                        onMouseLeave={() => this.setState({ [reaction.emoji]: false })}>
                        <Emoji className='emoji' key={idx} emoji={reaction.emoji} size={16} />
                        <div className='amount'>{reaction.amount}</div>
                        {this.state[reaction.emoji] &&
                            <ReactedPopup reacted={reaction.reacted
                                ? reaction.reacted.slice() : []}/>}
                    </div>
                )
            )}
        </div>);
    }
}
