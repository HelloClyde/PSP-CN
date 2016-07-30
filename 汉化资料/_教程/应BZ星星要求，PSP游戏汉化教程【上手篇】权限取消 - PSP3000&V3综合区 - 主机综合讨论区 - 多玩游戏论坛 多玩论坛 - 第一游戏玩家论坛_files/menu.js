/*
	[Discuz!] (C)2001-2007 Comsenz Inc.
	This is NOT a freeware, use is subject to license terms

	$RCSfile: menu.js,v $
	$Revision: 1.66 $
	$Date: 2007/07/26 07:35:27 $
*/

var jsmenu = new Array();
var ctrlobjclassName;
jsmenu['active'] = new Array();
jsmenu['timer'] = new Array();
jsmenu['iframe'] = new Array();

function initCtrl(ctrlobj, click, duration, timeout, layer) {
	if(ctrlobj && !ctrlobj.initialized) {
		ctrlobj.initialized = true;
		ctrlobj.unselectable = true;

		ctrlobj.outfunc = typeof ctrlobj.onmouseout == 'function' ? ctrlobj.onmouseout : null;
		ctrlobj.onmouseout = function() {
			if(this.outfunc) this.outfunc();
			if(duration < 3) jsmenu['timer'][ctrlobj.id] = setTimeout('hideMenu(' + layer + ')', timeout);
		}

		if(click && duration) {
			ctrlobj.clickfunc = typeof ctrlobj.onclick == 'function' ? ctrlobj.onclick : null;
			ctrlobj.onclick = function (e) {
				doane(e);
				if(jsmenu['active'][layer] == null || jsmenu['active'][layer].ctrlkey != this.id) {
					if(this.clickfunc) this.clickfunc();
					else showMenu(this.id, true);
				} else {
					hideMenu(layer);
				}
			}
		}

		ctrlobj.overfunc = typeof ctrlobj.onmouseover == 'function' ? ctrlobj.onmouseover : null;
		ctrlobj.onmouseover = function(e) {
			doane(e);
			if(this.overfunc) this.overfunc();
			if(click) {
				clearTimeout(jsmenu['timer'][this.id]);
			} else {
				for(var id in jsmenu['timer']) {
					if(jsmenu['timer'][id]) clearTimeout(jsmenu['timer'][id]);
				}
			}
		}
	}
}

function initMenu(ctrlid, menuobj, duration, timeout, layer) {
	if(menuobj && !menuobj.initialized) {
		menuobj.initialized = true;
		menuobj.ctrlkey = ctrlid;
		menuobj.onclick = ebygum;
		menuobj.style.position = 'absolute';
		if(duration < 3) {
			if(duration > 1) {
				menuobj.onmouseover = function() {
					clearTimeout(jsmenu['timer'][ctrlid]);
				}
			}
			if(duration != 1) {
				menuobj.onmouseout = function() {
					jsmenu['timer'][ctrlid] = setTimeout('hideMenu(' + layer + ')', timeout);
				}
			}
		}
		menuobj.style.zIndex = 50;
		if(is_ie) {
			menuobj.style.filter += "progid:DXImageTransform.Microsoft.shadow(direction=135,color=#CCCCCC,strength=2)";
		}
	}
}


function fetchOffset(obj) {
	var left_offset = obj.offsetLeft;
	var top_offset = obj.offsetTop;
	while((obj = obj.offsetParent) != null) {
		left_offset += obj.offsetLeft;
		top_offset += obj.offsetTop;
	}
	return { 'left' : left_offset, 'top' : top_offset };
}

function ebygum(eventobj) {
	if(!eventobj || is_ie) {
		window.event.cancelBubble = true;
		return window.event;
	} else {
		if(eventobj.target.type == 'submit') {
			eventobj.target.form.submit();
		}
		eventobj.stopPropagation();
		return eventobj;
	}
}

function menuoption_onclick_function(e) {
	this.clickfunc();
	hideMenu();
}

function menuoption_onclick_link(e) {
	choose(e, this);
}

function menuoption_onmouseover(e) {
	this.className = 'popupmenu_highlight';
}

function menuoption_onmouseout(e) {
	this.className = 'popupmenu_option';
}

function choose(e, obj) {
	var links = obj.getElementsByTagName('a');
	if(links[0]) {
		if(is_ie) {
			links[0].click();
			window.event.cancelBubble = true;
		} else {
			if(e.shiftKey) {
				window.open(links[0].href);
				e.stopPropagation();
				e.preventDefault();
			} else {
				window.location = links[0].href;
				e.stopPropagation();
				e.preventDefault();
			}
		}
		hideMenu();
	}
}

function showMenu(v, click, offset, duration, timeout, layer, showid, maxh) {
	var ctrlid = isUndefined(v['ctrlid']) ? v : v['ctrlid'];
	var showid = isUndefined(v['showid']) ? ctrlid : v['showid'];
	var menuid = isUndefined(v['menuid']) ? showid + '_menu' : v['menuid'];
	var ctrlObj = $(ctrlid);
	var menuObj = $(menuid);
	if(!menuObj) return;
	var mtype = isUndefined(v['mtype']) ? 'menu' : v['mtype'];
	var evt = isUndefined(v['evt']) ? (!isUndefined(click) && click ? 'click' : 'mouseover' ) : v['evt'];
	var pos = isUndefined(v['pos']) ? '43' : v['pos'];
	var layer = isUndefined(v['layer']) ? (isUndefined(layer) ?  1 : layer) : v['layer'];
	var duration = isUndefined(v['duration']) ? (isUndefined(duration) ?  2 : duration) : v['duration'];
	var timeout = isUndefined(v['timeout']) ? (isUndefined(timeout) ?  250 : timeout) : v['timeout'];
	var maxh = isUndefined(v['maxh']) ? (isUndefined(maxh) ?  500 : maxh) : v['maxh'];
	var cache = isUndefined(v['cache']) ? 1 : v['cache'];
	var drag = isUndefined(v['drag']) ? '' : v['drag'];
	var dragobj = drag && $(drag) ? $(drag) : menuObj;
	var fade = isUndefined(v['fade']) ? 0 : v['fade'];
	var cover = isUndefined(v['cover']) ? 0 : v['cover'];
	var zindex = isUndefined(v['zindex']) ? JSMENU['zIndex']['menu'] : v['zindex'];
	if(typeof JSMENU['active'][layer] == 'undefined') {
		JSMENU['active'][layer] = [];
	}

	if(evt == 'click' && in_array(menuid, JSMENU['active'][layer]) && mtype != 'win') {	
		hideMenu(menuid, mtype);
		return;
	}
	if(mtype == 'menu') {
		
		hideMenu(layer, mtype);
	}

	if(ctrlObj) {
		if(!ctrlObj.initialized) {
			ctrlObj.initialized = true;
			ctrlObj.unselectable = true;

			ctrlObj.outfunc = typeof ctrlObj.onmouseout == 'function' ? ctrlObj.onmouseout : null;
			ctrlObj.onmouseout = function() {
				if(this.outfunc) this.outfunc();
				if(duration < 3 && !JSMENU['timer'][menuid]) JSMENU['timer'][menuid] = setTimeout('hideMenu(\'' + menuid + '\', \'' + mtype + '\')', timeout);
			};

			ctrlObj.overfunc = typeof ctrlObj.onmouseover == 'function' ? ctrlObj.onmouseover : null;
			ctrlObj.onmouseover = function(e) {
				doane(e);
				if(this.overfunc) this.overfunc();
				if(evt == 'click') {
					clearTimeout(JSMENU['timer'][menuid]);
					JSMENU['timer'][menuid] = null;
				} else {
					for(var i in JSMENU['timer']) {
						if(JSMENU['timer'][i]) {
							clearTimeout(JSMENU['timer'][i]);
							JSMENU['timer'][i] = null;
						}
					}
				}
			};
		}
	}

	var dragMenu = function(menuObj, e, op) {
		e = e ? e : window.event;
		if(op == 1) {
			if(in_array(BROWSER.ie ? e.srcElement.tagName : e.target.tagName, ['TEXTAREA', 'INPUT', 'BUTTON', 'SELECT'])) {
				return;
			}
			JSMENU['drag'] = [e.clientX, e.clientY];
			JSMENU['drag'][2] = parseInt(menuObj.style.left);
			JSMENU['drag'][3] = parseInt(menuObj.style.top);
			document.onmousemove = function(e) {try{dragMenu(menuObj, e, 2);}catch(err){}};
			document.onmouseup = function(e) {try{dragMenu(menuObj, e, 3);}catch(err){}};
			doane(e);
		} else if(op == 2 && JSMENU['drag'][0]) {
			var menudragnow = [e.clientX, e.clientY];
			menuObj.style.left = (JSMENU['drag'][2] + menudragnow[0] - JSMENU['drag'][0]) + 'px';
			menuObj.style.top = (JSMENU['drag'][3] + menudragnow[1] - JSMENU['drag'][1]) + 'px';
			doane(e);
		} else if(op == 3) {
			JSMENU['drag'] = [];
			document.onmousemove = null;
			document.onmouseup = null;
		}
	};

	if(!menuObj.initialized) {
		menuObj.initialized = true;
		menuObj.ctrlkey = ctrlid;
		menuObj.mtype = mtype;
		menuObj.layer = layer;
		menuObj.cover = cover;
		if(ctrlObj && ctrlObj.getAttribute('fwin')) {menuObj.scrolly = true;}
		menuObj.style.position = 'absolute';
		menuObj.style.zIndex = zindex + layer;
		menuObj.onclick = function(e) {
			if(!e || BROWSER.ie) {
				window.event.cancelBubble = true;
				return window.event;
			} else {
				e.stopPropagation();
				return e;
			}
		};
		if(duration < 3) {
			if(duration > 1) {
				menuObj.onmouseover = function() {
					clearTimeout(JSMENU['timer'][menuid]);
					JSMENU['timer'][menuid] = null;
				};
			}
			if(duration != 1) {
				menuObj.onmouseout = function() {
					JSMENU['timer'][menuid] = setTimeout('hideMenu(\'' + menuid + '\', \'' + mtype + '\')', timeout);
				};
			}
		}
		if(drag) {
			dragobj.style.cursor = 'move';
			dragobj.onmousedown = function(event) {try{dragMenu(menuObj, event, 1);}catch(e){}};
		}
		if(cover) {
			var coverObj = document.createElement('div');
			coverObj.id = menuid + '_cover';
			coverObj.style.position = 'absolute';
			coverObj.style.zIndex = menuObj.style.zIndex - 1;
			coverObj.style.left = coverObj.style.top = '0px';
			coverObj.style.width = '100%';
			coverObj.style.height = document.body.scrollHeight + 'px';
			coverObj.style.backgroundColor = '#000';
			coverObj.style.filter = 'progid:DXImageTransform.Microsoft.Alpha(opacity=50)';
			coverObj.style.opacity = 0.5;
			$('append_parent').appendChild(coverObj);
		}
	}
	menuObj.style.display = '';
	if(cover) $(menuid + '_cover').style.display = '';
	if(fade) {
		var O = 0;
		var fadeIn = function(O) {
			if(O == 100) {
				clearTimeout(fadeInTimer);
				return;
			}
			menuObj.style.filter = 'progid:DXImageTransform.Microsoft.Alpha(opacity=' + O + ')';
			menuObj.style.opacity = O / 100;
			O += 10;
			var fadeInTimer = setTimeout(function () {
				fadeIn(O);
			}, 50);
		};
		fadeIn(O);
		menuObj.fade = true;
	} else {
		menuObj.style.filter = 'progid:DXImageTransform.Microsoft.Alpha(opacity=100)';
		menuObj.style.opacity = 1;
		menuObj.fade = false;
	}
	setMenuPosition(showid, menuid, pos);
	if(maxh && menuObj.scrollHeight > maxh) {
		menuObj.style.height = maxh + 'px';
		if(BROWSER.opera) {
			menuObj.style.overflow = 'auto';
		} else {
			menuObj.style.overflowY = 'auto';
		}
	}
	if(!duration) {
		setTimeout('hideMenu(\'' + menuid + '\', \'' + mtype + '\')', timeout);
	}
	if(!in_array(menuid, JSMENU['active'][layer])) JSMENU['active'][layer].push(menuid);
	menuObj.cache = cache;
	if(layer > JSMENU['layer']) {
		JSMENU['layer'] = layer;
	}
}

function setMenuPosition(showid, menuid, pos) {
	var showObj = $(showid);
	var menuObj = menuid ? $(menuid) : $(showid + '_menu');
	if(isUndefined(pos)) pos = '43';
	var basePoint = parseInt(pos.substr(0, 1));
	var direction = parseInt(pos.substr(1, 1));
	var sxy = sx = sy = sw = sh = ml = mt = mw = mcw = mh = mch = bpl = bpt = 0;

	if(!menuObj || (basePoint > 0 && !showObj)) return;
	if(showObj) {
		sxy = fetchOffset(showObj);
		sx = sxy['left'];
		sy = sxy['top'];
		sw = showObj.offsetWidth;
		sh = showObj.offsetHeight;
	}
	mw = menuObj.offsetWidth;
	mcw = menuObj.clientWidth;
	mh = menuObj.offsetHeight;
	mch = menuObj.clientHeight;

	switch(basePoint) {
		case 1:
			bpl = sx;
			bpt = sy;
			break;
		case 2:
			bpl = sx + sw;
			bpt = sy;
			break;
		case 3:
			bpl = sx + sw;
			bpt = sy + sh;
			break;
		case 4:
			bpl = sx;
			bpt = sy + sh;
			break;
	}
	switch(direction) {
		case 0:
			menuObj.style.left = (document.body.clientWidth - menuObj.clientWidth) / 2 + 'px';
			mt = (document.documentElement.clientHeight - menuObj.clientHeight) / 2;
			break;
		case 1:
			ml = bpl - mw;
			mt = bpt - mh;
			break;
		case 2:
			ml = bpl;
			mt = bpt - mh;
			break;
		case 3:
			ml = bpl;
			mt = bpt;
			break;
		case 4:
			ml = bpl - mw;
			mt = bpt;
			break;
	}
	if(in_array(direction, [1, 4]) && ml < 0) {
		ml = bpl;
		if(in_array(basePoint, [1, 4])) ml += sw;
	} else if(ml + mw > document.documentElement.scrollLeft + document.body.clientWidth && sx >= mw) {
		ml = bpl - mw;
		if(in_array(basePoint, [2, 3])) ml -= sw;
	}
	if(in_array(direction, [1, 2]) && mt < 0) {
		mt = bpt;
		if(in_array(basePoint, [1, 2])) mt += sh;
	} else if(mt + mh > document.documentElement.scrollTop + document.documentElement.clientHeight && sy >= mh) {
		mt = bpt - mh;
		if(in_array(basePoint, [3, 4])) mt -= sh;
	}
	if(pos == '210') {
		ml += 69 - sw / 2;
		mt -= 5;
		if(showObj.tagName == 'TEXTAREA') {
			ml -= sw / 2;
			mt += sh / 2;
		}
	}
	if(direction == 0 || menuObj.scrolly) {
		if(BROWSER.ie && BROWSER.ie < 7) {
			if(direction == 0) mt += Math.max(document.documentElement.scrollTop, document.body.scrollTop);
		} else {
			if(menuObj.scrolly) mt -= Math.max(document.documentElement.scrollTop, document.body.scrollTop);
			menuObj.style.position = 'fixed';
		}
	}
	if(ml) menuObj.style.left = ml + 'px';
	if(mt) menuObj.style.top = mt + 'px';
	if(direction == 0 && BROWSER.ie && !document.documentElement.clientHeight) {
		menuObj.style.position = 'absolute';
		menuObj.style.top = (document.body.clientHeight - menuObj.clientHeight) / 2 + 'px';
	}
	if(menuObj.style.clip && !BROWSER.opera) {
		menuObj.style.clip = 'rect(auto, auto, auto, auto)';
	}
}

function fetchOffset(obj) {
	var left_offset = 0, top_offset = 0;

	if(obj.getBoundingClientRect){
		var rect = obj.getBoundingClientRect();
		var scrollTop = Math.max(document.documentElement.scrollTop, document.body.scrollTop);
		var scrollLeft = Math.max(document.documentElement.scrollLeft, document.body.scrollLeft);
		if(document.documentElement.dir == 'rtl') {
			scrollLeft = scrollLeft + document.documentElement.clientWidth - document.documentElement.scrollWidth;
		}
		left_offset = rect.left + scrollLeft - document.documentElement.clientLeft;
		top_offset = rect.top + scrollTop - document.documentElement.clientTop;
	}
	if(left_offset <= 0 || top_offset <= 0) {
		left_offset = obj.offsetLeft;
		top_offset = obj.offsetTop;
		while((obj = obj.offsetParent) != null) {
			left_offset += obj.offsetLeft;
			top_offset += obj.offsetTop;
		}
	}
	return { 'left' : left_offset, 'top' : top_offset };
}

function hideMenu(attr, mtype) {
	attr = isUndefined(attr) ? '' : attr;
	mtype = isUndefined(mtype) ? 'menu' : mtype;
	if(attr == '') {
		for(var i = 1; i <= JSMENU['layer']; i++) {
			hideMenu(i, mtype);
		}
		return;
	} else if(typeof attr == 'number') {
		for(var j in JSMENU['active'][attr]) {
			hideMenu(JSMENU['active'][attr][j], mtype);
		}
		return;
	} else if(typeof attr == 'string') {
		var menuObj = $(attr);
		if(!menuObj || (mtype && menuObj.mtype != mtype)) return;
		clearTimeout(JSMENU['timer'][attr]);
		var hide = function() {
			if(menuObj.cache) {
				menuObj.style.display = 'none';
				if(menuObj.cover) $(attr + '_cover').style.display = 'none';
			} else {
				menuObj.parentNode.removeChild(menuObj);
				if(menuObj.cover) $(attr + '_cover').parentNode.removeChild($(attr + '_cover'));
			}
			var tmp = [];
			for(var k in JSMENU['active'][menuObj.layer]) {
				if(attr != JSMENU['active'][menuObj.layer][k]) tmp.push(JSMENU['active'][menuObj.layer][k]);
			}
			JSMENU['active'][menuObj.layer] = tmp;
		};
		if(menuObj.fade) {
			var O = 100;
			var fadeOut = function(O) {
				if(O == 0) {
					clearTimeout(fadeOutTimer);
					hide();
					return;
				}
				menuObj.style.filter = 'progid:DXImageTransform.Microsoft.Alpha(opacity=' + O + ')';
				menuObj.style.opacity = O / 100;
				O -= 10;
				var fadeOutTimer = setTimeout(function () {
					fadeOut(O);
				}, 50);
			};
			fadeOut(O);
		} else {
			hide();
		}
	}
}


