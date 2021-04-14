function launch() {

    document.getElementById("one").innerHTML = json.name + " is now running...";

    document.getElementById("launcher").remove();
    url = "http://localhost:5000"

    // Bot is added to list of users
    fetch(url + '/api/users', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(json)});

    // Adding respective bot to specific rooms
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
            body: JSON.stringify({"name": "Rachael's room"})});
                
            fetch(url + '/api/room/2/users', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(json)});
        break;
    }
/*
    fetch(url + '/api/users', {method: 'POST', headers: {'Content-Type': 'application/json'},
                               body: JSON.stringify(json)})
    .then(
        (response) => response.json())
    .then((data) => {
        //$("#response").text(JSON.stringify(data.id));
        sendMessages(data.id);
    });
*/
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
            //
        }
        sendMessages(botIndex, rlen, ownRooms); // add rooms dictionary
    });
});

//fetch(url + '/api/room/'+0+'/'+0+'/messages?id='+0, {method: 'POST', headers: {'Content-Type': 'application/json'}, 
//body: JSON.stringify({"content": formulate()})});
}

let counter = 0;

function sendMessages(ownIndex,roomsLength, ownRooms) {         
    setTimeout(function() {  
        document.getElementById("response").innerHTML = "";
    //console.log(ownIndex + ", " + roomsLength + ", " + message);
    
        for (let i = 0; i < roomsLength; i++){
            fetch(url + '/api/room/'+i+'/'+ownIndex+'/messages?id='+ownIndex, {method: 'POST', headers: {'Content-Type': 'application/json'}, 
                body: JSON.stringify({"content": formulate(counter)})});

            
                
                for (let j = 0; j < ownRooms.length; j++){
                    if (i = ownRooms[j]){
                        //console.log(i + ", " + ownRooms + ", " + ownIndex)
                        fetch(url + '/api/room/'+i+'/messages?id='+ownIndex)
                        .then((response) => response.json())
                        .then((chat) => {
                             console.log("Id:" + i + ', ' + ownRooms[j]);
                             if (chat != undefined) {
                                 let clen= Object.keys(chat).length;
                                 let input = "<table id='"+i+"'>";
                                 for (let j = 0; j < clen; j++){
                                     let mess = chat[j];
                                     input += "<tr>" + mess.username + ": " + mess.content + "</tr><br/>";
                                 }
                                 document.getElementById("response").innerHTML = input + "</table>";
                             }
                             else
                                 console.log("chat was undefined");
                         });
                    }
                }
        }            

        
        counter++;                 
        if (counter < 10) {           
        sendMessages(ownIndex,roomsLength, ownRooms);          
  }                     
}, 5000)
}

function getChat(i, ownRooms, ownIndex){
    

}