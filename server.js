var http = require('http')
var fs = require('fs')
var url = require('url')
var port = process.argv[2]

if(!port){
  console.log('请指定端口号好不啦？\nnode server.js 8888 这样不会吗？')
  process.exit(1)
}

var server = http.createServer(function(request, response){
  var parsedUrl = url.parse(request.url, true)
  var path = request.url 
  var query = ''
  if(path.indexOf('?') >= 0){
       query = path.substring(path.indexOf('?'))
  }
  var pathNoQuery = parsedUrl.pathname
  var queryObject = parsedUrl.query
  var method = request.method

  /******** 从这里开始看，上面不要看 ************/
  console.log('得到 HTTP 路径\n' + path)
  console.log('查询字符串为\n' + query)
  console.log('不含查询字符串的路径为\n' + pathNoQuery)
  if(path === '/'){
    let string = fs.readFileSync('./index.html','utf8')
    response.statusCode = 200
    response.setHeader('Content-Type','text/html;charset=utf-8')
    response.write(string)
    response.end()
  }else if(path === '/sign_up' && method === "GET"){
    let string = fs.readFileSync('./sign_up.html','utf8')
    response.statusCode = 200
    response.setHeader('Content-Type','text/html;charset=utf-8')
    response.write(string)
    response.end()
  }else if(path === '/sign_up' && method === "POST"){  
    response.setHeader('Content-Type','text/html;charset=utf-8')
    /* 获取post数据 */
    let body = []   //请求体
    // 请求时上传数据是一段一段上传的
    //监听data事件，每次获得一小段然后放到数组
    request.on('data',(chunk)=>{ 
      body.push(chunk)
    }).on('end',()=>{
      // "email=1&password=2&password_confirm=3"
      body = Buffer.concat(body).toString()
      // ['email=1','password=2','password_confirm=3']
      let array =  body.split('&')
      let hash = {}
      array.forEach((v)=>{
        // ['email','1']
        let array2 = v.split('=')
        let key = array2[0]
        let value = array2[1]
        // hash['email'] = '1'
        hash[key] = value
      })
      //hash:{ email: '1', password: '2', password_confirm: '3' }
      // let email = hash.email
      // let password = hash.password
      // let password_confirm = hash.password_confirm
      let { email , password , password_confirm } = hash
      if(email.indexOf('%40') === -1){
        response.statusCode = 400
        response.write('The format of email is error!')
      }else if(password !== password_confirm){
        response.statusCode = 400
        response.write('The password is not match!')
      }else{
        response.statusCode = 200
      }      
      response.end()
    })
  }
  else{
    response.statusCode = 404
    response.end()
  }

  /******** 代码结束，下面不要看 ************/

})

server.listen(port)
console.log('监听 ' + port + ' 成功\n请在空中转体720度然后用电饭煲打开 http://localhost:' + port)
