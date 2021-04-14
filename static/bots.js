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
        sendMessages(botIndex, rlen);
    });
});

//fetch(url + '/api/room/'+0+'/'+0+'/messages?id='+0, {method: 'POST', headers: {'Content-Type': 'application/json'}, 
//body: JSON.stringify({"content": formulate()})});
}

let counter = 0;

function sendMessages(ownIndex,roomsLength) {         
  //fetch(url + '/api/room/'+0+'/'+ownIndex+'/messages?id='+ownIndex, {method: 'POST', headers: {'Content-Type': 'application/json'}, 
  //            body: JSON.stringify({"content": formulate()})});
       
    setTimeout(function() {  

    //console.log(ownIndex + ", " + roomsLength + ", " + message);
       
        for (let i = 0; i < roomsLength; i++){
          fetch(url + '/api/room/'+i+'/'+ownIndex+'/messages?id='+ownIndex, {method: 'POST', headers: {'Content-Type': 'application/json'}, 
              body: JSON.stringify({"content": formulate()})});
        //  .then((response) => response.json());
       //   .then((data) => { 
       //   //sendMessages(data.id);
       //   });
          //console.log("Message posted: " + message);
        }
  counter++;                 
  if (counter < 10) {           
    sendMessages(ownIndex,roomsLength);          
  }                     
}, 5000)
}