//提交请假申请
function submitLeaveApply(id, reason, startTime, endTime, hours, msg) {
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
            start_time: getUnixTimestamp(startTime + ':00'),
            end_time: getUnixTimestamp(endTime + ':00'),
            times: hours
        },
        success: function(response) {
            $.toast('提交成功');
            $.hidePreloader();
            clearForm();
            //用聊天消息的形式发送给上级
            if(window.js_interface && !isEmpty(myLeaderEaseMobUsername)) {
                var url = baseUrl + "leave.html?check=true";
                var jsonObj = {
                    msg: msg,
                    myLeaderEaseMobUsername: myLeaderEaseMobUsername,
                    url: url
                };
                window.js_interface.sendApplyMessage(JSON.stringify(jsonObj));
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            $.toast('提交失败');
            $.hidePreloader();
        }
    })
}

//提交加班申请
function submitOvertimeApply(title, reason, startTime, endTime, hours, msg) {
    $.showPreloader('请稍等...');
    $.ajax({
        url: 'http://api.listome.com/v1/companies/users/overtime',
        type: 'POST',
        headers: {
            'Authorization': 'Bearer ' + getToken()
        },
        data: {
            title: title,
            reason: reason,
            start_time: getUnixTimestamp(startTime + ':00'),
            end_time: getUnixTimestamp(endTime + ':00'),
            times: hours
        },
        success: function(response) {
            $.toast('提交成功');
            $.hidePreloader();
            clearForm();
            //用聊天消息的形式发送给上级
            if(window.js_interface && !isEmpty(myLeaderEaseMobUsername)) {
                var url = baseUrl + "overtime.html?check=true";
                var obj = {
                    msg: msg,
                    myLeaderEaseMobUsername: myLeaderEaseMobUsername,
                    url: url
                };
                window.js_interface.sendApplyMessage(JSON.stringify(obj));
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            $.toast('提交失败');
            $.hidePreloader();
        }
    })
}

function getUnixTimestamp(str) {
    var date = new Date(str);
    return date.getTime() / 1000;
}

//提交请假申请
// function submitLeaveApply(id, reason, startTime, endTime, hours, msg) {
//     $.showPreloader('请稍等...');
//     $.ajax({
//         url: 'http://api.listome.com/v1/companies/users/leave',
//         type: 'POST',
//         headers: {
//             'Authorization': 'Bearer ' + getToken()
//         },
//         data: {
//             leave_type: id,
//             reason: reason,
//             start_time: startTime + ':00',
//             end_time: endTime + ':00',
//             times: hours
//         },
//         success: function(response) {
//             $.toast('提交成功');
//             $.hidePreloader();
//             clearForm();
//             //用聊天消息的形式发送给上级
//             if(window.js_interface && !isEmpty(myLeaderEaseMobUsername)) {
//                 var url = baseUrl + "leave.html?check=true";
//                 window.js_interface.sendApplyMessage(msg, myLeaderEaseMobUsername, url);
//             }
//         },
//         error: function(XMLHttpRequest, textStatus, errorThrown) {
//             $.toast('提交失败');
//             $.hidePreloader();
//         }
//     })
// }

//提交加班申请
// function submitOvertimeApply(title, reason, startTime, endTime, hours, msg) {
//     $.showPreloader('请稍等...');
//     $.ajax({
//         url: 'http://api.listome.com/v1/companies/users/overtime',
//         type: 'POST',
//         headers: {
//             'Authorization': 'Bearer ' + getToken()
//         },
//         data: {
//             title: title,
//             reason: reason,
//             start_time: startTime + ':00',
//             end_time: endTime + ':00',
//             times: hours
//         },
//         success: function(response) {
//             $.toast('提交成功');
//             $.hidePreloader();
//             clearForm();
//             //用聊天消息的形式发送给上级
//             if(window.js_interface && !isEmpty(myLeaderEaseMobUsername)) {
//                 var url = baseUrl + "overtime.html?check=true";
//                 window.js_interface.sendApplyMessage(msg, myLeaderEaseMobUsername, url);
//             }
//         },
//         error: function(XMLHttpRequest, textStatus, errorThrown) {
//             $.toast('提交失败');
//             $.hidePreloader();
//         }
//     })
// }