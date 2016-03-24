if(window.js_interface) {
	window.js_interface.useGoBack(true);
}

//老板  整体出勤统计
$('#boss-menu-attendance').click(function(){
	window.location = "statistics/statistics_boss_attendance.html";
});

//老板  整体加班统计
$('#boss-menu-overtime').click(function(){
    window.location = "statistics/statistics_boss_overtime.html";
});

//老板  整体请假统计
$('#boss-menu-leave').click(function(){
    window.location = "statistics/statistics_boss_leave.html";
});

//老板  整体工资统计
$('#boss-menu-salary').click(function(){
	window.location = "statistics/statistics_boss_salary.html";
});

//老板  加班前十统计
$('#boss-menu-overtime-top10').click(function(){
    window.location = "statistics/statistics_boss_overtime_top.html";
});

//老板  迟到前十统计
$('#boss-menu-late-top10').click(function(){
    window.location = "statistics/statistics_boss_late_top.html";
});

//员工  个人考勤统计
$('#employee-menu-attendance').click(function(){
	window.location = "statistics/statistics_employee_attendance.html";
});

//员工  个人加班统计
$('#employee-menu-overtime').click(function(){
    window.location = "statistics/statistics_employee_overtime.html";
});

//员工  个人请假统计
$('#employee-menu-leave').click(function(){
    window.location = "statistics/statistics_employee_leave.html";
});

var role = getRole();
if(role == 3) {
    $('#list-boss').show();
    $('#list-employee').hide();
}else{
    $('#list-boss').show();
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
