(this.webpackJsonpdotdot=this.webpackJsonpdotdot||[]).push([[0],{116:function(e,t){},121:function(e,t,n){},143:function(e,t,n){},144:function(e,t,n){"use strict";n.r(t);var a=n(0),r=n.n(a),o=n(65),l=n.n(o),c=n(18),s=n(66),u=n.n(s),i=n(7),m=n(19),d=Object(m.a)((function(e,t){switch(console.info("REDUCER: ",t.type),console.log(t.payload),t.type){case"login":if(e.auth.checked=!0,!t.payload){e.auth.loggedIn=!1,e.auth.user=null,e.auth.token=null;break}e.auth.loggedIn=!0,e.auth.user=t.payload.user,e.auth.token=t.payload.token;break;case"offline":e.offline=!0,e.error=null;break;case"error":e.error=t.payload;break;case"socketConnected":e.connected=t.payload}})),f={auth:{checked:!0,loggedIn:!1,user:null,token:null},offline:!1,connected:!1,error:null,messages:[],users:[]},p=r.a.createContext({state:f,dispatch:function(){return console.warn("Using default reducer, check StateProvider"),f}}),h=function(e){var t=r.a.useReducer(d,f),n=Object(i.a)(t,2),a={state:n[0],dispatch:n[1]};return r.a.createElement(p.Provider,{value:a},e.children)},g=function(){return r.a.useContext(p)},E=n(67),v=n.n(E),y=Object(a.createContext)({socket:null}),b=function(e){var t=g(),n=t.state,o=t.dispatch,l=Object(a.useState)(null),c=Object(i.a)(l,2),s=c[0],u=c[1];Object(a.useEffect)((function(){if(o({type:"error",payload:null}),n.auth.loggedIn){var e=v()("http://localhost:8080",{reconnection:!0,timeout:2e3,query:{token:n.auth.token}});e.on("connect",(function(){console.log("connected"),o({type:"socketConnected",payload:!0})})),e.on("connect_error",(function(e){console.log("failed to connect",e),o({type:"offline",payload:null})})),e.on("connect_timeout",(function(e){console.log("timeout connect",e),o({type:"offline",payload:null})})),e.on("error",(function(e){console.log("failed to connect",e),o({type:"login",payload:null}),o({type:"socketConnected",payload:!1}),o(e?{type:"error",payload:e}:{type:"offline",payload:null})})),u(e)}}),[o,n.auth.loggedIn,n.auth.token]);var m={socket:s};return console.log("socket provider: ",s),r.a.createElement(y.Provider,{value:m},e.children)},k=n(20),x=n(6),j=n(68),O=n(35),C=n(12),w=n(145),I=n(69),F=function(e){return r.a.createElement(r.a.Fragment,null,r.a.createElement(I.a,{icon:"spinner",pulse:!0})," ",e.text||"Loading")},N=(n(121),n(148)),L=n(16),P=function(){var e=Object(L.a)({messages:[]}),t=Object(i.a)(e,2),n=t[0],o=t[1],l=Object(a.useContext)(y).socket;return Object(a.useEffect)((function(){l&&l.on("message",(function(e){console.log("message",e),o((function(t){t.messages.push({id:t.messages.length,msg:e,user:{uuid:"1",name:"alex",color:"eb0000"}})}))}))}),[l,o]),r.a.createElement(N.a,{className:"my-4"},n.messages.map((function(e){return r.a.createElement(N.a.Item,{key:e.id,style:{borderLeftWidth:"4px",borderLeftColor:"#".concat(e.user.color)}},e.msg)})))},S=n(147),_=function(){var e=Object(L.a)({message:""}),t=Object(i.a)(e,2),n=t[0],o=t[1],l=Object(a.useContext)(y).socket;return r.a.createElement(S.a,{noValidate:!0,onSubmit:function(e){e.preventDefault(),null===l||void 0===l||l.emit("message",n.message),o((function(e){e.message=""}))}},r.a.createElement(S.a.Group,{controlId:"chatForm.message"},r.a.createElement(S.a.Label,null,"Message"),r.a.createElement(S.a.Control,{as:"input",type:"text",autoFocus:!0,onChange:function(e){var t=e.currentTarget.value;o((function(e){e.message=t}))},value:n.message})))},T=function(){var e=g().state,t=r.a.createElement(F,null);return e.connected&&(t=r.a.createElement(r.a.Fragment,null,r.a.createElement(P,null),r.a.createElement(_,null))),r.a.createElement(w.a,null,t)},q=n(146),D=n(72),R=function(){return r.a.createElement(r.a.Fragment,null,r.a.createElement("header",null,r.a.createElement("div",{className:"bg-angle"}),r.a.createElement("section",null,r.a.createElement(w.a,null,r.a.createElement(q.a,null,r.a.createElement(D.a,{md:{span:6,offset:3}},r.a.createElement("div",{className:"text-center mt-5"},r.a.createElement("h4",{className:"my-2",style:{color:"#fff"}},r.a.createElement(F,null)))))))))},U=function(e){var t=g().state;return t.auth.checked?t.auth.loggedIn?r.a.createElement(C.b,{path:e.path,exact:e.exact,component:e.component}):r.a.createElement(C.a,{to:"/login"}):r.a.createElement(R,null)},G=function(e){var t=g().state;return t.auth.checked?t.auth.loggedIn?r.a.createElement(C.a,{to:"/"}):r.a.createElement(C.b,{path:e.path,exact:e.exact,component:e.component}):r.a.createElement(R,null)},J=n(38),V=n.n(J),B=function(){var e=g().state;return e.offline||e.error?e.error?r.a.createElement("div",{className:V.a.offline},"Error: ",e.error):r.a.createElement("div",{className:V.a.offline},"You seem to be offline! Please try again later"):null},H=n(21),K=n.n(H),M=n(39),W=n(40),Y=n.n(W),z="";Y.a.defaults.withCredentials=!0;var A=function(){var e=Object(M.a)(K.a.mark((function e(t,n,a){var r,o,l;return K.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(t){e.next=2;break}throw new Error("'url' is required for fetching data");case 2:return r="".concat("https://dotdotim.herokuapp.com/").concat(t),o={url:r,method:n,data:a,timeout:6e3,withCredentials:!0,xsrfHeaderName:"x-csrf-token",headers:{}},z.length>0&&(o.headers["x-csrf-token"]=z),e.prev=5,e.next=8,Y()(o);case 8:return(l=e.sent).headers["x-csrf-token"]&&(z=l.headers["x-csrf-token"]),e.next=12,l.data;case 12:return e.abrupt("return",e.sent);case 15:if(e.prev=15,e.t0=e.catch(5),!e.t0.response){e.next=23;break}throw console.warn("useFetch error",e.t0.response),{status:e.t0.response.status,message:e.t0.response.data?e.t0.response.data.errors.join(", "):e.t0.message,errors:e.t0.response.data.errors};case 23:throw console.warn("useFetch error",e.t0),{status:500,message:e.t0.message,errors:[e.t0.message]};case 26:case"end":return e.stop()}}),e,null,[[5,15]])})));return function(t,n,a){return e.apply(this,arguments)}}(),Q=function(){var e=g().dispatch,t=Object(L.a)({username:""}),n=Object(i.a)(t,2),a=n[0],o=n[1];return r.a.createElement(w.a,{className:"mt-4"},r.a.createElement(S.a,{noValidate:!0,onSubmit:function(t){t.preventDefault();var n={username:a.username};A("/auth","POST",n).then((function(t){if(!t||!t.user.uuid)return console.warn("Invalid user object"),void e({type:"login",payload:null});e({type:"login",payload:t})})).catch((function(t){e({type:"offline",payload:null}),e({type:"login",payload:null})}))}},r.a.createElement(S.a.Group,{controlId:"loginForm.username"},r.a.createElement(S.a.Label,null,"User name"),r.a.createElement(S.a.Control,{as:"input",type:"text",autoFocus:!0,onChange:function(e){var t=e.currentTarget.value;o((function(e){e.username=t}))},value:a.username}))))},X=function(){return r.a.createElement(r.a.Fragment,null,r.a.createElement("div",{id:"content"},r.a.createElement(B,null),r.a.createElement(C.d,null,r.a.createElement(G,{path:"/login",component:Q}),r.a.createElement(U,{path:"/",component:T}))))};n(143);!function(){var e=O.b,t=O.a;k.b.add(x.f,x.h,x.d,x.g,x.e,x.b,x.c,x.o,x.n,x.m,x.l,j.a,x.j,x.a,e,t,x.p,x.k,x.q,x.i)}();var Z=r.a.createElement(c.a,{basename:"/"},r.a.createElement(u.a,{titleTemplate:"%s | dotdot"}),r.a.createElement(h,null,r.a.createElement(b,null,r.a.createElement(X,null))));l.a.render(Z,document.getElementById("root"))},38:function(e,t,n){e.exports={offline:"OfflineCheck_offline__2vKbm"}},76:function(e,t,n){e.exports=n(144)}},[[76,1,2]]]);
//# sourceMappingURL=main.38831bfe.chunk.js.map