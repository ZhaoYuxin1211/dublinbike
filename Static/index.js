function addMarkers(data) {
  console.log(data);
  const stations = data.stations;

  stations.forEach((station) => {
    var markerIcon = "";

    if (station.availableBikes >= 0 && station.availableBikes <= 5) {


      markerIcon = {
        path: google.maps.SymbolPath.CIRCLE,
        fillColor: 'red',
        fillOpacity: 0.8,
        strokeColor: 'white',
        strokeWeight: 1,
        scale: 12,
      };

    } else if (station.availableBikes > 5 && station.availableBikes <= 10) {
      markerIcon = {
        path: google.maps.SymbolPath.CIRCLE,
        fillColor: 'orange',
        fillOpacity: 0.8,
        strokeColor: 'white',
        strokeWeight: 1,
        scale: 12,
      };
       // markerIcon = "https://i.postimg.cc/HnRsbFjZ/map.png";
      // markerIcon = "http://maps.google.com/mapfiles/ms/icons/green-dot.png";
    } else {
       markerIcon = {
        path: google.maps.SymbolPath.CIRCLE,
        fillColor: 'green',
        fillOpacity: 0.8,
        strokeColor: 'white',
        strokeWeight: 1,
        scale: 12,
      };
       // markerIcon = "https://i.postimg.cc/HnRsbFjZ/map.png";
      // markerIcon = "http://maps.google.com/mapfiles/ms/icons/blue-dot.png";


    }

    var marker = new google.maps.Marker({
      position: {
        lat: Number(station.positionLat),
        lng: Number(station.positionLng),
      },
      map: map,
      title: station.name,
      station_number: station.number,
      icon: markerIcon,
      // set the available bikes as the marker label
      label: {
        text: station.availableBikes.toString(),
        color: '#ffffff', // set the color of the label to white
        fontSize: '10px', // set the font size of the label to 14px
        fontWeight: 'bold' // set the font weight of the label to bold
      }
    });

    // creates markers with info box with information
    var infoWindow = new google.maps.InfoWindow({
      content:
        '<div id="content"><h4>' +
        station.name +
        "</h4></div>" +
        '<div id="station_status"><h6>' +
        "Station Status:" +
        station.status +
        "</h6></div>" +
        '<div id="station_availability"><h6>' +
        "Avilabilable Bikes:" +
        station.availableBikes +
        "</h6></div>",
    });

    // makes the info box if you mouseover the box
    marker.addListener("mouseover", function () {
      if (infoWindow.getMap() == null) {
        // infoWindow is not open
        infoWindow.open(map, marker);
      } else {
        // infoWindow is open, close it
        infoWindow.close();
      }
    });
    // makes the info box close when mouseout
    marker.addListener("mouseout", function () {
      infoWindow.close();
    });
     // click the marker,zoom the map and  set marker position as the center of the map
     marker.addListener('click', function() {
      map.setZoom(17); // set zoom level to 17
      map.setCenter(marker.getPosition()); // set marker position as the center of the map
       document.getElementById("search-input").value = station.name;
        // Retrieve information for station
      var stationName = this.getTitle();
      var availableBikes = station.availableBikes;
      var availableBikeStands = station.availableBikeStands;

    // Create and display div element
    var div = document.createElement('div');
    div.innerHTML = '<p>' + stationName + '</p><p>Available Bikes: ' + availableBikes + '</p><p>Available Bike Stands: ' + availableBikeStands + '</p>';
    document.body.appendChild(div);


    });
  });
}

//other pop up

function getStations() {
  fetch("/stations")
    .then((response) => response.json())
    .then((data) => {
      console.log("fetch response", data);
      addMarkers(data);
    });
}

function initMap() {
  const dublin = { lat: 53.35014, lng: -6.266155 };
  // The map, centered at Dublin
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 14,
    center: dublin,
    styles: [
      {
        featureType: "all",
        stylers: [
          {
            saturation: 0,
          },
          {
            hue: "#e3f2fd",
          },
        ],
      },
      {
        featureType: "road",
        stylers: [
          {
            saturation: -70,
          },
        ],
      },

      {
        featureType: "transit",
        stylers: [
          {
            visibility: "off",
          },
        ],
      },

      {
        featureType: "poi",
        stylers: [
          {
            visibility: "off",
          },
        ],
      },
      {
        featureType: "water",
        stylers: [
          {
            visibility: "simplified",
          },
          {
            saturation: -60,
          },
        ],
      },
    ],
  });

  getStations();
}

var map = null;
window.initMap = initMap;
