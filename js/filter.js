'use strict';
(function () {

  var PriceRange = {
    LOW: {
      MIN: 0,
      MAX: 10000
    },
    MIDDLE: {
      MIN: 10000,
      MAX: 50000
    },
    HIGH: {
      MIN: 50000,
      MAX: Infinity
    }
  };

  var filters = document.querySelector('.map__filters');
  var filtersSelect = filters.querySelectorAll('select');
  var housingType = filters.querySelector('#housing-type');
  var housingPrice = filters.querySelector('#housing-price');
  var housingRooms = filters.querySelector('#housing-rooms');
  var housingGuests = filters.querySelector('#housing-guests');
  var housingFeatures = filters.querySelector('#housing-features');

  var pins = [];

  var activateFilters = function () {
    filtersSelect.forEach(function (it) {
      it.disabled = false;
    });
    housingFeatures.disabled = false;
  };

  var deactivateFilters = function () {
    filters.reset();
    filtersSelect.forEach(function (it) {
      it.disabled = true;
    });
    housingFeatures.disabled = true;
  };

  // Общая функция для фильтрации полей с параметрами: выбранное значение, текущий элемент и ключ
  var filterItem = function (it, item, key) {
    return it.value === 'any' ? true : it.value === item[key].toString(); // если выбрано любое значение, то true, если нет, то какое-то конкретное
  };

  // фильтруем по типу жилья
  var filtrationByType = function (item) {
    return filterItem(housingType, item.offer, 'type'); // записываем названия пареметоров: тип фильтра, текущее поле с ключом 'type'
  };

  // фильтруем по типу цене
  var filtrationByPrice = function (item) {
    var filteringPrice = PriceRange[housingPrice.value.toUpperCase()]; // привели значение цены скк нижнему регистру
    return filteringPrice ? item.offer.price >= filteringPrice.MIN && item.offer.price <= filteringPrice.MAX : true; // если выбран фильтр цены, то вторым условием станет true
  };

  // Сортировка по кол-ву комнат
  var filtrationByRooms = function (item) {
    return filterItem(housingRooms, item.offer, 'rooms');
  };

  // Сортировка по кол-ву гостей
  var filtrationByGuests = function (item) {
    return filterItem(housingGuests, item.offer, 'guests');
  };

  // Сортировка по фичам
  var filtrationByFeatures = function (item) {
    var checkedFeaturesItems = housingFeatures.querySelectorAll('input:checked');
    return Array.from(checkedFeaturesItems).every(function (element) { // проверяем методом every удовлетворяют ли все элементы массива тому, что их чекнули
      return item.offer.features.includes(element.value); // метод includes позволяет определить, содержит ли массив искомый элемент.
    });
  };

  var updatePins = function () {
    var pinsCopy = pins.slice(); // возвращает новый массив, содержащий копию части исходного массива.
    var filterPins = pinsCopy.filter(function (pin) {
      return filtrationByType(pin) && filtrationByPrice(pin) && filtrationByRooms(pin) && filtrationByGuests(pin) && filtrationByFeatures(pin);
    });
    window.pin.getPin(filterPins);
  };

  var onFilterChange = function () {
    window.pin.removePins();
    window.card.removePopup();
    updatePins();
  };

  filters.addEventListener('change', onFilterChange);


  window.filter = {
    activate: activateFilters,
    deactivate: deactivateFilters,
    pins: []
  };
})();
