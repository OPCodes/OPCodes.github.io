
/*		前端知识汇总&案例展示
	*   {
	*       caseName: @value String            		*         案例总标题
	*       caseList: @value Array         			*         案例说明信息
	*       	caseTitle: @value String            *         案例标题  
	*      		finishTime: @value String 			*         案例上传时间  格式为：2016.10.09 08:00
	*       	caseThumbnail: @value String        *         缩略图地址
	*       	caseDescription: @value String      *         案例描述 
				caseWebsite: @value String       	*         案例网址
	*       
	*   }
*/



var casees = [
	{
		caseName:"JS的属性操作",
		caseList:[
			{
				caseTitle:"JS入门练习",
				finishTime:"2016.10.25",
				caseThumbnail:"images/case/1/1-JS热身课程-课后练习.gif",
				caseDescription:"属性操作、图片切换、短信属性操作<br>图片切换、短信",
				caseWebsite:"#"
			},
			{
				caseTitle:"模拟手机短信发送",
				finishTime:"2016.10.25",
				caseThumbnail:"images/case/1/2-模拟手机短信发送.gif",
				caseDescription:"描述：这是我完成的一个小案例，综合涉及到的知识点是判断、字符串拼接，以及布局方面的小技巧，比如提交留言后，A用户在左，B用户在右"
				,caseWebsite:"#"
			}
		]
	},
	{
		caseName:"for应用this关键字",
		caseList:[
			{
				caseTitle:"点击生成V形，并变换方向",
				finishTime:"2016.10.25",
				caseThumbnail:"images/case/1/3-生成V形.gif",
				caseDescription:"点击生成一个V字形，连续点击可以变换方向，利用for循环确定定位值"
				,caseWebsite:"#"
			},
			{
				caseTitle:"图片点击切换",
				finishTime:"2016.10.25",
				caseThumbnail:"images/case/1/4-图片切换综合实例.gif",
				caseDescription:"点击切换图片，有两种切换方式。</br>第一种循环切换可以从最后一张跳到第一张，第一种循环方式只能单方向切换。"
				,caseWebsite:"#"
			},
			{
				caseTitle:"多组图片的切换",
				finishTime:"2016.10.25",
				caseThumbnail:"images/case/1/5-多组图片切换.gif",
				caseDescription:"点击图片进行单独切换，点击上一组下一组两组图片可以同步切换"
				,caseWebsite:"http:www.miaov.com"
			},
			{
				caseTitle:"QQ列表",
				finishTime:"2016.10.25",
				caseThumbnail:"images/case/1/6-QQ列表.gif",
				caseDescription:"模拟QQ列表，点击分组可以展开闭合，点击具体内容可以选中，闭合时选中元素的样式被清除"
				,caseWebsite:"#"
			},
			{
				caseTitle:"百度文库评分",
				finishTime:"2016.10.25",
				caseThumbnail:"images/case/1/7.百度文库评分.gif",
				caseDescription:"for循环使用，if语句使用，数组，onmouseover，onmouseout</br>"
				,caseWebsite:"#"
			}
		]
	},{
		caseName:"数据类型",
		caseList:[
			{
				caseTitle:"修改文本框的值",
				finishTime:"2016.10.25",
				caseThumbnail:"images/case/1/8.修改文本框的值.gif",
				caseDescription:"for循环，函数传参，input的value属性值得获取和设置"
				,caseWebsite:"#"

			},
			{
				caseTitle:"商品计价",
				finishTime:"2016.10.25",
				caseThumbnail:"images/case/1/商品计价.png",
				caseDescription:"判断最大值，函数传参，parseInt，parseFloat"
				,caseWebsite:"#",

			}
		]
	},
	{
		caseName:"定时器管理",
		caseList:[
			{
				caseTitle:"图片时钟",
				finishTime:"2016.10.25",
				caseThumbnail:"images/case/1/9-图片时钟.gif",
				caseDescription:"时间对象new Date(),getHours，getMinutes，getSeconds，setInterval，setTimeout，判断上一个时间和最新时间之间的变化"
				,caseWebsite:"#"

			},
			{
				caseTitle:"图片自动切换",
				finishTime:"2016.10.25",
				caseThumbnail:"images/case/1/10-图片自动切换.gif",
				caseDescription:"知识点：定时器setInterval，不断变换元素的left，top值，无缝滚动"
				,caseWebsite:"#",

			}
		]
	},
	{
		caseName:"DOM",
		caseList:[
			{
				caseTitle:"表单表格数据操作",
				finishTime:"2016.10.25",
				caseThumbnail:"images/case/1/11-表单表格数据操作.gif",
				caseDescription:"元素节点操作"
				,caseWebsite:"#"
			},
			{
				caseTitle:"无限级菜单",
				finishTime:"2016.10.25",
				caseThumbnail:"images/case/1/12-无限级菜单.gif",
				caseDescription:"元素节点操作"
				,caseWebsite:"#"
			},
			{
				caseTitle:"淘宝手机频道商品选择",
				finishTime:"2016.10.25",
				caseThumbnail:"images/case/1/13-淘宝手机频道商品选择.gif",
				caseDescription:"元素节点操作"
				,caseWebsite:"#"
			}
		]
	},{
		caseName:"BOM",
		caseList:[
			{
				caseTitle:"土豆网遮罩层",
				finishTime:"2016.10.25",
				caseThumbnail:"images/case/1/14.gif",
				caseDescription:"元素动态创建操作、窗口的resize事件"
				,caseWebsite:"#"

			}
		]
	},{
		caseName:"事件基础",
		caseList:[
			{
				caseTitle:"京东商品放大镜预览",
				finishTime:"2016.10.25",
				caseThumbnail:"images/case/1/15.png",
				caseDescription:"事件对象、鼠标坐标、比例计算"
				,caseWebsite:"#"

			},
			{
				caseTitle:"仿系统右键菜单",
				finishTime:"2016.10.25",
				caseThumbnail:"images/case/1/16.png",
				caseDescription:"浏览器默认行为、鼠标位置"
				,caseWebsite:"#"

			}
		]
	},{
		caseName:"面向对象基础",
		caseList:[
			{
				caseTitle:"面向对象选项卡",
				finishTime:"2016.10.25",
				caseThumbnail:"images/case/1/17.png",
				caseDescription:"构造函数、属性、方法对外提供接口，使调用、扩展更加方便能够使我们更加轻松应对各种不断改变的需求"
				,caseWebsite:"#"
			},
			{
				caseTitle:"面向对象拖拽",
				finishTime:"2016.10.25",
				caseThumbnail:"",
				caseDescription:"构造函数、属性、方法对外提供接口，使调用、扩展更加方便能够使我们更加轻松应对各种不断改变的需求"
				,caseWebsite:"#"
			}
		]
	}
]