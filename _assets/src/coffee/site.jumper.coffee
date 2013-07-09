do ($ = jQuery, window) ->  
  $(document).ready ->
    isLocalScrolling = false
    sections = $ ".anchor"
    

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
    
    $(document).scroll ()->
      if isLocalScrolling 
        return;

      scroll = $(document).scrollTop()

      if sections.length > 0 
        active = sections.first()
        
        sections.each (i, elem)-> 
          if $(elem).position().top <= (scroll)
            active = $(elem)

        highlightJump(active)
