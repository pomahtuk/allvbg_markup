ymaps.ready ->
  myMap = new ymaps.Map("YMapsID",
    center: [60.705288, 28.762311]
    zoom: 14
  )
  myMap.controls.add "zoomControl"
  myMap.controls.add new ymaps.control.ScaleLine()