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
                native={true}
                style={{
                    width: '19vw',
                    minWidth: '180px',
                    position: 'absolute',
                    bottom: '70px',
                    right: '20px',
                    zIndex: 100
                }}
                i18n={{ categories: { recent: 'Last used' } }}
            />
        );
    }
}
