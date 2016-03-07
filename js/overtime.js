var token = "mf1sdmiYnhK5SY6Ozn66Hu7Kl7M4lXRphI03hzddasM=";
var overtimeTypes = ['工作日加班', '双休日加班', '法定节假日加班', '其他'];

//加载加班申请列表
function loadList() {
    $.ajax({
        type: 'GET',
        url: 'http://api.listome.com/v1/companies/users/overtime',
        headers: {
            'Authorization': 'Bearer ' + token
            // 'Authorization': 'Bearer ' + window.js_interface.getAccessToken()
        },
        success: function(response) {
            showList(response);
        }
    });
}

//显示加班申请列表
function showList(response) {
    var dataList = response.data.list;
    if(dataList == null || dataList.length == 0) {
        $('#tab_page_list').html('<div class="hint">暂无数据</div>');
        return ;
    }
    var str = '<div class="list-block media-list"><ul>';
    var dataList = response.data.list;
    var type = '';
    var title = '';
    var startTime = '';
    var endTime = '';
    var reason = '';
    var status;
    var imagePath = '';
    var result = '';
    for (var i = 0; i < dataList.length; i++) {
        status = dataList[i].status;
        title = dataList[i].title;
        type = dataList[i].type;
        reason = dataList[i].reason;
        startTime = getTimeStr(dataList[i].start_time);
        endTime = getTimeStr(dataList[i].end_time);
        switch(status) {
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
        str += '<div class="item-title" id="title"">标题：' + title + '</div>';
        str += '<div class="item-subtitle" id="type" style="display: none">类型：' + type + '</div>';
        str += '<div class="item-subtitle" id="reason">理由：' + reason + '</div>';
        str += '<div class="item-subtitle" id="result" style="display: none">审核结果：' + result + '</div>';
        str += '<div class="item-subtitle" id="time">时间：' + startTime + '至' + endTime + '</div>';
        str += '</div>';
        str += '</li>';
    }
    str += "</ul></div>";
    $('#tab_page_list').html(str);
    $('li.list-item').click(function() {
        var type = $(this).find('#type').text();
        var title = $(this).find('#title').text();
        var reason = $(this).find('#reason').text();
        var time = $(this).find('#time').text();
        var result = $(this).find('#result').text();
        var content = title + '<br/>' + reason + '<br/>' + time + '<br>' + result;
        $.alert(content, '加班详情');
        $('.modal').css('text-align', 'left'); //让对话框中的文本左对齐
    });
}

$("#select-type").picker({
    toolbarTemplate: '<header class="bar bar-nav">\
      <button class="button button-link pull-right close-picker">确定</button>\
      <h1 class="title">选择请假类型</h1>\
      </header>',
    cols: [{
        textAlign: 'center',
        values: overtimeTypes
    }]
});

var timeNow = getTimeNow(); //common.js中的方法
$('input.date-picker').datetimePicker({
    value: [timeNow.yearStr, timeNow.monthStr, 
        timeNow.dayStr, timeNow.hourStr, timeNow.minuteStr]
});

//点击清空按钮，清空表单内容
$('#btn-clear').click(function() {
    $.confirm('确定要清空填写的内容吗？', '提示', function() {
        clearForm();
    });
})

//点击提交按钮，提交表单数据
$('#btn-submit').click(function() {
    var typeName = $('#select-type').val();
    var title = $('#overtime-title').val();
    var reason = $('#overtime-reason').val();
    var startTime = $('#start-time-picker').val();
    var endTime = $('#end-time-picker').val();
    var hours = $('#hours').val();
    if (isEmpty(typeName)) {
        $.toast('请选择加班类型');
        return ;
    }
    if (isEmpty(title)) {
        $.toast('请填写加班标题' + title);
        return ;
    }
    if (isEmpty(reason)) {
        $.toast('请填写加班原因');
        return ;
    }
    if (isEmpty(startTime) || isEmpty(endTime)) {
        $.toast('请选择加班时间');
        return ;
    }
    if(isEmpty(hours)) {
        $.toast('请填写加班小时');
        return ;
    }
    submit(title, reason, startTime, endTime, hours);
})

function submit(title, reason, startTime, endTime, hours) {
    $.showPreloader('请稍等...');
    $.ajax({
        url: 'http://api.listome.com/v1/companies/users/overtime',
        type: 'POST',
        headers: {
            // 'Authorization' : 'Bearer ' + window.js_interface.getAccessToken()
            'Authorization': 'Bearer ' + token
        },
        data: {
            title: title,
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

//清空表单
function clearForm() {
    $('#select-type').val('');
    $('#overtime-title').val('');
    $('#overtime-reason').val('');
    $('#start-time-picker').val('');
    $('#end-time-picker').val('');
    $('#hours').val('');
}

loadList();
