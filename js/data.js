'use strict';

(function () {
  var COUNT_USERS = 8;

  var PinLimit = {
    MIN_X: 300,
    MAX_X: 900,
    MIN_Y: 130,
    MAX_Y: 600,
  };

  var GuestLimit = {
    MIN: 1,
    MAX: 20
  };

  var TYPES = {
    PALACE: 'palace',
    FLAT: 'flat',
    HOUSE: 'house',
    BUNGALO: 'bungalo'
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

  // Переводим название типов жилья на русский
  var translateType = function (type) {
    switch (type) {
      case 'palace':
        return 'Дворец';
      case 'flat':
        return 'Квартира';
      case 'bungalo':
        return 'Бунгало';
      case 'house':
        return 'Дом';
      default:
        return type;
    }
  };

  // Функция, возвращающая случайное число в диапазоне
  var getRandomValue = function (min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  };

  // Функция, возвращающая случайный элемемент массива
  var getRandomItem = function (items) {
    for (var i = 0; i < items.length; i++) {
      var randomIndex = getRandomValue(0, items.length);
    }
    var randomItem = items[randomIndex];
    return randomItem;
  };

  // Функция, возвращающая случайную длину массива
  var getRandomItems = function (count, items) {
    var randomItems = [];

    for (var i = 0; i < count; i++) {
      var randomIndex = getRandomValue(0, items.length);// Выбираем случайное число из массива items
      var randomItem = items[randomIndex];
      randomItems.push(randomItem);
    }
    return randomItems;
  };

  // Функция, возращающая массив строк случайной длины из предложенных
  var getRandomFeatures = function (items) {
    var iterationCount = getRandomValue(0, items.length);
    var randomItems = [];

    for (var i = 0; i < iterationCount; i++) {
      randomItems.push(items[i]);
    }// пройти по массиву items iterationCount - раз и добавить items[i] в массив randomItems
    return randomItems;
  };

  // Работаем с массивом аватарок
  var generateAvatar = function (index) {
    return 'img/avatars/user0' + (index + 1) + '.png';
  };

  // Функция, возвращающая одну метку объявлений, заполенной данными
  var getMark = function (index) {

    for (var i = 0; i < COUNT_USERS; i++) {
      var mark = {
        author: {
          avatar: generateAvatar(index),
        },
        offer: {
          title: getRandomItem(TITLE),
          address: '600, 350', // строка, адрес предложения
          price: getRandomValue(PriseLimit.MIN, PriseLimit.MAX),
          rooms: getRandomValue(window.form.RoomLimit.MIN, window.form.RoomLimit.MAX),
          type: translateType(TYPES),
          guests: getRandomValue(GuestLimit.MIN, GuestLimit.MAX),
          checkin: getRandomItem(TIMES),
          checkout: getRandomItem(TIMES),
          features: getRandomFeatures(4, FEATURES), // массив строк случайной длины из ниже предложенных
          description: getRandomItem(DESCRIPTION), // строка с описанием
          photos: getRandomItems(4, PHOTOS) // массив строк случайной длины, содержащий адреса фотографий
        },
        location: {
          y: getRandomValue(PinLimit.MIN_Y, PinLimit.MAX_Y),
          x: getRandomValue(PinLimit.MIN_X, PinLimit.MAX_X)
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

  window.data = {
    TYPES: TYPES,
    translateType: translateType,
    getMarks: getMarks
  };
})();
