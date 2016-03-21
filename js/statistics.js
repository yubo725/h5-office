if(window.js_interface) {
	window.js_interface.useGoBack(true);
}

$('#boss-menu-attendance').click(function(){
	window.location = "statistics_employer_attendance.html";
});

$('#boss-menu-salary').click(function(){
	window.location = "statistics_employer_salary.html";
});

$('#employee-menu-attendance').click(function(){
	window.location = "statistics_employee_attendance.html";
});

$('#employee-menu-hours').click(function(){
	window.location = "statistics_employee_hours.html";
});

//获取整体出勤数据
function getWholeAttendance() {
    $.ajax({
        url: 'http://api.listome.cn/v1/companies/statistic/companies/checkin',
        type: 'GET',
        headers: {
            'Authorization': 'Bearer ' + getToken()
        },
        data: {
            start_time: '',
            end_time: ''
        },
        success: function(response) {

        },
        error: function() {

        }
    })
}

/****
var titles = ['整体出勤率统计', '工资发放统计', '本月出勤统计', '本月工时统计'];
var clickHandlers = [loadAllAttendance, loadAllSalary, loadEmployeeAttendance, loadEmployeeHours];
var btnGroup1 = [];
for (var i = 0; i < titles.length; i++) {
    btnGroup1.push({
        text: titles[i],
        onClick: clickHandlers[i]
    })
}
var btnGroup2 = [{
    text: '取消',
    bg: 'danger'
}];
var groups = [btnGroup1, btnGroup2];

//弹出操作表
$('#title-select').click(function() {
    $.actions(groups);
})

loadAllAttendance();

//加载整体出勤率统计表
function loadAllAttendance() {
	$('.item-title').text(titles[0]);
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById('main'));
    var dataLabelFontSize = 30;

    var pieOption = {
        title: {
            text: '本月出勤天数统计图',
            subtext: '单位：人/天',
            x: 'center'
        },
        tooltip: {
            trigger: 'item'
        },
        legend: {
            orient: 'horizontal',
            top: 60,
            data: ['正常上下班', '迟到', '早退', '请假', '调休', '旷工']
        },
        series: [{
            name: '出勤率',
            type: 'pie',
            radius: '55%',
            data: [
                { value: 300, name: '正常上下班' },
                { value: 20, name: '迟到' },
                { value: 5, name: '早退' },
                { value: 30, name: '请假' },
                { value: 80, name: '调休' },
                { value: 5, name: '旷工' },
            ]
        }]
    };

    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(pieOption);
}

//加载整体工资统计表
function loadAllSalary() {
	$('.item-title').text(titles[1]);
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById('main'));
    var dataLabelFontSize = 30;

    var pieOption = {
        title: {
            text: '本月工资统计图',
            subtext: '单位：万',
            x: 'center'
        },
        tooltip: {
            trigger: 'item'
        },
        legend: {
            orient: 'horizontal',
            top: 60,
            data: ['正常上班发放工资', '加班发放工资']
        },
        series: [{
            name: '本月工时统计',
            type: 'pie',
            radius: '55%',
            data: [
                { value: 302.3, name: '正常上班发放工资' },
                { value: 20.8, name: '加班发放工资' },
            ]
        }]
    };

    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(pieOption);
}

//加载某个员工的出勤率统计表
function loadEmployeeAttendance() {
	$('.item-title').text(titles[2]);
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById('main'));
    var dataLabelFontSize = 30;

    var pieOption = {
        title: {
            text: '本月出勤天数统计图',
            subtext: '单位：天',
            x: 'center'
        },
        tooltip: {
            trigger: 'item'
        },
        legend: {
            orient: 'horizontal',
            top: 60,
            data: ['正常上下班', '迟到', '早退', '请假', '调休', '旷工']
        },
        series: [{
            name: '出勤率',
            type: 'pie',
            radius: '55%',
            data: [
                { value: 20, name: '正常上下班' },
                { value: 6, name: '迟到' },
                { value: 1, name: '早退' },
                { value: 1, name: '请假' },
                { value: 1, name: '调休' },
                { value: 1, name: '旷工' },
            ]
        }]
    };

    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(pieOption);
}

//加载某个员工的工资统计表
function loadEmployeeHours() {
	$('.item-title').text(titles[3]);
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById('main'));
    var dataLabelFontSize = 30;

    var pieOption = {
        title: {
            text: '本月工时统计图',
            subtext: '单位：小时',
            x: 'center'
        },
        tooltip: {
            trigger: 'item'
        },
        legend: {
            orient: 'horizontal',
            top: 60,
            data: ['正常上班工时', '加班工时']
        },
        series: [{
            name: '本月工时统计',
            type: 'pie',
            radius: '55%',
            data: [
                { value: 38, name: '正常上班工时' },
                { value: 12, name: '加班工时' },
            ]
        }]
    };

    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(pieOption);
}

****/
// 加上
// 1）一个月迟到率部门每天线性统计图
// 2）一个月迟到人数清单，重点突出前十名
// 3）每月迟到最少的前十位
// 4）部门加班率统计图
// 5）每月加班时间率部门每天线性统计图
// 6）加班人数清单，加班时间最多前10名和最少人清单前10名
// 7）每年可以评出迟到早退最少的最勤奋前十位员工
