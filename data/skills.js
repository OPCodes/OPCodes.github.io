
/*		技能展示
	*   {
	*       temp: @value String         				*         模板
	*       skillsClassify: @value Array                *         掌握的技能综合
	*       	{
					skillLanguage: @value String        *         技能名称
	*       		percent: @value String              *         技能百分比
	*       		skillTooltip: @value Array          *         对技能的描述
				}
	*   }

	temp 有两个值可选：
		"circle"：饼形
		"columns":圆柱
*/

var skills = {
		temp:"circle",
		skillsClassify:[
		{
			skillLanguage:"HTML5",
			percent:"80%",
			skillTooltip:[
				"熟练掌握各类语义化标签",
				"熟悉新增的表单控件，表单验证以及相关属性",
				"HTML5新增选择器，JSON新方法，历史管理",
				"H5拖拽、视频音频",
				"canvas画图"
			]
		},
		{
			skillLanguage:"CSS3",
			percent:"75%",
			skillTooltip:[
				"精通定位、浏览器兼容性",
				"熟悉CSS3结构选择器、伪类选择器、伪元素",
				"CSS3圆角盒子阴影文字阴影动画等有实际案例经验",
				"移动端响应式"
			]
		},
		{
			skillLanguage:"javascript",
			percent:"80%",
			skillTooltip:[
				"了解数据类型、作用域闭包等语言特性",
				"掌握定时器、数组字符串及递归、数组去重等",
				"深入使用DOM、BOM、EVENT，能完成各类组件开发",
				"掌握JS的数据调用、ajax实现机制、各类接口调用",
				"掌握面向对象编程，对封装、继承、多态等均有了解",
				"了解正则表达式，熟悉JS兼容性、JS性能提升"
			]
		},
		{
			skillLanguage:"jQuery",
			percent:"60%",
			skillTooltip:[
				"熟练使用JQ进行页面开发，有实际开发经验",
				"移动端响应式"
			]
		},
		{
			skillLanguage:"canvas",
			percent:"50%",
			skillTooltip:[
				"能熟练使用相关接口绘制各类图形",
				"能运用canvas开发小游戏，如简易祖玛等。"
			]
		},
		{
			skillLanguage:"Ajax",
			percent:"50%",
			skillTooltip:[
				"能熟练使用接口进行数据交互，以及数据的处理",
				"能运用JQ提供的Ajax方法进行交互"
			]
		}
		
		
	]
}