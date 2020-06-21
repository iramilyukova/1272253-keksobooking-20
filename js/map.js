'use strict';

(function () {
  var PinSize = {
    WIDTH: 66,
    HEIGHT: 66,
    TAIL_HEIGHT: 16
  };

  var map = document.querySelector('.map');
  var mapPins = map.querySelector('.map__pins'); // метки объявлений
  var mapPinButtonMain = document.querySelector('.map__pin.map__pin--main');
  var isActive = false;

  // Стартовые координаты главной метки
  var startMainPinPosition = function () {
    var x = 0;
    var y = 0;

    if (isActive) {
      x = mapPinButtonMain.offsetLeft + (PinSize.HEIGHT / 2);
      y = mapPinButtonMain.offsetTop + (PinSize.HEIGHT / 2) + PinSize.TAIL_HEIGHT;
    } else {
      x = mapPinButtonMain.offsetLeft + (PinSize.WIDTH / 2);
      y = mapPinButtonMain.offsetTop + PinSize.HEIGHT / 2;
    }
    window.form.putMainPinPositionToAddress(x, y);
    return startMainPinPosition;
  };

  // функция добавления для одной метки обработчика события.
  var addMarkEventHeandlers = function (pin, mark) { // параметры: фрагмент отрисовки марка на карте и текущая марка
    pin.addEventListener('click', function () { // на отрисованного марка на карте вешаем обработчик клика
      window.card.renderPopup(mark); // при нажатии вызывать функцию для рисования попапа
    });
  };

  // Функция для перевода страницы в активное состояние
  var activateMap = function (marks) {
    isActive = true;
    map.classList.remove('map--faded');// Активируем карту
    window.form.form.classList.remove('ad-form--disabled');// Активируем форму
    window.pin.renderMarks(marks);// Показываем все метки на странице
    startMainPinPosition();
    window.form.checkActivationStatus(); // Функция для проверки состояния активации формы (fieldset)
  };

  // Навешивание обработчиков событий
  var initMainPinEvents = function (marks) {
    mapPinButtonMain.addEventListener('mousedown', function (evt) {
      if (window.utils.isMouseLeftEvent(evt)) {
        activateMap(marks);
      } // При клике на кнопку автивируем метки
    });

    // Обработчикоткрытия закрытия окна по нажатию на Enter
    mapPinButtonMain.addEventListener('keydown', function (evt) {
      if (window.utils.isEnterEvent(evt)) {
        activateMap(marks);
      } // При клике на левую кнопку мыши автивируем метки
    });
  };

  // функцию внутри этого модуля для соблюдения принципа инкапсуляции для DOM элемента map.
  var addMarksFragment = function (fragment) {
    mapPins.appendChild(fragment);
  };

  window.map = {
    mapPins: mapPins,
    startMainPinPosition: startMainPinPosition,
    addMarksFragment: addMarksFragment,
    initMainPinEvents: initMainPinEvents,
    addMarkEventHeandlers: addMarkEventHeandlers
  };
})();

