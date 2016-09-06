/*
 
 !!!翻页时的callback回调函数传入的参数目前是三个，一定不能再追加了，追加的话选股结果表格插件的排序参数传递逻辑就会被挤出，会出大乱子····
 
 * Creat on 2013.3.26
 * @author: chengricheng
 * @depends: jQuery.js
 * @desc: 分页器，可用于异步分页，也可用于同步分页
 * @参数说明:
 * wrap: 外部容器
 * totalPages: 总页数
 * currentPage: 当前页面
 * showPages: 显示多少页
 * perpage:可选参数，每页数量，默认值是10
 * callback: 点击分页后的回调函数
 * @案例:
 * $.pagination(self.pg1, '/data.php', {}, $.proxy(self, 'renderAmw'));
 *补充：当前页码保存在self.current属性中，从1开始
 
 
 !!!翻页时的callback回调函数传入的参数目前是三个，一定不能再追加了，追加的话选股结果表格插件的排序参数传递逻辑就会被挤出，会出大乱子····
 */
sn.plugin.pagination = function() {
	
	this.id = null;
	this.templ = null;
	
	this.wrap = null;
	this.me = null;
	this.first = null;
	this.previous = null;
	this.next = null;
	this.last = null;
	this.per = null;
	
	this.current = NaN;
	this.totalPages = NaN;
	this.callback = null;
	
};

/*
opt:{
	wrap: 外部容器
	perpage:可选参数，每页数量，默认值是10
	totalPages:总页数
	showPages:显示页码数，超过则会有省略逻辑
	startPage:起始页码
	gotoPage:是否有页码下拉列表，同时也是该下拉列表的初始值，但是不一定是分页条的起始页码(startPage)
	callback:翻页时触发的回调函数，会传入几个现场参数
}
 */
sn.plugin.pagination.prototype.main = function(opt){
	var self = this;
	
	self.opt = opt;
	self.perpage =  typeof opt.perpage === "number" ? opt.perpage : false;
	
	self.wrap = self.opt.wrap;
	self.totalPages = self.opt.totalPages;
	self.showPages = self.opt.showPages;
	self.gotoPage = self.opt.gotoPage;
	self.id = "ID" + Math.random().toString().split('.')[1].substring(0, 14);
	self.callback = self.opt.callback;

	self.setpage(self.opt.startPage);
};
sn.plugin.pagination.prototype.setpage = function(current){
	var self = this,
		perHtml = '',
		end = self.totalPages-1 > self.showPages ? self.showPages : self.totalPages-1,
		middle = Math.floor(self.showPages/2),
		start = 2,
		currentC = '',
		firstC = '',
		lastC = '',
		hasLog = false;

	//当前页码纠错与存储
	if(typeof current === "number" && current > 0){
		current = current > self.totalPages ? self.totalPages : current;
	}else{
		current = 1;
	}
	self.current = current;
	
	if(current > middle){
		if(current+middle < self.totalPages){		//后面还有显示页数的一半
			start = (current-middle)>2 ? (current-middle) : 2;
			end = current+middle;
		}else{									//后面不够显示页数的一半
			start = (self.totalPages-self.showPages+1)>2 ? (self.totalPages-self.showPages+1) : 2;
			end = self.totalPages-1;
		}
	}


	currentC = current===1 ? 'current' : '';
	perHtml = '<a href="javascript:;" class="num '+ currentC +'">'+ 1 +'</a>';
	perHtml += (self.totalPages>self.showPages+2 && (1+middle)<current) ? '  ... ' : '';
	for ( var i = start; i <= end; i++ ) {
		currentC = '';
		if(current === i){
			currentC = 'current';
		}
		perHtml += '<a href="javascript:;" class="num '+ currentC +'">'+ i +'</a>';
	}
	currentC = current===self.totalPages ? 'current' : '';
	perHtml += (self.totalPages>self.showPages+2 && (current+middle)<self.totalPages) ? ' ... ' : '';
	perHtml += '<a href="javascript:;" class="num '+ currentC +'">'+ self.totalPages +'</a>';

	if(current == 1){
		firstC = 'disable disable_previous';
	}
	if(current == self.totalPages){
		lastC = 'disable disable_next';
	}

	self.templ = '<div id="' + self.id + '" class="pagination">' +
		  
			'<a class="previous '+ firstC +'" href="javascript:;" id="previous">上页</a>' +
			perHtml +
			'<a class="next '+ lastC +'" href="javascript:;" id="next">下页</a>'+
			'<span class="total">共'+ self.totalPages +'页</span>';
		
	if(self.totalPages>self.showPages && self.gotoPage){
		self.templ +='去第<input class="gotoPage" type="text" value="'+ self.gotoPage +'"/><span class="goto">确定</span>页';
	}
	self.templ += '</div>';
	self.wrap.html(self.templ);

	self.me = $('#' + self.id);
	
	self.first = self.me.find('#first');
	self.previous = self.me.find('#previous');
	self.next = self.me.find('#next');
	self.last = self.me.find('#last');
	self.per = self.me.find('.num');
	self.previous.click(function(){
		if(!self.previous.hasClass('disable')){
			var currentPage = parseInt(self.per.filter('.current').text());
			if(typeof self.callback === 'function'){
				self.callback([[currentPage-1,self.perpage,self],function(){
					self.setpage(currentPage-1,currentPage);
				}]);
			}else{
				self.setpage(currentPage-1,currentPage);
			}
		}else{
			return;
		}
	});
	
	self.next.click(function(){
		if(!self.next.hasClass('disable')){
			var currentPage = parseInt(self.per.filter('.current').text());
			if(typeof self.callback === 'function'){
				self.callback([[currentPage+1,self.perpage,self],function(){
					self.setpage(currentPage+1,currentPage);
				}]);
			}else{
				self.setpage(currentPage+1,currentPage);
			}
		}else{
			return;
		}
	});
	self.per.click(function(){
		var $this = $(this);
		if(!$this.hasClass('current')){
			var currentPage = parseInt($this.text());
			if(typeof self.callback === 'function'){
				self.callback([[currentPage,self.perpage,self],function(){
					self.setpage(currentPage,parseInt(self.per.filter('.current').text()));
				}]);
			}else{
				self.setpage(currentPage,parseInt(self.per.filter('.current').text()));
			}
		}else{
			return;
		}
	});
};