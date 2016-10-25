var scale = 1;
if( window.devicePixelRatio ){
	scale = scale / window.devicePixelRatio;
}
document.write('<meta name="viewport" content="initial-scale='+scale+',minimum-scale='+scale+',maximum-scale='+scale+',user-scalable=no" />');

toSize ();
function toSize () {
	var html = document.getElementsByTagName("html")[0];
	var screenW = html.getBoundingClientRect().width;
	html.style.fontSize = screenW/18 + 'px';
}
window.addEventListener(
	"orientationchange",
	function(){
		toSize ();
	}, 
	false	
)
window.addEventListener(
	"resize",
	function(){
		toSize ();
	},
	false
)