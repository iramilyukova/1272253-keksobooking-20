'use strict';

(function () {
  var PinSize = {
    WIDTH: 66,
    HEIGHT: 66,
    TAIL_HEIGHT: 16
  };

  var mapPinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');

  // Отрисовываем метки на карте, клонирование
  var getMarkFragment = function (mark) {
    var mapPoint = mapPinTemplate.cloneNode(true); // клонируем метку со всем ее содержимым, создается копия дом-элемента
    mapPoint.style.top = (mark.location.y - PinSize.HEIGHT) + 'px';
    mapPoint.style.left = mark.location.x - (PinSize.WIDTH / 2) + 'px';
    mapPoint.querySelector('img').src = mark.author.avatar;
    mapPoint.querySelector('img').alt = mark.offer.title;
    return mapPoint; // вернули из функции переменную со ссылкой на получившийся дом-элемент
  };

  // Записываем все метки во fragment
  var renderMarks = function (marks) { // указали параметр со всеми заполенными данными, которые должны быть представлены на странице в виде HTML разметки. Это объекту, которые лежат в массиве
    var fragment = document.createDocumentFragment(); // клонируется темплейт
    for (var i = 0; i < marks.length; i++) {
      var mark = marks[i]; // записали в переменную конкретного марка из массива с заполенными данными марками
      var pin = getMarkFragment(mark); // ссылаемся на функцию отрисовки метки (на дом-элемент, который мы склонировали с помощью темплейта) и отрисовываем каждого текущего марка на карте
      fragment.appendChild(pin); // сложили все во фрагмент
      window.map.addMarkEventHeandlers(pin, mark); // навесили обработчики событий
    }
    window.map.mapPins.appendChild(fragment); // добавили фрагмент в блок с метками объявлений(в дом-дерево)
  };

  window.pin = {
    renderMarks: renderMarks
  };
})();

