~function (){
	// 1.页面底部导航
	var navUl = $("#nav");   // 获取导航UL
	var navLine = $("#nav-highlight");   // 获取高亮下划条
	var allNavAs = $("#nav a");
	var allNavSpan = $("#nav a span");
	navLine.css({
		left:Math.floor(allNavSpan.eq(0).offset().left)  // 设置高亮条在第一个导航下
	})
	allNavAs.each(function (index,item){         // 循环所有的底部导航
		$(this).mouseover(function (index,item){
			var ind = $(this).parent().index();    // 获取当前li的索引
			navLine.css({
				// 鼠标滑动时，设置span的宽度
				width: Math.floor(allNavSpan.eq(ind).width()),
			});
			// 设置高亮条的left值
			navLine.stop().animate({
				left:Math.floor(allNavSpan.eq(ind).offset().left)
			},"fast","linear");
		});
	});
	// 移除ul时，重新设置高亮条的width和left
	navUl.mouseleave(function (){
		navLine.stop().animate({
			width: allNavSpan.eq(0).width(),
			left:allNavSpan.eq(0).offset().left
		},"fast","swing");
	});

	// 页面resize时要修改导航线的left值
	$(window).resize(function (){
		navLine.css({
			left:Math.floor(allNavSpan.eq(0).offset().left)
		})
	});
	
	// 2.页面侧边栏导航
	var navDot = $("#slidebar li")   // 获取所有导航点
	var len = navDot.length;       // 记录导航个数
	var n = 0;
	var nowTime = null;              // 用来存储时间戳
	var delay = 800;                 // 用来存储延迟时间
	var btnNextText = $(".button-next-text");    // 获取到向下箭头上面的文字

	var allStages = $("#stages .stage");   // 获取到所有的五个阶段div
	var lastNum = 0;                // 用来记录上一次操作的stage的索引
	
	// 切换侧边栏导航函数
	function showWhich(elements,nowEle,removeClass,addClass){
		elements.each(function (){
			$(this).removeClass(removeClass);
		})
		nowEle.addClass(addClass);
	}

	// upDown函数用于确定向上还是向下运动
	function upDown(runStyle){
		if( runStyle === "up" ){
			// 向上滚
			n--;
			if( n < 0 ){
				n = 0;
				return;
			}
			// 当回到第一屏的时候让文字淡入
			if( n === 0 ){
				// 让向下箭头上面的文字一秒钟内淡入
				btnNextText.animate({opacity:1},2000);
				console.log(1);
			}

			allStages.eq(n).removeClass("stage-state-out");
			allStages.eq(n).addClass("stage-state-in stage-state-out-in");
			allStages.eq(lastNum).removeClass("stage-state-in stage-state-out-in");
		} else {
			// 向下滚
			n++;
			if( n > len - 1 ){
				n = len - 1;
				return;
			}
			console.log(n);
			// 让向下箭头上面的文字一秒钟内淡出
			btnNextText.animate({opacity:0},1000);

			allStages.eq(lastNum).addClass("stage-state-in stage-state-out");
			allStages.eq(n).addClass("stage-state-in");
		}
		lastNum = n;
		showWhich(navDot,navDot.eq(n),"slide-active","slide-active");
	}

	// 点击导航的时候，要切换状态，并且同步修改n值
	navDot.click(function (){

		allStages.eq(0).addClass("stage-state-in"); 
		n = $(this).index();
		// 当点击的索引大于上一次点击的索引时
		if( n > lastNum ){
			for( var i = 0; i < n; i++ ){
				allStages.eq(i).addClass("stage-state-in stage-state-out");
			}
			allStages.eq(n).addClass("stage-state-in");
		} else if( n < lastNum ) {       // 当点击的索引小于上一次点击的索引时
			for( var i = n; i < lastNum; i++ ){
				allStages.eq(i).removeClass("stage-state-out stage-state-in");
			}
			allStages.eq(lastNum).removeClass("stage-state-in stage-state-out-in");
			allStages.eq(n).addClass("stage-state-in stage-state-out-in");
		}
		// 当上一次索引为0时，需要给向下按钮添加文字说明
		if( lastNum === 0 ){
			btnNextText.animate({opacity:0},1000);
		} 
		// 当前点击的索引为0时，去掉向下按钮的文字说明
		if( n === 0 ){
			btnNextText.animate({opacity:1},2000);
		}
		lastNum = n;               // 每次都要重新修改一下上次点击按钮的索引
		showWhich(navDot,$(this),"slide-active","slide-active");
	});

	// DisTime 用来解决连续滚动鼠标滚轮的时候，多次触发的情况，在delay时间段内只能触发一次
	function DisTime (lastTime,nowTime,delay){
		if( !nowTime ){  // 不存在代表第一次
			return true;
		} else if( lastTime - nowTime > delay ){
			return true;
		} else {
			return false;
		}
	}
	// 3.通过监测页面侧边栏的动画是否完成，看控制内容区域stages的切换
	// 监测侧边栏是否结束运动，如果结束运动才能触发滚动事件
	$("#slidebar").on("webkitAnimationEnd",function (){
		// 鼠标滚轮事件
		$(document).on("mousewheel DOMMouseScroll", function (e) {
			// 当处于第一屏触发滚动的时候给第一屏添加stage-state-in
			allStages.eq(0).addClass("stage-state-in"); 

			var lastRunTime = new Date().getTime();    //  设置时间戳
			
			if( DisTime(lastRunTime,nowTime,delay) ){   // 当时间间隔操作一段时间才可以触发下一次鼠标滚动或者键盘按键
				scrollDis();          // 时间戳函数
			}

			function scrollDis(){
				
				nowTime = new Date().getTime();
				var delta = (e.originalEvent.wheelDelta && (e.originalEvent.wheelDelta > 0 ? 1 : -1)) ||  // chrome & ie
							(e.originalEvent.detail && (e.originalEvent.detail > 0 ? -1 : 1));              // firefox
				if (delta > 0) {     // 向上运动
					upDown("up");
				} else if (delta < 0) {      // 向下运动
					upDown("down");
				}
				lastNum = n;       // 重新初始化lastNum，记录上一次索引
				// showWhich为控制侧边栏切换class的函数
				showWhich(navDot,navDot.eq(n),"slide-active","slide-active");
			}
			e.preventDefault();      

		});
		// 按下键盘的时候
		$(document).on("keydown",function (e){
			// 页面第一屏完成加载的时候，需要给第一屏加一个stage-state-in的状态
			allStages.eq(0).addClass("stage-state-in");
			// 获取当前时间
			var lastRunTime = new Date().getTime();
			if( !DisTime(lastRunTime,nowTime,delay) ) return;

			nowTime = new Date().getTime();
			if( e.keyCode === 38 ){
				upDown("up");
			} else if ( e.keyCode === 40 ){
				upDown("down");
			}
		});
	});

	// 给向下箭头添加点击事件，每点一次执行upDown一次
	var btnNextIco = $(".button-next-icon");
	btnNextIco.click(function (){
		upDown("down");
	});

	// 4.处理最后一屏文字标题和文字描述的显示隐藏
	var stage4Title = $("#stage-4  .stage-title li");
	var stage4Des = $("#stage-4 .stage-description li");

	stage4Title.each(function (){
		$(this).css("display","none");
	});
	stage4Title.eq(-1).css("display","block");

	stage4Des.each(function (){
		$(this).css("display","none");
	});
	stage4Des.eq(-1).css("display","block");

	// 5.页面最后一屏图标的滑入滑出
	var stage4Icon = $("#stage-4 .stage-4-icon");   // stage4Par的父级      
	var stage4Wrap = $(".stage-4-par-wrap");      // stage-4-items 元素的直接父级
	var stage4Par = $(".stage-4-dir-par");    //  为每个icon的div容器
	var st4Items = $(".stage-4-items");       // animateNum用于存储执行到哪一个动画
	var animateNum = 0;    //  用来记录动画运动到哪个阶段
	var aniMum = 0;                // 用来记录动画完成的个数
	var lens = 8;
	 
	$(".stage-4-icon").on("webkitAnimationEnd",function (){
		animateNum++;       // 没触发一次webkitAnimationEnd，animateNum++
		if( animateNum == 5 ){    // 因为有五个动画，每一个动画执行完都会触发这个事件
			// 从下边下落的动画完成后，要将每一个图标以动画的形式平铺开
			animateNum = 0;        // 清零，以便下次使用
			st4Items.each(function (){      //  循环每一个stage4图标
				var num = $(this).index() - 3.5;
				aniMum++;
				$(this).css({
					"transform":"matrix(1,0,0,1,"+ num*90 +",0)",
					"transition":"all 1s"
				});
				// 当所有图标分布开以后，将定位属性去掉，让所有元素浮动
				if( aniMum == lens ){
					aniMum = 0;
					setTimeout(function (){
						st4Items.css({          //  当移入图标的时候，改成浮动
							"position":"static",
							"float":"left",
							"transform":"none",
							"transition":"none",
							"margin":0,
							"top":0,
						});
						console.log( st4Items.css("float") == "left" );
						if( st4Items.css("float") == "left" ){
							// 移入stage4图标的父级的时候，动态修改每一个图标的宽高
							stage4Par.on("mousemove",st4ParOnFn);
							// 鼠标移出时，让每一个图标的宽高和margin还原
							stage4Par.on("mouseleave",st4ParLeaveFn);
							// 鼠标移入每一个图标的时候，展示对应的标题和描述
							st4Items.on("mouseover",st4ItemsOverFn);
						}
					},1000);
				}
			});

			// 图标直接父级的mousemove事件
			// 移入stage4图标的父级的时候，动态修改每一个图标的宽高
			function st4ParOnFn(e){
				st4Items.each(function (item,index){
					var x = $(this).offset().left + $(this).outerWidth()/2;
					var y = $(this).offset().top + $(this).outerHeight()/2;
					var a = e.pageX - x;
					var b = e.pageY - y;
					//var c = Math.hypot(a,b);
					var c = Math.sqrt(Math.pow(a,2) + Math.pow(b,2));
					// c为鼠标距离每一个图标中心的平方和
					var scale = 1 - c/500;         // 比例决定宽和高
					if( scale < 1/2 ){                 // 比例越大，宽高越小
						scale = 1/2;                   // 小于1/2，宽高不变
					}
					// 设置每一个图标的宽和高
					$(this).css({   
						"width":scale*180,
						"height":scale*160,
						"margin":0,
						"margin-top":-scale*160+80
					});
				});
			};
			// 图标直接父级的mouseleave事件
			// 鼠标移出时，让每一个图标的宽高和margin还原
			function st4ParLeaveFn(){
				// 让每一个图标都恢复到原来的宽高
				st4Items.each(function (item,index){
					$(this).stop().animate({    // 动态恢复
						"width":90,
						"height":80,
						"margin-top":0,
						"zIndex":1
					})
				});
			};
			// 所有图标的mouseover事件
			// 鼠标移入每一个图标的时候，展示对应的标题和描述
			function st4ItemsOverFn(){
				// stage4的标题文字描述
				// 让所有的文字消失
				stage4Title.each(function (){
					$(this).css("display","none");
				})
				// 没有图标的层级变成0
				stage4Title.each(function (){
					$(this).removeClass("jqDockItem");
				})
				// 让当前文字显示，并且让它的层级为1
				stage4Title.eq(st4Items.index($(this))).css("display","block");
				stage4Title.eq(st4Items.index($(this))).addClass("jqDockMouse7");

				// stage4的具体文字说明和标题文字一致
				stage4Des.each(function (){
					$(this).css("display","none");
				})
				stage4Des.each(function (){
					$(this).removeClass("jqDockItem");
				})
				stage4Des.eq(st4Items.index($(this))).css("display","block");
				stage4Des.eq(st4Items.index($(this))).addClass("jqDockMouse7");
			}

			// 当stage-4的transition结束的时候，恢复所有图标items的绝对定位
			$("#stage-4  .stage-description").on("webkitTransitionEnd",function (){

				if( !$("#stage-4").hasClass("stage-state-in") ){
					st4Items.css({
						"position":"absolute",
						"top":"50%",
						"left":"50%",
						"float":"none",
						"margin-left":-45,
						"margin-top":-40
					});
					stage4Title.each(function (){
						$(this).css("display","none");
					});
					stage4Des.each(function (){
						$(this).css("display","none");
					});
					stage4Title.eq(-1).css("display","block");
					stage4Des.eq(-1).css("display","block");

					stage4Par.off("mousemove",st4ParOnFn);
					// 鼠标移出时，让每一个图标的宽高和margin还原
					stage4Par.off("mouseleave",st4ParLeaveFn);
					// 鼠标移入每一个图标的时候，展示对应的标题和描述
					st4Items.off("mouseover",st4ItemsOverFn);
				}
			});
		}
	});
}();