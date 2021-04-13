const { json } = require('express');
const express = require('express');

const app = express();

app.use("/static", express.static('./static/'));

app.get('/', (req,res) => {
    res.sendFile(__dirname + "/index.html");
});

app.get('/winston', (req, res) => {
    res.sendFile(__dirname + "/static/winston.html");
});

app.get('/julia', (req, res) => {
    res.sendFile(__dirname + "/static/julia.html");
});

app.get('/rick', (req, res) => {
    res.sendFile(__dirname + "/static/rick.html");
});

app.get('/rachael', (req, res) => {
    res.sendFile(__dirname + "/static/rachael.html");
});

// This dictionary stores all users. It is accessed via the '/api/users' route.
let users = {}

// Sets incoming request bodies to be recognised as JSON objects
app.use('/api/users', express.json());

/** The following GET request definition returns the entire JSON object by default.
 *  To receive only a specific nested dictionary, one must provide the variable in
 *  the provided URI by appending '?id=1' or '?id=2', for example. 
 */
app.get('/api/users', (req, res) => {
    let id = req.query.id;

    if (id == undefined) { // Tests if 'id' was provided
        res.send(users)    // If 'id' not provided, returns the entire dictionary. (Get all)
    }
    else {
        let len= Object.keys(users).length;
        if (len == 0)
            res.send("The stored dictionary is empty.");
        else
            if (id >= len)
                res.send("The provided 'id' is out of bounds.");
            else {
                const dict = users[id]; 
                if (dict == undefined)
                    res.send("No object with ID '" + id + "' was found.");
                else
                    res.send(dict)
            }                        
    }
});

// Sets incoming request bodies to be recognised as JSON objects
//app.use('/api/users', express.json());

app.post('/api/users', (req, res) => {

    // Omitted input validation

    let len= Object.keys(users).length;
    if (len > 0) {
        let placed = false;
        for (let i = 0; i <= len && !placed; i++){
            if (users[i] == undefined){   // Tests for 'empty' indices in dictionary instead of only
                                          // appending new dictionaries to the end.
                users[i] = req.body;
                placed = true;
                //res.send(i);
                res.send("Status: " + res.statusCode + " while posting " + users[i].name + " at index: " + i);
            }
        }
    }
    else {
        users[0] = req.body;
        //res.send("0");
        res.send(res.statusCode + ": Successfully added " + users[0].name + " at index: 0");
    }
});

app.delete('/api/users', (req, res) => {
    let id = req.query.id;             // Is there a better way to delete a specific object?
    if (id == undefined) { // Tests if 'id' was provided
        res.send("The provided ID was undefined.");
    }
    else {
        let len= Object.keys(users).length;
        if (len == 0)
            res.send("The stored dictionary is empty.");
        else
            if (users[id] == undefined)
                res.send("No object with ID '" + id + "' was found.");
            else {
                users[id] = undefined;
                res.send(res.statusCode + ": Object with ID '" + id + "' was successfully deleted");
            }
    }
});



// This dictionary stores all rooms. It is accessed via the '/api/rooms' route.
let rooms = {"0": {"name": "room0"}, "1": {"name": "room1"}}

app.use('/api/rooms', express.json());

app.get('/api/rooms', (req, res) => {
    let id = req.query.id;        // Is there a better way to get a specific object?
    if (id == undefined) { // Tests if 'id' was provided
        res.send(rooms)    // If 'id' not provided, returns the entire dictionary. (Get all)
    }
    else {
        let len= Object.keys(rooms).length;
        if (len == 0)
            res.send("The stored dictionary is empty.");
        else
            if (id >= len)
                res.send("The provided 'id' is out of bounds.");
            else {
                const dict = rooms[id]; 
                if (dict == undefined)
                    res.send("No object with ID '" + id + "' was found.");
                else
                    res.send(dict)
            }                        
    }
});

app.post('/api/rooms', (req, res) => {

    // Omitted input validation

    let len= Object.keys(rooms).length;
    if (len > 0) {
        let placed = false;
        for (let i = 0; i <= len && !placed; i++){
            if (rooms[i] == undefined){   // Tests for 'empty' indices in dictionary instead of only
                                          // appending new dictionaries to the end.
                rooms[i] = req.body;
                placed = true;
                res.send("Status: " + res.statusCode + " while posting " + rooms[i].name + " at index: " + i);
            }
        }
    }
    else {
        rooms[0] = req.body;
        res.send(res.statusCode + ": Successfully added " + rooms[0].name + " at index: 0");
    }
});



app.use('/api/room/:roomid/users', express.json());

app.get('/api/room/:roomid/users', (req, res) => {
    let id = req.params.roomid;

    if (rooms[id] == undefined)
        res.send("Room with ID '" + id + "' does not exist.");
    else {
        if (rooms[id].users == undefined){
            res.send("Room with ID '" + id + "' has no list of users.");
        }
    else {
        res.send(rooms[id].users)
    }
    }
});

app.post('/api/room/:roomid/users', (req, res) => {
    let id = req.params.roomid;
    let user = req.body;

    let len= Object.keys(users).length;
    if (rooms[id] != undefined) {
        if (user != undefined) {
            if (rooms[id].users != undefined){
                rooms[id].users.push(user);
                res.send("User '" + user.name + "' was added to room with ID '" + id +"'.");
            
            }
            else {
                rooms[id].users = [user];
                res.send("User '" + user.name + "' was added to room with ID '" + id +"'.");
            }
        }
        else
            res.send("No valid JSON object was provided, a single attribute object 'name' is expected. Eg. {'name': 'Karl'}");
    }
    else
        res.send("Room with ID '" + id +"' does not exist.");
/*
    let len= Object.keys(users).length;
    if (rooms[id] != undefined) {
        if (user < len) {
            if (rooms[id].users != undefined){
                rooms[id].users.push(users[user]);
                res.send("User with ID '" + user + "' was added to room with ID '" + id +"'.");
            }
            else {
                rooms[id].users = [users[user]];
                res.send("User with ID '" + user + "' was added to room with ID '" + id +"'.");
            }
        }
        else
            res.send("The user with ID '" + user + "' does not exist.");
    }
    else
        res.send("Room with ID '" + id +"' does not exist.");
*/
});

app.get('/api/room/:roomid/messages', (req, res) => {
    let user = req.query.id;
    let roomid = req.params.roomid;
    let found = false; 
                                      // Message JSON format: {"username": "Julia", "content": "hello"}
    if(user != undefined) {
        if(rooms[roomid] != undefined) {
            
            for (var i = 0; i < rooms[roomid].users.length; i++) {
                let roomuser = rooms[roomid].users[i];
                if(users[user] == roomuser) {
                    found = true;
                }    
        }
            if(found) {
                if (rooms[roomid].messages != undefined) {
                    res.send(rooms[roomid].messages);
                }
                else {
                    res.send("Room with ID '"+roomid+"' has no messages.")
                }
            }
            else {
                res.send("Only users in this room can get messages");
            }
        }
        else {
            res.send("No room with id " + roomid + " exists")
        }
    }
    else {
        res.send("No ID provided in URL");
    }
});


app.get('/api/room/:roomid/:userid/messages', (req, res) => {
    let userid = req.params.userid;
    let roomid = req.params.roomid;
    let id = req.query.id;
    let found = false;
    const user = users[userid];
    let msgs = [];
    if (users[id] != undefined) {
    if (rooms[roomid] != undefined){
        if (rooms[roomid].users != undefined) {
            if (user != undefined) {
                if (rooms[roomid].messages != undefined) {   
                   for (var i = 0; i < rooms[roomid].users.length; i++) {
                        let roomuser = rooms[roomid].users[i];
                            if (user == roomuser){
                                found = true;
                            }       
                    }
                    if (found) {
                         
                        for (var i = 0; i < rooms[roomid].messages.length; i++){
                            if (rooms[roomid].messages[i].username == user.name)
                                msgs.push(rooms[roomid].messages[i]);
                        }
                        res.send(msgs);
                    }
                    else
                        res.send("Only users in this room can get messages");
                }
                else
                    res.send("This room has no messages.");
            }
            else
                res.send("User with ID '"+userid+"' does not exist.");
        }
        else
            res.send("The room with ID '"+ roomid +"' has no users.");
    }
    else
        res.send("No room with id " + roomid + " exists")
    }
    else
        res.send("Only registered users can make get requests, please append the ID of a valid user at the end of the URI. Eg. ...?id=0");
});

app.use('/api/room/:roomid/:userid/messages', express.json());

app.post('/api/room/:roomid/:userid/messages', (req, res) => {
    let userid = req.params.userid;
    let roomid = req.params.roomid;
    const user = users[userid];
    let msg = req.body; // expects eg. {"content": "hello"}

    if (users[id] != undefined) {
    if (rooms[roomid] != undefined) {
        if (rooms[roomid].users != undefined) {
            if (user != undefined) {
                for (var i = 0; i < rooms[roomid].users.length; i++) {
                    let roomuser = rooms[roomid].users[i];
                        if (user == roomuser){
                            found = true;
                        }    
                }
                if (found) {
                    msg.username = user.name;
                    if (rooms[roomid].messages != undefined) {
                        rooms[roomid].messages.push(msg);
                        res.send(rooms[roomid].messages);
                    }
                    else {
                        rooms[roomid].messages = [msg];
                        res.send(rooms[roomid].messages);
                    }
                }
                else
                    res.send("Only users in this room can post messages");
            }
            else
                res.send("User with ID '"+userid+"' does not exist.");
        }
        else
            res.send("The room with ID '"+ roomid +"' has no users.");
    }
    else
        res.send("No room with id " + roomid + " exists")
    }
    else
        res.send("Only registered users can make get requests, please append the ID of a valid user at the end of the URI. Eg. ...?id=0");
});


app.listen(5000, () => console.log("Listening on port 5000"));