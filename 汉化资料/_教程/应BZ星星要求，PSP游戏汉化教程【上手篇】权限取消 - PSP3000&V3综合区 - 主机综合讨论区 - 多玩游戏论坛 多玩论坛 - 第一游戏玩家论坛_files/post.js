/*
	[Discuz!] (C)2001-2007 Comsenz Inc.
	This is NOT a freeware, use is subject to license terms

	$RCSfile: post.js,v $
	$Revision: 1.27 $
	$Date: 2007/08/06 08:27:23 $
*/

var postSubmited = false;
var smdiv = new Array();
var codecount = '-1';
var codehtml = new Array();
var postSubmited = false;
var AID = 1;
var UPLOADSTATUS = -1;
var UPLOADFAILED = UPLOADCOMPLETE = AUTOPOST =  0;
var CURRENTATTACH = '0';
var FAILEDATTACHS = '';
var UPLOADWINRECALL = null;
var STATUSMSG = {'-1' : '内部服务器错误', '0' : '上传成功', '1' : '不支持此类扩展名', '2' : '附件大小为 0', '3' : '附件大小超限', '4' : '不支持此类扩展名', '5' : '附件大小超限', '6' : '附件总大小超限', '7' : '图片附件不合法', '8' : '附件文件无法保存', '9' : '没有合法的文件被上传', '10' : '非法操作'};


function AddText(txt) {
	obj = $('postform').message;
	selection = document.selection;
	checkFocus();
	if(!isUndefined(obj.selectionStart)) {
		var opn = obj.selectionStart + 0;
		obj.value = obj.value.substr(0, obj.selectionStart) + txt + obj.value.substr(obj.selectionEnd);
	} else if(selection && selection.createRange) {
		var sel = selection.createRange();
		sel.text = txt;
		sel.moveStart('character', -strlen(txt));
	} else {
		obj.value += txt;
	}
}

function checkFocus() {
	var obj = typeof wysiwyg == 'undefined' || !wysiwyg ? $('postform').message : editwin;
	if(!obj.hasfocus) {
		obj.focus();
	}
}

function ctlent(event) {
	if(postSubmited == false && (event.ctrlKey && event.keyCode == 13) || (event.altKey && event.keyCode == 83) && $('postsubmit')) {
		if(in_array($('postsubmit').name, ['topicsubmit', 'replysubmit', 'editsubmit', 'pmsubmit']) && !validate($('postform'))) {
			doane(event);
			return;
		}
		postSubmited = true;
		$('postsubmit').disabled = true;
		$('postform').submit();
	}
}

function deleteData() {
	if(is_ie) {
		saveData('', 'delete');
	} else if(window.sessionStorage) {
		try {
			sessionStorage.removeItem('Discuz!');
		} catch(e) {}
	}
}

function insertSmiley(smilieid) {
	checkFocus();
	var src = $('smilie_' + smilieid).src;
	var code = $('smilie_' + smilieid).code;
	if(typeof wysiwyg != 'undefined' && wysiwyg && allowsmilies && (!$('smileyoff') || $('smileyoff').checked == false)) {
		if(is_moz) {
			applyFormat('InsertImage', false, src);
			var smilies = editdoc.body.getElementsByTagName('img');
			for(var i = 0; i < smilies.length; i++) {
				if(smilies[i].src == src && smilies[i].getAttribute('smilieid') < 1) {
					smilies[i].setAttribute('smilieid', smilieid);
					smilies[i].setAttribute('border', "0");
				}
			}
		} else {
			insertText('<img src="' + src + '" border="0" smilieid="' + smilieid + '" alt="" /> ', false);
		}
	} else {
		code += ' ';
		AddText(code);
	}
}

function parseurl(str, mode, parsecode) {
	if(!parsecode) str= str.replace(/\s*\[code\]([\s\S]+?)\[\/code\]\s*/ig, function($1, $2) {return codetag($2);});
	str = str.replace(/([^>=\]"'\/]|^)((((https?|ftp):\/\/)|www\.)([\w\-]+\.)*[\w\-\u4e00-\u9fa5]+\.([\.a-zA-Z0-9]+|\u4E2D\u56FD|\u7F51\u7EDC|\u516C\u53F8)((\?|\/|:)+[\w\.\/=\?%\-&~`@':+!]*)+\.(jpg|gif|png|bmp))/ig, mode == 'html' ? '$1<img src="$2" border="0">' : '$1[img]$2[/img]');
	str = str.replace(/([^>=\]"'\/@]|^)((((https?|ftp|gopher|news|telnet|rtsp|mms|callto|bctp|ed2k|thunder|synacast):\/\/))([\w\-]+\.)*[:\.@\-\w\u4e00-\u9fa5]+\.([\.a-zA-Z0-9]+|\u4E2D\u56FD|\u7F51\u7EDC|\u516C\u53F8)((\?|\/|:)+[\w\.\/=\?%\-&~`@':+!#]*)*)/ig, mode == 'html' ? '$1<a href="$2" target="_blank">$2</a>' : '$1[url]$2[/url]');
	str = str.replace(/([^\w>=\]"'\/@]|^)((www\.)([\w\-]+\.)*[:\.@\-\w\u4e00-\u9fa5]+\.([\.a-zA-Z0-9]+|\u4E2D\u56FD|\u7F51\u7EDC|\u516C\u53F8)((\?|\/|:)+[\w\.\/=\?%\-&~`@':+!#]*)*)/ig, mode == 'html' ? '$1<a href="$2" target="_blank">$2</a>' : '$1[url]$2[/url]');
	str = str.replace(/([^\w->=\]:"'\.\/]|^)(([\-\.\w]+@[\.\-\w]+(\.\w+)+))/ig, mode == 'html' ? '$1<a href="mailto:$2">$2</a>' : '$1[email]$2[/email]');
	if(!parsecode) {
		for(var i = 0; i <= codecount; i++) {
			str = str.replace("[\tDISCUZ_CODE_" + i + "\t]", codehtml[i]);
		}
	}
	return str;
}

function codetag(text) {
	codecount++;
	if(typeof wysiwyg != 'undefined' && wysiwyg) text = text.replace(/<br[^\>]*>/ig, '\n').replace(/<(\/|)[A-Za-z].*?>/ig, '');
	codehtml[codecount] = '[code]' + text + '[/code]';
	return '[\tDISCUZ_CODE_' + codecount + '\t]';
}

function loadData(quiet) {
	var data = '';
	if(BROWSER.ie){
		with(document.documentElement) {
            		load('Discuz');
			data = getAttribute("value");
        	}
	} else if(window.sessionStorage){
		data = sessionStorage.getItem('Discuz');
        }

	if(in_array((data = trim(data)), ['', 'null', 'false', null, false])) {
		if(!quiet) {
			showDialog('没有可以恢复的数据！');
		}
		return;
	}

	if(!quiet && !confirm('此操作将覆盖当前帖子内容，确定要恢复数据吗？')) {
		return;
	}

	var data = data.split(/\x09\x09/);
	for(var i = 0; i < $('postform').elements.length; i++) {
		var el = $('postform').elements[i];
		if(el.name != '' && (el.tagName == 'TEXTAREA' || el.tagName == 'INPUT' && (el.type == 'text' || el.type == 'checkbox' || el.type == 'radio'))) {
			for(var j = 0; j < data.length; j++) {
				var ele = data[j].split(/\x09/);
				if(ele[0] == el.name) {
					elvalue = !isUndefined(ele[3]) ? ele[3] : '';
					if(ele[1] == 'INPUT') {
						if(ele[2] == 'text') {
							el.value = elvalue;
						} else if((ele[2] == 'checkbox' || ele[2] == 'radio') && ele[3] == el.value) {
							el.checked = true;
							evalevent(el);
						}
					} else if(ele[1] == 'TEXTAREA') {
						if(ele[0] == 'message') {
							if(!wysiwyg) {
								textobj.value = elvalue;
							} else {
								editdoc.body.innerHTML = bbcode2html(elvalue);
							}
						} else {
							el.value = elvalue;
						}
					}
					break
				}
			}
		}
	}
}

function evalevent(obj) {
	var script = obj.parentNode.innerHTML;
	var re = /onclick="(.+?)["|>]/ig;
	var matches = re.exec(script);
	if(matches != null) {
		matches[1] = matches[1].replace(/this\./ig, 'obj.');
		eval(matches[1]);
	}
}

function setCaretAtEnd() {
	if(wysiwyg) {
		editdoc.body.innerHTML += '';
	} else {
		editdoc.value += '';
	}
}

function smileyMenu(ctrl) {
	var smiley = ctrl.firstChild;
	ctrl.style.cursor = 'pointer';
	if(smiley.alt) {
		smiley.code = smiley.alt;
		smiley.alt = '';
	}
	if(smiley.title) {
		smiley.lw = smiley.title;
		smiley.title = '';
	}
	smdiv[ctrl.id] = document.createElement('div');
	smdiv[ctrl.id].id = smiley.id + '_menu';
	smdiv[ctrl.id].style.display = 'none';
	smdiv[ctrl.id].style.width = '60px';
	smdiv[ctrl.id].style.height = '60px';
	smdiv[ctrl.id].className = 'popupmenu_popup';
	$('smilieslist').appendChild(smdiv[ctrl.id]);
	smdiv[ctrl.id].innerHTML = '<table width="100%" height="100%"><tr><td align="center" valign="middle"><img src="' + smiley.src + '" border="0" width="' + smiley.lw + '" /></td></tr></table>';
	showMenu(ctrl.id, 0, 0, 1, 0, 0, smiley.id);
}

function storeCaret(textEl){
	if(textEl.createTextRange){
		textEl.caretPos = document.selection.createRange().duplicate();
	}
}

if(is_ie >= 5 || is_moz >= 2) {
	window.onbeforeunload = function () {
		try {
			saveData(wysiwyg && bbinsert ? editdoc.body.innerHTML : textobj.value);
		} catch(e) {}
	};
}

function setmediacode(editorid) {
	insertText('[media='+$(editorid + '_mediatype').value+
		','+$(editorid + '_mediawidth').value+
		','+$(editorid + '_mediaheight').value+
		','+$(editorid + '_mediaautostart').value+']'+
		$(editorid + '_mediaurl').value+'[/media]');
	hideMenu();
}

function setmediatype(editorid) {
	var ext = $(editorid + '_mediaurl').value.lastIndexOf('.') == -1 ? '' : $(editorid + '_mediaurl').value.substr($(editorid + '_mediaurl').value.lastIndexOf('.') + 1, $(editorid + '_mediaurl').value.length).toLowerCase();
	if(ext == 'rmvb') {
		ext = 'rm';
	}
	if($(editorid + '_mediatyperadio_' + ext)) {
		$(editorid + '_mediatyperadio_' + ext).checked = true;
		$(editorid + '_mediatype').value = ext;
	}
}

var divdragstart = new Array();
function divdrag(e, op, obj) {
	if(op == 1) {
		if(is_ie) {
			document.body.onselectstart = function() {
				return false;
			}
		}
		divdragstart = is_ie ? [event.clientX, event.clientY] : [e.clientX, e.clientY];
		divdragstart[2] = parseInt(obj.style.left);
		divdragstart[3] = parseInt(obj.style.top);
		doane(e);
	} else if(op == 2 && divdragstart[0]) {
		var divdragnow = is_ie ? [event.clientX, event.clientY] : [e.clientX, e.clientY];
		obj.style.left = (divdragstart[2] + divdragnow[0] - divdragstart[0]) + 'px';
		obj.style.top = (divdragstart[3] + divdragnow[1] - divdragstart[1]) + 'px';
		doane(e);
	} else if(op == 3) {
		if(is_ie) {
			document.body.onselectstart = function() {
				return true;
			}
		}
		divdragstart = [];
		doane(e);
	}
}

function fetchCheckbox(cbn) {
	return $(cbn) && $(cbn).checked == true ? 1 : 0;
}