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

    var contentTable = createElement("table", "viewer5d-Table", "table table-striped table-bordered");
    var table = $("<thead><tr><th>百分比</th><th>名称</th><th>计划开始</th><th>计划结束</th> <th>实际开始</th><th>实际结束</th><th>专业</th><th>费用(万元)</th></tr></thead><tbody class='viewer5d-Table-Table'></tbody>");
    $(contentTable).append(table);

    tableContainer.appendChild(contentTable);
    contentConatiner.appendChild(tableContainer);

    var contentReports = createElement("div", "viewer5d-Report");
    contentConatiner.appendChild(contentReports);

    container.appendChild(controlContainer);
    container.appendChild(contentConatiner);

    initData = [{
        percent: "0%",
        planName: "计划1",
        planStartTime: "2016-11-01",
        planEndTime: "2016-11-01",
        realStartTime: "2016-11-01",
        realEndTime: "2016-11-01",
        type: "土建",
        totalCost:"1000"
    },
    {
        percent: "0%",
        planName: "计划2",
        planStartTime: "2016-11-01",
        planEndTime: "2016-11-01",
        realStartTime: "2016-11-01",
        realEndTime: "2016-11-01",
        type: "土建",
        totalCost: "1000"
    }
    ];

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
};