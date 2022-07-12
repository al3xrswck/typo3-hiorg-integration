"use strict";

function firstToUpper(x) {
    switch(x) {
        case "dienst":
            return "Sanit&auml;tsdienst";
        default:
            return ((x.slice(0,1).toUpperCase())+(x.slice(1,x.length)));
    }
}

function GetClearMonth(t) {
    switch (t) {
        case 0:
            return "Januar";
        case 1:
            return "Februar";
        case 2:
            return "M&auml;rz";
        case 3:
            return "April";
        case 4:
            return "Mai";
        case 5:
            return "Juni";
        case 6:
            return "Juli";
        case 7:
            return "August";
        case 8:
            return "September";
        case 9:
            return "Oktober";
        case 10:
            return "November";
        case 11:
            return "Dezember";
        default:
            return t.toString().padStart(2, "0")
    }
}

var script = document.getElementById('terminjs');

var RequestURL = "https://www.hiorg-server.de/termine.php?ov="+script.getAttribute('ov')+"&termin="+script.getAttribute('termin')+"&dienst="+script.getAttribute('dienst')+"&json=1&monate="+script.getAttribute('monate')+"&filter="+script.getAttribute('filter');
<!-- console.log(RequestURL); -->
var RequestMethod = "GET";

var HiOrgRequest = new XMLHttpRequest();
HiOrgRequest.open(RequestMethod, RequestURL);
HiOrgRequest.send();
HiOrgRequest.onloadend = (HiOrgJsonResponse => {
    var ParsedResponse = JSON.parse(HiOrgRequest.responseText.replace('\\"', "").match('^(?:.*)(?:"data":(.*))(?:})$')[1]);
	if(script.getAttribute('DateTimeOnly') == "1"){
		var TableContent = "<thead><tr><th>Datum</th></tr></thead><tbody>";
    }else{
    	var TableContent = "<thead><tr><th>Typ</th><th>Betreff</th><th>Datum</th><th>Ort</th></tr></thead><tbody>";
	}
    
    ParsedResponse.forEach(element => {
        var StartTime = new Date(1e3 * element.sortdate);
        var EndTime = new Date(1e3 * element.enddate);
        var DateString;
        if (StartTime.toLocaleDateString() == EndTime.toLocaleDateString() || "" == element.enddate){
            DateString = StartTime.getDate().toString().padStart(2, "0") + ". " + GetClearMonth(StartTime.getMonth()) + " " + StartTime.getUTCFullYear().toString() + "<br>ab "+StartTime.getHours().toString().padStart(2, "0") + ":" + StartTime.getMinutes().toString().padStart(2, "0") + " Uhr";
        }else{
            DateString = StartTime.getDate().toString().padStart(2, "0") + ". " + GetClearMonth(StartTime.getMonth()) + " " + StartTime.getUTCFullYear().toString() + ", " + StartTime.getHours().toString().padStart(2, "0") + ":" + StartTime.getMinutes().toString().padStart(2, "0") + " Uhr - <br> " + EndTime.getDate().toString().padStart(2, "0") + ". " + GetClearMonth(EndTime.getMonth()) + " " + EndTime.getUTCFullYear().toString() + ", " + EndTime.getHours().toString().padStart(2, "0") + ":" + EndTime.getMinutes().toString().padStart(2, "0") + " Uhr";
        }
        var LocationString = element.verort.replace(",", "<br/>");
    	if(script.getAttribute('dateTimeOnly') == "1"){
        	TableContent += "<tr><td>"+DateString+"</td></tr>";
        }else if(script.getAttribute('includeType') == "1"){
            TableContent += "<tr><td>"+firstToUpper(element.typ)+"</td><td>"+element.verbez+"</td><td>"+DateString+"</td><td>"+LocationString+"</td></tr>";
        }else{
      		TableContent += "<tr><td>"+element.verbez+"</td><td>"+DateString+"</td><td>"+LocationString+"</td></tr>";
        }
    });
      TableContent += "</tbody>";
    document.getElementById("result").innerHTML = TableContent;
});
