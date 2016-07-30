/*
	[Discuz!] (C)2001-2007 Comsenz Inc.
	This is NOT a freeware, use is subject to license terms

	$RCSfile: ajax.js,v $
	$Revision: 1.117 $
	$Date: 2007/08/09 08:49:19 $
*/

var Ajaxs = new Array();
var AjaxStacks = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
// var attackevasive = 1;
function Ajax(recvType, waitId) {

	for(var stackId = 0; stackId < AjaxStacks.length && AjaxStacks[stackId] != 0; stackId++);
	AjaxStacks[stackId] = 1;

	var aj = new Object();

	aj.loading = 'Loading...';//public
	aj.recvType = recvType ? recvType : 'XML';//public
	aj.waitId = waitId ? $(waitId) : null;//public

	aj.resultHandle = null;//private
	aj.sendString = '';//private
	aj.targetUrl = '';//private
	aj.stackId = 0;
	aj.stackId = stackId;

	aj.setLoading = function(loading) {
		if(typeof loading !== 'undefined' && loading !== null) aj.loading = loading;
	}

	aj.setRecvType = function(recvtype) {
		aj.recvType = recvtype;
	}

	aj.setWaitId = function(waitid) {
		aj.waitId = typeof waitid == 'object' ? waitid : $(waitid);
	}

	aj.createXMLHttpRequest = function() {
		var request = false;
		if(window.XMLHttpRequest) {
			request = new XMLHttpRequest();
			if(request.overrideMimeType) {
				request.overrideMimeType('text/xml');
			}
		} else if(window.ActiveXObject) {
			var versions = ['Microsoft.XMLHTTP', 'MSXML.XMLHTTP', 'Microsoft.XMLHTTP', 'Msxml2.XMLHTTP.7.0', 'Msxml2.XMLHTTP.6.0', 'Msxml2.XMLHTTP.5.0', 'Msxml2.XMLHTTP.4.0', 'MSXML2.XMLHTTP.3.0', 'MSXML2.XMLHTTP'];
			for(var i=0; i<versions.length; i++) {
				try {
					request = new ActiveXObject(versions[i]);
					if(request) {
						return request;
					}
				} catch(e) {}
			}
		}
		return request;
	}

	aj.XMLHttpRequest = aj.createXMLHttpRequest();
	aj.showLoading = function() {
		if(aj.waitId && (aj.XMLHttpRequest.readyState != 4 || aj.XMLHttpRequest.status != 200)) {
			changedisplay(aj.waitId, '');
			aj.waitId.innerHTML = '<span><img src="' + IMGDIR + '/loading.gif"> ' + aj.loading + '</span>';
		}
	}

	aj.processHandle = function() {
		if(aj.XMLHttpRequest.readyState == 4 && aj.XMLHttpRequest.status == 200) {
			for(k in Ajaxs) {
				if(Ajaxs[k] == aj.targetUrl) {
					Ajaxs[k] = null;
				}
			}
			if(aj.waitId) changedisplay(aj.waitId, 'none');
			if(aj.recvType == 'HTML') {
				aj.resultHandle(aj.XMLHttpRequest.responseText, aj);
			} else if(aj.recvType == 'XML') {
				aj.resultHandle(aj.XMLHttpRequest.responseXML.lastChild.firstChild.nodeValue, aj);
			}
			AjaxStacks[aj.stackId] = 0;
		}
	}

	aj.get = function(targetUrl, resultHandle) {

		setTimeout(function(){aj.showLoading()}, 500);
		if(in_array(targetUrl, Ajaxs)) {
			return false;
		} else {
			Ajaxs.push(targetUrl);
		}
		aj.targetUrl = targetUrl;
		aj.XMLHttpRequest.onreadystatechange = aj.processHandle;
		aj.resultHandle = resultHandle;
		var delay = attackevasive & 1 ? (aj.stackId + 1) * 1001 : 100;
		if(window.XMLHttpRequest) {
			setTimeout(function(){
			aj.XMLHttpRequest.open('GET', aj.targetUrl);
			aj.XMLHttpRequest.send(null);}, delay);
		} else {
			setTimeout(function(){
			aj.XMLHttpRequest.open("GET", targetUrl, true);
			aj.XMLHttpRequest.send();}, delay);
		}

	}
	aj.post = function(targetUrl, sendString, resultHandle) {
		setTimeout(function(){aj.showLoading()}, 500);
		if(in_array(targetUrl, Ajaxs)) {
			return false;
		} else {
			Ajaxs.push(targetUrl);
		}
		aj.targetUrl = targetUrl;
		aj.sendString = sendString;
		aj.XMLHttpRequest.onreadystatechange = aj.processHandle;
		aj.resultHandle = resultHandle;
		aj.XMLHttpRequest.open('POST', targetUrl);
		aj.XMLHttpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		aj.XMLHttpRequest.send(aj.sendString);
	}
	return aj;
}

function newfunction(func){
	var args = new Array();
	for(var i=1; i<arguments.length; i++) args.push(arguments[i]);
	return function(event){
		doane(event);
		window[func].apply(window, args);
		return false;
	}
}

function changedisplay(obj, display) {
	if(display == 'auto') {
		obj.style.display = obj.style.display == '' ? 'none' : '';
	} else {
		obj.style.display = display;
	}
	return false;
}

var evalscripts = new Array();
function evalscript(s) {
	if(s.indexOf('<script') == -1) return s;
	var p = /<script[^\>]*?src=\"([^\>]*?)\"[^\>]*?(reload=\"1\")?(?:charset=\"([\w\-]+?)\")?><\/script>/ig;
	var arr = new Array();
	while(arr = p.exec(s)) appendscript(arr[1], '', arr[2], arr[3]);
	p = /<script (?!src)[^\>]*?( reload=\"1\")?>([^\x00]+?)<\/script>/ig;
	while(arr = p.exec(s)) appendscript('', arr[2], arr[1]);
	return s;
}

function appendscript(src, text, reload, charset) {
	var id = hash(src + text);
	if(!reload && in_array(id, evalscripts)) return;
	if(reload && $(id)) {
		$(id).parentNode.removeChild($(id));
	}

	evalscripts.push(id);
	var scriptNode = document.createElement("script");
	scriptNode.type = "text/javascript";
	scriptNode.id = id;
	scriptNode.charset = charset;
	try {
		if(src) {
			scriptNode.src = src;
		} else if(text){
			scriptNode.text = text;
		}
		$('append_parent').appendChild(scriptNode);
	} catch(e) {}
}

function stripscript(s) {
	return s.replace(/<script.*?>.*?<\/script>/ig, '');
}

function ajaxupdateevents(obj, tagName) {
	tagName = tagName ? tagName : 'A';
	var objs = obj.getElementsByTagName(tagName);
	for(k in objs) {
		var o = objs[k];
		ajaxupdateevent(o);
	}
}

function ajaxupdateevent(o) {
	if(typeof o == 'object' && o.getAttribute) {
		if(o.getAttribute('ajaxtarget')) {
			if(!o.id) o.id = Math.random();
			var ajaxevent = o.getAttribute('ajaxevent') ? o.getAttribute('ajaxevent') : 'click';
			var ajaxurl = o.getAttribute('ajaxurl') ? o.getAttribute('ajaxurl') : o.href;
			_attachEvent(o, ajaxevent, newfunction('ajaxget', ajaxurl, o.getAttribute('ajaxtarget'), o.getAttribute('ajaxwaitid'), o.getAttribute('ajaxloading'), o.getAttribute('ajaxdisplay')));
			if(o.getAttribute('ajaxfunc')) {
				o.getAttribute('ajaxfunc').match(/(\w+)\((.+?)\)/);
				_attachEvent(o, ajaxevent, newfunction(RegExp.$1, RegExp.$2));
			}
		}
	}
}

/*
 *@ url: 需求请求的 url
 *@ id : 显示的 id
 *@ waitid: 等待的 id，默认为显示的 id，如果 waitid 为空字符串，则不显示 loading...， 如果为 null，则在 showid 区域显示
 *@ linkid: 是哪个链接触发的该 ajax 请求，该对象的属性(如 ajaxdisplay)保存了一些 ajax 请求过程需要的数据。
*/
function ajaxget(url, showid, waitid, loading, display, recall) {
	waitid = typeof waitid == 'undefined' || waitid === null ? showid : waitid;
	var x = new Ajax();
	x.setLoading(loading);
	x.setWaitId(waitid);
	x.display = typeof display == 'undefined' || display == null ? '' : display;
	x.showId = $(showid);
	if(x.showId) x.showId.orgdisplay = typeof x.showId.orgdisplay === 'undefined' ? x.showId.style.display : x.showId.orgdisplay;

	if(url.substr(strlen(url) - 1) == '#') {
		url = url.substr(0, strlen(url) - 1);
		x.autogoto = 1;
	}

	var url = url + '&inajax=1&ajaxtarget=' + showid;
	x.get(url, function(s, x) {
		evaled = false;
		if(s.indexOf('ajaxerror') != -1) {
			evalscript(s);
			evaled = true;
		}
		if(!evaled && (typeof ajaxerror == 'undefined' || !ajaxerror)) {
			if(x.showId) {
				changedisplay(x.showId, x.showId.orgdisplay);
				changedisplay(x.showId, x.display);
				x.showId.orgdisplay = x.showId.style.display;
				ajaxinnerhtml(x.showId, s);
				ajaxupdateevents(x.showId);
				if(x.autogoto) scroll(0, x.showId.offsetTop);
			}
		}
		if(!evaled)evalscript(s);
		ajaxerror = null;
		if(recall) {eval(recall);}
	});
}

var ajaxpostHandle = 0;
function ajaxpost(formid, showid, waitid) {
	showloading();
	var waitid = typeof waitid == 'undefined' || waitid === null ? showid : (waitid !== '' ? waitid : '');

	if(ajaxpostHandle != 0) {
		return false;
	}
	var ajaxframeid = 'ajaxframe';
	var ajaxframe = $(ajaxframeid);
	if(ajaxframe == null) {
		if (is_ie && !is_opera) {
			ajaxframe = document.createElement("<iframe name='" + ajaxframeid + "' id='" + ajaxframeid + "'></iframe>");
		} else {
			ajaxframe = document.createElement("iframe");
			ajaxframe.name = ajaxframeid;
			ajaxframe.id = ajaxframeid;
		}
		//ajaxframe.id = ajaxframeid;
		ajaxframe.style.display = 'none';
		$('append_parent').appendChild(ajaxframe);

	}
	$(formid).target = ajaxframeid;
	ajaxpostHandle = [showid, ajaxframeid, formid, $(formid).target];
	if(ajaxframe.attachEvent) {
		ajaxframe.detachEvent ('onload', ajaxpost_load);
		ajaxframe.attachEvent('onload', ajaxpost_load);
	} else {
		document.removeEventListener('load', ajaxpost_load, true);
		ajaxframe.addEventListener('load', ajaxpost_load, false);
	}
	$(formid).submit();
	return false;
	//$(waitid).innerHTML = 'Loading...';
}

function ajaxpost_load() {
	showloading('none');
	if(is_ie) {
		var s = $(ajaxpostHandle[1]).contentWindow.document.XMLDocument.text;
	} else {
		var s = $(ajaxpostHandle[1]).contentWindow.document.documentElement.firstChild.nodeValue;
	}
	evaled = false;
	if(s.indexOf('ajaxerror') != -1) {
		evalscript(s);
		evaled = true;
	}
	if(!evaled && (typeof ajaxerror == 'undefined' || !ajaxerror)) {
		ajaxinnerhtml($(ajaxpostHandle[0]), s);
		if(!evaled)evalscript(s);
		setMenuPosition($(ajaxpostHandle[0]).ctrlid, 0);
		setTimeout("hideMenu()", 1500);
	}
	ajaxerror = null;
	if($(ajaxpostHandle[2])) {
		$(ajaxpostHandle[2]).target = ajaxpostHandle[3];
		//$(ajaxpostHandle[2]).removeChild($(ajaxpostHandle[1]));
	}
	ajaxpostHandle = 0;
}

function ajaxmenu(e, ctrlid, timeout, func, cache, duration, ismenu, divclass, optionclass) {
	showloading();
	if(jsmenu['active'][0] && jsmenu['active'][0].ctrlkey == ctrlid) {
		doane(e);
		return;
	} else if(is_ie && is_ie < 7 && document.readyState.toLowerCase() != 'complete') {
		return;
	}
	if(isUndefined(timeout)) timeout = 3000;
	if(isUndefined(func)) func = '';
	if(isUndefined(cache)) cache = 1;
	if(isUndefined(divclass)) divclass = 'popupmenu_popup';
	if(isUndefined(optionclass)) optionclass = 'popupmenu_option';
	if(isUndefined(ismenu)) ismenu = 1;
	if(isUndefined(duration)) duration = timeout > 0 ? 0 : 3;
	var div = $(ctrlid + '_menu');
	if(cache && div) {
		showMenu(ctrlid, e.type == 'click', 0, duration, timeout);
		if(func) setTimeout(func + '(' + ctrlid + ')', timeout);
		doane(e);
	} else {
		if(!div) {
			div = document.createElement('div');
			div.ctrlid = ctrlid;
			div.id = ctrlid + '_menu';
			div.style.display = 'none';
			div.className = divclass;
			$('append_parent').appendChild(div);
		}

		var x = new Ajax();
		var href = !isUndefined($(ctrlid).href) ? $(ctrlid).href : $(ctrlid).attributes['href'].value;
		x.div = div;
		x.etype = e.type;
		x.get(href + '&inajax=1&ajaxmenuid='+ctrlid+'_menu', function(s) {
			evaled = false;
			if(s.indexOf('ajaxerror') != -1) {
				evalscript(s);
				evaled = true;
				if(!cache && duration != 3 && x.div.id) setTimeout('document.body.removeChild($(\'' + x.div.id + '\'))', timeout);
			}
			if(!evaled && (typeof ajaxerror == 'undefined' || !ajaxerror)) {
				if(x.div) x.div.innerHTML = '<div class="' + optionclass + '">' + s + '</div>';
				showMenu(ctrlid, x.etype == 'click', 0, duration, timeout);
				if(func) setTimeout(func + '("' + ctrlid + '")', timeout);
				//if(!cache && duration != 3 && x.div.id) setTimeout('document.body.removeChild($(\'' + x.div.id + '\'))', timeout);
			}
			if(!evaled) evalscript(s);
			ajaxerror = null;
			showloading('none');
		});
		doane(e);
	}
}

//得到一个定长的hash值， 依赖于 stringxor()
function hash(string, length) {
	var length = length ? length : 32;
	var start = 0;
	var i = 0;
	var result = '';
	filllen = length - string.length % length;
	for(i = 0; i < filllen; i++){
		string += "0";
	}
	while(start < string.length) {
		result = stringxor(result, string.substr(start, length));
		start += length;
	}
	return result;
}

function stringxor(s1, s2) {
	var s = '';
	var hash = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
	var max = Math.max(s1.length, s2.length);
	for(var i=0; i<max; i++) {
		var k = s1.charCodeAt(i) ^ s2.charCodeAt(i);
		s += hash.charAt(k % 52);
	}
	return s;
}

function showloading(display, wating) {
	var display = display ? display : 'block';
	var wating = wating ? wating : 'Loading...';
	$('ajaxwaitid').innerHTML = wating;
	$('ajaxwaitid').style.display = display;
}

function ajaxinnerhtml(showid, s) {
	if(showid.tagName != 'TBODY') {
		showid.innerHTML = s;
	} else {
		while(showid.firstChild) {
			showid.firstChild.parentNode.removeChild(showid.firstChild);
		}
		var div1 = document.createElement('DIV');
		div1.id = showid.id+'_div';
		div1.innerHTML = '<table><tbody id="'+showid.id+'_tbody">'+s+'</tbody></table>';
		$('append_parent').appendChild(div1);
		var trs = div1.getElementsByTagName('TR');
		var l = trs.length;
		for(var i=0; i<l; i++) {
			showid.appendChild(trs[0]);
		}
		var inputs = div1.getElementsByTagName('INPUT');
		var l = inputs.length;
		for(var i=0; i<l; i++) {
			showid.appendChild(inputs[0]);
		}		
		div1.parentNode.removeChild(div1);
	}
}