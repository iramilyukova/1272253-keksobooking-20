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

  var filterItem = function (it, item, key) {
    return getIsAnyType(it.value) || it.value === item[key].toString();
  };

  var filtrationByType = function (item) {
    return filterItem(housingType, item.offer, window.utils.TypeFilter.TYPE);
  };

  var filtrationByPrice = function (item) {
    switch (housingPrice.value) {
      case window.utils.BorderPrice.LOW:
        return item.offer.price < window.utils.PriceRange.LOWER;
      case window.utils.BorderPrice.MIDDLE:
        return item.offer.price >= window.utils.PriceRange.LOWER && item.offer.price <= window.utils.PriceRange.UPPER;
      case window.utils.BorderPrice.HIGHT:
        return item.offer.price > window.utils.PriceRange.UPPER;

      default:
        return true;
    }
  };

  var filtrationByRooms = function (item) {
    return filterItem(housingRooms, item.offer, window.utils.TypeFilter.ROOMS);
  };

  var filtrationByGuests = function (item) {
    return filterItem(housingGuests, item.offer, window.utils.TypeFilter.GUESTS);
  };

  var filtrationByFeatures = function (item) {
    var checkedFeaturesItems = housingFeatures.querySelectorAll('input:checked');
    return Array.from(checkedFeaturesItems).every(function (element) {
      return item.offer.features.includes(element.value);
    });
  };

  var updatePins = function (items) {
    pins = items;
    filterPins();
  };

  var filterPins = function () {
    var filterItems = pins.filter(function (pin) {
      return filtrationByType(pin) && filtrationByPrice(pin) && filtrationByRooms(pin) && filtrationByGuests(pin) && filtrationByFeatures(pin);
    });

    var displayPins = filterItems.length > window.utils.PINS_COUNT ? filterItems.slice(window.utils.ZERO, window.utils.PINS_COUNT) : filterItems;
    window.pin.renderPins(displayPins);
  };

  var onFilterFormChange = window.debounce(function () {
    window.pin.removePins();
    window.card.removePopup();
    filterPins();
  });

  filterForm.addEventListener('change', onFilterFormChange);


  window.filter = {
    activate: activate,
    deactivate: deactivate,
    updatePins: updatePins,
    pins: []
  };
})();
