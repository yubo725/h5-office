//url链接中带有check=true参数，则显示审核选项卡
if(getUrlParam('check')) {
    //显示审核部分
    $('.tab-link').removeClass('active');
    $('.tab').removeClass('active');
    $('#tab3').addClass('active');
    $('#tab-check-leaves').addClass('active');
}

//判断是否是上级，上级有审核选项卡
if (isBoss) {
    //显示审核选项卡
    $('#tab-check-leaves').css('display', '');
    $('#tab3').css('display', '');
} else {
    //隐藏审核选项卡
    $('#tab-check-leaves').css('display', 'none');
    $('#tab3').css('display', 'none');
}

//加载请假列表
function loadList() {
    $.ajax({
        type: 'GET',
        url: 'http://api.listome.com/v1/companies/users/leave',
        headers: {
            "Authorization": "Bearer " + getToken()
        },
        success: function(data) {
            if (data.status == 10001) {
                showList(data);
            } else {
                $.toast('错误' + data.status);
            }
        },
        error: function(msg, status) {
            $.toast('加载请假记录出错');
        }
    });
}

//显示请假列表
function showList(response) {
    var dataList = response.data.list;
    if (dataList == null || dataList.length == 0) {
        $('#tab-page-list').html('<div class="hint">暂无历史请假记录</div>');
        return;
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
    $('#tab-page-list').html(str);
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
    if (window.js_interface) {
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
            'Authorization': 'Bearer ' + getToken()
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

//加载请假审核列表
function loadCheckLeaveList() {
    $.ajax({
        type: 'GET',
        url: 'http://api.listome.com/v1/companies/users/leave/check',
        headers: {
            'Authorization': 'Bearer ' + getToken()
        },
        success: function(response) {
            if(response.status == 10001) {
                var list = response.data.list;
                if(list.length > 0) {
                    showCheckLeaveList(list);
                }else{
                    showNoCheckLeaveHint();
                }
            }
        },
        error: function() {
            showNoCheckLeaveHint();
        }
    })
}

//显示请假审核列表
function showCheckLeaveList(list) {
    var content = '';
    for(var i = 0; i < list.length; i++) {
        var obj = list[i];
        var id = obj.id;
        var name = obj.user_name;
        var reason = obj.reason;
        var startTime = getTimeStr(obj.start_time);
        var endTime = getTimeStr(obj.end_time);
        content += '<div class="card" id="card-id-' + id + '">';
        content += '<div class="card-header orange-color">' + name + '的请假申请</div>';
        content += '<div class="card-content">';
        content += '</div>';
        content += '<div class="card-content-inner">';
        content += '<span>原因：' + reason + '</span><br/>';
        content += '<span>时间：' + startTime + '至' + endTime + '</span>';
        content += '</div>';
        content += '<div class="card-footer">';
        content += '<a href="#" id="' + id + '" class="link agree">同意</a>';
        content += '<a href="#" id="' + id + '"  class="link disagree">拒绝</a>';
        content += '<a href="#" class="link">发消息</a>';
        content += '</div>';
        content += '</div>';
    }
    $('#tab-page-check-content').html(content);
    
    //同意按钮的点击处理
    $('[class="link agree"]').click(function() {
        showAgreeOrNotDialog($(this).attr('id'), true, list);
        // $.toast('agree id = ' + $(this).attr('id'));
    });
    //不同意按钮的点击处理
    $('[class="link disagree"]').click(function() {
        showAgreeOrNotDialog($(this).attr('id'), false, list);
        // $.toast('disagree id = ' + $(this).attr('id'));
    });
}

//显示同意或拒绝对话框
function showAgreeOrNotDialog(id, isAgree, list) {
    var msg = '';
    if(isAgree) {
        msg = '确定要同意该请假申请吗？';
    }else{
        msg = '确定要拒绝该请假申请吗？';
    }
    $.confirm(msg, '提示', function() {
        //确定同意或拒绝
        operateAgreeOrNot(id, isAgree, list);
    });
}

//操作某条申请，同意或者拒绝
function operateAgreeOrNot(id, isAgree, list) {
    var url = 'http://api.listome.com/v1/companies/users/leave/' + id;
    var type = 'PUT';
    if(!isAgree) {
        //拒绝加班申请，请求的method为delete，同意的method为put
        type = "DELETE";
    }
    $.ajax({
        url: url,
        type: type,
        headers: {
            'Authorization': 'Bearer ' + getToken()
        },
        success: function(response) {
            if(response.status == 10001) {
                $.toast('操作成功');
                //删除当前列表中的操作项
                $('div#card-id-' + id).remove();
                if(list.length == 1) {
                    //删除成功后，列表为空，则显示提示信息
                    showNoCheckLeaveHint();
                }
            }else{
                $.toast('操作失败，错误码：' + response.status);
            }
        },
        error: function() {
            $.toast('操作失败');
        }
    })
}

//提示无待审核的请假申请
function showNoCheckLeaveHint() {
    $('#tab-page-check-content').html('<div class="hint">暂无待审核的请假申请</div>');
}

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
    if (compareDateStr(startTime + ':00', endTime + ':00') != -1) {
        $.toast('开始时间必须在结束时间之前');
        return;
    }
    if (isEmpty(hours)) {
        $.toast('请填写请假小时');
        return;
    }
    if (!isNumber(hours) || hours <= 0) {
        $.toast('请假小时数填写有误');
        return;
    }
    //要发给上级的聊天消息数据
    var msg = '请假单\n类型：' + type + '\n原因：'
                + reason + '\n开始时间：' + startTime
                + '\n结束时间：' + endTime;
    //可以提交数据了
    submit(getLeaveTypeIdByName(type), reason, startTime, endTime, hours, msg);
})

//提交请假
function submit(id, reason, startTime, endTime, hours, msg) {
    $.showPreloader('请稍等...');
    $.ajax({
        url: 'http://api.listome.com/v1/companies/users/leave',
        type: 'POST',
        headers: {
            'Authorization': 'Bearer ' + getToken()
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
            //提交数据前，用聊天消息的形式发送给上级
            if(window.js_interface && !isEmpty(myLeaderEaseMobUsername)) {
                var url = baseUrl + "leave.html?check=true";
                window.js_interface.sendApplyMessage(msg, myLeaderEaseMobUsername, url);
            }
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
    for (var i = 0; i < leaveTypesArray.length; i++) {
        obj = leaveTypesArray[i];
        name = obj.name;
        if (name == typeName) {
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

//加载请假记录
loadList();

//加载请假类型
loadLeaveTypes();

//加载请假审核列表
loadCheckLeaveList();

//加载我的上级信息
getMyLeader();
