(this.webpackJsonpzattire=this.webpackJsonpzattire||[]).push([[0],{52:function(e,t,a){e.exports=a(84)},57:function(e,t,a){},58:function(e,t,a){},84:function(e,t,a){"use strict";a.r(t);var n=a(0),r=a.n(n),l=a(15),c=a.n(l),o=(a(57),a(58),a(18)),s=a(8),u=a.n(s),i=a(16),m=a(6),d=function(e){return r.a.createElement(r.a.Fragment,null,r.a.createElement("div",{className:"form-group"},r.a.createElement("label",{htmlFor:e.id},e.label,":"),r.a.createElement("input",{type:e.type?e.type:"text",id:e.id,name:e.name,value:e.value,onChange:e.onChange,placeholder:e.placeholder,className:"form-control",required:!0})),r.a.createElement("br",null))},b=a(20),p=a.n(b),h=function(){var e=Object(n.useState)(""),t=Object(m.a)(e,2),a=t[0],l=t[1],c=Object(n.useState)(""),s=Object(m.a)(c,2),b=s[0],h=s[1],E=Object(n.useState)(!1),v=Object(m.a)(E,2),g=v[0],f=v[1],j=Object(n.useState)(""),k=Object(m.a)(j,2),w=k[0],O=k[1];function N(){return(N=Object(i.a)(u.a.mark((function e(t){var n,r,l;return u.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(t.preventDefault(),""!==a.trim()||""!==b.trim()){e.next=4;break}return O("Enter all details"),e.abrupt("return");case 4:return n={username:a,password:b},e.prev=5,e.next=8,p.a.post("/api/login",n);case 8:200===(r=e.sent).status?(l=r.data.token,localStorage.setItem("token",l),f(!0)):O(r.data.message),e.next=15;break;case 12:e.prev=12,e.t0=e.catch(5),O(e.t0.message);case 15:case"end":return e.stop()}}),e,null,[[5,12]])})))).apply(this,arguments)}return Object(n.useEffect)((function(){localStorage.getItem("token")&&f(!0)})),g?r.a.createElement(o.a,{to:"/home"}):r.a.createElement("div",{className:"container"},r.a.createElement("div",{className:"jumbotron justify-content-md-center"},r.a.createElement("h1",{className:"text-center"},"Zattire"),r.a.createElement("form",{onSubmit:function(e){return N.apply(this,arguments)}},r.a.createElement(d,{label:"Username",onChange:function(e){return l(e.currentTarget.value)}}),r.a.createElement(d,{label:"Password",type:"password",onChange:function(e){return h(e.currentTarget.value)}}),r.a.createElement("button",{type:"submit",className:"btn btn-success"},"Submit"),r.a.createElement("p",{className:"text-danger"},w))))},E=a(12),v=function(){return r.a.createElement("nav",{className:"navbar navbar-expand-lg navbar-light bg-light"},r.a.createElement(E.b,{className:"navbar-brand",to:"/home"},"Admin Panel"),r.a.createElement("button",{className:"navbar-toggler",type:"button","data-toggle":"collapse","data-target":"#navbarSupportedContent","aria-controls":"navbarSupportedContent","aria-expanded":"false","aria-label":"Toggle navigation"},r.a.createElement("span",{className:"navbar-toggler-icon"})),r.a.createElement("div",{className:"collapse navbar-collapse",id:"navbarSupportedContent"},r.a.createElement("ul",{className:"navbar-nav mr-auto"},r.a.createElement("li",{className:"nav-item dropdown"},r.a.createElement("a",{className:"nav-link dropdown-toggle",href:"#",id:"navbarDropdownMenuLink","data-toggle":"dropdown","aria-haspopup":"true","aria-expanded":"false"},"Admin"),r.a.createElement("div",{className:"dropdown-menu","aria-labelledby":"navbarDropdownMenuLink"},r.a.createElement(E.b,{className:"dropdown-item",to:"/admin/create"},"Add"),r.a.createElement(E.b,{className:"dropdown-item",to:"/admin/view"},"Edit"))),r.a.createElement("li",{className:"nav-item dropdown"},r.a.createElement("a",{className:"nav-link dropdown-toggle",href:"#",id:"navbarDropdownMenuLink","data-toggle":"dropdown","aria-haspopup":"true","aria-expanded":"false"},"Events"),r.a.createElement("div",{className:"dropdown-menu","aria-labelledby":"navbarDropdownMenuLink"},r.a.createElement(E.b,{className:"dropdown-item",to:"/event/create"},"Add"),r.a.createElement(E.b,{className:"dropdown-item",to:"/event/view"},"Edit"))),r.a.createElement("li",{className:"nav-item"},r.a.createElement(E.b,{className:"nav-link",to:"/logout"},"Logout")))))},g=function(e){return r.a.createElement("div",{className:"form-check-inline"},r.a.createElement("label",{className:"form-check-label"},r.a.createElement("input",{type:"radio",onChange:e.onChange,value:e.value,className:"form-check-input",name:e.name,checked:e.checked}),e.label))},f=a(24),j=function e(){Object(f.a)(this,e)};j.post=function(e,t){var a=localStorage.getItem("token"),n={authorization:"Bearer ".concat(a)};return p.a.post(e,t,{headers:n})},j.put=function(e,t){var a=localStorage.getItem("token"),n={authorization:"Bearer ".concat(a)};return p.a.put(e,t,{headers:n})},j.get=function(e){var t=localStorage.getItem("token"),a={authorization:"Bearer ".concat(t)};return p.a.get(e,{headers:a})};var k=function(){var e=Object(n.useState)(""),t=Object(m.a)(e,2),a=t[0],l=t[1],c=Object(n.useState)(""),o=Object(m.a)(c,2),s=o[0],b=o[1],p=Object(n.useState)("admin"),h=Object(m.a)(p,2),E=h[0],f=h[1],k=Object(n.useState)(""),w=Object(m.a)(k,2),O=w[0],N=w[1],x=Object(n.useState)(""),S=Object(m.a)(x,2),y=S[0],C=S[1];function D(){return(D=Object(i.a)(u.a.mark((function e(t){var n,r,c;return u.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(t.preventDefault(),C(""),N(""),""!==a.trim()||""!==s.trim()||""!==E.trim()){e.next=6;break}return N("Enter all details"),e.abrupt("return");case 6:return n={username:a,password:s,role:E},e.next=9,j.post("/api/login/create",n);case 9:if(200!=(r=e.sent).status){e.next=17;break}C("Added successfully."),l(""),b(""),f("admin"),e.next=22;break;case 17:if(c=r.data.message){e.next=21;break}return N("Error"),e.abrupt("return");case 21:N(c);case 22:case"end":return e.stop()}}),e)})))).apply(this,arguments)}return r.a.createElement(r.a.Fragment,null,r.a.createElement(v,null),r.a.createElement("div",{className:"container"},r.a.createElement("div",{className:"jumbotron"},r.a.createElement("form",{onSubmit:function(e){return D.apply(this,arguments)}},r.a.createElement("h1",null,"Add Admin"),r.a.createElement(d,{value:a,onChange:function(e){return l(e.currentTarget.value)},label:"Username"}),r.a.createElement(d,{value:s,onChange:function(e){return b(e.currentTarget.value)},label:"Password"}),r.a.createElement("p",null,"Role:"),r.a.createElement(g,{name:"role",onChange:function(e){return f(e.currentTarget.value)},label:"Admin",value:"admin",checked:"admin"===E}),r.a.createElement(g,{name:"role",onChange:function(e){return f(e.currentTarget.value)},label:"Sub-Admin",value:"sub-admin",checked:"sub-admin"===E}),r.a.createElement("br",null),r.a.createElement("br",null),r.a.createElement("button",{className:"btn btn-success",type:"submit"},"Submit"),r.a.createElement("p",{className:"text-danger"},O),r.a.createElement("p",{className:"text-success"},y)))))},w=function(){return r.a.createElement(r.a.Fragment,null,r.a.createElement(v,null),r.a.createElement("div",{className:"container"},r.a.createElement("div",{className:"jumbotron"},r.a.createElement("p",null,"Home"))))},O=function(){return Object(n.useEffect)((function(){localStorage.removeItem("token")})),r.a.createElement(o.a,{to:"/"})},N=a(44),x=a(48),S=a(45),y=a(22),C=a(49),D=a(86),T=a(88),I=function(e){function t(e){var a;return Object(f.a)(this,t),(a=Object(x.a)(this,Object(S.a)(t).call(this,e))).state={data:[],editId:0,error:"",editUsername:"",editRole:"",show:!1},a.handleClose=a.handleClose.bind(Object(y.a)(a)),a.saveData=a.saveData.bind(Object(y.a)(a)),a}return Object(C.a)(t,e),Object(N.a)(t,[{key:"getData",value:function(){var e=Object(i.a)(u.a.mark((function e(){var t;return u.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,j.get("/api/admin");case 3:200===(t=e.sent).status&&(console.log(t.data),this.setState({data:t.data})),e.next=10;break;case 7:e.prev=7,e.t0=e.catch(0),console.log(e.t0.message);case 10:case"end":return e.stop()}}),e,this,[[0,7]])})));return function(){return e.apply(this,arguments)}}()},{key:"setEditData",value:function(e){this.setState({editId:e});var t=this.state.data.find((function(t){return t.id===e}));void 0!==t&&null!==t?this.setState({show:!0,editUsername:t.username,editRole:t.role}):console.log("Wrong Id")}},{key:"saveData",value:function(){var e=Object(i.a)(u.a.mark((function e(){var t,a,n,r;return u.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,t={id:this.state.editId,username:this.state.editUsername,role:this.state.editRole},e.next=4,j.put("/api/admin",t);case 4:a=e.sent,n=a.data,r=this.state.data.findIndex((function(e){return e.id===n.id})),console.log(n),this.state.data[r]=n,console.log(this.state.data),this.setState({data:this.state.data,show:!1}),console.log(this.state.data),e.next=17;break;case 14:e.prev=14,e.t0=e.catch(0),console.log(e.t0.message);case 17:case"end":return e.stop()}}),e,this,[[0,14]])})));return function(){return e.apply(this,arguments)}}()},{key:"renderData",value:function(){var e=this;return(this.state.data||[]).map((function(t){return r.a.createElement("tr",{key:t.id},r.a.createElement("td",null,t.id+1),r.a.createElement("td",null,t.username),r.a.createElement("td",null,t.role),r.a.createElement("td",null,r.a.createElement("button",{className:"btn btn-warning",onClick:function(){e.setEditData(t.id)}},"Edit")))}))}},{key:"componentDidMount",value:function(){this.getData()}},{key:"handleClose",value:function(){this.setState({show:!1})}},{key:"render",value:function(){var e=this;return r.a.createElement(r.a.Fragment,null,r.a.createElement(v,null),r.a.createElement("div",{className:"container"},r.a.createElement("div",{className:"jumbotron"},r.a.createElement("h1",null,"View/Edit"),r.a.createElement(D.a,{show:this.state.show,onHide:this.handleClose},r.a.createElement(D.a.Header,{closeButton:!0},r.a.createElement(D.a.Title,null,"Modal heading")),r.a.createElement(D.a.Body,null,r.a.createElement(d,{label:"Username",value:this.state.editUsername,onChange:function(t){return e.setState({editUsername:t.currentTarget.value})}}),r.a.createElement("label",{htmlFor:""},"Role:"),r.a.createElement("br",null),r.a.createElement(g,{name:"role",onChange:function(t){return e.setState({editRole:t.currentTarget.value})},label:"Admin",value:"admin",checked:"admin"===this.state.editRole}),r.a.createElement(g,{name:"role",onChange:function(t){return e.setState({editRole:t.currentTarget.value})},label:"Sub-Admin",value:"sub-admin",checked:"sub-admin"===this.state.editRole})),r.a.createElement(D.a.Footer,null,r.a.createElement(T.a,{variant:"secondary",onClick:this.handleClose},"Close"),r.a.createElement(T.a,{variant:"primary",onClick:this.saveData},"Save Changes"))),r.a.createElement("table",{className:"table"},r.a.createElement("thead",null,r.a.createElement("tr",null,r.a.createElement("th",{scope:"col"},"#"),r.a.createElement("th",{scope:"col"},"Username"),r.a.createElement("th",{scope:"col"},"Role"),r.a.createElement("th",{scope:"col"},"Edit"))),r.a.createElement("tbody",null,this.renderData()))),r.a.createElement("p",{className:"text-danger"},this.state.error)))}}]),t}(r.a.Component),A=a(87),F=function(e){return r.a.createElement(r.a.Fragment,null,r.a.createElement(A.a.Group,{controlId:"exampleForm.ControlTextarea1"},r.a.createElement(A.a.Label,null,e.label,":"),r.a.createElement(A.a.Control,{name:e.name,value:e.value,onChange:e.onChange,as:"textarea",rows:"3"})))},R=function(){var e=Object(n.useState)(""),t=Object(m.a)(e,2),a=t[0],l=t[1],c=Object(n.useState)(""),o=Object(m.a)(c,2),s=o[0],b=o[1],p=Object(n.useState)(""),h=Object(m.a)(p,2),E=h[0],g=h[1],f=Object(n.useState)(""),k=Object(m.a)(f,2),w=k[0],O=k[1],N=Object(n.useState)(""),x=Object(m.a)(N,2),S=x[0],y=x[1],C=Object(n.useState)(""),D=Object(m.a)(C,2),T=D[0],I=D[1],A=Object(n.useState)(""),R=Object(m.a)(A,2),U=R[0],B=R[1],L=Object(n.useState)(""),M=Object(m.a)(L,2),z=M[0],H=M[1],P=Object(n.useState)(""),W=Object(m.a)(P,2),J=W[0],q=W[1];function G(){return(G=Object(i.a)(u.a.mark((function e(t){var n,r;return u.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(t.preventDefault(),""!==E.trim()||""!==s.trim()){e.next=4;break}return H("Enter all details"),e.abrupt("return");case 4:return n={name:a,description:s,entryProcedure:E,exhibitionHouse:w,startDate:S,endDate:T,location:U},e.prev=5,e.next=8,j.post("/api/event",n);case 8:200===(r=e.sent).status?(console.log(r.data),q("Added successfully."),document.getElementById("my-form").reset()):H(r.data.message),e.next=15;break;case 12:e.prev=12,e.t0=e.catch(5),H(e.t0.message);case 15:case"end":return e.stop()}}),e,null,[[5,12]])})))).apply(this,arguments)}return r.a.createElement(r.a.Fragment,null,r.a.createElement(v,null),r.a.createElement("div",{className:"container"},r.a.createElement("div",{className:"jumbotron"},r.a.createElement("h1",null,"Add"),r.a.createElement("form",{onSubmit:function(e){return G.apply(this,arguments)},id:"my-form"},r.a.createElement(d,{label:"Name",onChange:function(e){return l(e.currentTarget.value)}}),r.a.createElement(F,{label:"Description",onChange:function(e){return b(e.currentTarget.value)}}),r.a.createElement(F,{label:"Entry Procedure",onChange:function(e){return g(e.currentTarget.value)}}),r.a.createElement(d,{label:"Exhibition House",onChange:function(e){return O(e.currentTarget.value)}}),r.a.createElement(d,{label:"Start Date",type:"date",onChange:function(e){return y(e.currentTarget.value)}}),r.a.createElement(d,{label:"End Date",type:"date",onChange:function(e){return I(e.currentTarget.value)}}),r.a.createElement(d,{label:"Location",onChange:function(e){return B(e.currentTarget.value)}}),r.a.createElement("button",{type:"submit",className:"btn btn-success"},"Submit"),r.a.createElement("p",{className:"text-danger"},z),r.a.createElement("p",{className:"text-success"},J)))))};var U=function(){return r.a.createElement(o.d,null,r.a.createElement(o.b,{exact:!0,path:"/",component:h}),r.a.createElement(o.b,{exact:!0,path:"/home",component:w}),r.a.createElement(o.b,{exact:!0,path:"/logout",component:O}),r.a.createElement(o.b,{exact:!0,path:"/admin/create",component:k}),r.a.createElement(o.b,{exact:!0,path:"/admin/view",component:I}),r.a.createElement(o.b,{exact:!0,path:"/event/create",component:R}))};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));c.a.render(r.a.createElement(E.a,null,r.a.createElement(U,null)),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))}},[[52,1,2]]]);
//# sourceMappingURL=main.b5636829.chunk.js.map