'use strict';

(function () {
  var KeyCode = {
    ESC: 27,
    ENTER: 13,
    MOUSE_LEFT: 1
  };

  var isEscEvent = function (evt) {
    return evt.keyCode === KeyCode.ESC;
  };

  var isEnterEvent = function (evt) {
    return evt.keyCode === KeyCode.ENTER;
  };

  var isMouseLeftEvent = function (evt) {
    return evt.which === KeyCode.MOUSE_LEFT; // проверка на нажатие левой кнопки мышки, обратились к свойству which этого объекта
  };

  window.utils = {
    isEscEvent: isEscEvent,
    isEnterEvent: isEnterEvent,
    isMouseLeftEvent: isMouseLeftEvent
  };
})();

