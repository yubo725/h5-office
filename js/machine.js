if(window.js_interface) {
    try {
        window.js_interface.useGoBack(true);
    }catch (e) {
        console.log(e);
    }
}

var workshopList;
var statusData;
var isRequestingStatus = false;
setInterval(getStatus, 1000 * 5);

//获取车间列表
function getWorkshops() {
	$.ajax({
		type: 'GET',
		url: requestBaseUrl + 'iot/companies/workshops',
		headers: {
			'Authorization': 'Bearer ' + getToken()
		},
		success: function(response) {
			console.log('车间信息：' + JSON.stringify(response));
			if(response.status == 10001) {
				if(response.data.total > 0) {
					workshopList = response.data.list;
					showWorkshops(response.data.list);
				}else{
					$.toast('没有车间信息');
				}
			}else{
				$.toast('获取车间信息失败' + response.status);
			}
		},
		error: function(jqXHR, textStatus, errorThrown) {
			$.toast('加载车间列表出错' + textStatus);
		}
	})
}

//显示车间信息
function showWorkshops(list) {
	var data = {
		list: list
	};
	var html = template('workshop-item', data);
	$('#workshop-list').html(html);
	$('li.workshop-item').click(function() {
		//点击车间列表item，获取车间id，然后获取对应的机床列表
		var workshopId = $(this).attr('id');
		var machineNode = $('#machine-list-' + workshopId);
		var isLoaded = machineNode.hasClass('loaded');
		if(isLoaded) {
			//如果已经加载了机床数据
			if(machineNode.attr('hidden')) {
				machineNode.show();
				machineNode.removeAttr('hidden');
			}else{
				machineNode.hide();
				machineNode.attr('hidden', 'hidden');
			}
		}else {
			//如果还没加载机床数据，则加载
			getMachinesByWorkshopId(workshopId);
		}
	})
}

//获取车间及机器的状态
function getStatus() {
	if(isRequestingStatus || workshopList == undefined || statusData == undefined) {
		console.log('获取状态信息，直接返回...');
		return ;
	}
	isRequestingStatus = true;
	console.log('正在请求状态信息...');
    $.ajax({
        type: 'GET',
        url: requestBaseUrl + 'iot/companies/machines/status',
        data: {
            workshop_id: 0
        },
        headers: {
            'Authorization': 'Bearer ' + getToken()
        },
        success: function(response) {
        	isRequestingStatus = false;
            console.log('车间状态信息：' + JSON.stringify(response));
            if(response.status == 10001) {
            	statusData = response.data;
            	showStatus();
    		}
        },
        error: function(jqXHR, textStatus, errorThrown) {
        	isRequestingStatus = false;
            console.log('get status error, ' + textStatus);
        }
    })
}

//显示状态信息
function showStatus() {
	if(workshopList == undefined || statusData == undefined) {
		return ;
	}
	var workshopId;
	var workshopStatusObj;
	var workshopStatus;
	var machineStatusList;
	var machineStatusObj;
	for(var i = 0; i < workshopList.length; i++) {
		workshopId = workshopList[i].id;                    //获取车间ID
		workshopStatusObj = statusData['' + workshopId];          //获取该车间的状态信息
		workshopStatus = workshopStatusObj.status;
		if(workshopStatus == 1) {
			//车间正常
			$('img[id="' + workshopId + '"]').attr('src', 'images/ic_light_green.png');
		}else{
			//车间报警
			$('img[id="' + workshopId + '"]').attr('src', 'images/ic_light_red.png');
		}
		machineStatusList = workshopStatusObj.machine;      //某一个车间中的所有机器状态
		for(var j = 0; j < machineStatusList.length; j++) {
			machineStatusObj = machineStatusList[j];
			var machine = $('div[id="' + machineStatusObj.workshop_id + '-' + machineStatusObj.machine_id + '"]');
			if(machineStatusObj.green == 2) {
				machine.addClass('status-green');
			}else if(machineStatusObj.yellow == 2) {
				machine.removeClass('status-green');
				machine.addClass('status-yellow');
			}else if(machineStatusObj.red == 2) {
				machine.removeClass('status-yellow');
				machine.addClass('status-red');
			}else if(machineStatusObj.purple == 2) {
				machine.removeClass('status-red');
				machine.addClass('status-purple');
			}else {
				machine.removeClass('status-red');
				machine.removeClass('status-green');
				machine.removeClass('status-yellow');
				machine.removeClass('status-purple');
			}
		}
	}
}

//根据车间id获取车间中的机床列表
function getMachinesByWorkshopId(workshopId) {
	$.showPreloader();
	$.ajax({
		type: 'GET',
		url: requestBaseUrl + 'iot/companies/workshops/' + workshopId + '/machines',
		headers: {
			'Authorization': 'Bearer ' + getToken()
		},
		success: function(response) {
			console.log('machine list: ' + JSON.stringify(response));
			$.hidePreloader();
			if(response.status == 10001) {
				if(response.data.total > 0) {
					showMachines(workshopId, response.data.list);
				}else{
					$.toast('没有机床信息');
				}
			}else{
				$.toast('获取机床列表失败' + response.status);
			}
		},
		error: function(jqXHR, textStatus, errorThrown) {
			$.hidePreloader();
			$.toast('加载机床列表出错' + textStatus);
		}
	})
}

//显示某个车间中的机床
function showMachines(workshopId, list) {
	var data = {
		list: list
	};
	var html = template("machine-item", data);
	var machineNode = $('#machine-list-' + workshopId);
	machineNode.addClass('loaded');
	machineNode.removeAttr('hidden');
	machineNode.show();
	machineNode.html(html);
	addCardCss();
	showStatus();
}

function addCardCss() {
	//菜单按下时改变背景透明度
    $('.card').bind('touchstart', function() {
        $(this).css('opacity', '0.6');
    });

    //菜单不被按下时取消透明度
    $('.card').bind('touchend', function() {
        $(this).css('opacity', '');
    });

    //点击卡片跳转到机床详情
    $('.card').click(function() {
    	var idArray = $(this).attr('id').split('-');
        window.location = projectBaseUrl + 'machine/machine_detail.html?workshopId=' + idArray[0] + '&machineId=' + idArray[1];
    });
}