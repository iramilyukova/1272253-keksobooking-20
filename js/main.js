var COUNT_USERS = 8,
  
var TITLE = ['Уютное гнездышко для молодоженов', 'Милая, уютная квартирка в центре Токио'],
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

//Создаем массив маркеров
var getMarks = function(count) {
    var marks = [];

    for(var i = 0; i < count; i++){
        var mark = getMark();
        marks.push(mark);
    }

    return marks;
};

// Работаем с массивом аватарок
vat generateAvatars = function() {
  var listAvatars = [];

  for (var i = 1; i < COUNT_USERS + 1; i++) {
    if (i <= 8) {
      i = '0' + i;
    };
    var avatars = 'img/avatars/user' + i + '.png';
    listAvatars.push(avatars);
  }
  return listAvatars;
};

// Функция, возвращающаая массив объектов объявлений
var getMark = function() {

  for (var i = 0; i < COUNT_USERS; i++) {
    var mark = {
      avatar: generateAvatars(),
      title: '',
      address: (600+ ', ' + 350),//строка, адрес предложения
      price: getRandomValue(),
      rooms: getRandomValue(),
      type: getRandomItem(TYPES),
      guests: getRandomValue(GuestLimit.MIN, GuestLimit.MAX),
      checkin: getRandomItem(TIME),
      checkout: getRandomItem(TIME),
      features: [], //массив строк случайной длины из ниже предложенных
      description: '',//строка с описанием
      photos: [], //массив строк случайной длины, содержащий адреса фотографий
      location: {
            y: getRandomValue(PIN_HEIGHT, PIN_WIDTH),
            x: getRandomValue(PinLimit.MIN_X, PinLimit.MAX_X)
        }
      }
    };

    return mark;
}

debugger;
var marks = getMarks(8);
debugger;

//Удаляем неактивный класс у метки
  var activePins = function () {
    var map = document.querySelector('.map');
    var mapFaded = map.querySelector('.map--faded');
    if (mapFaded) () {
      map.classList.remove('map--faded');
    }
  };

// var name = 'bungalo';

// var title = document.querySelector('.notice__title');
// title.innerText = name;
