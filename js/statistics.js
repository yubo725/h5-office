if(window.js_interface) {
	window.js_interface.useGoBack(true);
}

$('li').click(function(){
	window.location = "statistics_employer_attendance.html";
});

$('#boss-menu-salary').click(function(){
	window.location = "statistics_employer_salary.html";
});

$('#employee-menu-attendance').click(function(){
	window.location = "statistics_employee_attendance.html";
});

$('#employee-menu-hours').click(function(){
	window.location = "statistics_employee_hours.html";
});