/*
	[Discuz!] (C)2001-2007 Comsenz Inc.
	This is NOT a freeware, use is subject to license terms

	$RCSfile: viewthread.js,v $
	$Revision: 1.78 $
	$Date: 2007/08/01 05:55:44 $
*/

var msgwidth = 0;
function attachimg(obj, action) {
	if(action == 'load') {
		msgwidth = document.documentElement.clientWidth - 180 - 140;
		
		/*if(is_ie && is_ie < 7) {
			var objinfo = fetchOffset(obj);
		} else {
			if(!msgwidth) {
				var re = /postcontent|message/i;
				var testobj = obj;
				while((testobj = testobj.parentNode) != null) {
					var matches = re.exec(testobj.className);
					if(matches != null) {
						msgwidth = testobj.clientWidth - 20;
						break;
					}
				}
				if(msgwidth < 1) {
					msgwidth = window.screen.width;
				}
			}
		}
		*/
		if(obj.width > msgwidth) {
			obj.resized = true;
			obj.width = msgwidth;
			obj.style.cursor = 'pointer';
		} else {
			obj.onclick = null;
		}
	} else if(action == 'mouseover') {
		if(obj.resized) {
			obj.style.cursor = 'pointer';
		}
	}
}

function attachimginfo(obj, infoobj, show, event) {
	objinfo = fetchOffset(obj);
	if(show) {
		$(infoobj).style.left = objinfo['left'] + 'px';
		$(infoobj).style.top = obj.offsetHeight < 40 ? (objinfo['top'] + obj.offsetHeight) + 'px' : objinfo['top'] + 'px';
		$(infoobj).style.display = '';
	} else {
		if(is_ie) {
			$(infoobj).style.display = 'none';
			return;
		} else {
			var mousex = document.body.scrollLeft + event.clientX;
			var mousey = document.documentElement.scrollTop + event.clientY;
			if(mousex < objinfo['left'] || mousex > objinfo['left'] + objinfo['width'] || mousey < objinfo['top'] || mousey > objinfo['top'] + objinfo['height']) {
				$(infoobj).style.display = 'none';
			}
		}
	}
}

function copycode(obj) {
	if(is_ie && obj.style.display != 'none') {
		var rng = document.body.createTextRange();
		rng.moveToElementText(obj);
		rng.scrollIntoView();
		rng.select();
		rng.execCommand("Copy");
		rng.collapse(false);
	}
}

function signature(obj) {
	if(obj.style.maxHeightIE != '') {
		var height = (obj.scrollHeight > parseInt(obj.style.maxHeightIE)) ? obj.style.maxHeightIE : obj.scrollHeight;
		if(obj.innerHTML.indexOf('<IMG ') == -1) {
			obj.style.maxHeightIE = '';
		}
		return height;
	}
}

function fastreply(subject, postnum) {
	if($('postform')) {

		$('postform').subject.value = subject.replace(/#/, $(postnum).innerHTML.replace(/<[\/\!]*?[^<>]*?>/ig, ''));
		$('postform').message.focus();
	}
}

function tagshow(event) {
	var obj = is_ie ? event.srcElement : event.target;
	obj.id = !obj.id ? 'tag_' + Math.random() : obj.id;
	ajaxmenu(event, obj.id, 0, '', 1, 3, 0);
	obj.onclick = null;
}

var zoomobj = Array();var zoomadjust;var zoomstatus = 1;

function zoom(obj, zimg) {
	if(!zoomstatus) {
		window.open(zimg, '', '');
		return;
	}
	if(!zimg) {
		zimg = obj.src;
	}
	if(!$('zoomimglayer_bg')) {
		div = document.createElement('div');div.id = 'zoomimglayer_bg';
		div.style.position = 'absolute';
		div.style.left = div.style.top = '0px';
		div.style.width = '100%';
		div.style.height = document.body.scrollHeight + 'px';
		div.style.backgroundColor = '#000';
		div.style.display = 'none';
		div.style.filter = 'progid:DXImageTransform.Microsoft.Alpha(opacity=80,finishOpacity=100,style=0)';
		div.style.opacity = 0.8;
		$('append_parent').appendChild(div);
		div = document.createElement('div');div.id = 'zoomimglayer';
		div.style.position = 'absolute';
		div.className = 'popupmenu_popup';
		div.style.padding = 0;
		$('append_parent').appendChild(div);
	}
	zoomobj['srcinfo'] = fetchOffset(obj);
	zoomobj['srcobj'] = obj;
	zoomobj['zimg'] = zimg;
	$('zoomimglayer').style.display = '';
	$('zoomimglayer').style.left = zoomobj['srcinfo']['left'] + 'px';
	$('zoomimglayer').style.top = zoomobj['srcinfo']['top'] + 'px';
	$('zoomimglayer').style.width = zoomobj['srcobj'].width + 'px';
	$('zoomimglayer').style.height = zoomobj['srcobj'].height + 'px';
	$('zoomimglayer').style.filter = 'progid:DXImageTransform.Microsoft.Alpha(opacity=40,finishOpacity=100,style=0)';
	$('zoomimglayer').style.opacity = 0.4;
	$('zoomimglayer').style.zIndex = 999;
	$('zoomimglayer').innerHTML = '<table width="100%" height="100%" cellspacing="0" cellpadding="0"><tr><td align="center" valign="middle"><img src="' + IMGDIR + '/loading.gif"></td></tr></table><div style="position:absolute;top:-100000px;visibility:hidden"><img onload="zoomimgresize(this)" src="' + zoomobj['zimg'] + '"></div>';
}

var zoomdragstart = new Array();
var zoomclick = 0;
function zoomdrag(e, op) {
	if(op == 1) {
		zoomclick = 1;
		zoomdragstart = is_ie ? [event.clientX, event.clientY] : [e.clientX, e.clientY];
		zoomdragstart[2] = parseInt($('zoomimglayer').style.left);
		zoomdragstart[3] = parseInt($('zoomimglayer').style.top);
		doane(e);
	} else if(op == 2 && zoomdragstart[0]) {
		zoomclick = 0;
		var zoomdragnow = is_ie ? [event.clientX, event.clientY] : [e.clientX, e.clientY];
		$('zoomimglayer').style.left = (zoomdragstart[2] + zoomdragnow[0] - zoomdragstart[0]) + 'px';
		$('zoomimglayer').style.top = (zoomdragstart[3] + zoomdragnow[1] - zoomdragstart[1]) + 'px';
		doane(e);
	} else if(op == 3) {
		if(zoomclick) zoomclose();
		zoomdragstart = [];
		doane(e);
	}
}
function zoomST(c) {
	if($('zoomimglayer').style.display == '') {
		$('zoomimglayer').style.left = (parseInt($('zoomimglayer').style.left) + zoomobj['x']) + 'px';
		$('zoomimglayer').style.top = (parseInt($('zoomimglayer').style.top) + zoomobj['y']) + 'px';
		$('zoomimglayer').style.width = (parseInt($('zoomimglayer').style.width) + zoomobj['w']) + 'px';
		$('zoomimglayer').style.height = (parseInt($('zoomimglayer').style.height) + zoomobj['h']) + 'px';
		var opacity = c * 20;
		$('zoomimglayer').style.filter = 'progid:DXImageTransform.Microsoft.Alpha(opacity=' + opacity + ',finishOpacity=100,style=0)';
		$('zoomimglayer').style.opacity = opacity / 100;
		c++;
		if(c <= 5) {
			setTimeout('zoomST(' + c + ')', 5);
		} else {
			zoomadjust = 1;
			$('zoomimglayer').style.filter = '';
			$('zoomimglayer_bg').style.display = '';
			$('zoomimglayer').innerHTML = '<table cellspacing="0" cellpadding="2"><tr><td style="text-align: right">鼠标滚轮缩放图片 <a href="' + zoomobj['zimg'] + '" target="_blank"><img src="' + IMGDIR + '/newwindow.gif" border="0" style="vertical-align: middle" title="在新窗口打开" /></a> <a href="###" onclick="zoomimgadjust(event, 1)"><img src="' + IMGDIR + '/resize.gif" border="0" style="vertical-align: middle" title="实际大小" /></a> <a href="###" onclick="zoomclose()"><img style="vertical-align: middle" src="' + IMGDIR +'/close.gif" title="关闭" /></a>&nbsp;</td></tr><tr><td align="center" id="zoomimgbox"><img id="zoomimg" style="cursor: move; margin: 5px;" src="' + zoomobj['zimg'] + '" width="' + $('zoomimglayer').style.width + '" height="' + $('zoomimglayer').style.height + '"></td></tr></table>';
			$('zoomimglayer').style.overflow = 'visible';
			$('zoomimglayer').style.width = $('zoomimglayer').style.height = 'auto';
			if(is_ie){
				$('zoomimglayer').onmousewheel = zoomimgadjust;
			} else {
				$('zoomimglayer').addEventListener("DOMMouseScroll", zoomimgadjust, false);
			}
			$('zoomimgbox').onmousedown = function(event) {try{zoomdrag(event, 1);}catch(e){}};
			$('zoomimgbox').onmousemove = function(event) {try{zoomdrag(event, 2);}catch(e){}};
			$('zoomimgbox').onmouseup = function(event) {try{zoomdrag(event, 3);}catch(e){}};
		}
	}
}

function zoomimgresize(obj) {
	zoomobj['zimginfo'] = [obj.width, obj.height];
	var r = obj.width / obj.height;
	var w = document.body.clientWidth * 0.95;
	w = obj.width > w ? w : obj.width;
	var h = w / r;
	var clientHeight = document.documentElement.clientHeight ? document.documentElement.clientHeight : document.body.clientHeight;
	var scrollTop = document.body.scrollTop ? document.body.scrollTop : document.documentElement.scrollTop;
	if(h > clientHeight) {
		h = clientHeight;
		w = h * r;
	}
	var l = (document.body.clientWidth - w) / 2;
	var t = h < clientHeight ? (clientHeight - h) / 2 : 0;
	t += + scrollTop;
	zoomobj['x'] = (l - zoomobj['srcinfo']['left']) / 5;
	zoomobj['y'] = (t - zoomobj['srcinfo']['top']) / 5;
	zoomobj['w'] = (w - zoomobj['srcobj'].width) / 5;
	zoomobj['h'] = (h - zoomobj['srcobj'].height) / 5;
	$('zoomimglayer').style.filter = '';
	$('zoomimglayer').innerHTML = '';
	setTimeout('zoomST(1)', 5);
}

function zoomimgadjust(e, a) {
	if(!a) {
		if(!e) e = window.event;
		if(e.altKey || e.shiftKey || e.ctrlKey) return;
		var l = parseInt($('zoomimglayer').style.left);
		var t = parseInt($('zoomimglayer').style.top);
		if(e.wheelDelta <= 0 || e.detail > 0) {
			if($('zoomimg').width <= 200 || $('zoomimg').height <= 200) {
				doane(e);return;
			}
			$('zoomimg').width -= zoomobj['zimginfo'][0] / 10;
			$('zoomimg').height -= zoomobj['zimginfo'][1] / 10;
			l += zoomobj['zimginfo'][0] / 20;
			t += zoomobj['zimginfo'][1] / 20;
		} else {
			if($('zoomimg').width >= zoomobj['zimginfo'][0]) {
				zoomimgadjust(e, 1);return;
			}
			$('zoomimg').width += zoomobj['zimginfo'][0] / 10;
			$('zoomimg').height += zoomobj['zimginfo'][1] / 10;
			l -= zoomobj['zimginfo'][0] / 20;
			t -= zoomobj['zimginfo'][1] / 20;
		}
	} else {
		var clientHeight = document.documentElement.clientHeight ? document.documentElement.clientHeight : document.body.clientHeight;
		var scrollTop = document.body.scrollTop ? document.body.scrollTop : document.documentElement.scrollTop;
		$('zoomimg').width = zoomobj['zimginfo'][0];$('zoomimg').height = zoomobj['zimginfo'][1];
		var l = (document.body.clientWidth - $('zoomimg').clientWidth) / 2;l = l > 0 ? l : 0;
		var t = (clientHeight - $('zoomimg').clientHeight) / 2 + scrollTop;t = t > 0 ? t : 0;
	}
	$('zoomimglayer').style.left = l + 'px';
	$('zoomimglayer').style.top = t + 'px';
	$('zoomimglayer_bg').style.height = t + $('zoomimglayer').clientHeight > $('zoomimglayer_bg').clientHeight ? (t + $('zoomimglayer').clientHeight) + 'px' : $('zoomimglayer_bg').style.height;
	doane(e);
}

function zoomclose() {
	$('zoomimglayer').innerHTML = '';
	$('zoomimglayer').style.display = 'none';
	$('zoomimglayer_bg').style.display = 'none';
}

function videoPlay(vid, vtime, tid, pid) {
	ajaxget('api/video.php?action=updatevideoinfo&vid='+vid+'&vtime='+vtime+'&tid='+tid+'&pid='+pid, '');
}
