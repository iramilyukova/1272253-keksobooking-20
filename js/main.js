'use strict';

var COUNT_USERS = 8;
var TITLE = ['Уютное гнездышко для молодоженов', 'Милая, уютная квартирка в центре Токио', 'Большая уютная квартира'];
var PriseLimit = {
  MIN: 1000,
  MAX: 1000000
};

var TYPES = {
  PALACE: 'palace',
  FLAT: 'flat',
  HOUSE: 'house',
  BUNGALO: 'bungalo'
};

var RoomLimit = {
  MIN: 1,
  MAX: 100
};

var GuestLimit = {
  MIN: 1,
  MAX: 20
};

var PinSize = {
  WIDTH: 66,
  HEIGHT: 66,
};

var PinLimit = {
  MIN_X: 300,
  MAX_X: 900,
  MIN_Y: 130,
  MAX_Y: 600,
};

var TAIL_HEIGHT = 16;

var TIMES = ['12:00', '13:00', '14:00'];
var FEATURES = ['wifi', 'dishwasher', 'parking', 'elevator', 'conditioner'];
var PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
var DESCRIPTION = ['Маленькая чистая квартира на краю города', 'Большая квартира из трех комнат в центре города', 'Однушка у парка'];
var mapPins = document.querySelector('.map__pins');
var map = document.querySelector('.map');
var form = document.querySelector('.ad-form');
var mapPinButton = document.querySelector('.map__pin');
var mapPinButtonMain = document.querySelector('.map__pin.map__pin--main');
var mapPinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
var mapFiltersContainer = document.querySelector('.map__filters-container');
var adTemplate = document.querySelector('#card').content.querySelector('.map__card.popup');
var fieldsets = document.querySelectorAll('fieldset');
var selects = document.querySelectorAll('select');
var inputs = document.querySelectorAll('input');
var mapPinMain = document.querySelector('.map__pin--main');
var addressInput = document.querySelector('input[name="address"]');
var mapCard = document.querySelector('.map__card');
var isActive = false;
// var mapCard = null;
// Переменные, связанные с формами
var offerTitle = form.querySelector('#title');
var offerPrice = form.querySelectorAll('#price');
var offerRoomNumber = form.querySelector('#room_number');
var offerCapacity = form.querySelector('#capacity');
var offerDeparture = form.querySelector('#timeout');
var offerArrival = form.querySelector('#time');

// Переводим название типов жилья на русский
function translateType(type) {
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
}
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

// Работаем с массивом аватарок
var generateAvatar = function (index) {
  return 'img/avatars/user0' + (index + 1) + '.png';
};

// Функция, возвращающая массив объектов объявлений
var getMark = function (index) {

  for (var i = 0; i < COUNT_USERS; i++) {
    var mark = {
      author: {
        avatar: generateAvatar(index),
      },
      offer: {
        title: getRandomItem(TITLE),
        address: '600, 350', // строка, адрес предложения
        price: getRandomValue(PriseLimit.MIN, PriseLimit.MAX),
        rooms: getRandomValue(RoomLimit.MIN, RoomLimit.MAX),
        type: translateType(TYPES),
        guests: getRandomValue(GuestLimit.MIN, GuestLimit.MAX),
        checkin: getRandomItem(TIMES),
        checkout: getRandomItem(TIMES),
        features: getRandomFeatures(4, FEATURES), // массив строк случайной длины из ниже предложенных
        description: getRandomItem(DESCRIPTION), // строка с описанием
        photos: getRandomItems(4, PHOTOS) // массив строк случайной длины, содержащий адреса фотографий
      },
      location: {
        y: getRandomValue(PinLimit.MIN_Y, PinLimit.MAX_Y),
        x: getRandomValue(PinLimit.MIN_X, PinLimit.MAX_X)
      }
    };
  }
  return mark;
};

// Создаем массив маркеров
var getMarks = function (count) {
  var marks = [];

  for (var i = 0; i < count; i++) {
    var mark = getMark(i);
    marks.push(mark);
  }
  return marks;
};

// Отрисовываем метки на карте
var getMarkFragment = function (mark) {
  var mapPoint = mapPinTemplate.cloneNode(true);
  mapPoint.style.top = (mark.location.y - PinSize.HEIGHT) + 'px';
  mapPoint.style.left = mark.location.x - (PinSize.WIDTH / 2) + 'px';
  mapPoint.querySelector('img').src = mark.author.avatar;
  mapPoint.querySelector('img').alt = mark.offer.title;
  return mapPoint;
};

// Записываем все метки во fragment
var renderMarks = function (marks) {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < marks.length; i++) {
    fragment.appendChild(getMarkFragment(marks[i]));
  }
  mapPins.appendChild(fragment);
};

// Заполняем объявление на карте. Клонирование
var renderMapPopup = function (mark) {
  removeMapCard();
  mapCard = adTemplate.cloneNode(true);
  mapCard.querySelector('.popup__title').textContent = mark.offer.title;
  mapCard.querySelector('.popup__text--address').textContent = mark.offer.address;
  mapCard.querySelector('.popup__text--price').textContent = mark.offer.price + ' ₽/ночь';
  mapCard.querySelector('.popup__type').textContent = translateType[mark.offer.type];
  mapCard.querySelector('.popup__text--capacity').textContent = mark.offer.rooms + ' комнаты для ' + mark.offer.guests + ' гостей';
  mapCard.querySelector('.popup__text--time').textContent = 'Заезд после ' + mark.offer.checkin + ', выезд до ' + mark.offer.checkout;
  mapCard.querySelector('.popup__features').textContent = mark.offer.description;
  mapCard.querySelector('.popup__avatar').src = mark.author.avatar;
  renderPhotoContainer(mapCard, mark.offer.photos);
  mapFiltersContainer.insertAdjacentElement('beforebegin', mapCard);
};

// Функция проверки конейнера с фотографиями на наличие фото
var renderPhotoContainer = function (ad, imgs) {
  var adCardPhotos = ad.querySelector('.popup__photos');
  if (adCardPhotos.length === 0) {
    adCardPhotos.remove(); // если нет фотографий удалить блок popup__photos
  } else {
    renderPhotos(adCardPhotos, imgs); // вызвать функцию renderPhotos и передать 2 параметра, 1 контэйнер, 2 массив imgs
  }
};

// Колонируем фотографии в их контейнер
var renderPhotos = function (popupPhotos, photos) {
  var firstImage = popupPhotos.querySelector('.popup__photo'); // Шаблон
  var fragment = document.createDocumentFragment();
  firstImage.remove(); // очистить контэйнер

  for (var i = 0; i < photos.length; i++) {
    var cloneImage = firstImage.cloneNode(true);// шаблон клонировать в переменную
    cloneImage.src = photos[i];
    fragment.appendChild(cloneImage);
  }
  popupPhotos.appendChild(fragment);
};

// Обработчик события при нажатаии на клавишу ENTER на метке
// var onMapEnterPress = function (evt) {
//  if (evt.key === 'Enter') {
//   evt.preventDefault();
//  activePage();
// };

// Обработчик закрытия окна по нажатию на ESC 
// var onMapEscPress = function (evt) {
//   if (mapCard !== null && evt.key === 'Esc') {
//     evt.preventDefault();
//     // скрыть попап
//     // activePage();
//     // removeMapCard();// удаляем попап
//     agetClosePage();
//   }
// };

// Функция для перевода страницы в активное состояние
var activePage = function (marks) {
  map.classList.remove('map--faded');// Активируем карту
  form.classList.remove('ad-form--disabled');// Активируем форму
  renderMarks(marks);// Показываем все метки на странице
  startMainPinPosition();
};

// Функция для проверки состояния активации формы (fieldset)
var agetActiveForm = function () {
  Array.from(fieldsets).forEach(function (fieldset) {
    fieldset.disabled = !isActive; // Если страница не активная то fieldset выключен.
  });
  Array.from(selects).forEach(function (select) {
    select.disabled = !isActive;
  });
  Array.from(inputs).forEach(function (input) {
    input.disabled = !isActive;
  });
};

// Навешивание обработчиков событий
var initEvents = function (marks) {
  mapPinMain.addEventListener('mousedown', function () {
    isActive = true;
    activePage(marks);// При клике на кнопку автивируем метки
    startMainPinPosition(); // Указываем стортовые координаты главной метки-кнопки
    agetActiveForm();
    // document.addEventListener('keydown', onMapEnterPress);
    // document.addEventListener('keydown', onMapEscPress);
  });
};

// Стартовые координаты главной метки
var startMainPinPosition = function () {
  var x = 0;
  var y = 0;

  if (isActive) {
    x = mapPinButtonMain.offsetLeft + (PinSize.HEIGHT / 2);
    y = mapPinButtonMain.offsetTop + (PinSize.HEIGHT / 2) + TAIL_HEIGHT;
  } else {
    x = mapPinButtonMain.offsetLeft + (PinSize.WIDTH / 2);
    y = mapPinButtonMain.offsetTop + PinSize.HEIGHT / 2;
  }
  putMainPinPositionToAddress(x, y);
};

// Поставили стартовые координаты в поле с именем address
var putMainPinPositionToAddress = function (x, y) {
  addressInput.value = x + ', ' + y;
};

// Удаляем со страницы marks
// var removeMarks = function () {
//   var mapMarksItems = document.querySelectorAll('.map__pin:not(.map__pin--main)');
//   mapMarksItems.forEach(function (it) {
//     it.remove();
//   });
// };

// Удаляем со страницы попап
// var removeMapCard = function () {
// if (mapCard !== null) {
//  mapCard.remove();
// }
// };

// Функция для перевода страницы в неактивное состояние!
// var agetClosePage = function () {
//   // map.classList.add('map--faded');
//   // removeMarks();
//   removeMapCard();
//   // document.removeEventListener('keydown', onMapEscPress);
// };

// Функция связывает поле «Тип жилья» со значением минимальной цены из поля «Цена за ночь»
// offerPropertyType.addEventListener('change', function (evt) {
//  switch (evt.target.value) {
//    case 'palace':
//     changePrice(10000);
//     break;
//    case 'flat':
//     changePrice(1000);
//     break;
//  case 'bungalo':
//    changePrice(0);
//    break;
//  case 'house':
//    changePrice(5000);
//    break;
//  default:
//   changePrice(1000);
//   break;
// }
// });

// Вместе с минимальным значением цены меняем и плейсхолдер
// var changePrice = function (price) {
//  offerPrice.placeholder = price.toString();
//  offerPrice.setAttribute('min', price); // устанавливаем с помощью метода setAttribute новое значение для атрибута
// };

// Добавление обработчиков валидации формы
offerTitle.addEventListener('invalid', validationTitle);
offerPrice.addEventListener('invalid', validationPrice);

// Прописываем условия для правильного заполнения заголовка
var validationTitle = function () {
  if (offerTitle.validity.tooShort) {
    offerTitle.setCustomValidity('Заголовок должно состоять минимум из 30 символов');
    offerTitle.setAttribute('style', 'border-color: red');
  } else if (offerTitle.validity.tooLong) {
    offerTitle.setCustomValidity('Заголовок не должен превышать 100 символов');
    offerTitle.setAttribute('style', 'border-color: red');
  } else if (offerTitle.validity.valueMissing) {
    offerTitle.setCustomValidity('Введите, пожалуйста, заголовок объявления. Это обязательно поле для заполнения');
    offerTitle.setAttribute('style', 'border-color: red');
  } else {
    offerTitle.setCustomValidity(''); // не забыть сбросить значение поля, если это значение стало корректно.
    offerTitle.removeAttribute('style');
  }
};

// Прописываем условия для правильного заполнения поля с ценой жилья
var validationPrice = function () {
  if (offerPrice.value.length === 0) {
    offerPrice.setCustomValidity('Введите, пожалуйста, цену. Это обязательно поле для заполнения');
    offerPrice.setAttribute('style', 'border-color: red');
  } else if (offerPrice.value < 1000) {
    offerPrice.setCustomValidity('Цена должна быть не менее 1000 руб.');
    offerPrice.setAttribute('style', 'border-color: red');
  } else if (offerPrice.value > 1000000) {
    offerPrice.setCustomValidity('Цена должна быть не более 1 000 000 руб.');
    offerPrice.setAttribute('style', 'border-color: red');
  } else {
    offerPrice.setCustomValidity('');
    offerPrice.removeAttribute('style');
};

// Добавление обработчиков синхронизации полей формы
offerArrival.addEventListener('change', function (evt) {
  offerDeparture.value = evt.target.value;
});

offerDeparture.addEventListener('change', function (evt) {
  offerArrival.value = evt.target.value;
});

// Вешаем "слушателей" на поля изменения количества комнат и связываем это число с количеством мест
offerRoomNumber.addEventListener('change', function (evt) {
  switch (evt.target.value) {
    case '1':
      syncFields(offerCapacity, 1);
      break;
    case '0':
      syncFields(offerCapacity, 0);
      break;
    default:
      syncFields(offerCapacity, 0);
      break;
  }
});
// Вешаем "слушателей" на поля изменения количества мест и связываем это число с количеством комнат
offerCapacity.addEventListener('change', function (evt) {
  switch (evt.target.value) {
    case '1':
      syncFields(offerRoomNumber, 1);
      break;
    case '0':
      syncFields(offerRoomNumber, 0);
      break;
    default:
      syncFields(offerRoomNumber, 0);
      break;
  }
});
// Синхронизируем поля, чтобы при изменении значения одного поля, во втором выделяется соответствующее ему
function syncFields(field, syncField) {
  field.value = syncField.toString();// значение поля приравниваем к другому полю («Время заезда» и «Время выезда»)
}

agetActiveForm(false);
startMainPinPosition();
var marks = getMarks(8);
initEvents(marks);
// agetActiveForm();
// renderMapPopup(marks[0]);

