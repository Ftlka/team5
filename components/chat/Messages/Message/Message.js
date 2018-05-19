import React from 'react';
import MessageBox from './MessageBox/MessageBox';

import Metadata from './Metadata/Metadata.js';

export default class Message extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: props.id,
            currentUser: props.currentUser,
            text: props.text,
            type: props.type,
            imageUrl: props.imageUrl,
            author: props.author,
            reactions: props.reactions,
            date: props.date,
            metadata: props.metadata,
            onMessageTitleClick: props.onMessageTitleClick,
            saveElementForScroll: props.saveElementForScroll
        };
    }

    render() {
        const side = this.state.author === this.state.currentUser ? 'self' : 'other';

        return <div ref={this.state.saveElementForScroll}>
            <MessageBox
                currentUser={this.state.currentUser}
                id={this.state.id}
                position={side}
                avatar={`/api/avatar/${this.state.author}`}
                title={this.state.author}
                onTitleClick={() => this.state.onMessageTitleClick(this.state.author)}
                type={this.state.type}
                image={this.state.imageUrl}
                text={this.state.text}
                reactions={this.props.reactions}
                date={new Date(this.props.date)}
                conversationId={this.props.conversationId}
                renderAddCmp={() => {
                    return this.state.metadata
                        ? <Metadata metadata={this.state.metadata}
                            side={this.state.currentUser === this.state.author ? 'self' : 'other'}/>
                        : undefined;
                }}
            />
        </div>;
    }
}
