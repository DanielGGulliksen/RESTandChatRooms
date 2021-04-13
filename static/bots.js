function launch() {
    
    document.getElementById("one").innerHTML = json.name + " is now running...";

    document.getElementById("launcher").remove();
    url = "http://localhost:5000"
    
    // Add self to users dictionary     
    var xhr = new XMLHttpRequest();
    xhr.open("POST", url + "/api/users", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    var res = null;
    xhr.onload  = function() {
        res = xhr.response;
        $("#response").text(res);
    };
    xhr.send(JSON.stringify(json));

    switch (json.name) {
        case "Winston":
            var xhr = new XMLHttpRequest();
            xhr.open("POST", url + "/api/room/0/users", true);
            xhr.setRequestHeader("Content-Type", "application/json");
              
            xhr.onload  = function() {
                var res = xhr.response;
                $("#response").text(res);
            };
            xhr.send(JSON.stringify(json));
            break;
        case "Julia":
            var xhr = new XMLHttpRequest();
            xhr.open("POST", url + "/api/room/1/users", true);
            xhr.setRequestHeader("Content-Type", "application/json");
              
            xhr.onload  = function() {
                var res = xhr.response;
                $("#response").text(res);
            };
            xhr.send(JSON.stringify(json));
            break;
        case "Rick":
            var xhr = new XMLHttpRequest();
            xhr.open("POST", url + "/api/room/0/users", true);
            xhr.setRequestHeader("Content-Type", "application/json");
                  
            xhr.onload  = function() {
                var res = xhr.response;
                $("#response").text(res);
            };
            xhr.send(JSON.stringify(json));

            // adding Rick to second room
            var xhr = new XMLHttpRequest();
            xhr.open("POST", url + "/api/room/1/users", true);
            xhr.setRequestHeader("Content-Type", "application/json");
                  
            xhr.onload  = function() {
                var res = xhr.response;
                $("#response").text(res);
            };
            xhr.send(JSON.stringify(json));
            break;
            case "Rachael":
                var xhr = new XMLHttpRequest();
                xhr.open("POST", url + "/api/rooms", true);
                xhr.setRequestHeader("Content-Type", "application/json");
                  
                xhr.onload  = function() {
                    var res = xhr.response;
                    $("#response").text(res);
                };
                xhr.send(JSON.stringify({"name": "room2"}));

                var xhr = new XMLHttpRequest();
                xhr.open("POST", url + "/api/room/2/users", true);
                xhr.setRequestHeader("Content-Type", "application/json");
                  
                xhr.onload  = function() {
                    var res = xhr.response;
                    $("#response").text(res);
                };
                xhr.send(JSON.stringify(json));
                break;
    }
}