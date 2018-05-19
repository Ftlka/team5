import React from 'react';
import moment from 'moment';
const ReactMarkdown = require('react-markdown');
import Lightbox from 'react-image-lightbox';
import ImageMessage from './imageMessage/imageMessage';

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
            )
        };
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


    render() {
        return <div>
            <li
                className = {this.state.position} >
                <div
                    className = 'avatar' > <img
                        onClick={() => this.setState({ isAvatarOpen: true })}
                        src = {this.state.avatar}
                        draggable = 'false'/>
                    {this.state.isAvatarOpen && (
                        <Lightbox
                            mainSrc={this.state.avatar}
                            onCloseRequest={() => this.setState({ isAvatarOpen: false })}
                            imageCaption = {this.state.author}
                        />
                    )}</div>
                <div className='msg'>
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
                </div>
            </li>
            {this.props.renderAddCmp()}

        </div>;
    }
}
