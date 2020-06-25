'use strict';

(function () {
  var PinSetting = {
    HEIGHT: 75,
    HALF_WIDTH: 33,
    HALF_HEIGHT: 33,
    TAIL_HEIGHT: 16
  };

  var rect = document.querySelector('.map__overlay').getBoundingClientRect();

  // Границы доступной области для перемещения метки
  var MIN_COORD = {
    X: rect.left - PinSetting.HEIGHT - PinSetting.HALF_HEIGHT,
    Y: 130 - PinSetting.HALF_HEIGHT - PinSetting.TAIL_HEIGHT
  };

  var MAX_COORD = {
    X: rect.width - PinSetting.HALF_HEIGHT,
    Y: 630 - PinSetting.HALF_HEIGHT - PinSetting.TAIL_HEIGHT
  };

  var map = document.querySelector('.map');
  var mapPins = map.querySelector('.map__pins'); // метки объявлений
  var mapPinButtonMain = document.querySelector('.map__pin--main');
  var isActive = false;

  // Стартовые координаты главной метки
  var startMainPinPosition = function () {
    var x = 0;
    var y = 0;

    if (isActive) {
      x = mapPinButtonMain.offsetLeft + PinSetting.HALF_HEIGHT;
      y = mapPinButtonMain.offsetTop + PinSetting.HALF_HEIGHT + PinSetting.TAIL_HEIGHT;
    } else {
      x = mapPinButtonMain.offsetLeft + PinSetting.HALF_WIDTH;
      y = mapPinButtonMain.offsetTop + PinSetting.HALF_HEIGHT;
    }
    window.form.putMainPinPositionToAddress(x, y);
  };

  // функция добавления для одной метки обработчика события.
  var addMarkEventHeandlers = function (pin, mark) { // параметры: фрагмент отрисовки марка на карте и текущая марка
    pin.addEventListener('click', function () { // на отрисованного марка на карте вешаем обработчик клика
      window.card.renderPopup(mark); // при нажатии вызывать функцию для рисования попапа
    });
  };

  var onError = function (message) {
    console.error (message);
  };

  var onSuccess = function (data) {
    console.log (data);
  };

  // Функция для перевода страницы в активное состояние
  var activateMap = function (marks) {
    isActive = true;
    map.classList.remove('map--faded');// Активируем карту
    window.pin.renderMarks(marks);// Показываем все метки на странице
    startMainPinPosition();
    window.form.changeStateForm(); // Функция для проверки состояния активации формы (fieldset)
  };

  // Навешивание обработчиков событий
  var initMainPinEvents = function () { // При клике на кнопку автивируем метки
    mapPinButtonMain.addEventListener('mousedown', function (evt) {
      if (!isActive && window.utils.isMouseLeftEvent(evt)) {
        window.backend.load(activateMap); // функция для получения данных от сервера
      }
    });

    // Обработчикоткрытия закрытия окна по нажатию на Enter
    mapPinButtonMain.addEventListener('keydown', function (evt) {
      if (!isActive && window.utils.isEnterEvent(evt)) {
        window.backend.load(activateMap);
      } // При клике на левую кнопку мыши автивируем метки
    });
  };

  // функцию внутри этого модуля для соблюдения принципа инкапсуляции для DOM элемента map.
  var addMarksFragment = function (fragment) {
    mapPins.appendChild(fragment);
  };

  // Перетаскиваем метку
  mapPinButtonMain.addEventListener('mousedown', function (evt) { // обработаем событие начала перетаскивания метки mousedown.
    evt.preventDefault();

    var startCoords = { // Запомним координаты точки, с которой мы начали перемещать метку.
      x: evt.clientX,
      y: evt.clientY
    };

    // Фнкция для смещения метки относительно стартовой позиции
    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();

      var shift = { // При каждом движении мыши обновим смещение от старта для смещения на нужную величину.
        x: startCoords.x - moveEvt.clientX,
        y: startCoords.y - moveEvt.clientY
      };

      startCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };

      var coordinates = {
        x: mapPinButtonMain.offsetLeft - shift.x, // обновляем координаты после смещения мыши
        y: mapPinButtonMain.offsetTop - shift.y
      };

      if (coordinates.x < MIN_COORD.X) { // Проверяем не заходит ли метка за рамки
        coordinates.x = MIN_COORD.X;
      } else if (coordinates.x > MAX_COORD.X) {
        coordinates.x = MAX_COORD.X;
      }

      if (coordinates.y < MIN_COORD.Y) {
        coordinates.y = MIN_COORD.Y;
      } else if (coordinates.y > MAX_COORD.Y) {
        coordinates.y = MAX_COORD.Y;
      }

      mapPinButtonMain.style.top = coordinates.y + 'px'; // получаем новые координаты после смещения
      mapPinButtonMain.style.left = coordinates.x + 'px';

      startMainPinPosition(coordinates.x, coordinates.y);
    };

    // Удаление обработчиков событий с mousemove, mouseup
    var onMouseUp = function (upEvt) { // При отпускании мыши нужно переставать слушать события движения мыши.
      upEvt.preventDefault();

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove); // Добавим обработчики события передвижения мыши
    document.addEventListener('mouseup', onMouseUp); // и отпускания кнопки мыши.
  });


  window.map = {
    startMainPinPosition: startMainPinPosition,
    addMarksFragment: addMarksFragment,
    initMainPinEvents: initMainPinEvents,
    addMarkEventHeandlers: addMarkEventHeandlers
  };
})();
