'use strict';

(function () {
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

  window.data = {
    translateType: translateType,
    getRandomValue: getRandomValue,
    getRandomItems: getRandomItems,
    getRandomItem: getRandomItem,
    getRandomFeatures: getRandomFeatures
  };
})();
