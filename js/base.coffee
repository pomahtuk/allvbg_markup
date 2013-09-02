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

  