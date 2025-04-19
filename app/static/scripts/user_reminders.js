$(document).ready(function () {
  /**
   * toggle the options list of a reminder
   */
  $('main').on('click', '.menu_icon', function (event) {
    event.stopPropagation(); // Prevent the event from bubbling up
    const reminderOptions = $(this).parent().find('.reminder_options');

    $('.reminder_options').not(reminderOptions).hide(); // Close other open menus
    
    if (reminderOptions.css('display') === 'none') {
      reminderOptions.css('display', 'flex');
      // Add a subtle animation
      reminderOptions.css('opacity', '0').animate({opacity: 1}, 100);
    } else {
      reminderOptions.animate({opacity: 0}, 200, function() {
        $(this).css('display', 'none');
      });
    }
  });

  // Close reminder options when clicking elsewhere
  $(document).on('click', function(e) {
    if(!$(e.target).closest('.menu_icon, .reminder_options').length) {
      $('.reminder_options').hide();
    }
  });

  /**
   * magnify an image
   */
  $('main').on('click', '.magnify_icon', function (event) {
    event.stopPropagation();
    event.preventDefault();
    const articleTag = $(this).closest('article');
    if (articleTag.data('type') === 'image') {
      const imgTag = articleTag.find('.reminder_image');
      const src = imgTag.attr('src');
      $('.fullscreen_container img').attr('src', src);
      $('.fullscreen_container img').show();
    } else {
      const text = articleTag.find('.shown p').text();
      $('.fullscreen_container p').text(text);
      $('.fullscreen_container p').show();
    }
    $('.fullscreen_container').css('display', 'flex');
    $('.fullscreen_container').fadeIn(300);
    blurMain();

    const scrollY = $('main').scrollTop();
    const mainHeight = $('main').height();
    const mainWidth = $('main').width();

    $('.fullscreen_container').css({
      top: `${scrollY + mainHeight / 2}px`,
      left: `${mainWidth / 2}px`
    });
    
    /**
     * Unblur when closing the fullscreen container
     */
    $('.fullscreen_container')
      .off('click')
      .click(function (event) {
        $('.fullscreen_container').fadeOut(300);
        $('.fullscreen_container p').hide();
        $('.fullscreen_container img').hide();
        $('main > *').css('filter', 'none');
      });
  });

  // Add keyboard navigation for fullscreen mode  
  $(document).keyup(function(e) {
    if (e.key === "Escape" && $('.fullscreen_container').is(':visible')) {
      unblurMain();
    }
  });
  
  // Welcome section buttons
  $('main').on('click', '.welcome-container .show-text-reminder-form', function (event) {
    $('.add_text_reminder_button').trigger('click');
  });
  
  $('main').on('click', '.welcome-container .show-image-reminder-form', function (event) {
    $('.add_image_reminder_button').trigger('click');
  })
});
