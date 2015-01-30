﻿if (typeof (Number.prototype.format) != "function") {
    /* 
    功能：格式化数字显示方式。
    参数：
        pattern 格式化字符串。取值范围如下
            "0"零占位符。用对应的数字（如果存在）替换零；否则，将在结果字符串中显示零。
            "#"数字占位符。用对应的数字（如果存在）替换“#”符号；否则，不会在结果字符串中显示任何数字。
            "."小数点。确定小数点分隔符在结果字符串中的位置。
            ","组分隔符。它在各个组之间插入组分隔符字符。
    返回值：替换后的字符串。
    
    调用示例：
        console.log("(123456789012.129).format()-->" + (123456789012.129).format());  //123456789012.129
        console.log("(123456789012.129).format('')-->" + (123456789012.129).format()); //123456789012.129
        console.log("(123456789012.129).format('#,##0.00')-->" + (123456789012.129).format('#,##0.00')); //123,456,789,012.13
        console.log("(123456789012.129).format('#,##0.##')-->" + (123456789012.129).format('#,##0.##')); //123,456,789,012.13
        console.log("(123456789012.129).format('#,##0.00')-->" + (123456789012.129).format('#,##0.00')); //123,456,789,012.13
        console.log("(123456789012.129).format('#,##0.##')-->" + (123456789012.129).format('#,##0.##')); //123,456,789,012.13
        console.log("(12.129).format('0.00')-->" + (12.129).format('0.00')); //12.13
        console.log("(12.129).format('0.##')-->" + (12.129).format('0.##')); //12.13
        console.log("(12).format('00000')-->" + (12).format('00000')); //00012
        console.log("(12).format('#.##')-->" + (12).format('#.##')); //12
        console.log("(12).format('#.00')-->" + (12).format('#.00')); //12.00
        console.log("(0).format('#.##')-->" + (0).format('#.##')); //0
        console.log("(123456).format('.###')-->" + (123456).format('.###')); //123456
        console.log("(0).format('###.#####')-->" + (0).format('###.#####')); //0
    */
    Number.prototype.format = function (pattern) {
        if (!pattern) return this.toString();

        var num = this;
        //if (num === undefined) return undefined;
        //if (num == null) return null;
        //if (num == "") return "";

        if (num != undefined && num != null && pattern) { //对小数点后数字做四舍五入。
            var lio = pattern.lastIndexOf(".");
            if (lio != -1) {
                How = pattern.length - lio - 1;
                num = Math.round(num * Math.pow(10, How)) / Math.pow(10, How);
            }
        }

        var strarr = num ? num.toString().split('.') : ['0'];
        var fmtarr = pattern ? pattern.split('.') : [''];
        var retstr = '';

        // 整数部分  
        var str = strarr[0];
        var fmt = fmtarr[0];
        var i = str.length - 1;
        var comma = false;
        for (var f = fmt.length - 1; f >= 0; f--) {
            switch (fmt.substr(f, 1)) {
                case '#':
                    if (i >= 0) retstr = str.substr(i--, 1) + retstr;
                    break;
                case '0':
                    if (i >= 0) retstr = str.substr(i--, 1) + retstr;
                    else retstr = '0' + retstr;
                    break;
                case ',':
                    comma = true;
                    retstr = ',' + retstr;
                    break;
            }
        }
        if (i >= 0) {
            if (comma) {
                var l = str.length;
                for (; i >= 0; i--) {
                    retstr = str.substr(i, 1) + retstr;
                    if (i > 0 && ((l - i) % 3) == 0) retstr = ',' + retstr;
                }
            }
            else retstr = str.substr(0, i + 1) + retstr;
        }

        retstr = retstr + '.';
        // 处理小数部分  
        str = strarr.length > 1 ? strarr[1] : '';
        fmt = fmtarr.length > 1 ? fmtarr[1] : '';
        i = 0;
        for (var f = 0; f < fmt.length; f++) {
            switch (fmt.substr(f, 1)) {
                case '#':
                    if (i < str.length) retstr += str.substr(i++, 1);
                    break;
                case '0':
                    if (i < str.length) retstr += str.substr(i++, 1);
                    else retstr += '0';
                    break;
            }
        }
        return retstr.replace(/^,+/, '').replace(/\.$/, '');
    }
}


if (typeof (Date.prototype.format) != "function") {
    /*
    功能：格式化 Date 显示方式。
    参数：
        format 格式化字符串。取值范围参考“自定义日期和时间格式字符串”
        local 语言设置。取值范围：目前只支持“en”与“zh_cn”。
    返回值：替换后的字符串。
    
    自定义日期和时间格式字符串：
    “d”一个月中的某一天（1 到 31）。
    “dd”一个月中的某一天（01 到 31）。
    “ddd”一周中某天的缩写名称。
    “dddd”一周中某天的完整名称。
    “f”日期和时间值的十分之几秒。
    6/15/2009 13:45:30.617 -> 6
    6/15/2009 13:45:30.050 -> 0
    “ff”日期和时间值的百分之几秒。
    6/15/2009 13:45:30.617 -> 61
    6/15/2009 13:45:30.005 -> 00
    “fff”日期和时间值的毫秒。
    6/15/2009 13:45:30.617 -> 617
    6/15/2009 13:45:30.0005 -> 000
    “F”如果非零，则为日期和时间值的十分之几秒。
    6/15/2009 13:45:30.617 -> 6
    6/15/2009 13:45:30.050 ->（无输出）
    “FF”如果非零，则为日期和时间值的百分之几秒。
    6/15/2009 13:45:30.617 -> 61
    6/15/2009 13:45:30.005 ->（无输出）
    “FFF”如果非零，则为日期和时间值的毫秒。
    6/15/2009 13:45:30.617 -> 617
    6/15/2009 13:45:30.0005 ->（无输出）
    “h”采用 12 小时制的小时（从 1 到 12）。
    “hh”采用 12 小时制的小时（从 01 到 12）。
    “H”采用 24 小时制的小时（从 0 到 23）。
    “HH”采用 24 小时制的小时（从 00 到 23）。
    “m”分钟（0 到 59）。
    “mm”分钟（00 到 59）。
    “M”月份（1 到 12）。
    “MM”月份（01 到 12）。
    “MMM”月份的缩写名称。
    “MMMM”月份的完整名称。
    “s”秒（0 到 59）。
    “ss”秒（00 到 59）。
    “t”AM/PM 指示符的第一个字符。
    6/15/2009 1:45:30 PM -> P
    6/15/2009 1:45:30 PM -> 午
    “tt”AM/PM 指示符。
    6/15/2009 1:45:30 PM -> PM
    6/15/2009 1:45:30 PM -> 午後
    “y”年份（0 到 99）。
    “yy”年份（00 到 99）。
    “yyy”年份（最少三位数字）。
    “yyyy”由四位数字表示的年份。
    
    调用示例：
        var d = new Date("2015-01-30 13:15:38.617");
        console.log('d.format()-->' + d.format());    //Fri Jan 30 2015 13:15:38 GMT+0800 (中国标准时间)
        console.log('d.format("")-->' + d.format(""));    //Fri Jan 30 2015 13:15:38 GMT+0800 (中国标准时间)
        console.log('d.format("yyyy-MM-dd HH:mm:ss")-->' + d.format("yyyy-MM-dd HH:mm:ss"));    //2015-01-30 13:15:38
        console.log('d.format("yyyy年MM月dd日 HH:mm:ss")-->' + d.format("yyyy年MM月dd日 HH:mm:ss"));    //2015年01月30日 13:15:38
        console.log('d.format("yyyy-MM-dd HH:mm:ss.fff")-->' + d.format("yyyy-MM-dd HH:mm:ss.fff"));    //2015-01-30 13:15:38.617
        console.log('d.format("yyyy年 MMM dd dddd", "zh_cn")-->' + d.format("yyyy年 MMM dd dddd", "zh_cn"));    //2015年 一月 30 星期五
        console.log('d.format("yyyy MMM dd dddd", "en")-->' + d.format("yyyy MMM dd dddd", "en"));    //2015 Jan 30 Friday
    */
    Date.prototype.format = function (pattern, local) {
        if (!pattern) return this.toString();

        var time = {};
        time.Year = this.getFullYear();
        time.TYear = ("" + time.Year).substr(2);
        time.Month = this.getMonth() + 1;
        time.TMonth = time.Month < 10 ? "0" + time.Month : time.Month;
        time.Day = this.getDate();
        time.TDay = time.Day < 10 ? "0" + time.Day : time.Day;
        time.Hour = this.getHours();
        time.THour = time.Hour < 10 ? "0" + time.Hour : time.Hour;
        time.hour = time.Hour < 13 ? time.Hour : time.Hour - 12;
        time.Thour = time.hour < 10 ? "0" + time.hour : time.hour;
        time.Minute = this.getMinutes();
        time.TMinute = time.Minute < 10 ? "0" + time.Minute : time.Minute;
        time.Second = this.getSeconds();
        time.TSecond = time.Second < 10 ? "0" + time.Second : time.Second;
        time.Millisecond = this.getMilliseconds();
        time.Week = this.getDay();
        time.AmPm = time.Hour < 13 ? 0 : 1;

        if (pattern != undefined && pattern.replace(/\s/g, "").length > 0) {
            var loc = (local ? this.formatLocal[local] : this.formatLocal["en"]);
            time.regs = {
                "yyyy": time.Year,
                "yyy": time.Year,
                "yy": time.TYear,
                "y": time.TYear,
                "MMMM": loc.MonthLong[time.Month - 1],
                "MMM": loc.Month[time.Month - 1],
                "MM": time.TMonth,
                "M": time.Month,
                "dddd": loc.WeekLong[time.Week],
                "ddd": loc.Week[time.Week],
                "dd": time.TDay,
                "d": time.Day,
                "HH": time.THour,
                "H": time.Hour,
                "hh": time.Thour,
                "h": time.hour,
                "mm": time.TMinute,
                "m": time.Minute,
                "ss": time.TSecond,
                "s": time.Second,
                "fff": (time.Millisecond / 1000).format("0.000").substr(2),
                "ff": (time.Millisecond / 1000).format("0.00").substr(2),
                "f": (time.Millisecond / 1000).format("0.0").substr(2),
                "FFF": (time.Millisecond / 1000).format("0.###").substr(2),
                "FF": (time.Millisecond / 1000).format("0.##").substr(2),
                "F": (time.Millisecond / 1000).format("0.#").substr(2),
                "tt": loc.AMPMLong[time.AmPm],
                "t": loc.AMPM[time.AmPm]
            };
            var result = "";
            var finded = false;
            while (pattern.length > 0) {
                finded = false;
                for (var keyword in time.regs) {
                    if (pattern.substr(0, keyword.length) == keyword) {
                        result += time.regs[keyword];
                        pattern = pattern.substr(keyword.length);
                        finded = true;
                        break;
                    }
                }
                if (!finded) {
                    result += pattern[0];
                    pattern = pattern.substr(1);
                }
            }
            return result;
        }
        else {
            pattern = time.Year + "-" + time.Month + "-" + time.Day + " " + time.Hour + ":" + time.Minute + ":" + time.Second;
            return pattern;
        }
    }

    //定义 Date.prototype.format 方法使用的本地化配置。
    Date.prototype.formatLocal = {
        "en": {
            Month: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            MonthLong: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
            Week: ["Sun", "Mon", "Tue", "Web", "Thu", "Fri", "Sat"],
            WeekLong: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            AMPM: ["A", "P"],
            AMPMLong: ["AM", "PM"],
        },
        "zh_cn": {
            Month: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
            MonthLong: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
            Week: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"],
            WeekLong: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"],
            AMPM: ["", "午"],
            AMPMLong: ["", "午后"],

        }
    };
}

if (typeof (Array.prototype.indexOf) != "function") {
    /*
    功能：获取一个元素在 Array 中的索引值。（为 JavaScript Array 对象添加的扩展方法。）
    参数：
        p_var：要检索的元素。
    返回值：元素的索引值。找不到返回 -1。
    调用示例：
        var a = new Array();
        a.push("abc");
        a.push("def");
        alert(a.indexOf("abc"));
        alert(a.indexOf("def"));
    */
    Array.prototype.indexOf = function (p_var) {
        for (var i = 0; i < this.length; i++) {
            if (this[i] == p_var) {
                return (i);
            }
        }
        return (-1);
    }
}


if (typeof (Array.prototype.remove) != "function") {
    /*
    功能：从 Array 中删除一个元素。（为 JavaScript Array 对象添加的扩展方法。）
    参数：
        o：要删除的元素。
    返回值：找到并且成功删除返回 true。否则返回 false。
    调用示例：
        var a = new Array();
        a.push("abc");
        a.push("def");
        alert(a[0]);
        a.remove("abc");
        alert(a[0]);
    */
    Array.prototype.remove = function (o) {
        var i = this.indexOf(o);
        if (i > -1) this.splice(i, 1);
        return (i > -1);
    }
}


if (typeof (RegExp.prototype.escape) != "function") {
    /*
    功能：通过替换为转义码来转义最小的元字符集（\、*、+、?、|、{、[、(、)、^、$、.、# 和空白）。（为 JavaScript RegExp 对象添加的扩展方法。）
    参数：
        str：一个可能包含正则表达式元字符的字符串。
    返回值：替换后的字符串。
    
    调用示例：
        var s="abc$def";
        alert(RegExp.prototype.escape(s));//输出 abc\$def。
    */
    RegExp.prototype.escape = function (str) {
        return str.replace(/\\/gi, "\\")
        .replace(/\*/gi, "\\*")
        .replace(/\+/gi, "\\+")
        .replace(/\?/gi, "\\?")
        .replace(/\|/gi, "\\|")
        .replace(/\{/gi, "\\{")
        .replace(/\[/gi, "\\[")
        .replace(/\(/gi, "\\(")
        .replace(/\)/gi, "\\)")
        .replace(/\^/gi, "\\^")
        .replace(/\$/gi, "\\$")
        .replace(/\./gi, "\\.")
        .replace(/\#/gi, "\\#");
    }
}

if (typeof (String.prototype.startsWith) != "function") {
    /*
    功能：判断字符串是否以指定的文本为前缀。（为 JavaScript String 对象添加的扩展方法。）
    参数：
        s：判定字符串。
        ignoreCase：指示是否忽略大小写，默认值为 false。
    返回值：返回 true 表示字符串以 s 指定的文本开始，否则返回 false。
    
    调用示例：
        var s="abc";
        alert(s.startsWith("C",true));//返回值为 false。
    */
    String.prototype.startsWith = function (s, ignoreCase) {
        var reg;
        if (ignoreCase == true) {
            reg = new RegExp("^" + RegExp.prototype.escape(s), "gi");
        }
        else {
            reg = new RegExp("^" + RegExp.prototype.escape(s), "g");
        }
        return reg.test(this);
    }
}

if (typeof (String.prototype.endsWith) != "function") {
    /*
    功能：判断字符串是否以指定的文本为后缀。（为 JavaScript String 对象添加的扩展方法。）
    参数：
        s：判定字符串。
        ignoreCase：指示是否忽略大小写，默认值为 false。
    返回值：返回 true 表示字符串以 s 指定的文本结尾，否则返回 false。
    
    调用示例：
        var s="abc";
        alert(s.endsWith("c"));//返回值为 true。
    */
    //判断字符串是否以指定的文本为后缀。
    String.prototype.endsWith = function (s, ignoreCase) {
        var reg;
        if (ignoreCase == true) {
            reg = new RegExp(RegExp.prototype.escape(s) + "$", "gi");
        }
        else {
            reg = new RegExp(RegExp.prototype.escape(s) + "$", "g");
        }
        return reg.test(this);
    }
}

/*
功能：从指定的 URI 中获取指定的参数的值。
参数：
uri：一个可能包含参数的 uri 字符串。
Name：参数名。
返回值：找不到返回 null，否则返回找到的值。
*/
function getUriParameter(uri, Name) {
    //uri = unescape(uri);
    var reg = new RegExp("(\\?|&)" + Name.replace(/\$/gi, "\\$") + "=([^&]*)", "gi");
    uri = uri.match(reg);
    if (uri) {
        return decodeURIComponent((uri + "").replace(reg, "$2"));
    }
    return null;
}


/*
功能：为指定的 URI 设置参数。
参数：
    uri：一个可能包含参数的 uri 字符串。
    Name：参数名。
    Value：新的参数值。
返回值：处理后的 uri。
备注：如果参数存在则更改它的值，否则添加这个参数。
*/
function setUriParameter(uri, Name, Value) {
    uri = uri.replace(/(\s|\?)*$/g, "");//消除 URI 中无参数但存在问号“...?”这种 URI 中的问号。
    if (uri.indexOf("?") == -1) {//如果无参数。
        return uri + "?" + Name + "=" + encodeURIComponent(Value);
    }
    else {//如果有参数。
        var reg = new RegExp("(\\?|&)" + Name.replace(/\$/gi, "\\$") + "=([^&]*)", "gi");//测试可能被替换的参数的正则表达式。
        if (reg.test(uri)) {//如果存在同名参数。
            return uri.replace(reg, "$1" + Name.replace(/\$/gi, "$$$$") + "=" + encodeURIComponent(Value));
        }
        else {//如果无同名参数。
            return uri + "&" + Name + "=" + encodeURIComponent(Value);
        }
    }
}


/*
功能：从指定的 URI 删除参数。
参数：
    uri：一个可能包含参数的 uri 字符串。
    Name：参数名。
返回值：处理后的 uri。
*/
function removeUriParameter(uri, Name) {
    Name = Name.replace(/\$/gi, "\\$");
    var reg = new RegExp("(\\?|&)" + Name + "=([^&]*)", "gi");//测试可能被替换的参数的正则表达式。
    if (reg.test(uri)) {
        var reg1 = new RegExp("\\?" + Name + "=([^&]*)&", "gi");
        uri = uri.replace(reg1, "?");
        var reg2 = new RegExp("\\?" + Name + "=([^&]*)", "gi");
        uri = uri.replace(reg2, "");
        var reg3 = new RegExp("&" + Name + "=([^&]*)", "gi");
        uri = uri.replace(reg3, "");
    }
    return uri;
}


/*
功能：从指定的 URI 删除所有参数（从问号“?”开始到字符串结束的子串），只保留问号“?”之前的部分。
参数：
    uri：一个可能包含参数的 uri 字符串。
返回值：处理后的 uri。
*/
function clearUriParameter(uri) {
    var reg = /\?(.*)/gi
    if (reg.test(uri)) {
        return uri.replace(reg, "")
    }
    return uri;
}


/*
功能：获取指定的 URI 的协议和域名部分。
参数：
    url：一个 url 字符串。
返回值：找不到返回空字符串 “”，否则返回找到的值,并且以左下划线“/”为后缀。

调用示例：
    alert(getUrlProtocolAndDomain("http://www.thinksea.com/a.htm"));//返回值为 http://www.thinksea.com/。
*/
function getUrlProtocolAndDomain(url) {
    /// <summary>
    /// 获取指定的 URI 的协议和域名部分。
    /// </summary>
    /// <param name="url" type="String">一个 url 字符串。</param>
    /// <returns type="String">
    /// 找不到返回空字符串 “”，否则返回找到的值,并且以左下划线“/”为后缀。
    /// </returns>
    var reg = /^[^\/\\]+:\/\/([^\/]+)/gi;
    var m = url.match(reg);
    if (m) {
        return m[0];
    }
    return "";
}

/*
功能：获取指定的 URI 的路径（不包含文件名和参数部分），返回结果以左下划线“/”为后缀。
参数：
    uri：一个 uri 字符串。
返回值：找不到返回 null，否则返回找到的值。
备注：下列情况中(*.*)视为文件名
    1、xxxx://domain/(*.*)
    2、xxxx://domain/(*.*)?parameters
    注意：由于 URL 存在的允许特殊使用原因，下列特殊情况不包含在内，即以路径分隔符结束的情况：
    1、xxxx://domain/(*.*)/
    2、xxxx://domain/(*.*)/?parameters
调用示例：
    alert(getUriPath("http://www.thinksea.com/a.aspx?id=1&name=2"));//输出 http://www.thinksea.com/
    alert(getUriPath("http://www.thinksea.com/?id=1&name=2"));//输出 http://www.thinksea.com/
    alert(getUriPath("http://www.thinksea.com?id=1&name=2"));//输出 http://www.thinksea.com/
    alert(getUriPath("http://www.thinksea.com/"));//输出 http://www.thinksea.com/
    alert(getUriPath("http://www.thinksea.com"));//输出 http://www.thinksea.com/
    alert(getUriPath("http://www.thinksea.com/a.aspx/?id=1&name=2"));//输出 http://www.thinksea.com/a.aspx/
*/
function getUriPath(uri) {
    if (uri == undefined || uri == null || uri == "") {
        return null;
    }
    var path = clearUriParameter(uri);
    var filename = path.replace(/^[^\/\\]+:\/\/(([^\/]+$)|([^\/]+\/+)*)/gi, "");
    if (filename != "" && /\./gi.test(filename)) {
        path = path.substring(0, path.length - filename.length);
    }
    var regEndsWith = /\/$/gi;
    if (regEndsWith.test(path)) {
        return path;
    }
    else {
        return path + "/";
    }
}


/*
功能：返回两个路径的组合。
参数：
    url1：第1个 url 字符串。
    url2：第2个 url 字符串。
返回值：如果 url1 和 url2 任何一个参数为空字符串，则返回另一个参数的值。
    如果 url2 包含绝对路径则返回 url2。
    否则返回两个路径的组合。

调用示例：
    alert(combineUrl("http://www.thinksea.com/a", "b/c.htm"));//返回值为 http://www.thinksea.com/a/b/c.htm
    alert(combineUrl("http://www.thinksea.com/a", "/b/c.htm"));//返回值为 http://www.thinksea.com/b/c.htm
*/
function combineUrl(url1, url2) {
    /// <summary>
    /// 返回两个路径的组合。
    /// </summary>
    /// <param name="url1" type="String">第1个 url 字符串。</param>
    /// <param name="url2" type="String">第2个 url 字符串。</param>
    /// <returns type="String">
    /// 如果 url1 和 url2 任何一个参数为空字符串，则返回另一个参数的值。
    /// 如果 url2 包含绝对路径则返回 url2。
    /// 否则返回两个路径的组合。
    /// </returns>
    if (url1 == "") return url2;
    if (url2 == "") return url1;
    if (url2.indexOf("://") >= 0) {
        return url2;
    }
    var regStartsWith = /^\//gi;
    var regEndsWith = /\/$/gi;
    if (regStartsWith.test(url2)) {
        return getUrlProtocolAndDomain(url1) + url2;
    }
    if (regEndsWith.test(url1)) {
        return url1 + url2;
    }
    else {
        return url1 + "/" + url2;
    }
}

/*
功能：获取指定 Url 的最短路径。通过转化其中的 ../ 等内容，使其尽可能缩短。
参数：
    url：一个 uri 字符串。
返回值：处理后的 url。

调用示例：
    alert(getFullUrl("http://www.thinksea.com/../../a/b/../c.htm"));//返回值为 http://www.thinksea.com/a/c.htm
*/
function getFullUrl(url) {
    /// <summary>
    /// 获取指定 Url 的最短路径。
    /// 通过转化其中的 ../ 等内容，使其尽可能缩短。
    /// </summary>
    /// <param name="url" type="String">一个 uri 字符串。</param>
    /// <returns type="String">
    /// 处理后的 url。
    /// </returns>
    var domain = getUrlProtocolAndDomain(url);
    var reg = /^\//gi;
    if (domain == "" && !reg.test(url)) {
        return url;
    }
    var r = url.substring(domain.length, url.length);
    var reg1 = /(^\/(\.\.\/)+)/gi;
    var reg2 = /(\/[^\/.]+\/..\/)/gi;
    var last = r;
    do {
        r = r.replace(reg1, "/");
        r = r.replace(reg2, "/");
        if (r.length == last.length) {
            break;
        }
        last = r;
    } while (true);
    return combineUrl(domain, r);
}


/*
功能：转义一个字符串，使其符合 XML 实体规则。
参数：
s：一个文本片段。
返回值：符合 XML 实体规则的文本对象。
*/
function xmlEncode(s) {
    s = s.replace(/\&/g, "&amp;");
    s = s.replace(/\</g, "&lt;");
    s = s.replace(/\>/g, "&gt;");
    s = s.replace(/\'/g, "&apos;");
    s = s.replace(/\"/g, "&quot;");
    return s;
}


/*
功能：将字符串转换为 HTML 编码的字符串。
参数：
    s：要编码的字符串。
返回值：编码后的 HTML 文本。
*/
function htmlEncode(s) {
    if (s == null) return null;
    return s.replace(/&/gi, "&amp;").replace(/\"/gi, "&quot;").replace(/</gi, "&lt;").replace(/>/gi, "&gt;").replace(/ /gi, "&nbsp;");
}


/*
功能：将已经进行过 HTML 编码的字符串转换为已解码的字符串。
参数：
    s：要解码的字符串。
返回值：解码后的 HTML 文本。
*/
function htmlDecode(s) {
    if (s == null) return null;
    return s.replace(/&quot;/gi, "\"").replace(/&lt;/gi, "<").replace(/&gt;/gi, ">").replace(/&nbsp;/gi, " ").replace(/&amp;/gi, "&");
}


/*
功能：将纯文本转换成具有相似格式编排的 HTML 代码文本。
参数：
    Text：一个 string 对象。可能具有格式编排的文本。
返回值：具有 HTML 格式的文本。
*/
function textToHtml(Text) {
    if (Text == null) return null;
    return Text.replace(/&/gi, "&amp;").replace(/\"/gi, "&quot;").replace(/</gi, "&lt;").replace(/>/gi, "&gt;").replace(/ /gi, "&nbsp;").replace(/\t/gi, "&nbsp;&nbsp;&nbsp;&nbsp;").replace(/\n\r|\r\n|\r|\n/gi, "<br />");
}


/*
功能：将 HTML 代码片段转换成具有相似格式编排的纯文本形式。
参数：
Html：一段 HTML 片段。
返回值：具有 HTML 格式的文本对象。
*/
function htmlToText(Html) {
    if (Html == null) return null;

    var reSpace = /(\s*)\n(\s*)/gi; //去掉空白字符。
    var reHTML = /<HTML([^>]*)>|<\/HTML>/gi;
    var reContain = /<HEAD(?:[^>]*)>(?:.*?)<\/HEAD>|<STYLE(?:[^>]*)>(?:.*?)<\/STYLE>|<SCRIPT(?:[^>]*)>(?:.*?)<\/SCRIPT>/gi;
    var reComment = /<!--(.*?)-->/gi;
    var reTD = /<TD(?:[^>]*)>(.*?)<\/TD>/gi;
    var reBlock = /<DIV(?:[^>]*)>(.*?)<\/DIV>/gi;
    var reBlock2 = /<TR(?:[^>]*)>(.*?)<\/TR>/gi;
    var reParagraph = /<P(?:[^>]*)>(.*?)<\/P>/gi;
    var reBR = /<br(\s*)>|<br(\s*)\/>/gi;
    var reLable = /<([^>]*)>/gi;
    var reNBSP4 = /&nbsp;&nbsp;&nbsp;&nbsp;/gi;
    var reNBSP = /&nbsp;/gi;
    var reQUOT = /&quot;/gi;
    var reLT = /&lt;/gi;
    var reGT = /&gt;/gi;
    var reAMP = /&amp;/gi;

    Html = Html.replace(reSpace, "");
    Html = Html.replace(reHTML, "");
    Html = Html.replace(reContain, "");
    Html = Html.replace(reComment, "");
    Html = Html.replace(reTD, "$1\t");
    Html = Html.replace(reBlock, "\r\n$1");
    Html = Html.replace(reBlock2, "\r\n$1");
    Html = Html.replace(reParagraph, "\r\n$1\r\n");
    Html = Html.replace(reBR, "\r\n");
    Html = Html.replace(reLable, "");
    Html = Html.replace(reNBSP4, "\t");
    Html = Html.replace(reNBSP, " ");
    Html = Html.replace(reQUOT, "\"");
    Html = Html.replace(reLT, "<");
    Html = Html.replace(reGT, ">");
    Html = Html.replace(reAMP, "&");

    return Html;
}


