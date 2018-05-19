import React from 'react';
import List, { ListItem, ListItemText } from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import Button from 'material-ui/Button';
import copy from 'copy-to-clipboard';
import AddPersonForm from '../../AddPersonForm/AddPersonForm.js';
import Snackbar from 'material-ui/Snackbar';
import ListSubheader from 'material-ui/List/ListSubheader';


import { getConversationInfo } from '../../../../lib/apiRequests/conversations';

import './styles.css';

export default class Participants extends React.Component {
    constructor(props) {
        super(props);
        this.state = { participants: [], copied: false };
        this.updateParticipants(props.conversationId);
        this.handleClose = this.handleClose.bind(this);
    }

    async updateParticipants(conversationId) {
        const conversation = await getConversationInfo(conversationId)
            .then(res => res.data);
        // eslint-disable-next-line
        const inviteLink = conversation.isPrivate ? null : `${window.location.origin}/join/${conversationId}`;
        this.setState({
            participants: conversation.users,
            inviteLink
        });
    }

    handleClose() {
        this.setState({ copied: false });
    }

    render() {

        return (
            <div className='participants-container'>
                <ListSubheader>
                    {!this.props.currentConversation.isPrivate &&
                <AddPersonForm
                    conversationId={this.props.conversationId}
                />}
                </ListSubheader>

                {this.state.inviteLink &&
                <ListSubheader>
                    <Button onClick={()=>{
                        copy(this.state.inviteLink);
                        this.setState({ copied: true });
                    }}>
                    Скопировать ссылку на чат
                    </Button>
                </ListSubheader>
                }
                <Snackbar
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left'
                    }}
                    open={this.state.copied}
                    disableWindowBlurListener={true}
                    autoHideDuration={3000}
                    onClose={this.handleClose}
                    ContentProps={{
                        'aria-describedby': 'message-id'
                    }}
                    message={<p id='message-id'>Ссылка скопирована</p>}
                />
                <List component='nav'>
                    {this.state.participants.map((elem, idx) => {
                        return <ListItem>
                            <Button href={`/@${elem}`} className='invite-link'>
                                <Avatar>
                                    <img className='avatar_icon' src={`/api/avatar/${elem}`}/>
                                </Avatar>
                                <ListItemText key={idx} inset primary={elem}/>
                            </Button>
                        </ListItem>;
                    })}
                </List>
            </div >
        );
    }
}
