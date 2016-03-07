// $.showPreloader('loading...');
var token = "mf1sdmiYnhK5SY6Ozn66Hu7Kl7M4lXRphI03hzddasM=";
//加载请假列表
function loadList() {
    $.ajax({
        type: 'GET',
        url: 'http://api.listome.com/v1/companies/users/leave',
        headers: {
            "Authorization": "Bearer " + token
        },
        success: function(data) {
            //alert(JSON.stringify(data));
            showList(data);
        },
        error: function(msg, status) {}
    });


    // $.ajax({
    //     type: 'get',
    //     url: 'http://www.baidu.com',
    //     // url: 'http://api.listome.com/v1/companies/users/leave',
    //     // url: './leave_list_data.json',
    //     dataType:"json",
    //     beforeSend:function(request){
    //         // request.setRequestHeader('Authorization','Bearer C925Ci+So5oWRIvdyWp0BluKuoqH1lLymBVK4zeuosQ=');
    //     },
    //     success: function(response) {
    //         alert(response);
    //         // showList(response);
    //     }
    // });
}

//显示请假列表
function showList(response) {
    var str = '<div class="list-block media-list"><ul>';
    var dataList = response.data.list;
    var type = '';
    var startTime = '';
    var endTime = '';
    var reason = '';
    var status;
    var imagePath = '';
    var result = '';
    for (var i = 0; i < dataList.length; i++) {
        status = dataList[i].status;
        type = dataList[i].leave_type.name;
        reason = dataList[i].reason;
        startTime = getTimeStr(dataList[i].start_time);
        endTime = getTimeStr(dataList[i].end_time);
        switch (status) {
            case 1: //审核通过
                imagePath = 'images/ic_agree.png';
                result = '通过';
                break;
            case 0: //正在审核
                imagePath = 'images/ic_verify.png';
                result = '审核中';
                break;
            default: //审核不通过
                imagePath = 'images/ic_disagree.png';
                result = '不通过';
        }

        str += '<li class="item-content item-link list-item">';
        str += '<div class="item-media">';
        str += '<img class="item-img" src=' + imagePath + '>';
        str += '</div>';
        str += '<div class="item-inner">';
        str += '<div class="item-title" id="type">类型：' + type + '</div>';
        str += '<div class="item-subtitle" id="reason">理由：' + reason + '</div>';
        str += '<div class="item-subtitle" id="result" style="display: none;">审核结果：' + result + '</div>';
        str += '<div class="item-subtitle" id="time">时间：' + startTime + '至' + endTime + '</div>';
        str += '</div>';
        str += '</li>';
    }
    str += "</ul></div>";
    $('#tab_page_list').html(str);
    $('li.list-item').click(function() {
        var type = $(this).find('#type').text();
        var reason = $(this).find('#reason').text();
        var time = $(this).find('#time').text();
        var result = $(this).find('#result').text();
        var content = type + '<br/>' + reason + '<br/>' + time + '<br/>' + result;
        $.alert(content, '详情');
        $('.modal').css('text-align', 'left'); //让对话框中的文本左对齐
    });
}

var leaveTypesArray = [];
var leaveTypesNameArray = [];

//获取请假类型
function loadLeaveTypes() {
    $.ajax({
        type: 'GET',
        url: './leave_types.json',
        headers: {
            // 'Authorization': 'Bearer ' + window.js_interface.getAccessToken()
            'Authorization': 'Bearer ' + token
        },
        success: function(response) {
            console.log(JSON.stringify(response));
            if (response.status == 10001) {
                var arr = response.data.list;
                leaveTypesArray = arr;
                for (var i = 0; i < arr.length; i++) {
                    leaveTypesNameArray.push(arr[i].name);
                }
                showLeaveTypes(leaveTypesNameArray);
            }
        }
    });
}

//显示请假类型
function showLeaveTypes(types) {
    $("#select-type").picker({
        toolbarTemplate: '<header class="bar bar-nav">\
          <button class="button button-link pull-right close-picker">确定</button>\
          <h1 class="title">选择请假类型</h1>\
          </header>',
        cols: [{
            textAlign: 'center',
            values: types
        }]
    });
}

var timeNow = getTimeNow();
$('input.date-picker').datetimePicker({
    value: [timeNow.yearStr, timeNow.monthStr,
        timeNow.dayStr, timeNow.hourStr, timeNow.minuteStr
    ]
});

//清空表单内容
$('#btn-clear').click(function() {
    $.confirm('确定要清空填写的内容吗？', '提示', function() {
        //清空表单
        $('#select-type').val('');
        $('#leave-reason').val('');
        $('#start-time-picker').val('');
        $('#end-time-picker').val('');
    });
})

function isEmpty(val) {
    return val == null || val == '' || val.trim() == '';
}

//提交表单
$('#btn-submit').click(function() {
    var type = $('#select-type').val();
    var reason = $('#leave-reason').val();
    var startTime = $('#start-time-picker').val();
    var endTime = $('#end-time-picker').val();
    if (isEmpty(type)) {
        $.toast('请选择请假类型');
        return;
    }
    if (isEmpty(reason)) {
        $.toast('请填写请假原因');
        return;
    }
    if (isEmpty(startTime) || isEmpty(endTime)) {
        $.toast('请选择请假时间');
        return;
    }
    //可以提交数据了
    submit()
})

function submit(id, reason, startTime, endTime) {
    $.showPreloader('loading...');
    $.ajax({
        url: 'http://api.listome.cn/app/v1/companies/users/leave',
        type: 'POST',
        headers: {
            // 'Authorization' : 'Bearer ' + window.js_interface.getAccessToken()
            'Authorization': 'Bearer ' + token
        },
        data: {
            leave_type: id,
            reason: reason,
            start_time: startTime + ':00',
            end_time: endTime + ':00'
        },
        success: function(response) {
            $.toast('success');
            $.hidePreloader();
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            $.toast('fail' + textStatus);
            $.hidePreloader();
        }
    })
}

loadList();
loadLeaveTypes();
// $.ajax({
//     type: 'GET',
//     url: 'http://api.listome.com/v1/companies/users/leave',
//     contentType: 'text/plain',
//     headers: {
//         "Authorization": "Bearer mf1sdmiYnhK5SY6Ozn66Hu7Kl7M4lXRphI03hzddasM="
//     },
//     success: function(data) {
//         alert(JSON.stringify(data));
//     },
//     error: function(msg, status) {}
// });
