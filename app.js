const express = require('express');

const app = express();

//Explicitly sets a static root to the 'static' directory in order to load additional JS scripts.
app.use("/static", express.static('./static/'));


// The following get methods return HTML templates in order to employ HTML scripts
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

/** Sets incoming request bodies to be recognised as JSON objects.
*   This only applies to the specified route.
*/
app.use('/api/users', express.json());

/** The following GET request definition returns the entire JSON object by default.
 *  To receive only a specific nested dictionary, one must provide the variable in
 *  the provided URI by appending '?id=1' or '?id=2', for example. 
 */
app.get('/api/users', (req, res) => {
    let id = req.query.id;   /* req.query in Express is used to query appended parameters from a 
                             *  URI. Eg.  42 from ?id=42.
                             */
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

app.post('/api/users', (req, res) => {

    let len= Object.keys(users).length;
    if (len > 0) {
        let placed = false;
        for (let i = 0; i <= len && !placed; i++){
            if (users[i] == undefined){   /** Tests for 'empty' objects in the 'users'dictionary instead of 
                                          *   only appending new dictionaries to the end. This is to prevent
                                          *   having 'gaps' in the dictionary
                                          */

                users[i] = req.body; // In this case. 'req.body' is used to collect a JSON object.
                placed = true;
                res.send({"id":i, "response": "User '" + users[i].name + "' was successfully posted at index " + i});
            }
        }
    }
    else {
        users[0] = req.body; 
        res.send({"id":0, "response": "User '" + users[0].name + "' was successfully posted at index " + 0});
    }
});

app.delete('/api/users', (req, res) => {
    let id = req.query.id;             
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
let rooms = {"0": {"name": "Room0"}, "1": {"name": "Room1"}}

app.use('/api/rooms', express.json());

app.get('/api/rooms', (req, res) => {
    let id = req.query.id;        /** Queries for an appended '?id=X'. This query requires the provided
                                  *   parameter to specifically be called 'id'.
                                  */

    if (id == undefined) { // Tests if 'id' was provided
        res.send(rooms)    // If 'id' not provided, returns the entire dictionary. (Get all)
    }
    else {   // The ID was defined, so a specific object is to be returned.
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

app.delete('/api/rooms', (req, res) => {
    let id = req.query.id;             
    if (id == undefined) { // Tests if 'id' was provided
        res.send("The provided room ID was undefined.");
    }
    else {
        let len= Object.keys(rooms).length;
        if (len == 0)
            res.send("The stored dictionary is empty.");
        else
            if (rooms[id] == undefined)
                res.send("No object with ID '" + id + "' was found.");
            else {
                rooms[id] = undefined;
                res.send(res.statusCode + ": Object with ID '" + id + "' was successfully deleted");
            }
    }
});



app.use('/api/room/:roomid/users', express.json());

/** Returns a list (array) of users that have been added to the 'users' array of a specific room.
*   'room[id].users' equals an array of user objects within a room dictionary. The
*   room has an ID/index equal to the value of the 'id' parameter.
*/
app.get('/api/room/:roomid/users', (req, res) => {
    let id = req.params.roomid; /** 'req.params' in Express is used to collect a parameter provided
                                *   within the URI. It is counterpart to req.query. However
                                *   it must always be defined.
                                */
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

// Adds a user object to a specific room
app.post('/api/room/:roomid/users', (req, res) => {
    let id = req.params.roomid;
    let user = req.body; // A 'user' JSON object.

    let len= Object.keys(users).length;
    if (rooms[id] != undefined) {
        if (user != undefined) {
            let found = false;
            for (let i = 0; i < len; i ++){
                if (users[i].name == user.name)   /** The equivalency of two JSON objects is found on
                                                  *   the basis of the 'name' attribute. If the objects have
                                                  *   the same name, then they are considered equal.
                                                  */
                    found = true;
            }
            if (found) {
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
                res.send("User '"+user.name+"' could not be added, because it is not within the list of registered users.");
        }
        else
            res.send("No valid JSON object was provided, a single attribute object 'name' is expected. Eg. {'name': 'Karl'}");
    }
    else
        res.send("Room with ID '" + id +"' does not exist.");
});

// This method returns all of of the messages within a specific room. An example of a single 'message'
// object would be: {"username": "Julia", "content": "hello"}
app.get('/api/room/:roomid/messages', (req, res) => {
    let user = req.query.id;   /** Queries for an appended '?id=X'. This query requires the provided
                               *   parameter to specifically be called 'id'. In this case the parameter
                               *   must be received and validated. This is for security purposes; to
                               *   ensure only existing room members can GET messages.
                               */
    let roomid = req.params.roomid;
    let found = false; 
    if(user != undefined) {
        if(users[user] != undefined) {
            if(rooms[roomid] != undefined) {
                if (rooms[roomid].users != undefined) {
                    for (var i = 0; i < rooms[roomid].users.length; i++) { // This loop verifies whether the 
                        let roomuser = rooms[roomid].users[i];             // user is a member of the room.
                        if(users[user].name == roomuser.name) {
                            found = true;
                        }    
                    }
                    if(found) {
                        if (rooms[roomid].messages != undefined) {
                            res.send(rooms[roomid].messages);
                        }
                        else {
                            res.send([]);  // In this method, a string cannot be returned since an array is expected
                                           // by the bots. An empty array was returned for practicality.
                        }
                    }
                    else {
                        res.send("Only users in this room can get messages");
                    }
                }
                else {
                    res.send("Room has no users.");    
                }
            }
            else
                res.send("No room with ID " + roomid + " exists");
        }
        else
            res.send("No user with ID '" + user + "' exists.");
    }
    else {
        res.send("No ID provided in URL");
    }
});

// Returns all of the messages sent by a specific user in a specific room.
app.get('/api/room/:roomid/:userid/messages', (req, res) => {
    let userid = req.params.userid;
    let roomid = req.params.roomid;
    let id = req.query.id;  // This method only allows room members to make this GET request.
    let found = false;
    let idFound = false;
    const user = users[userid];
    let msgs = [];

    if (id != undefined && users[id] != undefined) {
    if (rooms[roomid] != undefined){
        if (rooms[roomid].users != undefined) {
            if (user != undefined) {
                if (rooms[roomid].messages != undefined) {   
                   for (var i = 0; i < rooms[roomid].users.length; i++) {
                        let roomuser = rooms[roomid].users[i];
                            if (user.name == roomuser.name){
                                found = true;
                            }
                            if (users[id].name == roomuser.name){ 
                                idFound = true;
                            }
                    }
                    if (idFound) {
                        if (found) {
                            for (var i = 0; i < rooms[roomid].messages.length; i++){
                                if (rooms[roomid].messages[i].username == user.name)
                                    msgs.push(rooms[roomid].messages[i]);
                            }
                            res.send(msgs);
                        }
                        else
                            res.send("Cannot get messages for a user that is not in the room");
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

//This allows a room user to post a message to a specific room. An ID at the end of the URI is requested.
// Both of the provided user IDs in the URI must match to avoid on user posting in anothers name.
app.post('/api/room/:roomid/:userid/messages', (req, res) => {
    let userid = req.params.userid;
    let roomid = req.params.roomid;
    let id = req.query.id;
    let found = false;
    let idFound = false;
    const user = users[userid];
    let msgs = [];

    if (id != undefined && users[id] != undefined) {
    if (rooms[roomid] != undefined){
    if (userid == id) {
        if (rooms[roomid].users != undefined) {
            if (user != undefined) {  
                   for (var i = 0; i < rooms[roomid].users.length; i++) {
                        let roomuser = rooms[roomid].users[i];
                            if (user.name == roomuser.name){
                                found = true;
                            }
                            if (users[id].name == roomuser.name){
                                idFound = true;
                            }
                    }
                    if (idFound) {
                        if (found) {
                            let msg = req.body;
                            msg.username = user.name;
                            if (rooms[roomid].messages != undefined) {
                                rooms[roomid].messages.push(msg);   // Instead of storing a list of all of the messages
                                res.send(rooms[roomid].messages);   // for each user. The lists are generated and returned
                            }                                       // on request. This is to avoid storing duplicate
                            else {                                  // data.
                                rooms[roomid].messages = [msg];
                                res.send(rooms[roomid].messages);
                            }
                        }
                        else
                            res.send("Cannot get messages for a user that is not in the room");
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
        res.send("Both provided ID's must match in order to avoid users from posting in anothers name");
    }
    else
        res.send("No room with id " + roomid + " exists")
    }
    else
        res.send("Only registered users can make get requests, please append the ID of a valid user at the end of the URI. Eg. ...?id=0");
});


app.listen(5000, () => console.log("Listening on port 5000"));