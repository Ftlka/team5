import React from 'react';
import io from 'socket.io-client';

import { createNotPrivateConversation } from '../../../../lib/apiRequests/conversations';

import './styles.css';

import LoadingSpinner from '../../../LoadingSpinner';

export default class CreateConversationForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            handleCloseModal: props.handleCloseModal,
            inputValue: '',
            disabled: false,
            placeholder: 'Название беседы',
            displayErrorPopup: false
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleOutsideClick = this.handleOutsideClick.bind(this);
    }

    componentDidMount() {
        this.socket = io();
        document.addEventListener('click', this.handleOutsideClick); // eslint-disable-line
    }

    handleChange(event) {
        this.setState({
            inputValue: event.target.value,
            displayErrorPopup: false
        });
    }

    async handleSubmit(event) {
        event.preventDefault();

        const conversationName = this.state.inputValue;
        if (conversationName.match(/^(?=.*[a-zа-яё\d]$)[a-zа-яё\d][a-zа-яё\d-]{0,}$/i)) {
            this.setState({
                disabled: true,
                displayErrorPopup: false,
                inputValue: '',
                placeholder: 'Запрос обрабатывается'
            });
            const res = await createNotPrivateConversation(conversationName,
                [this.props.currentUser]);

            this.socket.emit('newConversation', res.data);

            this.state.handleCloseModal();
        } else {
            this.setState({
                displayErrorPopup: true
            });
        }
    }

    handleOutsideClick(event) {
        if (!this.errorPopup.contains(event.target)) {
            this.setState({
                displayErrorPopup: false
            });
        }
    }

    render() {
        return (
            <div className='create-conversation'>
                {this.state.disabled && <LoadingSpinner />}
                <form onSubmit={this.handleSubmit}>
                    <header className='create-conversation__header'>Создать беседу</header>
                    <input
                        type='text'
                        className='create-conversation__input'
                        placeholder={this.state.placeholder}
                        value={this.state.inputValue}
                        onChange={this.handleChange}
                        disabled={this.state.disabled}
                        autoFocus
                    />
                </form>
                {this.state.displayErrorPopup &&
                    <div className='error-message error-message-dialogs'
                        ref={errorPopup => {
                            this.errorPopup = errorPopup;
                        }}>
                        <div className='error-message__text'>
                            Имя должно содержать только буквы,
                        цифры и тире. Не может начинаться и заканчиваться тире.
                        </div>
                    </div>}
            </div>
        );
    }
}
