/*
 * Worker web server
 * https://github.com/h5mcbox/Worker_web_server
 * 2020-07-22
*/
var route={}
route["/"]=function(){
  return ["A web server for cloudflare workers.",{status:200,headers:{}}]
}
route["/text"]="A example text page."
route["/404"]=function(){
  return ["404 Not found.",{status:404,headers:{}}]
}
/****************Core****************/
addEventListener('fetch', e => {
  e.respondWith(handleRequest(e.request))
})
async function handleRequest(request){
  return res(route[(new URL(request.url)).pathname])
}
async function res(body=route["/404"],status=200,headers={}){
  try{
    if(typeof body==="function"){
      var func=body()
      return new Response(func[0],func[1])
    }else{
      return new Response(body, {status,headers})
    }
  }catch(e){
    if(route["500"]){
      var func=route["/500"](e.name,e.message)
      return new Response(func[0],func[1])
    }
    return new Response("Web server gots some error.\n"+e.name+" "+e.message, {status:500,headers:{}})
  }
}
