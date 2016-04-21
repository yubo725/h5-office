//整个项目的根路径
var projectBaseUrl = "http://api.listome.com/app/";

//数据请求的根路径
var requestBaseUrl = "http://api.listome.com/v1/";

var Terminal = {
    // 辨别移动终端类型
    platform : function() {
        var u = navigator.userAgent, app = navigator.appVersion;
        return {
            // 是否为iPhone或者QQHD浏览器
            iPhone : u.indexOf('iPhone') > -1,
            // 是否iPad
            iPad : u.indexOf('iPad') > -1,
            // 是否微信
            weixin : u.toLowerCase().indexOf("micromessenger") > -1,
            // android终端或者uc浏览器
            android : u.indexOf('Android') > -1 || u.indexOf('Linux') > -1,
            // 是否WinPhone
            wp : u.indexOf('Windows Phone') > -1
        };
    }(),
}

var testToken = "DQpT/4N3uHmDmUrbGwq5oxWn3WkAckf/PhH2P6dV0hg=";

//获取AccessToken
function getToken() {
    if(typeof(window.js_interface) == "undefined"){
        var storage = window.localStorage;
        var token = storage.getItem('token');
        if(token == null){
            storage.setItem('token', testToken)
            return testToken;
        }
        return token;
    }

    var token = '';
    try {
        token = window.js_interface.getAccessToken();
    }catch(e) {
        console.log(e);
    }
    if (!Terminal.platform.android){
        var storage = window.localStorage;
        storage.setItem('token', token);
    }
    return token;
}

//APP跳转到新的窗口，并加载指定url
function openWindow(url) {
    if (typeof(window.js_interface) == "undefined") {
        location.href = url;
    } else {
        try {
            window.js_interface.jumpToDetail(url);
        }catch (e) {
            console.log(e);
        }
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

//根据年月获取该月的起止时间
function getStartEndTime(year, month) {
    var startDateStr = year + '/' + month + '/01 ' + '00:00:00';
    var endDateStr = '';
    if(month == 12) {
        endDateStr = (year + 1) + '/01/01 ' + '00:00:00';
    }else{
        endDateStr = (year) + '/' + (month + 1) + '/01 ' + '00:00:00';
    }
    var startDate = new Date(startDateStr);
    var endDate = new Date(endDateStr);
    var obj = {
        start_time: startDate / 1000,
        end_time: endDate / 1000 - 1
    };
    console.log(obj);
    return obj; 
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

//字符串时间转Unix时间戳
function strToUnixTimestamp(str) {
    return strToDate(str).getTime() / 1000;
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

var myLeaderEaseMobUsername = '';

//获取我的领导
function getMyLeader() {
    var url = "http://api.listome.com/v1/companies/users/boss";
    $.ajax({
        type: 'GET',
        url: url,
        headers: {
            'Authorization': 'Bearer ' + getToken()
        },
        success: function(response) {
            if(response.status == 10001) {
                $('#my_leader').val(response.data.name);
                //获取上级的环信用户名
                myLeaderEaseMobUsername = response.data.easemob_user;
            }else{
                $('#my_leader').val('加载领导信息失败');
            }
        },
        error: function() {
            $('#my_leader').val('加载领导信息失败');
        }
    })
}