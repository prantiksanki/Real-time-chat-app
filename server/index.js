const io = require('socket.io')(8000, {
    cors: {
        origin: "*",  
        methods: ["GET", "POST"]
    }
});
const users = {};

io.on('connection', socket => {
     socket.on('new-user-joined', name => {
        console.log("New user", name);
        users[socket.id] = name;
        socket.broadcast.emit('user-joined', name);  
    });

     socket.on('send', message => {
        socket.broadcast.emit('receive', { message: message, name: users[socket.id] });  
    });
    socket.on('disconnect', () => {
        if(users[socket.id]) {
            socket.broadcast.emit('user-left', users[socket.id]);
            delete users[socket.id];
        }
    });
    

});
