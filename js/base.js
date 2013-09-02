(function() {
  $(function() {
    var ajax_get, find_in_objects_array, flow_test, form_hierarchial_data, mapCategoryFormat, mapCategorySelection;
    mapCategoryFormat = function(object) {
      if (object.level === 0) {
        return object.name;
      } else {
        if (object.style_img != null) {
          return "<img class='mapicon' src='http://allvbg.ru/static/allvbg/" + object.style_img + "'/>" + object.name;
        } else {
          return object.name;
        }
      }
    };
    mapCategorySelection = function(firm) {
      return firm.name;
    };
    find_in_objects_array = function(array, query, field) {
      var item, result, _i, _len;
      result = [];
      for (_i = 0, _len = array.length; _i < _len; _i++) {
        item = array[_i];
        if (field === 'id') {
          query = parseInt(query, 10);
        }
        if (item[field] === query) {
          result.push(item);
        }
      }
      return result;
    };
    form_hierarchial_data = function(firms, styles) {
      var children, deleted, object, query, style_id, style_img, top_level, _i, _j, _len, _len1, _ref;
      top_level = find_in_objects_array(firms, 0, 'level');
      for (_i = 0, _len = top_level.length; _i < _len; _i++) {
        object = top_level[_i];
        query = "/api/v1/firm/" + object.id + "/";
        object.children = [];
        deleted = delete object['id'];
        object.children = find_in_objects_array(firms, query, 'parent');
        _ref = object.children;
        for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
          children = _ref[_j];
          style_id = children.map_style.split('/map_style/')[1].split('/')[0];
          style_img = find_in_objects_array(styles, style_id, 'id')[0];
          children.style_img = style_img.value;
        }
      }
      return top_level;
    };
    ajax_get = function(url, callback) {
      return $.ajax({
        url: url,
        dataType: 'jsonp'
      }).done(function(data) {
        if (callback != null) {
          return callback(data.objects);
        }
      });
    };
    flow_test = function() {
      return flow.exec(function() {
        ajax_get("http://allvbg.ru/api/v1/firm/?limit=120&container=true", this.MULTI('firm'));
        return ajax_get("http://allvbg.ru/api/v1/map_style/?limit=120", this.MULTI('style'));
      }, function(results) {
        window.new_results = form_hierarchial_data(results['firm'], results['style']);
        return $("#id_parent").select2({
          data: {
            results: new_results,
            text: "name"
          },
          formatResult: mapCategoryFormat,
          formatSelection: mapCategorySelection
        });
      });
    };
    $('#id_description').redactor();
    $('#id_short').redactor();
    flow_test();
    window.Firm = {
      initialized: false
    };
    window.Firm.initialize = function() {
      var customMapType, mapOptions, map_style;
      if (!Firm.initialized) {
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
        window.Firm.geocoder = new google.maps.Geocoder();
        mapOptions = {
          zoom: 13,
          center: new google.maps.LatLng(60.705288, 28.762311),
          disableDefaultUI: true,
          mapTypeId: 'custom_style'
        };
        window.Firm.map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
        customMapType = new google.maps.StyledMapType(map_style, {
          name: "Grayscale"
        });
        window.Firm.map.mapTypes.set('custom_style', customMapType);
        Firm.initialized = true;
        return $('#b1').click(function() {
          return window.Firm.codeAddress();
        });
      }
    };
    return window.Firm.codeAddress = function() {
      var address;
      address = $("#address").val();
      console.log(address);
      return window.Firm.geocoder.geocode({
        address: address
      }, function(results, status) {
        var marker;
        if (status === google.maps.GeocoderStatus.OK) {
          window.Firm.map.setCenter(results[0].geometry.location);
          marker = new google.maps.Marker({
            map: window.Firm.map,
            position: results[0].geometry.location,
            draggable: true
          });
          $("#id_lat").val(marker.getPosition().lat());
          $("#id_lng").val(marker.getPosition().lng());
          $("#id_location").val("" + (marker.getPosition().lat()) + "," + (marker.getPosition().lng()));
          return google.maps.event.addListener(marker, 'dragend', function() {
            $("#id_lat").val(marker.getPosition().lat());
            $("#id_lng").val(marker.getPosition().lng());
            $("#id_location").val("" + (marker.getPosition().lat()) + "," + (marker.getPosition().lng()));
            return console.log($("#id_lat").val(), $("#id_lng").val());
          });
        } else {
          return alert("Geocode was not successful for the following reason: " + status);
        }
      });
    };
  });

}).call(this);
