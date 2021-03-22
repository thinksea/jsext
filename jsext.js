/*
对 JavaScript 原生功能进行最小扩展。
version：1.3.0
last change：2021-3-23
Author：http://www.thinksea.com/
projects url:https://github.com/thinksea/jsext
*/
if (typeof (Number.prototype.format) != "function") {
    Number.prototype.format = function (pattern) {
        if (!pattern)
            return this.toString();
        var num = this;
        //if (num === undefined) return undefined;
        //if (num == null) return null;
        //if (num == "") return "";
        if (num != undefined && num != null && pattern) { //对小数点后数字做四舍五入。
            var lio = pattern.lastIndexOf(".");
            if (lio != -1) {
                var How = pattern.length - lio - 1;
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
                    if (i >= 0)
                        retstr = str.substr(i--, 1) + retstr;
                    break;
                case '0':
                    if (i >= 0)
                        retstr = str.substr(i--, 1) + retstr;
                    else
                        retstr = '0' + retstr;
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
                    if (i > 0 && ((l - i) % 3) == 0)
                        retstr = ',' + retstr;
                }
            }
            else
                retstr = str.substr(0, i + 1) + retstr;
        }
        retstr = retstr + '.';
        // 处理小数部分  
        str = strarr.length > 1 ? strarr[1] : '';
        fmt = fmtarr.length > 1 ? fmtarr[1] : '';
        i = 0;
        for (var f = 0; f < fmt.length; f++) {
            switch (fmt.substr(f, 1)) {
                case '#':
                    if (i < str.length)
                        retstr += str.substr(i++, 1);
                    break;
                case '0':
                    if (i < str.length)
                        retstr += str.substr(i++, 1);
                    else
                        retstr += '0';
                    break;
            }
        }
        return retstr.replace(/^,+/, '').replace(/\.$/, '');
    };
}
if (typeof (Date.prototype.format) != "function") {
    Date.prototype.format = function (pattern, local) {
        if (!pattern)
            return this.toString();
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
    };
}
if (!Date.prototype.formatLocal) {
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
if (typeof (Date.prototype.addMilliseconds) != "function") {
    Date.prototype.addMilliseconds = function (value) {
        var date = this;
        date.setMilliseconds(date.getMilliseconds() + value);
        return date;
    };
}
if (typeof (Date.prototype.addSeconds) != "function") {
    Date.prototype.addSeconds = function (value) {
        var date = this;
        date.setSeconds(date.getSeconds() + value);
        return date;
    };
}
if (typeof (Date.prototype.addMinutes) != "function") {
    Date.prototype.addMinutes = function (value) {
        var date = this;
        date.setMinutes(date.getMinutes() + value);
        return date;
    };
}
if (typeof (Date.prototype.addHours) != "function") {
    Date.prototype.addHours = function (value) {
        var date = this;
        date.setHours(date.getHours() + value);
        return date;
    };
}
if (typeof (Date.prototype.addDays) != "function") {
    Date.prototype.addDays = function (value) {
        var date = this;
        date.setDate(date.getDate() + value);
        return date;
    };
}
if (typeof (Date.prototype.addMonths) != "function") {
    Date.prototype.addMonths = function (value) {
        var date = this;
        date.setMonth(date.getMonth() + value);
        return date;
    };
}
if (typeof (Date.prototype.addYears) != "function") {
    Date.prototype.addYears = function (value) {
        var date = this;
        date.setFullYear(date.getFullYear() + value);
        return date;
    };
}
if (typeof (Array.prototype.indexOf) != "function") {
    Array.prototype.indexOf = function (p_var) {
        for (var i = 0; i < this.length; i++) {
            if (this[i] == p_var) {
                return (i);
            }
        }
        return (-1);
    };
}
if (typeof (Array.prototype.remove) != "function") {
    Array.prototype.remove = function (o) {
        var i = this.indexOf(o);
        if (i > -1)
            this.splice(i, 1);
        return (i > -1);
    };
}
/**
* 通过替换为转义码来转义最小的元字符集（\、*、+、?、|、{、[、(、)、^、$、.、# 和空白）。（为 JavaScript RegExp 对象添加的扩展方法。）
     * @param str 一个可能包含正则表达式元字符的字符串。
     * @returns 替换后的字符串。
     * @example
     *     var s="abc$def";
     *     alert(regExpEscape(s));//输出 abc\$def。
     */
function regExpEscape(str) {
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
if (typeof (String.prototype.startsWith) != "function") {
    String.prototype.startsWith = function (searchString, position) {
        if (this.length >= searchString.length) {
            if (position === undefined) {
                return this.substr(0, searchString.length) == searchString;
            }
            else {
                return this.substr(position, searchString.length) == searchString;
            }
        }
        return false;
    };
}
if (typeof (String.prototype.endsWith) != "function") {
    String.prototype.endsWith = function (searchString, position) {
        if (this.length >= searchString.length) {
            if (position === undefined) {
                return this.substr(this.length - searchString.length) == searchString;
            }
            else {
                return this.substr(position - searchString.length, searchString.length) == searchString;
            }
        }
        return false;
    };
}
//if (typeof (String.prototype.trim) != "function") {
String.prototype.trim = function (trimChars) {
    if (typeof (trimChars) == "undefined" || trimChars == null || (trimChars instanceof Array && trimChars.length == 0)) { //如果参数“trimChars"是 null或一个空数组则改为删除空白字符。
        return this.replace(/^\s*/, '').replace(/\s*$/, '');
    }
    else {
        var sReg = "";
        if (trimChars instanceof Array && trimChars.length > 0) { //处理单个数组参数指定排除字符的情况。
            for (var i = 0; i < trimChars.length; i++) {
                if (sReg.length > 0) {
                    sReg += "|";
                }
                sReg += regExpEscape(trimChars[i]);
            }
        }
        else { //处理单个字符参数指定排除字符的情况。
            sReg = regExpEscape(trimChars);
            if (arguments.length > 1) {
                for (var i = 1; i < arguments.length; i++) {
                    if (sReg.length > 0) {
                        sReg += "|";
                    }
                    sReg += regExpEscape(arguments[i]);
                }
            }
        }
        var rg = new RegExp("^(" + sReg + ")*");
        var str = this.replace(rg, '');
        rg = new RegExp("(" + sReg + ")*$");
        return str.replace(rg, '');
    }
};
//}
//if (typeof (String.prototype.trimStart) != "function") {
String.prototype.trimStart = function (trimChars) {
    if (trimChars == null || (trimChars instanceof Array && trimChars.length == 0)) { //如果参数“trimChars"是 null或一个空数组则改为删除空白字符。
        return this.replace(/^\s*/, '');
    }
    else {
        var sReg = "";
        if (trimChars instanceof Array && trimChars.length > 0) { //处理单个数组参数指定排除字符的情况。
            for (var i = 0; i < trimChars.length; i++) {
                if (sReg.length > 0) {
                    sReg += "|";
                }
                sReg += regExpEscape(trimChars[i]);
            }
        }
        else { //处理单个字符参数指定排除字符的情况。
            sReg = regExpEscape(trimChars);
            if (arguments.length > 1) {
                for (var i = 1; i < arguments.length; i++) {
                    if (sReg.length > 0) {
                        sReg += "|";
                    }
                    sReg += regExpEscape(arguments[i]);
                }
            }
        }
        var rg = new RegExp("^(" + sReg + ")*");
        return this.replace(rg, '');
    }
};
//}
//if (typeof (String.prototype.trimEnd) != "function") {
String.prototype.trimEnd = function (trimChars) {
    if (trimChars == null || (trimChars instanceof Array && trimChars.length == 0)) { //如果参数“trimChars"是 null或一个空数组则改为删除空白字符。
        return this.replace(/\s*$/, '');
    }
    else {
        var sReg = "";
        if (trimChars instanceof Array && trimChars.length > 0) { //处理单个数组参数指定排除字符的情况。
            for (var i = 0; i < trimChars.length; i++) {
                if (sReg.length > 0) {
                    sReg += "|";
                }
                sReg += regExpEscape(trimChars[i]);
            }
        }
        else { //处理单个字符参数指定排除字符的情况。
            sReg = regExpEscape(trimChars);
            if (arguments.length > 1) {
                for (var i = 1; i < arguments.length; i++) {
                    if (sReg.length > 0) {
                        sReg += "|";
                    }
                    sReg += regExpEscape(arguments[i]);
                }
            }
        }
        var rg = new RegExp("(" + sReg + ")*$");
        return this.replace(rg, '');
    }
};
//}
if (typeof (String.prototype.getFileName) != "function") {
    String.prototype.getFileName = function () {
        var right = this.lastIndexOf("?");
        if (right == -1) {
            right = this.length;
        }
        var left = this.lastIndexOf("\\", right - 1);
        if (left == -1) {
            left = this.lastIndexOf("/", right - 1);
        }
        if (left == -1) {
            left = 0;
        }
        else {
            left++;
        }
        return this.substring(left, right);
    };
}
if (typeof (String.prototype.getExtensionName) != "function") {
    String.prototype.getExtensionName = function () {
        var fileName = this.getFileName();
        var dot = fileName.lastIndexOf(".");
        if (dot == -1) {
            return "";
        }
        return fileName.substr(dot);
    };
}
//#region  URI 参数处理。
/**
 * 封装了 URI 扩展处理功能。（***此对象仅供内部代码使用，请勿引用。）
 */
var UriExtTool = /** @class */ (function () {
    function UriExtTool() {
        /**
         * URI 基本路径信息。
         */
        this.path = null;
        /**
         * URI 的参数。
         */
        this.query = null;
        /**
         * URI 的页面内部定位标记
         */
        this.mark = null;
    }
    /**
     * 用指定的 URI 创建此实例。
     * @param uri 一个可能包含参数的 uri 字符串。
     * @returns URI 解析实例。
     */
    UriExtTool.Create = function (uri) {
        var result = new UriExtTool();
        var queryIndex = uri.indexOf('?');
        var sharpIndex = -1;
        if (queryIndex > -1) {
            sharpIndex = uri.indexOf('#', queryIndex + 1);
        }
        else {
            sharpIndex = uri.indexOf('#');
        }
        if (queryIndex > -1) {
            result.path = uri.substring(0, queryIndex);
        }
        else if (sharpIndex > -1) {
            result.path = uri.substring(0, sharpIndex);
        }
        else {
            result.path = uri;
        }
        if (sharpIndex > -1) {
            result.mark = uri.substring(sharpIndex);
        }
        if (queryIndex > -1) {
            var queryString = void 0;
            if (sharpIndex > -1) {
                queryString = uri.substring(queryIndex + 1, sharpIndex);
            }
            else {
                queryString = uri.substring(queryIndex + 1);
            }
            if (queryString.length > 0) {
                result.query = new Array();
                var queryList = queryString.split(/&|\?/);
                for (var i = 0; i < queryList.length; i++) {
                    var item = queryList[i];
                    var enqIndex = item.indexOf('=');
                    if (enqIndex > -1) {
                        result.query.push(new UriExtTool.QueryItem(item.substring(0, enqIndex), item.substring(enqIndex + 1)));
                    }
                    else {
                        result.query.push(new UriExtTool.QueryItem(item, null));
                    }
                }
            }
        }
        return result;
    };
    /**
     * 返回此实例的字符串表示形式。
     * @returns 返回一个 URI，此实例到字符串表示形式。
     */
    UriExtTool.prototype.toString = function () {
        var sb = "";
        if (this.path != null) {
            sb += this.path;
        }
        if (this.query != null && this.query.length > 0) {
            sb += '?';
            for (var i = 0; i < this.query.length; i++) {
                var item = this.query[i];
                if (i > 0) {
                    sb += '&';
                }
                sb += item.toString();
            }
        }
        if (this.mark != null) {
            sb += this.mark;
        }
        return sb;
    };
    /**
     * 从指定的 URI 中获取指定的参数的值。
     * @param name 参数名。
     * @returns 指定参数的值，如果找不到这个参数则返回 null。
     */
    UriExtTool.prototype.getUriParameter = function (name) {
        if (this.query != null) {
            for (var i = 0; i < this.query.length; i++) {
                var item = this.query[i];
                if (item.key.toLowerCase() == name.toLowerCase()) {
                    if (item.value == null) {
                        return null;
                    }
                    else {
                        return decodeURIComponent(item.value);
                    }
                }
            }
        }
        //如果没有找到匹配项。
        return null;
    };
    /**
     * 为指定的 URI 设置参数。
     * @param name 参数名。
     * @param value 新的参数值。
     */
    UriExtTool.prototype.setUriParameter = function (name, value) {
        if (this.query != null) {
            for (var i = 0; i < this.query.length; i++) {
                var item = this.query[i];
                if (item.key.toLowerCase() == name.toLowerCase()) {
                    this.query[i] = new UriExtTool.QueryItem(name, (value == null ? null : encodeURIComponent(value)));
                    return;
                }
            }
        }
        if (this.query == null) {
            this.query = new Array();
        }
        this.query.push(new UriExtTool.QueryItem(name, (value == null ? null : encodeURIComponent(value))));
    };
    /**
     * 从指定的 URI 删除参数。
     * @param name 参数名。
     */
    UriExtTool.prototype.removeUriParameter = function (name) {
        if (this.query != null) {
            for (var i = 0; i < this.query.length; i++) {
                var item = this.query[i];
                if (item.key.toLowerCase() == name.toLowerCase()) {
                    this.query.remove(item);
                }
            }
        }
    };
    /**
     * 从指定的 URI 删除所有参数，只保留问号“?”之前的部分或者按照参数选择是否保留页面内部定位标记。
     * @param retainSharp 指示是否应保留页面内部定位标记（井号后的内容）。
     * @returns 已经去除参数的 uri 字符串。
     */
    UriExtTool.prototype.clearUriParameter = function (retainSharp) {
        this.query = null;
        if (!retainSharp) {
            this.mark = null;
        }
    };
    return UriExtTool;
}());
(function (UriExtTool) {
    /**
     * 定义 URI 的基础参数数据结构。（***此对象仅供内部代码使用，请勿引用。）
     */
    var QueryItem = /** @class */ (function () {
        /**
         * 用指定的数据初始化此实例。
         * @param key 参数名
         * @param value 参数值
         */
        function QueryItem(key, value) {
            /**
             * 参数值。
             */
            this.value = null;
            this.key = key;
            this.value = value;
        }
        /**
         * 返回此实例的字符串表示形式。
         */
        QueryItem.prototype.toString = function () {
            if (this.value == null) {
                return this.key;
            }
            else {
                return this.key + "=" + this.value;
            }
        };
        return QueryItem;
    }());
    UriExtTool.QueryItem = QueryItem;
})(UriExtTool || (UriExtTool = {}));
//#endregion
if (typeof (String.prototype.getUriParameter) != "function") {
    String.prototype.getUriParameter = function (name) {
        var r = UriExtTool.Create(this);
        return r.getUriParameter(name);
    };
}
if (typeof (String.prototype.setUriParameter) != "function") {
    String.prototype.setUriParameter = function (name, value) {
        var r = UriExtTool.Create(this);
        r.setUriParameter(name, value);
        return r.toString();
    };
}
if (typeof (String.prototype.removeUriParameter) != "function") {
    String.prototype.removeUriParameter = function (name) {
        var r = UriExtTool.Create(this);
        r.removeUriParameter(name);
        return r.toString();
    };
}
if (typeof (String.prototype.clearUriParameter) != "function") {
    String.prototype.clearUriParameter = function (retainSharp) {
        var r = UriExtTool.Create(this);
        r.clearUriParameter(typeof (retainSharp) == "undefined" ? false : retainSharp);
        return r.toString();
    };
}
if (typeof (String.prototype.getUriProtocolAndDomain) != "function") {
    String.prototype.getUriProtocolAndDomain = function () {
        /// <summary>
        /// 获取指定的 URI 的协议和域名部分。
        /// </summary>
        /// <param name="uri" type="String">一个 uri 字符串。</param>
        /// <returns type="String">
        /// 找不到返回空字符串 “”，否则返回找到的值。
        /// </returns>
        var uri = this;
        var reg = /^[^\/\\]+:\/\/([^\/]+)/gi;
        var m = uri.match(reg);
        if (m) {
            return m[0];
        }
        return "";
    };
}
if (typeof (String.prototype.getUriPath) != "function") {
    String.prototype.getUriPath = function () {
        var uri = this;
        if (uri == undefined || uri == null || uri == "") {
            return null;
        }
        var path = uri.clearUriParameter();
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
    };
}
if (typeof (String.prototype.combineUri) != "function") {
    String.prototype.combineUri = function (uri2) {
        var uri1 = this;
        if (uri1 == "")
            return uri2;
        if (uri2 == "")
            return uri1;
        if (uri2.indexOf("://") >= 0) {
            return uri2;
        }
        var regStartsWith = /^\//gi;
        var regEndsWith = /\/$/gi;
        if (regStartsWith.test(uri2)) {
            return uri1.getUriProtocolAndDomain() + uri2;
        }
        if (regEndsWith.test(uri1)) {
            return uri1 + uri2;
        }
        else {
            return uri1 + "/" + uri2;
        }
    };
}
if (typeof (String.prototype.getFullUri) != "function") {
    String.prototype.getFullUri = function () {
        var uri = this;
        var domain = uri.getUriProtocolAndDomain();
        var reg = /^\//gi;
        if (domain == "" && !reg.test(uri)) {
            return uri;
        }
        var r = uri.substring(domain.length, uri.length);
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
        return domain.combineUri(r);
    };
}
if (typeof (String.prototype.toColorHex) != "function") {
    String.prototype.toColorHex = function () {
        var that = this;
        var regHexColor = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/; //十六进制颜色值的正则表达式  
        if (/^(rgb|RGB)/.test(that) || that.split(",").length == 3) {
            var aColor = that.replace(/(?:\(|\)|rgb|RGB)*/g, "").split(",");
            if (aColor.length == 0 || (aColor.length == 1 && aColor[0].length == 0)) {
                return "";
            }
            var strHex = "#";
            for (var i = 0; i < aColor.length; i++) {
                var hex = Number(aColor[i]).toString(16);
                if (hex.length == 1) {
                    hex = "0" + hex;
                }
                strHex += hex;
            }
            if (strHex.length !== 7) {
                strHex = that;
            }
            return strHex;
        }
        else if (regHexColor.test(that)) {
            var aNum = that.replace(/#/, "").split("");
            if (aNum.length === 6) {
                return that;
            }
            else if (aNum.length === 3) {
                var numHex = "#";
                for (var i = 0; i < aNum.length; i += 1) {
                    numHex += (aNum[i] + aNum[i]);
                }
                return numHex;
            }
        }
        else {
            return that;
        }
    };
}
if (typeof (String.prototype.toColorRGB) != "function") {
    String.prototype.toColorRGB = function () {
        var sColor = this.toLowerCase();
        var regHexColor = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/; //十六进制颜色值的正则表达式  
        if (sColor && regHexColor.test(sColor)) {
            if (sColor.length === 4) {
                var sColorNew = "#";
                for (var i = 1; i < 4; i += 1) {
                    sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1));
                }
                sColor = sColorNew;
            }
            //处理六位的颜色值  
            var sColorChange = [];
            for (var i = 1; i < 7; i += 2) {
                sColorChange.push(parseInt("0x" + sColor.slice(i, i + 2)));
            }
            return "RGB(" + sColorChange.join(",") + ")";
        }
        else {
            return sColor;
        }
    };
}
/**
 * 转义一个字符串，使其符合 XML 实体规则。
 * @param str 一个文本片段。
 * @returns 符合 XML 实体规则的文本对象。
 */
function xmlEncode(str) {
    str = str.replace(/\&/g, "&amp;");
    str = str.replace(/\</g, "&lt;");
    str = str.replace(/\>/g, "&gt;");
    str = str.replace(/\'/g, "&apos;");
    str = str.replace(/\"/g, "&quot;");
    return str;
}
/**
 * 将字符串转换为 HTML 编码的字符串。
 * @param str 要编码的字符串。
 * @returns 编码后的 HTML 文本。
 */
function htmlEncode(str) {
    if (str == null)
        return null;
    return str.replace(/&/gi, "&amp;").replace(/\"/gi, "&quot;").replace(/</gi, "&lt;").replace(/>/gi, "&gt;").replace(/ /gi, "&nbsp;");
}
//function htmlEncode(html) {
//    let temp = document.createElement("div");
//    (temp.textContent != null) ? (temp.textContent = html) : (temp.innerText = html);
//    let output = temp.innerHTML;
//    temp = null;
//    return output;
//}
/**
 * 将已经进行过 HTML 编码的字符串转换为已解码的字符串。
 * @param str 要解码的字符串。
 * @returns 解码后的 HTML 文本。
 */
function htmlDecode(str) {
    if (str == null)
        return null;
    return str.replace(/&quot;/gi, "\"").replace(/&lt;/gi, "<").replace(/&gt;/gi, ">").replace(/&nbsp;/gi, " ").replace(/&amp;/gi, "&");
}
//#region 检测移动设备浏览器。
/**
 * 判断用户端访问环境是否移动电话浏览器。
 * @returns 如果是移动电话则返回 true；否则返回 false。
 * @see  http://detectmobilebrowsers.com/ 以此站点提供的解决方案为基础进行了修改。
 */
function isMobile() {
    if (isMobile._isMobile === null) {
        var a = navigator.userAgent || navigator.vendor || window.opera;
        if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) {
            if (/MI PAD/i.test(a)) { //过滤掉小米PAD
                isMobile._isMobile = false;
            }
            else {
                isMobile._isMobile = true;
            }
        }
        else {
            isMobile._isMobile = false;
        }
    }
    return isMobile._isMobile;
}
(function (isMobile) {
    isMobile._isMobile = null; //用于缓冲结果，避免冗余计算过程。
})(isMobile || (isMobile = {}));
/**
 * 判断用户端访问环境是否移动电话或平板浏览器。
 * @returns 如果是则返回 true；否则返回 false。
 * @see http://detectmobilebrowsers.com/ 以此站点提供的解决方案为基础进行了修改。
 * 注意：此方法存在一个已知的BUG，无法得知如何识别微软的 surface 平板设备。
 */
function isMobileOrPad() {
    if (isMobileOrPad._isMobileOrPad === null) {
        var a = navigator.userAgent || navigator.vendor || window.opera;
        if (/(android|bb\d+|meego)|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od|ad)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) {
            isMobileOrPad._isMobileOrPad = true;
        }
        else {
            isMobileOrPad._isMobileOrPad = false;
        }
    }
    return isMobileOrPad._isMobileOrPad;
}
(function (isMobileOrPad) {
    isMobileOrPad._isMobileOrPad = null; //用于缓冲结果，避免冗余计算过程。
})(isMobileOrPad || (isMobileOrPad = {}));
//#endregion
/**
 * 判断是否在微信浏览器内访问网页。
 * @returns 如果是则返回 true；否则返回 false。
 */
function isWeixinBrowser() {
    if (/MicroMessenger/i.test(window.navigator.userAgent)) {
        return true;
    }
    else {
        return false;
    }
}
//# sourceMappingURL=jsext.js.map