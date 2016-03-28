//添加返回到上一页功能。iOS没有提供接口
if(window.js_interface) {
    try {
        window.js_interface.useGoBack(true);
    }catch (e) {
        console.log(e);
    }
}

//点击列表跳转到对应的统计页面
$('.item-content').click(function() {
    var id = $(this).attr('id');
    var url = '';
    switch(id) {
        case "boss-menu-attendance"://老板  整体出勤统计
        url = "statistics/statistics_boss_attendance.html";
        break;
        case "boss-menu-overtime"://老板  整体加班统计
        url = "statistics/statistics_boss_overtime.html";
        break;
        case "boss-menu-leave"://老板  整体请假统计
        url = "statistics/statistics_boss_leave.html";
        break;
        case "boss-menu-salary"://老板  整体工资统计
        url = "statistics/statistics_boss_salary.html";
        break;
        case "boss-menu-overtime-top10"://老板  加班前十统计
        url = "statistics/statistics_boss_overtime_top.html";
        break;
        case "boss-menu-late-top10"://老板  迟到前十统计
        url = "statistics/statistics_boss_late_top.html";
        break;
        case "employee-menu-attendance"://员工  个人考勤统计
        url = "statistics/statistics_employee_attendance.html";
        break;
        case "employee-menu-overtime"://员工  个人加班统计
        url = "statistics/statistics_employee_overtime.html";
        break;
        case "employee-menu-leave"://员工  个人请假统计
        url = "statistics/statistics_employee_leave.html";
        break;
    }
    window.location = url;
});

var role = getRole(); 
if(role == 3) {  //角色为老板，显示两个列表
    $('#list-boss').show();
    $('#list-employee').show();
}else{  //角色为普通员工，显示个人列表
    $('#list-boss').hide();
    $('#list-employee').show();
}

// 加上
// 1）一个月迟到率部门每天线性统计图
// 2）一个月迟到人数清单，重点突出前十名
// 3）每月迟到最少的前十位
// 4）部门加班率统计图
// 5）每月加班时间率部门每天线性统计图
// 6）加班人数清单，加班时间最多前10名和最少人清单前10名
// 7）每年可以评出迟到早退最少的最勤奋前十位员工
