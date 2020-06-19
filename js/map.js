'use strict';

(function () {
  var COUNT_USERS = 8;
  var PinSize = {
    WIDTH: 66,
    HEIGHT: 66,
    TAIL_HEIGHT: 16
  };

  var PinLimit = {
    MIN_X: 300,
    MAX_X: 900,
    MIN_Y: 130,
    MAX_Y: 600,
  };

  var TITLE = ['Уютное гнездышко для молодоженов', 'Милая, уютная квартирка в центре Токио', 'Большая уютная квартира']; 
  var PriseLimit = {
    MIN: 1000,
    MAX: 1000000
  };

  var DESCRIPTION = ['Маленькая чистая квартира на краю города', 'Большая квартира из трех комнат в центре города', 'Однушка у парка'];
  var FEATURES = ['wifi', 'dishwasher', 'parking', 'elevator', 'conditioner'];
  var TIMES = ['12:00', '13:00', '14:00'];
  var PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
  var map = document.querySelector('.map');
  var mapPins = map.querySelector('.map__pins'); // метки объявлений
  var mapPinButtonMain = document.querySelector('.map__pin.map__pin--main');
  var isActive = false;

  // Функция, возвращающая одну метку объявлений, заполенной данными
  var getMark = function (index) {

    for (var i = 0; i < COUNT_USERS; i++) {
      var mark = {
        author: {
          avatar: generateAvatar(index),
        },
        offer: {
          title: window.data.getRandomItem(TITLE),
          address: '600, 350', // строка, адрес предложения
          price: window.data.getRandomValue(PriseLimit.MIN, PriseLimit.MAX),
          rooms: window.data.getRandomValue(window.form.RoomLimit.MIN, window.form.RoomLimit.MAX),
          type: window.data.translateType(window.form.TYPES),
          guests: window.data.getRandomValue(window.form.GuestLimit.MIN, window.form.GuestLimit.MAX),
          checkin: window.data.getRandomItem(TIMES),
          checkout: window.data.getRandomItem(TIMES),
          features: window.data.getRandomFeatures(4, FEATURES), // массив строк случайной длины из ниже предложенных
          description: window.data.getRandomItem(DESCRIPTION), // строка с описанием
          photos: window.data.getRandomItems(4, PHOTOS) // массив строк случайной длины, содержащий адреса фотографий
        },
        location: {
          y: window.data.getRandomValue(PinLimit.MIN_Y, PinLimit.MAX_Y),
          x: window.data.getRandomValue(PinLimit.MIN_X, PinLimit.MAX_X)
        }
      };
    }
    return mark;
  };

  // Создаем массив заполненных данными маркеров
  var getMarks = function (count) {
    var marks = []; // записываем каждую заполненную метку в массив

    for (var i = 0; i < count; i++) {
      var mark = getMark(i); // одна конкретная заполненная метка
      marks.push(mark); // отправляем каждую метку в массив
    }
    return marks;
  };

  // Работаем с массивом аватарок
  var generateAvatar = function (index) {
    return 'img/avatars/user0' + (index + 1) + '.png';
  };

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
  var initEvents = function (marks) {
    mapPinButtonMain.addEventListener('mousedown', function (evt) {
      window.util.isMouseLeftEvent(evt, activateMap(marks)); // При клике на кнопку автивируем метки
    });

    // Обработчикоткрытия закрытия окна по нажатию на Enter
    mapPinButtonMain.addEventListener('keydown', function (evt) {
      window.util.isEnterEvent(evt, activateMap(marks)); // При клике на кнопку автивируем метки
    });
  };

  window.map = {
    mapSection: map,
    mapPins: mapPins,
    mainPinButton: mapPinButtonMain,
    getMarks: getMarks,
    startMainPinPosition: startMainPinPosition,
    initEvents: initEvents,
    addMarkEventHeandlers: addMarkEventHeandlers
  };
})();

