'use strict';

(function () {
  var userPhotoChooser = document.querySelector('.ad-form__field input[type=file]');
  var mapAvatarUploader = document.querySelector('.ad-form-header__preview img');
  var typePhotoChooser = document.querySelector('.ad-form__upload input[type=file]');
  var typePhotoImage = document.querySelector('.ad-form__photo');
  var mapAvatarImgUrl = mapAvatarUploader.src;

  var changeUserPhoto = function (result) {
    mapAvatarUploader.src = result;
  };

  var changeTypePhoto = function (result) {
    var newPhoto = document.createElement('img');
    newPhoto.src = result;
    newPhoto.width = window.utils.TypePhotoOptions.WIDTH;
    newPhoto.height = window.utils.TypePhotoOptions.HEIGHT;
    newPhoto.style.borderRadius = window.utils.TypePhotoOptions.BORDER_RADIUS + 'px';
    typePhotoImage.appendChild(newPhoto);
  };

  var loadPreview = function (element, action) {
    var file = element.files[0];
    if (file) {
      var fileName = file.name.toLowerCase();

      var matches = window.utils.FILE_TYPES.some(function (item) {
        return fileName.endsWith(item);
      });

      if (matches) {
        var reader = new FileReader();

        reader.addEventListener('load', function (evt) {
          action(evt.target.result);
        });

        reader.readAsDataURL(file);
      }
    }
  };

  var onAvatarPhotoChange = function () {
    loadPreview(userPhotoChooser, changeUserPhoto);
  };

  var onTypePhotoChange = function () {
    loadPreview(typePhotoChooser, changeTypePhoto);
  };

  userPhotoChooser.addEventListener('change', onAvatarPhotoChange);
  typePhotoChooser.addEventListener('change', onTypePhotoChange);

  var removeImage = function () {
    mapAvatarUploader.src = mapAvatarImgUrl;
    var typePhotos = typePhotoImage.querySelectorAll('img');
    if (typePhotos) {
      typePhotos.forEach(function (item) {
        item.remove();
      });
    }
  };

  window.photo = {
    remove: removeImage
  };
})();
