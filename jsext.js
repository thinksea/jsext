/*
对 JavaScript 原生功能进行最小扩展。
version：1.0.3
last change：2017-6-30
Author：http://www.thinksea.com/
projects url:https://github.com/thinksea/jsext
*/

if (typeof (Number.prototype.format) != "function") {
    /**
     * 格式化数字显示方式。
     * @param {string} pattern 格式化字符串。取值范围如下
     *     "0"零占位符。用对应的数字（如果存在）替换零；否则，将在结果字符串中显示零。
     *     "#"数字占位符。用对应的数字（如果存在）替换“#”符号；否则，不会在结果字符串中显示任何数字。
     *     "."小数点。确定小数点分隔符在结果字符串中的位置。
     *     ","组分隔符。它在各个组之间插入组分隔符字符。
     * @returns {string} 替换后的字符串。
     * @example
     *     console.log("(123456789012.129).format()-->" + (123456789012.129).format());  //123456789012.129
     *     console.log("(123456789012.129).format('')-->" + (123456789012.129).format()); //123456789012.129
     *     console.log("(123456789012.129).format('#,##0.00')-->" + (123456789012.129).format('#,##0.00')); //123,456,789,012.13
     *     console.log("(123456789012.129).format('#,##0.##')-->" + (123456789012.129).format('#,##0.##')); //123,456,789,012.13
     *     console.log("(123456789012.129).format('#,##0.00')-->" + (123456789012.129).format('#,##0.00')); //123,456,789,012.13
     *     console.log("(123456789012.129).format('#,##0.##')-->" + (123456789012.129).format('#,##0.##')); //123,456,789,012.13
     *     console.log("(12.129).format('0.00')-->" + (12.129).format('0.00')); //12.13
     *     console.log("(12.129).format('0.##')-->" + (12.129).format('0.##')); //12.13
     *     console.log("(12).format('00000')-->" + (12).format('00000')); //00012
     *     console.log("(12).format('#.##')-->" + (12).format('#.##')); //12
     *     console.log("(12).format('#.00')-->" + (12).format('#.00')); //12.00
     *     console.log("(0).format('#.##')-->" + (0).format('#.##')); //0
     *     console.log("(123456).format('.###')-->" + (123456).format('.###')); //123456
     *     console.log("(0).format('###.#####')-->" + (0).format('###.#####')); //0
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
    /**
     * 格式化 Date 显示方式。
     * @param {string} format 格式化字符串。取值范围参考“自定义日期和时间格式字符串”
     * @param {string} local 语言设置。取值范围：目前只支持“en”与“zh_cn”。
     * @returns {string} 替换后的字符串。
     *     自定义日期和时间格式字符串：
     *     “d”一个月中的某一天（1 到 31）。
     *     “dd”一个月中的某一天（01 到 31）。
     *     “ddd”一周中某天的缩写名称。
     *     “dddd”一周中某天的完整名称。
     *     “f”日期和时间值的十分之几秒。
     *     6/15/2009 13:45:30.617 -> 6
     *     6/15/2009 13:45:30.050 -> 0
     *     “ff”日期和时间值的百分之几秒。
     *     6/15/2009 13:45:30.617 -> 61
     *     6/15/2009 13:45:30.005 -> 00
     *     “fff”日期和时间值的毫秒。
     *     6/15/2009 13:45:30.617 -> 617
     *     6/15/2009 13:45:30.0005 -> 000
     *     “F”如果非零，则为日期和时间值的十分之几秒。
     *     6/15/2009 13:45:30.617 -> 6
     *     6/15/2009 13:45:30.050 ->（无输出）
     *     “FF”如果非零，则为日期和时间值的百分之几秒。
     *     6/15/2009 13:45:30.617 -> 61
     *     6/15/2009 13:45:30.005 ->（无输出）
     *     “FFF”如果非零，则为日期和时间值的毫秒。
     *     6/15/2009 13:45:30.617 -> 617
     *     6/15/2009 13:45:30.0005 ->（无输出）
     *     “h”采用 12 小时制的小时（从 1 到 12）。
     *     “hh”采用 12 小时制的小时（从 01 到 12）。
     *     “H”采用 24 小时制的小时（从 0 到 23）。
     *     “HH”采用 24 小时制的小时（从 00 到 23）。
     *     “m”分钟（0 到 59）。
     *     “mm”分钟（00 到 59）。
     *     “M”月份（1 到 12）。
     *     “MM”月份（01 到 12）。
     *     “MMM”月份的缩写名称。
     *     “MMMM”月份的完整名称。
     *     “s”秒（0 到 59）。
     *     “ss”秒（00 到 59）。
     *     “t”AM/PM 指示符的第一个字符。
     *     6/15/2009 1:45:30 PM -> P
     *     6/15/2009 1:45:30 PM -> 午
     *     “tt”AM/PM 指示符。
     *     6/15/2009 1:45:30 PM -> PM
     *     6/15/2009 1:45:30 PM -> 午後
     *     “y”年份（0 到 99）。
     *     “yy”年份（00 到 99）。
     *     “yyy”年份（最少三位数字）。
     *     “yyyy”由四位数字表示的年份。
     * @example
     *     var d = new Date("2015-01-30 13:15:38.617");
     *     console.log('d.format()-->' + d.format());    //Fri Jan 30 2015 13:15:38 GMT+0800 (中国标准时间)
     *     console.log('d.format("")-->' + d.format(""));    //Fri Jan 30 2015 13:15:38 GMT+0800 (中国标准时间)
     *     console.log('d.format("yyyy-MM-dd HH:mm:ss")-->' + d.format("yyyy-MM-dd HH:mm:ss"));    //2015-01-30 13:15:38
     *     console.log('d.format("yyyy年MM月dd日 HH:mm:ss")-->' + d.format("yyyy年MM月dd日 HH:mm:ss"));    //2015年01月30日 13:15:38
     *     console.log('d.format("yyyy-MM-dd HH:mm:ss.fff")-->' + d.format("yyyy-MM-dd HH:mm:ss.fff"));    //2015-01-30 13:15:38.617
     *     console.log('d.format("yyyy年 MMM dd dddd", "zh_cn")-->' + d.format("yyyy年 MMM dd dddd", "zh_cn"));    //2015年 一月 30 星期五
     *     console.log('d.format("yyyy MMM dd dddd", "en")-->' + d.format("yyyy MMM dd dddd", "en"));    //2015 Jan 30 Friday
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
}

if (!Date.prototype.formatLocal) {
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

if (typeof (Date.prototype.addMilliseconds) != "function") {
    /**
     * 增加/减少毫秒。
     * @param {number} value 一个整数，正数表示增加，负数表示减少。
     * @returns {Date} 调整后的新 Date 实例。
     */
    Date.prototype.addMilliseconds = function (value) {
        var date = this;
        date.setMilliseconds(date.getMilliseconds() + value);
        return date;
    }
}

if (typeof (Date.prototype.addSeconds) != "function") {
    /**
     * 增加/减少秒。
     * @param {number} value 一个整数，正数表示增加，负数表示减少。
     * @returns {Date} 调整后的新 Date 实例。
     */
    Date.prototype.addSeconds = function (value) {
        var date = this;
        date.setSeconds(date.getSeconds() + value);
        return date;
    }
}

if (typeof (Date.prototype.addMinutes) != "function") {
    /**
     * 增加/减少分钟。
     * @param {number} value 一个整数，正数表示增加，负数表示减少。
     * @returns {Date} 调整后的新 Date 实例。
     */
    Date.prototype.addMinutes = function (value) {
        var date = this;
        date.setMinutes(date.getMinutes() + value);
        return date;
    }
}

if (typeof (Date.prototype.addHours) != "function") {
    /**
     * 增加/减少小时。
     * @param {number} value 一个整数，正数表示增加，负数表示减少。
     * @returns {Date} 调整后的新 Date 实例。
     */
    Date.prototype.addHours = function (value) {
        var date = this;
        date.setHours(date.getHours() + value);
        return date;
    }
}

if (typeof (Date.prototype.addDays) != "function") {
    /**
     * 增加/减少天。
     * @param {number} value 一个整数，正数表示增加，负数表示减少。
     * @returns {Date} 调整后的新 Date 实例。
     */
    Date.prototype.addDays = function (value) {
        var date = this;
        date.setDate(date.getDate() + value);
        return date;
    }
}

if (typeof (Date.prototype.addMonths) != "function") {
    /**
     * 增加/减少月。
     * @param {number} value 一个整数，正数表示增加，负数表示减少。
     * @returns {Date} 调整后的新 Date 实例。
     */
    Date.prototype.addMonths = function (value) {
        var date = this;
        date.setMonth(date.getMonth() + value);
        return date;
    }
}

if (typeof (Date.prototype.addYears) != "function") {
    /**
     * 增加/减少年。
     * @param {number} value 一个整数，正数表示增加，负数表示减少。
     * @returns {Date} 调整后的新 Date 实例。
     */
    Date.prototype.addYears = function (value) {
        var date = this;
        date.setFullYear(date.getFullYear() + value);
        return date;
    }
}

if (typeof (Array.prototype.indexOf) != "function") {
    /**
     * 获取一个元素在 Array 中的索引值。（为 JavaScript Array 对象添加的扩展方法。）
     * @param {any} p_var 要检索的元素。
     * @returns {number} 元素的索引值。找不到返回 -1。
     * @example
     *     var a = new Array();
     *     a.push("abc");
     *     a.push("def");
     *     alert(a.indexOf("abc"));
     *     alert(a.indexOf("def"));
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
    /**
     * 从 Array 中删除一个元素。（为 JavaScript Array 对象添加的扩展方法。）
     * @param {any} o 要删除的元素。
     * @returns {boolean} 找到并且成功删除返回 true。否则返回 false。
     * @example
     *     var a = new Array();
     *     a.push("abc");
     *     a.push("def");
     *     alert(a[0]);
     *     a.remove("abc");
     *     alert(a[0]);
     */
    Array.prototype.remove = function (o) {
        var i = this.indexOf(o);
        if (i > -1) this.splice(i, 1);
        return (i > -1);
    }
}

/**
* 通过替换为转义码来转义最小的元字符集（\、*、+、?、|、{、[、(、)、^、$、.、# 和空白）。（为 JavaScript RegExp 对象添加的扩展方法。）
     * @param {string} str 一个可能包含正则表达式元字符的字符串。
     * @returns {string} 替换后的字符串。
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
    /**
     * 判断字符串是否以指定的文本为前缀。（为 JavaScript String 对象添加的扩展方法。）
     * @param {string} searchString 要搜索的子字符串。
     * @param {number} position 在 str 中搜索 searchString 的开始位置，默认值为 0，也就是真正的字符串开头处。
     * @returns {boolean} 如果匹配成功返回 true；否则返回 false。
     * @example
     * var str = "To be, or not to be, that is the question.";
     * alert(str.startsWith("To be"));         // true
     * alert(str.startsWith("not to be"));     // false
     * alert(str.startsWith("not to be", 10)); // true
     */
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
    }
}

if (typeof (String.prototype.endsWith) != "function") {
    /**
     * 判断字符串是否以指定的文本为后缀。（为 JavaScript String 对象添加的扩展方法。）
     * @param {string} searchString 要搜索的子字符串。
     * @param {number} position 在 str 中搜索 searchString 的结束位置，默认值为 str.length，也就是真正的字符串结尾处。
     * @returns {boolean} 如果匹配成功返回 true；否则返回 false。
     * @example
     * var str = "To be, or not to be, that is the question.";
     * alert( str.endsWith("question.") );  // true
     * alert( str.endsWith("to be") );      // false
     * alert( str.endsWith("to be", 19) );  // true
     * alert( str.endsWith("To be", 5) );   // true
     */
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
    }
}

    /**
     * 从当前 String 对象移除数组中指定的一组字符的所有前导匹配项和尾部匹配项。（为 JavaScript String 对象添加的扩展方法。）
     * @param {Array|null} trimChars 要删除的字符的数组，或 null。如果 trimChars 为 null 或空数组，则改为删除空白字符。
     * @returns {string} 从当前字符串的开头和结尾删除所出现的所有 trimChars 参数中的字符后剩余的字符串。 如果 trimChars 为 null 或空数组，则改为移除空白字符。
     * @example
     *     alert("aaabccdeaabaaa".trim('a')) //输出“bccdeaab”
     *     alert("aaabccdeaabaaa".trim(['a', 'b'])) //输出“ccde”
     *     alert("aaabccdeaabaaa".trim('a', 'b')) //输出“ccde”
     */
    String.prototype.trim = function (trimChars) {
        if (trimChars == null || (trimChars instanceof Array && trimChars.length == 0)) { //如果参数“trimChars"是 null或一个空数组则改为删除空白字符。
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
    }


if (typeof (String.prototype.trimStart) != "function") {
    /**
     * 从当前 String 对象移除数组中指定的一组字符的所有前导匹配项。（为 JavaScript String 对象添加的扩展方法。）
     * @param {Array|null} trimChars：要删除的字符的数组，或 null。如果 trimChars 为 null 或空数组，则改为删除空白字符。
     * @returns {string} 从当前字符串的开头移除所出现的所有 trimChars 参数中的字符后剩余的字符串。 如果 trimChars 为 null 或空数组，则改为移除空白字符。
     * @example
     *     alert("aaabccdeaabaaa".trimStart('a')) //输出“bccdeaabaaa”
     *     alert("aaabccdeaabaaa".trimStart(['a', 'b'])) //输出“ccdeaabaaa”
     *     alert("aaabccdeaabaaa".trimStart('a', 'b')) //输出“ccdeaabaaa”
     */
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
    }
}

if (typeof (String.prototype.trimEnd) != "function") {
    /**
     * 从当前 String 对象移除数组中指定的一组字符的所有尾部匹配项。（为 JavaScript String 对象添加的扩展方法。）
     * @param {Array|null} trimChars：要删除的字符的数组，或 null。如果 trimChars 为 null 或空数组，则改为删除空白字符。
     * @returns {string} 从当前字符串的结尾移除所出现的所有 trimChars 参数中的字符后剩余的字符串。 如果 trimChars 为 null 或空数组，则改为删除空白字符。
     * @example
     *     alert("aaabccdeaabaaa".trimEnd('a')) //输出“aaabccdeaab”
     *     alert("aaabccdeaabaaa".trimEnd(['a', 'b'])) //输出“aaabccde”
     *     alert("aaabccdeaabaaa".trimEnd('a', 'b')) //输出“aaabccde”
     */
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
    }
}

if (typeof (String.prototype.getFileName) != "function") {
    /**
     * 获取文件全名。（为 JavaScript String 对象添加的扩展方法。）
     * @returns {string} 文件名。
     * @example
     *     console.log("c:\\a\\b\\d.e.txt".getFileName()); //d.e.txt
     *     console.log("http://www.mysite.com/b/d.e.htm?id=j.pp/ext.jpg".getFileName()); //d.e.htm
     */
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
    /**
     * 获取文件扩展名。（为 JavaScript String 对象添加的扩展方法。）
     * @returns {string} 获取到的文件扩展名，如果有（以.为前缀）。
     * @example
     *     console.log("c:\\a\\b\\d.e.txt".getExtensionName()); //.txt
     *     console.log("http://www.mysite.com/b/d.e.htm?id=j.pp/ext.jpg".getExtensionName()); //.htm
     */
    String.prototype.getExtensionName = function () {
        var fileName = this.getFileName();
        var dot = fileName.lastIndexOf(".");
        if (dot == -1) {
            return "";
        }
        return fileName.substr(dot);
    }
}

if (typeof (String.prototype.getUriParameter) != "function") {
    /**
     * 从指定的 URI 中获取指定的参数的值。
     * @param {string} name 参数名。
     * @returns {string} 找不到返回 null，否则返回找到的值。
     */
    String.prototype.getUriParameter = function (name) {
        var uri = this;
        //uri = unescape(uri);
        var reg = new RegExp("(\\?|&)" + name.replace(/\$/gi, "\\$") + "=([^&]*)", "gi");
        uri = uri.match(reg);
        if (uri) {
            return decodeURIComponent((uri + "").replace(reg, "$2"));
        }
        return null;
    }
}

if (typeof (String.prototype.setUriParameter) != "function") {
    /**
     * 为指定的 URI 设置参数。
     * @param {string} name 参数名。
     * @param {string} value 新的参数值。
     * @returns {string} 处理后的 uri。
     * @description 如果参数存在则更改它的值，否则添加这个参数。
     */
    String.prototype.setUriParameter = function (name, value) {
        var uri = this;
        uri = uri.replace(/(\s|\?)*$/g, "");//消除 URI 中无参数但存在问号“...?”这种 URI 中的问号。
        if (uri.indexOf("?") == -1) {//如果无参数。
            return uri + "?" + name + "=" + encodeURIComponent(value);
        }
        else {//如果有参数。
            var reg = new RegExp("(\\?|&)" + name.replace(/\$/gi, "\\$") + "=([^&]*)", "gi");//测试可能被替换的参数的正则表达式。
            if (reg.test(uri)) {//如果存在同名参数。
                return uri.replace(reg, "$1" + name.replace(/\$/gi, "$$$$") + "=" + encodeURIComponent(value));
            }
            else {//如果无同名参数。
                return uri + "&" + name + "=" + encodeURIComponent(value);
            }
        }
    }
}


if (typeof (String.prototype.removeUriParameter) != "function") {
    /**
     * 从指定的 URI 删除参数。
     * @param {string} name 参数名。
     * @returns {string} 处理后的 uri。
     */
    String.prototype.removeUriParameter = function (name) {
        var uri = this;
        name = name.replace(/\$/gi, "\\$");
        var reg = new RegExp("(\\?|&)" + name + "=([^&]*)", "gi");//测试可能被替换的参数的正则表达式。
        if (reg.test(uri)) {
            var reg1 = new RegExp("\\?" + name + "=([^&]*)&", "gi");
            uri = uri.replace(reg1, "?");
            var reg2 = new RegExp("\\?" + name + "=([^&]*)", "gi");
            uri = uri.replace(reg2, "");
            var reg3 = new RegExp("&" + name + "=([^&]*)", "gi");
            uri = uri.replace(reg3, "");
        }
        return uri;
    }
}


if (typeof (String.prototype.clearUriParameter) != "function") {
    /**
     * 从指定的 URI 删除所有参数（从问号“?”开始到字符串结束的子串），只保留问号“?”之前的部分。
     * @returns {string} 处理后的 uri。
     */
    String.prototype.clearUriParameter = function () {
        var uri = this;
        var reg = /\?(.*)/gi
        if (reg.test(uri)) {
            return uri.replace(reg, "")
        }
        return uri;
    }
}


if (typeof (String.prototype.getUriProtocolAndDomain) != "function") {
    /**
     * 获取指定的 URI 的协议和域名部分。
     * @returns {string} 找不到返回空字符串 “”，否则返回找到的值,并且以左下划线“/”为后缀。
     * @example
     *     alert("http://www.thinksea.com/a.htm".getUriProtocolAndDomain());//返回值为 http://www.thinksea.com/。
     */
    String.prototype.getUriProtocolAndDomain = function () {
        /// <summary>
        /// 获取指定的 URI 的协议和域名部分。
        /// </summary>
        /// <param name="uri" type="String">一个 uri 字符串。</param>
        /// <returns type="String">
        /// 找不到返回空字符串 “”，否则返回找到的值,并且以左下划线“/”为后缀。
        /// </returns>
        var uri = this;
        var reg = /^[^\/\\]+:\/\/([^\/]+)/gi;
        var m = uri.match(reg);
        if (m) {
            return m[0];
        }
        return "";
    }
}

if (typeof (String.prototype.getUriPath) != "function") {
    /**
     * 获取指定的 URI 的路径（不包含文件名和参数部分），返回结果以左下划线“/”为后缀。
     * @returns {string} 找不到返回 null，否则返回找到的值。
     * @description 下列情况中(*.*)视为文件名
     *     1、xxxx://domain/(*.*)
     *     2、xxxx://domain/(*.*)?parameters
     *     注意：由于 URL 存在的允许特殊使用原因，下列特殊情况不包含在内，即以路径分隔符结束的情况：
     *     1、xxxx://domain/(*.*)/
     *     2、xxxx://domain/(*.*)/?parameters
     * @example
     *     alert("http://www.thinksea.com/a.aspx?id=1&name=2".getUriPath());//输出 http://www.thinksea.com/
     *     alert("http://www.thinksea.com/?id=1&name=2".getUriPath());//输出 http://www.thinksea.com/
     *     alert("http://www.thinksea.com?id=1&name=2".getUriPath());//输出 http://www.thinksea.com/
     *     alert("http://www.thinksea.com/".getUriPath());//输出 http://www.thinksea.com/
     *     alert("http://www.thinksea.com".getUriPath());//输出 http://www.thinksea.com/
     *     alert("http://www.thinksea.com/a.aspx/?id=1&name=2".getUriPath());//输出 http://www.thinksea.com/a.aspx/
     */
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
    }
}


if (typeof (String.prototype.combineUri) != "function") {
    /**
     * 返回当前路径与指定路径的组合。
     * @param {string} uri2 第2个 uri 字符串。
     * @returns {string} 如果任何一个路径为空字符串，则返回另一个路径的值；如果 uri2 包含绝对路径则返回 uri2；否则返回两个路径的组合。
     * @example
     *     alert("http://www.thinksea.com/a".combineUri("b/c.htm"));//返回值为 http://www.thinksea.com/a/b/c.htm
     *     alert("http://www.thinksea.com/a".combineUri("/b/c.htm"));//返回值为 http://www.thinksea.com/b/c.htm
     */
    String.prototype.combineUri = function (uri2) {
        var uri1 = this;
        if (uri1 == "") return uri2;
        if (uri2 == "") return uri1;
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
    }
}

if (typeof (String.prototype.getFullUri) != "function") {
    /**
     * 获取指定 Uri 的最短路径。通过转化其中的 ../ 等内容，使其尽可能缩短。
     * @returns {string} 处理后的 uri。
     * @example
     *     alert("http://www.thinksea.com/../../a/b/../c.htm".getFullUri());//返回值为 http://www.thinksea.com/a/c.htm
     */
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
    }
}

if (typeof (String.prototype.toColorHex) != "function") {
    /**
     * RGB格式颜色转换为16进制格式。
     * @returns {string} 一个16进制格式的颜色值，如果无法转换则原样返回。
     * @example 十六进制颜色值与RGB格式颜色值之间的相互转换
     *     var sRgb = "RGB(255, 255, 255)", sHex = "#00538b";
     *     var sHexColor = sRgb.toColorHex();//转换为十六进制方法
     *     var sRgbColor = sHex.toColorRGB();//转为RGB颜色值的方法
     */
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
        } else if (regHexColor.test(that)) {
            var aNum = that.replace(/#/, "").split("");
            if (aNum.length === 6) {
                return that;
            } else if (aNum.length === 3) {
                var numHex = "#";
                for (var i = 0; i < aNum.length; i += 1) {
                    numHex += (aNum[i] + aNum[i]);
                }
                return numHex;
            }
        } else {
            return that;
        }
    }
}


if (typeof (String.prototype.toColorRGB) != "function") {
    /**
     * 16进制格式颜色转为RGB格式。
     * @returns {string} 一个RGB格式的颜色值，如果无法转换则原样返回。
     * @example 十六进制颜色值与RGB格式颜色值之间的相互转换
     *     var sRgb = "RGB(255, 255, 255)", sHex = "#00538b";
     *     var sHexColor = sRgb.toColorHex();//转换为十六进制方法
     *     var sRgbColor = sHex.toColorRGB();//转为RGB颜色值的方法
     */
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
        } else {
            return sColor;
        }
    }
}



/**
 * 转义一个字符串，使其符合 XML 实体规则。
 * @param {string} str 一个文本片段。
 * @returns {string} 符合 XML 实体规则的文本对象。
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
 * @param {string} str 要编码的字符串。
 * @returns {string} 编码后的 HTML 文本。
 */
function htmlEncode(str) {
    if (str == null) return null;
    return str.replace(/&/gi, "&amp;").replace(/\"/gi, "&quot;").replace(/</gi, "&lt;").replace(/>/gi, "&gt;").replace(/ /gi, "&nbsp;");
}

//function htmlEncode(html) {
//    var temp = document.createElement("div");
//    (temp.textContent != null) ? (temp.textContent = html) : (temp.innerText = html);
//    var output = temp.innerHTML;
//    temp = null;
//    return output;
//}

/**
 * 将已经进行过 HTML 编码的字符串转换为已解码的字符串。
 * @param {string} str 要解码的字符串。
 * @returns {string} 解码后的 HTML 文本。
 */
function htmlDecode(str) {
    if (str == null) return null;
    return str.replace(/&quot;/gi, "\"").replace(/&lt;/gi, "<").replace(/&gt;/gi, ">").replace(/&nbsp;/gi, " ").replace(/&amp;/gi, "&");
}
