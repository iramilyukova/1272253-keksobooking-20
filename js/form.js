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

  var changeFormState = function (isActive) {

    Array.from(fieldsets).forEach(function (fieldset) {
      fieldset.disabled = !isActive;
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
      form.reset();
    }
  };

  var addFormEvents = function () {
    resetBtn.addEventListener('click', function (evt) {
      evt.preventDefault();
      deactivate();
      window.filter.deactivate();
      window.map.deactivate();
    });

    form.addEventListener('submit', function (evt) {
      evt.preventDefault();
      var formData = new FormData(form);
      window.backend.upload(onFormSuccessSubmit, onFormErrorSubmit, formData);
    });

    offerTitle.addEventListener('input', function () {
      validateTitle();
    });

    form.addEventListener('change', function (evt) {
      var targetId = evt.target.id;
      switch (targetId) {
        case offerRoomNumber.id:
        case offerCapacity.id:
          validateCapacity();
          break;
        case offerPrice.id:
          validatePrice();
          break;
        case offerType.id:
          updatePriceLimit();
          validatePrice();
          break;
        default: break;
      }
      updateTimes(targetId);
    });
  };

  var validateTitle = function () {
    if (offerTitle.validity.tooShort) {
      offerTitle.setCustomValidity('Заголовок должно состоять минимум из 30 символов');
    } else if (offerTitle.validity.tooLong) {
      offerTitle.setCustomValidity('Заголовок не должен превышать 100 символов');
    } else if (offerTitle.validity.valueMissing) {
      offerTitle.setCustomValidity('Введите, пожалуйста, заголовок объявления. Это обязательно поле для заполнения');
    } else {
      offerTitle.setCustomValidity('');
    }
  };

  var validateCapacity = function () {
    var capacityValue = offerCapacity.value;
    var roomNumber = offerRoomNumber.value;

    var message = '';

    if (roomNumber === window.utils.RoomsType.ONE) {
      if (capacityValue !== window.utils.GuestType.ONE) {
        message = 'Выберите не более 1 гостя';
      }
    } else if (roomNumber === window.utils.RoomsType.TWO) {
      if (capacityValue !== window.utils.GuestType.ONE && capacityValue !== window.utils.GuestType.TWO) {
        message = 'Выберите не более 1 гостя или 2 гостей';
      }
    } else if (roomNumber === window.utils.RoomsType.THREE) {
      if (capacityValue !== window.utils.GuestType.ONE && capacityValue !== window.utils.GuestType.TWO && capacityValue !== window.utils.GuestType.THREE) {
        message = 'Выберите 3 гостей или 2 гостей или 1 гостя';
      }
    } else if (roomNumber === window.utils.RoomsType.HUNDRED) {
      if (capacityValue !== window.utils.GuestType.NOT_FOR_GUEST) {
        message = 'Не предназначены для гостей';
      }
    }
    offerCapacity.setCustomValidity(message);
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

  var updatePriceLimit = function () {
    var housingTypeValue = offerType.value;
    switch (housingTypeValue) {
      case window.utils.HouseType.BUNGALO:
        offerPrice.placeholder = window.utils.PriceNight.ZERO;
        offerPrice.min = window.utils.PriceNight.ZERO;
        break;
      case window.utils.HouseType.FLAT:
        offerPrice.placeholder = window.utils.PriceNight.ONE_THOUSAND;
        offerPrice.min = window.utils.PriceNight.ONE_THOUSAND;
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

  var validatePrice = function () {
    var housingTypeValue = offerType.value;

    var message = '';

    if (offerPrice.validity.rangeUnderflow) {
      switch (housingTypeValue) {
        case window.utils.HouseType.BUNGALO: message = 'Цена должна быть не менее 0 руб.'; break;
        case window.utils.HouseType.FLAT: message = 'Цена должна быть не менее 1000 руб.'; break;
        case window.utils.HouseType.HOUSE: message = 'Цена должна быть не менее 5000 руб.'; break;
        case window.utils.HouseType.PALACE: message = 'Цена должна быть не менее 10000 руб.'; break;
        default: message = ''; break;
      }
    } else if (offerPrice.validity.rangeOverflow) {
      message = 'Цена должна быть не более 1 000 000 руб.';
    }
    offerPrice.setCustomValidity(message);
  };

  var removeSuccessPopup = function () {
    if (successPopup !== null) {
      successPopup.remove();
      successPopup = null;
      document.removeEventListener('keydown', onDocumentKeyDownSuccess);
    }
  };

  var onDocumentKeyDownSuccess = function (evt) {
    if (window.utils.isEscEvent(evt)) {
      removeSuccessPopup();
    }
  };

  var showSuccessPopup = function () {
    successPopup = successPopupTemplate.cloneNode(true);
    main.insertAdjacentElement('afterbegin', successPopup);
    successPopup.addEventListener('click', function () {
      removeSuccessPopup();
    });
    document.addEventListener('keydown', onDocumentKeyDownSuccess);
  };

  var showErrorPopup = function () {
    errorPopup = errorPopupTemplate.cloneNode(true);
    errorPopup.querySelector('.error__button').addEventListener('click', function () {
      closeError();
    });
    document.addEventListener('keydown', onDocumentKeyDownError);
    main.insertAdjacentElement('afterbegin', errorPopup);
  };

  var closeError = function () {
    if (errorPopup !== null) {
      errorPopup.remove();
      errorPopup = null;
      document.removeEventListener('keydown', onDocumentKeyDownError);
    }
  };

  var onDocumentKeyDownError = function (evt) {
    if (window.utils.isEscEvent(evt)) {
      closeError();
    }
  };

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
    updateTimes(timeIn.id);
    updatePriceLimit();
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
