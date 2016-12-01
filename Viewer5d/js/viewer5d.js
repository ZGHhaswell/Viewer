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
    
    var initData = [{
        percent: "0%",
        planName: "计划1",
        planStartTime: "2016-11-01",
        planEndTime: "2017-01-01",
        realStartTime: "2016-11-01",
        realEndTime: "2016-11-01",
        type: "土建",
        totalCost: "1000"
    },
    {
        percent: "0%",
        planName: "计划2",
        planStartTime: "2017-01-02",
        planEndTime: "2017-05-02",
        realStartTime: "2016-11-01",
        realEndTime: "2016-11-01",
        type: "土建",
        totalCost: "1000"
    },
        {
            percent: "0%",
            planName: "计划3",
            planStartTime: "2017-05-03",
            planEndTime: "2017-09-03",
            realStartTime: "2016-11-01",
            realEndTime: "2016-11-01",
            type: "土建",
            totalCost: "1000"
        }
    ];

    //创建View
    BIMCloud.Common.createView(scope, containerName, initData);

    //计划区间
    this.dateMin = new Date(9999,12,31);
    this.dateMax = new Date(0001, 1, 1);

    //5d table init
    var rows = scope.table.rows().data();
    for (var i = 0; i < rows.length; i++) {
        var curRow = rows[i];
        var planStart = new Date(curRow.planStartTime);
        var planEnd = new Date(curRow.planEndTime);
        
        if (planStart.getTime() < this.dateMin.getTime())
            this.dateMin = planStart;
        if (planEnd.getTime() > this.dateMax.getTime())
            this.dateMax = planEnd;

    }
    
    //每个percent耗时  1秒
    this.interval = 500;

    //每个percent 多少毫秒
    this.intervalTime = (this.dateMax - this.dateMin)/100;

    //初始化界面
    new BIMCloud.Idle(scope).execute();

    //播放
    this.playButton.addEventListener("click", function() {
        scope.play();
    });
    
    //上一步
    this.previousButton.addEventListener("click", function () {
        scope.previous();
    });

    //暂停
    this.pauseButton.addEventListener("click", function () {
        scope.pause();
    });

    //下一步
    this.nextButton.addEventListener("click", function () {
        scope.next();
    });
    
    //停止
    this.stopButton.addEventListener("click", function () {
        scope.stop();
    });

    //进度条变化
    scope.addEventListener("sliderChanged", function (event) {
        var percent = event.percent;

        var currentTime = scope.dateMin.getTime() + percent * scope.intervalTime;
        
        var rows = scope.table.rows().data();

        for (var i = 0; i < rows.length; i++) {
            var currentRow = rows[i];

            var planStartTime = new Date(currentRow.planStartTime);
            var planEndTime = new Date(currentRow.planEndTime);
            
            if (currentTime > planEndTime.getTime()) {
                rows[i].percent = "100%";
            }
            else if (currentTime > planStartTime.getTime()) {
                var currentPercent = (currentTime - planStartTime.getTime()) / (planEndTime - planStartTime);
                rows[i].percent = parseInt(currentPercent * 100) + "%";
            } else {
                rows[i].percent = "0%";
            }
            scope.table.row(i).invalidate().draw();
        }

    });


    
};

BIMCloud.Viewer5d.prototype = Object.create(BIMCloud.Event.prototype);

BIMCloud.Viewer5d.prototype.constructor = BIMCloud.Viewer5d;

BIMCloud.Viewer5d.prototype.setSliderValue = function (value) {
    var scope = this;

    scope.dispatchEvent({ type: "sliderChanged", percent: value });
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
    scope.timer = setInterval(increase, scope.interval);
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


BIMCloud.Viewer5d.prototype.dispose = function() {
    if (this.table)
        this.table.destroy();

};