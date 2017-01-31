var express = require('express');

var app = express();

var server = require('http').createServer(app);

var io = require('socket.io').listen(server);

users = [];

connections = [];

server.listen();
console.log('Server running...');

// When the root director is requested, return the index.html page.
app.get('/',function(req,res){
    res.sendFile(__dirname + '/index.html');
});

//Open a connection with socket.io
io.sockets.on('connection',function(socket){
    connections.push(socket);
    console.log('Connected: %s sockets connected', connections.length);

    //Disconnect
    socket.on('disconnect',function(data){
       
        users.splice(users.indexOf(socket.username,1));
        updateUsernames();
        connections.splice(connections.indexOf(socket),1);
    console.log('Disconnected: %s sockets connected', connections.length);
    });

    //Send Message
    socket.on('send message', function(data){
        io.sockets.emit('new message',{msg:data, user:socket.username});
    });

    // New users

    socket.on('new user',function(data, callback){
        callback(true);
        socket.username = data;
        users.push(socket.username);
        updateUsernames();
    });
    
    function updateUsernames(){
        io.sockets.emit('get users',users);
    }
});