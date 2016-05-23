var workshopList; //车间列表
var tableDataArray = []; //整个table中的数据数组
var loadedWorkshopSize; //已加载的车间个数
var loadedLightStatus; //是否加载了灯的状态

//获取所有的车间
function getWorkshops() {
	$('#refresh-hint').show();
	loadedWorkshopSize = 0;
	loadedLightStatus = false;
    $.ajax({
        type: 'GET',
        url: 'http://api.listome.cn/v1/iot/companies/workshops',
        headers: {
            'Authorization': 'Bearer ' + getToken()
        },
        success: function(response) {
            if (response.status == 10001) {
                if (response.data.total > 0) {
                    workshopList = response.data.list;
   					tableDataArray = [];  //添加数据前先清空数组
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
        url: 'http://api.listome.cn/v1/iot/companies/workshops/' + workshopId + '/machines',
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
                            workshopId: workshopId,
                            machineId: obj.id,
                            workshopName: workshopName,
                            machineName: machineName
                        };
                        tableDataArray.push(row);
                    }
                    loadedWorkshopSize++;
                    if(loadedWorkshopSize == workshopList.length) {//当所有车间的机床都获取完毕后，再显示数据
	            		showTableData();
	            	}
                } else {
                    console.log('没有机床信息');
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

//显示表格中的数据
function showTableData() {
	tableDataArray.sort(function(a, b) {
		return a.index - b.index;
	});

    var html = '';
    for (var i = 0; i < tableDataArray.length; i++) {
    	var obj = tableDataArray[i];
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
    for(var i = 0; i < tableDataArray.length; i++) {
    	getMachineRunningData(tableDataArray[i].machineId);	
    }
}

//获取机器某一天的运行状态数据
function getMachineRunningData(machineId) {
	$.ajax({
		type: 'GET',
		url: 'http://api.listome.cn/v1/iot/companies/machines/' + machineId + '/datas',
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
		url: 'http://api.listome.cn/v1/iot/companies/machines/status',
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
