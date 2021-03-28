/*
对 JavaScript 原生功能进行最小扩展。
version：1.5.0
last change：2021-3-28
Author：http://www.thinksea.com/
projects url:https://github.com/thinksea/jsext
*/

interface Number {
    /**
     * 格式化数字显示方式。
     * @param pattern 格式化字符串。取值范围如下
     *     "0"零占位符。用对应的数字（如果存在）替换零；否则，将在结果字符串中显示零。
     *     "#"数字占位符。用对应的数字（如果存在）替换“#”符号；否则，不会在结果字符串中显示任何数字。
     *     "."小数点。确定小数点分隔符在结果字符串中的位置。
     *     ","组分隔符。它在各个组之间插入组分隔符字符。
     * @returns 替换后的字符串。
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
    format(pattern: string): string;
}

Number.prototype.format = function (pattern: string): string {
    if (!pattern) return this.toString();

    let num = this;
    //if (num === undefined) return undefined;
    //if (num == null) return null;
    //if (num == "") return "";

    if (typeof (num) !== "undefined" && num != null && pattern) { //对小数点后数字做四舍五入。
        let lio = pattern.lastIndexOf(".");
        if (lio != -1) {
            let How = pattern.length - lio - 1;
            num = Math.round(num * Math.pow(10, How)) / Math.pow(10, How);
        }
    }

    let strarr = num ? num.toString().split('.') : ['0'];
    let fmtarr = pattern ? pattern.split('.') : [''];
    let retstr = '';

    // 整数部分  
    let str = strarr[0];
    let fmt = fmtarr[0];
    let i = str.length - 1;
    let comma = false;
    for (let f = fmt.length - 1; f >= 0; f--) {
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
            let l = str.length;
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
    for (let f = 0; f < fmt.length; f++) {
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

interface Date {
    /**
     * 格式化 Date 显示方式。
     * @param format 格式化字符串。取值范围参考“自定义日期和时间格式字符串”
     * @param local 语言设置。取值范围：目前只支持“en”与“zh_cn”。
     * @returns 替换后的字符串。
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
    format(pattern: string, local?: string): string;

    //定义 Date.prototype.format 方法使用的本地化配置。
    formatLocal: {
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

    /**
     * 增加/减少毫秒。
     * @param value 一个整数，正数表示增加，负数表示减少。
     * @returns {Date} 调整后的新 Date 实例。
     */
    addMilliseconds(value: GLint): Date;
    /**
     * 增加/减少秒。
     * @param value 一个整数，正数表示增加，负数表示减少。
     * @returns {Date} 调整后的新 Date 实例。
     */
    addSeconds(value: GLint): Date;
    /**
     * 增加/减少分钟。
     * @param value 一个整数，正数表示增加，负数表示减少。
     * @returns {Date} 调整后的新 Date 实例。
     */
    addMinutes(value: GLint): Date;
    /**
     * 增加/减少小时。
     * @param value 一个整数，正数表示增加，负数表示减少。
     * @returns {Date} 调整后的新 Date 实例。
     */
    addHours(value: GLint): Date;
    /**
     * 增加/减少天。
     * @param value 一个整数，正数表示增加，负数表示减少。
     * @returns {Date} 调整后的新 Date 实例。
     */
    addDays(value: GLint): Date;
    /**
     * 增加/减少月。
     * @param value 一个整数，正数表示增加，负数表示减少。
     * @returns {Date} 调整后的新 Date 实例。
     */
    addMonths(value: GLint): Date;
    /**
     * 增加/减少年。
     * @param value 一个整数，正数表示增加，负数表示减少。
     * @returns {Date} 调整后的新 Date 实例。
     */
    addYears(value: GLint): Date;
}

Date.prototype.format = function (pattern: string, local?: string): string {
    if (!pattern) return this.toString();

    let time: any = {};
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

    if (typeof (pattern) !== "undefined" && pattern.replace(/\s/g, "").length > 0) {
        let loc = (local ? this.formatLocal[local] : this.formatLocal["en"]);
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
        let result = "";
        let finded = false;
        while (pattern.length > 0) {
            finded = false;
            for (let keyword in time.regs) {
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

Date.prototype.addMilliseconds = function (value: GLint): Date {
    let date = this;
    date.setMilliseconds(date.getMilliseconds() + value);
    return date;
}

Date.prototype.addSeconds = function (value: GLint): Date {
    let date = this;
    date.setSeconds(date.getSeconds() + value);
    return date;
}

Date.prototype.addMinutes = function (value: GLint): Date {
    let date = this;
    date.setMinutes(date.getMinutes() + value);
    return date;
}

Date.prototype.addHours = function (value: GLint): Date {
    let date = this;
    date.setHours(date.getHours() + value);
    return date;
}

Date.prototype.addDays = function (value: GLint): Date {
    let date = this;
    date.setDate(date.getDate() + value);
    return date;
}

Date.prototype.addMonths = function (value: GLint): Date {
    let date = this;
    date.setMonth(date.getMonth() + value);
    return date;
}

Date.prototype.addYears = function (value: GLint): Date {
    let date = this;
    date.setFullYear(date.getFullYear() + value);
    return date;
}

interface Array<T> {
    /**
     * 获取一个元素在 Array 中的索引值。（为 JavaScript Array 对象添加的扩展方法。）
     * @param p_var 要检索的元素。
     * @returns 元素的索引值。找不到返回 -1。
     * @example
     *     var a = new Array();
     *     a.push("abc");
     *     a.push("def");
     *     alert(a.indexOf("abc"));
     *     alert(a.indexOf("def"));
     */
    indexOf(p_var: any): GLint;
    /**
     * 从 Array 中删除一个元素。（为 JavaScript Array 对象添加的扩展方法。）
     * @param o 要删除的元素。
     * @returns 找到并且成功删除返回 true。否则返回 false。
     * @example
     *     var a = new Array();
     *     a.push("abc");
     *     a.push("def");
     *     alert(a[0]);
     *     a.remove("abc");
     *     alert(a[0]);
     */
    remove(o: any): boolean;
}

Array.prototype.indexOf = function (p_var: any): GLint {
    for (let i = 0; i < this.length; i++) {
        if (this[i] == p_var) {
            return (i);
        }
    }
    return (-1);
}

Array.prototype.remove = function (o: any): boolean {
    let i = this.indexOf(o);
    if (i > -1) this.splice(i, 1);
    return (i > -1);
}

/**
* 通过替换为转义码来转义最小的元字符集（\、*、+、?、|、{、[、(、)、^、$、.、# 和空白）。（为 JavaScript RegExp 对象添加的扩展方法。）
     * @param str 一个可能包含正则表达式元字符的字符串。
     * @returns 替换后的字符串。
     * @example
     *     var s="abc$def";
     *     alert(regExpEscape(s));//输出 abc\$def。
     */
function regExpEscape(str: string): string {
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

interface String {
    /**
     * 判断字符串是否以指定的文本为前缀。（为 JavaScript String 对象添加的扩展方法。）
     * @param searchString 要搜索的子字符串。
     * @param position 在 str 中搜索 searchString 的开始位置，默认值为 0，也就是真正的字符串开头处。
     * @returns 如果匹配成功返回 true；否则返回 false。
     * @example
     * var str = "To be, or not to be, that is the question.";
     * alert(str.startsWith("To be"));         // true
     * alert(str.startsWith("not to be"));     // false
     * alert(str.startsWith("not to be", 10)); // true
     */
    startsWith(searchString: string, position?: GLuint): boolean;
    /**
     * 判断字符串是否以指定的文本为后缀。（为 JavaScript String 对象添加的扩展方法。）
     * @param searchString 要搜索的子字符串。
     * @param position 在 str 中搜索 searchString 的结束位置，默认值为 str.length，也就是真正的字符串结尾处。
     * @returns 如果匹配成功返回 true；否则返回 false。
     * @example
     * var str = "To be, or not to be, that is the question.";
     * alert( str.endsWith("question.") );  // true
     * alert( str.endsWith("to be") );      // false
     * alert( str.endsWith("to be", 19) );  // true
     * alert( str.endsWith("To be", 5) );   // true
     */
    endsWith(searchString: string, position?: GLuint): boolean;
    /**
     * 从当前 String 对象移除数组中指定的一组字符的所有前导匹配项和尾部匹配项。（为 JavaScript String 对象添加的扩展方法。）
     * @param trimChars 要删除的字符的数组，或 null。如果 trimChars 为 null 或空数组，则改为删除空白字符。
     * @returns 从当前字符串的开头和结尾删除所出现的所有 trimChars 参数中的字符后剩余的字符串。 如果 trimChars 为 null 或空数组，则改为移除空白字符。
     * @example
     *     alert("aaabccdeaabaaa".trim('a')) //输出“bccdeaab”
     *     alert("aaabccdeaabaaa".trim(['a', 'b'])) //输出“ccde”
     *     alert("aaabccdeaabaaa".trim('a', 'b')) //输出“ccde”
     */
    trim(trimChars?: string | string[] | null): string;
    /**
     * 从当前 String 对象移除数组中指定的一组字符的所有前导匹配项。（为 JavaScript String 对象添加的扩展方法。）
     * @param trimChars：要删除的字符的数组，或 null。如果 trimChars 为 null 或空数组，则改为删除空白字符。
     * @returns 从当前字符串的开头移除所出现的所有 trimChars 参数中的字符后剩余的字符串。 如果 trimChars 为 null 或空数组，则改为移除空白字符。
     * @example
     *     alert("aaabccdeaabaaa".trimStart('a')) //输出“bccdeaabaaa”
     *     alert("aaabccdeaabaaa".trimStart(['a', 'b'])) //输出“ccdeaabaaa”
     *     alert("aaabccdeaabaaa".trimStart('a', 'b')) //输出“ccdeaabaaa”
     */
    trimStart(trimChars: string | string[] | null): string;
    /**
     * 从当前 String 对象移除数组中指定的一组字符的所有尾部匹配项。（为 JavaScript String 对象添加的扩展方法。）
     * @param trimChars：要删除的字符的数组，或 null。如果 trimChars 为 null 或空数组，则改为删除空白字符。
     * @returns 从当前字符串的结尾移除所出现的所有 trimChars 参数中的字符后剩余的字符串。 如果 trimChars 为 null 或空数组，则改为删除空白字符。
     * @example
     *     alert("aaabccdeaabaaa".trimEnd('a')) //输出“aaabccdeaab”
     *     alert("aaabccdeaabaaa".trimEnd(['a', 'b'])) //输出“aaabccde”
     *     alert("aaabccdeaabaaa".trimEnd('a', 'b')) //输出“aaabccde”
     */
    trimEnd(trimChars: string | string[] | null): string;
    /**
     * 获取文件全名。（为 JavaScript String 对象添加的扩展方法。）
     * @returns 文件名。
     * @example
     *     console.log("c:\\a\\b\\d.e.txt".getFileName()); //d.e.txt
     *     console.log("http://www.mysite.com/b/d.e.htm?id=j.pp/ext.jpg".getFileName()); //d.e.htm
     */
    getFileName(): string;
    /**
     * 获取文件扩展名。（为 JavaScript String 对象添加的扩展方法。）
     * @returns 获取到的文件扩展名，如果有（以.为前缀）。
     * @example
     *     console.log("c:\\a\\b\\d.e.txt".getExtensionName()); //.txt
     *     console.log("http://www.mysite.com/b/d.e.htm?id=j.pp/ext.jpg".getExtensionName()); //.htm
     */
    getExtensionName(): string;
    /**
     * 从指定的 URI 中获取指定的参数的值。
     * @param name 参数名。
     * @returns 指定参数的值，如果找不到这个参数则返回 null。
     */
    getUriParameter(name: string): string;
    /**
     * 为指定的 URI 设置参数。
     * @param name 参数名。
     * @param value 新的参数值。
     * @returns 已经设置了指定参数名和参数值的 uri 字符串。
     * @description 如果参数存在则更改它的值，否则添加这个参数。
     */
    setUriParameter(name: string, value: string): string;
    /**
     * 从指定的 URI 删除参数。
     * @param name 参数名。
     * @returns 已经移除了指定参数的 uri 字符串。
     */
    removeUriParameter(name: string): string;
    /**
     * 从指定的 URI 删除所有参数，只保留问号“?”之前的部分或者按照参数选择是否保留页面内部定位标记。
     * @retainSharp 指示是否应保留页面内部标记（井号后的内容）。
     * @returns 已经去除参数的 uri 字符串。
     */
    clearUriParameter(retainSharp?: boolean): string;
    /**
     * 获取指定的 URI 的协议和域名部分。
     * @returns 找不到返回空字符串 “”，否则返回找到的值。
     * @example
     *     alert("http://www.thinksea.com/a.htm".getUriProtocolAndDomain());//返回值为 http://www.thinksea.com
     *     alert("http://www.thinksea.com:8080/a.htm".getUriProtocolAndDomain());//返回值为 http://www.thinksea.com:8080
     */
    getUriProtocolAndDomain(): string;
    /**
     * 获取指定的 URI 的路径（不包含文件名和参数部分），返回结果以左下划线“/”为后缀。
     * @returns 找不到返回 null，否则返回找到的值。
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
    getUriPath(): string;
    /**
     * 返回当前路径与指定路径的组合。
     * @param uri2 第2个 uri 字符串。
     * @returns 如果任何一个路径为空字符串，则返回另一个路径的值；如果 uri2 包含绝对路径则返回 uri2；否则返回两个路径的组合。
     * @example
     *     alert("http://www.thinksea.com/a".combineUri("b/c.htm"));//返回值为 http://www.thinksea.com/a/b/c.htm
     *     alert("http://www.thinksea.com/a".combineUri("/b/c.htm"));//返回值为 http://www.thinksea.com/b/c.htm
     */
    combineUri(uri2: string): string;
    /**
     * 获取指定 Uri 的最短路径。通过转化其中的 ../ 等内容，使其尽可能缩短。
     * @returns 处理后的 uri。
     * @example
     *     alert("http://www.thinksea.com/../../a/b/../c.htm".getFullUri());//返回值为 http://www.thinksea.com/a/c.htm
     */
    getFullUri(): string;
    /**
     * RGB格式颜色转换为16进制格式。
     * @returns 一个16进制格式的颜色值，如果无法转换则原样返回。
     * @example 十六进制颜色值与RGB格式颜色值之间的相互转换
     *     var sRgb = "RGB(255, 255, 255)", sHex = "#00538b";
     *     var sHexColor = sRgb.toColorHex();//转换为十六进制方法
     *     var sRgbColor = sHex.toColorRGB();//转为RGB颜色值的方法
     */
    toColorHex(): string;
    /**
     * 16进制格式颜色转为RGB格式。
     * @returns 一个RGB格式的颜色值，如果无法转换则原样返回。
     * @example 十六进制颜色值与RGB格式颜色值之间的相互转换
     *     var sRgb = "RGB(255, 255, 255)", sHex = "#00538b";
     *     var sHexColor = sRgb.toColorHex();//转换为十六进制方法
     *     var sRgbColor = sHex.toColorRGB();//转为RGB颜色值的方法
     */
    toColorRGB(): string;
}

String.prototype.startsWith = function (searchString: string, position?: GLuint): boolean {
    if (this.length >= searchString.length) {
        if (typeof (position) === "undefined") {
            return this.substr(0, searchString.length) == searchString;
        }
        else {
            return this.substr(position, searchString.length) == searchString;
        }
    }
    return false;
}

String.prototype.endsWith = function (searchString: string, position?: GLuint): boolean {
    if (this.length >= searchString.length) {
        if (typeof (position) === "undefined") {
            return this.substr(this.length - searchString.length) == searchString;
        }
        else {
            return this.substr(position - searchString.length, searchString.length) == searchString;
        }
    }
    return false;
}

String.prototype.trim = function (trimChars?: string | string[] | null): string {
    if (typeof (trimChars) === "undefined" || trimChars == null || (trimChars instanceof Array && trimChars.length == 0)) { //如果参数“trimChars"是 null或一个空数组则改为删除空白字符。
        return this.replace(/^\s*/, '').replace(/\s*$/, '');
    }
    else {
        let sReg = "";
        if (trimChars instanceof Array && trimChars.length > 0) { //处理单个数组参数指定排除字符的情况。
            for (let i = 0; i < trimChars.length; i++) {
                if (sReg.length > 0) {
                    sReg += "|";
                }
                sReg += regExpEscape(trimChars[i]);
            }
        }
        else { //处理单个字符参数指定排除字符的情况。
            sReg = regExpEscape(trimChars as string);
            if (arguments.length > 1) {
                for (let i = 1; i < arguments.length; i++) {
                    if (sReg.length > 0) {
                        sReg += "|";
                    }
                    sReg += regExpEscape(arguments[i]);
                }
            }
        }
        let rg = new RegExp("^(" + sReg + ")*");
        let str = this.replace(rg, '');
        rg = new RegExp("(" + sReg + ")*$");
        return str.replace(rg, '');
    }
}

String.prototype.trimStart = function (trimChars: string | string[] | null): string {
    if (trimChars == null || (trimChars instanceof Array && trimChars.length == 0)) { //如果参数“trimChars"是 null或一个空数组则改为删除空白字符。
        return this.replace(/^\s*/, '');
    }
    else {
        let sReg = "";
        if (trimChars instanceof Array && trimChars.length > 0) { //处理单个数组参数指定排除字符的情况。
            for (let i = 0; i < trimChars.length; i++) {
                if (sReg.length > 0) {
                    sReg += "|";
                }
                sReg += regExpEscape(trimChars[i]);
            }
        }
        else { //处理单个字符参数指定排除字符的情况。
            sReg = regExpEscape(trimChars as string);
            if (arguments.length > 1) {
                for (let i = 1; i < arguments.length; i++) {
                    if (sReg.length > 0) {
                        sReg += "|";
                    }
                    sReg += regExpEscape(arguments[i]);
                }
            }
        }
        let rg = new RegExp("^(" + sReg + ")*");
        return this.replace(rg, '');
    }
}

String.prototype.trimEnd = function (trimChars: string | string[] | null): string {
    if (trimChars == null || (trimChars instanceof Array && trimChars.length == 0)) { //如果参数“trimChars"是 null或一个空数组则改为删除空白字符。
        return this.replace(/\s*$/, '');
    }
    else {
        let sReg = "";
        if (trimChars instanceof Array && trimChars.length > 0) { //处理单个数组参数指定排除字符的情况。
            for (let i = 0; i < trimChars.length; i++) {
                if (sReg.length > 0) {
                    sReg += "|";
                }
                sReg += regExpEscape(trimChars[i]);
            }
        }
        else { //处理单个字符参数指定排除字符的情况。
            sReg = regExpEscape(trimChars as string);
            if (arguments.length > 1) {
                for (let i = 1; i < arguments.length; i++) {
                    if (sReg.length > 0) {
                        sReg += "|";
                    }
                    sReg += regExpEscape(arguments[i]);
                }
            }
        }
        let rg = new RegExp("(" + sReg + ")*$");
        return this.replace(rg, '');
    }
}

String.prototype.getFileName = function (): string {
    let right = this.lastIndexOf("?");
    if (right == -1) {
        right = this.length;
    }
    let left = this.lastIndexOf("\\", right - 1);
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

String.prototype.getExtensionName = function (): string {
    let fileName = this.getFileName();
    let dot = fileName.lastIndexOf(".");
    if (dot == -1) {
        return "";
    }
    return fileName.substr(dot);
}

//#region  URI 参数处理。

/**
 * 封装了 URI 扩展处理功能。（***此对象仅供内部代码使用，请勿引用。）
 */
class UriExtTool {
    /**
     * URI 基本路径信息。
     */
    private path: string = null;
    /**
     * URI 的参数。
     */
    private query: Array<UriExtTool.QueryItem> = null;
    /**
     * URI 的页面内部定位标记
     */
    private mark: string = null;

    /**
     * 用指定的 URI 创建此实例。
     * @param uri 一个可能包含参数的 uri 字符串。
     * @returns URI 解析实例。
     */
    public static Create(uri: string): UriExtTool {
        let result: UriExtTool = new UriExtTool();

        let queryIndex: GLint = uri.indexOf('?');
        let sharpIndex: GLint = -1;
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
            let queryString: string;
            if (sharpIndex > -1) {
                queryString = uri.substring(queryIndex + 1, sharpIndex);
            }
            else {
                queryString = uri.substring(queryIndex + 1);
            }
            if (queryString.length > 0) {
                result.query = new Array<UriExtTool.QueryItem>();
                let queryList: string[] = queryString.split(/&|\?/);
                for (let i = 0; i < queryList.length; i++) {
                    let item = queryList[i];
                    let enqIndex: GLint = item.indexOf('=');
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
    }

    /**
     * 返回此实例的字符串表示形式。
     * @returns 返回一个 URI，此实例到字符串表示形式。
     */
    public toString(): string {
        let sb: string = "";
        if (this.path != null) {
            sb += this.path;
        }
        if (this.query != null && this.query.length > 0) {
            sb += '?';
            for (let i: GLint = 0; i < this.query.length; i++) {
                let item: UriExtTool.QueryItem = this.query[i];
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
    }

    /**
     * 从指定的 URI 中获取指定的参数的值。
     * @param name 参数名。
     * @returns 指定参数的值，如果找不到这个参数则返回 null。
     */
    public getUriParameter(name: string): string {
        if (this.query != null) {
            for (let i: GLint = 0; i < this.query.length; i++) {
                let item = this.query[i];
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
    }

    /**
     * 为指定的 URI 设置参数。
     * @param name 参数名。
     * @param value 新的参数值。
     */
    public setUriParameter(name: string, value: string): void {
        if (this.query != null) {
            for (let i: GLint = 0; i < this.query.length; i++) {
                let item = this.query[i];
                if (item.key.toLowerCase() == name.toLowerCase()) {
                    this.query[i] = new UriExtTool.QueryItem(name, (value == null ? null : encodeURIComponent(value)));
                    return;
                }
            }
        }
        if (this.query == null) {
            this.query = new Array<UriExtTool.QueryItem>();
        }
        this.query.push(new UriExtTool.QueryItem(name, (value == null ? null : encodeURIComponent(value))));
    }

    /**
     * 从指定的 URI 删除参数。
     * @param name 参数名。
     */
    public removeUriParameter(name: string): void {
        if (this.query != null) {
            for (let i: GLint = 0; i < this.query.length; i++) {
                let item = this.query[i];
                if (item.key.toLowerCase() == name.toLowerCase()) {
                    this.query.remove(item);
                }
            }
        }
    }

    /**
     * 从指定的 URI 删除所有参数，只保留问号“?”之前的部分或者按照参数选择是否保留页面内部定位标记。
     * @param retainSharp 指示是否应保留页面内部定位标记（井号后的内容）。
     * @returns 已经去除参数的 uri 字符串。
     */
    public clearUriParameter(retainSharp: boolean): void {
        this.query = null;
        if (!retainSharp) {
            this.mark = null;
        }
    }

}

namespace UriExtTool {
    /**
     * 定义 URI 的基础参数数据结构。（***此对象仅供内部代码使用，请勿引用。）
     */
    export class QueryItem {
        /**
         * 参数名。
         */
        public key: string;
        /**
         * 参数值。
         */
        public value: string = null;

        /**
         * 用指定的数据初始化此实例。
         * @param key 参数名
         * @param value 参数值
         */
        public constructor(key: string, value: string) {
            this.key = key;
            this.value = value;
        }

        /**
         * 返回此实例的字符串表示形式。
         */
        public toString(): string {
            if (this.value == null) {
                return this.key;
            }
            else {
                return this.key + "=" + this.value;
            }
        }
    }

}

//#endregion

String.prototype.getUriParameter = function (name: string): string {
    let r = UriExtTool.Create(this);
    return r.getUriParameter(name);
}

String.prototype.setUriParameter = function (name: string, value: string): string {
    let r = UriExtTool.Create(this);
    r.setUriParameter(name, value);
    return r.toString();
}


String.prototype.removeUriParameter = function (name: string): string {
    let r = UriExtTool.Create(this);
    r.removeUriParameter(name);
    return r.toString();
}


String.prototype.clearUriParameter = function (retainSharp?: boolean): string {
    let r = UriExtTool.Create(this);
    r.clearUriParameter(typeof (retainSharp) === "undefined" ? false : retainSharp);
    return r.toString();
}

String.prototype.getUriProtocolAndDomain = function (): string {
    /// <summary>
    /// 获取指定的 URI 的协议和域名部分。
    /// </summary>
    /// <param name="uri" type="String">一个 uri 字符串。</param>
    /// <returns type="String">
    /// 找不到返回空字符串 “”，否则返回找到的值。
    /// </returns>
    let uri = this;
    let reg = /^[^\/\\]+:\/\/([^\/]+)/gi;
    let m = uri.match(reg);
    if (m) {
        return m[0];
    }
    return "";
}

String.prototype.getUriPath = function (): string {
    let uri = this;
    if (typeof (uri) === "undefined" || uri == null || uri == "") {
        return null;
    }
    let path = uri.clearUriParameter();
    let filename = path.replace(/^[^\/\\]+:\/\/(([^\/]+$)|([^\/]+\/+)*)/gi, "");
    if (filename != "" && /\./gi.test(filename)) {
        path = path.substring(0, path.length - filename.length);
    }
    let regEndsWith = /\/$/gi;
    if (regEndsWith.test(path)) {
        return path;
    }
    else {
        return path + "/";
    }
}


String.prototype.combineUri = function (uri2: string): string {
    let uri1 = this;
    if (uri1 == "") return uri2;
    if (uri2 == "") return uri1;
    if (uri2.indexOf("://") >= 0) {
        return uri2;
    }
    let regStartsWith = /^\//gi;
    let regEndsWith = /\/$/gi;
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

String.prototype.getFullUri = function (): string {
    let uri = this;
    let domain = uri.getUriProtocolAndDomain();
    let reg = /^\//gi;
    if (domain == "" && !reg.test(uri)) {
        return uri;
    }
    let r = uri.substring(domain.length, uri.length);
    let reg1 = /(^\/(\.\.\/)+)/gi;
    let reg2 = /(\/[^\/.]+\/..\/)/gi;
    let last = r;
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

String.prototype.toColorHex = function (): string {
    let that = this;
    let regHexColor = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/; //十六进制颜色值的正则表达式  
    if (/^(rgb|RGB)/.test(that) || that.split(",").length == 3) {
        let aColor = that.replace(/(?:\(|\)|rgb|RGB)*/g, "").split(",");
        if (aColor.length == 0 || (aColor.length == 1 && aColor[0].length == 0)) {
            return "";
        }
        let strHex = "#";
        for (let i = 0; i < aColor.length; i++) {
            let hex = Number(aColor[i]).toString(16);
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
        let aNum = that.replace(/#/, "").split("");
        if (aNum.length === 6) {
            return that;
        } else if (aNum.length === 3) {
            let numHex = "#";
            for (let i = 0; i < aNum.length; i += 1) {
                numHex += (aNum[i] + aNum[i]);
            }
            return numHex;
        }
    } else {
        return that;
    }
}


String.prototype.toColorRGB = function (): string {
    let sColor = this.toLowerCase();
    let regHexColor = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/; //十六进制颜色值的正则表达式  
    if (sColor && regHexColor.test(sColor)) {
        if (sColor.length === 4) {
            let sColorNew = "#";
            for (let i = 1; i < 4; i += 1) {
                sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1));
            }
            sColor = sColorNew;
        }
        //处理六位的颜色值  
        let sColorChange = [];
        for (let i = 1; i < 7; i += 2) {
            sColorChange.push(parseInt("0x" + sColor.slice(i, i + 2)));
        }
        return "RGB(" + sColorChange.join(",") + ")";
    } else {
        return sColor;
    }
}



/**
 * 转义一个字符串，使其符合 XML 实体规则。
 * @param str 一个文本片段。
 * @returns 符合 XML 实体规则的文本对象。
 */
function xmlEncode(str: string): string {
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
function htmlEncode(str: string): string {
    if (str == null) return null;
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
function htmlDecode(str: string): string {
    if (str == null) return null;
    return str.replace(/&quot;/gi, "\"").replace(/&lt;/gi, "<").replace(/&gt;/gi, ">").replace(/&nbsp;/gi, " ").replace(/&amp;/gi, "&");
}

//#region 检测移动设备浏览器。
/**
 * 判断用户端访问环境是否移动电话浏览器。
 * @returns 如果是移动电话则返回 true；否则返回 false。
 * @see  http://detectmobilebrowsers.com/ 以此站点提供的解决方案为基础进行了修改。
 */
function isMobile(): boolean {
    if (isMobile._isMobile === null) {
        let a = navigator.userAgent || navigator.vendor || (window as any).opera;
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
namespace isMobile {
    export let _isMobile: boolean = null; //用于缓冲结果，避免冗余计算过程。
}

/**
 * 判断用户端访问环境是否移动电话或平板浏览器。
 * @returns 如果是则返回 true；否则返回 false。
 * @see http://detectmobilebrowsers.com/ 以此站点提供的解决方案为基础进行了修改。
 * 注意：此方法存在一个已知的BUG，无法得知如何识别微软的 surface 平板设备。
 */
function isMobileOrPad(): boolean {
    if (isMobileOrPad._isMobileOrPad === null) {
        let a = navigator.userAgent || navigator.vendor || (window as any).opera;
        if (/(android|bb\d+|meego)|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od|ad)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) {
            isMobileOrPad._isMobileOrPad = true;
        }
        else {
            isMobileOrPad._isMobileOrPad = false;
        }
    }
    return isMobileOrPad._isMobileOrPad;
}

namespace isMobileOrPad {
    export let _isMobileOrPad: boolean = null; //用于缓冲结果，避免冗余计算过程。
}

//#endregion

/**
 * 判断是否在微信浏览器内访问网页。
 * @returns 如果是则返回 true；否则返回 false。
 */
function isWeixinBrowser(): boolean {
    if (/MicroMessenger/i.test(window.navigator.userAgent)) {
        return true;
    } else {
        return false;
    }
}
