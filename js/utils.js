'use strict';

(function () {
  var ESC_KEYCODE = 27;
  var ENTER_KEYCODE = 13;
  var MOUSE_LEFT = 1;

  window.util = {
    isEscEvent: function (evt, action) {
      if (evt.keyCode === ESC_KEYCODE) {
        action();
      }
    },
    isEnterEvent: function (evt, action) {
      if (evt.keyCode === ENTER_KEYCODE) {
        action();
      }
    },
    isMouseLeftEvent: function (evt) {
      if (evt.which === MOUSE_LEFT) { // проверка на нажатие левой кнопки мышки, обратились к свойству which этого объекта
      }
    },
  };
})();
