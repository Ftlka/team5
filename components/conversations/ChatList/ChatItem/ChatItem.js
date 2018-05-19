import React, { Component } from 'react';
import './styles.css';

import Avatar from '../Avatar/Avatar';

const classNames = require('classnames');

export default class ChatItem extends Component {

    render() {
        return (
            <div
                className={`rce-container-citem conversation-${this.props.id}`}
                onClick={this.props.onClick}
                onContextMenu={this.props.onContextMenu}>
                <div className='rce-citem'>
                    <div className='rce-citem-avatar'>
                        <Avatar
                            src={this.props.avatar}
                            alt={this.props.alt}
                            size='medium'
                            type={classNames('circle',
                                { 'flexible': this.props.avatarFlexible })} />
                    </div>
                    <div className='rce-citem-body'>
                        <div className='rce-content-container'>
                            {!this.props.isPrivate ? <img className='rce-citem-body--group'
                                src='../../../.././static/images/group.png' />
                                : null}
                            <div className='rce-citem-body--top'>
                                <div className='rce-citem-body--top-title'>
                                    {this.props.title}
                                </div>
                            </div>
                        </div>
                        <div className='rce-citem-body--bottom'>
                            <div className='rce-citem-body--bottom-message'>
                                {this.props.lastUpdated}
                            </div>
                            <div className='rce-citem-body--bottom-unread'>
                                {
                                    this.props.unreadCount > 0 &&
                                    <span>{this.props.unreadCount}</span>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
