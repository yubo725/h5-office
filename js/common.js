
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
var hoursNowStr = hoursNow < 10 ? ('0' + hoursNow) : ('' + hoursNow);
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
