// Import from the Firebase Application
import { initializeApp } from "firebase/app";

// Import Firestore methods
import { getFirestore, 
    collection, 
    query, 
    where, 
    orderBy, 
    addDoc, 
    serverTimestamp, 
    onSnapshot } from "firebase/firestore";

// Add firebase config from .env variables
const firebaseConfig = {
    apiKey: process.env.API_KEY,
    authDomain: process.env.AITH_DOMAIN,
    projectId: process.env.PROJECT_ID,
    storageBucket: process.env.STORAGE_BUCKET,
    messagingSenderId: process.env.MESSAGING_SENDER_ID,
    appId: process.env.APP_ID
};

// Initialise the firebase app
const app = initializeApp(firebaseConfig);

// Initialise services
const db = getFirestore();

// Our ChatRoom Class
export class ChatRoom {
    constructor(room, username) { // Constructs new ChatRoom object
        this.room = room;
        this.username = username;
        this.chats = collection(db, 'chats'); // Sets new firestore collection ref to chats
        this.unsub; // So we can store the unsub function returned from our onSnaphot
    }
    async addMessage(message) { // Add new chat messages to the collection
        return addDoc(this.chats, { 
            message: message,
            room: this.room,
            username: this.username,
            created_at: serverTimestamp() // Adds a Firestore timestamp value
        });
    }
    getMessages(callback) {
        // Setup a query for all messages from the current room
        let q = query(this.chats, where('room', '==', this.room), orderBy('created_at', 'asc'));
        // Grab this data and pass it to the callback function passed in
        this.unsub = onSnapshot(q, querySnapshot => {
            querySnapshot.docChanges().forEach(change => {
                callback(change.doc.data());
            })
        })
    }
    updateName(username) { // Allow the user to update their name
        this.username = username;
        localStorage.setItem('username', username);
    }
    updateRoom(room) { // Allow the user to uodate the room
        this.room = room;
        console.log('Room updated.');
        if(this.unsub) { // Unsub from the onSnaphot in the getMessages function
            this.unsub();
        }
    }
}