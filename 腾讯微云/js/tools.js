var wTools = (function(){

	var toolsObj = {

		$: function (selector,context){
			context = context || document;
			var firstChar = selector.charAt(0);
			if( firstChar == "#" ){
				return document.getElementById(selector.substring(1));
			} else if ( firstChar == "." ){
				return context.getElementsByClassName(selector.substring(1));
			} else {
				return context.getElementsByTagName(selector);
			}
		},

		getStyle: function (obj,attr) {
			return obj.currentStyle ? obj.currentStyle[attr]:getComputedStyle(obj)[attr];
		},

		futurefun: function (timeStr){
			var now = new Date();
			var future = new Date(timeStr);

			var time = (future.getTime() - now.getTime())/1000;

			var Day = Math.floor(time/86400);
			var Hour = Math.floor(time%86400/3600);
			var Minute = Math.floor(time%86400%3600/60);
			var Second = Math.floor(time%60);
			var onOff = true;
			if( time <= 0 ) onOff = false;
			var json = {
				D:Day,
				H:Hour,
				Min:Minute,
				S:Second,
				onOff:onOff,
			}
			return json;
		},

		AddZo: function (m){
			if(m<0) return m;
			if( m >= 10 ){
				return m;
			}else{
				return '0' + m;
			}
		},

		insertAfter: function (newElement,targetElement){ //newElement为插入的新节点，targetElement为插入到谁后边的目标节点
			
			var parent = targetElement.parentNode; // 先获取到目标节点的父级
			if( parent.lastChild == targetElement ){  // 如果目标节点是父级的最后一个元素，就调用appendChild方法
				parent.appendChild(newElement);    
			} else {  // 否则调用insertBefore方法，把新节点插入到目标元素下一个节点的前面
				parent.insertBefore(newElement,targetElement.nextSibling);
			}
		},

		hasClass: function (element,classNames){ // 传入两个参数，要查找element下面的class有没有className的类名
			var allClass = element.className.split(" "); // 分割成数组
			for( var i = 0; i < allClass.length; i++ ){  // 循环遍历
				if( allClass[i] === classNames ){  // 有的话返回true
					return true; 
				}
			}
			return false;  // 没有的话返回false
		},

		addClass: function (element,classNames){
			var classAll = element.className;
			if( !wTools.hasClass(element,classNames) ){
				if( classAll.trim() === "" ){
					element.className = classNames;
					return;
				}
				element.className += " " + classNames;
			}
		},

		removeClass: function (element,classNames){
			var classAll = element.className.split(" ");
			if( wTools.hasClass(element,classNames) ){	
				for( var i = 0; i < classAll.length; i++ ){
					if( classAll[i] === classNames ){
						classAll.splice(i,1);
						i--;
					}
				}	
			}
			element.className = classAll.join(" ");

			if( classAll.length === 0 ){
				element.removeAttribute("class");
			}
		},

		toggleClass: function (element,classNames){
			if( !wTools.hasClass(element,classNames) ){
				wTools.addClass(element,classNames);
				return true;
			} else {
				wTools.removeClass(element,classNames);
				return false;
			}
		},

		getScroll: function (){
			return {
				T: document.documentElement.scrollTop || document.body.scrollTop,
				L: document.documentElement.scrollLeft || document.body.scrollLeft
			}
		},

		getWin: function (){
			return {
				W: document.documentElement.clientWidth, 
				H: document.documentElement.clientHeight
			}
		},

		barWidth: function (){
			var newDiv = document.createElement("div");
			newDiv.style.overflowY = "scroll";
			document.body.appendChild(newDiv);
			var w = newDiv.offsetWidth - newDiv.clientWidth;
			document.body.removeChild(newDiv);
			return w;	
		},

		getRect: function (obj){
	        return obj.getBoundingClientRect();
	    },

	    isCollide: function (obj1,obj2){
	        var obj1Info = wTools.getRect(obj1);
	        var obj2Info = wTools.getRect(obj2);

	        var obj1L = obj1Info.left;
	        var obj1R = obj1Info.right;
	        var obj1T = obj1Info.top;
	        var obj1B = obj1Info.bottom;

	        var obj2L = obj2Info.left;
	        var obj2R = obj2Info.right;
	        var obj2T = obj2Info.top;
	        var obj2B = obj2Info.bottom;
	        if( obj1R < obj2L || obj1L > obj2R || obj1B < obj2T || obj1T > obj2B ){
	            return false;
	        } else {
	            return true;
	        }
	    },

	    addEvent: function (obj,evName,fnName){
	    	obj.addEventListener(evName,fnName,false);
	    },

	    removeEvent: function (obj,evName,fnName){
	    	obj.removeEventListener(evName,fnName,false);
	    },

	    mouseWheel: function (element,upFn,downFn){

	    	element.onmousewheel = wheelFn;
			if( element.addEventListener ){
				element.addEventListener("DOMMouseScroll",wheelFn,false);
			}

			function wheelFn(ev){
				var direction = true;
				if(ev.wheelDelta){  //ie和chrome
					direction = ev.wheelDelta > 0 ? true : false;
				}else if(ev.detail){ //FF
					direction = ev.detail < 0 ? true : false;
				}

				if( direction ){  //向上
					typeof upFn === "function" && upFn.call(element,ev);
					//将upFn中的this指向从window该为element
				}else{  //向下
					typeof downFn === "function" && downFn.call(element,ev);
					//将downFn中的this指向从window该为element
				}

				ev.preventDefault();
			}
	    },

	    parents:function (element,selector){

			var first = selector.charAt();
			//怎么判断是doucment

			if( first === "#" ){
				selector = selector.slice(1); 
				while(element.nodeType != 9 && element.id != selector){  //当前这个元素的id不为box
					element = element.parentNode;
				}
			}else if(first === "."){
				selector = selector.slice(1); 
				while(element.nodeType != 9 && !wTools.hasClass(element,selector)){  //当前这个元素的id不为box
					element = element.parentNode;
				}
			}else {
				while(element.nodeType != 9 && element.nodeName.toLowerCase() != selector){  //当前这个元素的id不为box
					element = element.parentNode;
				}
			}

			return element.nodeType === 9 ? null : element;
		},

		getTreeById:function (classNames,id,parents){
		   var classElement = wTools.$("."+classNames,parents);
		   for( var i = 0; i < classElement.length; i++ ){
		     if( classElement[i].dataset.fileId == id ){
		        return  classElement[i];
		     }
		   }
		   return null;
		},

		uuid:function (){
			return new Date().getTime();
		}
	}

	return toolsObj;

})()
