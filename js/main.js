'use strict';

(function () {
  window.form.startingPage();
  var marks = window.data.getMarks(8);
  window.map.initMainPinEvents(marks);
})();
