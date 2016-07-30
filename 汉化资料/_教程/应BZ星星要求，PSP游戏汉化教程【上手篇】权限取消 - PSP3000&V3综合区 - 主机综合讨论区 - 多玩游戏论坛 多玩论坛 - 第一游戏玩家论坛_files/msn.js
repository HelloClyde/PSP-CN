/*
	[Discuz!] (C)2001-2007 Comsenz Inc.
	This is NOT a freeware, use is subject to license terms

	$RCSfile: msn.js,v $
	$Revision: 1.4 $
	$Date: 2007/03/21 15:57:53 $
*/

function msnoperate(action, msn) {
	var actionArray = new Array();
	actionArray = {
		'reghotmail' : 'http://go.discuz.com/?app=msn&linkid=1',
		'reglivemail' : 'http://go.discuz.com/?app=msn&linkid=2',
		'regliveid' : 'http://go.discuz.com/?app=msn&linkid=3',
		'download' : 'http://go.discuz.com/?app=msn&linkid=4',
		'add' : 'http://go.discuz.com/?app=msn&linkid=5&msn=' + msn,
		'chat' : 'http://go.discuz.com/?app=msn&linkid=6&msn=' + msn
	}

	if(messengerInstalled()) {
		window.open(actionArray[action]);
	} else {
		window.open('http://go.discuz.com/msn/msn.html','_blank','width=571, height=498');
	}
}
function messengerInstalled() {
      try {
            new ActiveXObject("MSNMessenger.P4QuickLaunch");
            return true;
      }
      catch (e) {
            return false;
      }
}










































































