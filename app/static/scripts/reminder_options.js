/**
 * position add reminder windows
 */
function positionAddReminderWindows() {
  const scrollY = $('main').scrollTop();
  const mainHeight = $('main').height();
  const mainWidth = $('main').width();

  $('.add_reminder_window').css({
    top: `${scrollY + mainHeight / 2}px`,
    left: `${mainWidth / 2}px`,
  });
}

/**
 * If there is no reminders left in the main section
 * show the welcome section
 */
function addWelcomeSection() {
    const welcomeSection = `<div class="welcome-container">
			<p class="message">Your E-Wall seems empty. Click below to stick the first one</p>
			<div class="buttons">
				<button type="button" class="show-text-reminder-form">Add a text reminder</button>
				<span>Or</span>
				<button type="button" class="show-image-reminder-form">Add an image reminder</button>
			</div>
		</div>`;

    $('main > .quote-container').after(welcomeSection);
    
    // Add animation to the welcome section
    $('.welcome-container').hide().fadeIn(500);
}

/**
 * Toggle the icons and attibutes of a reminder when
 * visibility attibute changes
 */
function toggleVisibility(reminder, visibility) {
  reminder.data('visibility', visibility);
  
  // Add animation
  const shown = reminder.find('.shown');
  shown.fadeOut(100, function() {
    if (visibility === 'public') {
      reminder.find('.lock_icon').remove();
      reminder.find('.toggle_visibility span').text('visibility');
    } else {
      reminder
        .find('.shown')
        .prepend(
          `<span class="material-symbols-outlined lock_icon">visibility_lock</span>`
        );
      reminder.find('.toggle_visibility span').text('visibility_lock');
    }
    shown.fadeIn(100);
  });
}

function setEditTextReminderWindow() {
  $('.text_reminder_form')
    .off('submit')
    .on('submit', function (event) {
      event.stopPropagation();
      event.preventDefault();

      const form = new FormData(this);
      const visibility = form.get('reminder_visibility');
      const isText = true;
      const public = visibility === 'public';
      const reminderText = form.get('reminder_text');
      const caption = form.get('caption');

      const id = $(this).data('reminder-id');
      const token = getCookie('access_token_cookie');
      const url = `${apiDomain}/api/v1/reminders/${id}`;
      $.ajax({
        url: url,
        method: 'PUT',
        contentType: 'application/json',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: JSON.stringify({
          is_text: isText,
          public: public,
          text: reminderText,
          caption: caption,
        }),
        success: function () {
          /**
           * get remider
           * edit contents of it
           * trigger toggle visibility if visibility changed
           * fadeout the form and unblur the main
           */
          const reminder = $('article[data-reminder-id="' + id + '"]');
          reminder.find('.shown p').text(reminderText);
          reminder.find('.caption').text(caption);

          if (visibility !== reminder.data('visibility')) {
            toggleVisibility(reminder, visibility);
          }
        },
        error: function (error) {
          console.error(error);
          if (error.status === 401) {
            window.location.href = '/login';
          } else {
            alert('Failed to edit reminder now!, sorry for that!');
          }
        },
      });
      /**
       * reset the form
       * remove edit class and get back add class
       */
      $('main > *').css('filter', 'none');
      $('.text_reminder_window').fadeOut(300);
      $(this).trigger('reset');
      $(this).removeClass('edit_reminder');
      $(this).addClass('add_reminder');
    });
}

/***
 * Set the submit behaviour of edit reminder form
 */
function setEditImageReminderform() {
  /**
   * prevent default
   * send image... visibility ... caption to the server
   * make a form out of it.
   * get url
   * get token
   * send the form
   * on success...
   * get the response and edit the reminder
   */

  $('.add_image_reminder_form')
    .off('submit')
    .on('submit', function (event) {
      event.stopPropagation();
      event.preventDefault();

      const reminderId = $('.add_image_reminder').data('reminder-id');
      const reminder = $(`article[data-reminder-id="${reminderId}"]`);
      const token = getCookie('access_token_cookie');
      const url = `${apiDomain}/api/v1/reminders/${reminderId}`;
      const form = new FormData(this);
      form.append('is_text', false);
      if (reminder.find('.caption').text() === form.get('caption')) {
        form.delete('caption');
      }

      if ($(this).find('input[type=file]')[0].files.length === 0) {
        form.delete('reminder_image');
      }

      $.ajax({
        url: url,
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: form,
        processData: false,
        contentType: false,
        success: function (data) {
          reminder.find('.reminder_image').attr('src', data.img_url);
          reminder.find('.caption').text(data.caption);
          if (reminder.data('visibility') !== form.get('reminder_visibility')) {
            toggleVisibility(reminder, form.get('reminder_visibility'));
          }
        },
        error: function (error) {
          if (error.status === 401) {
            window.location.href = '/login';
          } else {
            console.log(error);
            alert("Can't update reminder now, sorry!");
          }
        },
      });

      $('.add_image_reminder').fadeOut(300);
      $('main > *').css('filter', 'none');
      $('.add_image_reminder').attr('data-reminder-id', '');
      $(this).trigger('reset');
    });
}
$(document).ready(function () {
  /***** Different remidner intactions ...... Edit, delete, toggle visibility to public */

  /**Delete a reminder */
  $('main').on('click', '.delete_reminder', function (event) {
    event.stopPropagation();
    const reminder = $(this).closest('article');
    const id = reminder.data('reminder-id');
    const token = getCookie('access_token_cookie');
    const url = `${apiDomain}/api/v1/reminders/${id}`;

    if (confirm('You are deleting one of your reminders now!') === false) {
      return;
    }

    // Add a fade-out animation when deleting
    reminder.animate({opacity: 0}, 300, function() {
      $.ajax({
        type: 'DELETE',
        url: url,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        success: function () {
          reminder.slideUp(300, function() {
            reminder.remove();
            if ($('main .reminders_container > article').length === 0) {
              addWelcomeSection();
            }
          });
        },
        error: function (error) {
          reminder.animate({opacity: 1}, 300); // Restore if error
          if (error.status === 401) {
            window.location.href = '/login';
          } else {
            alert('Failed to delete reminder, sorry for that!');
          }
        },
      });
    });
  });

  /*** Toggle visibility */

  $('main').on('click', '.toggle_visibility', function (event) {
    /**
     * get article to remove it,
     * GEt the id of it to atalk tothe aip
     * get hte token
     * url
     * token
     * artickel
     * data
     * if text. is public
     */

    event.stopPropagation();

    const reminder = $(this).closest('article');
    const id = reminder.data('reminder-id');
    const url = `${apiDomain}/api/v1/reminders/` + id;
    const token = getCookie('access_token_cookie');

    const visibility =
      reminder.data('visibility') === 'public' ? 'private' : 'public';
    $.ajax({
      url: url,
      method: 'PUT',
      contentType: 'application/json',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: JSON.stringify({
        public: visibility === 'public',
      }),
      success: function () {
        toggleVisibility(reminder, visibility);
      },
      error: function (error) {
        console.log(error);
        if (error.status === 401) {
          window.location.href = '/login';
        } else {
          alert('Failed to toggle visibility now, sorry for that!');
        }
      },
    });
  });

  /***Abit trecky one!
   *
   * use the add_reminder form to edit a reminder
   *
   * let me see!
   */

  $('main').on(
    'click',
    'article[data-type="text"] .edit_reminder',
    function (event) {
      event.stopPropagation();
      positionAddReminderWindows();

      setEditTextReminderWindow();
      const form = $('.text_reminder_form');
      const reminderId = $(this).closest('article').data('reminder-id');
      form.data('reminder-id', reminderId);
      form.parent().find('h2').text('Text Reminder');
      form.find('button[type=submit]').text('Done');

      form.removeClass('add_reminder').addClass('edit_reminder');

      const reminder = $(this).closest('article');
      const caption = reminder.find('.caption').text();
      const text = reminder.find('.shown p').text();
      const visibility = reminder.data('reminder-visibility');

      form.find('textarea[name="caption"]').val(caption);
      form.find('textarea[name="reminder_text"]').val(text);
      form
        .find(`input[name="reminder_visibility"][value="${visibility}"]`)
        .attr('checked', true);
      blurMain();

      $('.text_reminder_window').fadeIn(300);
    }
  );

  /**
   * I 'm really now out of focus and time...
   * let me make it in a separete event handler just for now;
   *
   * edit images reminder
   */

  $('main').on(
    'click',
    'article[data-type="image"] .edit_reminder',
    function (event) {
      event.stopPropagation();
      positionAddReminderWindows();
      blurMain();
      setEditImageReminderform();

      const reminder = $(this).closest('article');
      const window = $('.add_image_reminder');

      window.find('h2').text('Image Reminder');
      window.find('button[type=submit]').text('Done');

      const caption = reminder.find('.caption').text();
      const imgURL = reminder.find('img').attr('src');
      window.find('textarea[name="caption"]').val(caption);
      window.find('#placeholder_image').attr('src', imgURL);

      window.data('reminder-id', reminder.data('reminder-id'));

      window.fadeIn(300);
    }
  );
});
