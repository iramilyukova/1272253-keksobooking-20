'use strict';

(function () {
  var PinSize = {
    WIDTH: 66,
    HEIGHT: 66
  };

  var pins = [];
  var TWO = 2;

  var mapPins = document.querySelector('.map .map__pins'); // метки объявлений
  var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');

  // Отрисовываем метки на карте, клонирование
  var getPin = function (mark) {
    var mapPoint = pinTemplate.cloneNode(true); // клонируем метку со всем ее содержимым, создается копия дом-элемента
    mapPoint.style.top = (mark.location.y - PinSize.HEIGHT) + 'px';
    mapPoint.style.left = mark.location.x - (PinSize.WIDTH / 2) + 'px';
    mapPoint.querySelector('img').src = mark.author.avatar;
    mapPoint.querySelector('img').alt = mark.offer.title;

    var onMapPointClick = function () {
      deactivatePin();
      mapPoint.classList.add('map__pin--active'); // добавляем подсветку актиной метке при нажатии на нее
    };

    var onMapPointEnterPress = function (evt) {
      window.util.isEnterEvent(evt, onMapPointClick);
    };

    mapPoint.addEventListener('click', onMapPointClick);
    mapPoint.addEventListener('keydown', onMapPointEnterPress);

    return mapPoint; // вернули из функции переменную со ссылкой на получившийся дом-элемент
  };

  var deactivatePin = function () {
    var mapActivePin = document.querySelector('.map__pin--active');
    if (mapActivePin) {
      mapActivePin.classList.remove('map__pin--active');
    }
  };

  // Записываем все метки во fragment
  var renderPins = function (marks) { // указали параметр со всеми заполенными данными, которые должны быть представлены на странице в виде HTML разметки. Это объекту, которые лежат в массиве
    var fragment = document.createDocumentFragment(); // клонируется темплейт

    marks.forEach(function (mark, index) {
      var pin = getPin(mark); // ссылаемся на функцию отрисовки метки (на дом-элемент, который мы склонировали с помощью темплейта) и отрисовываем каждого текущего марка на карте
      pin.tabIndex = index + TWO;
      pins.push(pin); // записали каждую метку в массив пинов

      fragment.appendChild(pin); // сложили все во фрагмент
      window.map.addPinClick(pin, mark); // навесили обработчики событий
    });
    mapPins.appendChild(fragment); // добавили фрагмент в блок с метками объявлений(в дом-дерево)
  };

  // функция для удаления меток из массива
  var removePins = function () {
    pins.forEach(function (pin) {
      pin.remove();
    });
    pins = []; // Почистить массив
  };

  window.pin = {
    renderPins: renderPins,
    removePins: removePins,
    deactivatePin: deactivatePin
  };
})();

