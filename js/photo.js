'use strict';

(function () {
  var userPhotoChooser = document.querySelector('.ad-form__field input[type=file]'); // поле ввода, с помощью которого пользователь выбирает аватарку
  var mapAvatarUploader = document.querySelector('.ad-form-header__preview img'); // картинка, куда мы будем выставлять превью загруженной аватарки
  var typePhotoChooser = document.querySelector('.ad-form__upload input[type=file]'); // поле ввода, с помощью которого выбирается фото жилья
  var typePhotoImage = document.querySelector('.ad-form__photo'); // картинка, куда мы будем выставлять превью фото жилья
  var mapAvatarImgUrl = mapAvatarUploader.src;

  var changeUserPhoto = function (result) {
    mapAvatarUploader.src = result; // результат чтения файла — изображение — мы положим в атрибут src DOM-узла с превью картинки.
  };

  var changeTypePhoto = function (result) {
    var newPhoto = document.createElement('img');
    newPhoto.src = result;
    newPhoto.width = window.utils.TypePhotoOptions.WIDTH;
    newPhoto.height = window.utils.TypePhotoOptions.HEIGHT;
    newPhoto.style.borderRadius = window.utils.TypePhotoOptions.BORDER_RADIUS + 'px';
    typePhotoImage.appendChild(newPhoto); // запишем новое фото в превью фото жилья
  };

  var loadPreview = function (element, action) { // загружаем фото
    var file = element.files[0]; // У DOM-узла поля для выбора файла есть св-во files — это структура, похожая на массив, где хранится список хоть из одного файла.
    // если пользователь что-то выбрал, проверим, что именно он выбрал: изображение ли это, заканчивая типом изображения.
    if (file) {
      var fileName = file.name.toLowerCase(); // Файл в JS представлен в виде структуры, похожей на объект со св-ми. В св-ве name есть имя файла. Приведём название файла к строчным буквам

      var matches = window.utils.FILE_TYPES.some(function (item) { // проверим, оканчивается ли имя файла одним из допустимых расширений.
        return fileName.endsWith(item); // с помощью метода some пройдём по массиву FILE_TYPES и для каждого элемента проверим, оканчивается ли название файла на него. Используем метод строки endsWith.
      });

      if (matches) { // Метод some возвращает булево значение, было ли совпадение. Используем результат выполнения этого метода в условии.
        var reader = new FileReader(); // После того как файл выбран и проверки пройдены, его надо прочитать. Для этого воспользуемся FileReader. Заведём себе свой собственный «ридер».

        reader.addEventListener('load', function (evt) { // Добавим "чтецу" обработчик события load, которое можно читать как «чтение завершено».
          action(evt.target.result);
        });

        reader.readAsDataURL(file); //  просим ридер прочитать файл.
      }
    }
  };

  var onAvatarPhotoChange = function () {
    loadPreview(userPhotoChooser, changeUserPhoto); // загружаем фото пользователя с параметрами: поле ввода для аватарки и колбек с результатом "четеца"
  };

  var onTypePhotoChange = function () {
    loadPreview(typePhotoChooser, changeTypePhoto); // загружаем фото жилья с параметрами: поле ввода для фото жилья и колбек с результатом "чтеца"
  };

  userPhotoChooser.addEventListener('change', onAvatarPhotoChange); // Обработаем событие change, оно случится, когда пользователь выберет фото.
  typePhotoChooser.addEventListener('change', onTypePhotoChange);

  // удаляем фото
  var removeImage = function () {
    mapAvatarUploader.src = mapAvatarImgUrl;
    var typePhotos = typePhotoImage.querySelectorAll('img');
    if (typePhotos) {
      typePhotos.forEach(function (item) {
        item.remove(); // удаляем все фото из псевдомассива
      });
    }
  };

  window.photo = {
    remove: removeImage
  };
})();
