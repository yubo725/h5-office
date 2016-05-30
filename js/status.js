var workshopList; //车间列表
var runningTableDataArray = []; //状态表中的数据数组
var workingTableDataArray = []; //任务表中的数组数组
var loadedWorkshopSize; //已加载的车间个数
var loadedLightStatus; //是否加载了灯的状态

var isRunningStatus; //标记是否是获取当前机床的运行状态，true为运行状态，false为工作状态

//获取所有的车间
function getWorkshops(b) {
	console.log('isRunningStatus = ' + b);
	isRunningStatus = b;
	$('#refresh-hint').show();
	loadedWorkshopSize = 0;
	loadedLightStatus = false;
    $.ajax({
        type: 'GET',
        url: requestBaseUrl + 'iot/companies/workshops',
        headers: {
            'Authorization': 'Bearer ' + getToken()
        },
        success: function(response) {
        	console.log('车间信息：\n' + formatJSON(JSON.stringify(response)));
            if (response.status == 10001) {
                if (response.data.total > 0) {
                    workshopList = response.data.list;
   					runningTableDataArray = [];  //添加数据前先清空数组
   					workingTableDataArray = [];
                    for (var i = 0; i < workshopList.length; i++) {
                        getMachinesByWorkshopId(workshopList[i].id, workshopList[i].name);
                    }
                } else {
                    console.log('没有车间信息');
                }
            } else {
                console.log('获取车间信息失败' + response.status);
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log('加载车间列表出错' + textStatus);
        }
    })
}

//根据车间id获取车间中的机床列表
function getMachinesByWorkshopId(workshopId, workshopName) {
    $.ajax({
        type: 'GET',
        url: requestBaseUrl + 'iot/companies/workshops/' + workshopId + '/machines',
        headers: {
            'Authorization': 'Bearer ' + getToken()
        },
        success: function(response) {
            if (response.status == 10001) {
                if (response.data.total > 0) {
                    var machineList = response.data.list;
                    for (var i = 0; i < machineList.length; i++) {
                        var obj = machineList[i];
                        var rowId = workshopId + '-' + obj.id;
                        var machineName = obj.name;
                        var index = workshopId * 1000 + obj.id;
                        var row = {
                        	index: index,
                            id: rowId,
                            workshopId: 1,
                            machineId: obj.id,
                            workshopName: '三车间',
                            machineName: machineName
                        };
                        runningTableDataArray.push(row);
                        workingTableDataArray.push(row);
                    }
                    
                } else {
                    console.log('没有机床信息');
                }
                loadedWorkshopSize++;
                if(loadedWorkshopSize == workshopList.length) {//当所有车间的机床都获取完毕后，再显示数据
                	if(isRunningStatus) {
	            		//是机床运行状态
	            		showRunningTableData();
	            	}else {
	            		//是机床工作状态
	            		showWorkingTableData();
	            	}
            	}
            } else {
                console.log('获取机床列表失败' + response.status);
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log('加载机床列表出错' + textStatus);
        }
    })
}

//显示工作表中的数据
function showWorkingTableData() {
	workingTableDataArray.sort(function(a, b) {
		return a.index - b.index;
	});	

	var html = '';
    for (var i = 0; i < workingTableDataArray.length; i++) {
    	var obj = workingTableDataArray[i];
    	html += '<tr class="data">';
        html += '<td>' + obj.workshopName + '</td>';
        html += '<td>' + obj.machineName + '</td>';
        html += '<td id="task-name-' + obj.machineId + '">--</td>';
        html += '<td id="piece-name-' + obj.machineId + '">--</td>';
        html += '<td id="duration-' + obj.machineId + '">--</td>';
        html += '<td id="operators-' + obj.machineId + '">--</td>';
        html += '<td id="history-"><a href="machine_working_history.html?id=' + obj.machineId + '">点击查看</a></td>';
        html += '</tr>';
    }
    $('tr.data').remove();
    $('table.table').append(html);
    $('#refresh-hint').hide();
    //显示完表格数据后，再显示统计时间数据
    for(var i = 0; i < workingTableDataArray.length; i++) {
    	getMachineWorkingData(workingTableDataArray[i].machineId);	
    }
}

//获取机床的工作数据
function getMachineWorkingData(machineId) {
	$.ajax({
		type: 'GET',
		url: requestBaseUrl + 'iot/companies/task/running/data',
		headers: {
			'Authorization': 'Bearer ' + getToken()
		},
		data: {
			machine_id: machineId,
			day: getTodayStartUnixTimestamp()
		},
		success: function(response) {
			console.log('get machine working data: ' + formatJSON(JSON.stringify(response)));
			if(response.status == 10001) {
				refreshWorkingTableRow(response.data, machineId);
			}
		},
		error: function(jqXHR, textStatus, errorThrown) {
			console.log(errorThrown);
		}
	})
}

//根据machineId刷新任务表中的一行
function refreshWorkingTableRow(data, machineId) {
	//设置任务名称
	var taskName = data.machining_task.name;
	$('td#task-name-' + machineId).html(taskName); 

	//设置工件名称
	var pieceName = data.machining_task.workpiece_name;
	$('td#piece-name-' + machineId).html(pieceName); 

	//计算持续时间
	var timeArr = data.time_point;
	var totalTime = 0;
	if(timeArr.length > 0) {
		for(var i = 0; i < timeArr.length; i++) {
			totalTime += (timeArr[i].end - timeArr[i].start);
		}
		$('td#duration-' + machineId).html(secondToFormattedTime(totalTime));
	}

	//显示操作人照片
	var operatorsIds = data.machining_task.operator_ids;//id数组
	if(operatorsIds.length > 0) {
		showOperatorsPicture(operatorsIds, machineId);
	}
}

//显示操作人照片
function showOperatorsPicture(operatorIds, machineId) {
	var html = '';
	var operatorId;
	var dom = $('td#operators-' + machineId);
	dom.html('');
	for(var i = 0; i < operatorIds.length; i++) {
		operatorId = operatorIds[i];
		$.ajax({
			type: 'GET',
			url: requestBaseUrl + 'companies/users/face_samples',
			headers: { 
				'Authorization': 'Bearer ' + getToken()
			},
			data: {
				user_id: operatorId
			},
			success: function(response) {
				if(response.status == 10001) {
					var samples = response.data.face_samples;
					if(samples.length > 0) {
						var sampleUrl = 'http://sample.listome.com' + samples[0];
						html = '<img src="' + sampleUrl + '">';
						dom.append(html);
					}
				}
			},
			error: function(jqXHR, textStatus, errorThrown) {
				console.log(errorThrown);
			}
		})
	}
}

//显示运行状态表格中的数据
function showRunningTableData() {
	runningTableDataArray.sort(function(a, b) {
		return a.index - b.index;
	});

    var html = '';
    for (var i = 0; i < runningTableDataArray.length; i++) {
    	var obj = runningTableDataArray[i];
        html += '<tr class="data">';
        html += '<td>' + obj.workshopName + '</td>';
        html += '<td>' + obj.machineName + '</td>';
        html += '<td id="status-' + obj.id + '">\
        	<img id="status-red-' + obj.id + '" src="../images/ic_light_gray.png" class="light"/>\
        	<img id="status-yellow-' + obj.id + '" src="../images/ic_light_gray.png" class="light"/>\
        	<img id="status-green-' + obj.id + '" src="../images/ic_light_gray.png" class="light"/>\
        	<img id="status-purple-' + obj.id + '" src="../images/ic_light_gray.png" class="light"/>\
        </td>';
        html += '<td class="red" id="red-' + obj.machineId + '">--</td>';   //red
        html += '<td class="yellow" id="yellow-' + obj.machineId + '">--</td>';  //yellow
        html += '<td class="green" id="green-' + obj.machineId + '">--</td>';  //green
        html += '<td id="purple-' + obj.machineId + '">--</td>';  //purple
        html += '</tr>';
    }
    $('tr.data').remove();
    $('table.table').append(html);
    $('#refresh-hint').hide();
    //显示完表格数据后，再显示统计时间数据
    for(var i = 0; i < runningTableDataArray.length; i++) {
    	getMachineRunningData(runningTableDataArray[i].machineId);	
    }
}

//获取机器某一天的运行状态数据
function getMachineRunningData(machineId) {
	$.ajax({
		type: 'GET',
		url: requestBaseUrl + 'iot/companies/machines/' + machineId + '/datas',
		headers: {
			'Authorization': 'Bearer ' + getToken()
		},
		data: {
			day: getTodayStartUnixTimestamp(),
			is_today: 1
		},
		success: function(response) {
			// console.info("获取机器运行状态数据：" + JSON.stringify(response));
			if(response.status == 10001) {
				var data = response.data;
				refreshTime(data.green, machineId, "green");
				refreshTime(data.yellow, machineId, "yellow");
				refreshTime(data.red, machineId, "red");
				refreshTime(data.purple, machineId, "purple");
			}
			getLightStatus();
		},
		error: function(jqXHR, textStatus, errorThrown) {
			console.log('get machine running data error! ' + textStatus);
		}
	})
}

//刷新灯的时间
function refreshTime(data, machineId, color) {
	var label = $('td#' + color + '-' + machineId);
	if(data.length == 0) {
		label.text("--");
	}else{
		var totalTime = 0;
		for(var i = 0; i < data.length; i++) {
			var obj = data[i];
			totalTime += (obj.end - obj.start);
		}
		label.text(secondToFormattedTime(totalTime));
		// if(totalTime < 60) {
		// 	label.text(totalTime + "秒");
		// }else if(totalTime / 60 < 60) {
		// 	label.text((totalTime / 60).toFixed(2) + "分钟");
		// }else{
		// 	label.text((totalTime / 3600).toFixed(2) + "小时");
		// }
	}
}

//获取机器灯的状态信息
function getLightStatus() {
	if(loadedLightStatus) {
		return ;
	}
	loadedLightStatus = true;
	$.ajax({
		type: 'GET',
		url: requestBaseUrl + 'iot/companies/machines/status',
		data: {
			'workshop_id': 0
		},
		headers: {
			'Authorization': 'Bearer ' + getToken()
		},
		success: function(response) {
			// console.log('light status: ' + JSON.stringify(response));
			if(response.status == 10001) {
				var statusData = response.data;
				if(workshopList.length > 0) {
					//显示机器状态灯
					for(var i = 0; i < workshopList.length; i++) {
						var workshopId = workshopList[i].id;
						var machinesObj = statusData['' + workshopId];
						if(typeof(machinesObj) != 'undefined') {
							var machines = machinesObj.machine;
							if(machines.length > 0) {
								for(var j = 0; j < machines.length; j++) {
									var statusObj = machines[j];
									refreshLightStatus(statusObj);	
								}
							}
						}
					}
				}
			}
		},
		error: function(jqXHR, textStatus, errorThrown) {
			console.log('获取机器状态信息出错' + textStatus);
		}
	})
}

//刷新状态信息
function refreshLightStatus(statusObj) {
	var id = statusObj.workshop_id + '-' + statusObj.machine_id;
	if(statusObj.red == 2) {
		console.log(id + "---->红灯");
		$('img#status-red-' + id).attr('src', '../images/ic_light_red.png');
	}else {
		$('img#status-red-' + id).attr('src', '../images/ic_light_gray.png');
	}
	if(statusObj.yellow == 2) {
		console.log(id + "---->黄灯");
		$('img#status-yellow-' + id).attr('src', '../images/ic_light_yellow.png');
	}else {
		$('img#status-yellow-' + id).attr('src', '../images/ic_light_gray.png');
	}
	if(statusObj.green == 2) {
		console.log(id + "---->绿灯");
		$('img#status-green-' + id).attr('src', '../images/ic_light_green.png');
	}else {
		$('img#status-green-' + id).attr('src', '../images/ic_light_gray.png');
	}
	if(statusObj.purple == 2) {
		console.log(id + "---->紫灯");
		$('img#status-purple-' + id).attr('src', '../images/ic_light_purple.png');
	}else {
		$('img#status-purple-' + id).attr('src', '../images/ic_light_gray.png');
	}
}

//根据机器id获取该机器的历史任务记录
function getWorkHistory(machineId) {
	$.ajax({
		type: 'GET',
		url: requestBaseUrl + 'iot/companies/task/history',
		headers: {
			'Authorization': 'Bearer ' + getToken()
		},
		data: {
			machine_id: machineId,
			offset: 0,
			skip: 9
		},
		success: function(response) {
			console.log('get work history: \n' + formatJSON(JSON.stringify(response)));
			if(response.status == 10001) {
				showWorkHistory(response.data.list, machineId);
			}
		},
		error: function(jqXHR, textStatus, errorThrown) {
			console.log(errorThrown);
		}
	})
}

//显示任务历史记录
function showWorkHistory(list, machineId) {
	if(list.length > 0) {
		var html = '';
		for(var i = 0; i < list.length; i++) {
			var obj = list[i];
			html += '<tr class="data">';
			html += '<td>' + (i + 1) + '</td>';
			html += '<td>' + obj.name + '</td>';
			html += '<td>' + obj.workpiece_sm + '</td>';
			html += '<td>' + obj.workpiece_name + '</td>';
			html += '<td id="operators-' + machineId + '-' + i + '"></td>';
			html += '<td class="remark-label">' + obj.remark + '</td>';
			html += '</tr>';
		}
		$('tr.data').remove();
		$('table.table').append(html);
		for(var i = 0; i < list.length; i++) {
			getNamesByIds(list[i].operator_ids, machineId, i);
		}
	}
} 

//根据操作人的id数组获取对应的姓名数组
function getNamesByIds(ids, machineId, index) {
	$.ajax({
		type: 'GET',
		url: requestBaseUrl + 'companies/users/names',
		data: {
			user_ids: JSON.stringify(ids)
		},
		headers: {
			'Authorization': 'Bearer ' + getToken()
		},
		success: function(response) {
			if(response.status == 10001) {
				var nameArr = response.data.names;
				var names = '';
				if(nameArr.length > 0) {
					for(var i = 0; i < nameArr.length; i++) {
						names += nameArr[i] + ', ';
					}
					$('td#operators-' + machineId + '-' + index).html(names.substring(0, names.length - 2));
				}
			}
		},
		error: function(jqXHR, textStatus, errorThrown) {
			console.log(errorThrown);
		}
	})
}