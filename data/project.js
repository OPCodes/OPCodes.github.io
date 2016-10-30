
/*		项目池
	*   {
	*       projectName: @value String            *         项目名称
	*       projectWebsite: @value String         *         项目网址
	*       startTime: @value String              *         项目开始时间  格式为：2016.10.09
	*       endTime: @value String 			      *         项目结束时间  格式为：2016.10.09
	*       projectExplain: @value String         *         项目说明
	*       projectLabel: @value Array            *         项目技术标签 
			projectThumbnail: @value String       *         缩略图地址
	*       
	*   }
*/

var projects = [
		{
			projectName:"腾讯微云",
			projectWebsite:"腾讯微云/index.html",
		    startTime:"2016.08.29",
			endTime:"2016.09.06",
			projectExplain:"该项目实现了新建文件夹、删除、重命名、刷新等功能模块，模拟数据进行动态渲染，渲染内容包括树形菜单、文件区域、以及路径导航三部分。充分练习了DOM元素的增删改查、事件的绑定、冒泡行为的处理、以及元素的框选、拖拽、单选、全选等小功能，同时利用自定义数据data，实现对于数据的实时同步。",
			projectLabel:["html","css3","css","js"],
			projectThumbnail:"images/icon/wy.gif"
		},
		{
			projectName:"移动端天猫商城首页",
			projectWebsite:"天猫移动端首页/index.html",
		    startTime:"2016.06.07",
			endTime:"2016.06.13",
			projectExplain:"利用meta标签对不同分辨率的设备进行适配，单位为rem，本项目使用自己封装的m.touch.js进行页面的动态操作，同时采用了弹性盒模型flex，怪异盒模型box-sizing：border-box",
			projectLabel:["html","css3","css","js"],
			projectThumbnail:"images/icon/tmall.gif"
		},
		{
			projectName:"百度浏览器",
			projectWebsite:"百度浏览器/index.html",
		    startTime:"2016.10.22",
			endTime:"至今",
			projectExplain:"本项目仿百度浏览器主页，利用JQuery以及CSS3中的transform和animation实现了动画，以及解决了每一块切换的效果，关键在于鼠标滚轮滚动的过程中如何定位当前处于哪一屏，类似于全屏切换效果。",
			projectLabel:["html","css3","css","js","JQuery"],
			projectThumbnail:"images/icon/baidu.gif"
		}
]