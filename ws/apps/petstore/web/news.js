
dojo.require("dojo.io.*");

var bpuinews;
if (typeof bpuinews == "undefined") {
	bpuinews = new Object();
}

bpuinews.RSS = function() {
    var currentItem = 0;
    var limitCharNum = 75;
    
    this.getRssInJson = function (method, uri) {
        var encodedURI = encodeURI(method + "?style=json&itemCount=0&url="+uri);
        var bindArgs = {
                    url: encodedURI,
                    mimetype: "text/json",
                    load: function (type, data, http) {
                        handleJsonRss(data);
                    },
                    error: function (t, e) {
                        dojo.debug("ERROR : " + e.message);
                    }
        }
        dojo.io.bind(bindArgs);
        return false;
    }

    function handleJsonRss(json) {
        var elm = document.getElementById("news");
        var cp = insertItem(json);
        elm.innerHTML = cp;
    }

    function insertItem(json) {
        var i;
        var cp="<ul>\n";
        for (i = currentItem; i<currentItem+5; i++) {
            cp += "<li><b>"+decodeURL(json.channel.item[i].title)+"</b>\n";
            cp += "<p>" + decodeURL(json.channel.item[i].description) + "</p>\n</li>\n";
        }
        cp += "</ul>\n";
        return cp;
    }

    /* Compatible function to java.net.URLDecoder.decode().
     * (decodeURI() is not compatible)
     */
    function decodeURL(str){
        var targetStr="";
        var s, tmpStr, unicode, f;
        // take a look at every char in the source str
        var i, j;
        for (i = 0; i < str.length; i++) {
            s = str.charAt(i);
            // handle WS, which is the most common char
            if (s == "+") {
                targetStr += " ";
            } else {
                if (s != "%") {
                    // Non-encoded char
                    targetStr += s;
                } else{
                    // encoding begin
                    unicode = 0;  // uncode representation
                    f = 1;  // flag to specify the escape sequence
                    while (true) {
                        tmpStr = "";
                        // get the two HEX chars and put that in the temp string. If no char, that is not a HEX.
                        for (j = 0; j < 2; j++ ) {
                            tmptmpStr = str.charAt(++i);
                            if (((tmptmpStr >= "0") && (tmptmpStr <= "9")) || 
                                ((tmptmpStr >= "a") && (tmptmpStr <= "f"))  || 
                                ((tmptmpStr >= "A") && (tmptmpStr <= "F"))) {
                                tmpStr += tmptmpStr;
                            } else {
                                --i;
                                break;
                            }
                        }
                        /* parse the HEX
                         * <= 0x7f  : Single byte
                         * >=0xc0 && <=0xdf  : Two bytes
                         * >=0xe0 && <=0xef  : Three bytes
                         * >=0xf0 && <=0xf7  : Four bytes
                         * >=0x80 && <=0xbf  : may not occur - just shift it
                         * <=1  : sequence terminated
                         */
                        var byte = parseInt(tmpStr, 16);
                        if (byte <= 0x7f) {unicode = byte; f = 1;}
                        if ((byte >= 0xc0) && (byte <= 0xdf)) {unicode = byte & 0x1f; f = 2;}
                        if ((byte >= 0xe0) && (byte <= 0xef)) {unicode = byte & 0x0f; f = 3;}
                        if ((byte >= 0xf0) && (byte <= 0xf7)) {unicode = byte & 0x07; f = 4;}
                        if ((byte >= 0x80) && (byte <= 0xbf)) {unicode = (unicode << 6) + (byte & 0x3f); --f;}
                        if (f <= 1) {
                            break;
                        }
                        if (str.charAt(i + 1) == "%") {
                            i++ ;
                        } else {
                            // Error. should not occur
                            break;
                        }
                    }
                targetStr += String.fromCharCode(unicode);
                }
            }
        }
        return targetStr;
    }

    /* Cut the string at the WS so that it's shorter than the limitCharNum.
     */
    function cutStringatWs(str, limitCharNum) {
	var tmpStr = str;
	var cnum = 0;
	while (true) {
	    cnum = tmpStr.lastIndexOf(" ");
	    // no occurance of WS
	    if (cnum < 0) {
		// if str is still longer than limit
		if (tmpStr.length >= limitCharNum) {
		    tmpStr = tmpStr.substring(0, limitCharNum);
		}
		break;
	    } else {
		tmpStr = tmpStr.substring(0, cnum);
		if (cnum <= limitCharNum) {
		    break;
		}
	    }
	}
	return tmpStr;
    }

}

