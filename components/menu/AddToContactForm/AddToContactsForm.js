import React from 'react';
import io from 'socket.io-client';

import { createContact } from '../../../lib/apiRequests/contacts';
import { createPrivateConversation } from '../../../lib/apiRequests/conversations';

import './styles.css';

export default class AddToContactsForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            inputValue: '',
            placeholder: 'Добавить новый контакт',
            disabled: false,
            displayErrorPopup: false
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.escFunction = this.escFunction.bind(this);
        this.handleOutsideClick = this.handleOutsideClick.bind(this);
    }

    componentDidMount() {
        this.socket = io();
        document.addEventListener('keydown', this.escFunction, false); // eslint-disable-line
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

        const contactName = this.state.inputValue;
        if (contactName.match(/^(?=.*[a-zа-яё\d]$)[a-zа-яё\d][a-zа-яё\d-]{0,}$/i)) {
            this.setState({
                disabled: true,
                displayErrorPopup: false,
                placeholder: 'Запрос обрабатывается',
                inputValue: ''
            });

            const [contactRes, conversationRes] = await Promise.all([
                createContact(contactName),
                createPrivateConversation(this.props.currentUser, contactName)
            ]);

            if (!contactRes.data.error) {
                this.handleGoodResponse(contactRes);
            } else {
                this.handleBadResponse(contactRes.data.error);
            }

            if (!conversationRes.data.error) {
                this.socket.emit('newConversation', conversationRes.data);
            }
        } else {
            this.setState({ displayErrorPopup: true });
        }
    }

    handleGoodResponse(contactRes) {
        this.setState({
            inputValue: '',
            placeholder: 'Добавить новый контакт',
            disabled: false
        });

        this.props.handleNewContact(contactRes.data);
    }

    handleBadResponse(error) {
        this.setState({
            inputValue: '',
            placeholder: error.message,
            disabled: false
        });
    }

    escFunction(event) {
        if (event.keyCode === 27) {
            this.setState({
                displayErrorPopup: false
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
            <form className='add-contact-form' onSubmit={this.handleSubmit}>
                <input className='add-contact-form__input' type='text'
                    placeholder={this.state.placeholder}
                    value={this.state.inputValue}
                    onChange={this.handleChange}
                    disabled={this.state.disabled}
                    required={true}
                />
                {
                    this.state.displayErrorPopup &&
                    <div className='error-message error-message-contacts'
                        ref={errorPopup => {
                            this.errorPopup = errorPopup;
                        }}>
                        <div className='error-message__text'>
                            Имя должно содержать только буквы,
                        цифры и тире. Не может начинаться и заканчиваться тире.
                        </div>
                    </div>
                }
            </form>
        );
    }
}
