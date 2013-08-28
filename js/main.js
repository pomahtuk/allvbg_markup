(function() {
  $(document).ready(function() {
    return ymaps.ready(function() {
      var addMenuItem, addMenuItem2, myMap;
      addMenuItem = function(group, map, menuContainer) {
        return $("<li><ul id=\"menu" + (group.properties.get("description")) + "\"></ul></li>").appendTo(menuContainer);
      };
      addMenuItem2 = function(group, map, container) {
        var img, item;
        img = "";
        if (group.getLength() !== 0) {
          img = group.get(0).options.get("iconImageHref");
        } else {
          img = "http://allvbg.ru/static/allvbg/img/transparent.png";
        }
        item = $("<a class='title_sub' href='#'><img src='" + img + "' alt=''/>" + (group.properties.get("name")) + "</a>");
        return item.bind("click", function() {
          var link;
          link = $(this);
          if (link.hasClass("active_sub")) {
            map.geoObjects.remove(group);
          } else {
            map.geoObjects.add(group);
          }
          link.toggleClass("active_sub");
          return false;
        }).appendTo($("<li></li>").appendTo($(container)));
      };
      myMap = new ymaps.Map("YMapsID", {
        center: [28.762311, 60.705288],
        zoom: 14
      });
      myMap.controls.add("zoomControl");
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
