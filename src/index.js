import { ChatRoom } from './js/chat';
import { ChatUI } from './js/ui';

// DOM Queries
const chatList = document.querySelector('.chat__list');
const headingName = document.querySelector('.chat__header h2 span');
const rooms = document.querySelectorAll('.chat__rooms button');
const roomsMsg = document.querySelector('.chat__rooms .alert');
const newMessageForm = document.querySelector('.chat__actions .new-message');
const updateNameForm = document.querySelector('.chat__actions .update-name');
const updateNameFormMsg = document.querySelector('.update-name .alert');

// Check localstorage for a username
const username = localStorage.username ? localStorage.username: 'User';
headingName.innerText = username;

// Class instances
const chatUI = new ChatUI(chatList);
const chatroom = new ChatRoom('general', username);

// Get messages and render
chatroom.getMessages(data => chatUI.render(data));

// Add event listener to add message form
newMessageForm.addEventListener('submit', e => {
    e.preventDefault();
    chatroom.addMessage(newMessageForm.message.value)
        .then(() => {
            console.log('Message added');
            newMessageForm.reset();
        })
        .catch(err => console.log('Message not added', err))
})

// Add event listener to update name form
updateNameForm.addEventListener('submit', e => {
    e.preventDefault();
    chatroom.updateName(updateNameForm.name.value);
    // Update the heading text with new name
    headingName.innerText = localStorage.username;
    // Add an alert message to the user
    updateNameFormMsg.innerHTML = `Your name was updated to ${updateNameForm.name.value}.`;
    updateNameFormMsg.removeAttribute('hidden');
    setTimeout(() => { // Hide the alert after a few seconds
        updateNameFormMsg.innerText = '';
        updateNameFormMsg.setAttribute('hidden', '');
    }, 3000);
    updateNameForm.reset();
})

// Add event listener for chatrooms
rooms.forEach(button => {
    button.addEventListener('click', e => {
        e.preventDefault();
        // Change room
        chatroom.updateRoom(button.id);
        // Clear current messages
        chatUI.clear();
        // Get new messages for the new room
        chatroom.getMessages(data => chatUI.render(data));
        // Add an alert
        roomsMsg.innerText = `The chat room was updated to ${button.innerText}`;
        roomsMsg.removeAttribute('hidden');
        setTimeout(() => { // Hide alert after a few seconds
            roomsMsg.innerText = '';
            roomsMsg.setAttribute('hidden', '');
        }, 3000);
    })
})
