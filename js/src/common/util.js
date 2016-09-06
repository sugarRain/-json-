/**
* Created on 2013-3-20.
* @author: YangWu@myhexin.com
* @desc: 公用方法
* @depends: src/lib/jquery-1.8.0.min.js, src/init.js
* LIST:
	addFavorite(url,title)		将指定url以指定title加入收藏夹，Chrome下不可用，以alert提示手动添加
	calcQueryType(str)			根据str指定的细分querytype返回大类别的querytype，逻辑和现有的问答url规则中querytype一致
	checkClient()				判断是否客户端环境
	checkLogin()				判断是否登录
	confirmBox(text, extraText, onOk, onCancel, options)	确认框封装
 	dateFormat(date, formant_str) 日期转换，传入时间戳和日期格式 'Y-m-d H:i:s'
	extend(subClass,superClass)	subClass继承superClass的属性(方法和普通属性）
	eventStyle(arg1,arg2,arg3)	事件样式添加方法
	fadeOutHint(msg,targetElem,type,options)				渐隐提示框封装
	fixedNum(num,fixNum)        保留小数点，默认保留两位小数点
	flickerTip(elem,oriOpt,fun)	按照参数以指定周期执行指定次数，为指定元素添加、移出指定的样式或class，实现类似板框、背景闪烁等提示效果
	getCookie(name)				获取name指定名称的cookie值，如果不存在则返回false
	getDomainCfg(name)			获取domainCfg配置对象中name指定的配置值，如果name值不传则返回整个配置对象
	getLocationArg(name)		获取当前页面url中问候之后的字符串组成的键值对，如果有指定参数则返回对应值，否则返回整个键值对数组
	getStkExchange(stockCode)	获取6位股票代码所在交易所代码
	getSubValue(obj,keys)		获取指定obj元素中,keys指定的属性路径构成的属性值
	getYMD(utc,flag,isDay)		根据参数指定的格式，返回utc时间戳对应的年月日或时分
	htmlDecode(str)				将字符串中的一些html实体转换成对应的特殊字符
	htmlEncode(str)				将字符串中的一些特殊符号替换成对应的HTML实体
	inArray(fn,arr,i)			检查数据中是否存在特定元素
	inputMoveEnd(elem,pos)		设置光标到elem指定元素的pos位置			这个貌似有兼容性问题，可以废除了
	isValidEmail(email)			检查是否是合法的email地址
	isValidPhone(phone)			检查是否是合法的手机号码
	login						设置全局的登录弹层对象和默认绑定的方法
	merge$						将多个jQuery对象合并成一个jQuery对象
	messageBox(text, extraText, type, onOk)					消息框封装
	minBodyWidth(m_width)		简单的通过重设宽度处理实现IE6下body的最小宽度功能，高级浏览器直接用min-width样式
	modifyRefresh(opt)			根据opt配置修正当前页面url后刷新页面方法
	obj2str(o)					对象转字符串方法
	outerClick(arg)				arg[0]指定元素外部点击事件发生时，触发arg[1]指定的回调函数
	putElemTo(self,target,opt)	将self元素移动到target元素的opt指定位置	
	renderTemplate(temp,data)	使用data中的属性替换temp中的{$abc}等形式的模板变量，得到一个新的字符串
	screenShowLog(opt)			屏幕分辨率display日志记录方法
	separatorToCamelCase		转换以间隔符（如横线）分隔的字符串为驼峰形式
	setCookie(name,value,time)	设定name名称、time有效时间、value值的cookie
	setCursorPosition(elem,pos)	将光标移动到指定输入区域的指定位置	可以是jQuery或DOM元素，位置默认值是最后
	setHomePage(url)			将url指定网址设为主页
	SetMousePosition()			
	showAdvisePanel(opt)		显示提建议面板方法，可以通过opt参数更新面板场景
	splitStr(num,str)			按字节数分隔字符串，进而返回指定位置的字符，如果长度不够，则返回false
	YMDtoUTC(val)				将8位的年月日取值val转换成相应的UTC时间戳
*/
sn = sn || {};
sn.util = sn.util || {};

/*判断是否客户端环境*/
sn.util.checkClient = function(){
	try {
		external.createObject('Quote');
		return true;
	} catch (e) {
		return false;
	}
};

/**
* 根据偏移量将一个元素放到另一个元素的上右下左角的某一个位置 
* @self String(Jquery Selector) Or Dom Or Jquery Element
* @target String(Jquery Selector) Or Dom Or Jquery Element
* @opt Object, 如：
* 	{
* 		offset: [0, 0],					//相对于目标元素的偏移量
* 		position: ['right', 'top']		//偏移所参照的目标元素的角
* 	}
*/
sn.util.checkLogin = function(){
	if(typeof global_source === "string" && global_source === "client"){
		return true;
	}
	if (typeof username === 'undefined' || username === '' || username === null){
		return false;
	}
	return true;
};
sn.util.putElemTo = function(self, target, opt) {
	if (!self || !target) {
		return;
	}
	
	opt = opt || {};
	opt = $.extend({
		offset: [0, 0],
		position: ['right', 'top']
	}, opt);
	
	var targetOffset = $(target).offset();
	var offset = {x: opt.offset[0], y: opt.offset[1]};
	var modify = {x: 0, y: 0};
	
	var position = opt.position;
	if (position[0] == 'right') {
		modify.x = $(target).outerWidth();
	}
	if (position[1] == 'bottom') {
		modify.y = $(target).outerHeight();
	}
	
	var finallOffset = {
		left: targetOffset.left + offset.x + modify.x, 
		top: targetOffset.top + offset.y + modify.y
	};
	$(self).offset(finallOffset);
};

/**
* 使一个类继承一另个类
* @subClass Function 子类
* @superClass Function 父类
*/
sn.util.extend = function(subClass, superClass) {
	var F = function() {};
	F.prototype = superClass.prototype;
	subClass.prototype = new F();
	subClass.prototype.constructor = subClass;
	
	subClass.superclass = superClass.prototype;
	if (superClass.prototype.constructor == Object.prototype.constructor) {
		superClass.prototype.constructor = superClass;
	}
};

/*
 *@author：chengtingting
 *@desc：cookie处理
 *@参数说明：name,cookie名；value,cookie值；time,cookie时长
 */
sn.util.setCookie = function(name,value,time){
	if(!time){
		time =30*24*60*60*1000;
	}
	var exp  = new Date();
	exp.setTime(exp.getTime() + time);
	document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();
};
sn.util.getCookie = function(name){
	var arr = document.cookie.match(new RegExp("(^| )"+name+"=([^;]*)(;|$)"));
	if(!!arr) return unescape(arr[2]);
	return false;
};
/*对象转字符串方法*/
sn.util.obj2str = function(o){
	var r = []; 
	if(typeof o =="string") return "\""+o.replace(/([\'\"\\])/g,"\\$1").replace(/(\n)/g," \\n").replace(/(\r)/g,"\\r").replace(/(\t)/g,"\\t")+"\"";
	if(typeof o =="undefined") return "";
	if(typeof o == "object"){
		if(o===null) return "null";
		else if(!o.sort){
			for(var i in o){
				r.push("\""+i+"\":"+sn.util.obj2str(o[i]))
			}
			r="{"+r.join()+"}"
		}else{
			for(var i =0;i<o.length;i++)
				r.push(sn.util.obj2str(o[i]))
			r="["+r.join()+"]"
		}
		return r;
	}
	return o.toString();

};
// 登录
sn.util.login = function(){
	var $login = $('.login'),
		loginBox,
		popupLogin = function(type) {
			var typeStr = '';
			if(type){
				typeStr = '&type='+type;
			}
			if (loginBox){
				loginBox.destroy();
				loginBox = null;
			}
			loginBox = new sn.plugin.popup({
				//width: 380,
				width:317,
				titleBar:{
					//title:'用户登录'
					title:''
				},
				content: '<iframe frameborder="0" id="login_iframe" width="315" height="294" src="http://upass.10jqka.com.cn/login?act=loginByIframe'+typeStr+'&redir=http://' + window.location.hostname + ((window.location.port == '80' || window.location.port == '') ? '' : ':' + window.location.port) + '/user/pop-logined"></iframe>',
				cls: ['wc_login_popup'],
				clickHide: false,
				dragable:true
			});
			loginBox.main();
			loginBox.show();
		},
		closeLogin = function() {
			if (!loginBox) {
				return;
			}
			loginBox.close();
		};
	$login.live('click', function(){
		if(sn.util.checkLogin()){
			return;
		}
		var type = $(this).attr("loginType");
		if(type){
			popupLogin(type);
		}else{
			popupLogin();
		}
		return false;
	});

	return {
		popupLogin: popupLogin,
		closeLogin: closeLogin
	}
}();

sn.util.inputMoveEnd = function(inputElem,movePos){
	var obj = inputElem instanceof jQuery ? inputElem : $(inputElem);
	var inputDom = obj.get(0);
	var len = typeof movePos != "undefined" ? movePos : obj.val().length;
	
	/*IE*/
	if (!!window.ActiveXObject){
		var sel = inputDom.createTextRange();
		sel.moveStart('character',len);
		sel.collapse();
		sel.select();
	}
	/*FF*/
	if(window.navigator.userAgent.indexOf("Firefox") != -1){
		inputDom.selectionStart = inputDom.selectionEnd = len;
	}
	/*Chrome*/
	if(window.navigator.userAgent.indexOf("Chrome") !== -1){
		var val = obj.val();
		setTimeout(function(){
			obj.val(val);
		},10);
	}
};
/*获取当前页面url中问号之后的参数字符串解析出来的键值对，若有指定参数名则返回对应值，否则返回键值对对象*/
sn.util.getLocationArg = function(name){
	var args=new Object();
	var query=location.search.substring(1);
	var pairs=query.split("&");
	for(var i=0;i<pairs.length;i++)
	{
		var pos=pairs[i].indexOf('=');
		if(pos==-1) continue;
		var argname=pairs[i].substring(0,pos);
		var value=pairs[i].substring(pos+1);
		args[argname]=unescape(value);
		//args[argname]=decodeURIComponent(value);
	}
	if(name && (typeof name == "string")){
		return args[name];
	}else{
		return args;
	}
};
sn.util.getLocationArg2 = function(name){
	var args=new Object();
	var query=location.search.substring(1);
	var pairs=query.split("&");
	for(var i=0;i<pairs.length;i++)
	{
		var pos=pairs[i].indexOf('=');
		if(pos==-1) continue;
		var argname=pairs[i].substring(0,pos);
		var value=pairs[i].substring(pos+1);
		args[argname]=decodeURIComponent(value);
	}
	if(name && (typeof name == "string")){
		return args[name];
	}else{
		return args;
	}
};
sn.util.outerClick = function(arg){
	var con = arg[0];
	/*不是jQuery元素的将其转换为jQuery元素*/
	if(con.jquery == "undefined"){
		con = $(con);
	}
	if(!con[0]){
		return;
	}
	$("body:first").click(function(e){
		var elem = $(e.target),
			flag = false;
		/*如果事件对象的target元素不在第一个参数指定的元素(或元素序列)及其子元素中 则判定点击事件发生在第一个参数指定的范围之外*/
		if(con.index(elem) == -1 && con.find(elem).length == 0){
			flag = true;
		}
		if(typeof arg[1] == "function"){
			arg[1](e,flag);
		}
	});
};

/*多个jQuery对象合并成一个jQuery对象的方法*/
sn.util.merge$ = function() {
    var arr = [];
	$.each(arguments,function(k,v){
		var obj = v;
		obj.each(function(i){arr.push(this);});
	});
    return $(arr);
};

/**
* 转换以间隔符（如横线）分隔的字符串为驼峰形式
* 如:add-followed-step2转为addFollowedStep2
* 
* Update on 2013-11-22.
* @author: YangWu@myhexin.com
* @desc: 新增ucfirst参数，以决定是否对首字母大写
*/
sn.util.separatorToCamelCase = function(strIn, sepChar, ucfirst) {
	sepChar = sepChar || '-';
	var strs = strIn.split(sepChar),
		newStrs = [];
	
	if (!ucfirst) {
		newStrs.push(strs.shift());
	}
	
	newStrs = newStrs.concat($.map(strs, function(str) {
		return str.slice(0, 1).toUpperCase() + str.slice(1);
	}));

	return newStrs.join('');
};

/*--加入收藏夹函数
url：收藏目标url
title：收藏夹中显示的名称
这个方法能兼容IE和FF，其他浏览器中会提示Ctrl+D收藏当前页面
*/
sn.util.addFavorite = function(url,title){
	if (document.all){
		window.external.addFavorite(url,title);
	}else{
		try{
			window.sidebar.addPanel(title,url,"");
		}catch (e){
			alert("加入收藏失败，请使用Ctrl+D进行添加!");
		}
	}
};

/*--设置首页函数
url:设置为浏览器首页的目标站点URL
*/
sn.util.setHomepage = function(url){
	if(!url){
		url = "http://"+document.location.host+"/";
	}
	if (document.all){
		document.body.style.behavior='url(#default#homepage)';
		document.body.setHomePage(url);
	}else if (window.sidebar){
		if(window.netscape){
			try{
				netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
			}catch(e){   
				alert( "该操作被浏览器拒绝，如果想启用该功能，请在地址栏内输入 about:config,然后将项 signed.applets.codebase_principal_support 值该为true" );
			}
		}
		var prefs = Components.classes['@mozilla.org/preferences-service;1'].getService(Components. interfaces.nsIPrefBranch);
		prefs.setCharPref('browser.startup.homepage',url);
	}else{
		alert("设置首页失败，请手动进行设置!");
	} 
};

/*将字符串中一些特殊HTML实体替换成对应的符号*/
sn.util.htmlDecode = function(str){
	var s = "";
	if(str.length == 0)return "";
	s = str.replace(/&amp;/g,"&");
	s = s.replace(/&lt;/g,"<");
	s = s.replace(/&gt;/g,">");
	/* 这四种貌似没必要转
	s = s.replace(/&#040;/g,"(");
	s = s.replace(/&#041;/g,")");
	s = s.replace(/&nbsp;/g," ");
	s = s.replace(/'/g,"\'");
	*/
	s = s.replace(/&quot;/g,"\"");
	s = s.replace(/<br>/g,"\n");
	return s;
};
/*将字符串中一些特殊符号替换成对应的HTML实体*/
sn.util.htmlEncode = function(str){
	var s = "";
	if(str.length == 0)return "";
	s = str.replace(/\&/g,"&amp;");
	s = s.replace(/</g,"&lt;");
	s = s.replace(/>/g,"&gt;");
	/* 这四种貌似没必要转
	s = s.replace(/\(/g,"&#040;");
	s = s.replace(/\)/g,"&#041;");
	s = s.replace(/ /g,"&nbsp;");
	s = s.replace(/\'/g,"'");
	*/
	s = s.replace(/\"/g,"&quot;");
	return s;
};
sn.util.flickerTip = function(elem, oriOpt, fun) {
    if (!$(elem).length) {
        return;
    }
    //是否在闪动，已经在闪动则退出
    if ($(elem).data('tipping')) {
        return;
    }

    //设置闪动状态
    $(elem).data('tipping', true);

    oriOpt = oriOpt || {};

    var highLightFun, //高亮方法
        unHighLightFun, //取消高亮方法
        defaultOpt = {
            cls: '',			//高亮时的class
            bgColor: '#FDCECE',	//高亮时的背景色, 当颜色与class都有传入时，优先使用背景色
            interval: 300,		//闪动间隔时间
            num: 3				//闪动次数
        },
        opt = $.extend(true, defaultOpt, oriOpt), //生成配置项
        tCount = 0,	//已闪动次数
        oriStatus = {	//dom原始状态
            bgColor: $(elem).css('background-color'),
            cls: $(elem).attr('class')
        };

    //如果传入了背景色 或 背景色与class都没传入 或 生成的配置项中class值为空，则采用背景色高亮方法，否则采用class高亮方法
    if (oriOpt.bgColor || (!oriOpt.bgColor && !oriOpt.cls) || !opt.cls) {
        highLightFun = function () {
            $(elem).css('background-color', opt.bgColor);
        };
        unHighLightFun = function () {
            $(elem).css('background-color', oriStatus.bgColor);
        };
    } else {
        highLightFun = function () {
            $(elem).addClass(opt.cls);
        };
        unHighLightFun = function () {
            $(elem).removeClass(opt.cls);
        };
    }

    var validTip = setInterval(function () {
        //高亮
        highLightFun();
        setTimeout(function () {
            //取消高亮
            unHighLightFun();

            tCount++;
            if (tCount >= opt.num) {
                //闪动结束
                clearInterval(validTip);
                //重设闪动状态
                $(elem).data('tipping', false);
                if (typeof fun == "function") {
                    fun();
                }
            }
        }, opt.interval);
    }, opt.interval * 2);
};

/*解决IE6下页面的min-width无效问题
这个方法只纠正IE6下的问题，所以还要在body上显示的定义min-width属性，属性值与调用方法时传递的参数值要一致 
*/
sn.util.minBodyWidth = function(m_width){
	if(m_width>0){
		$("body").css("min-width",m_width+"px");
		if(sn.browser.isIE6){
			reset_body_width();
			$(window).resize(function(){
				reset_body_width();
			});
		}
	}
	function reset_body_width(){
		if($(window).width() < m_width){
			$("body").css("width",m_width+"px");
		}else{
			$("body").css("width","auto");
		}

	}
};

/* 根据opt配置修正当前页面url后刷新页面方法
   如果opt有效的话，遍历每一个属性，将每一组键(key)值(value)对都做如下处理：
       1、将当前页url中key对应的参数修正为value对应的值，如果对应参数不存在的话则添加key=value的参数信息；
	   2、如果value值不合法，则忽略该键值对；
   
   
 */
sn.util.modifyRefresh = function(opt){
	var url = window.location.href,
		key,
		value,
		delReg,
		editReg = /(\?|&)&/,
		testReg = /\?/;
	
	if(typeof opt === "object" && opt !== null){
		for(key in opt){
			value = String(opt[key]);
			if(value === ""){
				continue;
			}
			delReg = new RegExp("(&|\\?)(" + String(key) + "=[^&]*)");
			url = url.replace(delReg,'$1').replace(editReg,'$1');
			if(testReg.test(url)){
				url  = url + "&";
			}else{
				url  = url + "?";
			}
			url  = url + String(key) + "=" + value;
		}
	}
	window.location.href = url;
};

/**
* 检测是否是合法的email地址
* 
*/
sn.util.isValidEmail = function(email) {
	return /^[a-zA-Z0-9_+.-]+\@([a-zA-Z0-9-]+\.)+[a-zA-Z0-9]{2,4}$/.test(email);
};

/**
* 检测是否是合法的手机号
* 
*/
sn.util.isValidPhone = function(phone) {
	return /^1[3|4|5|8]\d{9}$/.test(phone);
};

/*根据股票代码判断所在交易所代号*/
sn.util.getStkExchange = function(numCode){
	var exchangeCode = "";
	if(/^\d{6}$/.test(numCode)){
		if(numCode.match(/^60/)){
			exchangeCode = "sh";
		}else if(numCode.match(/^00|^300/)){
			exchangeCode = "sz";
		}else{
			exchangeCode = "";
		}
	}else{
		exchangeCode = "";
	}
	return exchangeCode;
};

/**
* 获取给定object的属性值
* 如var obj = {a: {b: {c: 'c'}}};
* var subVal = sn.util.getSubValue(obj, ['a', 'b', 'c']);
* subVal将得到'c'
*/
sn.util.getSubValue = function(obj, keys) {
	if (!obj || typeof obj != 'object') {
		return null;
	}
	if (!$.isArray(keys)) {
		return null;
	}
	
	var value, valueOwner = obj, key;
	do {
		key = keys.shift();
		value = valueOwner[key];
		valueOwner = value;
	} while (keys.length && value != null && typeof value == 'object');
	
	if (keys.length) {
		return null;
	}
	
	return value;
};

/*
 * @author：chengtingting
 * @desc：时间生成时间戳
 * 参数说明：时间字符串
 * 返回：对应的时间戳
 */
sn.util.YMDtoUTC = function(val) {
	var y = val.substring(0, 4),
	m = val.substring(4, 6) - 1,
	d = val.substring(6, 8);
	return Date.UTC(y, m, d);
};

/*
 * @author：chengtingting
 * @desc：时间戳转成时间格式
 * 参数说明：时间字符串，flag（true：用-风割年月日，false：不分割）
 * 返回：对应的时间戳
 */
sn.util.getYMD = function(utc,flag,isDay){
	var date = new Date(+utc),
	    year = add0Before(date.getFullYear()),
	    month = add0Before(date.getMonth() + 1),
	    day = add0Before(date.getDate()),
	    hour = add0Before(date.getHours()),
	    minute = add0Before(date.getMinutes());
	if(isDay){
		return hour +':'+ minute;
	}
    if (flag) {
        return year + '-' + month + '-' + day; 
    } else {
        return year + '' + month + '' + day;
    }
    function add0Before(val) {
	    var res = +val;
	    if (res < 10) {
	        res = '0' + res;
	    } else {
	        res = val + '';
	    }
	    return  res;
	}
};

/*
 * @author：chengtingting
 * @desc：按字节数分割字符串
 * 参数说明：分割位置，字符串
 * 返回：
		字符串字节数大于风割位置，当前位置
		············小于········，false
 */
sn.util.splitStr = function(num,str){
	var reg = /[\u4e00-\u9fa5]/;
	for(var i=0,ilen=str.length; i<ilen; i++){
		if(reg.test(str.charAt(i))){
			num -= 2;
		}else{
			num--;
		}
		if(num <= 0){
			return i;
		}
	}
	return false;
};

/**
* Created on 2013-12-24.
* @author: YangWu@myhexin.com
* @desc: 检查数据中是否存在特定元素
* 
* @param {mixed} fn
* fn为需要查找的元素或是一个判断方法, 当fn为方法时，参数为：
* @param {mixed} fn.item 数组arr中的元素
* @param {interger} fn.i 数组arr中元素的索引
*
* @param {Array} arr 要查找的数组
* @param {interger} i 最小索引值，从此开始查找，默认为0
*/
sn.util.inArray = function(fn, arr, i) {
	if (!$.isFunction(fn)) {
		return $.inArray.apply($, arguments);
	}
	
	var len;
	
	if (arr) {
		len = arr.length;
		i = i ? i < 0 ? Math.max( 0, len + i ) : i : 0;

		for ( ; i < len; i++ ) {
			var o = arr[i];
			// Skip accessing in sparse arrays
			if (i in arr && fn.call(o, o, i) === true) {
				return i;
			}
		}
	}

	return -1;
};

/*维持init.js中初始化的sn.mouseInfo信息*/
sn.util.SetMousePosition = function(){
	if(typeof sn === "object" && sn !== null && typeof sn.mouseInfoFlag !== "undefined" && sn.mouseInfoFlag !== true){
		sn.mouseInfoFlag = true;
		$(document).mousemove(function(e){
			sn.mouseInfo.page.x = e.pageX;
			sn.mouseInfo.page.y = e.pageY;
			sn.mouseInfo.client.x = e.clientX;
			sn.mouseInfo.client.y = e.clientY;
		});
	}
	
};

sn.util.screenShowLog = function(opt){
	var s_w,s_h,c_url,field,category;
	s_w = screen.width;
	s_h = screen.height;
	c_url = document.URL;
	if(opt && opt.category){
		category = opt.category;
	}else{
		category = "";
	}
	field = "screenwidth|"+s_w+"、screenheight|"+s_h+"、CurrentUrl|"+c_url+"、category|"+category;
	if(typeof mylog === 'function'){
		mylog(field,"display","");
	}
};

/**
* 渐隐提示框封装
*   简化参数，固定样式
* 
* @param msg    提示信息
* @param targetElem 提示框提示的目标元素
* @param type   提示类型，可选
* @param options    额外参数，可选
* 
* @returns {sn.plugin.tip}
*/
sn.util.fadeOutHint = function(msg, targetElem, type, options) {
    var cls, contentCls;
    
    switch(type) {
        case 'error': 
            cls = ['popup_tip_red', 'tiny_tip_red'];
            contentCls = 'Red';
            break;
        case 'warning': 
            cls = ['popup_tip_orange', 'tiny_tip_orange'];
            contentCls = 'OrangeF6';
            break;
        case 'success': 
        default: 
            cls = ['popup_tip_green', 'tiny_tip_green'];
            contentCls = 'GreenC';
    }
    
    var newOptions = $.extend(true, {
        cls: cls,
        content: '<span class="' + contentCls + '">' + msg +'</span>',
        target: {
            disable: false,
            elem: targetElem,
            offset: [0, -28],
            position: ['left', 'top']
        },
        anchor: false,
        autoHide: 0,
        destoryAfterClose: true
    }, typeof options == 'undefined' ? {} : options);
    
    var hintBox = new sn.plugin.tip(newOptions);
    hintBox.main(true);
    setTimeout(function() {
        hintBox.fadeOut('slow');
    }, 3000);
    
    return hintBox;
};

/**
* 确认框封装
*   简化参数，固定样式
* 
* @param text   提示文本
* @param extraText  提示内容详情，可选
* @param onOk   点击确定按钮时的回调函数，可选
* @param onCancel   点击取消按钮时的回调函数，可选
* @param options    额外参数，可选
* 
* @returns {sn.plugin.popupConfirm}
*/
sn.util.confirmBox = function(text, extraText, onOk, onCancel, options) {
    var newOptions = $.extend(true, {
        titleBar: {
            closeIcon: {
                cls: ['icon16', 'icon16_close', 'icon16_close_smaller']
            }
        },
        cls: ['popup_confirm_blue'],
        text: text,
        iconCls: ['icon16', 'icon16_i_yellow'],
        extraText: extraText,
        okBtn: {
            cls: ['btn', 'blueBtn', 'btn_ib', 'pl10', 'pr10']
        },
        cancelBtn: {
            cls: ['btn', 'blueBtn', 'btn_ib', 'pl10', 'pr10']
        },
        onOk: onOk,
        onCancel: onCancel
    }, typeof options == 'undefined' ? {} : options);
    
    var popupConfirm = new sn.plugin.popupConfirm(newOptions);
    popupConfirm.main(true);
    
    return popupConfirm;
};

/**
* 消息框封装
*   简化参数，固定样式
* 
* @param text   提示消息
* @param extraText  提示消息详情，可选
* @param type   消息类型，可选
* @param onOk   消息框关闭时回调函数，可选
* 
* @returns {sn.plugin.popupMessage}
*/
sn.util.messageBox = function(text, extraText, type, onOk) {
    if (!text) {
        return;
    }
    
    var iconCls;
    switch(type) {
        case 'success': 
            iconCls = 'icon16_right';
            break;
        case 'error': 
            iconCls = 'icon16_wrong';
            break;
        case 'info': 
            iconCls = 'icon16_i_blue';
            break;
        case 'question': 
            iconCls = 'icon16_question_blue';
            break;
        case 'warning': 
        default: 
            iconCls = 'icon16_i_yellow';
    }
    
    var popupMessage = new sn.plugin.popupMessage({
        titleBar: {
            closeIcon: {
                cls: ['icon16', 'icon16_close', 'icon16_close_smaller']
            }
        },
        cls: ['popup_message_blue'],
        text: text,
        extraText: extraText,
        iconCls: ['icon16', iconCls],
        okBtn: {
            cls: ['btn', 'blueBtn', 'btn_ib', 'pl10', 'pr10']
        },
        onOk: onOk
    });
    popupMessage.main(true);
    
    return popupMessage;
};

sn.util.calcQueryType = function(str){
	var q_str = '';
	if(typeof str != "string"){
		q_str = qinfo.queryType;
	}else{
		q_str = str;
	}
	q_str = q_str.toLowerCase();
	if($.inArray(q_str,["fund","fund_manager"]) != -1){
		return "fund";
	}else{
		return "";
	}
};

// (hover);(focus、blur);时dom样式切换，
// 支持3中参数格式：
// 					⑴ eventType,$dom,className 
// 					⑵ [eventType,$dom,className]
// 					⑶ [[eventType,$dom,className],[eventType,$dom,className]]
// eventType为（hover/focus）
sn.util.eventStyle = function(arg1,arg2,arg3){
	if(arg1 instanceof Array){
		if(arg1[0] instanceof Array){
			for(var i=0,ilen=arg1.length; i<ilen; i++){
				singleEvent(arg1[i][0],arg1[i][1],arg1[i][2])
			}
		}else{
			singleEvent(arg1[0],arg1[1],arg1[2]);
		}
	}else{
		singleEvent(arg1,arg2,arg3);
	}
	function singleEvent(eventType,$dom,className){
		if($dom && $dom.length > 0){
			switch(eventType){
				case 'focus':
					if(typeof $dom === 'string'){
						$('body').on('focus', $dom, function(){
							$(this).addClass(className);
						});
						$('body').on('blur', $dom, function(){
							$(this).removeClass(className);
						});
					}else{
						$dom.focus(function(){
							$(this).addClass(className);
						});
						$dom.blur(function(){
							$(this).removeClass(className);
						});
					}
					break;
				default:
					if(typeof $dom === 'string'){
						$('body').on('mouseenter', $dom, function(){
							$(this).addClass(className);
						});
						$('body').on('mouseleave', $dom, function(){
							$(this).removeClass(className);
						});
					}else{
						$dom.hover(function(){
							$(this).addClass(className);
						},function(){
							$(this).removeClass(className);
						});
					}
					
			}
		}
	}
};

/*将光标移动到指定输入区域的指定位置
 *可以是jQuery或DOM元素，位置默认值是最后
 */
sn.util.setCursorPosition = function(elem,pos){
	var elemDOM,
		cursorPos,
		elemValue,
		len;
	/*第一个参数可以是jQuery或DOM元素*/
	if(typeof elem === "object" && elem !== null && elem.jquery){
		elemDOM = elem[0];
	}else{
		elemDOM = elem;
	}
	
	/*计算出光标要定位到的位置，默认为最后方*/
	elemValue = elemDOM.value;
	len = elemValue.length;
	if(typeof pos === "undefined"){
		cursorPos = len;
	}else{
		cursorPos = len >= pos ? pos : (pos%len);
	}
	
	/*根据浏览器环境不同，将光标移动到指定元素的指定位置*/
	 if(elemDOM.setSelectionRange){
        setTimeout(function(){
            elemDOM.setSelectionRange(cursorPos, cursorPos);
            elemDOM.focus();
        }, 0);
    }else if(elemDOM.createTextRange){
        var rng = elemDOM.createTextRange();
        rng.move('character', cursorPos);
        rng.select();
    }
};

/* 获取域名配置信息
 * 此方法依赖全局JS变量-domainCfg，如果没有初始化此变量则使用默认配置对象
 */
sn.util.getDomainCfg = function(name){
	var defaultDomainCfg = {
		key : "10jqka",						//配置信息标识
		domain : "search.10jqka.com.cn",	//域名
		record : "浙B2-20080207",			//备案号
		siteName : "问财财经搜索",			//站点名称
		siteNameShort : "问财",				//站点简称
		showAboutUs : 0,					//是否显示关于我们
		loginAdd : "upass.10jqka.com.cn"		//登录地址
	};
	var dCfg = $.extend(true,{},defaultDomainCfg,(typeof domainCfg === "object" && domainCfg !== null ? domainCfg : {}));
	if(typeof name === "string"){
		return dCfg[name];
	}else{
		return dCfg;
	}
};

/**
 * 将时间戳转换为特定的格式
 * @param {Number} date
 * @param {String} formantStr
 * @returns {String}
 */
sn.util.dateFormat = function(date, formantStr){
	formantStr = formantStr || 'Y-m-d H:i:s';
	var timestamp = new Date(date * 1e3),
		format_arr = {Y: 'FullYear', m: 'Month', d: 'Date', H: 'Hours', i: 'Minutes', s: 'Seconds'},
		formatInteger = function (num, length) {
			return (num / Math.pow(10, length)).toFixed(length).substr(2);
		},
		f_replace = function(a) {

			var func = 'get' + format_arr[a];
			if(!$.isFunction( timestamp[func] )) return 0;
			var val = +timestamp[func](),
				num = a.toLowerCase() == 'm' ? val + 1 : val;
			return a == 'Y' ? num : formatInteger(num, 2);
		};
	if(+date == 2147443200 || +date == 0){
		return '';
	}
	return formantStr.replace(/[a-z]/ig, f_replace);
};

/**
 * 将url形式的参数解析为一个对象
 * @dependon lib/php.default.min.js
 * @params {string} str
 * @params {object} [parsed={}] return object
 * @returns {object}
 */
sn.util.parseStr = function(str, parsed) {
    var args = Array.prototype.slice.call(arguments, 0, arguments.length);
    if (typeof args[1] != 'object') {
        args[1] = {};
    }
    if (str != '') {
        parse_str.apply(this, args);
    }

    return args[1];
};
sn.util.renderTemplate = function(template, data){
	return template.replace(/\{\$([\w\.]*)\}/g, function (str, key){
		var keys = key.split("."),
			value = data[keys.shift()];
		$.each(keys, function () {
			value = value[this];
		});
		return (value === null || value === undefined) ? "" : value;
	});
};

sn.util.fixedNum = function(num,fixNum){
	if(typeof fixNum !== "number"){
		fixNum = 2;
	}
	var Num = new Number(num);
	return Num.toFixed(fixNum);
};

/**
 * 基于函数的模板引擎
 * @param {Function} fun
 */
sn.util.funTplEngin = function(fun) {
	this.fun = fun;
	this.fetch = function() {
		return fun.apply(this, arguments);
	};
};

/**
 * 将html特殊字符转义
 * @param {String} string
 * @returns {String}
 */
sn.util.htmlspecialchars = function(string)
{
	var histogram = {
		'&': '&amp;',
		'"': '&quot;',
		//'\'': '&#039;',
		'<': '&lt;',
		'>': '&gt;'
	}, symbol, tmp_str, entity;
	tmp_str = string.toString();

	for (symbol in histogram) {
		if (!histogram.hasOwnProperty(symbol)) {
			continue;
		}
		entity = histogram[symbol];
		tmp_str = tmp_str.split(symbol).join(entity);
	}

	return tmp_str;
};

/**
 * 按宽度截取字符串
 * 两个半角字符算作一个全角字符
 * @param {String} $string
 * @param {Number} $length
 * @param {String} $etc
 * @returns {String}
 */
sn.util.w_truncate = function($string, $length, $etc) {
	$length = $length || 80;
	$etc = $etc || '…';

	if (typeof $string != 'string') {
		if (typeof $string == 'undefined' || $string == null) {
			return '';
		}
		return $string + '';
	}

	if ($length == 0) {
		return '';
	}

	if ($string.length > $length) {
		$length *= 2;

		var $i, $cha;

		var $etcLen = $etc.length;
		var $etcWid = 0;
		for ($i = 0; $i < $etcLen; $i++) {
			$cha = $etc.slice($i, $i + 1);
			if ($cha) {
				if (new RegExp("^[\\u007f-\\uffff]+$").test($cha)) {
					$etcWid += 2;
				} else {
					$etcWid++;
				}
			}
		}

		var $strLen = $string.length;
		var $strWid = 0;
		var $subLen = $length;
		var $addEtc = false;
		for ($i = 0; $i < $strLen; $i++) {
			$cha = $string.slice($i, $i + 1);
			if ($cha != '') {
				if (new RegExp("^[\\u007f-\\uffff]+$").test($cha)) {
					$strWid += 2;
				} else {
					$strWid++;
				}

				if ($strWid + $etcWid > $length) {
					$subLen = $i;
					$addEtc = true;
					break;
				} else if ($strWid + $etcWid == $length) {
					$subLen = $i + 1;
					if ($subLen < $strLen) {
						$addEtc = true;
					}
					break;
				}
			}
		}

		return $string.slice(0, $subLen) + ($addEtc ? $etc : '');
	} else {
		return $string;
	}
};

/**
 * 获取模板引擎
 * @param {String} enginType
 * @param {String,Function} tpl
 * @returns {sn.util.funTplEngin,jSmart}
 */
sn.util.getTplEngin = function(enginType, tpl) {
	var engin;

	switch (enginType) {
		case 'FUNCTION':
			engin = new sn.util.funTplEngin(tpl);
			break;
		case 'JSMART':
		default:
			engin = new jSmart(tpl);
			break;
	}

	return engin;
};

/* 公共的显示提意见方法,opt的详细说明参考sn.block.advisePanel模块的注释
补充说明：
	1、此方法只适用于面板相对于正常文档流的元素定位时使用，当参考元素脱离正常文档流时慎用此方法，参考元素是fixed效果时禁用此方法；
	2、不适用此方法时考虑单独初始化一个sn.block.advisePanel模块；

参数说明：
opt:{
	
	callback:
}
 */
sn.util.showAdvisePanel = function(){
	var panel = null;
	return function(opt){
		if(typeof sn.block.advisePanel === "function"){
			if(panel === null){
				panel = new sn.block.advisePanel();
			}
			// main方法就是此模块换场景调用的入口方法
			panel.main(opt);
		}
	};
}();

/*文档宽度化和窗口宽度变化、高度变化三个自定义事件*/
(function(){
	var winWidth = $(window).width(),
		docWidth = $("html").width(),
		winHeight = $(window).height();
		
	$(window).on("resize",function(){
		var newWinWidth = $(window).width(),
			newDocWidth = $("html").width(),
			newWinHeight = $(window).height();
		//窗口宽度变化事件识别、触发
		if(newWinWidth !== winWidth){
			winWidth = newWinWidth;
			$(window).trigger("winXResize");
		}
		
		//窗口高度变化事件识别、触发
		if(newWinHeight !== winHeight){
			winHeight = newWinHeight;
			$(window).trigger("winYResize");
		}
		
		//文档宽度变化事件识别、触发
		if(newDocWidth !== docWidth){
			docWidth = newDocWidth;
			$(window).trigger("docXResize");
		}
	});
})();
