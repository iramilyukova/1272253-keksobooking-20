'use strict';
(function () {
  var filterForm = document.querySelector('.map__filters');
  var filtersSelect = filterForm.querySelectorAll('select');
  var housingType = filterForm.querySelector('#housing-type');
  var housingPrice = filterForm.querySelector('#housing-price');
  var housingRooms = filterForm.querySelector('#housing-rooms');
  var housingGuests = filterForm.querySelector('#housing-guests');
  var housingFeatures = filterForm.querySelector('#housing-features');

  var pins = [];

  var activate = function () {
    filtersSelect.forEach(function (it) {
      it.disabled = false;
    });
    housingFeatures.disabled = false;
  };

  var deactivate = function () {
    filterForm.reset();
    filtersSelect.forEach(function (it) {
      it.disabled = true;
    });
    housingFeatures.disabled = true;
  };

  var getIsAnyType = function (value) {
    return value === window.utils.TypeFilter.ANY;
  };

  // Общая функция для фильтрации полей с параметрами: выбранное значение, текущий элемент и ключ
  var filterItem = function (it, item, key) {
    return getIsAnyType(it.value) || it.value === item[key].toString(); // если выбрано любое значение, то true, если нет, то какое-то конкретное
  };

  // фильтруем по типу жилья
  var filtrationByType = function (item) {
    return filterItem(housingType, item.offer, window.utils.TypeFilter.TYPE); // записываем названия пареметоров: тип фильтра, текущее поле с ключом 'type'
  };

  // фильтруем по цене
  var filtrationByPrice = function (item) {
    switch (housingPrice.value) {
      case window.utils.BorderPrice.LOW: // Если занчение цены низкое
        return item.offer.price < window.utils.PriceRange.LOWER; // то значение будет меньше 10 тыс.
      case window.utils.BorderPrice.MIDDLE:
        return item.offer.price >= window.utils.PriceRange.LOWER && item.offer.price <= window.utils.PriceRange.UPPER;
      case window.utils.BorderPrice.HIGHT:
        return item.offer.price > window.utils.PriceRange.UPPER;

      default:
        return true;
    }
  };

  // Сортировка по кол-ву комнат
  var filtrationByRooms = function (item) {
    return filterItem(housingRooms, item.offer, window.utils.TypeFilter.ROOMS);
  };

  // Сортировка по кол-ву гостей
  var filtrationByGuests = function (item) {
    return filterItem(housingGuests, item.offer, window.utils.TypeFilter.GUESTS);
  };

  // Сортировка по фичам
  var filtrationByFeatures = function (item) {
    var checkedFeaturesItems = housingFeatures.querySelectorAll('input:checked');
    return Array.from(checkedFeaturesItems).every(function (element) { // проверяем методом every удовлетворяют ли все элементы массива тому, что их чекнули
      return item.offer.features.includes(element.value); // метод includes позволяет определить, содержит ли массив искомый элемент.
    });
  };

  // функция для сохранения исходного массива меток, она вызывается один раз при загрузке данных
  var updatePins = function (items) {
    pins = items; // запишет доступных пинов из глобального массива для установки предвыбранными фильтрами
    filterPins(); // запускаем первичную фильтрацию на случай того, что значения стоят не по дефолту
  };

  var filterPins = function () {
    var filterItems = pins.filter(function (pin) {
      return filtrationByType(pin) && filtrationByPrice(pin) && filtrationByRooms(pin) && filtrationByGuests(pin) && filtrationByFeatures(pin);
    });

    // показываем с помощью метода slice только 5 меток
    var displayPins = filterItems.length > window.utils.PINS_COUNT ? filterItems.slice(window.utils.ZERO, window.utils.PINS_COUNT) : filterItems;
    // Показываем 5 меток на странице с учетом фильтрации
    window.pin.renderPins(displayPins);
  };

  var onFilterFormChange = window.debounce(function () {
    window.pin.removePins();
    window.card.removePopup();
    filterPins(); // вызываем фильтрацию пинов
  });

  filterForm.addEventListener('change', onFilterFormChange); // когда будет происходить 'change', то колбеком вызовем ф-ю


  window.filter = {
    activate: activate,
    deactivate: deactivate,
    updatePins: updatePins,
    pins: []
  };
})();
