(function() {
  $(document).ready(function() {
    var APP, MY_MAPTYPE_ID, customMapType, mapOptions, map_style;
    APP = {};
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
    APP.map = new google.maps.Map(document.getElementById('YMapsID'), mapOptions);
    customMapType = new google.maps.StyledMapType(map_style, {
      name: "Grayscale"
    });
    APP.map.mapTypes.set(MY_MAPTYPE_ID, customMapType);
    APP.markers = {};
    return ymaps.ready(function() {
      var addMenuItem, addMenuItem2, myMap, openInfoWindow;
      addMenuItem = function(group, ymap, menuContainer) {
        APP.markers["menu" + (group.properties.get("description"))] = {};
        return $("<li><ul id=\"menu" + (group.properties.get("description")) + "\"></ul></li>").appendTo(menuContainer);
      };
      openInfoWindow = function(infoWindow, marker) {
        return function() {
          if (APP.visibleInfoWindow) {
            APP.visibleInfoWindow.close();
          }
          infoWindow.open(APP.map, marker);
          return APP.visibleInfoWindow = infoWindow;
        };
      };
      addMenuItem2 = function(group, ymap, container) {
        var img, item;
        container = $(container);
        img = "";
        if (group.getLength() !== 0) {
          img = group.get(0).options.get("iconImageHref");
        } else {
          img = "http://allvbg.ru/static/allvbg/img/transparent.png";
        }
        item = $("<a class='title_sub' data-name='" + (group.properties.get("name")) + "' href='#'><img src='" + img + "' alt=''/>" + (group.properties.get("name")) + "</a>");
        item.click(function() {
          var elem, inner_map, marker, _i, _len, _ref, _results;
          elem = $(this);
          if (elem.hasClass('active_sub')) {
            inner_map = null;
            elem.removeClass('active_sub');
          } else {
            inner_map = APP.map;
            elem.addClass('active_sub');
          }
          _ref = APP.markers["" + (container.attr('id'))]["" + (elem.data('name'))];
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            marker = _ref[_i];
            _results.push(marker.setMap(inner_map));
          }
          return _results;
        }).appendTo($("<li></li>").appendTo(container));
        APP.markers["" + (container.attr('id'))]["" + (group.properties.get("name"))] = [];
        return group.each(function(raw_marker) {
          var infoWindow, marker;
          marker = new google.maps.Marker({
            position: new google.maps.LatLng(raw_marker.geometry._ti[1], raw_marker.geometry._ti[0]),
            icon: img,
            map: null
          });
          APP.markers["" + (container.attr('id'))]["" + (group.properties.get("name"))].push(marker);
          infoWindow = new google.maps.InfoWindow({
            content: "<div class=\"ymaps_ballon_opened\">\n  " + (raw_marker.properties.get("description")) + "\n  <a href=\"$[ExtendedData.link]\">\n    <h3>" + (raw_marker.properties.get("name")) + "</h3>\n  </a>\n  <div class=\"tags\">\n    $[ExtendedData.tags]\n  </div>\n  <div class=\"footer\">\n    Рейтинг: $[ExtendedData.rating]\n  </div>\n</div>"
          });
          return google.maps.event.addListener(marker, "click", openInfoWindow(infoWindow, marker));
        });
      };
      myMap = '';
      return ymaps.geoXml.load("http://allvbg.ru/main_map.xml").then((function(res) {
        res.geoObjects.each(function(item) {
          addMenuItem(item, myMap, $("#menu"));
          return item.each(function(item2) {
            var cnt;
            cnt = "#menu" + item.properties.get("description");
            return addMenuItem2(item2, myMap, cnt);
          });
        });
        return $('#scrollbar1').tinyscrollbar();
      }), function(error) {
        return alert("При загрузке YMapsMl-файла произошла ошибка: " + error);
      });
    });
  });

}).call(this);
