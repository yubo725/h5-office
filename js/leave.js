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
}

//显示请假列表
function showList(response) {
    var dataList = response.data.list;
    if(dataList == null || dataList.length == 0) {
        $('#tab_page_list').html('<div class="hint">暂无数据</div>');
        return ;
    }
    var str = '<div class="list-block media-list"><ul>';
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
        $.alert(content, '请假详情');
        $('.modal').css('text-align', 'left'); //让对话框中的文本左对齐
    });
}

//选择抄送对象，调用Java的选择企业通讯录方法
$('#item-deliver').click(function() {
    if(window.js_interface) {
        window.js_interface.selectDeliver();
    }
})

var leaveTypesArray = [];
var leaveTypesNameArray = [];

//获取请假类型
function loadLeaveTypes() {
    $.ajax({
        type: 'GET',
        url: 'http://api.listome.com/v1/companies/leave/types',
        headers: {
            // 'Authorization': 'Bearer ' + window.js_interface.getAccessToken()
            'Authorization': 'Bearer ' + token
        },
        success: function(response) {
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
        clearForm();
    });
})

//提交表单
$('#btn-submit').click(function() {
    var type = $('#select-type').val();
    var reason = $('#leave-reason').val();
    var startTime = $('#start-time-picker').val();
    var endTime = $('#end-time-picker').val();
    var hours = $('#hours').val();
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
    if(isEmpty(hours)) {
        $.toast('请填写请假小时');
        return ;
    }
    //可以提交数据了
    submit(getLeaveTypeIdByName(type), reason, startTime, endTime, hours);
    // alert('type = ' +  + ', reason = ' + reason + ', startTime = ' + startTime + ', endTime = ' + endTime);
})

//提交请假
function submit(id, reason, startTime, endTime, hours) {
    $.showPreloader('请稍等...');
    $.ajax({
        url: 'http://api.listome.com/v1/companies/users/leave',
        type: 'POST',
        headers: {
            // 'Authorization' : 'Bearer ' + window.js_interface.getAccessToken()
            'Authorization': 'Bearer ' + token
        },
        data: {
            leave_type: id,
            reason: reason,
            start_time: startTime + ':00',
            end_time: endTime + ':00',
            times: hours
        },
        success: function(response) {
            $.toast('提交成功');
            $.hidePreloader();
            clearForm();
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            $.toast('提交失败');
            $.hidePreloader();
        }
    })
}

//根据请假名称获取对应的ID
function getLeaveTypeIdByName(typeName) {
    var obj;
    var name;
    for(var i = 0; i < leaveTypesArray.length; i++) {
        obj = leaveTypesArray[i];
        name = obj.name;
        if(name == typeName) {
            return obj.id;
        }
    }
    return 1;
}

//清空表单数据
function clearForm() {
    $('#select-type').val('');
    $('#leave-reason').val('');
    // $('#st  ime-picker').val('');
    $('#hours').val('');
}

loadList();
loadLeaveTypes();
