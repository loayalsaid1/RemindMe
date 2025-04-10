$(document).ready(function () {
  const aside = $('aside');
  const addReminder = aside.find('.add_reminder');
  const chooseReminderList = aside.find('.choose_reminder_type');

  const openSidebar = () => aside.addClass('open');
  const closeSidebar = () => aside.removeClass('open');
	const toggleSidebar = () => aside.toggleClass('open');
  const hideChooseReminderList = () => chooseReminderList.addClass('hidden');
  const showChooseReminderList = () => chooseReminderList.removeClass('hidden');

  $('aside .toggle_icon').on('click', function () {
    toggleSidebar();
    hideChooseReminderList();
  });

  $('aside .choose_reminder_type button').on('click', function () {
    closeSidebar();
    hideChooseReminderList();
  });

  addReminder.on('mouseenter', function () {
    if (chooseReminderList.hasClass('hidden')) {
      showChooseReminderList();
    }
  });

  addReminder.on('mouseleave', function () {
    if (!chooseReminderList.hasClass('hidden')) {
      hideChooseReminderList();
    }
  });
});

