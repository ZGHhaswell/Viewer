var BIMCloud = BIMCloud || {};

BIMCloud.Common = BIMCloud.Common || {};

BIMCloud.Common.createElement = function (tagName, id, className) {
    var element = document.createElement(tagName);
    if (className !== undefined)
        element.className = className;
    if (id !== undefined)
        element.id = id;

    return element;
};

BIMCloud.Common.createControl = function (scope, containerName) {
    var createElement = BIMCloud.Common.createElement;

    //main container
    scope.container = document.getElementById(containerName);

    //control container
    var controlContainer = createElement("div", "viewer5d-ControlerContainer");
    var controlMenu = createElement("div", "viewer5d-Menu");

    scope.playButton = new BIMCloud.imageButton(controlMenu, "viewer5d-Menu-PlayButton", "viewer5d-Menu-PlayButtonClick", "viewer5d-Menu-PlayButtonDisable");
    
    scope.previousButton = new BIMCloud.imageButton(controlMenu, "viewer5d-Menu-PreviousButton", "viewer5d-Menu-PreviousButtonClick", "viewer5d-Menu-PreviousButtonDisable");
    
    scope.pauseButton = new BIMCloud.imageButton(controlMenu, "viewer5d-Menu-PauseButton", "viewer5d-Menu-PauseButtonClick", "viewer5d-Menu-PauseButtonDisable");

    scope.nextButton = new BIMCloud.imageButton(controlMenu, "viewer5d-Menu-NextButton", "viewer5d-Menu-NextButtonClick", "viewer5d-Menu-NextButtonDisable");

    scope.stopButton = new BIMCloud.imageButton(controlMenu, "viewer5d-Menu-StopButton", "viewer5d-Menu-StopButtonClick", "viewer5d-Menu-StopButtonDisable");

    controlContainer.appendChild(controlMenu);
    

    //slider
    var controlSliderContainer = createElement("div", "viewer5d-SliderContainer");
    var controlSlider = createElement("div", "viewer5d-Slider");
    controlSliderContainer.appendChild(controlSlider);
    controlContainer.appendChild(controlSliderContainer);

    scope.container.appendChild(controlContainer);


    //init slider
    scope.slider = $(controlSlider).slider();

    
    
};

BIMCloud.Common.createTable = function (scope, initData) {
    var createElement = BIMCloud.Common.createElement;

    var container = scope.container;
    //content container
    var contentConatiner = createElement("div", "viewer5d-ContentContainer");

    var contentTable = createElement("table", "viewer5d-Table", "table table-striped table-bordered");
    var table = $("<thead><tr><th>百分比</th><th>名称</th><th>计划开始</th><th>计划结束</th> <th>实际开始</th><th>实际结束</th><th>专业</th><th>费用(万元)</th></tr></thead><tbody class='viewer5d-Table-Table'></tbody>");
    $(contentTable).append(table);
    contentConatiner.appendChild(contentTable);

    var contentReportContainer = createElement("div", "viewer5d-ReportContainer");
    var contentReports = createElement("div", "viewer5d-Report");
    contentReportContainer.appendChild(contentReports);
    contentConatiner.appendChild(contentReportContainer);

    container.appendChild(contentConatiner);

    
    scope.table = $(contentTable).DataTable(
        {
            bJQueryUI: false,
            bInfo: false,
            bServerSide: false,
            bPaginate: false,           //是否分页。 
            bProcessing: false,          //当datatable获取数据时候是否显示正在处理提示信息。 
            bFilter: false,            //是否使用内置的过滤功能。 
            bLengthChange: false,         //是否允许用户自定义每页显示条数。 
            ordering: false,
            bAutoWidth: true,
            oLanguage: {
                sZeroRecords: "没有数据！"
            },
            //每页显示三条数据

            columns: [
            {
                "data": "percent"
            },
            {
                "data": "planName"
            },
            {
                "data": "planStartTime"
            },
            {
                "data": "planEndTime"
            },
            {
                "data": "realStartTime"
            },
            {
                "data": "realEndTime"
            },
            {
                "data": "type"
            },
            {
                "data": "totalCost"
            }
            ],

            data: initData,
        }
    );

};

BIMCloud.Common.createChart = function (scope, initData) {

    var container = scope.container;

    var chartDom = document.getElementById('viewer5d-Report');
    scope.myChart = echarts.init(chartDom);


    var buildData = function (date, initData) {
        var currentValue = 0;
        var dateTime = date.getTime();
        var rows = initData;
        for (var i = 0; i < rows.length; i++) {
            var curRow = rows[i];
            var planStart = new Date(curRow.planStartTime).getTime();
            var planEnd = new Date(curRow.planEndTime).getTime();

            if(dateTime > planEnd)
            {
                currentValue = parseInt( currentValue) + parseInt(curRow.totalCost);
            }
            else if(dateTime > planStart)
            {
                var percentValue = (dateTime - planStart) / (planEnd - planStart);
                currentValue = currentValue + percentValue * curRow.totalCost;
            }
        }

        return {
            name: date.toString(),
            value: [
                [date.getFullYear(), date.getMonth() + 1, date.getDate()].join('-'),
            Math.round(currentValue)
            ]

        }
    };


    var data = [];

    var dateMin = scope.dateMin;
    var dateMax = scope.dateMax;
    var oneDay = 24 * 3600 * 1000;

    data.push(buildData(dateMin, initData));

    var dateMinTime = scope.dateMin.getTime();
    var dateMaxTime = scope.dateMax.getTime();

    while(true)
    {
        dateMinTime = dateMinTime + oneDay;

        if (dateMinTime < dateMaxTime)
            data.push(buildData(new Date(dateMinTime), initData));
        else
        {
            break;
        }
    } 

    data.push(buildData(dateMax, initData));

    option = {
        title: {
            text: '费用(万元)'
        },
        tooltip: {
            trigger: 'axis',
            formatter: function (params) {
                params = params[0];
                var date = new Date(params.name);

                return date.getFullYear() + '年' + (date.getMonth() + 1) + '月' + date.getDate() + '日' + '</br>计划费用：' + params.value[1] + '万元';
            },
            axisPointer: {
                animation: false
            }
        },
        xAxis: {
            type: 'time',
            splitLine: {
                show: false
            },
            axisLabel: {
                formatter: function (value, idx) {
                    var date = new Date(value);
                    return date.getFullYear() + '年' + (date.getMonth() + 1) + '月' + date.getDate() + '日';
        }
    },
        },
        yAxis: {
            type: 'value',
            //boundaryGap: [0, '100%'],
            splitLine: {
                show: true
            }
        },
        series: [{
            name: '5d数据',
            type: 'line',
            smooth: true,
            showSymbol: false,
            hoverAnimation: false,
            data: data
        }]
    };

    scope.myChart.setOption(option);

    var resize = function () {
        chartDom.style.height = (container.clientHeight - 38) + "px";
        scope.myChart.resize();
    };

    resize();

    $(window).resize(function () {
        resize();
    });
};