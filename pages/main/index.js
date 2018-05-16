import React, { Component } from 'react';

import 'react-chat-elements/dist/main.css';
import Conversations from '../../components/conversations';
import Chat from '../../components/chat';
import Menu from '../../components/menu';
import WelcomeMessage from '../../components/welcomeMessage';
import io from 'socket.io-client';
import { getConversations } from '../../lib/apiRequests/conversations';
import { getContacts } from '../../lib/apiRequests/contacts';
import { getMessages } from '../../lib/apiRequests/messages';
import { initSounds } from '../../lib/sounds/sounds';

import './styles.css';

import LoadingSpinner from '../../components/LoadingSpinner';

export default class IndexPage extends Component {
    static async getInitialProps({ req }) {
        const [conversations, contactsList] = await Promise.all([
            getConversations(req), getContacts(req)]);

        const messagesInfo = {
            currentUser: req.user.username
        };

        return {
            selectedConversation: req.selectedConversation,
            messagesInfo,
            conversations: conversations.data,
            contacts: contactsList.data,
            menu: {
                'name': req.user.username,
                'avatar': `/api/avatar/${req.user.username}`,
                'link': req.user.profileUrl,
                'registered': req.user._json.created_at
            },
            loading: false
        };
    }

    constructor(props) {
        super(props);
        this.state = props;
    }

    componentDidMount() {
        this.socket = io();
        if (this.state.selectedConversation) {
            this.setState({ loading: true });
            this.loadConversations(this.state.selectedConversation);
            if (this.state.selectedConversation.addedUser) {
                this.socket.emit('conversationNewUser', {
                    conversation: this.state.selectedConversation,
                    addedUser: this.state.selectedConversation.addedUser
                });
            }

        }
        // eslint-disable-next-line
        history.pushState(null, null, '/');
        initSounds();
    }

    async _onConversationClick(conversation) {
        this.setState({
            messagesInfo: {
                'currentUser': this.state.messagesInfo.currentUser
            },
            loading: true
        });

        this.loadConversations(conversation);
    }

    async loadConversations(conversation) {
        const currentUser = this.state.messagesInfo.currentUser;
        let res = await getMessages(conversation._id);

        this.setState({
            messagesInfo: {
                'conversationId': conversation._id,
                'messages': res.data,
                'currentUser': currentUser,
                'currentConversation': conversation
            },
            loading: false
        });
    }

    render() {
        const conversations = this.state.conversations;
        const messagesInfo = this.state.messagesInfo;
        const currentUser = this.props.messagesInfo.currentUser;
        const menu = this.state.menu;
        const contactsList = this.state.contacts;
        const loading = this.state.loading;

        return (
            <div className='content-wrapper'>
                {loading ? <LoadingSpinner /> : null}
                <Conversations conversations={conversations}
                    onConversationClick={this._onConversationClick.bind(this)}
                    currentUser={currentUser}
                />
                {messagesInfo.messages
                    ? <Chat messagesInfo={messagesInfo}/>
                    : <WelcomeMessage />
                }
                <Menu contacts={contactsList}
                    menu={menu} />
            </div>
        );
    }
}
