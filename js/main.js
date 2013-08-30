(function() {
  $(document).ready(function() {
    var initialize;
    initialize = function() {
      var MY_MAPTYPE_ID, ctaLayer, customMapType, map, mapOptions, map_style;
      MY_MAPTYPE_ID = 'custom_style';
      map_style = [
        {
          featureType: "all",
          elementType: "all",
          stylers: [
            {
              saturation: -100
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
      ctaLayer = new google.maps.KmlLayer({
        url: 'http://pomahtuk.github.io/allvbg_markup/map.kml'
      });
      return ctaLayer.setMap(map);
    };
    return google.maps.event.addDomListener(window, 'load', initialize);
  });

}).call(this);
