'use strict';

(function () {
  var PinSetting = {
    HALF_WIDTH: 33,
    HALF_HEIGHT: 33,
    TAIL_HEIGHT: 16,
    MIN_X: 0,
    MIN_Y: 130,
    MAX_Y: 630
  };

  var rect = document.querySelector('.map__overlay').getBoundingClientRect();
  var addressInput = document.querySelector('input[name="address"]');

  // Границы доступной области для перемещения метки
  var MIN_COORD = {
    X: PinSetting.MIN_X - PinSetting.HALF_WIDTH,
    Y: PinSetting.MIN_Y - PinSetting.HALF_HEIGHT - PinSetting.TAIL_HEIGHT
  };

  var MAX_COORD = {
    X: rect.width - PinSetting.HALF_WIDTH,
    Y: PinSetting.MAX_Y - PinSetting.HALF_HEIGHT - PinSetting.TAIL_HEIGHT
  };

  var map = document.querySelector('.map');
  var mapPinButtonMain = document.querySelector('.map__pin--main');
  var isActive = false;

  // Стартовые координаты главной метки для разных состояний: активном и неактивном
  var updateAddress = function () {
    var x = 0;
    var y = 0;

    if (isActive) {
      x = mapPinButtonMain.offsetLeft + PinSetting.HALF_HEIGHT;
      y = mapPinButtonMain.offsetTop + PinSetting.HALF_HEIGHT + PinSetting.TAIL_HEIGHT;
    } else {
      x = mapPinButtonMain.offsetLeft + PinSetting.HALF_WIDTH;
      y = mapPinButtonMain.offsetTop + PinSetting.HALF_HEIGHT;
    }
    addressInput.value = x + ', ' + y;
  };

  // функция добавления для одной метки обработчика события.
  var addPinClick = function (pin, mark) { // параметры: фрагмент отрисовки марка на карте и текущая марка
    pin.addEventListener('click', function () { // на отрисованного марка на карте вешаем обработчик клика
      window.card.renderPopup(mark); // при нажатии вызывать функцию для рисования попапа
    });
  };

  var onPinItemEnterPress = function (evt) {
    window.util.isEnterEvent(evt, onMapPointClick);
  };

  // объект для сохранения стартовых координат метки в неактивном состоянии
  var defaultMainPinPosition = {
    top: null,
    left: null,
  };

  // Функция для запоминания первоначального состояния
  var saveStartPosition = function () {
    defaultMainPinPosition.top = mapPinButtonMain.style.top;
    defaultMainPinPosition.left = mapPinButtonMain.style.left;
  };

  // Функция для возвращения метки со сдвинутого состояния на первоначальное
  var loadStartPosition = function () {
    mapPinButtonMain.style.top = defaultMainPinPosition.top;
    mapPinButtonMain.style.left = defaultMainPinPosition.left;
  };

  // Функция для перевода страницы в активное состояние
  var activate = function (pins) {
    isActive = true;
    map.classList.remove('map--faded'); // Активируем карту
    window.filter.updatePins(pins);
    updateAddress();
    window.form.changeFormState(isActive); // Функция для проверки состояния активации и активацию формы (fieldset)
  };

  // Функция для перевода страницы в не активное состояние
  var deactivate = function () {
    isActive = false;
    map.classList.add('map--faded'); // Деактивируем карт
    window.form.changeFormState(isActive); // неактивная форма
    updateAddress();
    loadStartPosition(); // Возвращаяем метку на первоначальное место
    window.pin.removePins();
    window.card.removePopup();
    window.filter.deactivate();
    window.filter.pins = [];
  };

  // Навешивание обработчиков событий
  var initMainPinEvents = function () { // При клике на кнопку автивируем метки
    // Перетаскиваем метку
    mapPinButtonMain.addEventListener('mousedown', function (evt) { // обработаем событие начала перетаскивания метки mousedown.
      evt.preventDefault();

      if (!isActive && window.utils.isMouseLeftEvent(evt)) {
        window.backend.load(activate); // функция для получения данных от сервера
      }

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

        updateAddress(coordinates.x, coordinates.y);
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

    // Обработчикоткрытия закрытия окна по нажатию на Enter
    mapPinButtonMain.addEventListener('keydown', function (evt) {
      if (!isActive && window.utils.isEnterEvent(evt)) {
        window.backend.load(activate);
      } // При клике на левую кнопку мыши автивируем метки
    });
  };

  var prepare = function () {
    updateAddress();
    saveStartPosition();
    initMainPinEvents();
  };

  window.map = {
    prepare: prepare,
    addPinClick: addPinClick,
    deactivate: deactivate
  };
})();
