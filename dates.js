// Module for setting up dates and stuff
var Dates = (function () {
    var dates = [];

    function addDate(artistDate, map, linePositions) {
        // Get position of artistDate and create new marker for it
        var position = { lat: Number(artistDate.venue.latitude), lng: Number(artistDate.venue.longitude) };
        var marker = new google.maps.Marker({ position: position, map: map });
        linePositions.push(position);

        var dtObj = new Date(Date.parse(artistDate.datetime));
        var infowindow = new google.maps.InfoWindow({
            content: "<b>" + artistDate.venue.name + "</b> " + (dtObj.getMonth() + 1) + "/" + dtObj.getDate() + "/" + dtObj.getFullYear(),
            disableAutoPan: true
        });
        infowindow.open(map, marker);

        // Create new date object
        var newDate = {
            marker: marker,
            datetime: artistDate.datetime,
            location: artistDate.venue.name + ", " + artistDate.venue.region + ", " + artistDate.venue.country,
            infowindow: infowindow
        };

        dates.push(newDate)
    }

    function clearDates() {
        dates.forEach(function(date) {
            date.marker.setMap(null);
            date.infowindow.close();
        });
        dates = [];
    }

    function getDates() {
        return dates;
    }

    return {
        getDates: getDates,
        addDate: addDate,
        clearDates: clearDates
    }
})();