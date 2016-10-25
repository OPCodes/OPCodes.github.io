/*  自执行函数，保护私有变量，不受外界变量的影响 */
(function(){
	// 创建返回一个拼接好的文件字符串
	function createFile(item){
		var status = item.status;
		var html = '<div class="list_wrap" data-file-id='+ item.id +'>'
				+'<div class="list '+ (status?"list_selected":null) +'">'
		        +'<label class="ck_box '+ (status?"ck_show ck_sel":null) +'"></label>'
		        +'<span class="img">'
		            +'<i class="filetype ico-folder"></i>'
		        +'</span>'
		        +'<span class="name">'
		            +'<p class="text">'
		                +'<em>'
		                   	+'<span style="display:block" class="titlename">'+item.title+'</span>'
		                    +'<span style="display:none;" class="fileedit">'
		                        +'<input class="filename" type="text">'
		                    +'</span>'
		                +'</em>'
		            +'</p>'
		        +'</span>'
		    +'</div>'
		+'</div>';
	    return html;  // 返回一个文件夹的字符串
	}

	// 添加事件函数，在生成div的时候，给创建的div添加事件处理函数
	function addEv(obj,n){   // 给元素obj下的内容添加事件处理
		var newCBox = wTools.$(".ck_box",obj)[0]; // 获取单选框
		//console.log(1);
	    var listBox = wTools.$(".list",obj)[0];   
	    // 获取元素下的盒子，给它添加移入移出事件处理
	    //console.log(children[n].statue)
	    newCBox.status = children[n].status;
		//console.log(newCBox.status);
		// 给单选框绑定点击事件
		wTools.addEvent(newCBox,"click",function (ev){
			var num = 0;
			this.status = !this.status;   // 每次点击单选框，判断状态
			children[n].status = this.status;
			if( children[n].status ){           // 如果是选中状态添加样式
				console.log(2);
				wTools.addClass(newCBox,"ck_show"); 
				wTools.addClass(newCBox,"ck_sel");
				wTools.addClass(listBox,"list_selected");  // 给父级添加背景边框
				num = whoSelected( allFiles,".ck_box","ck_show" ).length;
				if( num === children.length ){   // 文件长度和选中的文件个数相等的时候
					checkAll.sel = true;         // 修改全选框的状态为选中
					wTools.addClass(checkAll,"checkall_sel");   // 给全选添加class
				}
			} else { // 没有单选框没选中
				wTools.removeClass(newCBox,"ck_sel");
				checkAll.sel = false;  // 同时将全选改为未选中
				wTools.removeClass(checkAll,"checkall_sel");  // 移除全选的样式
			}
			ev.cancelBubble = true;
		});

		wTools.addEvent(obj,"mouseenter",function (){  // 给每一个obj添加移入移出事件
			if( !children[n].status ){       // 判断单选框有没有被选中，没选中就添加class
				wTools.addClass(newCBox,"ck_show");
				wTools.addClass(listBox,"list_selected");
			} else {
				wTools.addClass(newCBox,"ck_show");
				wTools.addClass(listBox,"list_selected");
			}
		});

		wTools.addEvent(obj,"mouseleave",function (){
			if( !children[n].status ){       // 判断单选框有没有被选中，没选中就移除class
				wTools.removeClass(newCBox,"ck_show"); 
				wTools.removeClass(listBox,"list_selected");
			}
		});
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
	var timer = null;
	// 顶部中间的提示框函数
	function tipFn(className,str){
		// 动态创建一个div
		var oDiv = document.createElement("div");
		oDiv.className = className;              // 设置div的类名
		oDiv.innerHTML = str;                    // 设置div的内容
		headerTip.appendChild(oDiv);             // 将div放到提示框里
		headTipWidth();	                         // 将headTip放到页面的中间
		//headerTip.style.height = -32 + "px";
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
	var leftBarWrap = wTools.$(".left_sec_box")[0];
	var rightBarWrap = wTools.$(".right_sec_box")[0];
	var rightCon = wTools.$(".content_area_box",sec)[0];
	var conHeader = wTools.$(".oper_area_box",sec)[0];
	var conSidebar = wTools.$(".con_sidebar",sec)[0];
	var listBarNav = wTools.$("#list_bar_nav");    // 找到文件夹内容上边的横条导航
	var path = wTools.$(".path",listBarNav)[0]; 
	var oSpan = wTools.$("span",path)[0];          // 获取横条导航下的第一个span
	var mainContent = wTools.$("#main_content");   // 获取到存放新建文件的大DIV
	var allFiles = wTools.$(".list_wrap",mainContent); 
	var aFiles = wTools.$(".list",mainContent);    // 从大DIV下获取到所有的文件夹
	var wrapMenu = wTools.$(".con_detail_menu")[0];
	var checkAll = wTools.$(".checkall",listBarNav)[0];   // 获取到全选按钮
	var renameBtn = wTools.$("#renameBtn");        // 获取到重命名按钮
	var deleteBtn = wTools.$("#deleteBtn");        // 获取删除按钮
	var createBtn = wTools.$("#createBtn");        // 获取到新建文件夹按钮
	var refresh = wTools.$("#refresh");

	setHeight();
	// 设置页面中元素的高度
	function setHeight(){
		// 动态设置页面的高度以及树形菜单的高度
		leftBarWrap.style.height = wTools.getWin().H - header.offsetHeight + "px";
		// 设置左侧大导航的高度，自适应高分辨率设备
		rightBarWrap.style.height = wTools.getWin().H - header.offsetHeight + "px";  
		// 设置右侧内容区域的高度，自适应高分辨率设备
		rightCon.style.height = rightBarWrap.offsetHeight - conHeader.offsetHeight + "px";
	}
	// 当页面的尺寸改变的时候，再次设置页面中元素的高度
	wTools.addEvent(window,"resize",setHeight);

	// 设置中间提示条的left条，一直定位在屏幕的最中间
	function headTipWidth(){
		headerTip.style.left = (wTools.getWin().W - headerTip.offsetWidth)/2 + "px";
	}

	// wTools.addEvent(allNavBtn,"mousedown",function(ev){
	// 	ev.cancelBubble = true;
	// });
	// wTools.addEvent(checkAll,"mousedown",function(ev){
	// 	ev.cancelBubble = true;
	// });
	// wTools.addEvent(leftBarWrap,"mousedown",function(ev){
	// 	ev.cancelBubble = true;
	// });
	// wTools.addEvent(conSidebar,"mousedown",function(ev){
	// 	ev.cancelBubble = true;
	// });

	/*  渲染页面部分 */
	// 得到data中的数据
	var datas = data.files;

	// 找到指定id下子元素，初始为最顶层的id为0
	var initId = 0;

	var children;
	
	function createD(id){
		// 获取到id为0下的所有子元素
		children = dataAction.getChildrenById(datas,id); 
		var str = "";
		// 循环生成第一层数据结构
		for( var i = 0; i < children.length; i++ ){
			str += createFile(children[i]);
		}
		return str;
	}

	// 将拼接好的字符串添加到内容区域
	mainContent.innerHTML = createD(initId);

	addFileEvent();
	// 为每一个文件夹添加点击事件处理函数
	function addFileEvent(){
		for( var i = 0; i < allFiles.length; i++ ){
			//console.log(i)
			var files = addEv(allFiles[i],i);
			var inputBox = wTools.$(".filename",allFiles[i])[0];

			wTools.addEvent(files,"click",function (ev){
				var fileId = this.dataset.fileId;   // 找到每个文件的id
				var children = dataAction.getChildrenById(datas,fileId);
				var str = "";
				console.log(fileId);
				for( var i = 0; i < children.length; i++ ){
		            str += createFile(children[i]);
		        }

		        //新添加的内容，没有事件处理了
		        mainContent.innerHTML = str;
		        //生成完结构后，让文件有点击事件处理程序
		        addFileEvent();

		        //再点击的时候，生成导航区域的结构
		        mainPath.innerHTML = createPathNav(datas,fileId);
			});

			wTools.addEvent(inputBox,"click",function (ev){
				ev.stopPropagation();
			});
		}
	}

	// 文件路径导航区域
	function createPathNav(datas,id){
		// 初始的时候找到指定id的所有的父级
		var parents = dataAction.getParentsById(datas,id).reverse();
        //根据数据生成文件导航的结构
        var str = '';
        //["微云","我的音乐","周杰伦"]
        //最后一个使用span来包含的

        var zIndex = parents.length+10;

		for( var i = 0; i < parents.length-1; i++ ){
		   str += '<a href="javascript:;"'
		   +' style="z-index:'+(zIndex--)+'" class="path" data-file-id="'+ id +'">'+parents[i].title+'</a>';
		                             
		}
		str += '<span class="current" style="z-index:'+zIndex+'" data-file-id="'+ id +'">'+parents[parents.length-1].title+'</span>';   
		return str;
    }

    //文件导航区域的容器
    var mainPath = wTools.$(".main_path")[0];
    mainPath.innerHTML = createPathNav(datas,initId);

    // 获取一个随机的id，并且不能与已经存在的id冲突
    function getRandomId(){
    	var num = Math.round(Math.random()*10000);
    	if( allFiles.length > 0 ){
			for( var i = 0; i < allFiles.length; i++ ){
				if( num == allFiles[i].dataset.fileId ){
					getRandomId();
				}
				if( i === allFiles.length - 1 ){
					return num;
				}
			}
    	} else {
    		return num;
    	}
    }

    checkAll.sel = false;
	// 设置全选按钮的点击处理
	checkAll.onclick = function (){
		if( !this.sel ){ // 当全选为false的时候，代表没有被选中
			wTools.addClass(this,"checkall_sel");  // 给全选按钮添加选中状态的样式
			for( var i = 0; i < aFiles.length; i++ ){  // 给所有的子单选框添加样式
				var cBox = wTools.$(".ck_box",aFiles[i])[0];
				cBox.status = true;
				children[i].status = true;
				datas[i].status = true;
				wTools.addClass(cBox,"ck_show");
				wTools.addClass(cBox,"ck_sel");
				wTools.addClass(aFiles[i],"list_selected");
			}
		} else {  // 全选为true的时候，代表已经被选中
			wTools.removeClass(this,"checkall_sel"); // 给全选按钮添加移除状态的样式
			for( var i = 0; i < aFiles.length; i++ ){  // 给所有的子单选框移除样式
				var cBox = wTools.$(".ck_box",aFiles[i])[0];
				cBox.status = false;
				children[i].status = false;
				datas[i].status = false;
				wTools.removeClass(cBox,"ck_show");
				wTools.removeClass(cBox,"ck_sel");
				wTools.removeClass(aFiles[i],"list_selected");
			}
		}
		//mainContent.innerHTML = createD(num);
		
		this.sel = !this.sel;  // 修改选中状态
	}

	// 给createBtn添加一个状态，状态为true，可以新建，状态为false，不能新建
	createBtn.status = true;
	// 点击新建文件夹处理
	createBtn.onclick = function (ev){
		if( this.status ){
			this.status = false;
			// 创建一个id和别的数据不重复的文件
			var randomId = getRandomId();

			var newFile = createFile(randomId);
			mainContent.innerHTML = newFile + mainContent.innerHTML; // 新建的文件拼接到内容区域
			//console.log(children);
			var num = parseInt(mainPath.lastElementChild.dataset.fileId);
			var obj = {
				id:randomId,
				pid:num,
				title:null,
				type:null,
				statue:false
			}
			datas.unshift(obj);
			children.unshift(obj);
			addFileEvent();  // 给所有的元素添加了点击和mouse事件
			// 获取到第一个下边的文件名的容器和输入框的容器
			var fileName = wTools.$(".titlename",allFiles[0])[0];
			var cBox = wTools.$(".ck_box",allFiles[0])[0];
			var editBox = wTools.$(".fileedit",allFiles[0])[0];
			fileName.style.display = "none";
			editBox.style.display = "block";
			var editInput = wTools.$(".filename",allFiles[0])[0];
			wTools.addEvent(allFiles[0],"mouseenter",function (ev){
				cBox.style.display = "none";
			})
			editInput.focus();

			function inputSaveOrRemove(ev){  // 当按下回车键的时候
				//editInput = wTools.$(".filename",allFiles[0])[0];
				if( !editInput.value ){  // children数组中首项的title为空时
					mainContent.removeChild(allFiles[0]);
					children.shift();
					datas.shift();
					mainContent.innerHTML = createD(num);
					addFileEvent();
					console.log(1);
					wTools.removeEvent(document,"mousedown",inputSaveOrRemove);
					wTools.removeEvent(checkAll,"mousedown",inputSaveOrRemove);
				} else {  // 内容不为空时
					for( var i = 1; i < children.length; i++ ){
						// 判断第一个元素的输入框和children中的元素是否重名
						console.log(editInput.value,children[i].title)
						if( editInput.value == children[i].title ){
							// 检测重名
							tipFn("alert_tip","文件名有冲突，请重新命名");
							break;
						} else {
							// 循环完成后，如果没有到这一步，说明没有重名，创建成功
							if( i === children.length - 1 ){
								fileName.style.display = "block";
								fileName.innerHTML = editInput.value;
								datas[0].title = editInput.value;
								children[0].title = editInput.value;
								mainContent.innerHTML = createD(num);
								addFileEvent();
								editBox.style.display = "none";
								tipFn("success_tip","新建文件夹成功");
								console.log(2);
								wTools.removeEvent(document,"mousedown",inputSaveOrRemove);
								wTools.removeEvent(checkAll,"mousedown",inputSaveOrRemove);
							}
						}
					}	
				}
				
				document.onkeyup = null;
				createBtn.status = true;
				ev.stopPropagation();
			}

			document.onkeyup = function (ev){

				if( ev.keyCode === 13 ){
					
					inputSaveOrRemove(ev);
					
				}
			}

			wTools.addEvent(document,"mousedown",inputSaveOrRemove);

			wTools.addEvent(checkAll,"mousedown",inputSaveOrRemove);
		}
	}

	// 添加重命名处理
	renameBtn.onclick = function (){
		
		var text = "";
		var arr = whoSelected(allFiles,".ck_box","ck_sel");
		if( arr.length === 0 ){
			console.log(arr);
			tipFn("alert_tip","请选择文件");
		} else if( arr.length > 1 ) {
			console.log(arr);
			tipFn("fail_tip","只能对单个文件重命名");
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
					tipFn("success_tip","更名成功");
				}
			}

			iptEle.onblur = function (){
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
			for( var i = 0; i < children.length; i++ ){
				if( children[i].status ){
					mainContent.removeChild(allFiles[i]);
					children.splice(i,1);
					datas.splice(i,1);
					i--;
					tipFn("success_tip","删除文件成功");
				}
			}
		}
	}

	// 给一排按钮统一添加取消冒泡的处理
	

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
