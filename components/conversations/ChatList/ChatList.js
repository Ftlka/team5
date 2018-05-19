import React, { Component } from 'react';
import './styles.css';
import moment from 'moment';
moment.locale('ru');

import ChatItem from './ChatItem/ChatItem';

export default class ChatList extends Component {

    onClick(item, idx, event) {
        if (this.props.onClick instanceof Function) {
            this.props.onClick(item, idx, event);
        }
    }

    onContextMenu(item, idx, event) {
        event.preventDefault();
        if (this.props.onContextMenu instanceof Function) {
            this.props.onContextMenu(item, idx, event);
        }
    }

    render() {
        return (
            <div
                ref={this.props.cmpRef}
                className={`rce-container-clist ${this.props.className}`}>
                {
                    this.props.dataSource.map((elem, idx) => (
                        <ChatItem
                            id={elem._id}
                            key={idx}
                            avatar={elem.avatar}
                            title={elem.title}
                            isPrivate={elem.isPrivate}
                            lastUpdated={moment(elem.updatedAt).fromNow()}
                            onContextMenu={event => this.onContextMenu(elem, idx, event)}
                            onClick={() => this.onClick(elem, idx)} />
                    ))
                }
            </div>
        );
    }
}
