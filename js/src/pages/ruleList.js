rt.page.ruleList = function(){
	this.rulesData = [];	// 当前的规则列表数据
	this.rulesPer = 10;
	
	this.curStocksRuleId = false;	// 当前白名单所属规则的id号
	this.stocksData = null;	// 当前的白名单列表数据
	this.stocksPer = 1;
	this.stockReg = /^\d{6}$/;// 单个白名单验证正则
	
	this.rulesPaginationObj = null;	// 规则列表分页条插件实例对象
	
	this.stocksPaginationObj = null;// 白名单分页条插件实例对象
	
	this.codeSplitChar = ",";			// 白名单股票代码分隔符
	
};

rt.page.ruleList.prototype.main = function(){
	var self = this;
	self.setStaticElems();	// 静态元素设置
	
	self.autoTbodyViewportHeight();		// 规则表格高度自适应方法
	
	self.eventBind();		// 事件绑定方法
};

rt.page.ruleList.prototype.urlCfg = {
	
	baseUrl:"",
	baseType:"get",
	dataType:"jsonp",
	actions:{
		addRules:{	// 增加规则
			url:"",
			type:"",
			dataType:"json",
			baseData:{
				
			}
		},
		deleteRules:{ // 删除规则
			url:"",
			type:"",
			baseData:{
				
			}
		},
		updateRule:{ 	// 单个更新规则（包括新增和修改）
			url:"",
			type:"",
			baseData:{
				
			}
		},
		getRules:{	// 查询规则
			url:"",
			type:"",
			baseData:{
				
			}
		},
	}
};

// 异步请求管理器
rt.page.ruleList.prototype.ajaxManager = function(actionName,opt,callback){
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

rt.page.ruleList.prototype.setStaticElems = function(){
	var self = this;
	self.shadow = $("#page_shadow");		// 全局遮罩容器
	
	self.topBar = $("#top_bar");			// 顶部条容器
	
	self.searchBar = self.topBar.find(".search_bar");	// 搜索条
	self.searchInput = self.searchBar.find(".search_input");	// 顶部搜索输入框
	self.searchBtn = self.searchBar.find(".search_btn");		// 顶部搜索按钮
	
	self.fastBar = self.topBar.find(".fast_bar");				// 快速按钮条
	self.importBtn = self.fastBar.find(".import_btn");			// 导入按钮
	self.addRuleBtn = self.fastBar.find(".add_rules_btn");		// 添加规则弹层启动按钮
	self.startTestBtn = self.fastBar.find(".start_test_btn");	// 开始测试按钮
	self.testResultBtn = self.fastBar.find(".test_result_btn");	// 测试结果按钮
	self.logBtn = self.fastBar.find(".log_btn")					// 操作日志按钮
	self.statisticsBtn = self.fastBar.find(".statistics_btn");	// 统计结果按钮
	
	self.batchingBar = self.topBar.find(".batching_bar");		// 批处理工具条
	self.batchingDelBtn = self.batchingBar.find(".batching_del_btn");	// 批量删除按钮
	
	self.theadTable = $("#thead_table");						// 规则表格的表头
	self.checkallBox = self.theadTable.find(".check_all");		// 规则表头的全选复选框
	
	self.tbodyViewport = $("#tbody_viewport");					// 规则列表视口容器
	self.tbodyTable = self.tbodyViewport.find(".tbody_table");	// 规则列表表格
	
	self.footBar = $("#foot_bar");			// 底部条容器
	self.pageBar = self.footBar.find(".page_bar");	// 底部分页条
	
	self.addRulePop = $("#add_rule_pop");	// 添加规则弹窗容器
	self.addRuleIndexInput = 	self.addRulePop.find(".rule_index_text");	// 添加规则的指标名称输入框
	self.addRuleFormulaInput = 	self.addRulePop.find(".rule_formula_text");	// 添加规则的计算公式输入框
	self.addRulePeriodInput = 	self.addRulePop.find(".rule_period_text");	// 添加规则的执行周期输入框
	
	self.whiteListPop = $("#white_list_pop");								// 白名单弹窗容器
	self.addWhiteListInput = self.whiteListPop.find(".add_stock_text");		// 白名单添加输入框
	self.addWhiteListBtn = self.whiteListPop.find(".add_stock_btn");		// 白名单添加按钮
	self.batchingDelWhiteListBtn = self.whiteListPop.find(".batching_del_stock_btn");// 白名单批量删除按钮
	self.whiteListTbody = self.whiteListPop.find(".white_list_tbody");		// 白名单表体元素
	self.checkallStocksBox = self.whiteListPop.find(".checkall_stock");		// 白名单全选复选框
	self.stocksPageBar = self.whiteListPop.find(".page_bar");				// 白名单分页条载体容器
};

/* 规则表格高度自适应初始化方法 */
rt.page.ruleList.prototype.autoTbodyViewportHeight = function(){
	var self = this,
		calcFun;
	calcFun = function(){
		var topBarH = parseInt(self.topBar.outerHeight(true)),
			footBarH = parseInt(self.footBar.outerHeight(true)),
			theadTableH = parseInt(self.theadTable.outerHeight()),
			winH = parseInt($(window).height()),
			modify = 5,	// 修正值，目前的来源是视口容器的padding-bottom;
			tbodyTableViewportH = winH - (topBarH + theadTableH + footBarH + modify);
		self.tbodyViewport.css({
			height:tbodyTableViewportH+"px"
		});
	};
	calcFun();
	$(window).on("resize",function(){
		calcFun();
	});
};

/* 事件绑定公共方法 */
rt.page.ruleList.prototype.eventBind = function(){
	var self = this;
	
	// 搜索规则按钮点击事件
	self.searchBtn.on("click",function(){
		self.searchRulesHandle();
	});
	
	// 快速工具条添加规则按钮点击事件
	self.addRuleBtn.on("click",function(){
		self.switchAddRulesPop(true);
	});
	// 添加规则弹层中关闭、取消按钮点击事件
	self.addRulePop.on("click",".cancel_btn,.close_btn",function(){
		self.switchAddRulesPop(false);
	});
	// 添加规则弹层中确定按钮点击事件
	self.addRulePop.on("click",".sure_btn",function(){
		self.addRuleHandle();
	});
	
	self.startTestBtn.on("click",function(){
		self.sartTestBtnClickHandle();
	});
	
	self.testResultBtn.on("click",function(){
		window.open("./result.html");
	});
	
	// 规则列表中，单个删除按钮点击事件
	self.tbodyTable.on("click",".del_rule_item_btn",function(){
		self.delRuleHandle($(this));
	});
	
	// 快速工具条批量删除按钮点击事件
	self.batchingDelBtn.on("click",function(){
		self.batchingDelRuleHandle();
	});
	
	// 全选、单选关联逻辑
	self.checkallBox.on("click",function(){
		var flag = $(this).is(":checked");
		if(flag){
			self.tbodyTable.find(".check_rule").attr("checked","checked");
		}else{
			self.tbodyTable.find(".check_rule").removeAttr("checked");
		}
	});
	self.tbodyTable.on("click",".check_rule",function(){
		var flag = $(this).is(":checked");
		if(!flag){
			self.checkallBox.removeAttr("checked");
		}
	});
	
	// 规则列表可编辑属性修改事件
	self.tbodyTable.on("focus","td[contenteditable='true']",function(){
		$(this).attr("old",$(this).text());
	}).on("blur","td[contenteditable='true']",function(){
		self.editRuleField($(this));
	});
	
	// 规则白名单查看按钮点击事件
	self.tbodyTable.on("click",".white_list_detail_btn",function(){
		self.whiteListDetailHandle($(this));
	});
	
	// 白名单弹层中新增按钮点击事件
	self.addWhiteListBtn.on("click",function(){
		self.addWhiteListHandle();
	});
	
	// 白名单弹层中批量删除按钮点击事件
	self.batchingDelWhiteListBtn.on("click",function(){
		self.batchingDelWhiteListHandle();
	});
	
	// 白名单弹层中单个删除按钮点击事件
	self.whiteListPop.on("click",".del_stock_btn",function(){
		self.delWhiteListHandle($(this));
	});
	
	// 白名单弹层全选、单选按钮点击事件处理
	self.checkallStocksBox.on("click",function(){
		var flag = $(this).is(":checked");
		if(flag){
			self.whiteListPop.find(".check_stock").attr("checked","checked");
		}else{
			self.whiteListPop.find(".check_stock").removeAttr("checked");
		}
	});
	self.whiteListPop.on("click",".check_stock",function(){
		var flag = $(this).is(":checked");
		if(!flag){
			self.checkallStocksBox.removeAttr("checked");
		}
	});
	
	// 白名单关闭按钮点击事件处理
	self.whiteListPop.on("click",".close_btn",function(){
		self.switchWhiteListPop(false);
	});
	
	
	
	
};

/* 搜索规则按钮点击事件响应函数 */
rt.page.ruleList.prototype.searchRulesHandle = function(obj){
	var self = this,
		q = $.trim(self.searchInput.val()),
		opt,
		callback;
		
	callback = function(flag,obj){
		if(flag){
			self.initRuleArea(obj);
		}else{
			alert("查询失败，请重试！");
		}
	};
	//self.ajaxManager("getRules",opt,callback);
	
	//伪造请求数据及回调函数执行过程
	var obj = {
		total:300,
		result:[
			{
				id:1,
				name:"规则1",
				index:"指标1",
				formula:"公式1",
				period:"周",
				remark:"备注1"
			},
			{
				id:2,
				name:"规则2",
				index:"指标2",
				formula:"公式2",
				period:"天",
				remark:"备注2"
			},
			{
				id:3,
				name:"规则3",
				index:"指标3",
				formula:"公式3",
				period:"天",
				remark:"备注3"
			},
			{
				id:4,
				name:"规则4",
				index:"指标4",
				formula:"公式4",
				period:"月",
				remark:"备注4"
			},
			{
				id:5,
				name:"规则5",
				index:"指标5",
				formula:"公式5",
				period:"天",
				remark:"备注5"
			},
			{
				id:1,
				name:"规则1",
				index:"指标1",
				formula:"公式1",
				period:"周",
				remark:"备注1"
			},
			{
				id:2,
				name:"规则2",
				index:"指标2",
				formula:"公式2",
				period:"天",
				remark:"备注2"
			},
			{
				id:3,
				name:"规则3",
				index:"指标3",
				formula:"公式3",
				period:"天",
				remark:"备注3"
			},
			{
				id:4,
				name:"规则4",
				index:"指标4",
				formula:"公式4",
				period:"月",
				remark:"备注4"
			},
			{
				id:5,
				name:"规则5",
				index:"指标5",
				formula:"公式5",
				period:"天",
				remark:"备注5"
			},
			{
				id:1,
				name:"规则1",
				index:"指标1",
				formula:"公式1",
				period:"周",
				remark:"备注1"
			},
			{
				id:2,
				name:"规则2",
				index:"指标2",
				formula:"公式2",
				period:"天",
				remark:"备注2"
			},
			{
				id:3,
				name:"规则3",
				index:"指标3",
				formula:"公式3",
				period:"天",
				remark:"备注3"
			},
			{
				id:4,
				name:"规则4",
				index:"指标4",
				formula:"公式4",
				period:"月",
				remark:"备注4"
			},
			{
				id:5,
				name:"规则5",
				index:"指标5",
				formula:"公式5",
				period:"天",
				remark:"备注5"
			},
			{
				id:1,
				name:"规则1",
				index:"指标1",
				formula:"公式1",
				period:"周",
				remark:"备注1"
			},
			{
				id:2,
				name:"规则2",
				index:"指标2",
				formula:"公式2",
				period:"天",
				remark:"备注2"
			},
			{
				id:3,
				name:"规则3",
				index:"指标3",
				formula:"公式3",
				period:"天",
				remark:"备注3"
			},
			{
				id:4,
				name:"规则4",
				index:"指标4",
				formula:"公式4",
				period:"月",
				remark:"备注44"
			},
			{
				id:5,
				name:"规则5",
				index:"指标5",
				formula:"公式5",
				period:"天",
				remark:"备注20"
			}
		]
	};
	callback(true,obj);
};

/* 根据一份数据，渲染规则列表内容、初始化分页
obj:{
	total:
	result:[
		ruleObj_1,
		ruleObj_2,
		ruleObj_3,
		...
	]
}
 */
rt.page.ruleList.prototype.initRuleArea = function(obj){
	var self = this,
		html = '';
		
	if(typeof obj === "object" && obj !== null && obj.total > 0){
		self.rulesData = obj.result;	// 有效数据，保存到公共属性中；
		
		self.renderRulesListByPage(1);	// 渲染第一页内容
		
		self.initRuleListPagebar();
		
	}else{
		self.rulesData = [];	// 无效数据，清空公共属性；
		self.tbodyTable.html(self.getRulesListHtmlByData());
		self.renderRulesListByPage();
		self.checkallBox.removeAttr("checked");
		self.pageBar.html("");
	}
};

/* 根据pageNum指定的页号，渲染规则列表内容*/
rt.page.ruleList.prototype.renderRulesListByPage = function(pageNum){
	var self = this,
		html;
	html = self.getRulesListHtmlByData(self.getRulesListByPage(pageNum));
	self.tbodyTable.html(html);
	
	
	self.checkallBox.removeAttr("checked");
};

/* 根据一份列表数据，组装列表的html代码
 * 
 */
rt.page.ruleList.prototype.getRulesListHtmlByData = function(rulesArr){
	var self = this,
		htmlArr = [],
		rule;
	if(typeof rulesArr !== "undefined" && rulesArr instanceof Array && rulesArr.length > 0){
		for(var i=0,len=rulesArr.length;i<len;i++){
			rule = rulesArr[i];
			htmlArr.push('<tr key="'+i+'">');
				htmlArr.push('<td class="checkbox_col"><input type="checkbox" class="checkbox_item check_rule"></td>');
				htmlArr.push('<td class="rulename_col" contenteditable="true" field_name="name">'+rule.name+'</td>');
				htmlArr.push('<td class="indexname_col" contenteditable="true" field_name="index">'+rule.index+'</td>');
				htmlArr.push('<td class="formula_col" contenteditable="true" field_name="formula">'+rule.formula+'</td>');
				htmlArr.push('<td class="period_col" contenteditable="true" field_name="period">'+rule.period+'</td>');
				htmlArr.push('<td class="whitelist_col"><span class="white_list_detail_btn">查看</span></td>');
				htmlArr.push('<td class="action_col"><span class="action_btn del_rule_item_btn">删除</span></td>');
				htmlArr.push('<td class="remark_col" contenteditable="true" field_name="remark">'+rule.remark+'</td>');
			htmlArr.push('</tr>');
		}
	}else{
		htmlArr.push('<tr><td class="no_rule_tip">暂无规则数据！</td></tr>');
	}
	return htmlArr.join('');
};


/*根据指定页码返回当前规则列表中对应页的规则数据，返回值是一个规则数组*/
rt.page.ruleList.prototype.getRulesListByPage = function(p){
	var self = this,
		list,
		length = self.rulesData.length,
		per = self.rulesPer,
		totalPages = Math.ceil(length/per),
		p = (typeof p === "number") && (p > 0) && (p <= totalPages) ? p : 1,
		start = per * (p-1),
		end = p === totalPages ? length : (per * p);
		
	list = self.rulesData.slice(start,end);
	return list;
};


/* 初始化(或重置)规则列表分页条 
 * 可通过startPage参数设置初始页码，默认值是1
 */
rt.page.ruleList.prototype.initRuleListPagebar = function(pageNum){
	var self = this,
		total = self.rulesData && (self.rulesData instanceof Array) && (self.rulesData.length > 0) ? self.rulesData.length : 0,
		per = self.rulesPer;
	if(total > per){
		var totalPages = Math.ceil(total/per),
			startPage = typeof pageNum === "number" && pageNum > 0 && pageNum <= totalPages ? pageNum : 1;
		if(self.rulesPaginationObj === null){
			self.rulesPaginationObj = new sn.plugin.pagination();
		}
		self.rulesPaginationObj.main({
			wrap: self.pageBar,
			perpage:per,
			totalPages:totalPages,
			showPages:10,
			startPage:startPage,
			gotoPage:1,
			callback:function(arg){
				var info = arg[0],
					jumpPageFun = arg[1],
					tagPage = info[0],
					per = info[1],
					pageObj = info[2];
				
				self.renderRulesListByPage(tagPage);	// 渲染目标页内容
				
				jumpPageFun();			// 页码调整到目标页状态
				
			}
		});
	}else{
		self.pageBar.html("");
		self.rulesPaginationObj = null;
	}
};

/*--添加规则相关方法集开始--*/

// 调整添加规则弹层的状态,flag等价的布尔值为true或false分别对应展示和关闭弹层
rt.page.ruleList.prototype.switchAddRulesPop = function(flag){
	var self = this;
	flag = flag ? true : false;
	if(flag){
		self.shadow.show();
		self.addRulePop.show();
	}else{
		
		self.addRulePop.hide();
		self.shadow.hide();
		
		// 清空输入区域
		self.addRuleIndexInput.val("");
		self.addRuleFormulaInput.val("");
		self.addRulePeriodInput.val("");
	}
};

// 添加规则确定按钮点击事件处理方法
rt.page.ruleList.prototype.addRuleHandle = function(){
	var self = this,
		indexStr = 		$.trim(self.addRuleIndexInput.val()),		// 规则指标名称
		formulaStr = 	$.trim(self.addRuleFormulaInput.val()),		// 规则计算公式
		periodStr = 	$.trim(self.addRulePeriodInput.val()),		// 规则执行频率
		flag = true,												// 输入合法性验证信号
		opt,
		callback;
	if(indexStr === ""){
		self.addRuleIndexInput.val("").focus();
		flag = false;
	}else if(formulaStr === ""){
		self.addRuleFormulaInput.val("").focus();
		flag = false;
	}else if(periodStr === ""){
		self.addRulePeriodInput.val("").focus();
		flag = false;
	}
	if(flag){
		opt = {};
		callback = function(flag,obj){
			if(flag){
				self.rulesData.unshift(obj);	// 将新增的规则追加到当前规则数组的最前边
				
				self.renderRulesListByPage(1);	// 渲染第一页内容
		
				self.initRuleListPagebar();		// 重置分页条
				
				self.switchAddRulesPop(false);	// 关闭添加规则弹层
				
			}else{
				alert("规则添加失败，请重试！");
			}
		};
		//self.ajaxManager("updateRule",opt,callback);
		
		// 模拟接口返回值及调用回调函数逻辑
		var obj = {
			id:     "123",
			name:   "测试添加规则1",
			index:  "测试规则指标名称1",
			formula:"测试规则计算公式1",
			period: "测试规则自动执行的周期（频率）",
			remark: "111"
		};
		callback(true,obj);
	}
};

/*--删除规则相关方法集开始--*/

// 单条规则删除按钮点击事件处理方法
rt.page.ruleList.prototype.delRuleHandle = function(btn){
	var self = this,
		rowElem = btn.closest("tr"),
		ruleInfo = self.getRuleInfoByRowElem(rowElem),
		opt,
		callback;
	
	callback = function(flag,data){
		if(flag){
			var tagPage;
			self.deleteRuleDataByKeys([ruleInfo.globalKey]);	// 修正rulesData数组
			
			if(self.rulesPaginationObj !== null){
				tagPage = self.rulesPaginationObj.current;
			}else{
				tagPage = 1;
			}
			self.renderRulesListByPage(tagPage);	// 渲染之前页码内容
		
			self.initRuleListPagebar(tagPage);		// 重置分页条
			
		}else{
			alert("删除失败，请重试！");
		}
	};
	//self.ajaxManager("deleteRules",opt,callback);
	
	// 模拟返回数据 执行回调函数
	var obj = {
		
	};
	callback(true,obj);
};

/* 批量删除按钮点击事件响应函数
 * 
 */
rt.page.ruleList.prototype.batchingDelRuleHandle = function(){
	var self = this,
		checkallFlag = false,
		delIdArr = [],
		delKeyArr = [],
		checkedBoxes,
		rowElem,
		infoItem,
		opt,
		callback;
	if(self.checkallBox.is(":checked")){
		checkallFlag = true;
		if(confirm("确定要全部删除吗？")){
			
		}else{
			return;
		}
	}
	
	
	if(checkallFlag){
		// 禁止超过200条的全选删除
		if(self.rulesData.length > 200){
			alert("全部删除的规则太多，请减少后再删除！");
			return;
		}
		for(var i=0,len=self.rulesData.length;i<len;i++){
			infoItem = self.rulesData[i];
			delIdArr.push(infoItem.id);
			delKeyArr.push(i);
		}
		
	}else{
		checkedBoxes = self.tbodyTable.find(".check_rule:checked");
		if(checkedBoxes.length === 0){
			alert("请选择目标规则！");
			return;
		}
		checkedBoxes.each(function(){
			rowElem = $(this).closest("tr");
			infoItem = self.getRuleInfoByRowElem(rowElem);
			delIdArr.push(infoItem.detail.id);
			delKeyArr.push(infoItem.globalKey);
		});
	}
	
	
	callback = function(flag,data){
		if(flag){
			var tagPage;
			self.deleteRuleDataByKeys(delKeyArr);	// 修正rulesData数组,实际应该按照返回值中的规则id，重新映射到规则序号来处理
			
			// 获取当前页码
			if(self.rulesPaginationObj !== null){
				tagPage = self.rulesPaginationObj.current;
			}else{
				tagPage = 1;
			}
			
			self.renderRulesListByPage(tagPage);	// 渲染之前页码内容
		
			self.initRuleListPagebar(tagPage);		// 重置分页条
			
		}else{
			alert("删除失败，请重试！");
		}
	};
	//self.ajaxManager("deleteRule",opt,callback);
	
	// 模拟返回数据 执行回调函数
	var obj = {
		
	};
	callback(true,obj);
	
	
};

/* 开始测试按钮点击事件响应函数
 * 
 */
rt.page.ruleList.prototype.sartTestBtnClickHandle = function(){
	var self = this,
		url = '',
		checkallFlag = false,
		idArr = [],
		checkedBoxes,
		rowElem,
		infoItem,
		opt,
		callback;
	
	

	if(self.checkallBox.is(":checked")){
		checkallFlag = true;
		if(confirm("确定要测试全部规则吗？")){
			
		}else{
			return;
		}
	}
	
	
	if(checkallFlag){
		for(var i=0,len=self.rulesData.length;i<len;i++){
			infoItem = self.rulesData[i];
			idArr.push(infoItem.id);
		}
	}else{
		checkedBoxes = self.tbodyTable.find(".check_rule:checked");
		if(checkedBoxes.length === 0){
			alert("请选择目标规则！");
			return;
		}
		checkedBoxes.each(function(){
			rowElem = $(this).closest("tr");
			infoItem = self.getRuleInfoByRowElem(rowElem);
			idArr.push(infoItem.detail.id);
		});
	}
	
	url = "./result.phtml?id="+idArr.join(",");
	window.open(url);
};


/* 根据规则列表中的单元行元素，获取该单元行对应的规则详细信息，以及该数据在rulesData数组中的下标

 * 返回值格式:
 	{
		globalKey:	// 在rulesData中的下标，从0开始；
		detail:{	// 规则的详细信息
			id:
			name:
			index:
			formula:
			period:
			remark:
		}
	}
 *
 */
rt.page.ruleList.prototype.getRuleInfoByRowElem = function(row){
	var self = this,
		keyInPage = parseInt(row.attr("key")),	// 页内数据编号（从0开始）
		globalKey,								// 在公共的rulesData数组中对应的下标
		per = self.rulesPer,
		curPageNum = 1,
		info = {};
	if(self.rulesPaginationObj !== null){
		curPageNum = self.rulesPaginationObj.current;
		globalKey = (curPageNum-1) * per + keyInPage;
	}else{
		globalKey = keyInPage;
	}
	
	info.globalKey = globalKey;
	info.detail = self.rulesData[globalKey];
	return info;
};
/* 按照keysArr参数，剔除原rulesData中对应下标的数据
 * 要点：
 	keysArr的元素，需要传递整数型，不要传递字符串；

 */
rt.page.ruleList.prototype.deleteRuleDataByKeys = function(keysArr){
	var self = this,
		arr = [];
	if(keysArr instanceof Array && keysArr.length > 0 && self.rulesData.length > 0){
		for(var i=0,len=self.rulesData.length;i<len;i++){
			if($.inArray(i,keysArr) === -1){
				arr.push(self.rulesData[i]);
			}
		}
	}
	self.rulesData = arr;
};

/*----修改规则属性相关方法----*/

rt.page.ruleList.prototype.editRuleField = function(elem){
	var self = this,
		editVal = $.trim(elem.text()),
		oldVal = elem.attr("old"),
		id,
		info,
		field,
		opt,
		callback;
	if(editVal !== oldVal){
		field = elem.attr("field_name");
		info = self.getRuleInfoByRowElem(elem.closest("tr"));
		id = info.detail.id;
		opt = {
			id:id
		};
		opt[field] = editVal;
		
		callback = function(flag,data){
			if(flag){
				var row = elem.closest("tr"),
					info = self.getRuleInfoByRowElem(row);
					
				self.rulesData[info.globalKey][field] = editVal;
			}else{
				elem.text(oldVal);
			}
		};
		// self.ajaxManager("updateRule",opt,callback);
		
		obj = {
		
		};
		callback(true,obj);
		//callback(false);
	}else{
		alert("请确保有修改此属性值！");
	}
};

/* 切换白名单弹层的状态
	flag: true || false, true表示显示弹层，false标识关闭弹层
 */
rt.page.ruleList.prototype.switchWhiteListPop = function(flag){
	var self = this;
	flag = flag ? true : false;
	if(flag){
		self.shadow.show();
		self.whiteListPop.show();
	}else{
		
		self.whiteListPop.hide();
		self.shadow.hide();
		
		// 清空白名单列表和白名单分页条
		self.whiteListTbody.html("");
		self.stocksPaginationObj = null;
		
	}
};

// 白名单查看按钮点击事件响应函数
rt.page.ruleList.prototype.whiteListDetailHandle = function(elem){
	var self = this,
		row = elem.closest("tr"),
		info = self.getRuleInfoByRowElem(row),
		opt,
		callback;

	callback = function(flag,data){
		if(flag){
			self.initWhiteList(info.detail.id,data);
			self.switchWhiteListPop(true);
		}else{
			alert("白名单获取失败，请重试！");
		}
	};
	opt = {
		action:"getall",
		rule_id:info.detail.id
	};
	// self.ajaxManager("whiteList",opt,callback);
	
	obj = ["300033","000001","000002"];
	callback(true,obj);
	//callback(false);

};

/* 初始化白名单列表方法
 * 参数：
 		rule_id:白名单数据对应的规则id
		data: 股票代码数组，如["000001","000002","000003"]
 */
rt.page.ruleList.prototype.initWhiteList = function(rule_id,data){
	var self = this;
	if(typeof data === "object" && data !== null && data instanceof Array && data.length > 0){
		self.curStocksRuleId = rule_id;	// 有效数据，保存到当前白名单规则id公共属性；
		self.stocksData = data;		// 有效数据，保存到公共属性中；
		
		self.renderStocksListByPage(1);	// 渲染第一页白名单内容
		
		self.initStocksListPagebar();	// 设置白名单分页条
		
	}else{
		self.curStocksRuleId = false;	// 无效数据，清除当前白名单规则id公共属性；
		
		self.stocksData = [];	// 无效数据，清空公共属性；
		self.whiteListTbody.html(self.getStocksListHtmlByData());
		self.checkallStocksBox.removeAttr("checked");
		self.stocksPageBar.html("");
	}
};

/* 根据页号渲染
 *
 */
rt.page.ruleList.prototype.renderStocksListByPage = function(pageNum){
	var self = this,
		html;
	html = self.getStocksListHtmlByData(self.getStocksListByPage(pageNum));
	self.whiteListTbody.html(html);
	
	self.checkallStocksBox.removeAttr("checked");
};

/* 根据一份股票代码字符串的数组组装白名单列表的html字符串并返回
 * 如果stocksArr不合法或长度为0，则返回空白名单提示文案
 */
rt.page.ruleList.prototype.getStocksListHtmlByData = function(stocksArr){
	var self = this,
		htmlArr = [],
		stock;
	if(typeof stocksArr !== "undefined" && stocksArr instanceof Array && stocksArr.length > 0){
		for(var i=0,len=stocksArr.length;i<len;i++){
			stock = stocksArr[i];
			htmlArr.push('<tr key="'+i+'">');
				htmlArr.push('<td class="checkbox_col"><input type="checkbox" class="check_stock"></td>');
				htmlArr.push('<td class="code_col">'+stock+'</td>');
				htmlArr.push('<td class="action_col"><span class="del_stock_btn">删除</span></td>');
			htmlArr.push('</tr>');
		}
	}else{
		htmlArr.push('<tr><td colspan="3" class="no_stock_tip">暂无规则数据！</td></tr>');
	}
	return htmlArr.join('');
};

/* 根据页号获取对应页的白名单数据数组
 * 参数：
 	p: 数值型页号参数，从1开始；
		如果不是数字或小于1，则返回空数组；
		如果是数字但大于当前总页数，则返回最后一页数据；
 *
 */
rt.page.ruleList.prototype.getStocksListByPage = function(p){
	var self = this,
		list,
		length = self.stocksData.length,
		per = self.stocksPer,
		totalPages = Math.ceil(length/per),
		p = (typeof p === "number") && (p > 0) && (p <= totalPages) ? p : 1,
		start = per * (p-1),
		end = p === totalPages ? length : (per * p);
		
	list = self.stocksData.slice(start,end);
	return list;
	
};

/* 初始化或重置白名单列表分页条方法
 * pageNum: 初始化或重置时，起始页号，如果不合法则使用第1页
 */
rt.page.ruleList.prototype.initStocksListPagebar = function(pageNum){
	var self = this,
		total = self.stocksData && (self.stocksData instanceof Array) && (self.stocksData.length > 0) ? self.stocksData.length : 0,
		per = self.stocksPer;

	if(total > per){
		var totalPages = Math.ceil(total/per),
			startPage = typeof pageNum === "number" && pageNum > 0 && pageNum <= totalPages ? pageNum : 1;
		if(self.stocksPaginationObj === null){
			self.stocksPaginationObj = new sn.plugin.pagination();
		}
		self.stocksPaginationObj.main({
			wrap: self.stocksPageBar,
			perpage:per,
			totalPages:totalPages,
			showPages:10,
			startPage:startPage,
			gotoPage:1,
			callback:function(arg){
				var info = arg[0],
					jumpPageFun = arg[1],
					tagPage = info[0],
					per = info[1],
					pageObj = info[2];
				
				self.renderStocksListByPage(tagPage);	// 渲染目标页内容
				
				jumpPageFun();			// 页码调整到目标页状态
				
			}
		});
	}else{
		self.stocksPageBar.html("");
		self.stocksPaginationObj = null;
	}
};

/* 白名单字符串或数组合法性验证方法 
 * 参数说明：
     val: 待验证的白名单字符串或数组，字符串格式时多个白名单代码之间用英文逗号分隔，如："300033"、"000001,000002"、["300033"]、["000001","000002"]
	 
 * 返回值说明：
 	 如果传入的参数完全不合法，返回false,如果传入的参数是数组或字符串，但是其中没有符合要求的白名单单元时，也属于参数不合法的范畴，返回false,如："0001,0002,00004"格式；
	 否则返回如下格式的对象：
     obj:{
		flag: true || false   完全合法还是部分合法，完全合法则返回true，部分合法则返回false
		data: 和val格式相同的合法数值，
		      如果flag属性为true，则返回值应该和参数val完全一致；
			  如果flag属性为false，则返回值可能为空数组、空字符串，这表明所有的白名单皆不合法，如果为非空字符串或非空数组，则表明白名单数据中有部分合法，data属性就是合法部分构成的相同格式的子集；
	 }
 */
rt.page.ruleList.prototype.checkWhiteList = function(val){
	var self = this,
		valErrorFlag = false,
		valType,
		flag = true,
		valArr,
		itemStr,
		backArr = [],
		data,
		obj,
		backObj;

	// 参数格式合法性初步检查
	if(typeof val === "string"){
		if(val.length > 5){
			valType = "string";
			valArr = val.split(self.codeSplitChar);
		}else{
			valErrorFlag = true;
		}
	}else if(val instanceof Array){
		if(val.length > 0){
			valType = "array";
			valArr = val;
		}else{
			valErrorFlag = true;
		}
	}else{
		valErrorFlag = true;
	}
	
	// 初步检查参数格式不合法时，返回false
	if(valErrorFlag){
		return false;
	}
	
	for(var i=0,len=valArr.length;i<len;i++){
		itemStr = valArr[i];
		if(self.stockReg.test(itemStr)){
			backArr.push(itemStr);
		}else{
			flag = false;
		}
	}
	
	// 如果参数初步检查合法，但是没有抽取出一条合法的白名单单元时，也返回false
	if(backArr.length === 0){
		return false;	
	}
	// 按照参数格式组装相同格式的合法白名单数据
	data = valType === "string" ? backArr.join(self.codeSplitChar) : backArr;
	
	backObj = {
		flag:flag,
		data:data
	};
	return backObj;
};

/* 根据当前白名单列表中的单元行元素，获取该单元行对应的白名单详细信息，以及该数据在stocksData数组中的下标

 * 返回值格式:
 	{
		globalKey:	// 在stocksData中的下标，从0开始；
		detail:{	// 白名单的详细信息
			code:   // 股票代码
		}
	}
 *
 */
rt.page.ruleList.prototype.getStockInfoByRowElem = function(row){
	var self = this,
		keyInPage = parseInt(row.attr("key")),	// 页内数据编号（从0开始）
		globalKey,								// 在公共的rulesData数组中对应的下标
		per = self.stocksPer,
		curPageNum = 1,
		info = {};
	if(self.stocksPaginationObj !== null){
		curPageNum = self.stocksPaginationObj.current;
		globalKey = (curPageNum-1) * per + keyInPage;
	}else{
		globalKey = keyInPage;
	}
	
	info.globalKey = globalKey;
	info.detail = {
		code:self.stocksData[globalKey]
	};
	return info;
};


/* 当前白名单数据更新方法 
 * 参数：
		opt:{
			action:动作类型，支持"add","del"
			arr:白名单代码数组
		}
 */
rt.page.ruleList.prototype.updateCurStocksData = function(opt){
	var self = this,
		action,
		arr,
		argFlag = true;
	
	if(typeof opt === "object" && opt !== null && opt.action && opt.arr && opt.arr instanceof Array && opt.arr.length > 0){
		action = opt.action;
		arr = opt.arr;
		if(action === "add"){
			for(var i=0,len=arr.length;i<len;i++){
				if($.inArray(arr[i],self.stocksData === -1)){
					self.stocksData.unshift(arr[i]);
				}
			}
		}else if(action === "del"){
			for(var i=0,len=arr.length;i<len;i++){
				index = $.inArray(arr[i],self.stocksData);
				if(index !== -1){
					self.stocksData.splice(index,1);
				}
			}
		}else{
			argFlag = false;
		}
	}else{
		argFlag = false;
	}
	
	if(!argFlag){
		alert("白名单更新失败，请检查参数是否合法！");
	}
	
};


/* 添加（单个或批量）白名单处理方法 */
rt.page.ruleList.prototype.addWhiteListHandle = function(){
	var self = this,
		str = $.trim(self.addWhiteListInput.val()),
		checkInfo,
		opt,
		callback;
		
	checkInfo = self.checkWhiteList(str);
	if(checkInfo === false){
		alert("输入的白名单完全不合法，请重试！");
	}else if(checkInfo.flag === false){
		if(confirm("输入的白名单存部分不合法，需要自动剔除不合法部分吗？")){
			self.addWhiteListInput.val(checkInfo.data);
		}
	}else{
		opt = {
			rule_id:self.curStocksRuleId,
			action:"add",
			code:checkInfo.data
		};
		callback = function(flag){
			if(flag){
				self.updateCurStocksData({
					action:"add",
					arr:checkInfo.data.split(self.codeSplitChar)
				});
			
				self.renderStocksListByPage(1);	// 渲染第1页内容
			
				self.initStocksListPagebar(1);	// 重置分页条
				
				self.addWhiteListInput.val("");
			}else{
				alert("白名单添加失败，请重试！");
			}
		};
		//self.ajaxManager("whiteList",opt,callback);
		
		obj = {};
		callback(true);
	}
	
	
};

/* 批量删除白名单处理方法 */
rt.page.ruleList.prototype.batchingDelWhiteListHandle = function(){
	var self = this,
		checkallFlag = false,
		delCodeArr = [],
		delKeyArr = [],
		checkedBoxes,
		rowElem,
		infoItem,
		opt,
		callback;
	if(self.checkallStocksBox.is(":checked")){
		checkallFlag = true;
		if(confirm("确定要清除当前规则的白名单吗？")){
			
		}else{
			return;
		}
	}
	
	
	if(checkallFlag){
		delCodeArr = self.stocksData;
	}else{
		checkedBoxes = self.whiteListTbody.find(".check_stock:checked");
		if(checkedBoxes.length === 0){
			alert("请选择目标白名单！");
			return;
		}
		checkedBoxes.each(function(){
			rowElem = $(this).closest("tr");
			infoItem = self.getStockInfoByRowElem(rowElem);
			delCodeArr.push(infoItem.detail.code);
			delKeyArr.push(infoItem.globalKey);
		});
	}
	
	
	callback = function(flag){
		if(flag){
			var tagPage;
			if(checkallFlag){
				self.stocksData = [];
			}else{
				self.updateCurStocksData({
					action:"del",
					arr:delCodeArr.join(self.codeSplitChar)
				});
			}
			
			// 获取当前页码
			if(self.stocksPaginationObj !== null){
				tagPage = self.stocksPaginationObj.current;
			}else{
				tagPage = 1;
			}
			
			self.renderStocksListByPage(tagPage);	// 渲染之前页码内容
		
			self.initStocksListPagebar(tagPage);	// 重置分页条
			
		}else{
			alert("删除失败，请重试！");
		}
	};
	opt = {
		rule_id:self.curStocksRuleId,
		action:"del",
		code:delCodeArr.join(self.codeSplitChar)
	};
	//self.ajaxManager("whiteList",opt,callback);
	
	// 模拟返回数据 执行回调函数
	callback(true);
	
};

/* 单个删除白名单处理方法 */
rt.page.ruleList.prototype.delWhiteListHandle = function(elem){
	var self = this,
		rowElem = elem.closest("tr"),
		stockInfo = self.getStockInfoByRowElem(rowElem),
		code = stockInfo.detail.code,
		opt,
		callback;
	
	callback = function(flag){
		if(flag){
			var tagPage;
			self.updateCurStocksData({
				action:"del",
				arr:[code]
			});
			
			// 获取当前页码
			if(self.stocksPaginationObj !== null){
				tagPage = self.stocksPaginationObj.current;
			}else{
				tagPage = 1;
			}
			
			self.renderStocksListByPage(tagPage);	// 渲染之前页码内容
		
			self.initStocksListPagebar(tagPage);	// 重置分页条
			
		}else{
			alert("删除失败，请重试！");
		}
	};
	opt = {
		rule_id:self.curStocksRuleId,
		action:"del",
		code:code
	};
	//self.ajaxManager("whiteList",opt,callback);
	
	// 模拟返回数据 执行回调函数
	var obj = {
		
	}; 
	callback(true,obj);
};


/*------------------------------*/
$(function(){
	var myPage = new rt.page.ruleList();
	myPage.main();
});