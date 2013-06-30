do ($ = jQuery, window) ->  
  $(document).ready ->
    isLocalScrolling = false
    sections = $ ".anchor"
    
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

    #
    # Jumper on the right handles anchors.
    #
    highlightJump = (anchor)->
      $("#jumper li").removeClass('active')
      id = $(anchor).attr('id')
      id = "[href=#"+ id
      id = id + "]"

      $("#jumper li").find(id).parents("li").addClass('active')

    $("#jumper a").click (e)->
      e.preventDefault()

      hash = $(this).attr('href')
      target = $(hash)

      if target.length > 0
        highlightJump($(this))
        scroll = target.data('scroll_for_parallax')
        isLocalScrolling = true
        $("html, body").animate({ 
          scrollTop: scroll 
        }, 2000, ()->
          isLocalScrolling = false
        )

    $(document).scroll ()->
      if isLocalScrolling 
        return;

      scroll = $(document).scrollTop()
      offset = 120
      
      if sections.length > 0 
        active = sections.first()
        
        sections.each (i, elem)-> 
          if $(elem).position().top < (scroll + offset)
            active = $(elem)

        highlightJump(active)
