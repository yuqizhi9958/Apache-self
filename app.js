//开启http服务
let http = require('http');
//生成路径
let path = require('path');
//引入文件系统
let fs = require('fs');

//引入类型识别第三方插件
let mime = require('mime');
//配置网站根目录
let rootPath = path.join(__dirname, 'www');
console.log(__dirname);
//开启服务
http.createServer((Request, Response) => {
    console.log('请求来了');
    // 根据请求的url 生成静态资源服务器中的绝对路径
    let filePath = path.join(rootPath, Request.url);
    console.log(filePath);
    //判断访问的这个目录（文件）是否存在
    let isExist = fs.existsSync(filePath);
    //如果存在
    if (isExist) {
        // 只有存在才需要继续走
        // 生成文件列表
        fs.readdir(filePath, (err, files) => {
            // 如果是文件
            if (err) {
                // console.log('不是文件夹');
                // 能够进到这里 说明是文件
                // 读取文件 返回读取的文件
                console.log(err);
                fs.readFile(filePath, (err, data) => {
                    // 直接返回
                    console.log(mime.getType(filePath));
                    Response.writeHead(200, {
                        'content-type': mime.getType(filePath)
                    });
                    Response.end(data);
                })
            } else {
                //如果是文件夹
                //判断是否存在首页
                if (files.indexOf('index.html') != -1) {
                    console.log('有首页');
                    //如果有首页  读取首页即可
                    fs.readFile(path.join(filePath, 'index.html'), (err, data) => {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log(mime.getType('index.html'));
                            Response.writeHead(200, {
                                'content-type': mime.getType('index.html')
                            });
                            Response.end(data);
                        }
                    });
                } else {

                    //没有首页
                    console.log(files);
                    let backdata = '';
                    for (let i = 0; i < files.length; i++) {
                        //使用三元表达式，判断是不是一级目录
                        backdata += `<h2><a href="${Request.url=='/'?"":Request.url}/${files[i]}">${files[i]}</a></h2>`
                    };
                    Response.writeHead(200, {
                        'content-type': 'text/html;charset=utf-8'
                    });

                    Response.end(backdata);
                }
            }
        })
    } else {
        //不存在  返回404
        Response.writeHead(404, {
            "content-type": "text/html;charset=utf-8"
        });
        Response.end(`
                    <!DOCTYPE HTML PUBLIC "-//IETF//DTD HTML 2.0//EN">
                    <html><head>
                    <title>404 Not Found</title>
                    </head><body>
                    <h1>Not Found</h1>
                    <p>The requested URL /index.hththt was not found on this server.</p>
                    </body></html>
            `);
    }

}).listen(80, '127.0.0.1', () => {
    console.log('开始监听');
})