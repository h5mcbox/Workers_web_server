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
  if(typeof body==="function"){
    var func=body()
    return new Response(func[0],func[1])
  }else{
    return new Response(body, {status,headers})
  }
}
