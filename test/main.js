var
  should = require('should'),
  converter = require('..')
  ;

describe('svg2android', function () {


  it('should work', function() {

    converter('<svg><path d="M0 0 L 10 10 12 12z z M 30 30 L 10 10" /></svg>')
      .should
      .eql('<vector xmlns:android="http://schemas.android.com/apk/res/android" android:width="30dp" android:height="30dp" android:viewportWidth="30" android:viewportHeight="30"><path android:fillColor="#FF000000" android:pathData="M0,0l10,10l2,2Zm30,30l-20-20"/></vector>');

    converter('<svg><path d="M-10 -10 L0,0" /></svg>')
      .should
      .eql('<vector xmlns:android="http://schemas.android.com/apk/res/android" android:width="10dp" android:height="10dp" android:viewportWidth="10" android:viewportHeight="10"><path android:fillColor="#FF000000" android:pathData="M0,0l10,10"/></vector>');

    converter('<svg viewBox="-10 -10 100 100"><path d="M0 0 L 10 10 12 12z z M 30 30 L 10 10" /></svg>')
      .should
      .eql('<vector xmlns:android="http://schemas.android.com/apk/res/android" android:width="100dp" android:height="100dp" android:viewportWidth="100" android:viewportHeight="100"><path android:fillColor="#FF000000" android:pathData="M10,10l10,10l2,2Zm30,30l-20-20"/></vector>');

  });

  it('should throw error for non simplified SVG', function() {

    (function(){
      converter('<svg><path d=\"M0 0 L 10 10 12 12z z M 30 30 L 10 10\" /><rect /></svg>')
    })
      .should
      .throw();


  });

});