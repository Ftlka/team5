import React, { Component } from 'react';
import './styles.css';

export default class WelcomeMessage extends Component {
    constructor(props) {
        super(props);
        this.hasChats = props.conversations && props.conversations.length > 0;
    }

    render() {
        const hintWord = this.hasChats ? 'Выберите' : 'Создайте';

        return (
            <div className='message-container'>
                <img className='message__icon' src='static/images/welcome-racoon.png'
                    height='200' width='200' alt='Приветливый енот'/>
                <span className='message'>{`${hintWord}`} чат для начала общения</span>
            </div>
        );
    }
}
