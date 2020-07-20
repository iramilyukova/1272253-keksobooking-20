'use strict';

(function () {
  var map = document.querySelector('.map');
  var addressInput = document.querySelector('input[name="address"]');
  var mapPinButtonMain = document.querySelector('.map__pin--main');
  var isActive = false;

  // Стартовые координаты главной метки для разных состояний: активном и неактивном
  var updateAddress = function () {
    var x = 0;
    var y = 0;

    if (isActive) {
      x = mapPinButtonMain.offsetLeft + window.utils.PinSetting.HALF_HEIGHT;
      y = mapPinButtonMain.offsetTop + window.utils.PinSetting.HALF_HEIGHT + window.utils.PinSetting.TAIL_HEIGHT;
    } else {
      x = mapPinButtonMain.offsetLeft + window.utils.PinSetting.HALF_WIDTH;
      y = mapPinButtonMain.offsetTop + window.utils.PinSetting.HALF_HEIGHT;
    }
    addressInput.value = x + ', ' + y;
  };

  // функция добавления для одной метки обработчика события.
  var addPinClick = function (pin, mark) { // параметры: фрагмент отрисовки марка на карте и текущая марка
    pin.addEventListener('click', function () { // на отрисованного марка на карте вешаем обработчик клика
      window.card.renderPopup(mark); // при нажатии вызывать функцию для рисования попапа
      window.pin.addActivate(pin); // через замыкание передаем наш пин, чтобы он посвечивался при появлении попапа
    });
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
    window.form.activate(); // Функция для проверки состояния активации и активацию формы (fieldset)
    window.filter.activate();
  };

  // Функция для перевода страницы в не активное состояние
  var deactivate = function () {
    isActive = false;
    map.classList.add('map--faded'); // Деактивируем карт
    window.form.deactivate(); // неактивная форма
    loadStartPosition(); // Возвращаяем метку на первоначальное место
    updateAddress();
    window.pin.removeElements();
    window.card.removePopup();
    window.filter.deactivate();
    window.photo.remove();
    window.filter.pins = [];
  };

  // Навешивание обработчиков событий
  var initMainPinEvents = function () { // При клике на кнопку автивируем метки
    // Перетаскиваем метку

    var minCoord = window.utils.getMinCoord();
    var maxCoord = window.utils.getMaxCoord();

    mapPinButtonMain.addEventListener('mousedown', function (evt) { // обработаем событие начала перетаскивания метки mousedown.
      evt.preventDefault();

      if (!isActive && window.utils.isMouseLeftEvent(evt)) {
        window.backend.load(activate, window.form.showErrorPopup); // функция для получения данных от сервера
      }

      var startCoords = { // Запомним координаты точки, с которой мы начали перемещать метку.
        x: evt.clientX,
        y: evt.clientY
      };

      // Функция для смещения метки относительно стартовой позиции
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

        if (coordinates.x < minCoord.x) { // Проверяем не заходит ли метка за рамки
          coordinates.x = minCoord.x;
        } else if (coordinates.x > maxCoord.x) {
          coordinates.x = maxCoord.x;
        }

        if (coordinates.y < minCoord.y) {
          coordinates.y = minCoord.y;
        } else if (coordinates.y > maxCoord.y) {
          coordinates.y = maxCoord.y;
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
