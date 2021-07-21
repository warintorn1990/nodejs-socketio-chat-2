const express = require('express');
const socketio = require('socket.io');

const app = express();

app.set('view engine', 'ejs');

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.render("index");
});

const server = app.listen(process.env.PORT || 3000, () => {
    console.log(`Server Is Running`);
});

//Initiallize socket for server
const io = socketio(server);

io.on('connection', socket => {
    console.log('New User Connected');

    socket.username = "None";

    socket.on('change_username', data => {
        socket.username = data.username;
        console.log(socket.username);
    });

    //handle new message event
    socket.on('new_message', data => {
        console.log("new message"+ data.message);
        io.sockets.emit('receive_message', {message: data.message, username: socket.username});
    });

    socket.on('typing', data => {
        socket.broadcast.emit('typing', {username: socket.username});
    });
});

