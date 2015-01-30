# jsext
对 JavaScript 原生功能进行最小扩展


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

# RegExp.prototype.escape
通过替换为转义码来转义最小的元字符集（\、*、+、?、|、{、[、(、)、^、$、.、# 和空白）。

```javascript
var s="abc$def";
alert(RegExp.prototype.escape(s));//输出 abc\$def。
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
alert("http://www.thinksea.com/a.htm".getUriProtocolAndDomain());//返回值为 http://www.thinksea.com/。
```

# String.prototype.getUriPath
获取指定的 URI 的路径（不包含文件名和参数部分），返回结果以左下划线“/”为后缀。

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
alert("http://www.thinksea.com/../../a/b/../c.htm".getFullUri());//返回值为 http://www.thinksea.com/a/c.htm
```

# String.prototype.xmlEncode
转义一个字符串，使其符合 XML 实体规则。

# String.prototype.htmlEncode
将字符串转换为 HTML 编码的字符串。

# String.prototype.htmlDecode
将已经进行过 HTML 编码的字符串转换为已解码的字符串。

