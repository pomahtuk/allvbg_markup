$ ->

  $('.aside-1 a.hover').click ->
    panel = $('#extra_panel')
    elem = $ @
    if panel.is(':visible') and panel.hasClass elem.data('panel')
      panel.hide().attr('class', '')
      elem.removeClass 'active'
    else
      panel.show().attr('class', '').addClass elem.data('panel')
      $('.aside-1 a.hover').removeClass 'active'
      elem.addClass 'active'
      if elem.data('panel') is 'add_firm'
        Firm.initialize()

    false

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

  openInfoBubble = ->
    infoBubble = new InfoBubble
      maxWidth: 240
      content: """
          <div class="ymaps_ballon_opened">
            <div class="content">
              <img src="#{@sub_element.description}" />
              <a href="#{@sub_element.link}">
                <h3>#{@sub_element.name}</h3>
              </a>
              <div class="tags">
                #{@sub_element.tags}
              </div>
            </div>
            <div class="footer">
              Рейтинг: #{@sub_element.rating}
            </div>
          </div>
        """
      shadowStyle: 1
      padding: 0
      borderRadius: 4
      arrowSize: 10
      borderWidth: 0
      hideCloseButton: true
      backgroundColor: "rgb(243, 243, 243)"

    APP.visibleInfoBubble.close() if APP.visibleInfoBubble
    infoBubble.open APP.map, @marker
    APP.visibleInfoBubble = infoBubble

  addMenuItem = (element, menuContainer) ->
    APP.markers["menu#{element.description}"] = {}
    $("""<li><ul id="menu#{element.description}"></ul></li>""").appendTo menuContainer

  addMenuItem2 = (element, container) ->
    container = $(container)
    img = ""
    if element.elements[0].marker?
      img = element.elements[0].marker
    else
      img = "http://allvbg.ru/static/allvbg/img/transparent.png"
    item = $("""<a class='title_sub' data-name='#{element.name}' href='#'><img src='#{img}' alt=' '/>#{element.name}</a>""")
    item.click ->
      elem = $ @
      APP.visibleInfoBubble.close() if APP.visibleInfoBubble
      if elem.hasClass 'active_sub'
        inner_map = null
        elem.removeClass 'active_sub'
      else
        inner_map = APP.map
        elem.addClass 'active_sub'
      for marker in APP.markers["#{container.attr('id')}"]["#{elem.data('name')}"]
        marker.setMap inner_map
    .appendTo $("<li></li>").appendTo(container)

    APP.markers["#{container.attr('id')}"]["#{element.name}"] = []

    for sub_element in element.elements
      if sub_element.coordinates?
        coords = sub_element.coordinates.split(',')
        marker = new google.maps.Marker
          position: new google.maps.LatLng coords[1], coords[0]
          icon: img
          map: null
        APP.markers["#{container.attr('id')}"]["#{element.name}"].push marker

        params = 
          sub_element: sub_element
          marker: marker

        google.maps.event.addListener marker, "click", openInfoBubble.bind(params)

  $.ajax
    type: "GET"
    url: "http://allvbg.ru/map.json"
    dataType: "jsonp"
  .done (data) ->
    for element in data.elements
      if element.elements?
        addMenuItem element, $("#menu")
        for sub_element in element.elements
          if sub_element.elements?
            container = "#menu#{element.description}"
            addMenuItem2 sub_element, container
    $('#scrollbar1').tinyscrollbar()
  .error (data) ->
    alert "При загрузке карты произошла ошибка"