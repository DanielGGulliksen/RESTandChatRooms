function launch() {

    document.getElementById("one").innerHTML = json.name + " is now running...";

    document.getElementById("launcher").remove();
    url = "http://localhost:5000"

    // Bot is added to list of users
    fetch(url + '/api/users', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(json)});

    // This statement allows this script to be compatible with any of the four bots initialising
    // this script. the 'json' variable is a 'user' object that varies based on which bot is
    // running the script
    switch (json.name) {
        case "Winston":
            fetch(url + '/api/room/0/users', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(json)});
        break;

        case "Julia":
            fetch(url + '/api/room/1/users', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(json)});
        break;

        case "Rick":
            fetch(url + '/api/room/0/users', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(json)});
            // adding Rick to second room
            fetch(url + '/api/room/1/users', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(json)});
        break;

        case "Rachael":
            // Rachael creates separate room for herself
            fetch(url + '/api/rooms', {method: 'POST', headers: {'Content-Type': 'application/json'}, 
            body: JSON.stringify({"name": "Room2"})});
                
            fetch(url + '/api/room/2/users', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(json)});
        break;
    }

// This fetch method retrieves the index for the bot running this script's instance so that it
// can access the server in its own name.
fetch(url + '/api/users')
.then(
    (response) => response.json())
.then((users) => {
    let botIndex = null;
    let len= Object.keys(users).length;
    let found = false;
    for (i = 0; i < len && !found; i++) {
        if (users[i].name == json.name){
            botIndex = i;
            found = true;
        }
    }
    // This fetch method retrieves the room(s) in which the running bot has been registered.
    fetch(url + '/api/rooms')
    .then(
        (response) => response.json())
    .then((rooms) => {
        let rlen= Object.keys(rooms).length;
        let ownRooms = [];
        for (let i = 0; i < rlen; i++){
            const room = rooms[i];
            if (room.users != undefined) {
                let ulen= Object.keys(room.users).length;
                for (let j = 0; j < ulen; j++){
                    if (room.users[j].name == json.name){
                        ownRooms.push(i);
                    }
                }
            }
        }
        sendMessages(botIndex, rlen, ownRooms); // add rooms dictionary
    });
});

}

let counter = 0;

// This variable defines how many times the bot will post a message
const totalIterations = 10;

// This method esentially functions as a loop.
function sendMessages(ownIndex,roomsLength, ownRooms) {         
    
    // Everything withing this function will be executued 10 times (10 = totalIterations);
    setTimeout(function() {  
        document.getElementById("response").innerHTML = "";
    
        // Iterates through all rooms indiscriminately. The bot will try to post in all existing
        // room. The server itself will prevent the bot from posting in a room in which it
        // has not been registered.
        for (let i = 0; i < roomsLength; i++){
            fetch(url + '/api/room/'+i+'/'+ownIndex+'/messages?id='+ownIndex, {method: 'POST', headers: {'Content-Type': 'application/json'}, 
                body: JSON.stringify({"content": formulate(counter)})});
        }            
        getChat(ownRooms,ownIndex);
        counter++;                 
        if (counter < totalIterations) {           
        sendMessages(ownIndex,roomsLength, ownRooms);          
  }                     
}, 5000)
}

// This method retrieves and displays all of the chats in which the running bots is a part of.
function getChat(ownRooms, ownIndex){
    
    // This loop only iterates through rooms of which the bot is a part of.
    for (let j = 0; j < ownRooms.length; j++){
            
            // This fetch method retrieves the "chat" (all messages) within a specific room.
            // It's returned values are then displayed.
            fetch(url + '/api/room/'+ownRooms[j]+'/messages?id='+ownIndex)
            .then((response) => response.json())
            .then((chat) => {
                 if (chat != undefined) {
                     let clen= Object.keys(chat).length;
                     let input = "<label>Room"+ownRooms[j]+" Chat:<label><br/><table id='"+ownRooms[j]+"'>";
                     for (let i = 0; i < clen; i++){
                         let mess = chat[i];
                         input += "<tr>" + mess.username + ": " + mess.content + "</tr><br/>";
                     }
                     document.getElementById("response").innerHTML += input + "</table>";
                 }
                 else
                     console.log("chat was undefined");
             });
    }
}