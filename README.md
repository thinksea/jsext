# jsext
对 JavaScript 原生功能进行最小扩展

=======
###### version：1.7.2

version 1.7.2 新增类对象 UriCreator 用于构建 URI。

###### version：1.7.1

version 1.7.1 弃用了过期的方法（String.prototype.substr）

###### version：1.7.0

修复了格式化数字显示方法（Number.prototype.format）的BUG，该 BUG 会导致负号后接千位分隔符（像这样 -,123,456）

###### version：1.6.0

弃用了一些 Date 对象的方法：
+ addMilliseconds
+ addSeconds
+ addMinutes
+ addHours
+ addDays
+ addMonths
+ addYears

增加了新的替代方法：（注意：执行下列方法并不会导致更改原 Date 实例中的数据）
+ addMilliseconds2
+ addSeconds2
+ addMinutes2
+ addHours2
+ addDays2
+ addMonths2
+ addYears2

###### version：1.5.0

修复 BUG

###### version：1.3.0

修复下列方法的 BUG：
+ String.prototype.trim
+ String.prototype.trimStart
+ String.prototype.trimEnd

###### version：1.2.0

修改方法“isMobileOrPad()”对设备的识别方式。

###### version：1.0.9

+ 1、isWeixinBrowser(): boolean 判断是否在微信浏览器内访问网页。

###### version：1.0.8

+ 1、isMobile(): boolean 判断用户端访问环境是否移动电话浏览器。
+ 2、isMobileOrPad(): boolean 判断用户端访问环境是否移动电话或平板浏览器。

###### version：1.0.7

修复方法 removeUriParameter，删除最后一个参数后不保留问号“?”。

###### version：1.0.6

* String.prototype.getUriParameter
* String.prototype.setUriParameter
* String.prototype.removeUriParameter
* String.prototype.clearUriParameter

上述 URL 参数处理方法支持页面内部定位标记（井号后的内容）

示例：
```javascript
alert("http://www.thinksea.com/a.htm#mark1".getUriProtocolAndDomain());//返回值为 http://www.thinksea.com
alert("http://www.thinksea.com:8080/a.htm#mark2".getUriProtocolAndDomain());//返回值为 http://www.thinksea.com:8080
```

###### version：1.0.5

修复方法“getUriProtocolAndDomain”的注释错误。请注意，方法的返回值无正斜线“/”后缀。

示例：
```javascript
alert("http://www.thinksea.com/a.htm".getUriProtocolAndDomain());//返回值为 http://www.thinksea.com
alert("http://www.thinksea.com:8080/a.htm".getUriProtocolAndDomain());//返回值为 http://www.thinksea.com:8080
```

###### version：1.0.4

修复（jsext.d.ts）中的下列方法声明：
+ 1、startsWith(searchString: string, position?: number): boolean;
+ 2、endsWith(searchString: string, position?: number): boolean;

###### version：1.0.3

+ 1、采用新的注释方式。
+ 2、增加了TypeScript声明文件（jsext.d.ts）

###### version：1.0.1

+ 1、修改下列方法，使其与浏览器标准方法声明相同。支持低版本浏览器。（注意：已经更改方法声明，请仔细核对您使用这两个方法的代码。）
  + String.prototype.startsWith
  + String.prototype.endsWith
+ 2、修改下列方法，使其兼容浏览器标准方法，并提供功能扩展。
  + String.prototype.trim


###### version：0.7.1

+ 1、进行了优化，避免与原生方法冲突。


###### version：0.6

+ 1、增加 String 类型的扩展方法 toColorHex 和 toColorRGB，实现十六进制颜色值与RGB格式颜色值之间的相互转换。


###### version：0.5

+ 1、增加 String 类型的扩展方法 trim，从当前 String 对象移除数组中指定的一组字符的所有前导匹配项和尾部匹配项。
+ 2、增加 String 类型的扩展方法 trimStart，从当前 String 对象移除数组中指定的一组字符的所有前导匹配项。
+ 3、增加 String 类型的扩展方法 trimEnd，从当前 String 对象移除数组中指定的一组字符的所有尾部匹配项。


###### version：0.4

+ 1、增加 Date 类型的扩展方法,增加（或减少）年/月/日/时/分/秒/毫秒。


# Number.prototype.format
格式化数字显示方式。 

```javascript
(123456789012.129).format()-->123456789012.129
(123456789012.129).format('')-->123456789012.129
(123456789012.129).format('#,##0.00')-->123,456,789,012.13
(123456789012.129).format('#,##0.##')-->123,456,789,012.13
(123456789012.129).format('#,##0.00')-->123,456,789,012.13
(123456789012.129).format('#,##0.##')-->123,456,789,012.13
(12.129).format('0.00')-->12.13
(12.129).format('0.##')-->12.13
(12).format('00000')-->00012
(12).format('#.##')-->12
(12).format('#.00')-->12.00
(0).format('#.##')-->0
(123456).format('.###')-->123456
(0).format('###.#####')-->0
```
# Date.prototype.format
格式化 Date 显示方式。

```javascript
var d = new Date("2015-01-30 13:15:38.617");
d.format()-->Fri Jan 30 2015 13:15:38 GMT+0800 (中国标准时间)
d.format("")-->Fri Jan 30 2015 13:15:38 GMT+0800 (中国标准时间)
d.format("yyyy-MM-dd HH:mm:ss")-->2015-01-30 13:15:38
d.format("yyyy年MM月dd日 HH:mm:ss")-->2015年01月30日 13:15:38
d.format("yyyy-MM-dd HH:mm:ss.fff")-->2015-01-30 13:15:38.617
d.format("yyyy年 MMM dd dddd", "zh_cn")-->2015年 一月 30 星期五
d.format("yyyy MMM dd dddd", "en")-->2015 Jan 30 Friday
```

# Date.prototype.addMilliseconds
增加/减少毫秒。

```javascript
var d = new Date("2015-01-30 13:15:38.617").addMilliseconds(1);
```

# Date.prototype.addSeconds
增加/减少秒。

```javascript
var d = new Date("2015-01-30 13:15:38.617").addSeconds(1);
```

# Date.prototype.addMinutes
增加/减少分钟。

```javascript
var d = new Date("2015-01-30 13:15:38.617").addMinutes(1);
```

# Date.prototype.addHours
增加/减少小时。

```javascript
var d = new Date("2015-01-30 13:15:38.617").addHours(1);
```

# Date.prototype.addDays
增加/减少天。

```javascript
var d = new Date("2015-01-30 13:15:38.617").addDays(1);
```

# Date.prototype.addMonths
增加/减少月。

```javascript
var d = new Date("2015-01-30 13:15:38.617").addMonths(1);
```

# Date.prototype.addYears
增加/减少年。

```javascript
var d = new Date("2015-01-30 13:15:38.617").addYears(1);
```

# Array.prototype.indexOf
获取一个元素在 Array 中的索引值。

此方法补充低版本 JavaScript 功能，因为在高版本中已经提供原生方法。

```javascript
var a = new Array();
a.push("abc");
a.push("def");
alert(a.indexOf("abc"));
alert(a.indexOf("def"));
```

# Array.prototype.remove
从 Array 中删除一个元素。

```javascript
var a = new Array();
a.push("abc");
a.push("def");
alert(a[0]);
a.remove("abc");
alert(a[0]);
```

# regExpEscape
通过替换为转义码来转义最小的元字符集（\、*、+、?、|、{、[、(、)、^、$、.、# 和空白）。

```javascript
var s="abc$def";
alert(regExpEscape(s));//输出 abc\$def。
```

# String.prototype.startsWith
判断字符串是否以指定的文本为前缀。

```javascript
var s="abc";
alert(s.startsWith("C",true));//返回值为 false。
```

# String.prototype.endsWith
判断字符串是否以指定的文本为后缀。

```javascript
var s="abc";
alert(s.endsWith("c"));//返回值为 true。
```

# String.prototype.trim
从当前 String 对象移除数组中指定的一组字符的所有前导匹配项和尾部匹配项。

```javascript
alert("aaabccdeaabaaa".trim('a')) //输出“bccdeaab”
alert("aaabccdeaabaaa".trim(['a', 'b'])) //输出“ccde”
alert("aaabccdeaabaaa".trim('a', 'b')) //输出“ccde”
```

# String.prototype.trimStart
从当前 String 对象移除数组中指定的一组字符的所有前导匹配项。

```javascript
alert("aaabccdeaabaaa".trimStart('a')) //输出“bccdeaabaaa”
alert("aaabccdeaabaaa".trimStart(['a', 'b'])) //输出“ccdeaabaaa”
alert("aaabccdeaabaaa".trimStart('a', 'b')) //输出“ccdeaabaaa”
```

# String.prototype.trimEnd
从当前 String 对象移除数组中指定的一组字符的所有尾部匹配项。

```javascript
alert("aaabccdeaabaaa".trimEnd('a')) //输出“aaabccdeaab”
alert("aaabccdeaabaaa".trimEnd(['a', 'b'])) //输出“aaabccde”
alert("aaabccdeaabaaa".trimEnd('a', 'b')) //输出“aaabccde”
```

# String.prototype.getFileName
获取文件全名。

```javascript
"c:\\a\\b\\d.e.txt".getFileName(); //d.e.txt
"http://www.mysite.com/b/d.e.htm?id=j.pp/ext.jpg".getFileName(); //d.e.htm
```

# String.prototype.getExtensionName
获取文件扩展名。

```javascript
"c:\\a\\b\\d.e.txt".getExtensionName(); //.txt
"http://www.mysite.com/b/d.e.htm?id=j.pp/ext.jpg".getExtensionName(); //.htm
```

# String.prototype.getUriParameter
从指定的 URI 中获取指定的参数的值。

# String.prototype.setUriParameter
为指定的 URI 设置参数。

# String.prototype.removeUriParameter
从指定的 URI 删除参数。

# String.prototype.clearUriParameter
从指定的 URI 删除所有参数（从问号“?”开始到字符串结束的子串），只保留问号“?”之前的部分。

# String.prototype.getUriProtocolAndDomain
获取指定的 URI 的协议和域名部分。

```javascript
alert("http://www.thinksea.com/a.htm".getUriProtocolAndDomain());//返回值为 http://www.thinksea.com
alert("http://www.thinksea.com:8080/a.htm".getUriProtocolAndDomain());//返回值为 http://www.thinksea.com:8080
```

# String.prototype.getUriPath
获取指定的 URI 的路径（不包含文件名和参数部分），返回结果以正斜线“/”为后缀。

```javascript
alert("http://www.thinksea.com/a.aspx?id=1&name=2".getUriPath());//输出 http://www.thinksea.com/
alert("http://www.thinksea.com/?id=1&name=2".getUriPath());//输出 http://www.thinksea.com/
alert("http://www.thinksea.com?id=1&name=2".getUriPath());//输出 http://www.thinksea.com/
alert("http://www.thinksea.com/".getUriPath());//输出 http://www.thinksea.com/
alert("http://www.thinksea.com".getUriPath());//输出 http://www.thinksea.com/
alert("http://www.thinksea.com/a.aspx/?id=1&name=2".getUriPath());//输出 http://www.thinksea.com/a.aspx/
```

# String.prototype.combineUri
返回两个路径的组合。

# String.prototype.getFullUri
获取指定 Uri 的最短路径。通过转化其中的 ../ 等内容，使其尽可能缩短。

```javascript
var sRgb = "RGB(255, 255, 255)", sHex = "#00538b";
var sHexColor = sRgb.toColorHex();//转换为十六进制方法 
var sRgbColor = sHex.toColorRGB();//转为RGB颜色值的方法
```

# String.prototype.toColorHex
RGB格式颜色转换为16进制格式。

```javascript
var sRgb = "RGB(255, 255, 255)", sHex = "#00538b";
var sHexColor = sRgb.toColorHex();//转换为十六进制方法 
var sRgbColor = sHex.toColorRGB();//转为RGB颜色值的方法
```

# String.prototype.toColorRGB
16进制格式颜色转为RGB格式。

```javascript
alert("http://www.thinksea.com/../../a/b/../c.htm".getFullUri());//返回值为 http://www.thinksea.com/a/c.htm
```

# xmlEncode
转义一个字符串，使其符合 XML 实体规则。

# htmlEncode
将字符串转换为 HTML 编码的字符串。

# htmlDecode
将已经进行过 HTML 编码的字符串转换为已解码的字符串。

