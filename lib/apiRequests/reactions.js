import axios from 'axios';

export function updateReactions(emoji, messageId) {
    return axios.patch('/api/reactions', { emoji, messageId }, { withCredentials: true });
}
