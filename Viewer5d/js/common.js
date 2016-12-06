var BIMCloud = BIMCloud || {};

BIMCloud.UI = BIMCloud.UI || {};

BIMCloud.UI.createElement = function (tagName, id, className) {
    var element = document.createElement(tagName);
    if (className !== undefined)
        element.className = className;
    if (id !== undefined)
        element.id = id;

    return element;
};

BIMCloud.UI.createControl = function (scope, containerName) {
    var createElement = BIMCloud.UI.createElement;

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

BIMCloud.UI.createOption = function (scope) {
    var createElement = BIMCloud.UI.createElement;

    var container = scope.container;

    var optionContainer = createElement("div", "viewer5d-OptionContainer");

    var optionWrapper = createElement("div", "viewer5d-OptionWrapper");

    scope.optionControl = createElement("select", "viewer5d-Option");
    var planOption = new Option("按计划时间模拟", "按计划时间模拟");
    var realOption = new Option("按实际时间模拟", "按实际时间模拟");
    planOption.selected = true;
    scope.optionControl.add(planOption);
    scope.optionControl.add(realOption);
    
    optionWrapper.appendChild(scope.optionControl);

    optionContainer.appendChild(optionWrapper);

    var start = createElement("div", "viewer5d-Start");
    scope.startLabel = createElement("label", "viewer5d-StartLabel");
    scope.startLabel.innerText = "2016-11-11";
    start.appendChild(scope.startLabel);
    optionContainer.appendChild(start);
    
    var end = createElement("div", "viewer5d-End");
    scope.endLabel = createElement("label", "viewer5d-EndLabel");
    scope.endLabel.innerText = "2016-11-11";
    end.appendChild(scope.endLabel);
    optionContainer.appendChild(end);
    
    container.appendChild(optionContainer);

};

BIMCloud.UI.createTable = function (scope, initData) {
    var createElement = BIMCloud.UI.createElement;

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

BIMCloud.UI.createChart = function (scope, initData) {

    var container = scope.container;

    var chartDom = document.getElementById('viewer5d-Report');
    scope.myChart = echarts.init(chartDom);


    var buildData = function (date, rows, getStart, getEnd) {
        var currentValue = 0;
        var dateTime = date.getTime();
        
        for (var i = 0; i < rows.length; i++) {
            var curRow = rows[i];
            var planStart = new Date(getStart(curRow)).getTime();
            var planEnd = new Date(getEnd(curRow)).getTime();

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
            //name: [date.getFullYear(), date.getMonth() + 1, date.getDate()].join('-'),
            name: date.toString(),
            value: [
                [date.getFullYear(), date.getMonth() + 1, date.getDate()].join('-'),
                Math.round(currentValue)
            ]
        };
    };

    var getPlanStart = function(planData) {
        return planData.planStartTime;
    };
    
    var getPlanEnd = function (planData) {
        return planData.planEndTime;
    };


    var getRealStart = function (planData) {
        return planData.realStartTime;
    };

    var getRealEnd = function (planData) {
        return planData.realEndTime;
    };
    
    var buildDatas = function (scope, initData, min, max, getStart, getEnd) {
        var datas = [];
        datas.push(buildData(min, initData, getStart, getEnd));

        var dateMinTime = min.getTime();
        var dateMaxTime = max.getTime();
        
        var oneDay = 24 * 3600 * 1000;

        while (true) {
            dateMinTime = dateMinTime + oneDay;

            if (dateMinTime < dateMaxTime)
                datas.push(buildData(new Date(dateMinTime), initData, getStart, getEnd));
            else {
                break;
            }
        }

        datas.push(buildData(max, initData, getStart, getEnd));

        return datas;
    };

    var planDatas = buildDatas(scope, initData, scope.dateMin, scope.dateMax, getPlanStart, getPlanEnd);
    
    var realDatas = buildDatas(scope, initData, scope.dateRealMin, scope.dateRealMax, getRealStart, getRealEnd);

    scope.dataCount = planDatas.length;

    scope.realDataCount = realDatas.length;

    var option = {
        title: {
            text: '费用(万元)'
        },
        legend: {
            top:5,
            data: ['计划费用', '实际费用']
        },
        //grid: {
        //    left: '3%',
        //    right: '4%',
        //    bottom: '10%',
        //    containLabel: true
        //},
        toolbox: {
            feature: {
                
                saveAsImage: {
                    title:'保存'
                }
            }
        },
        tooltip: {
            trigger: 'axis',
            //trigger: 'item',

            formatter: function (params) {
                //计划
                var planParams = params[0];
                var planDate = new Date(planParams.name);
                
                var dateInfo = planDate.getFullYear() + '年' + (planDate.getMonth() + 1) + '月' + planDate.getDate() + '日' + '</br>';
                
                //实际
                var realParams = params[1];

                return dateInfo + '计划费用：' + planParams.value[1] + '万元' + '</br>' + '实际费用：'+ realParams.value[1] + '万元';
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
                
                interval:0   ,
                formatter: function (value, idx) {
                    var date = new Date(value);
                    return date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate() + '';
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
            name: '计划费用',
            type: 'line',
            smooth: true,
            showSymbol: false,
            hoverAnimation: true,
            data: planDatas
        },
            {
                name: '实际费用',
                type: 'line',
                smooth: true,
                showSymbol: false,
                hoverAnimation: true,
                data: realDatas
            }
        ]
    };

    scope.myChart.setOption(option);

    var resize = function () {
        chartDom.style.height = (container.clientHeight - 76) + "px";
        scope.myChart.resize();
    };

    resize();

    $(window).resize(function () {
        resize();
    });
};