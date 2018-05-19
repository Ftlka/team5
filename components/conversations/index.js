import React from 'react';
import io from 'socket.io-client';
import moment from 'moment';

import Search from './Search/Search.js';
import CreateConversationModal from './CreateConversationModal/CreateConversationModal.js';
import { newMessageSound, newConversationSound, selfMessageSound } from '../../lib/sounds/sounds';
import { initVibrate } from '../../lib/Vibrator/Vibrator';
import ChatList from './ChatList/ChatList';
import './styles.css';

export default class Conversations extends React.Component {
    constructor(props) {
        super(props);

        const renamedConversations = this.changeConversationTitles(props.conversations);
        const sortedConversations = this.sortConversations(renamedConversations);
        this.state = {
            conversations: sortedConversations,
            shownConversations: sortedConversations,
            isModalOpen: false
        };

        this.setShowedConversations = this.setShowedConversations.bind(this);
        this.handleCloseModal = this.handleCloseModal.bind(this);
        this.handleOpenModal = this.handleOpenModal.bind(this);

        this.notifyAboutNewConversation = this.notifyAboutNewConversation.bind(this);
        this.notifyAboutMessage = this.notifyAboutMessage.bind(this);
        this.notifyAboutNewUser = this.notifyAboutNewUser.bind(this);
    }

    componentDidMount() {
        this.socket = io();

        this.socket.on(`conversationNewUser_${this.props.currentUser}`,
            this.notifyAboutNewConversation);

        for (const conversation of this.state.conversations) {
            this.socket.on(`message_${conversation._id}`,
                this.notifyAboutMessage);

            this.socket.on(`conversationNewUser_${conversation._id}`,
                this.notifyAboutNewUser);
        }

        setInterval(() => this.forceUpdate(), 10000);
    }

    notifyAboutMessage(message) {
        if (this.props.currentUser !== message.author) {
            newMessageSound.play();
            initVibrate('message');
        } else {
            selfMessageSound.play();
        }

        this.updateConversationTime(message.conversationId, message.date);
    }

    notifyAboutNewUser(conversation) {
        newConversationSound.play();
        this.updateConversationTime(conversation._id, conversation.updatedAt);
    }

    updateConversationTime(_id, date) {
        const conversationToUpdate = this.state.conversations
            .find(conversation => conversation._id === _id);

        if (!conversationToUpdate) {
            return;
        }

        conversationToUpdate.updatedAt = date;

        const sortedConversations = this.sortConversations(this.state.conversations);
        this.setState({
            conversations: sortedConversations,
            shownConversations: sortedConversations
        });
    }

    notifyAboutNewConversation(newConversation) {
        const alreadyExist = this.state.conversations
            .some(conversation => conversation._id === newConversation._id);

        if (alreadyExist) {
            return;
        }

        newConversationSound.play();
        initVibrate('newConversation');
        this.addNewConversation(newConversation);
    }

    addNewConversation(newConversation) {
        const newConversations = this.state.conversations.slice();

        newConversations.push(this.changeConversationTitle(newConversation));
        const sortedNewConversations = this.sortConversations(newConversations);

        this.socket.on(`message_${newConversation._id}`,
            this.notifyAboutMessage);
        this.socket.on(`conversationNewUser_${newConversation._id}`,
            this.notifyAboutNewUser);

        this.setState({
            conversations: sortedNewConversations,
            shownConversations: sortedNewConversations
        });
    }

    sortConversations(conversations) {
        const sorted = conversations.slice();
        sorted.sort((a, b) => moment(b.updatedAt).unix() - moment(a.updatedAt).unix());

        return sorted;
    }

    setShowedConversations(conversations) {
        this.setState({
            shownConversations: conversations
        });
    }

    handleOpenModal() {
        this.setState({
            isModalOpen: true
        });
    }

    handleCloseModal() {
        this.setState({
            isModalOpen: false
        });
    }

    changeConversationTitles(conversations) {
        return conversations.map(conversation => this.changeConversationTitle(conversation));
    }

    changeConversationTitle(conversation) {
        const title = !conversation.isPrivate
            ? conversation.title
            : conversation.users.filter(user => user !== this.props.currentUser)[0];

        conversation.title = title;
        conversation.avatar = `/api/avatar/${title}`;

        return conversation;
    }

    render() {
        return (
            <section className='conversations'>
                <div className='conversations__controls'>
                    <CreateConversationModal
                        isOpen={this.state.isModalOpen}
                        handleCloseModal={this.handleCloseModal}
                        currentUser={this.props.currentUser}
                    />

                    <Search
                        conversations={this.state.conversations}
                        handleFilteredConversations={this.setShowedConversations}
                    />

                    <div className='conversations__add-button' onClick={this.handleOpenModal}>
                        +
                    </div>
                </div>

                <div className='conversations__list'>
                    <ChatList
                        dataSource={this.state.shownConversations.map(conversation => {
                            conversation.date = new Date(conversation.updatedAt);

                            return conversation;
                        })}
                        onClick={this.props.onConversationClick}
                    />
                </div>
            </section>
        );
    }
}
