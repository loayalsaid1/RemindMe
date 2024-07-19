$(document).ready(function () {
  /**
   * toggle the options list of a reminder
   */
  $(".menu_icon")
    .off("click")
    .click(function (event) {
      event.stopPropagation(); // Prevent the event from bubbling up
      const reminderOptions = $(this).parent().find(".reminder_options");

      if (reminderOptions.css("display") === "none") {
        reminderOptions.css("display", "flex");
      } else {
        reminderOptions.css("display", "none");
      }
    });

  /**
   * magnify an image
   */
  $(".magnify_icon")
    .off("click")
    .click(function (event) {
      event.stopPropagation();
      const articleTag = $(this).closest("article");
      if (articleTag.data("type") == "image") {
        const imgTag = articleTag.find(".reminder_image");
        const src = imgTag.attr("src");
        $(".fullscreen_container img").attr("src", src);
        $(".fullscreen_container img").show();
      } else {
        const text = articleTag.find(".shown p").text();
        $(".fullscreen_container p").text(text);
        $(".fullscreen_container p").show();
      }
      $(".fullscreen_container").css("display", "flex");
      $(".fullscreen_container").fadeIn(300);
      blur_main();

      const scrollY = $("main").scrollTop();
      const mainHeight = $("main").height();
      const mainWidth = $("main").width();

      $(".fullscreen_container").css({
        top: `${scrollY + mainHeight / 2}px`,
        left: `${mainWidth / 2}px`,
      });
      /**
       * Blur the main element when clicking outside the fullscreen container
       */
      $("main")
        .off("click")
        .click(function (event) {
          $(".fullscreen_container").fadeOut(300);
          $(".fullscreen_container p").hide();
          $(".fullscreen_container img").hide();
          $("main > *").css("filter", "none");
          $('main').off('click');
        });

      /**
       * blur the main element
       */
    });
    function blur_main() {
      $("main > *").not(".fullscreen_container").css("filter", "blur(5px)");
    }
});
