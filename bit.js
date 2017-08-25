// Module for making requests to bandsintown API
var Bandsintown = (function () {
    var appId = "Bandtrak";
    var xhr = new XMLHttpRequest();
    
    function search(artistName, callback) {
        xhr.onload = function() {
            var ourJSON = JSON.parse(xhr.responseText);
            if(ourJSON.length !== 0)
                callback(ourJSON);
            else
                callback(0);
        }
        xhr.open("GET", "https://rest.bandsintown.com/artists/" + artistName + "/events?app_id=" + appId, true);
        xhr.send();
    }

    return {
        search: search
    }
})();