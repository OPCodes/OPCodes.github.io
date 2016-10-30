~function (){

	var navUl = $("#nav");   // 获取导航UL
	var navLine = $("#nav-highlight");   // 获取高亮下划条
	var allNavAs = $("#nav a");
	var allNavSpan = $("#nav a span");
	//console.log(allNavSpan.size());
	navLine.css({
		left:Math.floor(allNavSpan.eq(0).offset().left)  // 设置高亮条在第一个导航下
	})
	allNavAs.each(function (index,item){
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
		// 
		
		if( n > lastNum ){
			for( var i = 0; i < n; i++ ){
				allStages.eq(i).addClass("stage-state-in stage-state-out");
			}
			allStages.eq(n).addClass("stage-state-in");
		} else if( n < lastNum ) {
			for( var i = n; i < lastNum; i++ ){
				allStages.eq(i).removeClass("stage-state-out stage-state-in");
			}
			allStages.eq(lastNum).removeClass("stage-state-in stage-state-out-in");
			allStages.eq(n).addClass("stage-state-in stage-state-out-in");
		}

		if( lastNum === 0 ){
			btnNextText.animate({opacity:0},1000);
		} 

		if( n === 0 ){
			btnNextText.animate({opacity:1},2000);
		}

		lastNum = n;
		showWhich(navDot,$(this),"slide-active","slide-active");

	});

	// DisTime 用来解决连续滚动鼠标滚轮的时候，多次触发的情况，在delay时间段内只能触发一次
	function DisTime (lastTime,nowTime,delay){
		if( !nowTime ){
			return true;
		} else if( lastTime - nowTime > delay ){
			return true;
		} else {
			return false;
		}
	}

	// 结束事件 webkitAnimationEnd 
	// 重复运动事件 webkitAnimationIteration 
	

	$("#slidebar").on("webkitAnimationEnd",function (){

		$(document).on("mousewheel DOMMouseScroll", function (e) {

			allStages.eq(0).addClass("stage-state-in");	

			var lastRunTime = new Date().getTime();
			
			if( DisTime(lastRunTime,nowTime,delay) ){
				scrollDis();
			}

			function scrollDis(){
				
				nowTime = new Date().getTime();
				var delta = (e.originalEvent.wheelDelta && (e.originalEvent.wheelDelta > 0 ? 1 : -1)) ||  // chrome & ie
							(e.originalEvent.detail && (e.originalEvent.detail > 0 ? -1 : 1));              // firefox
				
				if (delta > 0) {
					upDown("up");
				} else if (delta < 0) {
					upDown("down");
				}
				lastNum = n;
				showWhich(navDot,navDot.eq(n),"slide-active","slide-active");
			}
			e.preventDefault();

		});

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
	
	var btnNextIco = $(".button-next-icon");
	btnNextIco.click(function (){
		upDown("down");
	});

	// 处理最后一屏的显示隐藏
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

	var stage4IcoWrap = $("#stage-4 .stage-4-icon-wrapper");
	var stage4Icon = $("#stage-4 .stage-4-icon");

	stage4IcoWrap.css("visibility","visible");
	stage4Icon.css("visibility","visible");


	var stage4Icon = $(".stage-4-icon");
	// stage4Par的父级
	var stage4Wrap = $(".stage-4-par-wrap");
	// stage-4-items 元素的直接父级
	var stage4Par = $(".stage-4-dir-par");
	// 为每个icon的div容器
	var st4Items = $(".stage-4-items");
	// animateNum用于存储执行到哪一个动画
	var animateNum = 0;

	$(".stage-4-icon").on("webkitAnimationEnd",function (){

		animateNum++;
		var n = 0;
		if( animateNum == 5 ){    // 因为有五个动画，每一个动画执行完都会触发这个事件
			// 从下边下落的动画完成后，要将每一个图标以动画的形式平铺开
			animateNum = 0;
			st4Items.each(function (item,index){
				$(this).animate({
					"left":90*$(this).index(),
					"margin-left":0
				},500,function (){
					n++;
					if( n === 8 ){
						n = 0;
						var sumWidth = null;

						// 移入stage4图标的父级的时候，让图标items布局转换
						stage4Par.on("mousemove",function (e){

							st4Items.css({
								"position":"static",
								"float":"left"
							})

							sumWidth = null;
							st4Items.each(function (item,index){
								
								var x = $(this).offset().left + $(this).outerWidth()/2;
								var y = $(this).offset().top + $(this).outerHeight()/2;

								var a = e.pageX - x;
								var b = e.pageY - y;

								//var c = Math.hypot(a,b);
								var c = Math.sqrt(Math.pow(a,2) + Math.pow(b,2));

								var scale = 1 - c/500;
								if( scale < 1/2 ){
									scale = 1/2;
								}
								
								$(this).css({
									"width":scale*180,
									"height":scale*160,
									"margin":0,
									"margin-top":-scale*160+80
								});

							});

							st4Items.each(function (item,index){
								sumWidth += parseInt($(this).css("width"));
							})
							stage4Wrap.css({
								"width":parseInt(sumWidth)+10
							});
							stage4Par.css({
								"width":parseInt(sumWidth)+10
							});

						});

						stage4Par.on("mouseleave",function (e){
							sumWidth = null;
							st4Items.each(function (item,index){
								$(this).stop().animate({
									"width":90,
									"height":80,
									"margin-top":0,
									"zIndex":1
								})
							});
							//突然冒出一个overflow：hidden
							stage4Par.animate({
								"width":721
							},600);
							stage4Wrap.animate({
								"width":721
							},600);

						});

						st4Items.on("mouseover",function (){
							// stage4的标题文字描述
							stage4Title.each(function (){
								$(this).css("display","none");
							})
							stage4Title.eq(st4Items.index($(this))).css("display","block");
							stage4Title.each(function (){
								$(this).removeClass("jqDockItem");
							})
							stage4Title.eq(st4Items.index($(this))).addClass("jqDockMouse7");

							// stage4的具体文字说明
							stage4Des.each(function (){
								$(this).css("display","none");
							})
							stage4Des.eq(st4Items.index($(this))).css("display","block");
							stage4Des.each(function (){
								$(this).removeClass("jqDockItem");
							})
							stage4Des.eq(st4Items.index($(this))).addClass("jqDockMouse7");
						});

						// 当stage-4的transition结束的时候，恢复items的绝对定位
						$("#stage-4  .stage-description").on("webkitTransitionEnd",function (){
							if( !$("#stage-4").hasClass("stage-state-in") ){
								
								st4Items.css({
									"position":"absolute",
									"top":"50%",
									"left":"50%",
									"float":"none",
									"margin-left":-45,
									"margin-top":-45
								});
								stage4Title.each(function (){
									$(this).css("display","none");
								});

								stage4Title.eq(-1).css("display","block");

								stage4Des.each(function (){
									$(this).css("display","none");
								});

								stage4Des.eq(-1).css("display","block");
							}
						})
					}
				})
			})
		}
	});



	


	




}();