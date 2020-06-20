'use strict';

(function () {
  var KEY_CODE = {
    ESC: 27,
    ENTER: 13,
    MOUSE_LEFT: 1
  };

  var isEscEvent = function (evt, action) {
    if (evt.keyCode === KEY_CODE.ESC) {
      action();
    }
  };

  var isEnterEvent = function (evt, action) {
    if (evt.keyCode === KEY_CODE.ENTER) {
      action();
    }
  };

  var isMouseLeftEvent = function (evt, action) {
    if (evt.which === KEY_CODE.MOUSE_LEFT) { // проверка на нажатие левой кнопки мышки, обратились к свойству which этого объекта
      action();
    }
  };

  window.utils = {
    isEscEvent: isEscEvent,
    isEnterEvent: isEnterEvent,
    isMouseLeftEvent: isMouseLeftEvent
  };
})();

