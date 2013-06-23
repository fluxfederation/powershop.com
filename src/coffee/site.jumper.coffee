do ($ = jQuery, window) ->  
  $(document).ready ->
    isLocalScrolling = false
    sections = $ "section.anchor"
    
    #
    # Jumper on the right handles anchors.
    #
    highlightJump = (anchor)->
      $("#jumper li").removeClass('active')
      id = $(anchor).attr('id')
      id = "[href=#"+ id
      id = id + "]"

      $("#jumper li").find(id).parents("li").addClass('active')

    $.localScroll.hash(
      queue: true,
      duration: 700,
      
      onBefore: (e, anchor, target)->
        isLocalScrolling = true 
        highlightJump(anchor)

      onAfter: (anchor, settings)->
        isLocalScrolling = false
    )

    $.localScroll(
      queue: true,
      duration: 700,
      hash: true,
      
      onBefore: (e, anchor, target)->
        isLocalScrolling = true
        highlightJump(anchor)
      
      onAfter: (anchor, settings)->
        isLocalScrolling = false
    );

    $("#jumper").localScroll()

    $(document).scroll ()->
      if isLocalScrolling 
        return;
      
      height = $("body").height()
      scroll = $(document).scrollTop()
      offset = 120
      
      if sections.length > 0 
        active = sections.first()
        
        sections.each (i, elem)-> 
          if $(elem).position().top < (scroll + offset)
            active = $(elem)

        highlightJump(active)
