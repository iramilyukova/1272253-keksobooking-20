'use strict';

(function () {
  var activePin = null;

  var pins = [];

  var mapPins = document.querySelector('.map .map__pins');
  var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');

  var getElement = function (mark) {
    var pinItem = pinTemplate.cloneNode(true);
    pinItem.style.top = mark.location.y - window.utils.PinSize.HEIGHT + 'px';
    pinItem.style.left = mark.location.x - (window.utils.PinSize.WIDTH / 2) + 'px';
    pinItem.querySelector('img').src = mark.author.avatar;
    pinItem.querySelector('img').alt = mark.offer.title;

    return pinItem;
  };

  var addActivate = function (pin) {
    activePin = pin;
    activePin.classList.add('map__pin--active');
  };

  var removeActivate = function () {
    if (activePin) {
      activePin.classList.remove('map__pin--active');
      activePin = null;
    }
  };

  var renderElements = function (marks) {
    var fragment = document.createDocumentFragment();

    marks.forEach(function (mark, index) {
      var pin = getElement(mark);
      pin.tabIndex = index + window.utils.TWO;
      pins.push(pin);

      fragment.appendChild(pin);
      window.map.addPinClick(pin, mark);
    });
    mapPins.appendChild(fragment);
  };

  var removeElements = function () {
    pins.forEach(function (pin) {
      pin.remove();
    });
    pins = [];
  };

  window.pin = {
    renderElements: renderElements,
    removeElements: removeElements,
    addActivate: addActivate,
    removeActivate: removeActivate
  };
})();
