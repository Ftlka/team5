import React from 'react';
import ReactModal from 'react-modal';

import Profile from './Profile/Profile.js';

export default class ProfileModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = { self: props.username };
    }

    static getDerivedStateFromProps(nextProps) {
        return {
            showModal: nextProps.showModal,
            username: nextProps.username,
            handleCloseModal: nextProps.handleCloseModal,
            githubUrl: 'https://github.com/' + nextProps.username,
            avatarUrl: nextProps.avatarUrl
        };
    }

    render() {
        return (
            <ReactModal
                isOpen={this.state.showModal}
                onRequestClose={this.state.handleCloseModal}
                shouldCloseOnOverlayClick={true}
                style={{
                    overlay: {
                        backgroundColor: 'rgba(0,0,0,0.2)',
                        justifyContent: 'center',
                        zIndex: 1000
                    },
                    content: {
                        backgroundColor: 'rgba(0,0,0,0.0)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        margin: 'auto',
                        width: 400,
                        border: null
                    }
                }}
            >
                <Profile
                    username={this.state.username}
                    handleCloseModal={this.state.handleCloseModal}
                    githubUrl={this.state.githubUrl}
                    avatarUrl={this.state.avatarUrl}
                    self={this.state.self}
                />
            </ReactModal>);
    }
}
