const socket = io('http://localhost:8000');
socket.on('connect', () => {
    console.log('Connected to server');
});

socket.on('connect_error', (error) => {
    console.error('Connection Error:', error);
});



const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp');
const messageContainer = document.querySelector(".container");
var audio = new Audio('ping.mp3') ;

const append = (message, position) => {
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
    if(position == 'left')
    {
        audio.play() ;
    }
};

// Handling message send form submission
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInput.value.trim(); // Trim whitespace
    if (message === "") return; // Prevent sending empty messages
    append(`You: ${message}`, 'right');
    socket.emit('send', message);
    messageInput.value = ''; // Clear input field
});

// Prompt the user for their name
const name = prompt("Enter your name to join:");
if (name) {
    socket.emit('new-user-joined', name);
} else {
    alert('Name is required to join the chat.');
}

// When a new user joins
socket.on('user-joined', name => {
    append(`${name} joined the chat`, 'right');
});

// When a message is received from another user
socket.on('receive', data => {
    append(`${data.name}: ${data.message}`, 'left');
});

socket.on('user-left', name => {
    append(`${name}: left the chat`, 'left');
});


