'use strict';

(function () {

  var form = document.querySelector('.ad-form');
  var main = document.querySelector('main');
  var successPopupTemplate = document.querySelector('#success').content.querySelector('.success');
  var errorPopupTemplate = document.querySelector('#error').content.querySelector('.error');
  var resetBtn = document.querySelector('.ad-form__reset'); // кнопка для сброса заполнеения в форме
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

  var errorPopup = null;
  var successPopup = null;

  var activate = function () {
    changeFormState(true);
    validate();
  };

  var deactivate = function () {
    changeFormState(false);
    validate();
  };

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
    } else {
      form.classList.add('ad-form--disabled');
      form.reset();// деактивируем форму
    }
  };

  // добавление событий формы
  var addFormEvents = function () {
    resetBtn.addEventListener('click', function (evt) {
      evt.preventDefault();
      deactivate();
      window.filter.deactivate();
      window.map.deactivate(); // делаем страницу неактивной
    });

    form.addEventListener('submit', function (evt) {
      evt.preventDefault();
      var formData = new FormData(form);
      window.backend.upload(onFormSuccessSubmit, onFormErrorSubmit, formData);
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

    if (roomNumber === window.utils.RoomtType.ONE) { // если выбраная 1 комната
      if (capacityValue !== window.utils.GuestType.ONE) { // проверяем, что введенное значение 1 комнаты не равно одному гостю
        message = 'Выберите не более 1 гостя';
      }
    } else if (roomNumber === window.utils.RoomtType.TWO) { // если выбраны 2 комнаты
      if (capacityValue !== window.utils.GuestType.ONE && capacityValue !== window.utils.GuestType.TWO) { // значение 2 комнат не равно значению 1 или 2 гостей
        message = 'Выберите не более 1 гостя или 2 гостей';
      }
    } else if (roomNumber === window.utils.RoomtType.THREE) { // если выбраны 3 комнаты
      if (capacityValue !== window.utils.GuestType.ONE && capacityValue !== window.utils.GuestType.TWO && capacityValue !== window.utils.GuestType.THREE) {
        message = 'Выберите 3 гостей или 2 гостей или 1 гостя';
      }
    } else if (roomNumber === window.utils.RoomtType.HUNDERT) {
      if (capacityValue !== window.utils.GuestType.NOT_FOR_GUEST) {
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
      case window.utils.HouseType.BUNGALO:
        offerPrice.placeholder = window.utils.PriceNight.ZERO; // указываем, что placeholder  = 0, минимальная цена = 0
        offerPrice.min = window.utils.PriceNight.ZERO;
        break;
      case window.utils.HouseType.FLAT:
        offerPrice.placeholder = window.utils.PriceNight.ONE_THOUSAND; // в размерке меняем placeholder  = 1000, минимальная цена = 1000
        offerPrice.min = window.utils.PriceNight.ONE_THOUSAND; // связываем плейсхолдер с минимальным значением
        break;
      case window.utils.HouseType.HOUSE:
        offerPrice.placeholder = window.utils.PriceNight.FIVE_THOUSAND;
        offerPrice.min = window.utils.PriceNight.FIVE_THOUSAND;
        break;
      case window.utils.HouseType.PALACE:
        offerPrice.placeholder = window.utils.PriceNight.TEN_THOUSAND;
        offerPrice.min = window.utils.PriceNight.TEN_THOUSAND;
        break;
      default: break;
    }
  };

  // Прописываем условия для правильного заполнения поля с ценой жилья
  var validatePrice = function () {
    var housingTypeValue = offerType.value; // взять значение c DOM элемента

    var message = '';

    if (offerPrice.validity.rangeUnderflow) { // проверка нижней границы стоимости жилья (Если число в поле ввода меньше min атрибут ввода)
      switch (housingTypeValue) { // если housingTypeValue == HouseType.BUNGALO, то...
        case window.utils.HouseType.BUNGALO: message = 'Цена должна быть не менее 0 руб.'; break; // если выбран тип жилья "бунгало"
        case window.utils.HouseType.FLAT: message = 'Цена должна быть не менее 1000 руб.'; break; // если выбрана квартира
        case window.utils.HouseType.HOUSE: message = 'Цена должна быть не менее 5000 руб.'; break; // если выбран "дом"
        case window.utils.HouseType.PALACE: message = 'Цена должна быть не менее 10000 руб.'; break;
        default: message = ''; break; // если пользователь ничего не ввел в поле
      }
    } else if (offerPrice.validity.rangeOverflow) { // проверка максимальной стоимости жилья
      message = 'Цена должна быть не более 1 000 000 руб.'; // (rangeOverflow)Если число в поле ввода больше max атрибут ввода
    }
    offerPrice.setCustomValidity(message); // назначить DOM элементу
  };

  // Функция закрытия сообщения по клику мышки и на Esk
  var removeSuccessPopup = function () {
    if (successPopup !== null) {
      successPopup.remove();
      successPopup = null;
      document.removeEventListener('keydown', onDocumentKeyDownSuccess);
    }
  };

  // функция по закрытию успешного сообщения на Esk
  var onDocumentKeyDownSuccess = function (evt) {
    if (window.utils.isEscEvent(evt)) {
      removeSuccessPopup(); // для закрытия сообщения по клику мышки и на Esk
    }
  };

  // покажем сообщение об успешной отправке
  var showSuccessPopup = function () {
    successPopup = successPopupTemplate.cloneNode(true);
    main.insertAdjacentElement('afterbegin', successPopup); //  указываем место в разметке, где будет сообщение об отправке данных
    successPopup.addEventListener('click', function () { // записали анонимной функцией
      removeSuccessPopup(); // Сообщение должно исчезать по клику на произвольную область экрана.
    });
    document.addEventListener('keydown', onDocumentKeyDownSuccess);
  };

  // покажем сообщение о неуспешной отправке
  var showErrorPopup = function () {
    errorPopup = errorPopupTemplate.cloneNode(true);
    errorPopup.querySelector('.error__button').addEventListener('click', function () { // записали анонимной функцией
      closeError(); // Сообщение должно исчезать по клику на произвольную область экрана.
    });
    document.addEventListener('keydown', onDocumentKeyDownError);
    main.insertAdjacentElement('afterbegin', errorPopup); //  указываем место в разметке, где будет сообщение об неудачной отправке данных
  };

  var closeError = function () {
    if (errorPopup !== null) {
      errorPopup.remove();
      errorPopup = null;
      document.removeEventListener('keydown', onDocumentKeyDownError);
    }
  };

  // функция по закрытию неуспешного сообщения на Esk
  var onDocumentKeyDownError = function (evt) {
    if (window.utils.isEscEvent(evt)) {
      closeError();
    }
  };

  // Описываем неуспешную отправку данных серверу
  var onFormErrorSubmit = function () {
    showErrorPopup();
  };

  var onFormSuccessSubmit = function () {
    showSuccessPopup();
    changeFormState(false);
    window.map.deactivate();
    window.filter.deactivate();
  };

  var prepare = function () {
    deactivate();
    addFormEvents();
    validate();
  };

  var validate = function () {
    updateTimes(timeIn.id); // передаем параметром время заезда
    updatePriceLmit();
    validateTitle();
    validatePrice();
    validateCapacity();
  };

  window.form = {
    prepare: prepare,
    activate: activate,
    deactivate: deactivate,
    showErrorPopup: showErrorPopup
  };
})();
