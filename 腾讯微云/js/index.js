/*  自执行函数，保护私有变量，不受外界变量的影响 */
(function(tl){
	
	// 1.设置页面中元素的高度，让它们在不同分辨率的设备上都能100%呈现

	var header = tl.$("#header"); // 获取到最顶部的元素，为了计算并减去它的高度
	var leftBar = tl.$(".left_sec_box")[0];  // 左侧导航区
	var rightBar = tl.$(".right_sec_box")[0];   // 右侧包含导航的内容区
	var rightCon = tl.$(".content_area_box")[0];   // 右侧树形菜单和文件区
	var allList = tl.$(".list");			   // 获取到所有的小文件夹
	var cBox = tl.$(".ck_box");				   // 获取到所有的单选框
	var aInps = tl.$(".fileedit");             // 获取到所有的输入框
	var controlWrap = tl.$(".oper_area_box",sec)[0];  // 中间文件操作区
	var listPathNav = tl.$("#list_bar_nav");  // 找到路径导航的父级元素
	// 获取到包裹文件夹区域的元素
	var mainFileCon = tl.$("#main_content");
	var fileEmpty = tl.$("#file_empty");  // 获取到文件区域为空时，需要显示相应某元素内容

	// 给页面中的几块内容设置适应页面的高度
	function setSectionHeight(){

		// 设置左侧导航区高度
		leftBar.style.height = tl.getWin().H - header.offsetHeight + "px";

		// 设置包含导航的内容区的高度
		rightBar.style.height = tl.getWin().H - header.offsetHeight + "px";

		// 设置中间文件操作区的高度
		rightCon.style.height = rightBar.offsetHeight - controlWrap.offsetHeight + "px";
		
		// 主要内容区域的高度
		mainFileCon.style.height = rightBar.offsetHeight - listPathNav.offsetHeight + "px";

	}

	setSectionHeight();

	// 当页面的尺寸改变的时候，再次设置页面中元素的高度
	wTools.addEvent(window,"resize",setSectionHeight);

	// 2.开始操作数据，渲染页面
	// 得到页面中的数据
	var datas = data.files;

	// 找到指定id下的子元素，初始值为最顶端"微云"的id
	var initId = 0;

	// children要存放根据id值找到的该id下的所有子元素的集合，用来渲染页面
	// 是一个对象集合
	var children = [];
	
	// 一个生成某id下所有子元素字符串的函数，最终要把这些字符串拼接到页面中
	function createUnderIdChildrenStr(datas,id){

		//获取某一个id下所有的子元素
		children = dataAction.getChildrenById(datas,id);  // 通过数据操作js下方法

		// 定义一个str，用来存放拼接好的子元素的字符串
		var str = "";

		// 循环生成数据结构
		for( var i = 0; i < children.length; i++ ){
			str += createFileStrFn(children[i]);
		}
		return str;
	}

	// 创建返回一个拼接好的文件字符串
	function createFileStrFn(item){  // 传入的对象是data数据或者children中的某一项
		// 得到item下的status属性，为了对应文件上的单选框是否选中
		var status = item.status; 
		// html为拼接的字符串，根据status的状态来决定是否给文件夹添加选中样式，
		// 以及文件的边框和背景样式，并且给每一个元素加一个自定义的id，为了通过id找到它的子元素
		var html = '<div class="list_wrap" >'
				+'<div class="list'+ (status?" list_selected":"") +'" data-file-id='+ item.id +'>'
		        +'<label class="ck_box'+ (status?" ck_show ck_sel":"") +'"></label>'
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
	
	// allFile为当前文件区域的所有大文件夹
	var allFls = tl.$(".list_wrap"); 
	// 因为ByClass是动态属性，所以allFile也是随着内容的改变而改变的 

	// 2.1通过一连串的处理，将data数据中需要呈现元素，渲染到页面上，并且添加事件
	renderHtmlAndAddEvent(initId);
	function renderHtmlAndAddEvent(id){
		// 将拼接好的字符串添加到内容区域，初始页面内容，以后的内容会根据操作而更改
		mainFileCon.innerHTML = createUnderIdChildrenStr(datas,id);
		// 假如页面的内容为空时，需要给空文件区域显示fileEmpty中的内容
		nullFileAreaBg();
		// 为每一个文件添加点击事件处理函数
		addFileEventFn();
	}

	function nullFileAreaBg(){
		if ( mainFileCon.innerHTML.trim() == "" ){
			fileEmpty.style.display = "block";
		} else {
			fileEmpty.style.display = "none";
		}
		if( allCheck && allCheck.status ){
			allCheck.status = false;
			tl.removeClass(allCheck,"checkall_sel");
		}
	}

	// 为allFile类数组集合中的所有元素添加事件
	// 该函数在本例中不是纯函数，由于allFile是动态的，所以可以重复使用
	function addFileEventFn(){

		// 用for循环为所有文件添加事件
		for( var i = 0; i < allList.length; i++ ){
			tl.addEvent(allList[i],"click",function(ev){
				// 通过文件的自定义属性，找到当前文件的id
				var fileId = this.dataset.fileId;
				
				// 通过当前文件的id找到该id下的所有子元素，存到全局变量children下
				children = dataAction.getChildrenById(datas,fileId);
				//console.log(children.length);
				var str = "";
				// 拼接该id子元素的字符串
				for( var i = 0; i < children.length; i++ ){
		            str += createFileStrFn(children[i]);
		        }
		        // 把文件区域，路径导航区域和树形菜单区域同步渲染和添加事件处理
		        togetherThreeHtmlAndEvent(fileId);
		        // 判断是否有文件，给没有文件的文件区域添加空的背景
		        nullFileAreaBg();
			});

			// 给每一个文件夹绑定鼠标移入移出事件处理
			(function (n){
				allList[n].index = n;
				// 给文件绑定移入事件
				allList[n].onmouseenter = function (){
					// 移入时判断第i个children的status，对应文件区的第i个文件的状态
					// 移入时状态为false，则添加对应样式
					var fileEdit = tl.$(".fileedit",this)[0];
					if( !tl.hasClass(this,"list_selected") && fileEdit.style.display !== "block" ){
						tl.addClass(cBox[n],"ck_show");
					}
					if( !tl.hasClass(this,"list_selected") ){
						tl.addClass(this,"list_selected");
					}

				}
				// 给文件绑定移出事件
				allList[n].onmouseleave = function (){
					// 移出时状态为false，则移除对应样式
					if(!tl.hasClass(cBox[n],"ck_sel")){
						tl.removeClass(this,"list_selected");
						tl.removeClass(cBox[n],"ck_show");
					}
				}
				
				// 给每个文件的单选框添加点击时间，文件已经有点击事件，所以需要取消冒泡
				cBox[n].onclick = function(){
					var num = 0;
					
					// 判断当前这个文件的单选框有没有被选中
					if(!tl.hasClass(this,"ck_sel")){      // 如果没有被选中的话
						tl.addClass(cBox[n],"ck_sel");    // 通过点击，应该添加选中样式
						tl.addClass(allList[n],"list_selected");
						for( var i = 0; i < cBox.length; i++ ){   // 循环所有单选框
							if( tl.hasClass(cBox[i],"ck_sel") ){
								num++;                    // 有一个选中就让num++
							}
							if( num === cBox.length ){    // 当num的长度和单选框的长度相等时
								tl.addClass(allCheck,"checkall_sel");
								allCheck.status = true;   // 让全选也选中，同时修改状态
							}
						}
					} else {                              // 如果被选中的话
						tl.removeClass(cBox[n],"ck_sel"); // 点击让当前这个单选不选中
						if( tl.hasClass(allCheck,"checkall_sel") ){   // 同时要判断全选有没有选中
							tl.removeClass(allCheck,"checkall_sel");  // 如果选中就移除选中样式
						}
						allCheck.status = false;
					}

				}

				// tl.addEvent(allList[i],"mousedown",function (ev){
				// 	ev.stopPropagation();

				// })

				// tl.addEvent(allFls[i],"mousedown",function (ev){
				// 	ev.preventDefault();
				// })

				tl.addEvent(cBox[n],"click",function (ev){
					ev.stopPropagation();    // 点击单选框的时候取消冒泡到allList上
					ev.preventDefault();
				})
				// 给每个文件点击鼠标按下事件，因为document已经有了鼠标按下事件
				// 所以需要取消冒泡
				tl.addEvent(cBox[n],"mousedown",function(ev){
					ev.stopPropagation();    // 点击单选框选择的时候取消冒泡到allList和document
					ev.preventDefault();
				});
				
				tl.addEvent(aInps[n],"mousedown",function (ev){
					ev.stopPropagation();    // 当鼠标按下的时候取消冒泡到allList和document
				});

				tl.addEvent(aInps[n],"click",function (ev){
					ev.stopPropagation();    // 当点击的时候取消冒泡到allList上
				})

			})(i)
		}
	}

	// 2.2文件路径导航区域
	function createPathNav(datas,id){

		// 初始的时候找到指定id的所有的父级
		var parents = dataAction.getParentsById(datas,id).reverse();
        //根据数据生成文件导航的结构
        var str = '';
        
        // 层级逐渐递减
        var zIndex = parents.length+10;
        // str拼接每一个祖先级a标签
		for( var i = 0; i < parents.length-1; i++ ){
		   str += '<a href="javascript:;"' // 如何解决a标签跳转的问题，而且要实现点击事件？？？？？？
		   +' style="z-index:'+(zIndex--)+'" class="path" data-file-id="'+ parents[i].id +'">'+parents[i].title+'</a>';
		                             
		}
		// 最后一个拼接span，为当前这个文件区域的路径，current为当前这个文件的选中状态
		str += '<span class="current" style="z-index:'+zIndex+'" data-file-id="'+ id +'">'+parents[parents.length-1].title+'</span>';   
		// 与此同时给导航区域的a标签添加点击事件
		 
		return str;
    }

    // 文件导航区域的容器
    var mainPath = tl.$(".main_path")[0];
    mainPath.innerHTML = createPathNav(datas,initId);
    
    // 2.3根据文件区域内容，渲染也树形菜单结构

    var treeMenu = tl.$(".con_tree_menu")[0];

    // 通过createTreeHtml来渲染树形菜单区域的结构
  	function createTreeHtml(datas,id){

  		// 获取到指定id下的children
  		var tree_children = dataAction.getChildrenById(datas,id);

  		var html = '<ul class="menu_list">';

  		// 循环所有的children，获取到所有结构
  		for( var i = 0; i < tree_children.length; i++ ){
  			// 阶梯状的树形菜单，需要给li添加缩进
  			var level = dataAction.getLevel(datas,tree_children[i].id);
  			/*
  				闭合和展开转换 .ico  为展开，没有class为闭合
  				有没有子元素，li上的item_open，表示有子元素
  				点击，滑过背景为 .list_selected   有代表有背景
  			*/
  			var hasChild = dataAction.hasChilds(datas,tree_children[i].id);

  			var itemOpen = hasChild ? "ico" : "";
  			var itemStatus = hasChild ? "item_open":"";
  			html += '<li class="item_box '+ itemStatus +'">'
	  				+'<div class="title_box" style="padding-left:'+level*14+'px" data-file-id="'+ tree_children[i].id +'">'
	                +'<a href="javascript:;" class="link">'
	                +'<span class="ellipsis text" title="'+tree_children[i].title+'">'+tree_children[i].title+'</span>'
	                +'<i class="'+itemOpen+'"></i>'
	            +'</a>'
	       	+'</div>'; 
			
  			html += createTreeHtml(datas,tree_children[i].id);

  			html += '</li>';
  		}

  		html += '</ul>'

  		return html;
  	}

  	// 找到datas中，id为0的元素下所有的元素，并在treeMenu(ul)下生成结构
  	treeMenu.innerHTML = createTreeHtml(datas,0);


  	// 通过某一类class，找到自定义属性dataset.fileId为id值的元素---->getTreeById
  	// 找到所有标题box中，id为文件导航的最后一个元素的dataset.fileId的元素
  	
  	// 通过某一类class，找到自定义属性dataset.fileId为id值的元素
    function getTreeById(classNames,id){
		var classElement = tl.$("."+classNames);

		for( var i = 0; i < classElement.length; i++ ){
		 	if( classElement[i].dataset.fileId == id ){
		    	return classElement[i];
		 	}
		}

		return null;
	}

	function togetherThreeHtmlAndEvent(fileId){
		// 点击导航区域渲染文件区域的内容
        mainFileCon.innerHTML = createUnderIdChildrenStr(datas,fileId);
        // 为文件夹添加事件函数
        addFileEventFn();       
        // 点击导航区域渲染点击导航区域
        mainPath.innerHTML = createPathNav(datas,fileId);
        // 给导航区域添加点击事件
        addMainPathAClick();
        // 渲染树形菜单
  		treeMenu.innerHTML = createTreeHtml(datas,0);
  		// 给树形菜单添加点击事件处理
  		treeMenuAddEvent(fileId);

        var tree = getTreeById("title_box",fileId);

	    tl.removeClass(prevChooseObj,"list_selected");
	    tl.addClass(tree,"list_selected");

	    prevChooseObj = tree;
	}

  	var titleBox = tl.$(".title_box");

  	var prevChooseObj = tl.$(".list_selected")[0];

  	var treeMenuArea = tl.$('.con_sidebar')[0];

  	// 初始化绑定点击事件处理函数
  	treeMenuAddEvent(mainPath.lastElementChild.dataset.fileId);

  	function triangleOpenOrClose(ev){

  		var mainItem = tl.$('.item',treeMenuArea)[0];
		var parentNextSibling = this.parentNode.parentNode.nextElementSibling;
		if( !parentNextSibling ) {
			if( treeMenu.style.display === "none" ){
	  			treeMenu.style.display = "block";
	  			this.style.backgroundPosition = "3px -92px";
	  		} else {
	  			treeMenu.style.display = "none";
	  			this.style.backgroundPosition = "4px -42px";
	  		}
		} else {
			if( parentNextSibling.style.display === "none" ){
				parentNextSibling.style.display = "block";
				this.style.backgroundPosition = "3px -92px";
			} else {
				parentNextSibling.style.display = "none";
				this.style.backgroundPosition = "4px -42px";
			}
		}
		ev.stopPropagation();
	}

	// 给树形菜单的每一项以及小图标添加点击事件
  	function treeMenuAddEvent(fileId){
  		
  		var allIcos = tl.$('.ico',treeMenuArea);
	  	// 循环给所有树形菜单下的div添加点击改变背景的绑定的处理
	  	for( var i = 0; i < titleBox.length; i++ ){
	  		tl.addEvent(titleBox[i],"click",function (){
	  			var fileId = this.dataset.fileId;
	  			togetherThreeHtmlAndEvent(fileId);
	  			nullFileAreaBg();
	  		})
	  	}
	  	for( var j = 0; j < allIcos.length; j++ ){
	  		tl.removeEvent(allIcos[j],"click",triangleOpenOrClose);
	  		tl.addEvent(allIcos[j],"click",triangleOpenOrClose);
	  	}

  	}

    // 路径导航集合，根据动态获取集合
    var mainPathA = tl.$(".path");
    
    // 2.4给每个路径导航添加点击事件处理，并且重新渲染页面
    function addMainPathAClick(){

	    for( var i = 0; i < mainPathA.length; i++ ){
	    	// 给a标签绑定点击事件处理，重新渲染页面
	    	mainPathA[i].onclick = function (){
	     		// 找到这个文件路径导航的id
				var fileId = this.dataset.fileId;

				togetherThreeHtmlAndEvent(fileId);
				nullFileAreaBg();
	    	}
	    	// 给每一个a标签绑定移入移出事件处理，改变背景样式
	    	tl.addEvent(mainPathA[i],"mouseover",function(ev){
	    		this.style.backgroundPositionY = "-100px";
	    	})
	    	tl.addEvent(mainPathA[i],"mouseout",function(ev){
	    		this.style.backgroundPositionY = "-50px";
	    	})
	    }
    }

    // 获取一个随机的id，并且不能与已经存在的id冲突
    function getRandomId(){
    	var num = Math.round(Math.random()*10000);
    	if( allFls.length > 0 ){
			for( var i = 0; i < allFls.length; i++ ){  // 和所有的文件夹上的id比较
				if( num == allFls[i].dataset.fileId ){ // 如果冲突
					return getRandomId();	// 接着递归下去，直到找到不冲突id为止
				}
			}
    	} 
    	return num;  // 如果不冲突直接返回num
    }

    // 获取到顶部提示框元素
    var headerTip = tl.$(".center_tip_box")[0];

                             
    // 根据屏幕分辨率设置中间提示条的left条，一直定位在屏幕的最中间
	function headTipWidth(){
		headerTip.style.left = (wTools.getWin().W - headerTip.offsetWidth)/2 + "px";
	}

	// 顶部提示框的提示功能函数
	var timer = null;
    // 顶部中间的提示框函数，根据传入函数中的类名和字符串，来决定弹出什么提示内容
	function tipFn(className,str){

		// 提前清掉，如果存在让它马上回到初始位置，重新弹出提示
		clearInterval( headerTip.timer );
		clearTimeout( timer );
		headerTip.style.top = -32 + "px";
		// 如果存在第一个元素就清掉，不然下次还会append
		if( headerTip.firstElementChild ){
			headerTip.removeChild(headerTip.firstElementChild);
		}
		
		// 动态创建一个div
		var oDiv = document.createElement("div");
		oDiv.className = className;              // 设置div的类名
		oDiv.innerHTML = str;                    // 设置div的内容
		headerTip.appendChild(oDiv);             // 将div放到提示框里
		// 将headTip放到页面的中间，oDiv撑开headerTip，才能放到最中间
		headTipWidth();	

		// 300ms向下运动，停留2000ms，300ms向上运动
		MTween(headerTip,"top",300,0,"linear",function (){  // 让headerTip向下运动 
			tiemr = setTimeout(function(){               // 2s之后收起
				MTween(headerTip,"top",300,-32,"linear",function (){
					// headerTip移除div，如果没有第一个元素就返回，连续执行会提前remove
					if( !headerTip.firstElementChild ) return;
					headerTip.removeChild(headerTip.firstElementChild);
				});
			},2000);
		})
	}

	// 判断是否重名函数，传入的obj为某一个文件夹，新建和重命名时会用到该函数
	function titleIsConflict(obj,n){
		// 得到所有文件的标题集合
		var titleName = tl.$(".titlename");
		// 循环所有文件来判断是否重名
		for( var i = 0; i < allFls.length; i++ ){
			if( allFls[i] != obj[n] ){  // 同一个元素不做比较
				//console.log(i);
				if( titleName[i].innerHTML == titleName[n].innerHTML ){
					// 已重名
					return true;
				} else if ( i == allFls.length - 1 ){
					//代表未重名
					return false;
				}
			}
		}
	}

	// 3.全选和单选
	// 获取到全选按钮
	var allCheck = tl.$(".checkall")[0];
	// 给全选按钮添加一个判断选中与否的状态
	allCheck.status = false;
	// 给全选绑定点击事件处理
	tl.addEvent(allCheck,"click",function (ev){
		//console.log(this.status);
		if( !this.status ){    // 让自己的状态的判断和每一个判断独立开，以免互相干扰
			tl.addClass(this,"checkall_sel");
		} else {
			tl.removeClass(this,"checkall_sel");
		}

		// 循环给children集合，根据全选状态，决定添加或者删除样式
		for( var i = 0; i < allList.length; i++ ){
			if( !this.status ){                      // 假如全选状态为false 
				// 当文件夹已经被选中，就跳过
				if( tl.hasClass(allList[i],"list_selected") )continue; 
				tl.addClass(allList[i],"list_selected");
				tl.addClass(cBox[i],"ck_show");
				tl.addClass(cBox[i],"ck_sel");
			} else { 
				// 当文件夹不是选中状态，也跳过
				if( !tl.hasClass(allList[i],"list_selected") )continue;
				tl.removeClass(allList[i],"list_selected");
				tl.removeClass(cBox[i],"ck_show");
				tl.removeClass(cBox[i],"ck_sel");
				//console.log(4321);
			}
			// 修改每一个children状态，children代表当前页面上的所有元素的数据
			// children是对象集合，allList
			//console.log(children);
			children[i].status = this.status;
			
		}
		this.status = !this.status;

	});

	tl.addEvent(allCheck,"mousedown",function (ev){
		// 如果第一个输入框为显示状态的时候，则取消冒泡，否则不取消
		// 点击document可以取消选中全选和单选
		var titleName = tl.$(".titlename");
		//console.log(!!titleName[0] === true,titleName[0].style.display === "none")
		if( !titleName[0] || titleName[0].style.display !== "none" ){
			ev.stopPropagation();
			ev.preventDefault();
		}
	});

	// 4.新建文件夹功能
    // 获取到新建文按钮
    var createBtn = tl.$("#createBtn");
    var fileEdit = tl.$(".fileedit");
	var changeInput = tl.$(".filename");
	var titleName = tl.$(".titlename");

	function cancelOrChangeName(ev){
    	for( var i = 0; i < allList.length; i++ ){
  			if( fileEdit[i].style.display === "block" ){
  				//console.log(fileEdit[i],i);
  				//console.log(changeInput[i].value,titleName[i].innerHTML)
  				if( changeInput[i].value == "" ){
  					mainFileCon.removeChild(allFls[i]);
  				} else {
  					if( changeInput[i].value != titleName[i].innerHTML ){
	  					titleName[i].innerHTML = changeInput[i].value;
	  					tipFn("success_tip","更名成功");
	  					for( var j = 0; j < datas.length; j++ ){
	  						if( data.files[j].id == allList[i].dataset.fileId){
	  							data.files[j].title = titleName[i].innerHTML;
	  						}
	  					}
	  				}
	  				titleName[i].style.display = "block";
	  				fileEdit[i].style.display = "none";
  				} 
  				addFileEventFn();
  			} 
  		}
  		ev.stopPropagation();
	}

    tl.addEvent(createBtn,"mousedown",cancelOrChangeName);

    // 给新建文件夹按钮绑定点击事件
    tl.addEvent(createBtn,"click",function(ev){
    	
    	var obj = new Object();
    	// 随机创建一个id为10000以内的数
    	obj.id = getRandomId();
    	// 根据文件路径导航区的id找到新文件夹的pid
    	obj.pid = parseInt(mainPath.lastElementChild.dataset.fileId);
    	// 默认新建的文件的状态为未选中-false
    	obj.status = false;
    	// 标题和type待定
    	obj.title = null;
    	obj.type = null;

    	// 获取到标题框和input框，要通过输入input的内容来确定标题框的内容

		mainFileCon.innerHTML = createFileStrFn(obj) + mainFileCon.innerHTML;
		addFileEventFn();
		titleName[0].style.display = "none";
		fileEdit[0].style.display = "block";
		changeInput[0].focus();

    	tl.addEvent(changeInput[0],"mousedown",function(ev){
    		ev.stopPropagation();
    	})
		

    	function createFileIsSuccess(){

    		// 当第一个input不存在的时候，下边的操作都不执行
			if( !changeInput[0] ) {
				return;
			};
			// 存在的话就获取
			var value = changeInput[0].value;
			
			if( value ){ // 第一个输入框有内容的
				// 先让第一个title区域的内容修改为输入框的内容再进行重名比较
				titleName[0].innerHTML = value;
				if( changeInput[0].value.lastIndexOf(".") == -1 ){  // 判断文件名中有没有"."
					obj.type = "file";
				}

				// 检测是否重名，true为重名
				if( titleIsConflict(allFls,0) ){
					tipFn("alert_tip","文件名有冲突，请重新命名");
					mainFileCon.removeChild(mainFileCon.firstElementChild);
					addFileEventFn();
				} else {  // 未重名
    				obj.title = value;              // obj.title为value值
    				changeInput[0].value = "";				 // 先让第一个输入框置空
    				fileEdit[0].style.display = "none";      // 让第一个input容器隐藏
    				tipFn("success_tip","新建文件夹成功");	 // 提示框弹出新建成功
    				
    				children.unshift(obj);     // 当创建成功时，将obj放入children中，以便下次渲染
    				datas.unshift(obj);		   // 同时修改原数据，以便寻找子/父集合

    				// id为导航路径最后一个元素的dataset.fileId
					var id = parseInt(mainPath.lastElementChild.dataset.fileId);
					// 重新渲染三部分内容
					togetherThreeHtmlAndEvent(id);	
				}
			} else {
				if( fileEdit[0].style.display !== "none" ) {
					mainFileCon.removeChild(mainFileCon.firstElementChild);
				}
				if( !mainFileCon.innerHTML ) fileEmpty.style.display = "block";
				addFileEventFn();
			}
			
    		// 每次执行完成之后需要清除绑定在它上的事件
    		// 如果没清除，会越绑越多，最终产生多次执行的错误
    		tl.removeEvent(document,"mousedown",createFileIsSuccess); 
    	}

    	// 键盘按下enter键的时候，判断输入的内容是否为空，如果为空，则删除该结构
    	tl.addEvent(fileEdit[0],"keydown",function (ev){

    		if( ev.keyCode === 13 ){  // 当按下回车键时
    			createFileIsSuccess();
    		}
    		
    	})

		// 鼠标按下时，判断输入的内容是否为空
		tl.addEvent(document,"mousedown",createFileIsSuccess)
    	
   		ev.stopPropagation();          // 对新建文件夹取消click冒泡

    })

	// 寻找哪些文件是选中的
	function whoSelected(obj,classNames,hasClassName){
		var arr = [];
		for( var i = 0; i < obj.length; i++ ){
			var cBox = wTools.$(classNames,obj[i])[0];
			if( tl.hasClass(cBox,hasClassName) ){
				arr.push(obj[i]);  // 把选中的文件夹添加到数组中
			} 
		}
		return arr;  // 把装有选中文件夹的数组返回出去
	} 

	// 5.删除文件功能
	// 给删除文件夹绑定点击事件处理
	var deleteBtn = tl.$("#deleteBtn");
	var deleteBox = tl.$("#del_tip_box");        // 获取到删除提示框
	var mask = tl.$("#mask");                    // 获取到遮罩层
	var close = tl.$(".alert_box_close",deleteBox)[0];     // 获取到关闭按钮
	var enSure = tl.$(".g_btn",deleteBox)[0];	 // 获取到确认按钮
	var cancel = tl.$(".g_btn",deleteBox)[1];	 // 获取到取消按钮
	var AlertHeaderInner = tl.$(".inner",deleteBox)[0];    // 获取到弹框的头部区域
	var AlertInnerWrap = tl.$(".inner_wrap",deleteBox)[0]; // 获取到弹框公共内容容器
	var AlertMoveContent = tl.$(".move_inner",deleteBox)[0];
	var AlertDelContent = tl.$(".del_inner",deleteBox)[0];

	// 为了防止给弹框多次绑定click事件处理，在外边只绑定一次就可以
	tl.addEvent(close,"click",function (){       // 点击关闭，取消删除
		deleteBox.style.display = "none";
		mask.style.display = "none";
	});
	// 同样，给弹框按钮只绑定一次click事件处理
	tl.addEvent(cancel,"click",function (){   // 点击取消，取消删除
		deleteBox.style.display = "none";
		mask.style.display = "none";
	});

	tl.addEvent(deleteBox,"mousedown",function (ev){   // 取消deleteBox的冒泡行为
		ev.stopPropagation();
	});

	tl.addEvent(deleteBtn,"mousedown",cancelOrChangeName);

	// 给删除按钮绑定click事件处理
	tl.addEvent(deleteBtn,"click",function (ev){

		var status = false;    // 判断有没有选中的文件，false为没有选中按钮
		var arr = whoSelected(allList,".ck_box","ck_sel");  // arr为选中元素集合

		if( arr.length === 0 ){        // arr长度为0时，为没有选中的文件
			tipFn("alert_tip","请选择文件");     // 提示请选择文件
		} else {               // arr长度不为0时，代表有选中的文件
			
			deleteBox.style.display = "block";   // 显示删除提示框
			mask.style.display = "block";        // 显示遮罩

			AlertHeaderInner.innerHTML = "删除文件";　// 修改标题名字
			AlertDelContent.style.display = "block";　// 让删除内容部分显示
			AlertMoveContent.style.display = "none";

			// 当弹出框deleteBox显示的时候，根据弹出框的宽和高，动态设置left和top值
			posAlertBox();
			
			
			tl.addEvent(enSure,"click",function (){   // 点击删除时，删除选中的文件

				deleteBox.style.display = "none";
				mask.style.display = "none";

				// for循环删除文件夹
				for( var i = 0; i < allList.length; i++ ){
					//  取到当前文件的id
					var fileId = allList[i].dataset.fileId;

					// 当这个文件为选中状态时
					if( tl.hasClass(allList[i],"list_selected") ){
						// 从文件区域移除该文件
						mainFileCon.removeChild(allFls[i]);

						// 同时修改children
						children.splice(i,1);

						// 循环修改data原数据中的内容
						for( var j = 0; j < data.files.length; j++ ){
							// 因为id的唯一的，所以找到data中的对应的id并且删除之后，就break
							// 继续执行下一次for循环
							if( datas[j].id == fileId ){
								data.files.splice(j,1);
								break;
							}
						}
						// 没删除一次allList的长度减一，所以需要i--
						i--;

						// 状态改变说明有选中要删除的文件
						status = true;
					}
				}

				// 删除完成之后，弹出文件删除成功的提示
				tipFn("success_tip","删除文件成功");
				nullFileAreaBg();

				// 渲染树形菜单
		  		treeMenu.innerHTML = createTreeHtml(datas,0);
		  		// 给树形菜单添加点击事件处理
		  		treeMenuAddEvent(fileId);

				// 删除之后，判断内容区域有没有文件
				if( !mainFileCon.firstElementChild && tl.hasClass(allCheck,"checkall_sel") ){
					// 如果没有文件并且全选处于选中状态，则移出选中样式
					tl.removeClass(allCheck,"checkall_sel");
					// 同时将全选框的状态改为false，代表未选中
					allCheck.status = false;
				}

				// 删除完成之后，需要重新绑定事件
				addFileEventFn();

			});


		}
	});

	function posAlertBox(){
		var l = (tl.getWin().W - deleteBox.offsetWidth) / 2 + "px";
		var t = (tl.getWin().H - deleteBox.offsetHeight) / 2 + "px";
		deleteBox.style.margin = 0;
		deleteBox.style.left = l;
		deleteBox.style.top = t; 
	}

	// 窗口大小改变的时候，也要让弹出框位于页面的最中间
	tl.addEvent(window,"resize",posAlertBox);

	// 6.重命名按钮进行名字修改
	var renameBtn = tl.$("#renameBtn");

	tl.addEvent(renameBtn,"mousedown",cancelOrChangeName);

	tl.addEvent(renameBtn,"click",function (ev){

		var text = "";   // 定义空字符串用来存放
		var num = null;  // num用来存元素的下标，修改children中对应下标的元素
		var id = parseInt(mainPath.lastElementChild.dataset.fileId);  // 找到父id
		var fileId = null;
		var arr = whoSelected(allList,".ck_box","ck_sel");   // 获取到选中元素的集合

		if( arr.length === 0 ){      // 长度为0时

			tipFn("alert_tip","请选择文件");     // 提示请选择文件

		} else if( arr.length > 1 ) {    // 长度大于1时

			tipFn("fail_tip","只能对单个文件重命名");  // 提示只能对单个文件重命名

		} else {   // 长度等于1时

			// 通过for循环找到选中的那个元素是第几个，要同步到children里和data里
			for( var i = 0; i < allList.length; i++ ){
				if( allList[i] == arr[0] ){
					num = i;             //  找到并记录到num中
					fileId = allList[i].dataset.fileId; // 记录下选中元素的id，修改data
					break;
				}
			}

			var titleName = tl.$(".titlename",arr[0])[0]; // 获取到数组中存的那一项的title
			var fileEdit = tl.$(".fileedit",arr[0])[0];	  // 获取到数组中存的那一项的input容器
			var iptEle = fileEdit.firstElementChild;  // 获取到input输入框

			text = titleName.innerHTML;               // 将输入框的内容存下来
			titleName.style.display = "none";		  // 让title隐藏
			fileEdit.style.display = "block";		  // 让input框显示
			iptEle.focus();              // input获取焦点
			iptEle.value = text;		 // 将保存下来的内容赋值给value
 			iptEle.select();			 // 并且让内容处于选中状态

 			// 给鼠标添加mousedown下事件
			tl.addEvent(document,"mousedown",downFn);

			tl.addEvent(document,"keyup",downFn);

			function downFn(ev){

				if( ev.keyCode && ev.keyCode !== 13 ) return;

				for( var i = 0; i < allList.length; i++ ){
					var allTitle = tl.$(".titlename",allList[i])[0];
					if( allTitle != titleName && iptEle.value === allTitle.innerHTML ){
						tipFn("fail_tip","文件名有冲突，请重新命名");
						return;
					} 
				}

				if( text != iptEle.value ){
					tipFn("success_tip","更名成功");
				}

				text = iptEle.value;  // 将输入框的内容存下来
				titleName.style.display = "block"; // 显示title
				titleName.innerHTML = text;        // 将存下来的内容放到title里
				fileEdit.style.display = "none";   // 隐藏输入

				tl.removeClass(arr[0],"list_selected");  // 重命名成功之后移除修改文件的样式
				var cBox = tl.$(".ck_box",arr[0])[0];   
				tl.removeClass(cBox,"ck_sel");     // 重命名之后移除当前文件下单选框的选中样式
				tl.removeClass(cBox,"ck_show");	   // 重命名之后移除当前文件下单选框的显示样式


				children[num].title = text;		   // 同时修改对应children下的title
				for( var i = 0; i < data.files.length; i++ ){  // 循环并找到重命名元素并修改title
					if( data.files[i].pid === id && data.files[i].id === fileId ){
						data.files[i].title = text;
					}
				}

				// 渲染树形菜单
		  		treeMenu.innerHTML = createTreeHtml(datas,0);
		  		// 给树形菜单添加点击事件处理
		  		treeMenuAddEvent(fileId);
		  		if( titleName.style.display === "block" ){
					tl.removeEvent(document,"keyup",downFn); // 移除事件
					tl.removeEvent(document,"mousedown",downFn);
		  		}
			}
		}
	});

	
	// 7.对页面进行刷新处理
	var refresh = tl.$("#refresh");
	// 给刷新绑定点击事件
	tl.addEvent(refresh,"click",function(ev){
		
		// id为导航路径最后一个元素的dataset.fileId
		var id = parseInt(mainPath.lastElementChild.dataset.fileId);
		// 重新渲染页面以及绑定事件
		renderHtmlAndAddEvent(id);

	});

	var disX,disY;
	var newDiv = null;        // newDiv为选框div
    var shadowTarget = null;  // 用来存储拖拉出来剪影的文件
    var tips = null;          // 用来存储鼠标下边的“挡刀”div

	// 鼠标按下拖拉一个选框出来
	function dragChooseArea(ev){
		var diffX = ev.clientX - disX;  // move的时候记录距离为选框的宽
		var diffY = ev.clientY - disY;	// move的时候记录距离为选框的高
		if( Math.abs(diffX) > 20 || Math.abs(diffX) > 20 ){
			if( !newDiv ){  // div不存在的时候创建div
				newDiv = document.createElement("div");
				newDiv.style.position = "absolute";
				newDiv.style.zIndex = 50;
				newDiv.style.background = "#147ade"
				newDiv.style.border = '2px dashed #737373';
				newDiv.style.opacity = 0.6;
				document.body.appendChild(newDiv);   // 将div插入body中
			}
			newDiv.style.width = Math.abs(diffX) + "px";  // 设置选框的宽度和高度
			newDiv.style.height = Math.abs(diffY) + "px";
			newDiv.style.left = Math.min(disX,ev.clientX) + "px";
			newDiv.style.top = Math.min(disY,ev.clientY) + "px";
			if( diffX >= tl.getWin().W - disX ){ 
				newDiv.style.width = diffX - 5 + "px";
			}
			if( diffY >= tl.getWin().H - disY ){
				newDiv.style.height = diffY - 5 + "px";
			}

			for( var i = 0; i < allFls.length; i++ ){
				if( tl.isCollide(newDiv,allList[i]) && !tl.hasClass(cBox[i],"ck_sel") ){
					tl.addClass(allList[i],"list_selected");
					tl.addClass(cBox[i],"ck_sel ck_show");
				}
			}
		}
	}

	function cancelMoveAndUpEvent(){

		if( whoSelected(allList,".ck_box","ck_sel").length === allList.length
			&& allList.length ){
			tl.addClass(allCheck,"checkall_sel");
		}

		tl.removeEvent(document,"mousemove",dragChooseArea);  // up时候移除move事件
		tl.removeEvent(document,"mouseup",cancelMoveAndUpEvent); // 移除up事件
		if( newDiv ){
			document.body.removeChild(newDiv);  // up的时候，移除newDiv
			newDiv = null;                      // 清空newDiv
		}  
	}

	// 8.鼠标按下拉选框
	tl.addEvent(document,"mousedown",function (ev){
		ev.preventDefault();

		disX = ev.clientX;   // down的时候记录X的位置
		disY = ev.clientY;	 // down的时候记录Y的位置
		newDiv = null;
		var target = ev.target;
		//拖拽移动
        if( tl.parents(target,".list") ){
        	var curPar = tl.parents(target,".list");
        	if( !tl.hasClass(cBox[curPar.index],"ck_sel") ){
        		shadowTarget = null;
        		for( var i = 0; i < allList.length; i++ ){
        			tl.removeClass(allList[i],"list_selected");
        			tl.removeClass(cBox[i],"ck_sel");
        			tl.removeClass(cBox[i],"ck_show");
        		}
        	}
            tl.addEvent(document,"mousemove",moveFileFn);
            tl.addEvent(document,"mouseup",upFileFn);
            shadowTarget = tl.parents(target,".list");
        	
            //console.log(shadowTarget);
            return;
        }

		tl.addEvent(document,"mousemove",dragChooseArea);
		tl.addEvent(document,"mouseup",cancelMoveAndUpEvent);

		// document  down下去的时候，让所有单选和全选的状态都清空
		for( var i = 0; i < cBox.length;i++ ){
			if( !tl.hasClass(cBox[i],"ck_show") ) continue;
			tl.removeClass(cBox[i],"ck_show");
			tl.removeClass(cBox[i],"ck_sel");
			tl.removeClass(allList[i],"list_selected");
		}
		// 移除全选的选中状态
		tl.removeClass(allCheck,"checkall_sel");
		allCheck.status = false;
	})

	// 8.1清除在导航区，树形菜单区，文件操作区，文件路径导航等区域mousedown的冒泡行为

	var leftBtnArea = tl.$(".le_area")[0];
	var rightBtnArea = tl.$(".ri_area")[0];
	var treeMenuArea = tl.$(".con_sidebar")[0];
	var current = tl.$(".current",listPathNav)[0];

	// 给左侧微云导航区域添加取消冒泡和默认事件
	tl.addEvent(leftBar,"mousedown",function (ev){  
		ev.stopPropagation();
		ev.preventDefault();
	})
	// 给操作文件的一排按钮区域添加取消冒泡和默认事件
	tl.addEvent(leftBtnArea,"mousedown",function (ev){
		ev.stopPropagation();
		ev.preventDefault();
	})
	// 右侧操作文件显示方式区域
	tl.addEvent(rightBtnArea,"mousedown",function (ev){
		ev.stopPropagation();
		ev.preventDefault();
	})
	// 树形菜单区域
	tl.addEvent(treeMenuArea,"mousedown",function (ev){
		ev.stopPropagation();
		ev.preventDefault();
	})
	// 所有文件路径导航的a标签
	for( var i = 0; i < mainPathA.length; i++ ){
		tl.addEvent(mainPathA[i],"mousedown",function (ev){
			ev.stopPropagation();
			ev.preventDefault();
		})
	}
	// 文件路径导航当前的元素current
	tl.addEvent(current,"mousedown",function (ev){
		ev.stopPropagation();
		ev.preventDefault();
	})

	// 9.移动到功能模块
	var moveFileTo = tl.$("#moveTo");
	var movePathTree = tl.$(".move_path_cont")[0];

	tl.addEvent(moveFileTo,"mousedown",cancelOrChangeName);

	tl.addEvent(moveFileTo,"click",function (ev){

		var selectArr = whoSelected(allList,".ck_box","ck_sel");
		if( !selectArr.length ){

			tipFn("alert_tip","请选择文件");

		} else {

			deleteBox.style.display = "block";   // 显示删除提示框
			mask.style.display = "block";        // 显示遮罩
			
			AlertHeaderInner.innerHTML = "选择存储位置";　// 修改标题名字
			AlertDelContent.style.display = "none";　// 让删除内容部分显示
			AlertMoveContent.style.display = "block";　// 让树形菜单路径内容显示

			posAlertBox();                       // 弹出框居中

			movePathTree.innerHTML = createTreeHtml(datas,-1);

			tl.addClass(movePathTree,"tree_menu_wrap");  
			// 给左侧树形菜单父级加了一个class
			// 如果想要把移动到的内容和左侧树形菜单渲染一致
			// 只需要公用同一个父级的class

			var moveId = 0;   // 保存要移动的文件id

			moveFileTo.isMove = true  // 默认可以拖动

            var ableClose = true;  //默认是不可以关闭的

        	tl.removeEvent(enSure,"click",closeMoveTo);
			tl.addEvent(enSure,"click",closeMoveTo);

            //可以移动 不可以关闭
            function closeMoveTo(ev){
            	
	            if( !ableClose ){

	                // 移动数据，重名的不能移动
	                var childrenTitle = dataAction.getChildrenById(datas,moveId);
	                var a = true;
	                b:for( var i = 0; i < selectArr.length; i++ ){
	                    a = true;
	                    var getData = dataAction.getDataById(datas,selectArr[i].dataset.fileId);
	                    //要移动的数据，不能存在于被移入的数据的子数据中 
	                    //判断的依据是数据的 title
	                    for( var j = 0; j < childrenTitle.length; j++ ){
	                        if( childrenTitle[j].title == getData.title ){
	                            tipFn("alert_tip","部分移动失败,重名了");
	                            a = false;
	                            //continue b;
	                            break;
	                        }
	                    }

	                    if( a ){
	                        getData.pid = moveId;
	                    }  
	                }

	                //文件区域渲染
	                var cur = tl.$(".current")[0].dataset.fileId;

	                togetherThreeHtmlAndEvent(cur);
	                nullFileAreaBg();

	                //定位到某个菜单上
	                tl.addClass(tl.getTreeById("title_box",cur),"list_selected");
	                
	                moveFileTo.isMove = false;

					deleteBox.style.display = "none";
					mask.style.display = "none";
	            }
            }

	        //填写内容
	        var alertBox = tl.$(".alert_box")[0]
	        var fileName = tl.$(".file_name",alertBox)[0];
	        var fileNum = tl.$(".file_num",alertBox)[0];
	        var selectFirstId = selectArr[0].dataset.fileId;

	        //错误信息提示
	        var error = tl.$(".err",alertBox)[0];

	        fileName.innerHTML = dataAction.getDataById(datas,selectFirstId).title;
	        if( selectArr.length>1 ){

	            fileNum.innerHTML = '等 '+selectArr.length+' 个文件 ';
	        }

	        var prevId = 0;

       		tl.addEvent(movePathTree,"click",function (ev){

	            var target = ev.target;
	            if( target = tl.parents(target,".title_box") ){
	            	console.log(target)
	            	ableClose = false;
	                //点击菜单的那个id
	                var clickFileId = target.dataset.fileId;
	                
	                //console.log(tl.getTreeById("title_box",prevId,movePathTree))
	                tl.removeClass(tl.getTreeById("title_box",prevId,movePathTree),"list_selected");
	                tl.addClass(target,"list_selected");

	                prevId = clickFileId;

	                /*
	                    1. 不能移动到被移动的这些元素的父级上
	                    2. 不能移动到本身或子元素下
	                    3. 可以移动的文件夹下，重名的不能移动
	                */ 

	                error.innerHTML = "";

	                //被移动的元素的父id
	                var firstSelectId = selectArr[0].dataset.fileId;

	                var parent = dataAction.getParent(datas,firstSelectId);

	                if( clickFileId == parent.id ){
	                    error.innerHTML = "文件已经在当前文件夹下";
	                    ableClose = true;
	                } 

	                //2. 不能移动到本身或子孙元素下
	                //[1,2,3,4,5]

	                //selectArr 选中元素的集合
	                //clickFileId 点击树形菜单的那个菜单的id

	                for( var i = 0; i < selectArr.length; i++ ){
	                    //找到选中元素的所有的子孙数据
	                    var selectId = selectArr[i].dataset.fileId;
	                    var children = dataAction.getChildsAll(datas,selectId);

	                    for( var j = 0; j < children.length; j++ ){
	                        if( children[j].id == clickFileId ){
	                            error.innerHTML = "不能移动到本身或子孙元素下";
	                            ableClose = true;
	                            break;
	                        }
	                    }
	                }

	                moveId = clickFileId;

	            } 
	            ev.stopPropagation();
	        })

		}
	})


	// 10.手动移动文件
	var shadow = null;
    var isDrag = false;  //是否正在拖拽剪影
    var isCollideFile = null;  //碰上的那个元素

    // 移动文件的剪影函数
    function moveFileShadow(){
        var newDiv = document.createElement("div");   // 常见一个div
        newDiv.className = 'drag-helper ui-draggable-dragging';

        var html = '<div class="icons">'
            +'<i class="icon icon0 filetype icon-folder"></i>'  
        +'</div>'
        +'<span class="sum">1</span>';

        newDiv.innerHTML = html;
        return newDiv;
    }

    function moveFileFn(ev){

    	if( Math.abs(ev.clientX - disX ) > 10 || Math.abs(ev.clientY - disY ) > 10 ){

    		if( !shadow ){  // 如果剪影为div为空
    			shadow = moveFileShadow();          // 创建一个shadow
    			document.body.appendChild(shadow);  // 添加到body中
    			shadow.style.display = "block";     // 并且显示shadow
    			tips = document.createElement("div"); // 创建一个div
    			tips.style.cssText = "width: 10px; height: 10px; position: absolute;left: 0; top: 0; z-index:51;"  // tips的作用是防止点击拖动文件时触发document的绑定事件(挡刀的...)
    			document.body.appendChild(tips);
    		}

    		isDrag = true;

    		tips.style.left = ev.clientX - 4 + "px";  //  tips的位置是随着鼠标移动的
    		tips.style.top = ev.clientY - 4 + "px";

    		shadow.style.left = ev.clientX + 5 + "px";
    		shadow.style.top = ev.clientY + 5 + "px";

    		if( !tl.hasClass(shadowTarget,"list_selected") ){
    			for( var i = 0; i < allList.length; i++ ){
    				tl.removeClass(allList[i],"list_selected");
    				tl.removeClass(cBox[i],"ck_show ck_sel");
    			}

    			tl.addClass(shadowTarget,"list_selected");
    			var checkbox = tl.$(".ck_box",shadowTarget)[0];
    			tl.addClass(checkbox,"ck_show ck_sel");
    		}

    		// 计算框选到元素的个数
    		var selArr = whoSelected(allList,".ck_box","ck_show");
    		console.log(selArr.length);

    		var sum = tl.$(".sum",shadow)[0];
    		var icons = tl.$(".icons",shadow)[0];

    		sum.innerHTML = selArr.length;   // 显示剪影的个数和框选的个数一致
    		var str = '';
    		var len = selArr.length > 4 ? 4 : selArr.length;

    		// str中存的是剪影的个数，数组长度大于4时，最多4个剪影
    		for( var i = 0; i < len; i++ ){
    			str += '<i class="icon icon'+ i +' filetype icon-folder"></i>'
    		}

    		icons.innerHTML = str;

    		isCollideFile = null;

    		// 看是否和别的文件夹碰撞
    		
    		for (var i = 0; i < allList.length; i++) {
    			if( !indexOf(selArr,allList[i]) && tl.isCollide(tips,allList[i]) ){
    				allList[i].style.background = "rgba(38,144,250,.5)";
    				allList[i].style.border = "1px solid #e7eff9";
    				tl.removeClass(cBox[i],"ck_show ck_sel");
    				isCollideFile = allList[i];
    			} else {
    				allList[i].style.background = "";
    				allList[i].style.border = "1px solid #fff";
    			}
    		}
    	}
    }

    function indexOf(arr,item){

        for( var i = 0; i < arr.length; i++ ){
            if( arr[i] === item ){
            	return true;
            }
        }  
        return false;

    }

    function upFileFn(){

    	tl.removeEvent(document,"mousemove",moveFileFn);
    	tl.removeEvent(document,"mouseup",upFileFn);
    	if( shadow ){
    		document.body.removeChild(shadow);
    		document.body.removeChild(tips);

    		shadow = null;
    	}

    	// 如果碰上了，把选中元素对应的数据的pid变成被碰上的元素对应的id，变成其子元素
    	if( isCollideFile ){
    		var moveId = isCollideFile.dataset.fileId;
    		var selArr = whoSelected(allList,".ck_box","ck_sel");

    		var children = dataAction.getChildrenById(datas,moveId);
    		var aFor = true;

    		bFor: for( var i = 0; i < selArr.length; i++ ){
    			aFor = true;
    			var getData = dataAction.getDataById(datas,selArr[i].dataset.fileId)
    			// 要移动的数据不能存在于被移入数据的子数据中，根据数据title判断
    			for( var j = 0; j < children.length; j++ ){
    				if( children[j].title === getData.title ){
    					tipFn("alert_tip","部分移动失败，已重名");
    					aFor = false;
    					// continue bFor 
    					break;
    				}
    			}
    			if( aFor ){
    				getData.pid = moveId;
    			}
    		}

			// 获取到当前文件导航区域最后一个文件的dataset.fileId，用来渲染页面
			var current = tl.$(".current")[0].dataset.fileId;
			// 重新渲染三部分内容，并且添加各种事件
			togetherThreeHtmlAndEvent(current);

			isCollideFile = null;

    	}

    	isDrag = false;

    }

    // 11.显示隐藏树形菜单
    var showTreeBtn = tl.$("#showBoxBtn");

    var fileArea = tl.$(".con_detail_menu")[0];

    showTreeBtn.status = false;         // status为false代表树形菜单默认是展开状态
    
    tl.addEvent(showTreeBtn,"click",function (){  // 点击控制显示/隐藏按钮
    	if( !this.status ){                       // 当状态为false时代表为展开状态
    		treeMenuArea.style.display = "none";
    		fileArea.style.marginLeft = 0;
    		tl.removeClass(this,"active");        // 移除展开状态的class
    	} else {							      // 当状态为false时代表为闭合状态
    		treeMenuArea.style.display = "block";
    		fileArea.style.marginLeft = "184px";
    		tl.addClass(this,"active");        	  // 添加展开状态的class
    	}
    	this.status = !this.status;               // 每点击一次都改变一下状态
    })


 //    var selectRight = whoSelected(allList,".ck_box","ck_show");;
	// tools.addEvent(document,'mousedown',function(ev){
	//     if(rename.onOff){

	//         var select = whoSelect();
	//         var fileTitle = tools.$('.file-title',select[0])[0];
	//         var fileEdtor = tools.$('.file-edtor',select[0])[0];
	//         var edtor = tools.$(".edtor",select[0])[0];
	//         tools.removeClass(select[0],"active");
	//         tools.removeClass(select[0].firstElementChild,"conCheckbox");

	//         fileTitle.style.display = 'block';
	//         fileEdtor.style.display = 'none';


	//     }
	//     ev.stopPropagation();
	//     if(delectBtn.onOff ) return;
	//     selectRight = whoSelect();
	    
	// })

 //    //鼠标右键
	// tl.addEvent(document,'contextmenu',function(ev){

	//     ev.preventDefault();
	//     if(mask.style.display === 'block') return;
	//     var target = ev.target;
	//     target = tl.parents(target,".list") 
	//     // target = tl.parents(target,".list");
	//     if(ev.button !== 2) return;

	//     if(selectRight.length <= 1){
	//         ////只有在文件夹上点击的时候才可以出现右键菜单

	//         if( target ){
	//             //显示自定义菜单
	//             menu.style.display = 'block';
	//             //给自定义菜单定位
	//             menu.style.left = ev.clientX + 'px';
	//             menu.style.top = ev.clientY + 'px';

	//             for(var i = 0; i < allList.length; i++){
	//                 tl.removeClass(allList[i],'active');
	//                 allList[i].firstElementChild.style.opacity = 0;
	//                 tl.removeClass(allList[i].firstElementChild,'conCheckbox');
	//             }

	//             tl.addClass(target,"active");
	//             target.firstElementChild.style.opacity = 1;
	//             tl.addClass(target.firstElementChild,"conCheckbox");
	//         }
	//     }else if(selectRight.length === checkboxs.length){
	//         menu.style.display = 'block';
	//         //给自定义菜单定位
	//         menu.style.left = ev.clientX + 'px';
	//         menu.style.top = ev.clientY + 'px';
	//     }else{      
	//         //选中几个文件的时候,判断当前点击的文件是否选中,
	//         //如果当前选中,在自己身上右键的时候,显示右键,
	//         //不在自己身上右键的时候,清空所有的,只在当前点击的自己身上勾选上
	//         var targetBox = target.firstElementChild;
	//         //当前点击的元素的身上有勾选框
	//         if( tl.hasClass(targetBox,"conCheckbox") ){
	//             //////当前加上class
	//             tl.addClass(target,"active");
	//             target.firstElementChild.style.opacity = 1;
	//             tl.addClass(target.firstElementChild,"conCheckbox");

	//         }else {     //当前点击的元素的身上没有勾选框
	//             //清空所有的
	//             for(var i = 0; i < allList.length; i++){
	//                 tl.removeClass(allList[i],'active');
	//                 allList[i].firstElementChild.style.opacity = 0;
	//                 tl.removeClass(allList[i].firstElementChild,'conCheckbox');
	//             }
	//             //给自己身上加
	//             tl.addClass(target,"active");
	//             target.firstElementChild.style.opacity = 1;
	//             tl.addClass(target.firstElementChild,"conCheckbox");
	//         }   

	//         menu.style.display = 'block';
	//         //给自定义菜单定位
	//         menu.style.left = ev.clientX + 'px';
	//         menu.style.top = ev.clientY + 'px';     
	//     }
	// })



	// tl.addEvent(delectBtn,'mousedown',function(ev){
	//     ev.stopPropagation();
	// })
	// //////右键删除 
	// tl.addEvent(delectBtn,'mouseup',function(ev){
	//     delectBtn.onOff = true;
	//     ev.stopPropagation();

	//     if(ev.button === 2 ) return;
	//     alertBox.style.display = mask.style.display ='block';

	//     alertBox.style.left = (views().W - alertBox.offsetWidth)/2 + "px";
	//     alertBox.style.top = (views().H - alertBox.offsetHeight)/2 + "px";

	//     okCancleClose();        //点击确定
	//     menu.style.display = 'none';
	// })

	// //y右键重命名阻止冒泡
	// tl.addEvent(renameBtn,'mousedown',function(ev){
	//     ev.stopPropagation();
	//     if(ev.button === 2 ) return;
	// });
	// //右键重命名
	// tl.addEvent(renameBtn,'mousedown',function(ev){
	//     ev.stopPropagation();
	// })
	// tl.addEvent(renameBtn,'mouseup',reNameFn);

	// //右键移动到

	// tl.addEvent(moveBtn,'mousedown',function(ev){
	//     ev.stopPropagation();
	// })
	// tl.addEvent(moveBtn,'mouseup',moveBtnFn);


})(wTools)
