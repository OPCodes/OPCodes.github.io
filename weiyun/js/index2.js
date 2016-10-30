/*  自执行函数，保护私有变量，不受外界变量的影响 */
(function(){
	/* (1) 渲染页面，将data渲染到页面上 */
	// 创建返回一个拼接好的div
	function createDiv(id,text){
		var newDiv = document.createElement("div"); // 新建div
		newDiv.className = "list_wrap";
		newDiv.setAttribute("data_file_id",id);
		// 给每一个文件夹添加一个自定义属性，属性值为对应的id值
		// 以便找到它的下一层元素
		newDiv.innerHTML = '<div class="list">'
	        +'<label class="ck_box"></label>'
	        +'<span class="img">'
	            +'<i class="filetype ico-folder"></i>'
	        +'</span>'
	        +'<span class="name">'
	            +'<p class="text">'
	                +'<em>'
	                   	+'<span style="display:'+(text?"block":"none")+';" '
	                   	+'title="'+(text?text:"")+'" class="titlename">'
	                   	+(text?text:"")+'</span>'
	                    +'<span style="display:'+(text?"none":"block")+';" '
	                    +'class="fileedit">'
	                        +'<input class="filename" type="text">'
	                    +'</span>'
	                +'</em>'
	            +'</p>'
	        +'</span>'
	    +'</div>';
	    return newDiv;  // 生成一个拼接好的div返回出去
	}

	// 添加事件函数，在生成div的时候，给创建的div添加时间处理函数
	function addEvent(obj){   // 给元素obj下的内容添加事件处理
		var newCBox = wTools.$(".ck_box",obj)[0]; // 获取单选框
	    var listBox = wTools.$(".list",obj)[0];   
	    // 获取元素下的盒子，给它添加移入移出事件处理
		newCBox.onOff = false;  // 初始没有单个checkbox的状态为false，没选中
		// 给单选框绑定点击事件
		wTools.addEvent(newCBox,"click",function addFilesEvent(){  
			var num = 0;
			this.onOff = !this.onOff;   // 每次点击单选框，判断状态
			if( this.onOff ){           // 如果是选中状态添加样式
				wTools.addClass(newCBox,"ck_show"); 
				wTools.addClass(newCBox,"ck_sel");
				wTools.addClass(listBox,"list_selected");  // 给父级添加背景边框
				num = whoSelected( allFiles,".ck_box","ck_show" ).length;
				if( num === allFiles.length ){   // 文件长度和选中的文件个数相等的时候
					checkAll.sel = true;         // 修改全选框的状态为选中
					wTools.addClass(checkAll,"checkall_sel");   // 给全选添加class
				}
			} else { // 没有单选框没选中
				wTools.removeClass(newCBox,"ck_show");  // 清掉单选框的样式
				wTools.removeClass(newCBox,"ck_sel");
				wTools.removeClass(listBox,"list_selected"); // 清掉父级的背景和边框
				checkAll.sel = false;  // 同时将全选改为未选中
				wTools.removeClass(checkAll,"checkall_sel");  // 移除全选的样式
			}
		}); 

		wTools.addEvent(obj,"mouseover",function (){  // 给每一个obj添加移入移出事件
			if( !newCBox.onOff ){       // 判断单选框有没有被选中，没选中就添加class
				wTools.addClass(newCBox,"ck_show");
				wTools.addClass(listBox,"list_selected");
			}
		});

		wTools.addEvent(obj,"mouseout",function (){
			if( !newCBox.onOff ){       // 判断单选框有没有被选中，没选中就移除class
				wTools.removeClass(newCBox,"ck_show"); 
				wTools.removeClass(listBox,"list_selected");
			}
		});

		wTools.addEvent(obj,"click",function (ev){
			ev.stopPropagation();
			ev.preventDefault();
		}) 
		return obj;  // 最后把添加好事件处理的文件夹返回出去
	}

	// 寻找哪些文件是选中的
	function whoSelected(obj,classNames,hasClassName){
		var arr = [];
		for( var i = 0; i < obj.length; i++ ){
			var cBox = wTools.$(classNames,obj[i])[0];
			if( wTools.hasClass(cBox,hasClassName) ){
				arr.push(obj[i]);  // 把选中的文件夹添加到数组中
			} 
		}
		return arr;  // 把装有选中文件夹的数组返回出去
	} 

	// 顶部中间的提示框函数
	function tipFn(className,str){
		// 动态创建一个div
		var oDiv = document.createElement("div");
		oDiv.className = className;              // 设置div的类名
		oDiv.innerHTML = str;                    // 设置div的内容
		headerTip.appendChild(oDiv);             // 将div放到提示框里
		headTipWidth();	                         // 将headTip放到页面的中间
		MTween(headerTip,"top",300,0,"linear",function (){  // 让headerTip向下运动 
			setTimeout(function(){               // 2s之后收起
				MTween(headerTip,"top",300,-32,"linear",function (){
					headerTip.removeChild(oDiv); // headerTip移除div
				});
			},2000);
		})
	}

	// 新建文件夹之后，根据input输入框中的内容来判断是否保留和删除该文件夹
	function saveOrNot(obj){
		var fileBox = wTools.$(".fileedit",obj)[0];
		var ipt = fileBox.firstElementChild;
		ipt.focus();
		if( !ipt.value ){  // 内容为空时，移除
			mainContent.removeChild(obj);
		} else {  // 内容不为空时，创建成功
			fileBox.previousElementSibling.style.display = "block";
			fileBox.previousElementSibling.title = ipt.value;
			fileBox.previousElementSibling.innerHTML = ipt.value;
			fileBox.style.display = "none";
			tipFn("success_tip","新建文件夹成功");	
		}
	}

	var header = wTools.$("#header");
	var headerTip = wTools.$(".center_tip_box",header)[0]; 
	var sec = wTools.$("#sec");
	var allNavBtn = wTools.$(".le_area",sec)[0];   // 获取到全选按钮一排按钮
	var leftBarWrap = wTools.$(".left_sec_box",sec)[0];
	var rightCon = wTools.$(".content_area_box",sec)[0];
	var conHeader = wTools.$(".oper_area_box",sec)[0];
	var conSidebar = wTools.$(".con_sidebar",sec)[0];
	var listBarNav = wTools.$("#list_bar_nav");    // 找到文件夹内容上边的横条导航
	var path = wTools.$(".path",listBarNav)[0]; 
	var oSpan = wTools.$("span",path)[0];          // 获取横条导航下的第一个span
	var mainContent = wTools.$("#main_content");   // 获取到存放新建文件的大DIV
	var allFiles = wTools.$(".list_wrap",mainContent); 
	var aFiles = wTools.$(".list",mainContent);    // 从大DIV下获取到所有的文件夹
	var checkAll = wTools.$(".checkall",listBarNav)[0];   // 获取到全选按钮
	var renameBtn = wTools.$("#renameBtn");        // 获取到重命名按钮
	var deleteBtn = wTools.$("#deleteBtn");        // 获取删除按钮
	var createBtn = wTools.$("#createBtn");        // 获取到新建文件夹按钮
	var len = allFiles.length;                     // 获取到内容区域所有文件的长度
	var num = 0;
	var flag = false;
	checkAll.sel = false;

	// 设置页面中元素的高度
	function setHeight(){
		// 动态设置页面的高度以及树形菜单的高度
		leftBarWrap.style.height = wTools.getWin().H - header.offsetHeight + "px";
		// 设置左侧大导航的高度，自适应高分辨率设备
		rightCon.style.height = wTools.getWin().H - header.offsetHeight 
		- conHeader.offsetHeight + "px";  // 设置右侧内容区域的高度，自适应高分辨率设备
	}
	// 当页面的尺寸改变的时候，再次设置页面中元素的高度
	wTools.addEvent(window,"resize",setHeight);

	// 设置中间提示条的left条，一直定位在屏幕的最中间
	function headTipWidth(){
		headerTip.style.left = (wTools.getWin().W - headerTip.offsetWidth)/2 + "px";
	}

	// 循环生成页面结构
	for( var i = 0; i < data.files.length; i++ ){
		if(  data.files[i].pid === 0 ){  // pid为0的元素为第一级元素
			var oDiv = createDiv(data.files[i].id,data.files[i].title);
			oDiv = addEvent(oDiv);
			mainContent.appendChild(oDiv);
		}
	}

	// 设置全选按钮的点击处理
	checkAll.onclick = function (){
		if( !this.sel ){ // 当全选为false的时候，代表没有被选中
			wTools.addClass(this,"checkall_sel");  // 给全选按钮添加选中状态的样式
			for( var i = 0; i < allFiles.length; i++ ){  // 给所有的子单选框添加样式
				var cBox = wTools.$(".ck_box",allFiles[i])[0];
				cBox.onOff = true;
				wTools.addClass(cBox,"ck_show");
				wTools.addClass(cBox,"ck_sel");
				wTools.addClass(allFiles[i].firstElementChild,"list_selected");
			}
		} else {  // 全选为true的时候，代表已经被选中
			wTools.removeClass(this,"checkall_sel"); // 给全选按钮添加移除状态的样式
			for( var i = 0; i < allFiles.length; i++ ){  // 给所有的子单选框移除样式
				var cBox = wTools.$(".ck_box",allFiles[i])[0];
				cBox.onOff = false;
				wTools.removeClass(cBox,"ck_show");
				wTools.removeClass(cBox,"ck_sel");
				wTools.removeClass(allFiles[i].firstElementChild,"list_selected");
			}
		}
		this.sel = !this.sel;  // 修改选中状态
	}

	// 点击新建文件夹处理
	createBtn.onclick = function (ev){  

		var oDiv = createDiv(allFiles[0].dataset.fileId);
		oDiv = addEvent(oDiv);
		mainContent.insertBefore(oDiv,allFiles[0]);
		checkAll.sel = false;
		wTools.removeClass(checkAll,"checkall_sel");


		document.onkeyup = function (ev){  // 当按下回车键的时候，让ipt失去焦点
			if( ev.keyCode === 13 ){
				saveOrNot(allFiles[0],ev);
			}
		}

		document.onmouseup = function (ev){
			saveOrNot(allFiles[0]);
			console.log(1);
			ev.cancelBubble = true;
		}

	}

	// 添加重命名处理
	renameBtn.onclick = function (){
		
		var text = "";
		var arr = whoSelected(allFiles,".ck_box","ck_sel");
		console.log(arr);
		if( arr.length === 0 ){
			console.log(arr);
			tipFn("renameChooseNothing");
		} else if( arr.length > 1 ) {
			console.log(arr);
			tipFn("renameLotFiles");
		} else {
			var titEle = wTools.$(".titlename",arr[0])[0];
			var fileEle = wTools.$(".fileedit",arr[0])[0];
			var iptEle = fileEle.firstElementChild;
			text = titEle.innerHTML;
			titEle.style.display = "none";
			fileEle.style.display = "block";
			iptEle.focus();
			iptEle.value = text;
			iptEle.select();

			document.onkeyup = function (ev){
				if( ev.keyCode === 13 ){
					iptEle.blur();
				}
			}

			iptEle.onblur = function (){
				tipFn("renameSuc");
				text = iptEle.value;
				titEle.style.display = "block";
				fileEle.style.display = "none";
				titEle.innerHTML = text;
				document.onkeyup = null;
			}
		}
	}

	// 添加删除处理
	deleteBtn.onclick = function (ev){
		var arr = whoSelected(allFiles,".ck_box","ck_show");
		if( arr.length === 0 ){
			tipFn("alert_tip","请选择文件");
		} else {
			for( var i = 0; i < arr.length; i++ ){
				mainContent.removeChild(arr[i]);
				tipFn("success_tip","删除文件成功");
			}
		}
	}

	// 给一排按钮统一添加取消冒泡的处理
	allNavBtn.onmousedown = function (ev){
		console.log(2);
		ev.cancelBubble = true;
		ev.preventDefault();
	}
	checkAll.onmousedown = function (ev){
		ev.cancelBubble = true;
		ev.preventDefault();
	}
	leftBarWrap.onmousedown = function (ev){
		ev.cancelBubble = true;
		ev.preventDefault();
	}
	conSidebar.onmousedown = function (ev){
		ev.cancelBubble = true;
		ev.preventDefault();
	} 

	// 添加选框碰撞文件选中处理
	// document.onmousedown = function (ev){
		
	// 	for (var i = 0; i < allFiles.length; i++) {
	// 		var cBox = wTools.$(".ck_box",allFiles[i])[0];
	// 		cBox.style.display = "none";
	// 		wTools.removeClass(allFiles[i].firstElementChild,"list_selected");
	// 		wTools.removeClass(cBox,"ck_show");
	// 		wTools.removeClass(cBox,"ck_sel");
	// 		wTools.removeClass(checkAll,"checkall_sel");
	// 		checkAll.sel = false;
	// 		cBox.onOff = false;
	// 	};
	// 	var newDiv = null;
	// 	var disX = ev.clientX;
	// 	var disY = ev.clientY;
	// 	document.onmousemove = function (ev){
	// 		var arr = [];
	// 		if( Math.abs(ev.clientX - disX) > 10 || Math.abs(ev.clientY - disY) > 10 ){
	// 			if( !newDiv ){
	// 				newDiv = document.createElement("div");
	// 				newDiv.style.position = "absolute";
	// 				newDiv.style.zIndex = 20;
	// 				newDiv.style.border = "1px dashed #737373";
	// 				newDiv.style.background = "#e8f3f9";
	// 				newDiv.style.opacity = ".6";
	// 				newDiv.style.left = disX + "px";
	// 				newDiv.style.top = disY + "px";
	// 				document.body.appendChild(newDiv);
	// 			}

	// 			newDiv.style.width = Math.abs(ev.clientX - disX) + "px";
	// 			newDiv.style.height = Math.abs(ev.clientY - disY) + "px";
	// 			newDiv.style.left = Math.min(ev.clientX , disX) + "px";
	// 			newDiv.style.top = Math.min(ev.clientY , disY) + "px";

	// 			for( var i = 0; i < aFiles.length; i++ ){
	// 				if( wTools.isCollide(newDiv,aFiles[i] ) ){
	// 					arr.push(aFiles[i]);
	// 				}
	// 			}
	// 			if( arr.length > 0 ){
	// 				for( var i = 0; i < arr.length; i++ ){
	// 					var cBox = wTools.$(".ck_box",arr[i])[0];
	// 					cBox.style.display = "block";
	// 					wTools.addClass(arr[i],"list_selected");
	// 					wTools.addClass(cBox,"ck_show");
	// 					wTools.addClass(cBox,"ck_sel");
	// 					cBox.onOff = true;
	// 				}
	// 			}
				
	// 		}
	// 		document.onmouseup = function (){
	// 			document.onmousemove = null;
	// 			document.onmousedown = null;
	// 			// 判断选框选中的元素是不是全选，是的话改变全选的状态
	// 			console.log(whoSelected(allFiles,".ck_box","ck_show").length,allFiles.length);
	// 			if( whoSelected(allFiles,".ck_box","ck_show") === allFiles.length ){
	// 				alert(1);
	// 				wTools.addClass(checkAll,"checkall_sel");
	// 				checkAll.sel = true;
	// 			}
	// 			if( newDiv ){
	// 				//console.log(newDiv);
	// 				document.body.removeChild(newDiv);
	// 				newDiv = null;
	// 			}
	// 			document.onmouseup = null;
	// 		}	
	// 	}
	// 	return false;
	// }
})()
