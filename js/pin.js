'use strict';

(function () {
  var activePin = null;

  var pins = [];

  var mapPins = document.querySelector('.map .map__pins'); // метки объявлений
  var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');

  // Отрисовываем метки на карте, клонирование
  var getPin = function (mark) {
    var pinItem = pinTemplate.cloneNode(true); // клонируем метку со всем ее содержимым, создается копия дом-элемента
    pinItem.style.top = mark.location.y - window.utils.PinSize.HEIGHT + 'px';
    pinItem.style.left = mark.location.x - (window.utils.PinSize.WIDTH / 2) + 'px';
    pinItem.querySelector('img').src = mark.author.avatar;
    pinItem.querySelector('img').alt = mark.offer.title;

    return pinItem; // вернули из функции переменную со ссылкой на получившийся дом-элемент
  };

  // функция для посвечивания метки при активном попапе
  var addActivePin = function (pin) {
    activePin = pin; // записали что activePin имеет значение, выбран конкретный пин
    activePin.classList.add('map__pin--active'); // добавляем подсветку
  };

  var removeActivePin = function () {
    if (activePin) { // если активный пин есть, то нужно его удалить
      activePin.classList.remove('map__pin--active'); // убираем посветку
      activePin = null; // говорим, что элемента у нас нет
    }
  };

  // Записываем все метки во fragment
  var renderPins = function (marks) { // указали параметр со всеми заполенными данными, которые должны быть представлены на странице в виде HTML разметки. Это объекту, которые лежат в массиве
    var fragment = document.createDocumentFragment(); // клонируется темплейт

    marks.forEach(function (mark, index) {
      var pin = getPin(mark); // ссылаемся на функцию отрисовки метки (на дом-элемент, который мы склонировали с помощью темплейта) и отрисовываем каждого текущего марка на карте
      pin.tabIndex = index + window.utils.TWO;
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
    addActivePin: addActivePin,
    removeActivePin: removeActivePin,
    getPin: getPin
  };
})();

