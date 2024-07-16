$(document).ready(function() {
  $(".menu_icon").off("click").click(function(event) {
    event.stopPropagation(); // Prevent the event from bubbling up
    const reminderOptions = $(this).parent().find(".reminder_options");

    if (reminderOptions.css('display') === 'none') {
        reminderOptions.css('display', 'flex');
    } else {
        reminderOptions.css('display', 'none');
    }
  });
  
});
