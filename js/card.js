'use strict';

(function () {

  var popupTemplate = document.querySelector('#card').content.querySelector('.map__card.popup');
  var mapFiltersContainer = document.querySelector('.map__filters-container');
  var mapCard = null;

  // Обработчик закрытия окна по нажатию на ESC
  var onDocumentKeyDown = function (evt) {
    if (window.utils.isEscEvent(evt)) {
      removePopup();
    } // При клике на кнопку автивируем метки
  };

  // Удаляем со страницы попап
  var removePopup = function () {
    if (mapCard !== null) { // если ссылка на дом-элемент не пустая, т.е уже открыто одно объявление
      mapCard.remove(); // то удалить, чтобы на странице было показано только одно
      window.pin.removeActivePin(); // убираем подсветку с выбранной метки
      document.removeEventListener('keydown', onDocumentKeyDown);
    }
  };

  // Переводим названия типа жилья
  var convertTypeHouse = function (type) {
    var typeValue = window.form.TYPES[type];
    return typeValue;
  };

  // Заполняем объявление на карте. Клонирование
  var renderPopup = function (mark) {
    removePopup();
    mapCard = popupTemplate.cloneNode(true); // склонированный попап
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

    var popupPhotosContainer = mapCard.querySelector('.popup__photos'); // конрейнер для фотографий
    renderPhotos(popupPhotosContainer, mark.offer.photos);

    mapFiltersContainer.insertAdjacentElement('beforebegin', mapCard);

    var closePopupButton = mapCard.querySelector('.popup__close');// Закрываем объявление по нажатию на крестик или по нажатию на Esc
    document.addEventListener('keydown', onDocumentKeyDown); // Закрываем объявление по нажатию на Esc
    closePopupButton.addEventListener('click', removePopup); // Закрываем объявление по нажатию на крестик
  };

  // рендерим фитчи с проверкой на их наличии в контейнере
  var renderFeatures = function (container, features) {
    if (features.length === 0) {
      container.remove();
      return;
    }

    container.innerHTML = ''; // вносим в разметку контейнер

    var featureFragment = document.createDocumentFragment(); // фрагмент с фитчами
    features.forEach(function (item) {
      var featureItem = document.createElement('li');
      featureItem.className = 'popup__feature popup__feature--' + item;
      featureFragment.appendChild(featureItem); // получившийся li складываем во фрагмент
    });

    container.appendChild(featureFragment); // а фрагмент в контейнер
  };

  // Функция рендера и проверки контейнера с фотографиями на наличие фото
  var renderPhotos = function (container, imgs) {
    if (imgs.length === 0) {
      container.remove();
      return;
    }

    renderPhotosImages(container, imgs); // вызвать функцию renderPhotos и передать 2 параметра, 1 контэйнер, 2 массив imgs
  };

  // Колонируем фотографии в их контейнер
  var renderPhotosImages = function (popupPhotos, photos) {
    var firstImage = popupPhotos.querySelector('.popup__photo'); // Шаблон
    var fragment = document.createDocumentFragment();
    firstImage.remove(); // очистить контэйнер

    photos.forEach(function (photo) {
      var cloneImage = firstImage.cloneNode(true);// шаблон клонировать в переменную
      cloneImage.src = photo;
      fragment.appendChild(cloneImage);
    });

    firstImage.remove(); // очистить контэйнер
    popupPhotos.appendChild(fragment);
  };

  // EXPORT
  window.card = {
    renderPopup: renderPopup,
    removePopup: removePopup
  };
})();
