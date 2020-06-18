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

var PriceNight = {
  ZERO: '0',
  ONE_THOUSAND: '1000',
  FIVE_THOUSAND: '5000',
  TEN_THOUSAND: '10000'
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
  TAIL_HEIGHT: 16
};

var PinLimit = {
  MIN_X: 300,
  MAX_X: 900,
  MIN_Y: 130,
  MAX_Y: 600,
};

// Код клавиш для обработки событий
var KEY_CODE = {
  ENTER: 13,
  ESC: 27,
  MOUSE_LEFT: 1
};

var RoomtType = {
  ONE: '1',
  TWO: '2',
  THREE: '3',
  HUNDERT: '100'
};

var GuestType = {
  ONE: '1',
  TWO: '2',
  THREE: '3',
  NOT_FOR_GUEST: '100'
};

var TIMES = ['12:00', '13:00', '14:00'];
var FEATURES = ['wifi', 'dishwasher', 'parking', 'elevator', 'conditioner'];
var PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
var DESCRIPTION = ['Маленькая чистая квартира на краю города', 'Большая квартира из трех комнат в центре города', 'Однушка у парка'];
var mapPins = document.querySelector('.map__pins'); // метки объявлений
var map = document.querySelector('.map');
var form = document.querySelector('.ad-form');
var mapPinButtonMain = document.querySelector('.map__pin.map__pin--main');
var mapPinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
var mapFiltersContainer = document.querySelector('.map__filters-container');
var mapCardPopupTemplate = document.querySelector('#card').content.querySelector('.map__card.popup');
var fieldsets = document.querySelectorAll('fieldset');
var selects = document.querySelectorAll('select');
var inputs = document.querySelectorAll('input');
var addressInput = document.querySelector('input[name="address"]');
var isActive = false;

// var successPopup = document.querySelector('#success').content.querySelector('main');
// var errorPopup = document.querySelector('#error').content.querySelector('main');
// var main = document.querySelector('main');
var mapCard = null;

// Переменные, связанные с формой

var offerTitle = form.querySelector('#title');
var offerPrice = form.querySelector('#price');
var offerRoomNumber = form.querySelector('#room_number');
var offerCapacity = form.querySelector('#capacity');
var timeOut = form.querySelector('#timeout');
var timeIn = document.querySelector('#timein');
var offerType = form.querySelector('#type');
// var offerArrival = form.querySelector('#time');

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

// Функция, возвращающая одну метки объявлений, заполенной данными
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

// Создаем массив заполненных данными маркеров
var getMarks = function (count) {
  var marks = []; // записываем каждую заполненную метку в массив

  for (var i = 0; i < count; i++) {
    var mark = getMark(i); // одна конкретная заполненная метка
    marks.push(mark); // отправляем каждую метку в массив
  }
  return marks;
};

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
    addMarkEventHeandlers(pin, mark); // навесили обработчики событий
  }
  mapPins.appendChild(fragment); // добавили фрагмент в блок с метками объявлений(в дом-дерево)
};
// функция добавления для одной метки обработчика события.
var addMarkEventHeandlers = function (pin, mark) { // параметры: фрагмент отрисовки марка на карте и текущая марка
  pin.addEventListener('click', function () { // на отрисованного марка на карте вешаем обработчик клика
    renderMapPopup(mark); // при нажатии вызывать функцию для рисования попапа
  });
};

// Обработчик закрытия окна по нажатию на ESC
var onPopupPress = function (evt) {
  if (mapCard !== null && evt.keyCode === KEY_CODE.ESC) {
    evt.preventDefault();
    removePopup();// удаляем попап
    // agetClosePage();
  }
};

// Удаляем со страницы попап
var removePopup = function () {
  if (mapCard !== null) { // если ссылка на дом-элемент не пустая, т.е уже открыто одно объявление
    mapCard.remove(); // то удалить, чтобы на странице было показано только одно
    document.removeEventListener('keydown', onPopupPress);
  }
};

// Заполняем объявление на карте. Клонирование
var renderMapPopup = function (mark) {
  removePopup();
  mapCard = mapCardPopupTemplate.cloneNode(true); // склонированный попап
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

  var closePopupButton = mapCard.querySelector('.popup__close');// Закрываем объявление по нажатию на крестик или по нажатию на Esc
  document.addEventListener('keydown', onPopupPress); // Закрываем объявление по нажатию на Esc
  closePopupButton.addEventListener('click', removePopup); // Закрываем объявление по нажатию на крестик
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

// Функция для перевода страницы в активное состояние
var activateMap = function (marks) {
  isActive = true;
  map.classList.remove('map--faded');// Активируем карту
  form.classList.remove('ad-form--disabled');// Активируем форму
  renderMarks(marks);// Показываем все метки на странице
  startMainPinPosition();
  checkActivationStatus();
};

// Функция для проверки состояния активации формы (fieldset)
var checkActivationStatus = function () {
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

var startingPage = function () {
  checkActivationStatus();
  startMainPinPosition();
  validateTitle();
  validatePrice();
  validateCapacity();
  updateTimes(timeIn.Id); // передаем параметром время заезда
};

// Навешивание обработчиков событий
var initEvents = function (marks) {
  mapPinButtonMain.addEventListener('mousedown', function (evt) {
    if (evt.which === KEY_CODE.MOUSE_LEFT) { // проверка на нажатие левой кнопки мышки, обратились к свойству which этого объекта
      evt.preventDefault();
      activateMap(marks);// При клике на кнопку автивируем метки
    }
  });

  mapPinButtonMain.addEventListener('keydown', function (evt) {
    if (evt.keyCode === KEY_CODE.ENTER) {
      evt.preventDefault();
      activateMap(marks);// При клике на кнопку автивируем метки
    }
  });
  form.addEventListener('change', function (evt) {
    var targetId = evt.target.id;
    switch (targetId) {
      case offerRoomNumber.id:
      case offerCapacity.id: // Метод валидации должен вызываться только при инициализации события change от одного из 2 select
        validateCapacity();
        break;
      case offerTitle.id:
        validateTitle();
        break;
      case offerPrice.id:
        validatePrice();
        break;
      case offerType.id:
        updatePriceLmit();
        validatePrice();
        break;
      default: break;
    }
    updateTimes(targetId);
  });
};

// Прописываем условия для правильного заполнения заголовка
var validateTitle = function () {
  if (offerTitle.validity.tooShort) {
    offerTitle.setCustomValidity('Заголовок должно состоять минимум из 30 символов');
  } else if (offerTitle.validity.tooLong) {
    offerTitle.setCustomValidity('Заголовок не должен превышать 100 символов');
  } else if (offerTitle.validity.valueMissing) {
    offerTitle.setCustomValidity('Введите, пожалуйста, заголовок объявления. Это обязательно поле для заполнения');
  } else {
    offerTitle.setCustomValidity(''); // не забыть сбросить значение поля, если это значение стало корректно.
  }
};

// Проверяем соотвествие колличества гостей и комнат
var validateCapacity = function () {
  var capacityValue = offerCapacity.value; // взять значение c DOM элемента
  var roomNumber = offerRoomNumber.value; // взять значение c DOM элемента

  var message = '';

  if (roomNumber === RoomtType.ONE) { // если выбраная 1 комната
    if (capacityValue !== GuestType.ONE) { // проверяем, что введенное значение 1 комнаты не равно одному гостю
      message = 'Выберите не более 1 гостя';
    }
  } else if (roomNumber === RoomtType.TWO) { // если выбраны 2 комнаты
    if (capacityValue !== GuestType.ONE && capacityValue !== GuestType.TWO) { // значение 2 комнат не равно значению 1 или 2 гостей
      message = 'Выберите не более 1 гостя или 2 гостей';
    }
  } else if (roomNumber === RoomtType.THREE) { // если выбраны 3 комнаты
    if (capacityValue !== GuestType.ONE && capacityValue !== GuestType.TWO && capacityValue !== GuestType.THREE) {
      message = 'Выберите 3 гостей или 2 гостей или 1 гостя';
    }
  } else if (roomNumber === RoomtType.HUNDERT) {
    if (capacityValue !== GuestType.NOT_FOR_GUEST) {
      message = 'Не предназначены для гостей';
    }
  }
  offerCapacity.setCustomValidity(message); // назначить DOM элементу
};

var updateTimes = function (elementId) {
  switch (elementId) {
    case timeIn.id:
      timeOut.value = timeIn.value;
      break;
    case timeOut.id:
      timeIn.value = timeOut.value;
      break;
  }
};

// Функция для обновления плейсхолдера и нижней границы стоимости проживания
var updatePriceLmit = function () {
  var housingTypeValue = offerType.value;
  switch (housingTypeValue) {
    case TYPES.BUNGALO:
      offerPrice.placeholder = PriceNight.ZERO; // указываем, что placeholder  = 0, минимальная цена = 0
      offerPrice.min = PriceNight.ZERO;
      break;
    case TYPES.FLAT:
      offerPrice.placeholder = PriceNight.ONE_THOUSAND; // в размерке меняем placeholder  = 1000, минимальная цена = 1000
      offerPrice.min = PriceNight.ONE_THOUSAND; // связываем плейсхолдер с минимальным значением
      break;
    case TYPES.HOUSE:
      offerPrice.placeholder = PriceNight.FIVE_THOUSAND;
      offerPrice.min = PriceNight.FIVE_THOUSAND;
      break;
    case TYPES.PALACE:
      offerPrice.placeholder = PriceNight.TEN_THOUSAND;
      offerPrice.min = PriceNight.TEN_THOUSAND;
      break;
    default: break;
  }
};

// Прописываем условия для правильного заполнения поля с ценой жилья
var validatePrice = function () {
  var housingTypeValue = offerType.value; // взять значение c DOM элемента

  var message = '';

  if (offerPrice.validity.rangeUnderflow) { // проверка нижней границы стоимости жилья (Если число в поле ввода меньше min атрибут ввода)
    switch (housingTypeValue) { // если housingTypeValue == TYPES.BUNGALO, то...
      case TYPES.BUNGALO: message = 'Цена должна быть не менее 0 руб.'; break; // если выбран тип жилья "бунгало"
      case TYPES.FLAT: message = 'Цена должна быть не менее 1000 руб.'; break; // если выбрана квартира
      case TYPES.HOUSE: message = 'Цена должна быть не менее 5000 руб.'; break; // если выбран "дом"
      case TYPES.PALACE: message = 'Цена должна быть не менее 10000 руб.'; break;
      default: message = ''; break; // если пользователь ничего не ввел в поле
    }
  } else if (offerPrice.validity.rangeOverflow) { // проверка максимальной стоимости жилья
    message = 'Цена должна быть не более 1 000 000 руб.'; // (rangeOverflow)Если число в поле ввода больше max атрибут ввода
  }
  offerPrice.setCustomValidity(message); // назначить DOM элементу
};

// Стартовые координаты главной метки
var startMainPinPosition = function () {
  var x = 0;
  var y = 0;

  if (isActive) {
    x = mapPinButtonMain.offsetLeft + (PinSize.HEIGHT / 2);
    y = mapPinButtonMain.offsetTop + (PinSize.HEIGHT / 2) + PinSize.TAIL_HEIGHT;
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

// Функция для перевода страницы в неактивное состояние!
// var agetClosePage = function () {
//   // map.classList.add('map--faded');
//   // removeMarks();
//   removePopup();
//   // document.removeEventListener('keydown', onPopupPress);
// };

// var onError = function () {
//   main.insertAdjacentElement('afterbegin', errorPopup);
//   var closeButtonError = document.querySelector('.error__button');
//  closeButtonError.addEventListener('click', );
// };

startingPage();
var marks = getMarks(8);
initEvents(marks);
