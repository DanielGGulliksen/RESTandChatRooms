const { json } = require('express');
const express = require('express');

const app = express();

app.get('/', (req,res) => {
    res.send("Working");
});


// This dictionary stores all users. It is accessed via the '/api/users' route.
let users = {}

/** The following GET request definition returns the entire JSON object by default.
 *  To receive only a specific nested dictionary, one must provide the variable in
 *  the provided URI by appending '?id=1' or '?id=2', for example. 
 */
app.get('/api/users', (req, res) => {
    let id = req.query.id;
    if (id == undefined) { // Tests if 'id' was provided
        res.send(users)
    }
    else {
    let len= Object.keys(users).length;
    if (id >= len)
        res.send("The provided 'id' is out of bounds.");
    else
        if (len > 0) {
            let found = false;
            for (let i = 0; i < len && !found; i++) {
                if (i = id) {
                    res.send(users[i]);
                    found = true;
                }
            }
        }    
        else res.send(users);
    }
});

// Sets incoming request bodies to be recognised as JSON objects
app.use('/api/users', express.json());

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
                res.send("Status: " + res.statusCode + " while posting " + users[i].name + " at index: " + i);
            }
        }
    }
    else {
        users[0] = req.body;
        res.send(res.statusCode + ": Successfully added " + users[0].name + " at index: 0");
    }
});

app.listen(5000);