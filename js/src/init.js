"use strict"
var rt = rt || {};
rt.page = {};


var sn = sn || {};
sn.util = {};

sn.plugin = {};

sn.plugin.form = {};

sn.page = {};

sn.block = {};
sn.afterSync = sn.afterSync || {};

var sp = sp || {};
sp.afterLoginRender = sp.afterLoginRender || {};

//表示鼠标位置信息监听是否已经开启的标识,避免重复监听
sn.mouseInfoFlag = false;
//通过sn.util.SetMousePosition方法维持的一个全局鼠标位置信息对象
sn.mouseInfo = {
	page:{
		x:0,
		y:0
	},
	client:{
		x:0,
		y:0
	}
};

sn.stockHangqingIndexArr = ["MACD","KDJ","RSI","BOLL","OBV","CCI","PSY","WVAD"];

sn.browser = {
	userAgent: navigator.userAgent.toLowerCase(),
	addEventListener: !!window.addEventListener,		//浏览器是否支持addEventListener
    touch: ('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch	//浏览器是否支持触屏事件
};

(function() {
    var check = function(regex){
            return regex.test(sn.browser.userAgent);
        },
        isStrict = document.compatMode == "CSS1Compat",
        version = function (is, regex) {
            var m;
            return (is && (m = regex.exec(sn.browser.userAgent))) ? parseFloat(m[1]) : 0;
        },
        docMode = document.documentMode,
        isOpera = check(/opera/),
        isChrome = check(/\bchrome\b/),
        isWebKit = check(/webkit/),
        isSafari = !isChrome && check(/safari/),
		isEdge = check(/edge/),
        isIE = !isOpera && check(/msie/),	//此种判断已经不彻底了，IE11的userAgent信息中已经没有msie了，后边有对应的修复逻辑
        isIE7 = isIE && ((check(/msie 7/) && docMode != 8 && docMode != 9 && docMode != 10) || docMode == 7),
        isIE8 = isIE && ((check(/msie 8/) && docMode != 7 && docMode != 9 && docMode != 10) || docMode == 8),
        isIE9 = isIE && ((check(/msie 9/) && docMode != 7 && docMode != 8 && docMode != 10) || docMode == 9),
		isIE10 = isIE && ((check(/msie 10/) && docMode != 7 && docMode != 8 && docMode != 9) || docMode == 10),
		isIE11 = sn.browser.userAgent.indexOf("trident") > -1 && navigator.userAgent.indexOf("rv") > -1,
		// isIE6 = isIE && check(/msie 6/),
        isIE6 = !!window.ActiveXObject && !window.XMLHttpRequest,
        isGecko = !isWebKit && check(/gecko/),
        isWindows = check(/windows|win32/),
        isMac = check(/macintosh|mac os x/),
        isLinux = check(/linux/),
        chromeVersion = version(true, /\bchrome\/(\d+\.\d+)/),
        firefoxVersion = version(true, /\bfirefox\/(\d+\.\d+)/),
        ieVersion = version(isIE, /msie (\d+\.\d+)/),
        operaVersion = version(isOpera, /version\/(\d+\.\d+)/),
        safariVersion = version(isSafari, /version\/(\d+\.\d+)/),
        webKitVersion = version(isWebKit, /webkit\/(\d+\.\d+)/),
        isSecure = /^https/i.test(window.location.protocol);
	// IE11可以单独判断；Edge中模拟的ie11 documentMode是undefined;原始的IE11 documentMode是11; 结合这些点IE家族的嗅探做了一些修正
	if(isIE11){
		isIE = true;
		ieVersion = 11;
	}
    
    $.extend(sn.browser, {
        isStrict: isStrict,
        isChrome: isChrome,
        isWebKit: isWebKit,
        isSafari: isSafari,
        isIE: isIE,
        isIE7: isIE7,
        isIE8: isIE8,
        isIE9: isIE9,
		isIE10: isIE10,
		isIE11: isIE11,
        isIE6: isIE6,
		isEdge: isEdge,
        isGecko: isGecko,
        isWindows: isWindows,
        isMac: isMac,
        isLinux: isLinux,
        chromeVersion: chromeVersion,
        firefoxVersion: firefoxVersion,
        ieVersion: ieVersion,
        operaVersion: operaVersion,
        safariVersion: safariVersion,
        webKitVersion: webKitVersion,
        isSecure: isSecure
    })
}());

// ctrlMgr 定义了自定义控件的开发接口，同时作为管理所有自定义控件
sn.ctrlMgr = function(){
	
	this.meta = {
		'decimal': {
			'className': 'blk_decimal', // 控件所对应的HTML标签 CLASS 名
			'handler': 'sn.plugin.form.Decimal', // 控件所对应处理器类，main 函数有且只有两个参数：wrap, options
			'attr': ['precision'] // 控件自定义配置属性列表
		},
		'date': {
			'className': 'blk_date',
			'handler': 'sn.plugin.form.Date',
			'attr': ['format', 'lower', 'upper']
		},
		'date_range': {
			'className': 'blk_daterange',
			'handler': 'sn.plugin.form.DateRange',
			'attr': ['format', 'lower', 'upper']
		},
		'stock': {
			'className': 'blk_stock',
			'handler': 'sn.plugin.form.Stock',
			'attr': ['service','type','maxResultNum','fill']
		},
		'text':{
			'className': 'blk_text',
			'handler': 'sn.plugin.form.Text',
			'attr': ['placeholder']
		},
		'list':{
			'className': 'blk_list',
			'handler': 'sn.plugin.form.List',
			'attr':['service','refer','referId', 'hiddenCls']
		},
		'check':{
			'className': 'blk_check',
			'handler': 'sn.plugin.form.Check',
			'attr': []
		}
	};
};

sn.ctrlMgr.prototype.main = function() {
	
	var self = this;
	
	$(function(){ self.produce(); });
	
	return self;
};

sn.ctrlMgr.prototype.produce = function(wrap) {
	var self = this;
	
	for ( var type in self.meta ) {
		var typeMeta = self.meta[type];
		
		if (typeof wrap == 'undefined') {
			var targets = $('.' + typeMeta.className);
		} else {
			var targets = $('.' + typeMeta.className, $(wrap));
		}
		
		for ( var i = 0; i < targets.length; i++ ) {

			
			var target = $(targets[i]);
			
			var options = {};
			
			for ( var j = 0; j < typeMeta.attr.length; j++ ) {
				
				var attrKey = typeMeta.attr[j];
				var attrVal = target.attr(attrKey);
				
				if ( attrVal !== undefined ) {
					
					options[attrKey] = attrVal;
				}
			}
			
			var constructorName = typeMeta.handler.split('.').pop();
			constructorName = constructorName.slice(0, 1).toLowerCase() + constructorName.slice(1);
			try {
				eval('new ' + typeMeta.handler + '().' + constructorName + '(target, options)');
				
			} catch (e) {
				
				// console.log(e.message);
			}
		}
	}
	
	return self;
};

$(window).load(function(){
	window.ctrlMgr = new sn.ctrlMgr().main();
});