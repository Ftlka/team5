import React from 'react';
import { Dropdown } from 'react-chat-elements';
import { Button } from 'react-chat-elements';

import ProfileModal from '../../ProfileModal/ProfileModal';
import './styles.css';

export default class Contacts extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showProfileModal: false
        };

        this.onContactSelect = this.onContactSelect.bind(this);
        this.handleCloseProfileModal = this.handleCloseProfileModal.bind(this);
    }

    static getDerivedStateFromProps(nextProps) {
        return {
            contactList: nextProps.contactList
        };
    }

    onContactSelect(index) {
        this.setState({
            showProfileModal: true,
            selectedContactUsername: this.state.contactList[index]
        });
    }

    handleCloseProfileModal() {
        this.setState({ showProfileModal: false });
    }

    render() {
        return (
            <div className='contacts'>
                {this.state.contactList.length
                    ? <Dropdown
                        buttonProps={{ text: 'Контакты' }}
                        items={this.state.contactList}
                        onSelect={this.onContactSelect}
                    />
                    : <Button
                        text={'Нет контактов' }
                    />}

                <ProfileModal
                    showModal={this.state.showProfileModal}
                    username={this.state.selectedContactUsername}
                    avatarUrl={`/api/avatar/${this.state.selectedContactUsername}`}
                    handleCloseModal={this.handleCloseProfileModal}
                />
            </div>
        );
    }
}
