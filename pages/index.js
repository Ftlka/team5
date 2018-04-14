import React, { Component, Fragment } from 'react';

import ContactList from '../components/contacts';
import Chat from '../components/chat';
import Menu from '../components/menu';
import axios from 'axios';

export default class IndexPage extends Component {
    static async getInitialProps({ req }) {
        const res = await axios.get('http://localhost:3000/api/conversations', req);
        const contactsList = await axios.get('http://localhost:3000/api/contacts', req);

        return {
            messagesInfo: {
                'currentUser': req.user.username
            },
            conversations: res.data,
            contacts: contactsList.data,
            menu: {
                'name': req.user.username,
                'avatar': `/api/avatar/${req.user.username}`
            }
        };
    }

    constructor(props) {
        super(props);
        this.state = props;
    }

    async _onConversationClick(conversationId) {
        this.setState({
            messagesInfo: {
                'currentUser': this.state.messagesInfo.currentUser
            }
        });

        this.loadConversations(conversationId);
    }

    async loadConversations(conversationId) {
        const currentUser = this.state.messagesInfo.currentUser;
        let res = await axios.get(`api/messages/${conversationId}`,
            { withCredentials: true });

        this.setState({
            messagesInfo: {
                'conversationId': conversationId,
                'messages': res.data,
                'currentUser': currentUser
            }
        });
    }

    render() {
        const conversations = this.state.conversations;
        const messagesInfo = this.state.messagesInfo;
        const currentUser = this.props.messagesInfo.currentUser;
        const menu = this.state.menu;
        const contactsList = this.state.contacts;

        if (messagesInfo.messages) {
            return (
                <Fragment>
                    <ContactList conversations={conversations}
                        onConversationClick={this._onConversationClick.bind(this)}
                        currentUser={currentUser}
                    />
                    <Chat messagesInfo={messagesInfo}/>
                    <Menu contacts={contactsList}
                        menu={menu} />
                </Fragment>
            );
        }

        return (
            <Fragment>
                <ContactList conversations={conversations}
                    onConversationClick={this._onConversationClick.bind(this)}
                    currentUser={currentUser}
                />
                <Menu contacts={contactsList}
                    menu={menu} />
            </Fragment>
        );
    }
}
