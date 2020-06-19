'use strict';

(function () {
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

  var form = document.querySelector('.ad-form');
  var offerTitle = form.querySelector('#title');
  var offerPrice = form.querySelector('#price');
  var offerRoomNumber = form.querySelector('#room_number');
  var offerCapacity = form.querySelector('#capacity');
  var timeOut = form.querySelector('#timeout');
  var timeIn = document.querySelector('#timein');
  var offerType = form.querySelector('#type');
  var selects = document.querySelectorAll('select');
  var inputs = document.querySelectorAll('input');
  var fieldsets = document.querySelectorAll('fieldset');
  var addressInput = document.querySelector('input[name="address"]');
  var isActive = false;

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

  // Поставили стартовые координаты в поле с именем address
  var putMainPinPositionToAddress = function (x, y) {
    addressInput.value = x + ', ' + y;
  };

  var startingPage = function () {
    checkActivationStatus();
    window.map.startMainPinPosition();
    validateTitle();
    validatePrice();
    validateCapacity();
    updateTimes(timeIn.id); // передаем параметром время заезда
  };


  window.form = {
    form: form,
    TYPES: TYPES,
    RoomLimit: RoomLimit,
    GuestLimi: GuestLimit,
    GuestLimit: GuestLimit,
    startingPage: startingPage,
    putMainPinPositionToAddress: putMainPinPositionToAddress,
    checkActivationStatus: checkActivationStatus,
  };
})();

