(this.webpackJsonpdotdot=this.webpackJsonpdotdot||[]).push([[0],{107:function(e,t,n){e.exports=n(175)},147:function(e,t){},152:function(e,t,n){},174:function(e,t,n){},175:function(e,t,n){"use strict";n.r(t);var a=n(0),r=n.n(a),o=n(15),c=n.n(o),l=n(33),s=n(90),u=n.n(s),i=n(11),m=n(34),d=Object(m.a)((function(e,t){switch(console.info("REDUCER: ",t.type),console.log(t.payload),t.type){case"login":if(e.auth.checked=!0,!t.payload){e.auth.loggedIn=!1,e.auth.user=null,e.auth.token=null;break}e.auth.loggedIn=!0,e.auth.user=t.payload.user,e.auth.token=t.payload.token;break;case"offline":e.offline=!0,e.error=null;break;case"error":e.error=t.payload;break;case"socketConnected":e.connected=t.payload}})),f={auth:{checked:!1,loggedIn:!1,user:null,token:null},offline:!1,connected:!1,error:null,messages:[],users:[]},p=r.a.createContext({state:f,dispatch:function(){return console.warn("Using default reducer, check StateProvider"),f}}),g=function(e){var t=r.a.useReducer(d,f),n=Object(i.a)(t,2),a={state:n[0],dispatch:n[1]};return r.a.createElement(p.Provider,{value:a},e.children)},h=function(){return r.a.useContext(p)},E=h,v=n(91),y=n.n(v),b="https://dotdotim.herokuapp.com",k=Object(a.createContext)({socket:null}),x=function(e){var t=h(),n=t.state,o=t.dispatch,c=Object(a.useState)(null),l=Object(i.a)(c,2),s=l[0],u=l[1];Object(a.useEffect)((function(){if(o({type:"error",payload:null}),n.auth.loggedIn){var e=y()(b,{reconnection:!0,timeout:2e3,query:{token:n.auth.token}});e.on("connect",(function(){o({type:"socketConnected",payload:!0})})),e.on("connect_error",(function(e){o({type:"offline",payload:null})})),e.on("connect_timeout",(function(e){o({type:"offline",payload:null})})),e.on("error",(function(e){o({type:"login",payload:null}),o({type:"socketConnected",payload:!1}),o(e?{type:"error",payload:e}:{type:"offline",payload:null})})),u(e)}}),[o,n.auth.loggedIn,n.auth.token]);var m={socket:s};return r.a.createElement(k.Provider,{value:m},e.children)},j=n(35),O=n(9),w=n(92),C=n(56),I=n(23),_=n(182),F=n(93),N=function(e){return r.a.createElement(r.a.Fragment,null,r.a.createElement(F.a,{icon:"spinner",pulse:!0})," ",e.text||"Loading")},T=(n(152),n(22)),U=n(5),P=n.n(U),S=n(94),D=n.n(S),R=function(e){var t="#".concat(e.message.user.color),n={borderLeft:"solid 5px ".concat(t)};return e.draft&&(n.color="#aaa"),r.a.createElement("div",{className:P()(D.a.message,"d-flex justify-content-between align-items-center"),key:e.message.id,style:n},e.message.message,r.a.createElement("span",{style:{color:t}},"@",e.message.user.name))},q=function(){var e=Object(T.a)({messages:[],drafts:{}}),t=Object(i.a)(e,2),n=t[0],o=t[1],c=Object(a.useContext)(k).socket;return Object(a.useEffect)((function(){c&&(c.on("message",(function(e){o((function(t){t.messages.push({id:t.messages.length,message:e.message,user:e.user}),delete t.drafts[e.user.uuid]}))})),c.on("draft",(function(e){o((function(t){e.message.trim().length<1?delete t.drafts[e.user.uuid]:t.drafts[e.user.uuid]=e}))})))}),[c,o]),r.a.createElement("div",{className:"my-4"},n.messages.map((function(e){return r.a.createElement(R,{message:e})})),Object.values(n.drafts).map((function(e){return r.a.createElement(R,{message:e,draft:!0})})))},G=n(184),L=function(){var e=Object(T.a)({message:""}),t=Object(i.a)(e,2),n=t[0],o=t[1],c=Object(a.useRef)(null),l=Object(a.useContext)(k).socket;return r.a.createElement(G.a,{noValidate:!0,onSubmit:function(e){e.preventDefault(),null===l||void 0===l||l.emit("message",{message:n.message}),o((function(e){e.message=""}))}},r.a.createElement(G.a.Group,{controlId:"chatForm.message"},r.a.createElement(G.a.Control,{as:"input",type:"text",placeholder:"Message...",autoFocus:!0,onChange:function(e){e.preventDefault(),clearTimeout(c.current);var t=e.currentTarget.value;o((function(e){e.message=t})),c.current=setTimeout((function(){var e;e=t,null===l||void 0===l||l.emit("draft",{message:e})}),100)},value:n.message})))},J=n(185),M=n(181),V=n(97),B=n.n(V),H=function(){var e=Object(T.a)({users:[]}),t=Object(i.a)(e,2),n=t[0],o=t[1],c=Object(a.useContext)(k).socket;return Object(a.useEffect)((function(){c&&c.on("users",(function(e){o((function(t){t.users=e.users}))}))}),[c,o]),r.a.createElement("div",{className:B.a.onlineUsers},n.users.map((function(e){return r.a.createElement(J.a,{key:e.uuid,placement:"bottom",overlay:r.a.createElement(M.a,{id:"user-".concat(e.uuid)},"@",e.name)},r.a.createElement("span",{style:{color:"#".concat(e.color)}},"\u2022"))})))},K=function(){var e=h().state,t=r.a.createElement(N,null);return e.connected&&(t=r.a.createElement(r.a.Fragment,null,r.a.createElement(H,null),r.a.createElement(q,null),r.a.createElement(L,null))),r.a.createElement(_.a,null,t)},W=n(183),Y=n(96),z=function(){return r.a.createElement(r.a.Fragment,null,r.a.createElement("header",null,r.a.createElement("div",{className:"bg-angle"}),r.a.createElement("section",null,r.a.createElement(_.a,null,r.a.createElement(W.a,null,r.a.createElement(Y.a,{md:{span:6,offset:3}},r.a.createElement("div",{className:"text-center mt-5"},r.a.createElement("h4",{className:"my-2",style:{color:"#fff"}},r.a.createElement(N,null)))))))))},A=function(e){var t=h().state;return t.auth.checked?t.auth.loggedIn?r.a.createElement(I.b,{path:e.path,exact:e.exact,component:e.component}):r.a.createElement(I.a,{to:"/login"}):r.a.createElement(z,null)},Q=function(e){var t=h().state;return t.auth.checked?t.auth.loggedIn?r.a.createElement(I.a,{to:"/"}):r.a.createElement(I.b,{path:e.path,exact:e.exact,component:e.component}):r.a.createElement(z,null)},X=n(61),Z=n.n(X),$=function(){var e=h().state;return e.offline||e.error?e.error?r.a.createElement("div",{className:Z.a.offline},"Error: ",e.error):r.a.createElement("div",{className:Z.a.offline},"You seem to be offline! Please try again later"):null},ee=n(37),te=n.n(ee),ne=n(62),ae=n(63),re=n.n(ae),oe="";re.a.defaults.withCredentials=!0;var ce=function(){var e=Object(ne.a)(te.a.mark((function e(t,n,a){var r,o,c;return te.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(t){e.next=2;break}throw new Error("'url' is required for fetching data");case 2:return r="".concat(b).concat(t),o={url:r,method:n,data:a,timeout:6e3,withCredentials:!0,xsrfHeaderName:"x-csrf-token",headers:{}},oe.length>0&&(o.headers["x-csrf-token"]=oe),e.prev=5,e.next=8,re()(o);case 8:return(c=e.sent).headers["x-csrf-token"]&&(oe=c.headers["x-csrf-token"]),e.next=12,c.data;case 12:return e.abrupt("return",e.sent);case 15:if(e.prev=15,e.t0=e.catch(5),!e.t0.response){e.next=23;break}throw console.warn("useFetch error on ".concat(n," ").concat(t),e.t0.response),{status:e.t0.response.status,message:e.t0.response.data?e.t0.response.data.errors.join(", "):e.t0.message,errors:e.t0.response.data.errors};case 23:throw console.warn("useFetch error on ".concat(n," ").concat(t),e.t0),{status:500,message:e.t0.message,errors:[e.t0.message]};case 26:case"end":return e.stop()}}),e,null,[[5,15]])})));return function(t,n,a){return e.apply(this,arguments)}}(),le=function(){var e=h().dispatch,t=Object(T.a)({username:"",loading:!1}),n=Object(i.a)(t,2),a=n[0],o=n[1];return r.a.createElement(_.a,{className:"mt-4"},r.a.createElement(G.a,{noValidate:!0,onSubmit:function(t){if(t.preventDefault(),!a.loading){o((function(e){e.loading=!0}));var n={username:a.username};ce("/auth","POST",n).then((function(t){if(!t||!t.user.uuid)return console.warn("Invalid user object"),void e({type:"login",payload:null});e({type:"login",payload:t})})).catch((function(t){e({type:"offline",payload:null}),e({type:"login",payload:null}),o((function(e){e.loading=!1}))}))}}},r.a.createElement(G.a.Group,{controlId:"loginForm.username"},r.a.createElement(G.a.Control,{as:"input",type:"text",placeholder:"What's your name?",disabled:a.loading,autoFocus:!0,onChange:function(e){var t=e.currentTarget.value;o((function(e){e.username=t}))},value:a.username}))))},se=function(){var e=E(),t=e.state,n=e.dispatch;return t.auth.checked||ce("/auth","GET").then((function(e){if(!e||!e.user.uuid)return console.warn("Invalid user object"),void n({type:"login",payload:null});n({type:"login",payload:e})})).catch((function(e){console.log("Login check failed",e),n({type:"error",payload:e.errors.join(", ")}),n({type:"login",payload:null})})),r.a.createElement(r.a.Fragment,null,r.a.createElement("div",{id:"content"},r.a.createElement($,null),r.a.createElement(I.d,null,r.a.createElement(Q,{path:"/login",component:le}),r.a.createElement(A,{path:"/",component:K}))))};n(174);!function(){var e=C.b,t=C.a;j.b.add(O.f,O.h,O.d,O.g,O.e,O.b,O.c,O.o,O.n,O.m,O.l,w.a,O.j,O.a,e,t,O.p,O.k,O.q,O.i)}();var ue=r.a.createElement(l.a,{basename:"/dotdot/"},r.a.createElement(u.a,{titleTemplate:"%s | dotdot"}),r.a.createElement(g,null,r.a.createElement(x,null,r.a.createElement(se,null))));c.a.render(ue,document.getElementById("root"))},61:function(e,t,n){e.exports={offline:"OfflineCheck_offline__2vKbm"}},94:function(e,t,n){e.exports={message:"Message_message__2v30T"}},97:function(e,t,n){e.exports={onlineUsers:"OnlineUsers_onlineUsers__2Umxk"}}},[[107,1,2]]]);
//# sourceMappingURL=main.0525e4f6.chunk.js.map