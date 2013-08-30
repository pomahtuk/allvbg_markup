$(document).ready ->

  initialize = ->

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

    map = new google.maps.Map document.getElementById('YMapsID'), mapOptions

    customMapType = new google.maps.StyledMapType map_style, { name:"Grayscale" }

    map.mapTypes.set MY_MAPTYPE_ID, customMapType

    marker = new google.maps.Marker
      position: new google.maps.LatLng 60.705288, 28.762311
      map: map
      title: 'Hello World!'


    contentString = """<div id="content">
          <div id="siteNotice"></div>
          <h1 id="firstHeading" class="firstHeading">Uluru</h1>
          <div id="bodyContent">
            <p>
              <b>Uluru</b>, also referred to as <b>Ayers Rock</b>, is a large 
              sandstone rock formation in the southern part of the 
              Northern Territory, central Australia. It lies 335&#160;km (208&#160;mi) 
              south west of the nearest large town, Alice Springs; 450&#160;km 
              (280&#160;mi) by road. Kata Tjuta and Uluru are the two major 
              features of the Uluru - Kata Tjuta National Park. Uluru is 
              sacred to the Pitjantjatjara and Yankunytjatjara, the 
              Aboriginal people of the area. It has many springs, waterholes, 
              rock caves and ancient paintings. Uluru is listed as a World 
              Heritage Site.
            </p>
            <p>
              Attribution: Uluru, 
              <a href="http://en.wikipedia.org/w/index.php?title=Uluru&oldid=297882194">http://en.wikipedia.org/w/index.php?title=Uluru</a> 
              (last visited June 22, 2009).
            </p>
          </div>
        </div>"""

    infowindow = new google.maps.InfoWindow
      content: contentString

    google.maps.event.addListener marker, 'click', ->
      infowindow.open(map,marker)

    # ctaLayer = new google.maps.KmlLayer
    #   url: './map.kml'

    # ctaLayer = new google.maps.KmlLayer {
    #   url: 'http://pomahtuk.github.io/allvbg_markup/map.kml'
    # }

    #ctaLayer.setMap map


  google.maps.event.addDomListener window, 'load', initialize

  # ymaps.ready ->
  #   addMenuItem = (group, map, menuContainer) ->
  #     $("""<li><ul id="menu#{group.properties.get("description")}"></ul></li>""").appendTo menuContainer
    
  #   addMenuItem2 = (group, map, container) ->
  #     img = ""
  #     unless group.getLength() is 0
  #       img = group.get(0).options.get("iconImageHref")
  #     else
  #       img = "http://allvbg.ru/static/allvbg/img/transparent.png"
  #     item = $("<a class='title_sub' href='#'><img src='#{img}' alt=''/>#{group.properties.get("name")}</a>")
  #     item.bind("click", ->
  #       link = $(this)
  #       if link.hasClass("active_sub")
  #         map.geoObjects.remove group
  #       else
  #         map.geoObjects.add group
  #       link.toggleClass "active_sub"
  #       false
  #     ).appendTo $("<li></li>").appendTo($(container))

  #   myMap = new ymaps.Map("YMapsID",
  #     center: [28.762311, 60.705288]
  #     zoom: 14
  #     behaviors: ['default', 'scrollZoom']
  #   )
  #   #myMap.controls.add "zoomControl"
  #   #myMap.controls.add new ymaps.control.ScaleLine()

  #   ymaps.geoXml.load("http://allvbg.ru/main_map.xml").then ((res) ->
  #     res.geoObjects.each (item) ->
  #       addMenuItem item, myMap, $("#menu")
  #       item.each (item2) ->
  #         cnt = "#menu" + item.properties.get("description")
  #         addMenuItem2 item2, myMap, cnt
  #     $('#scrollbar1').tinyscrollbar()
  #   ), (error) ->
  #     alert "При загрузке YMapsMl-файла произошла ошибка: " + error