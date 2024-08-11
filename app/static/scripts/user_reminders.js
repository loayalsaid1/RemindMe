
$(document).ready(function () {
  /**
   * Blur main section
   */
  function blurMain () {
    $('main > *').not('.fullscreen_container').css('filter', 'blur(5px)');
  }

  /**
   * toggle the options list of a reminder
   */
  $('main').on('click', '.menu_icon', function (event) {
    event.stopPropagation(); // Prevent the event from bubbling up
    const reminderOptions = $(this).parent().find('.reminder_options');

    if (reminderOptions.css('display') === 'none') {
      reminderOptions.css('display', 'flex');
    } else {
      reminderOptions.css('display', 'none');
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
       * Blur the main element when clicking outside the fullscreen container
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
  $('main').on('click', '.welcome .show-text-reminder-form', function (event) {
    $('.add_text_reminder_button').trigger('click');
  })
  
  $('main').on('click', '.welcome .show-image-reminder-form', function (event) {
    $('.add_image_reminder_button').trigger('click');
  })
});
