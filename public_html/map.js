var data, service, places, map, loc, infoWindow, theType, ipArray = [];
var markers = [];
var infowindow;
$(function () {
    "use strict";
    var model = {
        getIp: function () {

            $("#submit").click(function () {
                var myIp = $("#ip").val(),
                        url = "http://ip-api.com/json/" + myIp;
                $.getJSON(url, function (data) {
                    // $.each(data, function (k,v) {
                    ipArray.push(data);
                    view.init();
                });
            });
        }
    };
    var view = {
        init: function () {
            console.log(ipArray[0].city);
            var ip = ipArray[0];
            $("#output").html("<h2>" + ip.city + "</h2>" + "<br>" + "<h3>" + "Latitude:  " + ip.lat + "<br>" + "<h3>" + "Longitude:  " + ip.lon + "<input type = 'button' class = 'btn-lg btn-info' id = 'hotel' value = 'hotels'>");
            var loc = new google.maps.LatLng(ip.lat, ip.lon);
            map = new google.maps.Map(document.getElementById("map"), {
                center: loc,
                zoom: 12
            });
         
             var theType = $("#type").val();
         
             var request = {
                location: loc,
                radius: '5000',
                types: [theType]
            };
            infowindow = new google.maps.InfoWindow();
            service = new google.maps.places.PlacesService(map);
            service.nearbySearch(request, view.callback);
            service.getDetails(request, view.callback);
        },
        callback: function (results, status) {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
                for (var i = 0; i < results.length; i++) {
                    var place = results[i];
                    view.createMarker(results[i]);
                    console.log(results[i]);
                }
            }
        },
        createMarker: function (place) {
            var placeLoc = place.geometry.location;
            var marker = new google.maps.Marker({
                map: map,
                position: place.geometry.location
            });
            var newRequest = {reference: place.reference};
            service.getDetails(newRequest, function (details, status) {

                google.maps.event.addListener(marker, 'click', function () {


                    var content = "<div><h1>" + place.name + "<br>" + details.formatted_address + "<br>" + details.formatted_phone_number + "<br>" + details.website + "<br>" + details.url + "<br>" + details + "</h1>";
                    console.log(details);
                    // not all places have thumbnails
                    if (place.thumbnailImg) {
                        content += '<img src="' + details.thumbnailImg + '" />';
                    }

                    // not all places have summarys
                    if (place.summary) {
                        content += "<p>" + details.summary + "</p>";
                    }
                    infowindow.setContent(content);
                    infowindow.open(map, marker);
                });
            });
            $("<li>" + place.name + "</li>").appendTo($("#sidebar")).click(function () {
                map.panTo(placeLoc);
                infoWindow.open(map, marker);
            });
        }
    };

    window.onload = model.getIp;
});











