var market_frame=null;
function market_count(adid,start,end){
	var setcookie=function(sName,sValue){
  	var d=new Date();
  	var year=d.getYear();
  	var end=Date.parse(((year<1900)?(1900+year):year)+"/"+(d.getMonth()+1)+"/"+d.getDate()+" 23:59:59");
  	var t_date = new Date(end);
    var expiresDate = t_date.toUTCString();
    document.cookie=sName+"="+escape(sValue)+";expires="+expiresDate;
  };
  var getcookie=function(sName){  
  	var aCookie = document.cookie.toString().split(";");  
  	for (var i=0; i < aCookie.length; i++){
  		var aCrumb = aCookie[i].split("=");   
  		if (sName == aCrumb[0])    
  		return unescape(aCrumb[1]);  
  	} 
  };  
  var type=0;
	start=start.replace(".0","");
	end=end.replace(".0","");
	var sdate=Date.parse(start.replace(/-/ig,"/"));
	var edate=Date.parse(end.replace(/-/ig,"/"));
	var id=adid+sdate+edate;
  if(getcookie(id)!="1"){
	  setcookie(id,"1");
  }else {
    type=1;	
  }
  if(market_frame!=null) document.body.removeChild(market_frame);
  market_frame=document.createElement("iframe");
  market_frame.style.display="none";
  market_frame.height="1px";
  market_frame.width="1px";
  document.body.appendChild(market_frame);
  //market_frame.src='http://mstat.duowan.com/ADcount.jsp?adid='+adid+'&start='+start+'&end='+end+'&type='+type;
  market_frame.src='http://mstat.duowan.com/stat.action?aid='+adid;
}

function listenLoaded()
{
   if(document.readyState)//IE
   {
     if(document.readyState=="loaded" || document.readyState=="complete" )
	   	{submitPvStat();}
	   else
	    {window.setTimeout(listenLoaded,3000);}
   }
   else if(document.addEventListener)
   {
      document.addEventListener("DOMContentLoaded",submitPvStat,false);
   }
   else
   { 
      alert("not defined borwer type!");
   }
}

function submitPvStat()
{
 
  if(document.market_loadids==null || ""==document.market_loadids){return;}
  var scriptBlock  = document.createElement("script");
  var requrl = "http://mstat.duowan.com/pv.action?aid="+document.market_loadids;
  scriptBlock.src = "";
  scriptBlock.src = requrl;
  scriptBlock.type = "text/javascript";
  scriptBlock.language = "javascript";
  document.getElementsByTagName("head")[0].appendChild(scriptBlock);
}

function market_pvstat(adid)
{
  if(document.market_loadids==null)
     document.market_loadids="";
  document.market_loadids += adid+",";  
}
listenLoaded();
