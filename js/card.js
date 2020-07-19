'use strict';

(function () {

  var popupTemplate = document.querySelector('#card').content.querySelector('.map__card.popup');
  var mapFiltersContainer = document.querySelector('.map__filters-container');
  var mapCard = null;

  var onDocumentKeyDown = function (evt) {
    if (window.utils.isEscEvent(evt)) {
      removePopup();
    }
  };

  var removePopup = function () {
    if (mapCard !== null) {
      mapCard.remove();
      window.pin.removeActivate();
      document.removeEventListener('keydown', onDocumentKeyDown);
    }
  };

  var convertTypeHouse = function (type) {
    var typeValue = window.form.TYPES[type];
    return typeValue;
  };

  var renderPopup = function (mark) {
    removePopup();
    mapCard = popupTemplate.cloneNode(true);
    mapCard.querySelector('.popup__title').textContent = mark.offer.title;
    mapCard.querySelector('.popup__text--address').textContent = mark.offer.address;
    mapCard.querySelector('.popup__text--price').textContent = mark.offer.price + ' ₽/ночь';
    mapCard.querySelector('.popup__text--capacity').textContent = mark.offer.rooms + ' комнаты для ' + mark.offer.guests + ' гостей';
    mapCard.querySelector('.popup__text--time').textContent = 'Заезд после ' + mark.offer.checkin + ', выезд до ' + mark.offer.checkout;
    mapCard.querySelector('.popup__type').textContent = convertTypeHouse[mark.offer.type.toUpperCase()];
    mapCard.querySelector('.popup__description').textContent = mark.offer.description;
    mapCard.querySelector('.popup__avatar').src = mark.author.avatar;

    var popupFeaturesContainer = mapCard.querySelector('.popup__features');
    renderFeatures(popupFeaturesContainer, mark.offer.features);

    var popupPhotosContainer = mapCard.querySelector('.popup__photos');
    renderPhotos(popupPhotosContainer, mark.offer.photos);

    mapFiltersContainer.insertAdjacentElement('beforebegin', mapCard);

    var closePopupButton = mapCard.querySelector('.popup__close');
    document.addEventListener('keydown', onDocumentKeyDown);
    closePopupButton.addEventListener('click', function () {
      removePopup();
    });
  };

  var renderFeatures = function (container, features) {
    if (features.length === 0) {
      container.remove();
      return;
    }

    container.innerHTML = '';

    var featureFragment = document.createDocumentFragment();
    features.forEach(function (item) {
      var featureItem = document.createElement('li');
      featureItem.className = 'popup__feature popup__feature--' + item;
      featureFragment.appendChild(featureItem);
    });

    container.appendChild(featureFragment);
  };

  var renderPhotos = function (container, imgs) {
    if (imgs.length === 0) {
      container.remove();
      return;
    }

    renderPhotosImages(container, imgs);
  };

  var renderPhotosImages = function (popupPhotos, photos) {
    var firstImage = popupPhotos.querySelector('.popup__photo');
    var fragment = document.createDocumentFragment();
    firstImage.remove();

    photos.forEach(function (photo) {
      var cloneImage = firstImage.cloneNode(true);
      cloneImage.src = photo;
      fragment.appendChild(cloneImage);
    });

    firstImage.remove();
    popupPhotos.appendChild(fragment);
  };

  window.card = {
    renderPopup: renderPopup,
    removePopup: removePopup
  };
})();

