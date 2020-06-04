var COUNT_USERS = 8;
var TITLE = ['Уютное гнездышко для молодоженов', 'Милая, уютная квартирка в центре Токио', 'Большая уютная квартира'];
var PriseLimit = {
  MIN: 1000,
  MAX: 1000000
};

var TYPES = ['palace', 'flat', 'house', 'bungalo'];
var RoomLimit = {
  MIN: 1,
  MAX: 100
};

var GuestLimit = {
  MIN: 1,
  MAX:20
};
    
var PinLimit = {
  MIN_X: 300,
  MAX_X: 900,
  MIN_Y: 130,
  MAX_Y: 600,
};
  
var PIN_HEIGHT = 75;
var PIN_WIDTH = 56;
var TIMES = ['12:00', '13:00', '14:00'];
var FEATURES = ['wifi', 'dishwasher', 'parking', 'elevator', 'conditioner'];
var PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
var DESCRIPTION = ['Маленькая чистая квартира на краю города', 'Большая квартира из трех комнат в центре города', 'Однушка у парка'];
var map = document.querySelector('.map');
var mapPins = document.querySelector('.map__pins');
var mapPinTemplate = document.querySelector('.#pin').textContent.querySelector('.map-pin');

 //Удаляем неактивный класс у метки
 document.querySelector('.map').classList.remove('map--faded');

// Функция, возвращающая случайное число в диапазоне
var getRandomValue = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Функция, возвращающая случайный элемемент массива
var getRandomItem = function(items) {
  for (var i = 0; i < items.length; i++) {
    var randomIndex = getRandomValue(0, items.length);
  }
  randomItem = items[randomIndex];
  return randomItem;
  }

  // Функция, возвращающая случайную длину массива
var getRandomItems = function(count, items) {
  var randomItem = [];
  
  for (var i = 0; i < count; i++) {
    var randomItem = getRandomValue(items);
    items.push(randomItem);
  }
  return randomItems;
  }

// Работаем с массивом аватарок
var generateAvatar = function() {
  var listAvatars = [];

  for (var i = 1; i < COUNT_USERS + 1; i++) {
    if (i <= 8) {
      i = '0' + i;
    };
    return 'img/avatars/user' + 0 + index + '.png';
};

// Функция, возвращающаая массив объектов объявлений
var getMark = function(index) {

  for (var i = 0; i < COUNT_USERS; i++) {
    var mark = {
      author: {
        avatar: generateAvatar(index),
      },
      title: getRandomItem(TITLE),
      address: '600, 350', //строка, адрес предложения
      price: getRandomValue(PriseLimit.MIN, PriseLimit.MAX),
      rooms: getRandomValue(RoomLimit.MIN, RoomLimit.MAX),
      type: getRandomItem(TYPES),
      guests: getRandomValue(GuestLimit.MIN, GuestLimit.MAX),
      checkin: getRandomItem(TIMES),
      checkout: getRandomItem(TIMES),
      features: getRandomItems(4, FEATURES), //массив строк случайной длины из ниже предложенных
      description: getRandomItem(DESCRIPTION),//строка с описанием
      photos: getRandomItems(3, PHOTOS), //массив строк случайной длины, содержащий адреса фотографий
      location: {
            y: getRandomValue(PIN_HEIGHT, PIN_WIDTH),
            x: getRandomValue(PinLimit.MIN_X, PinLimit.MAX_X)
        }
      }
    };

    return mark;
}

//Создаем массив маркеров
var getMarks = function(count) {
  var marks = [];

  for(var i = 0; i < count; i++){
      var mark = getMark(i);
      marks.push(mark);
  }

  return marks;
};

//Отрисовываем метки на карте 
var getMarkFragment = function(mark) {
  var mapPoint = mapPinTemplate.cloneNode(true);
  mapPoint.style.left = mark.location.x + 'px';
  mapPoint.style.top = mark.location.y + 'px';
  mapPoint.querySelector('img').src = mark.author.avatar;
  
    return mapPoint;
  }

  //Записываем все метки во fragment
  var renderMarks = function(marks) {
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < marks.length; i++) {
      fragment.appendChild(renderPoints(marks[i]));
    }
    mapPins.appendChild(fragment);
  }

  debugger;
  var marks = getMarks(8);

  renderMarks(marks);