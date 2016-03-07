var dateNow = getTimeNow();
$('#calendar').calendar({
	value: [dateNow.year + '-' + dateNow.month + '-' + dateNow.day]
});