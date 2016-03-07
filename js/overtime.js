//加载加班申请列表
function loadList() {
    $.ajax({
        type: 'GET',
        url: './overtime_list_data.json',
        headers: {
            'Authorization': 'Bearer zrFZJMz1y9s1Rji8PhQ4s7QVpD4A3aDLcRKCkmGHpvw='
            // 'Authorization': 'Bearer ' + window.js_interface.getAccessToken()
        },
        success: function(response) {
            showList(response);
        }
    });
}

//显示加班申请列表
function showList(response) {
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
        $.alert(content, '详情');
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

var timeNow = getTimeNow();
$('input.date-picker').datetimePicker({
    value: [timeNow.yearStr, timeNow.monthStr, 
        timeNow.dayStr, timeNow.hourStr, timeNow.minuteStr]
});

//清空表单内容
$('#btn-clear').click(function() {
    $.confirm('确定要清空填写的内容吗？', '提示', function() {
        //清空表单
        $('#select-type').val('');
        $('#overtime-reason').val('');
        $('#start-time-picker').val('');
        $('#end-time-picker').val('');
    });
})

loadList();
