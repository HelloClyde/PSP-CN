/*
	[Discuz!] (C)2001-2007 Comsenz Inc.
	This is NOT a freeware, use is subject to license terms

	$RCSfile: common.js,v $
	$Revision: 1.103 $
	$Date: 2007/07/30 09:16:52 $
*/

var lang = new Array();
var userAgent = navigator.userAgent.toLowerCase();
var is_opera = userAgent.indexOf('opera') != -1 && opera.version();
var is_moz = (navigator.product == 'Gecko') && userAgent.substr(userAgent.indexOf('firefox') + 8, 3);
var is_ie = (userAgent.indexOf('msie') != -1 && !is_opera) && userAgent.substr(userAgent.indexOf('msie') + 5, 3);

var BROWSER = {};
var USERAGENT = navigator.userAgent.toLowerCase();
BROWSER.ie = window.ActiveXObject && USERAGENT.indexOf('msie') != -1 && USERAGENT.substr(USERAGENT.indexOf('msie') + 5, 3);
BROWSER.firefox = USERAGENT.indexOf('firefox') != -1 && USERAGENT.substr(USERAGENT.indexOf('firefox') + 8, 3);
BROWSER.chrome = window.MessageEvent && !document.getBoxObjectFor && USERAGENT.indexOf('chrome') != -1 && USERAGENT.substr(USERAGENT.indexOf('chrome') + 7, 10);
BROWSER.opera = window.opera && opera.version();
BROWSER.safari = window.openDatabase && USERAGENT.indexOf('safari') != -1 && USERAGENT.substr(USERAGENT.indexOf('safari') + 7, 8);
BROWSER.other = !BROWSER.ie && !BROWSER.firefox && !BROWSER.chrome && !BROWSER.opera && !BROWSER.safari;
BROWSER.firefox = BROWSER.chrome ? 1 : BROWSER.firefox;

var DISCUZCODE = [];
DISCUZCODE['num'] = '-1';
DISCUZCODE['html'] = [];
var CSSLOADED = [];
var JSMENU = [];
JSMENU['active'] = [];
JSMENU['timer'] = [];
JSMENU['drag'] = [];
JSMENU['layer'] = 0;
JSMENU['zIndex'] = {'win':200,'menu':300,'prompt':400,'dialog':500};
JSMENU['float'] = '';
var AJAX = [];
AJAX['debug'] = 0;
AJAX['url'] = [];
AJAX['stack'] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var clipboardswfdata = '';
var CURRENTSTYPE = null;
var discuz_uid = isUndefined(discuz_uid) ? 0 : discuz_uid;
var creditnotice = isUndefined(creditnotice) ? '' : creditnotice;
var cookiedomain = isUndefined(cookiedomain) ? '' : cookiedomain;
var cookiepath = isUndefined(cookiepath) ? '' : cookiepath;

var replyreload = 0;

var doLog = false;

if (typeof console == "undefined"){
	var console = {
		log: function(message){
			alert(message);
		}
	}
}

var logger = {
		log: function (message){
			if (doLog) {
				console.log(message);
			}
		}
};

function $(id) {
	return document.getElementById(id);
}

function display(id) {
	$(id).style.display = $(id).style.display == '' ? 'none' : '';
}

function isUndefined(variable) {
	return typeof variable == 'undefined' ? true : false;
}

function in_array(needle, haystack) {
	if(typeof needle == 'string' || typeof needle == 'number') {
		for(var i in haystack) {
			if(haystack[i] == needle) {
					return true;
			}
		}
	}
	return false;
}

if(typeof Array.prototype.push === 'undefined') {
    Array.prototype.push = function(value) {
        this[this.length] = value;
        return this.length;
    }
}

function trim(str) {
	return (str + '').replace(/(\s+)$/g, '').replace(/^\s+/g, '');
}

function strlen(str) {
	return (BROWSER.ie && str.indexOf('\n') != -1) ? str.replace(/\r?\n/g, '_').length : str.length;
}

function mb_strlen(str) {
	var len = 0;
	for(var i = 0; i < str.length; i++) {
		len += str.charCodeAt(i) < 0 || str.charCodeAt(i) > 255 ? (charset == 'utf-8' ? 3 : 2) : 1;
	}
	return len;
}

function mb_cutstr(str, maxlen, dot) {
	var len = 0;
	var ret = '';
	var dot = !dot ? '...' : '';
	maxlen = maxlen - dot.length;
	for(var i = 0; i < str.length; i++) {
		len += str.charCodeAt(i) < 0 || str.charCodeAt(i) > 255 ? (charset == 'utf-8' ? 3 : 2) : 1;
		if(len > maxlen) {
			ret += dot;
			break;
		}
		ret += str.substr(i, 1);
	}
	return ret;
}

function checkall(form, prefix, checkall) {
	var checkall = checkall ? checkall : 'chkall';
	count = 0;
	for(var i = 0; i < form.elements.length; i++) {
		var e = form.elements[i];
		if(e.name && e.name != checkall && (!prefix || (prefix && e.name.match(prefix)))) {
			e.checked = form.elements[checkall].checked;
			if(e.checked) {
				count++;
			}
		}
	}
	return count;
}

function doane(event) {
	e = event ? event : window.event;
	if(!e) return;
	if(BROWSER.ie) {
		e.returnValue = false;
		e.cancelBubble = true;
	} else if(e) {
		e.stopPropagation();
		e.preventDefault();
	}
}

function _attachEvent(obj, evt, func, eventobj) {
	eventobj = !eventobj ? obj : eventobj;
	if(obj.addEventListener) {
		obj.addEventListener(evt, func, false);
	} else if(eventobj.attachEvent) {
		obj.attachEvent('on' + evt, func);
	}
}

function _detachEvent(obj, evt, func, eventobj) {
	eventobj = !eventobj ? obj : eventobj;
	if(obj.removeEventListener) {
		obj.removeEventListener(evt, func, false);
	} else if(eventobj.detachEvent) {
		obj.detachEvent('on' + evt, func);
	}
}

function setcookie(cookieName, cookieValue, seconds, path, domain, secure) {
	var expires = new Date();
	expires.setTime(expires.getTime() + seconds * 1000);
	domain = !domain ? cookiedomain : domain;
	path = !path ? cookiepath : path;
	document.cookie = escape(cookieName) + '=' + escape(cookieValue)
		+ (expires ? '; expires=' + expires.toGMTString() : '')
		+ (path ? '; path=' + path : '/')
		+ (domain ? '; domain=' + domain : '')
		+ (secure ? '; secure' : '');
}

function getcookie(name) {
	var cookie_start = document.cookie.indexOf(name);
	var cookie_end = document.cookie.indexOf(";", cookie_start);
	return cookie_start == -1 ? '' : unescape(document.cookie.substring(cookie_start + name.length + 1, (cookie_end > cookie_start ? cookie_end : document.cookie.length)));
}

function thumbImg(obj, method) {
	if(!obj) {
		return;
	}
	obj.onload = null;
	file = obj.src;
	zw = obj.offsetWidth;
	zh = obj.offsetHeight;
	if(zw < 2) {
		if(!obj.id) {
			obj.id = 'img_' + Math.random();
		}
		setTimeout("thumbImg($('" + obj.id + "'), " + method + ")", 100);
		return;
	}
	zr = zw / zh;
	method = !method ? 0 : 1;
	if(method) {
		fixw = obj.getAttribute('_width');
		fixh = obj.getAttribute('_height');
		if(zw > fixw) {
			zw = fixw;
			zh = zw / zr;
		}
		if(zh > fixh) {
			zh = fixh;
			zw = zh * zr;
		}
	} else {
		var widthary = imagemaxwidth.split('%');
		if(widthary.length > 1) {
			fixw = $('wrap').clientWidth - 200;
			if(widthary[0]) {
				fixw = fixw * widthary[0] / 100;
			} else if(widthary[1]) {
				fixw = fixw < widthary[1] ? fixw : widthary[1];
			}
		} else {
			fixw = widthary[0];
		}
		if(zw > fixw) {
			zw = fixw;
			zh = zw / zr;
			obj.style.cursor = 'pointer';
			if(!obj.onclick) {
				obj.onclick = function() {
					zoom(obj, obj.src);
				};
			}
		}
	}
	obj.width = zw;
	obj.height = zh;
}

function imgzoom() {}
function attachimg() {}

function setCopy(text, msg){
	if(BROWSER.ie) {
		clipboardData.setData('Text', text);
		if(msg) {
			showDialog(msg, 'notice');
		}
	} else {
		var msg = '<div style="text-decoration:underline;">点此复制到剪贴板</div>' +
			AC_FL_RunContent('id', 'clipboardswf', 'name', 'clipboardswf', 'devicefont', 'false', 'width', '120', 'height', '40', 'src', 'images/common/clipboard.swf', 'menu', 'false',  'allowScriptAccess', 'sameDomain', 'swLiveConnect', 'true', 'wmode', 'transparent', 'style' , 'margin-top:-20px');
		showDialog(msg, 'info');
		text = text.replace(/[\xA0]/g, ' ');
		clipboardswfdata = text;
	}
}

function setcopy(text, alertmsg){
	if(is_ie) {
		clipboardData.setData('Text', text);
		alert(alertmsg);
	} else if(prompt('Press Ctrl+C Copy to Clipboard', text)) {
		alert(alertmsg);
	}
}

function getClipboardData() {
	window.document.clipboardswf.SetVariable('str', clipboardswfdata);
}

function switchAdvanceMode(url) {
	var obj = $('postform') && (($('fwin_newthread') && $('fwin_newthread').style.display == '') || ($('fwin_reply') && $('fwin_reply').style.display == '')) ? $('postform') : $('fastpostform');
	if(obj && obj.message.value != '') {
		saveData();
		url += '&cedit=yes';
	}
	location.href = url;
	return false;
}

function updatestring(str1, str2, clear) {
	str2 = '_' + str2 + '_';
	return clear ? str1.replace(str2, '') : (str1.indexOf(str2) == -1 ? str1 + str2 : str1);
}

function toggle_collapse(objname, noimg, complex, lang) {
	var obj = $(objname);
	if(obj) {
		obj.style.display = obj.style.display == '' ? 'none' : '';
		var collapsed = getcookie('discuz_collapse');
		collapsed = updatestring(collapsed, objname, !obj.style.display);
		setcookie('discuz_collapse', collapsed, (collapsed ? 2592000 : -2592000));
	}
	if(!noimg) {
		var img = $(objname + '_img');
		if(img.tagName != 'IMG') {
			if(img.className.indexOf('_yes') == -1) {
				img.className = img.className.replace(/_no/, '_yes');
				if(lang) {
					img.innerHTML = lang[0];
				}
			} else {
				img.className = img.className.replace(/_yes/, '_no');
				if(lang) {
					img.innerHTML = lang[1];
				}
			}
		} else {
			img.src = img.src.indexOf('_yes.gif') == -1 ? img.src.replace(/_no\.gif/, '_yes\.gif') : img.src.replace(/_yes\.gif/, '_no\.gif');
		}
		img.blur();
	}
	if(complex) {
		var objc = $(objname + '_c');
		if(objc) {
			objc.className = objc.className == 'c_header' ? 'c_header closenode' : 'c_header';
		}
	}

}

function sidebar_collapse(lang) {
	if(lang[0]) {
		toggle_collapse('sidebar', null, null, lang);
		$('wrap').className = $('wrap').className == 'wrap with_side s_clear' ? 'wrap s_clear' : 'wrap with_side s_clear';
	} else {
		var collapsed = getcookie('discuz_collapse');
		collapsed = updatestring(collapsed, 'sidebar', 1);
		setcookie('discuz_collapse', collapsed, (collapsed ? 2592000 : -2592000));
		location.reload();
	}
}

function loadcss(cssname) {
	if(!CSSLOADED[cssname]) {
		css = document.createElement('link');
		css.type = 'text/css';
		css.rel = 'stylesheet';
		css.href = 'forumdata/cache/style_' + STYLEID + '_' + cssname + '.css?' + VERHASH;
		var headNode = document.getElementsByTagName("head")[0];
		headNode.appendChild(css);
		CSSLOADED[cssname] = 1;
	}
}

function showPrompt(ctrlid, evt, msg, timeout, negligible) {
	var menuid = ctrlid ? ctrlid + '_pmenu' : 'ntcwin';
	var duration = timeout ? 0 : 3;
	if(!$(menuid)) {
		var div = document.createElement('div');
		div.id = menuid;
		div.className = ctrlid ? 'promptmenu up' : 'ntcwin';
		div.style.display = 'none';
		$('append_parent').appendChild(div);
		if(ctrlid) {
			msg = '<div id="' + ctrlid + '_prompt" class="promptcontent"><ul><li>' + msg + '</li></ul></div>';
		} else {
			msg = negligible ? msg : '<span style="font-style: normal;">' + msg + '</span>';
			msg = '<table cellspacing="0" cellpadding="0" class="popupcredit"><tr><td class="pc_l">&nbsp;</td><td class="pc_c"><div class="pc_inner">' + msg +
				(negligible ? '<a class="pc_btn" href="javascript:;" onclick="display(\'ntcwin\');setcookie(\'discuz_creditnoticedisable\', 1, 31536000);" title="不要再提示我"><img src="' + IMGDIR + '/popupcredit_btn.gif" alt="不要再提示我" /></a>' : '') +
				'</td><td class="pc_r">&nbsp;</td></tr></table>';
		}
		div.innerHTML = msg;
	}
	if(ctrlid) {
		if($(ctrlid).evt !== false) {
			var prompting = function() {
				showMenu({'mtype':'prompt','ctrlid':ctrlid,'evt':evt,'menuid':menuid,'pos':'210'});
			};
			if(evt == 'click') {
				$(ctrlid).onclick = prompting;
			} else {
				$(ctrlid).onmouseover = prompting;
			}
		}
		showMenu({'mtype':'prompt','ctrlid':ctrlid,'evt':evt,'menuid':menuid,'pos':'210','duration':duration,'timeout':timeout,'fade':1,'zindex':JSMENU['zIndex']['prompt']});
		$(ctrlid).unselectable = false;
	} else {
		showMenu({'mtype':'prompt','pos':'00','menuid':menuid,'duration':duration,'timeout':timeout,'fade':1,'zindex':JSMENU['zIndex']['prompt']});
	}
}

function showCreditPrompt() {
	var notice = getcookie('discuz_creditnotice').split('D');
	if(notice.length < 2 || notice[9] != discuz_uid || getcookie('discuz_creditnoticedisable')) {
		return;
	}
	var creditnames = creditnotice.split(',');
	var creditinfo = [];
	var s = '';
	var e;
	for(var i in creditnames) {
		e = creditnames[i].split('|');
		creditinfo[e[0]] = [e[1], e[2]];
	}
	for(i = 1; i <= 8; i++) {
		if(notice[i] != 0 && creditinfo[i]) {
			s += '<span>' + creditinfo[i][0] + (notice[i] > 0 ? '<em>+' : '<em class="desc">') + notice[i] + '</em>' + creditinfo[i][1] + '</span>';
		}
	}
	s && showPrompt(null, null, s, 2000, 1);
	setcookie('discuz_creditnotice', '', -2592000);
}

function showDialog(msg, mode, t, func, cover) {
	cover = isUndefined(cover) ? (mode == 'info' ? 0 : 1) : cover;
	mode = in_array(mode, ['confirm', 'notice', 'info']) ? mode : 'alert';
	var menuid = 'fwin_dialog';
	var menuObj = $(menuid);

	if(menuObj) hideMenu('fwin_dialog', 'dialog');
	menuObj = document.createElement('div');
	menuObj.style.display = 'none';
	menuObj.className = 'fwinmask';
	menuObj.id = menuid;
	$('append_parent').appendChild(menuObj);
	var s = '<table cellpadding="0" cellspacing="0" class="fwin"><tr><td class="t_l"></td><td class="t_c"></td><td class="t_r"></td></tr><tr><td class="m_l"></td><td class="m_c"><div class="fcontent' + (mode == 'info' ? '' : ' alert_win') + '"><h3 class="float_ctrl"><em>';
	s += t ? t : '提示信息';
	s += '</em><span><a href="javascript:;" class="float_close" onclick="hideMenu(\'' + menuid + '\', \'dialog\')" title="关闭">关闭</a></span></h3>';
	if(mode == 'info') {
		s += msg ? msg : '';
	} else {
		s += '<hr class="shadowline" />';
		s += '<div class="postbox"><div class="' + (mode == 'alert' ? 'alert_error' : 'alert_info') + '"><p>' + msg + '</p></div>';
		s += '<div class="alert_btn"><input type="button" id="fwin_dialog_submit" value="&nbsp;确定&nbsp;" />';
		s += mode == 'confirm' ? '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input type="button" onclick="hideMenu(\'' + menuid + '\', \'dialog\')" value="&nbsp;取消&nbsp;" />' : '';
		s += '</div></div>';
	}
	s += '</div></td><td class="m_r"></td></tr><tr><td class="b_l"></td><td class="b_c"></td><td class="b_r"></td></tr></table>';
	menuObj.innerHTML = s;
	if($('fwin_dialog_submit')) $('fwin_dialog_submit').onclick = function() {
		if(typeof func == 'function') func();
		else eval(func);
		hideMenu(menuid, 'dialog')
	};
	showMenu({'mtype':'dialog','menuid':menuid,'duration':3,'pos':'00','zindex':JSMENU['zIndex']['dialog'],'cache':0,'cover':cover});
}

function showWindow(k, url, mode, cache) {
	mode = isUndefined(mode) ? 'get' : mode;
	cache = isUndefined(cache) ? 1 : cache;
	var menuid = 'fwin_' + k;
	var menuObj = $(menuid);

	if(disallowfloat && disallowfloat.indexOf(k) != -1) {
		if(BROWSER.ie) url += (url.indexOf('?') != -1 ?  '&' : '?') + 'referer=' + escape(location.href);
		location.href = url;
		return;
	}

	var fetchContent = function() {
		if(mode == 'get') {
			menuObj.url = url;
			url += (url.search(/\?/) > 0 ? '&' : '?') + 'infloat=yes&handlekey=' + k;
			ajaxget(url, 'fwin_content_' + k, null, '', '', function() {initMenu();show();});
		} else if(mode == 'post') {
			menuObj.act = $(url).action;
			ajaxpost(url, 'fwin_content_' + k, '', '', '', function() {initMenu();show();});
		}
		showDialog('', 'info', '<img src="' + IMGDIR + '/loading.gif"> 加载中...');
	};
	var initMenu = function() {
		var objs = menuObj.getElementsByTagName('*');
		for(var i = 0; i < objs.length; i++) {
			if(objs[i].id) {
				objs[i].setAttribute('fwin', k);
			}
			if(objs[i].className == 'float_ctrl') {
				if(!objs[i].id) objs[i].id = 'fctrl_' + k;
				drag = objs[i].id;
			}
		}
	};
	var show = function() {
		hideMenu('fwin_dialog', 'dialog');
		showMenu({'mtype':'win','menuid':menuid,'duration':3,'pos':'00','zindex':JSMENU['zIndex']['win'],'drag':typeof drag == 'undefined' ? '' : drag,'cache':cache});
	};

	if(!menuObj) {
		menuObj = document.createElement('div');
		menuObj.id = menuid;
		menuObj.className = 'fwinmask';
		menuObj.style.display = 'none';
		$('append_parent').appendChild(menuObj);
		menuObj.innerHTML = '<table cellpadding="0" cellspacing="0" class="fwin"><tr><td class="t_l"></td><td class="t_c"></td><td class="t_r"></td></tr><tr><td class="m_l"></td><td class="m_c" id="fwin_content_' + k + '">'
			+ '</td><td class="m_r"></td></tr><tr><td class="b_l"></td><td class="b_c"></td><td class="b_r"></td></tr></table>';
		fetchContent();
	} else if((mode == 'get' && url != menuObj.url) || (mode == 'post' && $(url).action != menuObj.act)) {
		fetchContent();
	} else {
		show();
	}
	doane();
}

function hideWindow(k) {
	hideMenu('fwin_' + k, 'win');
	hideMenu();
	hideMenu('', 'prompt');
}

//bof ev72 replace ac_*
function AC_GetArgs(args, classid, mimeType) {
	var ret = new Object();
	ret.embedAttrs = new Object();
	ret.params = new Object();
	ret.objAttrs = new Object();
	for (var i = 0; i < args.length; i = i + 2){
		var currArg = args[i].toLowerCase();
		switch (currArg){
			case "classid":break;
			case "pluginspage":ret.embedAttrs[args[i]] = 'http://www.macromedia.com/go/getflashplayer';break;
			case "src":ret.embedAttrs[args[i]] = args[i+1];ret.params["movie"] = args[i+1];break;
			case "codebase":ret.objAttrs[args[i]] = 'http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=9,0,0,0';break;
			case "onafterupdate":case "onbeforeupdate":case "onblur":case "oncellchange":case "onclick":case "ondblclick":case "ondrag":case "ondragend":
			case "ondragenter":case "ondragleave":case "ondragover":case "ondrop":case "onfinish":case "onfocus":case "onhelp":case "onmousedown":
			case "onmouseup":case "onmouseover":case "onmousemove":case "onmouseout":case "onkeypress":case "onkeydown":case "onkeyup":case "onload":
			case "onlosecapture":case "onpropertychange":case "onreadystatechange":case "onrowsdelete":case "onrowenter":case "onrowexit":case "onrowsinserted":case "onstart":
			case "onscroll":case "onbeforeeditfocus":case "onactivate":case "onbeforedeactivate":case "ondeactivate":case "type":
			case "id":ret.objAttrs[args[i]] = args[i+1];break;
			case "width":case "height":case "align":case "vspace": case "hspace":case "class":case "title":case "accesskey":case "name":
			case "tabindex":ret.embedAttrs[args[i]] = ret.objAttrs[args[i]] = args[i+1];break;
			default:ret.embedAttrs[args[i]] = ret.params[args[i]] = args[i+1];
		}
	}
	ret.objAttrs["classid"] = classid;
	if(mimeType) {
		ret.embedAttrs["type"] = mimeType;
	}
	return ret;
}

//bof ev72 replace ac_*
function AC_GetArgs(args, classid, mimeType) {
	var ret = new Object();
	ret.embedAttrs = new Object();
	ret.params = new Object();
	ret.objAttrs = new Object();
	for (var i = 0; i < args.length; i = i + 2){
		var currArg = args[i].toLowerCase();
		switch (currArg){
			case "classid":break;
			case "pluginspage":ret.embedAttrs[args[i]] = 'http://www.macromedia.com/go/getflashplayer';break;
			case "src":ret.embedAttrs[args[i]] = args[i+1];ret.params["movie"] = args[i+1];break;
			case "codebase":ret.objAttrs[args[i]] = 'http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=9,0,0,0';break;
			case "onafterupdate":case "onbeforeupdate":case "onblur":case "oncellchange":case "onclick":case "ondblclick":case "ondrag":case "ondragend":
			case "ondragenter":case "ondragleave":case "ondragover":case "ondrop":case "onfinish":case "onfocus":case "onhelp":case "onmousedown":
			case "onmouseup":case "onmouseover":case "onmousemove":case "onmouseout":case "onkeypress":case "onkeydown":case "onkeyup":case "onload":
			case "onlosecapture":case "onpropertychange":case "onreadystatechange":case "onrowsdelete":case "onrowenter":case "onrowexit":case "onrowsinserted":case "onstart":
			case "onscroll":case "onbeforeeditfocus":case "onactivate":case "onbeforedeactivate":case "ondeactivate":case "type":
			case "id":ret.objAttrs[args[i]] = args[i+1];break;
			case "width":case "height":case "align":case "vspace": case "hspace":case "class":case "title":case "accesskey":case "name":
			case "tabindex":ret.embedAttrs[args[i]] = ret.objAttrs[args[i]] = args[i+1];break;
			default:ret.embedAttrs[args[i]] = ret.params[args[i]] = args[i+1];
		}
	}
	ret.objAttrs["classid"] = classid;
	if(mimeType) {
		ret.embedAttrs["type"] = mimeType;
	}
	return ret;
}

function AC_DetectFlashVer(reqMajorVer, reqMinorVer, reqRevision) {
	var versionStr = -1;
	if(navigator.plugins != null && navigator.plugins.length > 0 && (navigator.plugins["Shockwave Flash 2.0"] || navigator.plugins["Shockwave Flash"])) {
		var swVer2 = navigator.plugins["Shockwave Flash 2.0"] ? " 2.0" : "";
		var flashDescription = navigator.plugins["Shockwave Flash" + swVer2].description;
		var descArray = flashDescription.split(" ");
		var tempArrayMajor = descArray[2].split(".");
		var versionMajor = tempArrayMajor[0];
		var versionMinor = tempArrayMajor[1];
		var versionRevision = descArray[3];
		if(versionRevision == "") {
			versionRevision = descArray[4];
		}
		if(versionRevision[0] == "d") {
			versionRevision = versionRevision.substring(1);
		} else if(versionRevision[0] == "r") {
			versionRevision = versionRevision.substring(1);
			if(versionRevision.indexOf("d") > 0) {
				versionRevision = versionRevision.substring(0, versionRevision.indexOf("d"));
			}
		}
		versionStr = versionMajor + "." + versionMinor + "." + versionRevision;
	} else if(BROWSER.ie && !BROWSER.opera) {
		try {
			var axo = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.7");
			versionStr = axo.GetVariable("$version");
		} catch (e) {}
	}
	if(versionStr == -1 ) {
		return false;
	} else if(versionStr != 0) {
		if(BROWSER.ie && !BROWSER.opera) {
			tempArray = versionStr.split(" ");
			tempString = tempArray[1];
			versionArray = tempString.split(",");
		} else {
			versionArray = versionStr.split(".");
		}
		var versionMajor = versionArray[0];
		var versionMinor = versionArray[1];
		var versionRevision = versionArray[2];
		return versionMajor > parseFloat(reqMajorVer) || (versionMajor == parseFloat(reqMajorVer)) && (versionMinor > parseFloat(reqMinorVer) || versionMinor == parseFloat(reqMinorVer) && versionRevision >= parseFloat(reqRevision));
	}
}

function AC_FL_RunContent() {
	var str = '';
	if(AC_DetectFlashVer(9,0,124)) {
		var ret = AC_GetArgs(arguments, "clsid:d27cdb6e-ae6d-11cf-96b8-444553540000", "application/x-shockwave-flash");
		if(BROWSER.ie && !BROWSER.opera) {
			str += '<object ';
			for (var i in ret.objAttrs) {
				str += i + '="' + ret.objAttrs[i] + '" ';
			}
			str += '>';
			for (var i in ret.params) {
				str += '<param name="' + i + '" value="' + ret.params[i] + '" /> ';
			}
			str += '</object>';
		} else {
			str += '<embed ';
			for (var i in ret.embedAttrs) {
				str += i + '="' + ret.embedAttrs[i] + '" ';
			}
			str += '></embed>';
		}
	} else {
		str = '此内容需要 Adobe Flash Player 9.0.124 或更高版本<br /><a href="http://www.adobe.com/go/getflashplayer/" target="_blank"><img src="http://www.adobe.com/images/shared/download_buttons/get_flash_player.gif" alt="下载 Flash Player" /></a>';
	}
	return str;
}

function simulateSelect(selectId) {
	var selectObj = $(selectId);
	var defaultopt = defaultv = '';
	var menuObj = document.createElement('div');
	var ul = document.createElement('ul');
	var handleKeyDown = function(e) {
		e = BROWSER.ie ? event : e;
		if(e.keyCode == 40 || e.keyCode == 38) doane(e);
	};

	for(var i = 0; i < selectObj.options.length; i++) {
		var li = document.createElement('li');
		li.innerHTML = selectObj.options[i].innerHTML;
		li.k_id = i;
		li.k_value = selectObj.options[i].value;
		if(selectObj.options[i].selected) {
			defaultopt = selectObj.options[i].innerHTML;
			defaultv = selectObj.options[i].value;
			li.className = 'current';
			selectObj.setAttribute('selecti', i);
		}
		li.onclick = function() {
			if($(selectId + '_ctrl').innerHTML != this.innerHTML) {
				var lis = menuObj.getElementsByTagName('li');
				lis[$(selectId).getAttribute('selecti')].className = '';
				this.className = 'current';
				$(selectId + '_ctrl').innerHTML = this.innerHTML;
				$(selectId).setAttribute('selecti', this.k_id);
				$(selectId).options.length = 0;
				$(selectId).options[0] = new Option('', this.k_value);
				eval(selectObj.getAttribute('change'));
			}
			hideMenu(menuObj.id);
			return false;
		};
		ul.appendChild(li);
	}

	selectObj.options.length = 0;
	selectObj.options[0]= new Option('', defaultv);
	selectObj.style.display = 'none';
	selectObj.outerHTML += '<a href="javascript:;" hidefocus="true" id="' + selectId + '_ctrl" tabindex="1">' + defaultopt + '</a>';

	menuObj.id = selectId + '_ctrl_menu';
	menuObj.className = 'select_menu';
	menuObj.style.display = 'none';
	menuObj.appendChild(ul);
	$('append_parent').appendChild(menuObj);

	$(selectId + '_ctrl').onclick = function(e) {
		$(selectId + '_ctrl_menu').style.width = (BROWSER.ie ? Math.max($(selectId + '_ctrl').clientWidth, parseInt($(selectId + '_ctrl').currentStyle.width)) : $(selectId + '_ctrl').clientWidth) + 'px';
		showMenu({'ctrlid':(selectId == 'loginfield' ? 'account' : selectId + '_ctrl'),'menuid':selectId + '_ctrl_menu','evt':'click','pos':'13'});
		doane(e);
	};
	$(selectId + '_ctrl').onfocus = menuObj.onfocus = function() {
		_attachEvent(document.body, 'keydown', handleKeyDown);
	};
	$(selectId + '_ctrl').onblur = menuObj.onblur = function() {
		_detachEvent(document.body, 'keydown', handleKeyDown);
	};
	$(selectId + '_ctrl').onkeyup = function(e) {
		e = e ? e : window.event;
		value = e.keyCode;
		if(value == 40 || value == 38) {
			if(menuObj.style.display == 'none') {
				$(selectId + '_ctrl').click();
			} else {
				lis = menuObj.getElementsByTagName('li');
				selecti = selectObj.getAttribute('selecti');
				lis[selecti].className = '';
				if(value == 40) {
					selecti = parseInt(selecti) + 1;
				} else if(value == 38) {
					selecti = parseInt(selecti) - 1;
				}
				if(selecti < 0) {
					selecti = lis.length - 1
				} else if(selecti > lis.length - 1) {
					selecti = 0;
				}
				lis[selecti].className = 'current';
				selectObj.setAttribute('selecti', selecti);
				lis[selecti].parentNode.scrollTop = lis[selecti].offsetTop;
			}
		} else if(value == 13) {
			var lis = menuObj.getElementsByTagName('li');
			lis[selectObj.getAttribute('selecti')].click();
		} else if(value == 27) {
			hideMenu(menuObj.id);
		}
	};
}

function detectCapsLock(e, obj) {
	var valueCapsLock = e.keyCode ? e.keyCode : e.which;
	var valueShift = e.shiftKey ? e.shiftKey : (valueCapsLock == 16 ? true : false);
	this.clearDetect = function () {
		obj.className = 'txt';
	};

	obj.className = (valueCapsLock >= 65 && valueCapsLock <= 90 && !valueShift || valueCapsLock >= 97 && valueCapsLock <= 122 && valueShift) ? 'capslock txt' : 'txt';

	if(BROWSER.ie) {
		event.srcElement.onblur = this.clearDetect;
	} else {
		e.target.onblur = this.clearDetect;
	}
}

function switchTab(prefix, current, total) {
	for(i = 1; i <= total;i++) {
		$(prefix + '_' + i).className = '';
		$(prefix + '_c_' + i).style.display = 'none';
	}
	$(prefix + '_' + current).className = 'current';
	$(prefix + '_c_' + current).style.display = '';
}

function keyPageScroll(e, prev, next, url, page) {
	e = e ? e : window.event;
	var tagname = BROWSER.ie ? e.srcElement.tagName : e.target.tagName;
	if(tagname == 'INPUT' || tagname == 'TEXTAREA') return;
	actualCode = e.keyCode ? e.keyCode : e.charCode;
	if(next && actualCode == 39) {
		window.location = url + '&page=' + (page + 1);
	}
	if(prev && actualCode == 37) {
		window.location = url + '&page=' + (page - 1);
	}
}

function showselect(obj, inpid, t, rettype) {
	if(!obj.id) {
		var t = !t ? 0 : t;
		var rettype = !rettype ? 0 : rettype;
		obj.id = 'calendarexp_' + Math.random();
		div = document.createElement('div');
		div.id = obj.id + '_menu';
		div.style.display = 'none';
		div.className = 'showselect_menu';
		$('append_parent').appendChild(div);
		s = '';
		if(!t) {
			s += showselect_row(inpid, '一天', 1, 0, rettype);
			s += showselect_row(inpid, '一周', 7, 0, rettype);
			s += showselect_row(inpid, '一个月', 30, 0, rettype);
			s += showselect_row(inpid, '三个月', 90, 0, rettype);
			s += showselect_row(inpid, '自定义', -2);
		} else {
			if($(t)) {
				var lis = $(t).getElementsByTagName('LI');
				for(i = 0;i < lis.length;i++) {
					s += '<a href="javascript:;" onclick="$(\'' + inpid + '\').value = this.innerHTML">' + lis[i].innerHTML + '</a><br />';
				}
				s += showselect_row(inpid, '自定义', -1);
			} else {
				s += '<a href="javascript:;" onclick="$(\'' + inpid + '\').value = \'0\'">永久</a><br />';
				s += showselect_row(inpid, '7 天', 7, 1, rettype);
				s += showselect_row(inpid, '14 天', 14, 1, rettype);
				s += showselect_row(inpid, '一个月', 30, 1, rettype);
				s += showselect_row(inpid, '三个月', 90, 1, rettype);
				s += showselect_row(inpid, '半年', 182, 1, rettype);
				s += showselect_row(inpid, '一年', 365, 1, rettype);
				s += showselect_row(inpid, '自定义', -1);
			}
		}
		$(div.id).innerHTML = s;
	}
	showMenu({'ctrlid':obj.id,'evt':'click'});
	if(BROWSER.ie && BROWSER.ie < 7) {
		doane(event);
	}
}

function showselect_row(inpid, s, v, notime, rettype) {
	if(v >= 0) {
		if(!rettype) {
			var notime = !notime ? 0 : 1;
			t = today.getTime();
			t += 86400000 * v;
			d = new Date();
			d.setTime(t);
			return '<a href="javascript:;" onclick="$(\'' + inpid + '\').value = \'' + d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + (!notime ? ' ' + d.getHours() + ':' + d.getMinutes() : '') + '\'">' + s + '</a><br />';
		} else {
			return '<a href="javascript:;" onclick="$(\'' + inpid + '\').value = \'' + v + '\'">' + s + '</a><br />';
		}
	} else if(v == -1) {
		return '<a href="javascript:;" onclick="$(\'' + inpid + '\').focus()">' + s + '</a><br />';
	} else if(v == -2) {
		return '<a href="javascript:;" onclick="$(\'' + inpid + '\').onclick()">' + s + '</a><br />';
	}
}

function showColorBox(ctrlid, layer, k) {
	if(!$(ctrlid + '_menu')) {
		var menu = document.createElement('div');
		menu.id = ctrlid + '_menu';
		menu.className = 'popupmenu_popup colorbox';
		menu.unselectable = true;
		menu.style.display = 'none';
		var coloroptions = ['Black', 'Sienna', 'DarkOliveGreen', 'DarkGreen', 'DarkSlateBlue', 'Navy', 'Indigo', 'DarkSlateGray', 'DarkRed', 'DarkOrange', 'Olive', 'Green', 'Teal', 'Blue', 'SlateGray', 'DimGray', 'Red', 'SandyBrown', 'YellowGreen','SeaGreen', 'MediumTurquoise','RoyalBlue', 'Purple', 'Gray', 'Magenta', 'Orange', 'Yellow', 'Lime', 'Cyan', 'DeepSkyBlue', 'DarkOrchid', 'Silver', 'Pink', 'Wheat', 'LemonChiffon', 'PaleGreen', 'PaleTurquoise', 'LightBlue', 'Plum', 'White'];
		var str = '';
		for(var i = 0; i < 40; i++) {
			str += '<input type="button" style="background-color: ' + coloroptions[i] + '" onclick="'
			+ (typeof wysiwyg == 'undefined' ? 'seditor_insertunit(\'' + k + '\', \'[color=' + coloroptions[i] + ']\', \'[/color]\')' : (ctrlid == editorid + '_cmd_table_param_4' ? '$(\'' + ctrlid + '\').value=\'' + coloroptions[i] + '\';hideMenu(2)' : 'discuzcode(\'forecolor\', \'' + coloroptions[i] + '\')'))
			+ '" title="' + coloroptions[i] + '" />' + (i < 39 && (i + 1) % 8 == 0 ? '<br />' : '');
		}
		menu.innerHTML = str;
		$('append_parent').appendChild(menu);
	}
	showMenu({'ctrlid':ctrlid,'evt':'click','layer':layer});
}

function announcement() {
	var ann = new Object();
	ann.anndelay = 3000;ann.annst = 0;ann.annstop = 0;ann.annrowcount = 0;ann.anncount = 0;ann.annlis = $('annbody').getElementsByTagName("LI");ann.annrows = new Array();
	ann.announcementScroll = function () {
		if(this.annstop) { this.annst = setTimeout(function () { ann.announcementScroll(); }, this.anndelay);return; }
		if(!this.annst) {
			var lasttop = -1;
			for(i = 0;i < this.annlis.length;i++) {
				if(lasttop != this.annlis[i].offsetTop) {
					if(lasttop == -1) lasttop = 0;
					this.annrows[this.annrowcount] = this.annlis[i].offsetTop - lasttop;this.annrowcount++;
				}
				lasttop = this.annlis[i].offsetTop;
			}
			if(this.annrows.length == 1) {
				$('ann').onmouseover = $('ann').onmouseout = null;
			} else {
				this.annrows[this.annrowcount] = this.annrows[1];
				$('annbodylis').innerHTML += $('annbodylis').innerHTML;
				this.annst = setTimeout(function () { ann.announcementScroll(); }, this.anndelay);
				$('ann').onmouseover = function () { ann.annstop = 1; };
				$('ann').onmouseout = function () { ann.annstop = 0; };
			}
			this.annrowcount = 1;
			return;
		}
		if(this.annrowcount >= this.annrows.length) {
			$('annbody').scrollTop = 0;
			this.annrowcount = 1;
			this.annst = setTimeout(function () { ann.announcementScroll(); }, this.anndelay);
		} else {
			this.anncount = 0;
			this.announcementScrollnext(this.annrows[this.annrowcount]);
		}
	};
	ann.announcementScrollnext = function (time) {
		$('annbody').scrollTop++;
		this.anncount++;
		if(this.anncount != time) {
			this.annst = setTimeout(function () { ann.announcementScrollnext(time); }, 10);
		} else {
			this.annrowcount++;
			this.annst = setTimeout(function () { ann.announcementScroll(); }, this.anndelay);
		}
	};
	ann.announcementScroll();
}

function removeindexheats() {
	return confirm('您确认要把此主题从热点主题中移除么？');
}

function smilies_show(id, smcols, seditorkey) {
	if(seditorkey && !$(seditorkey + 'smilies_menu')) {
		var div = document.createElement("div");
		div.id = seditorkey + 'smilies_menu';
		div.style.display = 'none';
		div.className = 'smilieslist';
		$('append_parent').appendChild(div);
		var div = document.createElement("div");
		div.id = id;
		//div.style.overflow = 'hidden';
		$(seditorkey + 'smilies_menu').appendChild(div);
	}
	if(typeof smilies_type == 'undefined') {
		var scriptNode = document.createElement("script");
		scriptNode.type = "text/javascript";
		scriptNode.charset = charset ? charset : (BROWSER.firefox ? document.characterSet : document.charset);
		scriptNode.src = 'forumdata/cache/smilies_var.js?' + VERHASH;
		$('append_parent').appendChild(scriptNode);
		if(BROWSER.ie) {
			scriptNode.onreadystatechange = function() {
				smilies_onload(id, smcols, seditorkey);
			};
		} else {
			scriptNode.onload = function() {
				smilies_onload(id, smcols, seditorkey);
			};
		}
	} else {
		smilies_onload(id, smcols, seditorkey);
	}
}

function updateseccode() {
	type = seccodedata[2];
	var rand = Math.random();
	if(type == 2) {
		$('seccodeimage').innerHTML = '<object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" codebase="http://fpdownload.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=8,0,0,0" width="' + seccodedata[0] + '" height="' + seccodedata[1] + '" align="middle">'
			+ '<param name="allowScriptAccess" value="sameDomain" /><param name="movie" value="seccode.php?update=' + rand + '" /><param name="quality" value="high" /><param name="wmode" value="transparent" /><param name="bgcolor" value="#ffffff" />'
			+ '<embed src="seccode.php?update=' + rand + '" quality="high" wmode="transparent" bgcolor="#ffffff" width="' + seccodedata[0] + '" height="' + seccodedata[1] + '" align="middle" allowScriptAccess="sameDomain" type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer" /></object>';
	} else {
		$('seccodeimage').innerHTML = '<img id="seccode" onclick="updateseccode()" width="' + seccodedata[0] + '" height="' + seccodedata[1] + '" src="seccode.php?update=' + rand + '" class="absmiddle" alt="" />';
	}
}

function smilies_onload(id, smcols, seditorkey) {
	seditorkey = !seditorkey ? '' : seditorkey;
	smile = getcookie('smile').split('D');
	if(typeof smilies_type == 'object') {
		if(smile[0] && smilies_array[smile[0]]) {
			CURRENTSTYPE = smile[0];
		} else {
			for(i in smilies_array) {
				CURRENTSTYPE = i; break;
			}
		}
		smiliestype = '<div class="smiliesgroup"><ul>';
		for(i in smilies_type) {
			if(smilies_type[i][0]) {
				smiliestype += '<li><a href="javascript:;" hidefocus="true" ' + (CURRENTSTYPE == i ? 'class="current"' : '') + ' id="'+seditorkey+'stype_'+i+'" onclick="smilies_switch(\'' + id + '\', \'' + smcols + '\', '+i+', 1, \'' + seditorkey + '\');if(CURRENTSTYPE) {$(\''+seditorkey+'stype_\'+CURRENTSTYPE).className=\'\';}this.className=\'current\';CURRENTSTYPE='+i+';doane(event);">'+smilies_type[i][0]+'</a></li>';
			}
		}
		smiliestype += '</ul></div>';
		$(id).innerHTML = smiliestype + '<div id="' + id + '_data"></div><div class="smilieslist_page" id="' + id + '_page"></div>';
		smilies_switch(id, smcols, CURRENTSTYPE, smile[1], seditorkey);
	}
}

function smilies_switch(id, smcols, type, page, seditorkey) {
	page = page ? page : 1;
	if(!smilies_array[type] || !smilies_array[type][page]) return;
	setcookie('smile', type + 'D' + page, 31536000);
	smiliesdata = '<table id="' + id + '_table" cellpadding="0" cellspacing="0"><tr>';
	j = k = 0;
	img = [];
	for(i in smilies_array[type][page]) {
		if(j >= smcols) {
			smiliesdata += '<tr>';
			j = 0;
		}
		s = smilies_array[type][page][i];
		smilieimg = 'images/smilies/' + smilies_type[type][1] + '/' + s[2];
		img[k] = new Image();
		img[k].src = smilieimg;
		smiliesdata += s && s[0] ? '<td onmouseover="smilies_preview(\'' + seditorkey + '\', \'' + id + '\', this, ' + s[5] + ')" onclick="' + (typeof wysiwyg != 'undefined' ? 'insertSmiley(' + s[0] + ')': 'seditor_insertunit(\'' + seditorkey + '\', \'' + s[1].replace(/'/, '\\\'') + '\')') +
			'" id="' + seditorkey + 'smilie_' + s[0] + '_td"><img id="smilie_' + s[0] + '" width="' + s[3] +'" height="' + s[4] +'" src="' + smilieimg + '" alt="' + s[1] + '" />' : '<td>';
		j++;k++;
	}
	smiliesdata += '</table>';
	smiliespage = '';
	if(smilies_array[type].length > 2) {
		prevpage = ((prevpage = parseInt(page) - 1) < 1) ? smilies_array[type].length - 1 : prevpage;
		nextpage = ((nextpage = parseInt(page) + 1) == smilies_array[type].length) ? 1 : nextpage;
		smiliespage = '<div class="pags_act"><a href="javascript:;" onclick="smilies_switch(\'' + id + '\', \'' + smcols + '\', ' + type + ', ' + prevpage + ', \'' + seditorkey + '\');doane(event);">上页</a>' +
			'<a href="javascript:;" onclick="smilies_switch(\'' + id + '\', \'' + smcols + '\', ' + type + ', ' + nextpage + ', \'' + seditorkey + '\');doane(event);">下页</a></div>' +
			page + '/' + (smilies_array[type].length - 1);
	}
	$(id + '_data').innerHTML = smiliesdata;
	$(id + '_page').innerHTML = smiliespage;
}

function smilies_preview(seditorkey, id, obj, w) {
	var menu = $('smilies_preview');
	if(!menu) {
		menu = document.createElement('div');
		menu.id = 'smilies_preview';
		menu.className = 'smilies_preview';
		menu.style.display = 'none';
		$('append_parent').appendChild(menu);
	}
	menu.innerHTML = '<img width="' + w + '" src="' + obj.childNodes[0].src + '" />';
	mpos = fetchOffset($(id + '_data'));
	spos = fetchOffset(obj);
	pos = spos['left'] >= mpos['left'] + $(id + '_data').offsetWidth / 2 ? '13' : '24';
	showMenu({'ctrlid':obj.id,'showid':id + '_data','menuid':menu.id,'pos':pos,'layer':3});
}

function images_preview(obj, imgobj) {
	var menu = $('images_preview');
	var w = imgobj.width;
	if(w>400) w=400;
	var src = imgobj.src;
	if(!menu) {
		menu = document.createElement('div');
		menu.id = 'images_preview';
		menu.className = 'images_preview';
		menu.style.display = 'none';
		$('append_parent').appendChild(menu);
	}
	menu.innerHTML = '<div class="popupmenu_popup" ><img width="' + w + '" src="' + src + '" /></div>';
	pos='33';
	showMenu({'ctrlid':obj.id,'menuid':menu.id,'pos':pos,'layer':3});
}

function seditor_ctlent(event, script) {
	if(event.ctrlKey && event.keyCode == 13 || event.altKey && event.keyCode == 83) {
		eval(script);
	}
}

function seditor_insertunit(key, text, textend, moveend) {
	$(key + 'message').focus();
	textend = isUndefined(textend) ? '' : textend;
	moveend = isUndefined(textend) ? 0 : moveend;
	startlen = strlen(text);
	endlen = strlen(textend);
	if(!isUndefined($(key + 'message').selectionStart)) {
		var opn = $(key + 'message').selectionStart + 0;
		if(textend != '') {
			text = text + $(key + 'message').value.substring($(key + 'message').selectionStart, $(key + 'message').selectionEnd) + textend;
		}
		$(key + 'message').value = $(key + 'message').value.substr(0, $(key + 'message').selectionStart) + text + $(key + 'message').value.substr($(key + 'message').selectionEnd);
		if(!moveend) {
			$(key + 'message').selectionStart = opn + strlen(text) - endlen;
			$(key + 'message').selectionEnd = opn + strlen(text) - endlen;
		}
	} else if(document.selection && document.selection.createRange) {
		var sel = document.selection.createRange();
		if(textend != '') {
			text = text + sel.text + textend;
		}
		sel.text = text.replace(/\r?\n/g, '\r\n');
		if(!moveend) {
			sel.moveStart('character', -endlen);
			sel.moveEnd('character', -endlen);
		}
		sel.select();
	} else {
		$(key + 'message').value += text;
	}
	hideMenu(2);
	if(BROWSER.ie) {
		doane();
	}
}

function parseurl(str, mode, parsecode) {
	if(isUndefined(parsecode)) parsecode = true;
	if(parsecode) str= str.replace(/\s*\[code\]([\s\S]+?)\[\/code\]\s*/ig, function($1, $2) {return codetag($2);});
	str = str.replace(/([^>=\]"'\/]|^)((((https?|ftp):\/\/)|www\.)([\w\-]+\.)*[\w\-\u4e00-\u9fa5]+\.([\.a-zA-Z0-9]+|\u4E2D\u56FD|\u7F51\u7EDC|\u516C\u53F8)((\?|\/|:)+[\w\.\/=\?%\-&~`@':+!]*)+\.(jpg|gif|png|bmp))/ig, mode == 'html' ? '$1<img src="$2" border="0">' : '$1[img]$2[/img]');
	str = str.replace(/([^>=\]"'\/@]|^)((((https?|ftp|gopher|news|telnet|rtsp|mms|callto|bctp|ed2k|thunder|synacast):\/\/))([\w\-]+\.)*[:\.@\-\w\u4e00-\u9fa5]+\.([\.a-zA-Z0-9]+|\u4E2D\u56FD|\u7F51\u7EDC|\u516C\u53F8)((\?|\/|:)+[\w\.\/=\?%\-&~`@':+!#]*)*)/ig, mode == 'html' ? '$1<a href="$2" target="_blank">$2</a>' : '$1[url]$2[/url]');
	str = str.replace(/([^\w>=\]"'\/@]|^)((www\.)([\w\-]+\.)*[:\.@\-\w\u4e00-\u9fa5]+\.([\.a-zA-Z0-9]+|\u4E2D\u56FD|\u7F51\u7EDC|\u516C\u53F8)((\?|\/|:)+[\w\.\/=\?%\-&~`@':+!#]*)*)/ig, mode == 'html' ? '$1<a href="$2" target="_blank">$2</a>' : '$1[url]$2[/url]');
	str = str.replace(/([^\w->=\]:"'\.\/]|^)(([\-\.\w]+@[\.\-\w]+(\.\w+)+))/ig, mode == 'html' ? '$1<a href="mailto:$2">$2</a>' : '$1[email]$2[/email]');
	if(parsecode) {
		for(var i = 0; i <= DISCUZCODE['num']; i++) {
			str = str.replace("[\tDISCUZ_CODE_" + i + "\t]", DISCUZCODE['html'][i]);
		}
	}
	return str;
}

function codetag(text) {
	DISCUZCODE['num']++;
	if(typeof wysiwyg != 'undefined' && wysiwyg) text = text.replace(/<br[^\>]*>/ig, '\n').replace(/<(\/|)[A-Za-z].*?>/ig, '');
	DISCUZCODE['html'][DISCUZCODE['num']] = '[code]' + text + '[/code]';
	return '[\tDISCUZ_CODE_' + DISCUZCODE['num'] + '\t]';
}

function pmchecknew() {
	ajaxget('pm.php?checknewpm=' + Math.random(), 'myprompt_check', 'ajaxwaitid');
}

function showimmestatus(imme) {
	var lang = {'Online':'MSN 在线','Busy':'MSN 忙碌','Away':'MSN 离开','Offline':'MSN 脱机'};
	$('imme_status_' + imme.id.substr(0, imme.id.indexOf('@'))).innerHTML = lang[imme.statusText];
}

function preg_replace(search, replace, str, regswitch) {
	var regswitch = !regswitch ? 'ig' : regswitch;
	var len = search.length;
	for(var i = 0; i < len; i++) {
		re = new RegExp(search[i], regswitch);
		str = str.replace(re, typeof replace == 'string' ? replace : (replace[i] ? replace[i] : replace[0]));
	}
	return str;
}

function htmlspecialchars(str) {
	return preg_replace(['&', '<', '>', '"'], ['&amp;', '&lt;', '&gt;', '&quot;'], str);
}

if(typeof IN_ADMINCP == 'undefined') {
	if(discuz_uid && !getcookie('checkpm')) {
		_attachEvent(window, 'load', pmchecknew, document);
	}
	if(creditnotice != '' && getcookie('discuz_creditnotice') && !getcookie('discuz_creditnoticedisable')) {
		_attachEvent(window, 'load', showCreditPrompt, document);
	}
}

if(BROWSER.ie) {
	document.documentElement.addBehavior("#default#userdata");
}

function saveData(ignoreempty) {
	var ignoreempty = isUndefined(ignoreempty) ? 0 : ignoreempty;
	var obj = $('postform') && (($('fwin_newthread') && $('fwin_newthread').style.display == '') || ($('fwin_reply') && $('fwin_reply').style.display == '')) ? $('postform') : ($('fastpostform') ? $('fastpostform') : $('postform'));
	if(!obj) return;
	var data = subject = message = '';
	for(var i = 0; i < obj.elements.length; i++) {
		var el = obj.elements[i];
		if(el.name != '' && (el.tagName == 'TEXTAREA' || el.tagName == 'INPUT' && (el.type == 'text' || el.type == 'checkbox' || el.type == 'radio')) && el.name.substr(0, 6) != 'attach') {
			var elvalue = el.value;
			if(el.name == 'subject') {
				subject = trim(elvalue);
			} else if(el.name == 'message') {
				if(typeof wysiwyg != 'undefined' && wysiwyg == 1) {
					elvalue = html2bbcode(editdoc.body.innerHTML);
				}
				message = trim(elvalue);
			}
			if((el.type == 'checkbox' || el.type == 'radio') && !el.checked) {
				continue;
			}
			if(trim(elvalue)) {
				data += el.name + String.fromCharCode(9) + el.tagName + String.fromCharCode(9) + el.type + String.fromCharCode(9) + elvalue + String.fromCharCode(9, 9);
			}
		}
	}

	if(!subject && !message && !ignoreempty) {
		return;
	}

	if(BROWSER.ie){
		with(document.documentElement) {
			setAttribute("value", data);
			save('Discuz');
		}
	} else if(window.sessionStorage){
		sessionStorage.setItem('Discuz', data);
        }
}

//FloatWin
var hiddenobj = new Array();
var floatwinhandle = new Array();
var floatscripthandle = new Array();
var floattabs = new Array();
var floatwins = new Array();
var InFloat = '';
var floatwinreset = 0;
var floatwinopened = 0;
var allowfloatwin = 1;
function floatwin(action, script, w, h, scrollpos) {
	var floatonly = !floatonly ? 0 : 1;
	var actione = action.split('_');
	action = actione[0];
	if((!allowfloatwin || allowfloatwin == 0) && action == 'open' && in_array(actione[1], ['fans','register','login','newthread','reply','edit']) && w >= 600) {
		href = script;
		if(is_ie) {
			href += (script.indexOf('?') != -1 ?  '&' : '?') + 'referer=' + escape(location.href);
		}
		location.href = href;
		return;
	}
	var handlekey = actione[1];
	var layerid = 'floatwin_' + handlekey;
	if(is_ie) {
		var objs = $('page').getElementsByTagName("OBJECT");
	} else {
		var objs = $('page').getElementsByTagName("EMBED");
	}
	if(action == 'open') {
		//loadcss('float');
		floatwinhandle[handlekey + '_0'] = layerid;
		if(!floatwinopened) {
			$('page').onkeydown = floatwin_wrapkeyhandle;
			for(i = 0;i < objs.length; i ++) {
				if(objs[i].style.visibility != 'hidden') {
					objs[i].setAttribute("oldvisibility", objs[i].style.visibility);
					objs[i].style.visibility = 'hidden';
				}
			}
		}
		scrollpos = !scrollpos ? '' : 'floatwin_scroll(\'' + scrollpos + '\');';
		var clientWidth = document.body.clientWidth;
		var clientHeight = document.documentElement.clientHeight ? document.documentElement.clientHeight : document.body.clientHeight;
		var scrollTop = document.body.scrollTop ? document.body.scrollTop : document.documentElement.scrollTop;
		if(script && script != -1) {
			if(script.lastIndexOf('/') != -1) {
				script = script.substr(script.lastIndexOf('/') + 1);
			}
			var scriptfile = script.split('?');
			scriptfile = scriptfile[0];
			if(floatwinreset || floatscripthandle[scriptfile] && floatscripthandle[scriptfile][0] != script) {
				if(!isUndefined(floatscripthandle[scriptfile])) {
					$('append_parent').removeChild($(floatscripthandle[scriptfile][1]));
					$('append_parent').removeChild($(floatscripthandle[scriptfile][1] + '_mask'));
				}
				floatwinreset = 0;
			}
			floatscripthandle[scriptfile] = [script, layerid];
		}
		if(!$(layerid)) {
			floattabs[layerid] = new Array();
			div = document.createElement('div');
			div.className = 'floatwin';
			div.id = layerid;
			div.style.width = w + 'px';
			div.style.height = h + 'px';
			div.style.left = floatwinhandle[handlekey + '_1'] = ((clientWidth - w) / 2) + 'px';
			div.style.position = 'absolute';
			div.style.zIndex = '999';
			div.onkeydown = floatwin_keyhandle;
			$('append_parent').appendChild(div);
			$(layerid).style.display = '';
			$(layerid).style.top = floatwinhandle[handlekey + '_2'] = ((clientHeight - h) / 2 + scrollTop) + 'px';
			$(layerid).innerHTML = '';
			divmask = document.createElement('div');
			divmask.className = 'floatwinmask';
			divmask.id = layerid + '_mask';
			divmask.style.width = ((parseInt($(layerid).style.width) || 0) + 14) + 'px';
			divmask.style.height = ((parseInt($(layerid).style.height) || 0) + 14) + 'px';
			divmask.style.left = ((parseInt($(layerid).style.left) || 0) - 6) + 'px';
			divmask.style.top = ((parseInt($(layerid).style.top) || 0) - 6) + 'px';
			divmask.style.position = 'absolute';
			divmask.style.zIndex = '998';
			divmask.style.filter = 'progid:DXImageTransform.Microsoft.Alpha(opacity=90,finishOpacity=100,style=0)';
			divmask.style.opacity = 0.9;
			$('append_parent').appendChild(divmask);
			if(script && script != -1) {
				script += (script.search(/\?/) > 0 ? '&' : '?') + 'infloat=yes&handlekey=' + handlekey;
				try {
					ajaxget(script, layerid, '', '', '', scrollpos);
				} catch(e) {
					setTimeout("ajaxget('" + script + "', '" + layerid + "', '', '', '', '" + scrollpos + "')", 1000);
				}
			} else if(script == -1) {
				$(layerid).innerHTML = '<div><h3 class="float_ctrl"><em id="' + layerid + '_title"></em><span><a href="javascript:;" class="float_close" onclick="floatwinreset = 1;floatwin(\'close_' + handlekey + '\');">&nbsp</a></span></h3></div><div id="' + layerid + '_content"></div>';
				$(layerid).style.zIndex = '1099';
				$(layerid + '_mask').style.zIndex = '1098';
			}
		} else {
			$(layerid).style.width = w + 'px';
			$(layerid).style.height = h + 'px';
			$(layerid).style.display = '';
			$(layerid).style.top = floatwinhandle[handlekey + '_2'] = ((clientHeight - h) / 2 + scrollTop) + 'px';
			$(layerid + '_mask').style.width = (parseInt($(layerid).style.width) + 14) + 'px';
			$(layerid + '_mask').style.height = (parseInt($(layerid).style.height) + 14) + 'px';
			$(layerid + '_mask').style.display = '';
			$(layerid + '_mask').style.top = (parseInt($(layerid).style.top) - 6) + 'px';
		}
		floatwins[floatwinopened] = handlekey;
		floatwinopened++;
	} else if(action == 'close' && floatwinhandle[handlekey + '_0']) {
		floatwinopened--;
		for(i = 0;i < floatwins.length; i++) {
			if(handlekey == floatwins[i]) {
				floatwins[i] = null;
			}
		}
		if(!floatwinopened) {
			for(i = 0;i < objs.length; i ++) {
				if(objs[i].attributes['oldvisibility']) {
					objs[i].style.visibility = objs[i].attributes['oldvisibility'].nodeValue;
					objs[i].removeAttribute('oldvisibility');
				}
			}
			$('page').onkeydown = null;
		}
		hiddenobj = new Array();
		$(layerid + '_mask').style.display = 'none';
		$(layerid).style.display = 'none';
	} else if(action == 'size' && floatwinhandle[handlekey + '_0']) {
		if(!floatwinhandle[handlekey + '_3']) {
			var clientWidth = document.body.clientWidth;
			var clientHeight = document.documentElement.clientHeight ? document.documentElement.clientHeight : document.body.clientHeight;
			var w = clientWidth > 800 ? clientWidth * 0.9 : 800;
			var h = clientHeight * 0.9;
			floatwinhandle[handlekey + '_3'] = $(layerid).style.left;
			floatwinhandle[handlekey + '_4'] = $(layerid).style.top;
			floatwinhandle[handlekey + '_5'] = $(layerid).style.width;
			floatwinhandle[handlekey + '_6'] = $(layerid).style.height;
			$(layerid).style.left = floatwinhandle[handlekey + '_1'] = ((clientWidth - w) / 2) + 'px';
			$(layerid).style.top = floatwinhandle[handlekey + '_2'] = ((document.documentElement.clientHeight - h) / 2 + document.documentElement.scrollTop) + 'px';
			$(layerid).style.width = w + 'px';
			$(layerid).style.height = h + 'px';
		} else {
			$(layerid).style.left = floatwinhandle[handlekey + '_1'] = floatwinhandle[handlekey + '_3'];
			$(layerid).style.top = floatwinhandle[handlekey + '_2'] = floatwinhandle[handlekey + '_4'];
			$(layerid).style.width = floatwinhandle[handlekey + '_5'];
			$(layerid).style.height = floatwinhandle[handlekey + '_6'];
			floatwinhandle[handlekey + '_3'] = '';
		}
		$(layerid + '_mask').style.width = (parseInt($(layerid).style.width) + 14) + 'px';
		$(layerid + '_mask').style.height = (parseInt($(layerid).style.height) + 14) + 'px';
		$(layerid + '_mask').style.left = (parseInt($(layerid).style.left) - 6) + 'px';
		$(layerid + '_mask').style.top = (parseInt($(layerid).style.top) - 6) + 'px';
	}
}

function floatwin_scroll(pos) {
	var pose = pos.split(',');
	try {
		pagescroll.defaultleft = pose[0];
		pagescroll.defaulttop = pose[1];
		pagescroll.init();
	} catch(e) {}
}

function floatwin_wrapkeyhandle(e) {
	e = is_ie ? event : e;
	if(e.keyCode == 9) {
		doane(e);
	} else if(e.keyCode == 27) {
		for(i = floatwins.length - 1;i >= 0; i--) {
			floatwin('close_' + floatwins[i]);
		}
	}
}

function floatwin_keyhandle(e) {
	e = is_ie ? event : e;
	if(e.keyCode == 9) {
		doane(e);
		var obj = is_ie ? e.srcElement : e.target;
		var srcobj = obj;
		j = 0;
		while(obj.className.indexOf('floatbox') == -1) {
			obj = obj.parentNode;
		}
		obj.id = obj.id ? obj.id : 'floatbox_' + Math.random();
		if(!floattabs[obj.id]) {
			floattabs[obj.id] = new Array();
			var alls = obj.getElementsByTagName("*");
			for(i = 0;i < alls.length;i++) {
				if(alls[i].getAttribute('tabindex') == 1) {
					floattabs[obj.id][j] = alls[i];
					j++;
				}
			}
		}
		if(floattabs[obj.id].length > 0) {
			for(i = 0;i < floattabs[obj.id].length;i++) {
				if(srcobj == floattabs[obj.id][i]) {
					j = e.shiftKey ? i - 1 : i + 1;break;
				}
			}
			if(j < 0) {
				j = floattabs[obj.id].length - 1;
			}
			if(j > floattabs[obj.id].length - 1) {
				j = 0;
			}
			do{
				focusok = 1;
				try{ floattabs[obj.id][j].focus(); } catch(e) {
					focusok = 0;
				}
				if(!focusok) {
					j = e.shiftKey ? j - 1 : j + 1;
					if(j < 0) {
						j = floattabs[obj.id].length - 1;
					}
					if(j > floattabs[obj.id].length - 1) {
						j = 0;
					}
				}
			} while(!focusok);
		}
	}
}

function quickGoForum(formId, inputId) {
	var defaults = {
			formId : 	'quick_go_forum',
			inputId :	'forum_name',
			searchTip : '快速直达版块...'
	};
	
	var errorMsg;
	
	formId = formId ? formId : defaults.formId;
	inputId = inputId ? inputId : defaults.inputId;
	
	var input = jQuery('#' + inputId);
	input.autocomplete('ajax.php?action=searchforum', {
		width: 252,
		max: 20,
		scrollHeight: 300,
		delay: 200,
		formatResult: function(row, value) {
			return trim(value.split('>>')[1]).replace('&nbsp;&nbsp;', '');
		},
		selectCurrent: function(){
			submit();
		}
	});

	var forum = jQuery('form[name="' + formId + '"]');
	forum.submit(function(){
		setTimeout(function(){submit()}, 300);
		return false;
	}).find('button:eq(0)').click(function(){
		return submit();
	});
	
	
	function submit() {
		if(valid()) {		
			location.href='forum-' + parseInt(input.data('valueId')) + '-1.html';
			return true;
		}else {
			alert(errorMsg);
			return false;
		}
	}
	
	function valid() {
		errorMsg = '';
		if(jQuery.trim(input.val()) == '' || jQuery.trim(input.val()) == defaults.searchTip) {
			errorMsg = '请输入版块名';
		}else if(!parseInt(input.data('valueId'))){
			errorMsg = '版块不存在，请从提示列表中选择';
		}
		
		return errorMsg == '';
	}

}