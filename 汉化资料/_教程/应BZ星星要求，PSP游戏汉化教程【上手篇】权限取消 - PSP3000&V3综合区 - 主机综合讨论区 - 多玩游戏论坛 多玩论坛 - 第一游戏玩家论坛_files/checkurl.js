function randomUrl() {
	var urlrandom = document.getElementsByName("urlrandom");
	for ( var i = 0; i < urlrandom.length; i++) {
		
		urlrandom[i].id='url_'+i;
	}
}
randomUrl();


function checkUrl(obj)
{
	var url = obj.href;
	var suburl = '';
	var urladd = '';
	var re = /(\w+\.\w+\/)|(\w+\.\w+$)/;
	var regex = /^((\w+):\/\/)?((\w+):?(\w+)?@)?([^\/\?:]+):?(\d+)?(\/?[^\?#]+)?\??([^#]+)?#?(\w*)/;
	var r = regex.exec(url);
	var domain = r[6];
	var r = domain.match(re);
	var f_domain = r[0];
	
	if (whitelist.length > 0) {
		whitelist = trim(whitelist);
		var list = whitelist.split(",");
		for(var i in list) {
			if(typeof list[i] == "string") {
				if(list[i].indexOf('*') != -1) {
					var fd = list[i].match(re);
					if(fd[0] == f_domain) {
						
						return true;
					}
				} else if(list[i] == domain) {
					return true;
				}
			}
		}
	}

	r = regex.exec(bbsurl);
	if (domain == r[6]) {
		return true;
	} else {
		var domain_c = r[6];
		var r = domain_c.match(re);
		if (r) {
			var c_domain = r[0];
			if (c_domain == f_domain) {
				return true;
			}
		}
	}
	
	suburl = url.substr(0,30);
	if (suburl != url) {
		urladd = '...';
	}
	$('suburl').innerHTML = suburl + urladd;

	var black = false;
	if (blacklist.length > 0) {
		var list = blacklist.split(",");
		for(var i in list) {
			if(typeof list[i] == "string") {
				if(list[i].indexOf('*') != -1) {
					var fd = list[i].match(re);
					if(fd[0] == f_domain) {
						black = true;
						break;
					}
				} else if(list[i] == domain) {
					black = true;
					break;
				}
			}
		}
	}

	if(black) {
		$('checkurl_tip').innerHTML = checkurl_warning;
		$('trueurl').innerHTML = '';
	} else {	
		$('checkurl_tip').innerHTML = checkurl_tip;
		$('trueurl').innerHTML = checkurl_submit;
		$('trueurl').href = url;
	}
	movepz(obj.id, 11);

	return false;
}

function movepz(obj,pz)
{
	$(checkurlid).style.display = '';
	$(checkurlid).style.cssText = 'FILTER:Alpha(opacity=95);opacity:0.95;left:-500px;z-index:3000';
	$(checkurlid).style.visibility = 'visible';
	$(checkurlid).style.position='absolute';
	if (typeof obj == 'string') {
		obj = $(obj);
	}

	if (obj == null) {
		$(checkurlid).style.top  = (ietruebody().clientHeight - $(checkurlid).offsetHeight)/3 + ietruebody().scrollTop + 'px';
		$(checkurlid).style.left = (ietruebody().clientWidth - $(checkurlid).offsetWidth)/2 + 'px';
	} else {
		var top  = findPosY(obj);
		var left = findPosX(obj);
		var pz_h = Math.floor(pz/10);
		var pz_w = pz % 10;
		if (pz_h!=1 && (pz_h==2 || top < ietruebody().clientHeight/2)) {
			top += ietruebody().scrollTop + obj.offsetHeight;
		} else {
			top += ietruebody().scrollTop - $(checkurlid).offsetHeight;
		}
		if (pz_w!=1 && (pz_w==2 || left > (ietruebody().clientWidth)*3/5)) {
			left -= $(checkurlid).offsetWidth - obj.offsetWidth;
		}
		$(checkurlid).style.top  = top  + 'px';
		$(checkurlid).style.left = left + 'px';
	}

	var t = null;
	obj.onmouseout = function() {
		t = setTimeout("closep();",500);
		obj.onmouseout = '';
	}
	$(checkurlid).onmouseout = function() {
		t = setTimeout("closep();",500);
	}
	$(checkurlid).onmouseover = function() {
		clearTimeout(t);
	}
}

function closep()
{
	$(checkurlid).style.display = 'none';
}

function ietruebody()
{
	return (document.compatMode && document.compatMode!="BackCompat")? document.documentElement : document.body;
}

function findPosX(obj)
{
	var curleft = 0;
	if (obj.offsetParent) {
		while (obj.offsetParent) {
			curleft += obj.offsetLeft
			obj = obj.offsetParent;
		}
	} else if (obj.x) {
		curleft += obj.x;
	}
	return curleft - ietruebody().scrollLeft;
}
function findPosY(obj)
{
	var curtop = 0;
	if (obj.offsetParent) {
		while (obj.offsetParent) {
			curtop += obj.offsetTop
			obj = obj.offsetParent;
		}
	} else if (obj.y) {
		curtop += obj.y;
	}
	return curtop - ietruebody().scrollTop;
}
