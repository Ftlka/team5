import React, { Component } from 'react';
import './styles.css';

export default class WelcomeMessage extends Component {
    render() {
        return (
            <div className='message-container'>
                <img src='static/images/welcome-racoon.png'
                    height='200' width='200' alt='Приветливый енот'/>
                <span className='message'>Создайте чат для начала общения</span>
            </div>
        );
    }
}
