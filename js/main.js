(function() {
  $(document).ready(function() {
    var initialize;
    initialize = function() {
      var MY_MAPTYPE_ID, contentString, customMapType, infowindow, map, mapOptions, map_style, marker;
      MY_MAPTYPE_ID = 'custom_style';
      map_style = [
        {
          "featureType": "landscape",
          "stylers": [
            {
              "saturation": -100
            }
          ]
        }, {
          "featureType": "water",
          "stylers": [
            {
              "saturation": -100
            }
          ]
        }, {
          "featureType": "road",
          "stylers": [
            {
              "saturation": -100
            }
          ]
        }, {
          "featureType": "poi",
          "stylers": [
            {
              "saturation": -100
            }
          ]
        }
      ];
      mapOptions = {
        zoom: 14,
        center: new google.maps.LatLng(60.705288, 28.762311),
        disableDefaultUI: true,
        mapTypeId: MY_MAPTYPE_ID
      };
      map = new google.maps.Map(document.getElementById('YMapsID'), mapOptions);
      customMapType = new google.maps.StyledMapType(map_style, {
        name: "Grayscale"
      });
      map.mapTypes.set(MY_MAPTYPE_ID, customMapType);
      marker = new google.maps.Marker({
        position: new google.maps.LatLng(60.705288, 28.762311),
        map: map,
        title: 'Hello World!'
      });
      contentString = "<div id=\"content\">\n  <div id=\"siteNotice\"></div>\n  <h1 id=\"firstHeading\" class=\"firstHeading\">Uluru</h1>\n  <div id=\"bodyContent\">\n    <p>\n      <b>Uluru</b>, also referred to as <b>Ayers Rock</b>, is a large \n      sandstone rock formation in the southern part of the \n      Northern Territory, central Australia. It lies 335&#160;km (208&#160;mi) \n      south west of the nearest large town, Alice Springs; 450&#160;km \n      (280&#160;mi) by road. Kata Tjuta and Uluru are the two major \n      features of the Uluru - Kata Tjuta National Park. Uluru is \n      sacred to the Pitjantjatjara and Yankunytjatjara, the \n      Aboriginal people of the area. It has many springs, waterholes, \n      rock caves and ancient paintings. Uluru is listed as a World \n      Heritage Site.\n    </p>\n    <p>\n      Attribution: Uluru, \n      <a href=\"http://en.wikipedia.org/w/index.php?title=Uluru&oldid=297882194\">http://en.wikipedia.org/w/index.php?title=Uluru</a> \n      (last visited June 22, 2009).\n    </p>\n  </div>\n</div>";
      infowindow = new google.maps.InfoWindow({
        content: contentString
      });
      return google.maps.event.addListener(marker, 'click', function() {
        return infowindow.open(map, marker);
      });
    };
    return google.maps.event.addDomListener(window, 'load', initialize);
  });

}).call(this);
