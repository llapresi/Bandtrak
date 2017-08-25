window.onload = function () {
    // IIFE
    (function () {
        var map; // initialize map
        var path; // Gmaps path to draw

        // HTML references
        var form = document.querySelector("#search_form");
        var searchBox = document.querySelector("#band_search");
        var dateDisplay = document.querySelector("#dates");

        // Use google loader to user IIFE stuff
        google.load("maps", "3", {
            other_params: 'key=AIzaSyAAPdkJbYv_kWQyArcYQc1W1u7tGFnn_8M', callback: function () {

                // Initial map information
                var mapOptions = {
                    center: { lat: 0, lng: 0 },
                    zoom: 3,
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                };

                map = new google.maps.Map(document.getElementById('mapdiv'), mapOptions);
            }
        });

        window.addEventListener('popstate', function (e) {
            searchBox.value = e.state.search;
            doSearch(false);
        });

        function doSearch(changeState) {
            // Get text of input field
            var artistToSearch = searchBox.value;

            if(changeState) {
                var stateObj = { search: searchBox.value };
                //history.pushState(stateObj, artistToSearch + " - Bandtrack", "/");
                // Fix for banjo
                history.pushState(stateObj, artistToSearch + " - Bandtrack", "/lxl6996/330/projects/bandtrak/");
            }

            // Make our search 
            Bandsintown.search(artistToSearch, function (data) {
                // List of positions to draw line with
                var linePositions = [];

                // Clear current list of dates
                Dates.clearDates();
                dateDisplay.innerHTML = "<h2>No upcoming dates found</h2>"

                // For each event
                if (data !== 0) {
                    data.forEach(function (artistDate) {
                        Dates.addDate(artistDate, map, linePositions);
                    });

                    // Update the dateList
                    updateDateDisplay();

                    // Clear path if it already exists
                    if (path)
                        path.setMap(null);

                    // Draw polyline
                    path = new google.maps.Polyline({
                        path: linePositions,
                        geodesic: false,
                        strokeColor: '#FF0000',
                        strokeOpacity: 1.0,
                        strokeWeight: 2
                    });
                    path.setMap(map);

                    // Hack to automatically select the first datedisplay object
                    dateDisplay.children[0].click();
                }
            });
        }

        // Bind search bar to band search function
        form.addEventListener('submit', event => {
            // Otherwise the form will be submitted
            event.preventDefault();
            doSearch(true);
        });

        function updateDateDisplay() {
            // Clear HTML list of dates
            dateDisplay.innerHTML = "";

            // Add each date to the date display
            Dates.getDates().forEach(function (date) {
                // Make div for each date
                var dateToAdd = document.createElement("div");

                // Make date object and write info to the new DIV
                var dtObj = new Date(Date.parse(date.datetime));
                dateToAdd.innerHTML += "<h3>" + (dtObj.getMonth() + 1) + "/" + dtObj.getDate() + "/" + dtObj.getFullYear() + "</h3>";
                dateToAdd.innerHTML += "<p>" + date.location + "</p>";

                // Create onclick handler for each div in the left select menu
                dateToAdd.onclick = function () {
                    // Set map position to selected date
                    map.panTo(date.marker.position);
                    map.setZoom(7);
                    resetDateDisplay();
                    this.className = "date selected";
                };
                dateDisplay.appendChild(dateToAdd);
            });
        }

        // Sets the selected date in the HTML list
        function resetDateDisplay() {
            for (var i = 0; i < dateDisplay.children.length; i++) {
                dateDisplay.children[i].className = "date";
            }
        }

    })();
};