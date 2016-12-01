var BIMCloud = BIMCloud || {};

BIMCloud.Idle = function (viewer5d) {
    var scope = viewer5d;
    this.execute = function () {
        scope.playButton.isChecked = false;
        scope.previousButton.isChecked = false;
        scope.pauseButton.isChecked = false;
        scope.nextButton.isChecked = false;
        scope.stopButton.isChecked = true;

        scope.playButton.isEnable = true;
        scope.previousButton.isEnable = false;
        scope.pauseButton.isEnable = false;
        scope.nextButton.isEnable = false;
        scope.stopButton.isEnable = true;
    };
};

BIMCloud.Play = function (viewer5d) {
    var scope = viewer5d;

    this.execute = function () {
        
        scope.previousButton.isChecked = false;
        scope.pauseButton.isChecked = false;
        scope.nextButton.isChecked = false;
        scope.stopButton.isChecked = false;

        scope.previousButton.isEnable = false;
        scope.pauseButton.isEnable = true;
        scope.nextButton.isEnable = false;
        scope.stopButton.isEnable = true;
        
        scope.playButton.isEnable = true;
        scope.playButton.isChecked = true;
    };
};

BIMCloud.Previous = function (viewer5d) {
    var scope = viewer5d;
    this.execute = function () {
        scope.playButton.isChecked = false;
        scope.nextButton.isChecked = false;
        scope.stopButton.isChecked = false;

        scope.playButton.isEnable = true;
        scope.nextButton.isEnable = true;
        scope.stopButton.isEnable = true;
        
        scope.previousButton.isEnable = true;
        scope.previousButton.isChecked = true;
        setTimeout(function () {
            scope.previousButton.isChecked = false;
            scope.previousButton.isEnable = true;
        }, 100);
    };
};

BIMCloud.Pause = function (viewer5d) {
    var scope = viewer5d;
    this.execute = function () {
        scope.playButton.isChecked = false;
        scope.previousButton.isChecked = false;
        scope.nextButton.isChecked = false;
        scope.stopButton.isChecked = false;

        scope.playButton.isEnable = true;
        scope.previousButton.isEnable = true;
        scope.nextButton.isEnable = true;
        scope.stopButton.isEnable = true;
        
        scope.pauseButton.isEnable = true;
        scope.pauseButton.isChecked = true;
    };
};

BIMCloud.Next = function (viewer5d) {
    var scope = viewer5d;
    this.execute = function () {
        scope.playButton.isChecked = false;
        scope.previousButton.isChecked = false;
        scope.stopButton.isChecked = false;

        scope.playButton.isEnable = true;
        scope.previousButton.isEnable = true;
        scope.stopButton.isEnable = true;

        scope.nextButton.isEnable = true;
        scope.nextButton.isChecked = true;
        setTimeout(function () {
            scope.nextButton.isChecked = false;
            scope.nextButton.isEnable = true;
        }, 100);
    };
};

BIMCloud.Stop = function (viewer5d) {
    var scope = viewer5d;
    this.execute = function () {
        scope.playButton.isChecked = false;
        scope.previousButton.isChecked = false;
        scope.pauseButton.isChecked = false;
        scope.nextButton.isChecked = false;
        

        scope.playButton.isEnable = true;
        scope.previousButton.isEnable = false;
        scope.pauseButton.isEnable = false;
        scope.nextButton.isEnable = false;
        
        
        scope.stopButton.isEnable = true;
        scope.stopButton.isChecked = true;
        setTimeout(function () {
            scope.stopButton.isChecked = false;
            scope.stopButton.isEnable = false;
        }, 100);
    };
};