$(document).ready ->

  APP = {}

  MY_MAPTYPE_ID = 'custom_style'
  map_style = [
    {
      "featureType": "landscape",
      "stylers": [
        { "saturation": -100 }
      ]
    },{
      "featureType": "water",
      "stylers": [
        { "saturation": -100 }
      ]
    },{
      "featureType": "road",
      "stylers": [
        { "saturation": -100 }
      ]
    },{
      "featureType": "poi",
      "stylers": [
        { "saturation": -100 }
      ]
    }
  ]
  mapOptions =
    zoom: 14
    center: new google.maps.LatLng 60.705288, 28.762311
    disableDefaultUI: true
    mapTypeId: MY_MAPTYPE_ID

  APP.map = new google.maps.Map document.getElementById('YMapsID'), mapOptions

  customMapType = new google.maps.StyledMapType map_style, { name:"Grayscale" }

  APP.map.mapTypes.set MY_MAPTYPE_ID, customMapType

  APP.markers = {}

  ymaps.ready ->
    addMenuItem = (group, ymap, menuContainer) ->
      APP.markers["menu#{group.properties.get("description")}"] = {}
      $("""<li><ul id="menu#{group.properties.get("description")}"></ul></li>""").appendTo menuContainer
    
    openInfoWindow = (infoWindow, marker) ->
      ->      
        # Close the last selected marker before opening this one.
        APP.visibleInfoWindow.close() if APP.visibleInfoWindow
        infoWindow.open APP.map, marker
        APP.visibleInfoWindow = infoWindow

    addMenuItem2 = (group, ymap, container) ->
      container = $(container)
      img = ""
      unless group.getLength() is 0
        img = group.get(0).options.get("iconImageHref")
      else
        img = "http://allvbg.ru/static/allvbg/img/transparent.png"
      item = $("""<a class='title_sub' data-name='#{group.properties.get("name")}' href='#'><img src='#{img}' alt=''/>#{group.properties.get("name")}</a>""")

      item.click ->
        elem = $ @
        if elem.hasClass 'active_sub'
          inner_map = null
          elem.removeClass 'active_sub'
        else
          inner_map = APP.map
          elem.addClass 'active_sub'
        for marker in APP.markers["#{container.attr('id')}"]["#{elem.data('name')}"]
          marker.setMap inner_map

      .appendTo $("<li></li>").appendTo(container)
      APP.markers["#{container.attr('id')}"]["#{group.properties.get("name")}"] = []
      group.each (raw_marker) ->
        marker = new google.maps.Marker
          position: new google.maps.LatLng raw_marker.geometry._ti[1], raw_marker.geometry._ti[0]
          icon: img
          map: null
        APP.markers["#{container.attr('id')}"]["#{group.properties.get("name")}"].push marker

        # Create marker info window.
        infoWindow = new google.maps.InfoWindow(
          content: """
            <div class="ymaps_ballon_opened">
              #{raw_marker.properties.get("description")}
              <a href="$[ExtendedData.link]">
                <h3>#{raw_marker.properties.get("name")}</h3>
              </a>
              <div class="tags">
                $[ExtendedData.tags]
              </div>
              <div class="footer">
                Рейтинг: $[ExtendedData.rating]
              </div>
            </div>
            """
          size: new google.maps.Size(260, 300)
        )
        
        # Add marker click event listener.
        google.maps.event.addListener marker, "click", openInfoWindow(infoWindow, marker)


    myMap = ''

    ymaps.geoXml.load("http://allvbg.ru/main_map.xml").then ((res) ->
      res.geoObjects.each (item) ->
        addMenuItem item, myMap, $("#menu")
        item.each (item2) ->
          cnt = "#menu" + item.properties.get("description")
          addMenuItem2 item2, myMap, cnt
      $('#scrollbar1').tinyscrollbar()
    ), (error) ->
      alert "При загрузке YMapsMl-файла произошла ошибка: " + error