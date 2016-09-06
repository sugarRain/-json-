rt.page.result =function(){
	this.signal = true;
	this.resultPer = 10;
	this.resultPaginationObj = null;
	this.popResultPaginationObj = null;
	this.resultList = [];
	this.dateSplitChar = "-";
	
	this.curResultDetailHrefBtn = null;	// 当前数据详情的触发按钮元素
	this.curDetailRuleInfo = null;		// 当前数据详情的规则信息，有name和id两个属性
	this.detailList = [];		// 当前数据详情的数组
	this.detailPer = 10;
};


rt.page.result.prototype.main = function(opt) {
	var self = this;
	self.$backPage = $("#back_page");
	
	self.$resultSearchBar = $("#result_search_bar");	// 结果搜索条容器
	self.$sDatef = self.$resultSearchBar.find(".de_s");
	self.$eDatef = self.$resultSearchBar.find(".de_e");
	self.$searchInput = self.$resultSearchBar.find(".se_input");
	self.$searchBtn = self.$resultSearchBar.find(".se_btn");
	
	self.$tbodyTable = $(".tbody_table");
	self.$tbodyTableNew = $(".tbody_table_new");
	self.$resultPageBar = $("#list_page");
	self.$resultPageBarPop = $("#list_page_pop");
	self.$shadow = $('.page_shadow'),
	self.$popup = $('.popup'),
	self.$tbodyTableNew= $('.tbody_table_new'),
	self.$showHistory = $('.show_history'),
	self.$close = $('.close'),
	self.$checkAll = $('#check_all'),
	self.$remarkUpdate = $(".remark_update"),
	self.$whiteAdd = $("#white_add")
	var idArgs = sn.util.getLocationArg("id");
	if(idArgs){
		
		$('.search_hidden').css('display','none');
		$('.date_hidden').css('display','none');
		
		self.getResultById(idArgs);//根据所查规则id获取结果
	}
		
	// 初始化结果查询事件绑定
	self.getResultByCond();//
	
	self.getReulstDetail();//查询对比结果不一致详情
	
	self.autoHeight();	// 结果列表高度自适应算法

	self.getResultHistory();//查询历史结果
	// self.pageBar();

	self.updataRemark();
	self.addWhiteByCode();
	
};


rt.page.result.prototype.urlCfg = {
	
	baseUrl:"",
	baseType:"get",
	dataType:"jsonp",
	actions:{
		getResultByCond:{	// 查询规则测试结果接口配置项
			url:"getResultByCond",
			baseData:{
				
			}
		},
		getResultById:{
			url:"getResultById",
			baseData:{
				
			}
		},
		updateRemark:{
			url:"updateRemark",
			baseData:{
			
			}
		},
		getResultDetail:{ // 删除规则
			url:"getResultDetail",
			type:"",
			baseData:{
				
			}
		},
		whiteList:{ 	// 单个更新规则（包括新增和修改）
			url:"whiteList",
			type:"",
			baseData:{
				
			}
		}
	}
};

// 异步请求管理器
rt.page.result.prototype.ajaxManager = function(actionName,opt,callback){
	var self = this,
		actionCfg = self.urlCfg.actions[actionName] ? self._setting.urlCfg.actions[actionName] : {},
		actionBaseData = actionCfg.baseData ? actionCfg.baseData : null,
		url = actionCfg.url ? actionCfg.url : self.urlCfg.baseUrl,
		type = actionCfg.type ? actionCfg.type : self.urlCfg.baseType,
		dataType = actionCfg.dataType ? actionCfg.dataType : self.urlCfg.dataType,
		requestData = $.extend(true,{},actionBaseData,opt),
		ajaxCfg;
		
	ajaxCfg = {
		url:interfaceCfg + url,
		type:type,
		data:requestData,
		success:function(obj){
			if(typeof callback === "function"){
				switch(actionName){
					default:{
						if(typeof obj === "object" && obj !== null && obj.success === true){
							if(obj.data){
								callback(true,obj.data);
							}else{
								callback(true);
							}
						}else{
							callback(false);
						}
					}
				}
			}
		},
		error:function(){
			if(typeof callback === "function"){
				switch(type){
					default:{
						callback(false);
					}
				}
			}else{
				alert("请求处理失败，请重试！");
			}
		}
	};
	if(datType === "jsonp"){
		ajaxCfg.dataType = "jsonp";
		ajaxCfg.jsonpCallback = "callback";
	}else{
		ajaxCfg.dataType = "json";
	}
	$.ajax(ajaxCfg);
};

rt.page.result.prototype.autoHeight = function(){
	var self= this,
		fun;
	fun = function(){
		var modifyNum = 40,
			otherElems = $(".header,#top_bar,#result_thead_table,#result_bottom_bar"),
			winH = parseInt($(window).height()),
			otherH = 0;
		otherElems.each(function(){
			otherH += $(this).outerHeight(true);
		});
		$("#tbody_viewport").css({
			height:(winH - otherH - modifyNum)+"px"
		});
	};
	fun();
	$(window).on("resize",fun);
	
	
}
/*通用分页模块
 * 参数：
    id:分页容器载体
    opt:{
	per: 必需参数
	startPage: 可选参数，默认值是1，当传入的startPage 大于totalPages或小于1时，重置为1
	totalPages: 总页数
	showPages: 显示页码最大容量
    }
 */

/*rt.page.result.prototype.pageBar = function(id){
	var self = this;
	var myPagebarObj = new sn.plugin.pagination();
	myPagebarObj.main({
		wrap:$(id),
		perpage:10,
		totalPages:20,
		showPages:3,
		startPage:1,
		callback:function(arg){
			var info = arg[0],
				fun = arg[1],
				tagPageNu = info[0],
				per = info[1],
				pluginObj = info[2],
				opt,
				callback;
		}
	});
};*?

/*初始化结果列表分页条
 * 参数：
    opt:{
	startPage: 可选参数，默认值是1，当传入的startPage 大于totalPages或小于1时，重置为1
    }
 */
rt.page.result.prototype.initResultPagebar = function(opt){
	var self = this,
		per = self.resultPer,
		totalPages = Math.ceil(self.resultList.length / per),
		startPage ,
		showPages = 10;

	if(typeof opt.startPage === "number" && opt.startPage > 0 && opt.startPage <= totalPages){
		startPage = opt.startPage;
	}else{
		startPage = 1;
	}
	if(totalPages > 1){
		if(self.resultPaginationObj === null){
			self.resultPaginationObj = new sn.plugin.pagination();
		}
		self.resultPaginationObj.main({
			wrap:self.$resultPageBar,
			perpage:per,
			totalPages:totalPages,
			showPages:showPages,
			startPage:startPage,
			callback:function(arg){
				var info = arg[0],
					tagPageNum = info[0],
					fun = arg[1];

				self.jumpResultPage(tagPageNum);
				fun();

			}
		});
	}else{
		self.resultPaginationObj = null;
		self.$resultPageBar.html("");
	}
};

/* 根据idStr，查询指定规则的测试结果并展示
 * idStr:  如"1,2,3"
 */
rt.page.result.prototype.getResultById =function(idStr){
	var self = this,
		opt,
		callback;
	opt = {
		id:idStr
	};
	callback = function(flag,data){
		if(flag){
			self.resultList = data; 	// 存储当前列表数据
			self.show(data);
		}else{
			alert("获取结果，请刷新页面！");
		}
	};
	// self.ajaxManager("getResultById",opt,callback);
	var data = [
						{
							"id":"1",
							"rule_id":"1",
							"date":"1467302400",
							"name":"B",
							"diff_num":"10",
							"remark":"备注"
						},
						{
							"id":"2",
							"rule_id":"1",
							"date":"1467302400",
							"name":"B",
							"diff_num":"10",
							"remark":"备注"
						},
						{
							"id":"3",
							"rule_id":"1",
							"date":"1467302400",
							"name":"B",
							"diff_num":"10",
							"remark":"备注"
						},
						{
							"id":"4",
							"rule_id":"1",
							"date":"1467302400",
							"name":"A",
							"diff_num":"10",
							"remark":"备注"
						},
						{
							"id":"5",
							"rule_id":"1",
							"date":"1467302400",
							"name":"A",
							"diff_num":"10",
							"remark":"备注"
						},
						{
							"id":"6",
							"rule_id":"1",
							"date":"1467302400",
							"name":"A",
							"diff_num":"10",
							"remark":"备注"
						},
						{
							"id":"7",
							"rule_id":"1",
							"date":"1467302400",
							"name":"A",
							"diff_num":"10",
							"remark":"备注"
						},
						{
							"id":"8",
							"rule_id":"1",
							"date":"1467302400",
							"name":"A",
							"diff_num":"10",
							"remark":"备注"
						},
						{
							"id":"9",
							"rule_id":"1",
							"date":"1467302400",
							"name":"A",
							"diff_num":"10",
							"remark":"备注"
						},
						{
							"id":"10",
							"rule_id":"1",
							"date":"1467302400",
							"name":"A",
							"diff_num":"10",
							"remark":"备注"
						},
						{
							"id":"11",
							"rule_id":"1",
							"date":"1467302400",
							"name":"A",
							"diff_num":"10",
							"remark":"备注"
						}
					];
	callback(true,data);	
};

//测试结果type= 2
rt.page.result.prototype.getResultByCond = function(){
	var self = this,
		todayEdate = new Date(),
		nowDate,
		agoDate;	

	//页面加载获取当日时间并渲染到页面中
	if(todayEdate.getMonth()<10) {
		 $mouth = "0"+(parseInt(todayEdate.getMonth())+1);
	}else{
		 $mouth = parseInt(todayEdate.getMonth())+1;
	};
	if(todayEdate.getDate()<10) {
		 $day = "0"+todayEdate.getDate();
	}else{
		 $day = todayEdate.getDate();
	}
	var nowDate = todayEdate.getFullYear()+"-"+ $mouth+"-"+$day;
	self.$eDatef.val(nowDate);//获取当日时间

	agoDate = new Date(todayEdate.getTime()-(10*24*3600*1000));
	if(agoDate.getMonth()<10) {
		 $agoMouth = "0"+(parseInt(agoDate.getMonth())+1);
	}else{
		 $agoMouth = parseInt(agoDate.getMonth())+1;
	};
	if(agoDate.getDate()<10) {
		 $agoDay = "0"+agoDate.getDate();
	}else{
		 $agoDay = agoDate.getDate();
	}

	// alert(agoDate.getFullYear()+"-"+$agoMouth+"-"+$agoDay)
	self.$sDatef.val(agoDate.getFullYear()+"-"+$agoMouth+"-"+$agoDay);

	self.$searchBtn.on('click', function(){//单击搜索按钮
		var searchResult = $.trim(self.$searchInput.val()),
			startTime = new Date(self.$sDatef.val().split("-").join(",")), //
			endTime = new Date(self.$eDatef.val().split("-").join(",")),
			sDate = parseInt(startTime.getTime()/1000),
			eDate = parseInt(endTime.getTime()/1000) + (24*3600 -1),
			opt,
			callback;
			// 结束时间戳应该加上一天的秒数再减1
		
		if(sDate>eDate){
			alert("输入日期范围有误，请重新输入！");
			return;
		}
		
		opt = {
			q:searchResult,
			sdate:sDate,
			edate:eDate
		};
		callback = function(flag,data){
			if(flag){
				self.resultList = data; 	// 存储当前列表数据
				self.show(data);
			}else{
				alert("查询失败，请重试！");
			}
		};
		// self.ajaxManager("getResultByCond",opt,callback);
		var data = [
						{
							"id":"1",
							"rule_id":"1",
							"date":"1467302400",
							"name":"B",
							"diff_num":"10",
							"remark":"备注"
						},
						{
							"id":"2",
							"rule_id":"1",
							"date":"1467302400",
							"name":"B",
							"diff_num":"10",
							"remark":"备注"
						},
						{
							"id":"3",
							"rule_id":"1",
							"date":"1467302400",
							"name":"B",
							"diff_num":"10",
							"remark":"备注"
						},
						{
							"id":"4",
							"rule_id":"1",
							"date":"1467302400",
							"name":"A",
							"diff_num":"10",
							"remark":"备注"
						},
						{
							"id":"5",
							"rule_id":"1",
							"date":"1467302400",
							"name":"A",
							"diff_num":"10",
							"remark":"备注"
						},
						{
							"id":"6",
							"rule_id":"1",
							"date":"1467302400",
							"name":"A",
							"diff_num":"10",
							"remark":"备注"
						},
						{
							"id":"7",
							"rule_id":"1",
							"date":"1467302400",
							"name":"A",
							"diff_num":"10",
							"remark":"备注"
						},
						{
							"id":"8",
							"rule_id":"1",
							"date":"1467302400",
							"name":"A",
							"diff_num":"10",
							"remark":"备注"
						},
						{
							"id":"9",
							"rule_id":"1",
							"date":"1467302400",
							"name":"A",
							"diff_num":"10",
							"remark":"备注"
						},
						{
							"id":"10",
							"rule_id":"1",
							"date":"1467302400",
							"name":"A",
							"diff_num":"10",
							"remark":"备注"
						},
						{
							"id":"11",
							"rule_id":"1",
							"date":"1467302400",
							"name":"A",
							"diff_num":"10",
							"remark":"备注"
						}
					];
		callback(true,data);
		//callback(false);
		
	});
};
/* 根据p参数指定的页号（从1开始），将结果列表html结构中对应的单元显示出来，其它单元隐藏
 */
rt.page.result.prototype.jumpResultPage = function(p){
	var self = this,
		items,
		per = self.resultPer,
		snum,
		endnum;
	if(self.resultList.length > 0){
		items = self.$tbodyTable.find("tr");
		snum = per * (p-1);
		endnum = (per * p)  - 1;
		if(endnum > (self.resultList.length-1)){
			endnum = self.resultList.length-1;
		}
		items.each(function(i,v){
			if(i>=snum && i<=endnum){
				$(v).show();
			}else{
				$(v).hide();
			}
		});

	}
};
//根据一份结果数据，初始化结果列表（包括内容渲染、分页等）
rt.page.result.prototype.show = function(data){
	var self =this,
		itemData,
		date,
		year,
		month,
		day,
		showDate,
		htmlArr = [];
	if(data instanceof Array){
		
	}else{
		alert("数据不合法！");
		return;
	}
	

	if(data.length > 0){
		for(var i=0,len=data.length;i<len;i++){
			itemData = data[i];
			date = new Date(itemData.date* 1000);
			year = date.getFullYear();
			month = parseInt(date.getMonth())+1;
			day = date.getDate();
			
			month = month > 9 ? month : "0"+String(month);
			day = day > 9 ? day : "0"+String(day);
			
			showDate = year + self.dateSplitChar + month + self.dateSplitChar + day;
			htmlArr.push('<tr key="'+i+'" gz_id="'+itemData.rule_id+'" jg_id = "'+itemData.id+'" style="display:none;">');
				htmlArr.push('<td>'+showDate+'</td>');
				htmlArr.push('<td>'+itemData.name+'</td>');
				htmlArr.push('<td><a class="page-open">'+itemData.diff_num+'</a></td>');
				htmlArr.push('<td class = "remark_update" contenteditable="true">'+itemData.remark+'</td>');
				htmlArr.push('<td><a class = "check">查看</a></td>');
			htmlArr.push('</tr>');
		}
	}else{
		htmlArr.push('<tr><td class="no_result_tip">暂无数据信息，请查询搜索！</td></tr>');
	}
	self.$tbodyTable.html(htmlArr.join(''));

	self.jumpResultPage(1);
	self.initResultPagebar({
		startPage:1
	});
};
/* 根据一个结果行元素，获取其在本地结果数组中的位置信息和详细信息
返回值：
{
	globalKey:
	detail:{  测试结果详细数据
		...
	}
}
 */
rt.page.result.prototype.getResultInfoByRowElem = function(rowElem){
	var self = this,
		key = rowElem.attr("key"),
		info = self.resultList[key];
	return {globalKey:key,detail:info};
};
//修改备注
rt.page.result.prototype.updataRemark =function(){
	var self = this;
	var oldRemark ="";
	self.$tbodyTable.on("focus","td[contenteditable='true']",function(){
		oldRemark = $(this).text();
	});
	self.$tbodyTable.on("blur","td[contenteditable='true']",function(){
		var elem = $(this),
			newRemark = elem.text(),
			row,
			info,
			opt,
			callback;
		
		// 无变化时不做任何处理
		if(oldRemark === newRemark){
			return;
		}

		row = elem.closest("tr");
		info = self.getResultInfoByRowElem(row);
		opt = {
			id:info.detail.id,//查询结果id
			remark:newRemark
		};
		callback = function(flag){
			if(flag){
				self.resultList[info.globalKey].remark = newRemark;
			}else{
				elem.text(oldRemark);
				alert("修改失败！");
			}
		};
		
		//self.ajaxManager("updateRemark",opt,callback);
		callback(true);
		// callback(false);
		
		
	});
}

/* 根据一份有规律的结果字符串，解析出原始值和公式值
返回值：
obj{
	staticValueStr:		规则公式值字符串，如："0.14"
	oldValueStr:		规则名称本身值字符串,如 :"1.35"
}
 */
rt.page.result.prototype.getResultValueInfo = function(valStr){
	var self = this,
		splitStr1 = "!~",	// 第一级切分字符串
		splitStr2 = ":",	// 第二级切分字符串
		splitStr3 = "=",	// 第三级切分字符串
		valReg = /^([\d\.]+).*/,// 匹配字符串起始数值部分的正则表达式
		oldStr,
		calcStr,
		arr1,
		arr2,
		subStr1,
		subStr2,
		obj;
	
	arr1 = valStr.split(splitStr1);
	subStr1 = arr1[0];
	subStr2 = arr1[1];
	
	oldStr = $.trim(subStr1.split(splitStr2)[1]);
	oldStr = oldStr.replace(valReg,"$1");
	
	arr2 = subStr2.split(splitStr3);
	calcStr = $.trim(arr2[arr2.length-1]);
	calcStr = calcStr.replace(valReg,"$1");
	
	obj = {
		staticValueStr:calcStr,
		oldValueStr:oldStr
	};
	return obj;
};
//查看详情
rt.page.result.prototype.getReulstDetail =function(){
	var self = this;
	function closed(){//关闭弹出层
		self.$shadow.removeClass('show_shadow');
		self.$popup.removeClass('show_popup');
	}
	self.$close.click(function(){
		closed ();
	});
	self.$shadow.click(function(){
		closed ();
	});
	self.$tbodyTable.on("click",".page-open", function(){//单击查看详情
		var btnElem = $(this),
			row = btnElem.closest("tr"),
			info = self.getResultInfoByRowElem(row),
			opt,
			callback,
			id = info.detail.id;
		opt = {
			id:id	
		};
		
		callback = function(flag,data){
			if(flag){
				var html = '',
					list = data.data,
					itemData,
					date,
					year,
					month,
					day,
					showDate,
					staticValue,
					oldValue,
					valueInfo;
				
				// 保存触发当前结果详情弹层的"对比结果不一致"数量按钮，当更新详细弹层中的白名单时，通过触发此按钮的click事件来达到更新详细数据的功能；
				self.curResultDetailHrefBtn = btnElem;
				
				
				// 修改可能发生变化的"对比结果不一致"数量，譬如：添加部分白名单后，自动触发的详细数据更新逻辑就有可能发生数值的改变
				btnElem.text(list.length);

				if(list instanceof Array){
					self.curDetailRuleInfo = {
						id:data.rul_id,
						name:data.name
					};
					
					self.detailList =list;
					
					self.$shadow.addClass('show_shadow');//弹出层遮罩层显示；
					self.$popup.addClass('show_popup');//弹出层显示层显示；
					if(list.length > 0){
						for(var i=0,len=list.length;i<len;i++){
							itemData = list[i];
							date = new Date(itemData.date * 1000);
							year = date.getFullYear();
							month = parseInt(date.getMonth())+1;
							day = date.getDate();
							month = month > 9 ? month : "0"+String(month);
							day = day > 9 ? day : "0"+String(day);
							showDate =  year + self.dateSplitChar + month + self.dateSplitChar + day;
							valueInfo = self.getResultValueInfo(itemData.count_number)
							html += '<tr key="'+i+'">'+'<td>'+showDate+'</td>'+ 
								 '<td>'+data.name+'</td>'+
								 '<td class = "code">'+itemData.code+'</a></td>'+
								 '<td>'+valueInfo.oldValueStr+'</td>'+ 
								 '<td>'+valueInfo.staticValueStr+'</td>'+ 
								 '<td class = "check"><label><input class ="addwhite" type="checkbox">是</label></td>'+
							'</tr>';
						}
					}else{
						html = '<tr><td>暂无数据！</td></tr>';
					}
					$(".tbody_table_new ").html(html);
					
					if(list.length > 0){
						self.jumpResultPagePop(1);
					}
	
					self.initDetailPagebar({
						startPage:1
	
					});
					
				}else{
					alert("数据不合法！");
					return;
				}
			}else{
				alert("查询失败，请重试！");
			}
		};
		
		// self.ajaxManager("getResultDetail",opt,callback);
		
		var obj = {
				"total":"20",
				"rul_id":"1",
				"name":"A",
				"data":[
					{
						'date':"1467302400",
						'code':"300033",
						'old_number':"2",
						'count_number':"(dde大单净额:1121634 !~= (dde大单买入金额:1.298574E7 - dde大单卖出金额:1.2079018E7 = 906722.0))"
					},
					{
						'date':"1467302400",
						'code':"300033",
						'old_number':"2",
						'count_number':"(dde大单净额:1121634 !~= (dde大单买入金额:1.298574E7 - dde大单卖出金额:1.2079018E7 = 906722.0))"
					},
					{
						'date':"1467302400",
						'code':"300033",
						'old_number':"2",
						'count_number':"(dde大单净额:1121634 !~= (dde大单买入金额:1.298574E7 - dde大单卖出金额:1.2079018E7 = 906722.0))"
					},
					{
						'date':"1467302400",
						'code':"300033",
						'old_number':"2",
						'count_number':"(dde大单净额:1121634 !~= (dde大单买入金额:1.298574E7 - dde大单卖出金额:1.2079018E7 = 906722.0))"
					},
					{
						'date':"1467302400",
						'code':"300033",
						'old_number':"2",
						'count_number':"(dde大单净额:1121634 !~= (dde大单买入金额:1.298574E7 - dde大单卖出金额:1.2079018E7 = 906722.0))"
					},
					{
						'date':"1467302400",
						'code':"300033",
						'old_number':"(dde大单净额:1121634 !~= (dde大单买入金额:1.298574E7 - dde大单卖出金额:1.2079018E7 = 906722.0))",
						'count_number':"(dde大单净额:1121634 !~= (dde大单买入金额:1.298574E7 - dde大单卖出金额:1.2079018E7 = 906722.0))"
					},
					{
						'date':"1467302400",
						'code':"300033",
						'old_number':"2",
						'count_number':"(dde大单净额:1121634 !~= (dde大单买入金额:1.298574E7 - dde大单卖出金额:1.2079018E7 = 906722.0))"
					},
					{
						'date':"1467302400",
						'code':"300033",
						'old_number':"2",
						'count_number':"(dde大单净额:1121634 !~= (dde大单买入金额:1.298574E7 - dde大单卖出金额:1.2079018E7 = 906722.0))"
					},
					{
						'date':"1467302400",
						'code':"300033",
						'old_number':"2",
						'count_number':"(dde大单净额:1121634 !~= (dde大单买入金额:1.298574E7 - dde大单卖出金额:1.2079018E7 = 906722.0))"
					},
					{
						'date':"1467302400",

						'code':"300033",
						'old_number':"2",
						'count_number':"(dde大单净额:1121634 !~= (dde大单买入金额:1.298574E7 - dde大单卖出金额:1.2079018E7 = 906722.0))"
					},
					{
						'date':"1467302400",
						'code':"300033",
						'old_number':"2",
						'count_number':"(dde大单净额:1121634 !~= (dde大单买入金额:1.298574E7 - dde大单卖出金额:1.2079018E7 = 906722.0))"
					},
					{
						'date':"1467302400",
						'code':"300033",
						'old_number':"2",
						'count_number':"(dde大单净额:1121634 !~= (dde大单买入金额:1.298574E7 - dde大单卖出金额:1.2079018E7 = 906722.0))"
					},
					{
						'date':"1467302400",
						'code':"300033",
						'old_number':"2",
						'count_number':"(dde大单净额:1121634 !~= (dde大单买入金额:1.298574E7 - dde大单卖出金额:1.2079018E7 = 906722.0))"
					},
					{
						'date':"1467302400",
						'code':"300033",
						'old_number':"2",
						'count_number':"(dde大单净额:1121634 !~= (dde大单买入金额:1.298574E7 - dde大单卖出金额:1.2079018E7 = 906722.0))"
					},
					{
						'date':"1467302400",
						'code':"300033",
						'old_number':"2",
						'count_number':"(dde大单净额:1121634 !~= (dde大单买入金额:1.298574E7 - dde大单卖出金额:1.2079018E7 = 906722.0))"
					},
					{
						'date':"1467302400",
						'code':"300033",
						'old_number':"2",
						'count_number':"(dde大单净额:1121634 !~= (dde大单买入金额:1.298574E7 - dde大单卖出金额:1.2079018E7 = 906722.0))"
					},
					{
						'date':"1467302400",
						'code':"300033",
						'old_number':"2",
						'count_number':"(dde大单净额:1121634 !~= (dde大单买入金额:1.298574E7 - dde大单卖出金额:1.2079018E7 = 906722.0))"
					},
					{
						'date':"1467302400",
						'code':"300033",
						'old_number':"2",
						'count_number':"(dde大单净额:1121634 !~= (dde大单买入金额:1.298574E7 - dde大单卖出金额:1.2079018E7 = 906722.0))"
					}

				]
			};
	
		callback(true,obj);
	});
};
/* 根据p参数指定的页号（从1开始），将详细结果列表html结构中对应的单元显示出来，其它单元隐藏
 */
rt.page.result.prototype.jumpResultPagePop = function(p){
	var self = this,
		items,
		per = self.resultPer,
		snum,
		endnum;
	if(self.detailList.length > 0){
		items = self.$tbodyTableNew.find("tr");
		snum = per * (p-1);
		endnum = (per * p)  - 1;
		if(endnum > (self.detailList.length-1)){
			endnum = self.detailList.length-1;
		}
		items.each(function(i,v){
			if(i>=snum && i<=endnum){
				$(v).show();
			}else{
				$(v).hide();
			}
		});
	}
};
/*初始化详细结果列表分页条
 * 参数：
    opt:{
	startPage: 可选参数，默认值是1，当传入的startPage 大于totalPages或小于1时，重置为1
	
    }
 */
rt.page.result.prototype.initDetailPagebar = function(opt){
	var self = this,
		per = self.detailPer,
		totalPages = Math.ceil(self.detailList.length / per),
		startPage,
		showPages = 10;

	if(typeof opt.startPage === "number" && opt.startPage > 0 && opt.startPage <= totalPages){
		startPage = opt.startPage;
	}else{
		startPage = 1;
	}

	if(totalPages > 1){
		if(self.popResultPaginationObj === null){
			popResultPaginationObj = new sn.plugin.pagination();
		}
		popResultPaginationObj.main({
			wrap:self.$resultPageBarPop,
			perpage:per,
			totalPages:totalPages,
			showPages:showPages,
			startPage:startPage,
			callback:function(arg){
				var info = arg[0],
					tagPageNum = info[0],
					fun = arg[1];

				self.jumpResultPagePop(tagPageNum);
				fun();

			}
		});
	}else{
		popResultPaginationObj = null;
		self.$resultPageBar.html("");
	}
};
/*根据已勾选代码号和规则号将股票加入白名单*/	
rt.page.result.prototype.addWhiteByCode =function(){//加入白名单
	var self = this;
	self.$checkAll.on('click', function(){//全选  
		var flag = $(this).is(":checked");
		if(flag==true){
			self.$tbodyTableNew.find(".addwhite").attr("checked", true);
		}else{
			self.$tbodyTableNew.find(".addwhite").attr("checked", false);
		}  
	});
	self.$tbodyTableNew.on("click",".addwhite",function(){
		var elem = $(this),
			flag = elem.is(":checked");
		if(!flag){
			self.$checkAll.removeAttr("checked");
			
			self.$tbodyTableNew.find("tr:hidden .addwhite").attr("checked", false);
		}
	});
	
	
	
	//单击添加按钮将已选择的规则加入白名单
	self.$whiteAdd.on('click', function(){
		var arr = [],
		      ruleId,
			  opt,
			  callback;
			  
		ruleId = self.curDetailRuleInfo["id"];
		
		
		self.$tbodyTableNew.find("tr .addwhite:checked").each(function(k,elem){
			
			arr.push(self.getDetailInfoByRowElem($(this).closest("tr")).code);
		});
		opt = {
			rule_id:ruleId,
			action:"add",
			code:arr.join(',')
		};
		callback = function(flag){
			if(flag){
				self.curResultDetailHrefBtn.click();
			}else{
				alert("添加白名单失败，请重试！");
			}
		};
		// self.ajaxManager("whiteList",opt,callback);
		
		callback(true);
		
	});
};
rt.page.result.prototype.getDetailInfoByRowElem = function(rowElem){
	var self = this,
		key = rowElem.attr("key"),
		info = self.detailList[key];
	return {globalKey:key,detail:info};
};

//查看历史
rt.page.result.prototype.getResultHistory =function(){
	var self = this;
	self.$tbodyTable.on("click",".check", function(){
		alert('暂未开放');
		// self.$shadow.addClass("show_shadow");//弹出层遮罩层显示；
		// self.$showHistory.css('display','block');//弹出层显示层显示；
	});
	// self.close_popup('$showHistory');
};


$(function() {
	var myPageObj = new rt.page.result();
	myPageObj.main();
});


