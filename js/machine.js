if(window.js_interface) {
    try {
        window.js_interface.useGoBack(true);
    }catch (e) {
        console.log(e);
    }
}

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
					showWorkshops(response.data.list);
				}else{
					$.toast('没有车间信息')
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
			$.hidePreloader();
			if(response.status == 10001) {
				if(response.data.total > 0) {
					showMachines(workshopId, response.data.list);
				}else{
					$.toast('没有机床信息')
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
	console.log('machines: ' + html);
	$('div#machine-list-' + workshopId).html(html);
	var machineNode = $('#machine-list-' + workshopId);
	machineNode.addClass('loaded');
	machineNode.removeAttr('hidden');
	machineNode.show();
	// machineNode.html(html);
	addCardCss();
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
        window.location = 'http://192.168.1.170:8088/h5Office/machine/machine_detail.html?workshopId=' + idArray[0] + '&machineId=' + idArray[1];
    });
}