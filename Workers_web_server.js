/*
 * Workers web server
 * https://github.com/h5mcbox/Workers_web_server
 * H503mc & h5mcbox
 * 2020-07-22
*/
var route={}
route["/"]=function(url){
  var headers={}
  headers["content-type"]="text/html"
  return ["<h1>A web server for cloudflare workers.\n<br>location.href="+url.href+"</h1>",{status:200,headers}]
}
route["/text"]="A example text page."
route["/404"]=function(){
  return ["404 Not found.",{status:404,headers:{}}]
}
route["/error"]=function(){
  throw new Error("Throw an error.")
}
/****************Core****************/
addEventListener('fetch', e => {
  e.respondWith(handleRequest(e.request))
})
async function handleRequest(request){
  return res(request.url,route[(new URL(request.url)).pathname])
}
async function res(url,body=route["/404"],status=200,headers={}){
  var url=new URL(url)
  try{
    if(typeof body==="function"){
      var func=body(url)
      return new Response(func[0],func[1])
    }else{
      return new Response(body, {status,headers})
    }
  }catch(e){
    if(route["/500"]){
      var func=route["/500"](url,e.name,e.message)
      return new Response(func[0],func[1])
    }
    return new Response("Web server gots some error.\n"+e.name+" "+e.message, {status:500,headers:{}})
  }
}
