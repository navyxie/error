# 前端报错监控

## *注意，引用此js必须在其他js之前，否则监控不到出错信息*

## API
### config
```js
    $error.config({
        whiteList : [],//域名白名单，即在此域名内才收集报错信息
        blackList : [],//域名黑名单，即在此域名内不收集报错信息
        stackdepth : 3,//收集报错信息的堆栈深度
        beanIcon:''//上报的地址，get请求
    })
```
### monitor
```js
    $error.monitor();//开启监控
```
 -------
**注意**
对于跨域的JS资源window的onerror拿不到详细的信息，需要往资源的请求的响应头添加额外的头部。
#### eg:
```js
    //设置Respone Header:头部
    "Respone Header":"Access-Control-Allow-Origin:http://www.xxx.com"
    //同时script引入外链的标签需要加多一个crossorigin的属性,这样才能获取到准确的出错信息。
    <script src="xxx.js" crossorigin></script>
```
