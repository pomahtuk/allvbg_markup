$ ->

  mapCategoryFormat = (object) ->
    if object.level is 0
      object.name
    else
      if object.style_img?
        "<img class='mapicon' src='http://allvbg.ru/static/allvbg/#{object.style_img}'/>#{object.name}"
      else
        object.name

  mapCategorySelection = (firm) ->
    firm.name

  find_in_objects_array = (array, query, field) ->
    result = []
    for item in array
      if field is 'id'
        query = parseInt(query, 10)
      if item[field] is query
        result.push item
    result

  form_hierarchial_data = (firms, styles) ->
    top_level = find_in_objects_array firms, 0, 'level'

    for object in top_level
      query            = "/api/v1/firm/#{object.id}/"
      object.children  = []
      deleted          = delete object['id']
      object.children  = find_in_objects_array firms, query, 'parent'

      for children in object.children
        style_id           = children.map_style.split('/map_style/')[1].split('/')[0]
        style_img          = find_in_objects_array(styles, style_id, 'id')[0]
        children.style_img = style_img.value

    return top_level

  ajax_get = (url, callback) ->
    $.ajax
      url: url,
      dataType: 'jsonp',
    .done (data) ->
      callback data.objects if callback?

  flow_test = ->
    flow.exec -> 
        ajax_get "http://allvbg.ru/api/v1/firm/?limit=120&container=true", this.MULTI('firm')
        ajax_get "http://allvbg.ru/api/v1/map_style/?limit=120", this.MULTI('style')
      , (results) ->
        window.new_results = form_hierarchial_data results['firm'], results['style']
        $("#id_parent").select2
          data:
            results: new_results
            text: "name"
          formatResult: mapCategoryFormat
          formatSelection: mapCategorySelection

  $('#id_description').redactor();
  $('#id_short').redactor();
  flow_test();

  window.Firm = {
    initialized: false
  }

  window.Firm.initialize = ->
    unless Firm.initialized
    
      map_style = [
        {
          "featureType": "landscape"
          "stylers": [
            { "saturation": -100 }
          ]
        },{
          "featureType": "water"
          "stylers": [
            { "saturation": -100 }
          ]
        },{
          "featureType": "road"
          "stylers": [
            { "saturation": -100 }
          ]
        },{
          "featureType": "poi"
          "stylers": [
            { "saturation": -100 }
          ]
        }
      ]

      window.Firm.geocoder = new google.maps.Geocoder()

      mapOptions =
        zoom: 13
        center: new google.maps.LatLng 60.705288, 28.762311
        disableDefaultUI: true
        mapTypeId: 'custom_style'

      window.Firm.map = new google.maps.Map document.getElementById("map-canvas"), mapOptions

      customMapType = new google.maps.StyledMapType map_style, { name:"Grayscale" }

      window.Firm.map.mapTypes.set 'custom_style', customMapType

      Firm.initialized = true

      $('#b1').click ->
        window.Firm.codeAddress()


  window.Firm.codeAddress = ->
    address = $("#address").val()
    console.log address
    window.Firm.geocoder.geocode
      address: address
    , (results, status) ->
      if status is google.maps.GeocoderStatus.OK
        window.Firm.map.setCenter results[0].geometry.location
        marker = new google.maps.Marker
          map: window.Firm.map
          position: results[0].geometry.location
          draggable: true

        $("#id_lat").val marker.getPosition().lat()
        $("#id_lng").val marker.getPosition().lng()
        $("#id_location").val "#{marker.getPosition().lat()},#{marker.getPosition().lng()}"

        google.maps.event.addListener marker, 'dragend', ->
          $("#id_lat").val marker.getPosition().lat()
          $("#id_lng").val marker.getPosition().lng()
          $("#id_location").val "#{marker.getPosition().lat()},#{marker.getPosition().lng()}"
          console.log $("#id_lat").val(), $("#id_lng").val()

      else
        alert "Geocode was not successful for the following reason: " + status