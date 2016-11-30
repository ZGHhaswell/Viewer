var BIMCloud = BIMCloud || {};

BIMCloud.Viewer5d = function (containerName, viewer) {

    BIMCloud.Event.call(this);

    var scope = this;

    this.playButton = null;
    this.previousButton = null;
    this.pauseButton = null;
    this.nextButton = null;
    this.stopButton = null;

    this.slider = null;
    this.table = null;

    this.percent = 0;
    
    BIMCloud.Common.createView(scope, containerName);

    new BIMCloud.Stop(scope).execute();

    this.playButton.addEventListener("click", function() {
        scope.play();
    });
    
    this.previousButton.addEventListener("click", function () {
        scope.previous();
    });

    this.pauseButton.addEventListener("click", function () {
        scope.pause();
    });


    this.nextButton.addEventListener("click", function () {
        scope.next();
    });
    
    this.stopButton.addEventListener("click", function () {
        scope.stop();
    });


    //var nTrs = this.table.fnGetNodes();

    //var data = this.table.fnGetData(nTrs);
};

BIMCloud.Viewer5d.prototype = Object.create(BIMCloud.Event.prototype);

BIMCloud.Viewer5d.prototype.constructor = BIMCloud.Viewer5d;

BIMCloud.Viewer5d.prototype.setSliderValue = function(value) {
    $(this.slider).slider('value', value);
};

BIMCloud.Viewer5d.prototype.getSliderValue = function () {
    return $(this.slider).slider('value');
};


BIMCloud.Viewer5d.prototype.play = function () {
    var scope = this;
    
    new BIMCloud.Play(scope).execute();
    
    var increase = function () {
        if (scope.percent < 100) {
            scope.percent = scope.percent + 1;
            scope.setSliderValue(scope.percent);
        } else {
            scope.stop();
        }
        
    };
    scope.timer = setInterval(increase, 1000);
};

BIMCloud.Viewer5d.prototype.previous = function() {
    var scope = this;

    new BIMCloud.Previous(scope).execute();

    if (scope.percent > 0) {
        scope.percent = scope.percent - 1;
        scope.setSliderValue(scope.percent);
    }
    
};

BIMCloud.Viewer5d.prototype.pause = function() {
    var scope = this;
    
    new BIMCloud.Pause(scope).execute();
    
    clearInterval(scope.timer);
};

BIMCloud.Viewer5d.prototype.next = function () {
    var scope = this;

    new BIMCloud.Next(scope).execute();

    if (scope.percent <100) {
        scope.percent = scope.percent + 1;
        scope.setSliderValue(scope.percent);
    }

};

BIMCloud.Viewer5d.prototype.stop = function () {
    var scope = this;

    new BIMCloud.Stop(scope).execute();

    clearInterval(scope.timer);
    scope.percent = 0;
    scope.setSliderValue(scope.percent);
};
