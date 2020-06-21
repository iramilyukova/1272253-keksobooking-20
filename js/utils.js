'use strict';

(function () {
  var KeyCode = {
    ESC: 27,
    ENTER: 13,
    MOUSE_LEFT: 1
  };

  var isEscEvent = function (evt, action) {
    if (evt.keyCode === KeyCode.ESC) {
      action();
    }
  };

  var isEnterEvent = function (evt, action) {
    if (evt.keyCode === KeyCode.ENTER) {
      action();
    }
  };

  var isMouseLeftEvent = function (evt, action) {
    if (evt.which === KeyCode.MOUSE_LEFT) { // проверка на нажатие левой кнопки мышки, обратились к свойству which этого объекта
      action();
    }
  };

  window.utils = {
    isEscEvent: isEscEvent,
    isEnterEvent: isEnterEvent,
    isMouseLeftEvent: isMouseLeftEvent
  };
})();

