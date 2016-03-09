var baseUrl = "http://192.168.1.170:8088/h5Office/";

//获取AccessToken
function getToken() {
    if(window.js_interface) {
        return window.js_interface.getAccessToken();
    }
    return 'qbVlfah+8/SKc/o4YsuZYnfJAtQykxKbuY2EL1FMhsk=';
}

//菜单按下时添加背景颜色
$('.cell').bind('touchstart', function() {
    $(this).css('background-color', '#dcdcdc');
});

//菜单不被按下时取消背景颜色
$('.cell').bind('touchend', function() {
    $(this).css('background-color', '');
});

//APP跳转到新的窗口，并加载指定url
function openWindow(url) {
    if (typeof(window.js_interface) == "undefined") {
        location.href = url;
    } else {
        window.js_interface.jumpToDetail(url);
    }
}

//根据Unix时间戳获取对应的格式化时间，格式为yyyy/MM/dd HH:mm
function getTimeStr(unixTime) {
    var date = new Date(unixTime * 1000);
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var hours = date.getHours();
    var min = date.getMinutes();
    return year + '-' + numberProcess(month) + '-' + numberProcess(day) + ' ' + numberProcess(hours) + ':' + numberProcess(min);
}

function numberProcess(n) {
    if(n < 10) {
        return '0' + n;
    }
    return '' + n;
}

var dateNow = new Date();
var yearNow = dateNow.getFullYear();
var monthNow = dateNow.getMonth() + 1;
var dayNow = dateNow.getDate();
var hoursNow = dateNow.getHours();
var minutesNow = dateNow.getMinutes();
var yearNowStr = '' + yearNow;
var monthNowStr = monthNow < 10 ? ('0' + monthNow) : ('' + monthNow);
var dayNowStr = dayNow < 10 ? ('0' + dayNow) : ('' + dayNow);
// var hoursNowStr = hoursNow < 10 ? ('0' + hoursNow) : ('' + hoursNow);
var hoursNowStr = '' + hoursNow;
var minutesNowStr = minutesNow < 10 ? ('0' + minutesNow) : ('' + minutesNow);

//获取当前时间对象
function getTimeNow() {
    return {
        year: yearNow,
        month: monthNow,
        day: dayNow,
        hour: hoursNow,
        minute: minutesNow,
        yearStr: yearNowStr,
        monthStr: monthNowStr,
        dayStr: dayNowStr,
        hourStr: hoursNowStr,
        minuteStr: minutesNowStr 
    }
}

//判断一个字符串是否为空
function isEmpty(val) {
    return val == null || val == '' || val.trim() == '';
}

//判断是否是数字
function isNumber(n) {
    return !isNaN(n);
}

//字符串转日期，字符串格式为yyyy-MM-dd HH:mm:ss
function strToDate(str) {
    var s = str.replace(/-/g,"/");
    return new Date(s);
}

//比较两个格式为yyyy-MM-dd HH:mm:ss的字符串对应的时间大小，dateStr1大于dateStr2则返回1，小于则返回-1，相等返回0
function compareDateStr(dateStr1, dateStr2) {
    var date1 = strToDate(dateStr1).getTime();
    var date2 = strToDate(dateStr2).getTime();
    if(date1 > date2) {
        return 1;
    }else if(date1 == date2) {
        return 0;
    }
    return -1;
}

var isBoss = getIsBoss();

//判断当前用户是否是上级，上级有审核选项卡
function getIsBoss() {
    var boss = false;
    $.ajax({
        type: 'GET',
        url: 'http://api.listome.com/v1/companies/users/isboss',
        headers: {
            'Authorization': 'Bearer ' + getToken()
        },
        async:false,
        success: function(response) {
            if(response.status == 10001){
                boss = true;
            }
        }
    });
    return boss;
}

//获取URL参数
function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg);  //匹配目标参数
    if (r != null) {
        return unescape(r[2]); 
    }
    return null; //返回参数值
}

//获取当前用户的角色，如果是人事，则显示人脸采样菜单，否则隐藏
function getRole() {
    var role = 0;
    $.ajax({
        type: 'GET',
        url: 'http://api.listome.com/v1/companies/users/roles',
        headers: {
            'Authorization': 'Bearer ' + getToken()
        },
        async: false,
        success: function(response) {
            if(response.status == 10001){
                role = response.data.id;
            }
        }
    });
    return role;
}