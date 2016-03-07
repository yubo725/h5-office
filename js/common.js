var baseUrl = 'http://api.listome.com/v1/';

$('.cell').bind('touchstart', function() {
    $(this).css('background-color', '#dcdcdc');
});

$('.cell').bind('touchend', function() {
    $(this).css('background-color', '');
});

function openWindow(url) {
    if (typeof(window.js_interface) == "undefined") {
        location.href = url;
    } else {
        window.js_interface.jumpToDetail(url);
    }
}

function getTimeStr(unixTime) {
    var date = new Date(unixTime * 1000);
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var hours = date.getHours();
    var min = date.getMinutes();
    return year + '/' + month + '/' + day + ' ' + hours + ':' + min;
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

var overtimeTypes = ['工作日加班', '双休日加班', '法定节假日加班', '其他'];

//根据加班类型获取加班类型ID
function getOvertimeTypeId(name) {
    for(var i = 0; i < overtimeTypes.length; i++) {
        if(name == overtimeTypes[i])
            return i;
    }
    return -1;
}
