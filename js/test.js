
// AppViewModel main function


handlingAPI 
function AppViewModel(){
    var self = this ;
    // my locations 
    this.locations = [
        {title: 'SYP Congress Main Venue', location: {lat:41.1779,lng:-8.59705}},
        {title: 'Porto Airport', location: {lat:41.237,lng:-8.67153}},
        {title: 'accommodation1', location: {lat:41.1655,lng:-8.60825}},
        {title: 'accommodation2', location: {lat:41.151,lng:-8.6306}},
        {title: 'accommodation3', location: {lat:41.1742,lng:-8.60407}}
      ];
    this.searchInput = ko.observable("");
    this.markers = [];
    // creating popUps and dealing with foursquare API
    this.populateInfoWindow = function (marker, infowindow ) {
        // Check to make sure the infowindow is not already opened on this marker.
        if (infowindow.marker != marker) {
          infowindow.marker =marker;
          // Foursquare API credintials 
          clientId = "RPOWZUXIVWV2MDW0WOCBKCHFFIQKQJQ21WAR5PSMWF50N3WW";
          clientSecret = "ZGIF25ZVFH3TTVIXEWIUMGDWMZHG3OLRJ1J15JIW025XAHTC";
          var url = "https://api.foursquare.com/v2/venues/search?ll="+marker.lat+","+marker.lng+"&client_id=" + clientId +
                "&client_secret=" + clientSecret+"&v=20170708&m=foursquare"; 
                console.log(url);
                $.getJSON(url).done(function(re) {
                var response = re.response.venues[0];
                var address0 = response.location.formattedAddress[0];
                var address1 = response.location.formattedAddress[1];
                var address2 = response.location.formattedAddress[2];
                var category = response.categories[0].name;
                

                var content =
                    '<div>'
                    +'<h4>' + marker.title + '</h4>'
                    +'<h4>' + category + '</h4>'
                    + '<div>'
                    +  '<h6> Address: </h6> '
                    +  '<h8>'+address0+'</h8> <br>'
                    +  '<h8>'+address1+'</h8> <br>'
                    +  '<h8>'+address2+'</h8> <br>'
                    + '</div>'
                    + '</div>';

                infowindow.setContent(content);
            
            // handling API error 
            }).fail(function() {
                alert("unfortunatley the Foursquare API didn't load properly, please try again");
            });
            
            
          infowindow.open(map, marker);
          // Make sure the marker property is cleared if the infowindow is closed.
          infowindow.addListener('closeclick',function(){
            infowindow.setMarker = null;
          });
        }
      };  

    this.popUp = function() {
        self.populateInfoWindow(this, self.largeInfoWindow);
    };


    // loading map to the view 
    this.initMap = function () {
        map = new google.maps.Map(document.getElementById('map'), {
          center: {lat:41.1779, lng:-8.59705 },
          zoom: 12
        });   

        this.largeInfowindow = new google.maps.InfoWindow();
    
    
    for (var i = 0; i < this.locations.length; i++) {
          // Get the position from the location array.
          var position = this.locations[i].location;
          var title = this.locations[i].title;
          // Create a marker per location, and put into markers array.
          this.marker = new google.maps.Marker({
            position: position,
            lat: position.lat,
            lng:position.lng,
            title: title,
            map: map,
            animation: google.maps.Animation.DROP,
            id: i
          });
          // Push the marker to our array of markers.
          this.marker.setMap(map);

          this.markers.push(this.marker);
          // Create an onclick event to open the large infowindow at each marker.
          this.marker.addListener('click', self.popUp);

          // Two event listeners - one for mouseover, one for mouseout,
          // to change the colors back and forth.
          this.marker.addListener('mouseover', function() {
            this.setAnimation(google.maps.Animation.BOUNCE);
          });
          this.marker.addListener('mouseout', function() {
            this.setAnimation(null);
          });
        }
        for (var i = 0; i < this.markers.length; i++) {
          this.markers[i].setMap(map);
        }

    };

    this.initMap();

    this.venuesfilter = ko.computed(function() {
        var venues = [];    
        for (var i = 0; i < this.markers.length; i++) {


            var venue = this.markers[i];

            // live searching 
            if (venue.title.toLowerCase().includes(this.searchInput()
                    .toLowerCase())) {
                venues.push(venue);
                this.markers[i].setVisible(true);
            } else {
                this.markers[i].setVisible(false);
            }
        }
        return venues;
    }, this);


    


}



function handlingAPI()
 {
        alert("Google API error, please reload the page");

 };



function start()
{

    ko.applyBindings(new AppViewModel());
}