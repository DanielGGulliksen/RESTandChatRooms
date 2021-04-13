function launch() {
    
    document.getElementById("one").innerHTML = json.name + " is now running...";

    document.getElementById("launcher").remove();
    url = "http://localhost:5000"
    
    // Add self to users dictionary     
    var xhr = new XMLHttpRequest();
    xhr.open("POST", url + "/api/users", true);
    xhr.setRequestHeader("Content-Type", "application/json");
      
    xhr.onload  = function() {
        var res = xhr.response;
        $("#response").text(res);
    };
    xhr.send(JSON.stringify(json));

    switch (json) {
        case "Winston":
            
        break;
    }
}