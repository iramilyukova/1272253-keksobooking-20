'use strict';

var COUNT_USERS = 8;
var TITLE = ['Уютное гнездышко для молодоженов', 'Милая, уютная квартирка в центре Токио', 'Большая уютная квартира'];
var PriseLimit = {
  MIN: 1000,
  MAX: 10000
};

var TYPES = {
  PALACE: 'Дворец',
  FLAT: 'Квартира',
  HOUSE: 'Дом',
  BUNGALO: 'Бунгало'
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
  WIDTH: 65,
  HEIGHT: 65,
};

var PinLimit = {
  MIN_X: 300,
  MAX_X: 900,
  MIN_Y: 130,
  MAX_Y: 600,
};

// var PIN_HEIGHT = 75;
// var PIN_WIDTH = 56;
var TIMES = ['12:00', '13:00', '14:00'];
var FEATURES = ['wifi', 'dishwasher', 'parking', 'elevator', 'conditioner'];
var PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
var DESCRIPTION = ['Маленькая чистая квартира на краю города', 'Большая квартира из трех комнат в центре города', 'Однушка у парка'];
var mapPins = document.querySelector('.map__pins');
var map = document.querySelector('.map');
var mapPinButton = document.querySelector('.map__pin');
var mapPinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
var mapFiltersContainer = document.querySelector('.map__filters-container');
var adTemplate = document.querySelector('#card').content.querySelector('.map__card.popup');
var fieldsets = document.querySelectorAll('fieldset');
var mapPinMain = document.querySelector('.map__pin—main');
var activePage = false;
// Удаляем неактивный класс у метки
// document.querySelector('.map').classList.remove('map--faded');

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

// Функция, возвращающаая массив объектов объявлений
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
        type: TYPES,
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
  var ad = adTemplate.cloneNode(true);
  ad.querySelector('.popup__title').textContent = mark.offer.title;
  ad.querySelector('.popup__text--address').textContent = mark.offer.address;
  ad.querySelector('.popup__text--price').textContent = mark.offer.price + ' ₽/ночь';
  ad.querySelector('.popup__type').textContent = TYPES[mark.offer.type];
  ad.querySelector('.popup__text--capacity').textContent = mark.offer.rooms + ' комнаты для ' + mark.offer.guests + ' гостей';
  ad.querySelector('.popup__text--time').textContent = 'Заезд после ' + mark.offer.checkin + ', выезд до ' + mark.offer.checkout;
  ad.querySelector('.popup__features').textContent = mark.offer.description;
  ad.querySelector('.popup__avatar').src = mark.author.avatar;
  renderPhotoContainer(ad, mark.offer.photos);
  mapFiltersContainer.insertAdjacentElement('beforebegin', ad);
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

var onMapEscPress = function (evt) {
  if (evt.key === 'Escape') {
    evt.preventDefault();
    agetActivePage();
  }
};

// Функция для перевода страницы в активное состояние
var agetActivePage = function (marks) {
  map.classList.remove('map--faded');// Активируем карту
  renderMarks(marks);// Показываем все метки на странице
};

// Функция для проверки состояния активации формы (fieldset)
var agetActiveForm = function () {
  if (!activePage) {
    agetActivePage();
    window.form.activate();
    activePage = true;
  }
  fieldsets.disabled = false;
};

// Навешивание обработчиков событий
var initEvents = function () {
  mapPinButton.addEventListener('click', function () {
    agetActivePage(marks);// При клике на кнопку автивируем метки
    document.addEventListener('keydown', onMapEscPress);
  });
  agetActivePage(marks);
  agetActiveForm();
};

// Удаляем со страницы marks
var removeMarks = function () {
  var mapMarksItems = document.querySelectorAll('.map__pin:not(.map__pin--main)');
  mapMarksItems.forEach(function (it) {
    it.remove();
  });
};
// Удаляем со страницы попап
var removeMapCard = function () {
  var mapCard = document.querySelector('.map__card');
  if (mapCard) {
    mapCard.remove();
  }
};

// Функция для перевода страницы в неактивное состояние
var agetClosePage = function () {
  map.classList.add('map--faded');
  removeMarks();
  removeMapCard();
  document.removeEventListener('keydown', onMapEscPress);
};

initEvents(marks);
var marks = getMarks(8);
agetActiveForm();
// renderMapPopup(marks[0]);
