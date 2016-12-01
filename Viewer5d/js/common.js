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

BIMCloud.Common.createView = function (scope, containerName, initData) {
    var createElement = BIMCloud.Common.createElement;

    //main container
    var container = document.getElementById(containerName);

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

    //content container
    var contentConatiner = createElement("div", "viewer5d-ContentContainer");
    var tableContainer = createElement("div", "viewer5d-TableContainer");

    var contentTable = createElement("table", "viewer5d-Table","table table-striped table-bordered");
    var table = $("<thead><tr><th>百分比</th><th>名称</th><th>计划开始</th><th>计划结束</th> <th>实际开始</th><th>实际结束</th><th>专业</th><th>费用(万元)</th></tr></thead><tbody class='viewer5d-Table-Table'></tbody>");
    $(contentTable).append(table);

    //tableContainer.appendChild(contentTable);
    contentConatiner.appendChild(contentTable);

    var contentReportContainer = createElement("div", "viewer5d-ReportContainer");
    var contentReports = createElement("div", "viewer5d-Report");
    contentReportContainer.appendChild(contentReports);
    contentConatiner.appendChild(contentReportContainer);

    container.appendChild(controlContainer);
    container.appendChild(contentConatiner);

    //init slider
    scope.slider = $(controlSlider).slider();
    scope.table = $(contentTable).DataTable(
        {
        bJQueryUI:false,
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

    var chartDom = document.getElementById('viewer5d-Report');
    var myChart = echarts.init(chartDom);

    // 指定图表的配置项和数据
    var option = {
        title: {
            text: 'ECharts 入门示例'
        },
        tooltip: {},
        legend: {
            data: ['销量']
        },
        xAxis: {
            data: ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"]
        },
        yAxis: {},
        series: [{
            name: '销量',
            type: 'bar',
            data: [5, 20, 36, 10, 10, 20]
        }]
    };

    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
    
    chartDom.style.height = (container.clientHeight - 38) + "px";
    myChart.resize();

    $(window).resize(function () {
        chartDom.style.height = (container.clientHeight - 38) + "px";
        myChart.resize();
    });
};