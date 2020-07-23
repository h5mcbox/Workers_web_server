/*
 * Workers web server
 * https://github.com/h5mcbox/Workers_web_server
 * H503mc & h5mcbox
 * 2020-07-22
*/
/* Documention
 * 1:route["/pages"]=function(url){return [text,option]}  function-based pages
 *   url:a URL() Object
 *   text:return text
 *   option:{status:...,headers:...}
 * 2:route["/textpages"]="string"
 */
 
var route={}
route["/"]=function(url){                                                                        //Web root(/)
  var headers={}
  headers["content-type"]="text/html"
  return ["<h1>A web server for cloudflare workers.\n<br>location.href="+url.href+"</h1>",{status:200,headers}]
}
route["/text"]="A example text page."                                                            //a text-based page(/text)
route["/404"]=function(){
  return ["404 Not found.",{status:404,headers:{}}]
}                                                                                                //404 page template(/404)
route["/500"]=function(url){
  if(url.pathname==="/500"){
    return route["/404"](url)
  }                                                                                              //hide 500 page
  return ["Web server gots some error.\n"+e.name+" "+e.message,{status:500,headers:{}}]
}                                                                                                //custom 500 error page(/500)
route["/error"]=function(){
  throw new Error("Throw an error.")
}                                                                                                //Throw an error then show 500 page
/****************Core start****************/
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
/****************Core end****************/
