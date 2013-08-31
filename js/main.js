(function() {
  $(document).ready(function() {
    var APP, MY_MAPTYPE_ID, addMenuItem, addMenuItem2, customMapType, mapOptions, map_style, openInfoWindow;
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
    openInfoWindow = function(infoWindow, marker) {
      return function() {
        if (APP.visibleInfoWindow) {
          APP.visibleInfoWindow.close();
        }
        infoWindow.open(APP.map, marker);
        return APP.visibleInfoWindow = infoWindow;
      };
    };
    addMenuItem = function(element, menuContainer) {
      console.log;
      APP.markers["menu" + element.description] = {};
      return $("<li><ul id=\"menu" + element.description + "\"></ul></li>").appendTo(menuContainer);
    };
    addMenuItem2 = function(element, container) {
      var img, item;
      container = $(container);
      img = "";
      if (element.elements[0].marker != null) {
        img = element.elements[0].marker;
      } else {
        img = "http://allvbg.ru/static/allvbg/img/transparent.png";
      }
      item = $("<a class='title_sub' data-name='" + element.name + "' href='#'><img src='" + img + "' alt=' '/>" + element.name + "</a>");
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
      return APP.markers["" + (container.attr('id'))]["" + element.name] = [];
    };
    return $.ajax({
      type: "GET",
      url: "http://allvbg.ru/map.json",
      dataType: "jsonp"
    }).done(function(data) {
      var container, element, sub_element, _i, _j, _len, _len1, _ref, _ref1;
      console.log(data);
      _ref = data.elements;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        element = _ref[_i];
        if (element.elements != null) {
          addMenuItem(element, $("#menu"));
          _ref1 = element.elements;
          for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
            sub_element = _ref1[_j];
            if (sub_element.elements != null) {
              container = "#menu" + element.description;
              addMenuItem2(sub_element, container);
            }
          }
        }
      }
      return $('#scrollbar1').tinyscrollbar();
    }).error(function(data) {
      return alert("При загрузке карты произошла ошибка");
    });
  });

}).call(this);
