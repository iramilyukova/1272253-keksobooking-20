'use strict';

(function () {
  var DEBOUNCE_INTERVAL = 500;
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];
  var PINS_COUNT = 5;
  var ZERO = 0;
  var TWO = 2;

  var KeyCode = {
    ESC: 27,
    ENTER: 13,
    MOUSE_LEFT: 1
  };

  var PriceNight = {
    ZERO: '0',
    ONE_THOUSAND: '1000',
    FIVE_THOUSAND: '5000',
    TEN_THOUSAND: '10000'
  };

  var RoomsType = {
    ONE: '1',
    TWO: '2',
    THREE: '3',
    HUNDRED: '100'
  };

  var GuestType = {
    ONE: '1',
    TWO: '2',
    THREE: '3',
    NOT_FOR_GUEST: '0'
  };

  var HouseType = {
    PALACE: 'palace',
    FLAT: 'flat',
    HOUSE: 'house',
    BUNGALO: 'bungalo'
  };

  var PinSize = {
    WIDTH: 66,
    HEIGHT: 66
  };

  var Status = {
    SUCCESS: 200,
    INVALID_REQUEST: 400,
    NOT_AUTHORIZED: 401,
    ERROR_NOT_FOUND: 404,
    SERVER_ERROR: 500,
    TIMEOUT_TIME: 10000
  };

  var PriceRange = {
    LOWER: 10000,
    UPPER: 50000
  };

  var BorderPrice = {
    LOW: 'low',
    MIDDLE: 'middle',
    HIGH: 'high'
  };

  var TypeFilter = {
    ANY: 'any',
    TYPE: 'type',
    ROOMS: 'rooms',
    GUESTS: 'guests'
  };

  var Url = {
    LOAD: 'https://javascript.pages.academy/keksobooking/data',
    UPLOAD: 'https://javascript.pages.academy/keksobooking'
  };

  var TypePhotoOptions = {
    WIDTH: 70,
    HEIGHT: 70,
    BORDER_RADIUS: 5
  };

  var PinSetting = {
    HALF_WIDTH: 33,
    HALF_HEIGHT: 33,
    TAIL_HEIGHT: 16,
    MIN_X: 0,
    MIN_Y: 130,
    MAX_Y: 630
  };

  var rect = document.querySelector('.map__overlay').getBoundingClientRect();

  var getMinCoord = function () {
    return {
      x: PinSetting.MIN_X - PinSetting.HALF_WIDTH,
      y: PinSetting.MIN_Y - PinSetting.HALF_HEIGHT - PinSetting.TAIL_HEIGHT
    };
  };

  var getMaxCoord = function () {
    return {
      x: rect.width - PinSetting.HALF_WIDTH,
      y: PinSetting.MAX_Y - PinSetting.HALF_HEIGHT - PinSetting.TAIL_HEIGHT
    };
  };

  var isEscEvent = function (evt) {
    return evt.keyCode === KeyCode.ESC;
  };

  var isEnterEvent = function (evt) {
    return evt.keyCode === KeyCode.ENTER;
  };

  var isMouseLeftEvent = function (evt) {
    return evt.which === KeyCode.MOUSE_LEFT;
  };

  window.utils = {
    isEscEvent: isEscEvent,
    isEnterEvent: isEnterEvent,
    isMouseLeftEvent: isMouseLeftEvent,
    PriceNight: PriceNight,
    GuestType: GuestType,
    HouseType: HouseType,
    RoomsType: RoomsType,
    PinSetting: PinSetting,
    getMinCoord: getMinCoord,
    getMaxCoord: getMaxCoord,
    PinSize: PinSize,
    Url: Url,
    Status: Status,
    PINS_COUNT: PINS_COUNT,
    ZERO: ZERO,
    PriceRange: PriceRange,
    BorderPrice: BorderPrice,
    TypeFilter: TypeFilter,
    FILE_TYPES: FILE_TYPES,
    TypePhotoOptions: TypePhotoOptions,
    DEBOUNCE_INTERVAL: DEBOUNCE_INTERVAL,
    TWO: TWO
  };
})();
