'use strict';

(function () {
  var produceXhr = function (method, url, onSuccess, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      var error;
      switch (xhr.status) {
        case window.utils.Status.SUCCESS:
          onSuccess(xhr.response);
          break;

        case window.utils.Status.INVALID_REQUEST:
          error = 'Неверный запрос';
          break;
        case window.utils.Status.NOT_AUTHORIZED:
          error = 'Пользователь не авторизован';
          break;
        case window.utils.Status.ERROR_NOT_FOUND:
          error = 'Ничего не найдено';
          break;
        case window.utils.Status.SERVER_ERROR:
          error = 'Во время обращения к серверу произошла ошибка. Пожалуйста, проверьте ваше интернет-соединение и обновите страницу';
          break;
        default:
          error = 'Cтатус ответа: ' + xhr.status + ' ' + xhr.statusText;
      }
      if (error) {
        onError(error);
      }
    });

    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });

    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });

    xhr.timeout = window.utils.Status.TIMEOUT_TIME;
    xhr.open(method, url);
    return xhr;
  };

  var load = function (onSuccess, onError) {
    produceXhr('GET', window.utils.Url.LOAD, onSuccess, onError).send();
  };

  var upload = function (onSuccess, onError, data) {
    produceXhr('POST', window.utils.Url.UPLOAD, onSuccess, onError).send(data);
  };

  window.backend = {
    load: load,
    upload: upload
  };
})();

