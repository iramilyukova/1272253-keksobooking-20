'use strict';

(function () {

  var PriceNight = {
    ZERO: '0',
    ONE_THOUSAND: '1000',
    FIVE_THOUSAND: '5000',
    TEN_THOUSAND: '10000'
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

  var TYPES = {
    PALACE: 'palace',
    FLAT: 'flat',
    HOUSE: 'house',
    BUNGALO: 'bungalo'
  };

  var form = document.querySelector('.ad-form');
  var main = document.querySelector('main');
  var successPopup = document.querySelector('#success').content.querySelector('.success');
  var errorPopup = document.querySelector('#error').content.querySelector('.error');
  var error = document.querySelector('#error');
  var closeButtonError = document.querySelector('.error__button');
  var resetBtn = document.querySelector('.ad-form__reset'); // кнопка для сброса заполнеения в форме
  var submitBtn = document.querySelector('.ad-form__submit'); // кнопка отправки формы
  var success = document.querySelector('#success');
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

  // Функция для проверки состояния активации формы (fieldset)
  var changeFormState = function (isActive) {

    Array.from(fieldsets).forEach(function (fieldset) {
      fieldset.disabled = !isActive; // Если страница не активная то fieldset выключен.
    });
    Array.from(selects).forEach(function (select) {
      select.disabled = !isActive;
    });
    Array.from(inputs).forEach(function (input) {
      input.disabled = !isActive;
    });

    if (isActive) {
      form.classList.remove('ad-form--disabled');
      formListeners();// Активируем форму
    } else {
      form.classList.add('ad-form--disabled');
      removeFormListeners();
      form.reset();// деактивируем форму
    }
  };

  var updateFormValidation = function () {
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

  // Поставили стартовые координаты в поле с именем address
  var setAddress = function (x, y) {
    addressInput.value = x + ', ' + y;
  };

  // Функция закрытия сообщения по клику мышки и на Esk
  var closeSuccess = function () {
    success.remove();
    success.removeEventListener('click', onSuccessClick);
    document.removeEventListener('keydown', onDocumentKeyDownSuccess);
  };

  // Сообщение должно исчезать по клику на произвольную область экрана.
  var onSuccessClick = function () {
    closeSuccess();
  };

  // функция по закрытию успешного сообщения на Esk
  var onDocumentKeyDownSuccess = function (evt) {
    window.util.isEscEvent(evt, closeSuccess);
  };

  // покажем сообщение об успешной отправке
  var onSuccess = function () {
    main.insertAdjacentElement('afterbegin', successPopup); //  указываем место в разметке, где будет сообщение об отправке данных
    successPopup.addEventListener('click', onSuccessClick);
    document.addEventListener('keydown', onDocumentKeyDownSuccess);
  };

  var closeError = function () {
    error.remove();
    document.removeEventListener('keydown', onDocumentKeyDownError);
  };

  // Сообщение должно исчезать по клику на произвольную область экрана.
  var onErrorClick = function () {
    closeError();
  };

  // функция по закрытию неуспешного сообщения на Esk
  var onDocumentKeyDownError = function (evt) {
    window.util.isEscEvent(evt, closeError);
  };

  // Описываем неуспешную отправку данных серверу
  var onError = function () {
    main.insertAdjacentElement('afterbegin', errorPopup); //  указываем место в разметке, где будет сообщение об неудачной отправке данных
    closeButtonError.addEventListener('click', onErrorClick); // при клике на кнопку об ошибочной отправке
    errorPopup.addEventListener('click', onErrorClick);
    document.addEventListener('keydown', onDocumentKeyDownError);
  };

  var onFormSuccessSubmit = function () {
    onSuccess();
    window.map.deactivateMap();
  };

  form.addEventListener('submit', function (evt) {
    window.backend.save(new FormData(form), onFormSuccessSubmit, onError);
    evt.preventDefault();
  });

  // колбек для обработчика клика по кнопке оправки формы
  var onSubmitBtnClick = function () {
    updateFormValidation(); // вызываем функцию проверки на валидацию
  };

  // функция колбека для клика но кнопке сброса данных в форма
  var onResetBtnClick = function (evt) {
    evt.preventDefault();
    window.map.deactivateMap(); // делаем страницу неактивной
  };

  // var onDocumentKeyDown = function () {
  //  error.remove(); // сообщение об ошибочной отправке удаляется
  //   document.removeEventListener('keydown', onDocumentKeyDownError);
  // };

  // слушатель на кнопку отправки
  var formListeners = function () {
  //   form.addEventListener('submit', onFormSuccessSubmit);
    submitBtn.addEventListener('click', onSubmitBtnClick);
    resetBtn.addEventListener('click', onResetBtnClick);
  };

  // удаляем обработчики
  var removeFormListeners = function () {
    submitBtn.removeEventListener('click', onSubmitBtnClick);
    form.removeEventListener('submit', onFormSuccessSubmit);
    resetBtn.removeEventListener('click', onResetBtnClick);
  };

  var startingPage = function () {
    changeFormState();
    window.map.startMainPinPosition();
    validateTitle();
    validatePrice();
    validateCapacity();
    updateTimes(timeIn.id); // передаем параметром время заезда
  };

  window.form = {
    startingPage: startingPage,
    setAddress: setAddress,
    changeFormState: changeFormState
  };
})();

