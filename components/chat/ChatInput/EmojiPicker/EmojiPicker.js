import React from 'react';
import { Picker } from 'emoji-mart';

import './styles.css';

export default class EmojiPicker extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    static getDerivedStateFromProps(nextProps) {
        return {
            recentEmoji: nextProps.recentEmoji,
            onEmojiSelect: nextProps.onEmojiSelect
        };
    }

    render() {
        return (
            <Picker
                recent={this.state.recentEmoji.length
                    ? this.state.recentEmoji
                    : ['smiley']
                }
                onClick={this.state.onEmojiSelect}
                showPreview={false}
                color='lightsalmon'
                style={{
                    width: '15em',
                    minWidth: '180px',
                    position: 'absolute',
                    bottom: '70px',
                    right: '20px',
                    zIndex: 100
                }}
                emojisToShowFilter={(emoji)=>Boolean(emoji.added_in <= 8)}
                native={true}
                i18n={{ categories: { recent: 'Last used' } }}
            />
        );
    }
}
