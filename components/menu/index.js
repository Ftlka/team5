import React from 'react';

import AddToContactsForm from './AddToContactForm/AddToContactsForm.js';
import ProfileModal from '../ProfileModal/ProfileModal.js';
import Contacts from './Contacts/Contacts.js';
import AlarmClockModal from './AlarmClockModal/AlarmClockModal';

import './styles.css';

export default class Menu extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            avatarUrl: props.menu.avatar,
            name: props.menu.name,
            contactList: props.contacts,
            link: props.menu.link,
            registered: props.menu.registered
        };

        this.handleOpenProfileModal = this.handleOpenProfileModal.bind(this);
        this.handleCloseProfileModal = this.handleCloseProfileModal.bind(this);
        this.handleNewContact = this.handleNewContact.bind(this);
        this.handleOpenAlarmClockModal = this.handleOpenAlarmClockModal.bind(this);
        this.handleCloseAlarmClockModal = this.handleCloseAlarmClockModal.bind(this);
    }

    handleOpenProfileModal() {
        this.setState({ showProfileModal: true });
    }

    handleCloseProfileModal() {
        this.setState({ showProfileModal: false });
    }

    handleOpenAlarmClockModal() {
        this.setState({ showAlarmClockModal: true });
    }

    handleCloseAlarmClockModal() {
        this.setState({ showAlarmClockModal: false });
    }

    handleNewContact(contact) {
        const newContacts = this.state.contactList.slice();
        newContacts.push(contact);

        this.setState({
            contactList: newContacts
        });
    }

    render() {

        return (
            <div className='menu'>
                <ProfileModal
                    showModal={this.state.showProfileModal}
                    username={this.state.name}
                    handleCloseModal={this.handleCloseProfileModal}
                    avatarUrl={this.state.avatarUrl}
                />

                <AlarmClockModal
                    showModal={this.state.showAlarmClockModal}
                    handleCloseModal={this.handleCloseAlarmClockModal}
                />

                <div className='menu__avatar-wrapper'>
                    <img
                        className='menu__avatar-img'
                        src={this.state.avatarUrl}
                        onClick={this.handleOpenProfileModal}
                        draggable='false'
                    />
                </div>

                <div className='menu__username'>
                    {this.state.name}
                </div>

                <Contacts
                    contactList={this.state.contactList}
                />

                <AddToContactsForm
                    handleNewContact={this.handleNewContact}
                    currentUser={this.state.name}
                />

                <button
                    className="menu__alarm-clock-button"
                    type="button"
                    onClick={this.handleOpenAlarmClockModal}
                >
                    Будильник!
                </button>
            </div>
        );
    }
}
