var BIMCloud = BIMCloud || {};

BIMCloud.Viewer5d = function(containerName, initData) {

    BIMCloud.Event.call(this);
    

    var scope = this;

    this.container = null;
    this.playButton = null;
    this.previousButton = null;
    this.pauseButton = null;
    this.nextButton = null;
    this.stopButton = null;

    this.slider = null;
    this.table = null;

    this.percent = 0;

    //计划区间
    this.dateMin = new Date(9999, 12, 31);
    this.dateMax = new Date(0001, 1, 1);

    var analyize = function() {
        //5d table init
        var rows = initData;
        for (var i = 0; i < rows.length; i++) {
            var curRow = rows[i];
            var planStart = new Date(curRow.planStartTime);
            var planEnd = new Date(curRow.planEndTime);

            var realStart = new Date(curRow.realStartTime);
            var realEnd = new Date(curRow.realEndTime);

            if (planStart.getTime() < scope.dateMin.getTime())
                scope.dateMin = planStart;
            if (planEnd.getTime() > scope.dateMax.getTime())
                scope.dateMax = planEnd;

            if (realStart.getTime() < scope.dateMin.getTime())
                scope.dateMin = realStart;
            if (realEnd.getTime() > scope.dateMax.getTime())
                scope.dateMax = realEnd;

        }
    };
    //分析 initdata
    analyize();

    scope.dispose();

    //创建Control
    BIMCloud.UI.createControl(scope, containerName);

    //创建表格
    BIMCloud.UI.createTable(scope, initData);

    //创建折线图
    BIMCloud.UI.createChart(scope, initData);

    //每个percent耗时  1秒
    this.interval = 350;

    //每个percent 多少毫秒
    this.intervalTime = (this.dateMax - this.dateMin) / 100;

    //初始化界面
    new BIMCloud.Idle(scope).execute();

    //播放
    this.playButton.addEventListener("click", function() {
        if (scope.percent === 0) {
            scope.hideAll();
        }
        scope.play();
    });

    //上一步
    this.previousButton.addEventListener("click", function() {
        scope.previous();
    });

    //暂停
    this.pauseButton.addEventListener("click", function() {

        scope.pause();
    });

    //下一步
    this.nextButton.addEventListener("click", function() {
        scope.next();
    });

    //停止
    this.stopButton.addEventListener("click", function () {
        scope.showAll();
        scope.stop();
    });

    //界面UI => slider value
    $(this.slider).bind('slidechange', function(event, ui) {
        scope.percent = ui.value;
        scope.raiseSliderChanged();
    });

    //进度条变化 => 触发percent
    scope.addEventListener("sliderChanged", function(event) {
        var percent = event.percent;

        var currentTime = scope.dateMin.getTime() + percent * scope.intervalTime;

        var rows = scope.table.rows().data();

        for (var i = 0; i < rows.length; i++) {
            var currentRow = rows[i];

            var planStartTime = new Date(currentRow.planStartTime);
            var planEndTime = new Date(currentRow.planEndTime);

            if (currentTime > planEndTime.getTime()) {
                rows[i].percent = "100%";
            } else if (currentTime > planStartTime.getTime()) {
                var currentPercent = (currentTime - planStartTime.getTime()) / (planEndTime - planStartTime);
                rows[i].percent = parseInt(currentPercent * 100) + "%";
            } else {
                rows[i].percent = "0%";
            }
            scope.table.row(i).invalidate().draw();
        }

    });

    //进度条变化 => 触发chart
    scope.addEventListener("sliderChanged", function(event) {
        var percent = event.percent;
        var oneDay = 24 * 3600 * 1000;

        var currentTime = scope.dateMin.getTime() + percent * scope.intervalTime;
        if (currentTime >= scope.dateMax.getTime()) {
            scope.myChart.dispatchAction({
                type: 'showTip',
                dataIndex: scope.dataCount - 1,
            });
        } else {
            var index = percent * scope.intervalTime / oneDay;

            scope.myChart.dispatchAction({
                type: 'showTip',
                dataIndex: parseInt(index),
            });
        }

    });

    //进度条变化 => 触发showIds变化
    scope.showIds = [];
    scope.addEventListener("sliderChanged", function (event) {
        var currentIds = [];

        var percent = event.percent;
        
        var currentTime = scope.dateMin.getTime() + percent * scope.intervalTime;

        var rows = initData;

        for (var i = 0; i < rows.length; i++) {
            var currentRow = rows[i];
            var planStartTime = new Date(currentRow.planStartTime);
            if (currentTime > planStartTime.getTime()) {
                //当时间节点超过 起始时间
                for (var j = 0; j < currentRow.ids.length; j++) {
                    var id = currentRow.ids[j];
                    var idIndex = currentIds.indexOf(id);
                    if (idIndex === -1)
                        currentIds.push(id);
                }
            } 
        }
        
        //与showIds 比较 
        var equals = function (arrayA, arrayB) {
            if (arrayA.length !== arrayB.length)
                return false;
            for (var i = 0; i < arrayA.length; i++) {
                var isExist = arrayB.indexOf(arrayA[i]);
                if (isExist === -1)
                    return false;
            }
            return true;
        };

        if (!equals(currentIds, scope.showIds)) {
            scope.showIds = currentIds;
            scope.dispatchEvent({ type: "showIdsChanged", ids: scope.showIds });
        }
    }
    );
};

BIMCloud.Viewer5d.prototype = Object.create(BIMCloud.Event.prototype);

BIMCloud.Viewer5d.prototype.constructor = BIMCloud.Viewer5d;

BIMCloud.Viewer5d.prototype.setSliderValue = function (value) {
    $(this.slider).slider('value', value);
};

BIMCloud.Viewer5d.prototype.getSliderValue = function () {
    return $(this.slider).slider('value');
};

BIMCloud.Viewer5d.prototype.raiseSliderChanged = function () {
    var scope = this;
    scope.dispatchEvent({ type: "sliderChanged", percent: scope.percent });
};

BIMCloud.Viewer5d.prototype.play = function () {
    var scope = this;
    
    new BIMCloud.Play(scope).execute();
    
    var increase = function () {
        if (scope.percent < 100) {
            scope.percent = scope.percent + 1;
            scope.setSliderValue(scope.percent);
        } else {
            clearInterval(scope.timer);
            scope.percent = 0;
            new BIMCloud.Stop(scope).execute();
            scope.showAll();
            
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

BIMCloud.Viewer5d.prototype.showAll = function () {
    var scope = this;
    scope.dispatchEvent({ type: "showAll" });
};

BIMCloud.Viewer5d.prototype.hideAll = function () {
    var scope = this;
    scope.dispatchEvent({ type: "hideAll" });
};


BIMCloud.Viewer5d.prototype.dispose = function () {
    if (this.table)
        this.table.destroy();

    if (this.container)
        $(this.container).empty();

};