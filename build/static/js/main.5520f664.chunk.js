(this["webpackJsonppuhelinluettelo-step8"]=this["webpackJsonppuhelinluettelo-step8"]||[]).push([[0],{40:function(e,n,t){"use strict";t.r(n);var o=t(3),r=t(0),c=t(2),i=t(15),a=t.n(i),s=function(e){return Object(r.jsxs)("div",{children:["filter: ",Object(r.jsx)("input",{value:e.newFilter,onChange:e.handleFilterChange})]})},l=function(e){return Object(r.jsx)("button",{onClick:e.handleClick,children:e.text})},u=function(e){var n=e.persons.filter((function(n){return n.name.toLowerCase().includes(e.newFilter.toLowerCase())}));return console.log("Phone number: ",n.map((function(e){return e.number}))),Object(r.jsx)(r.Fragment,{children:n.map((function(n){return Object(r.jsxs)("div",{children:[" ",n.name," ",n.number,Object(r.jsx)(l,{handleClick:function(){return function(n){window.confirm("Vahvista "+n.name+" poistaminen.")&&(console.log("Delete: ",n.name),e.deletePerson(n))}(n)},text:"remove"})," "]},n.name)}))})},d=function(e){return Object(r.jsxs)("form",{onSubmit:e.addRecord,children:[Object(r.jsxs)("div",{children:["name: ",Object(r.jsx)("input",{value:e.newName,onChange:e.handleNameChange})]}),Object(r.jsxs)("div",{children:["number: ",Object(r.jsx)("input",{value:e.newNumber,onChange:e.handleNumberChange})]}),Object(r.jsx)("div",{children:Object(r.jsx)("button",{type:"submit",children:"add"})})]})},m=function(e){var n=e.message,t=e.isError;return null===n?null:Object(r.jsx)("div",{style:t?{background:"lightgrey",borderStyle:"solid",borderRadius:5,padding:10,marginBottom:10,color:"red",fontStyle:"italic",fontSize:20}:{background:"lightgrey",borderStyle:"solid",borderRadius:5,padding:10,marginBottom:10,color:"green",fontStyle:"italic",fontSize:20},children:n})},b=t(4),j=t.n(b),h="/api/persons",f=function(){return console.log("Get All"),j.a.get(h).then((function(e){return e.data}))},g=function(e){return console.log("Create new db record ",e),j.a.post(h,e).then((function(e){return e.data}))},p=function(e,n){return console.log("Update db record:"+e,n),j.a.put("".concat(h,"/").concat(e),n).then((function(e){return e.data}))},O=function(e){return console.log("Delete person from db",e.name),j.a.delete("".concat(h,"/").concat(e.id)).then((function(e){return e.data}))},v=function(){var e=Object(c.useState)([]),n=Object(o.a)(e,2),t=n[0],i=n[1],a=Object(c.useState)(""),l=Object(o.a)(a,2),b=l[0],j=l[1],h=Object(c.useState)(""),v=Object(o.a)(h,2),x=v[0],w=v[1],C=Object(c.useState)(""),k=Object(o.a)(C,2),S=k[0],y=k[1],E=Object(c.useState)({message:null,isError:!1}),N=Object(o.a)(E,2),P=N[0],F=N[1],H=function(){f().then((function(e){console.log("promise fulfilled"),i(e)}))};Object(c.useEffect)((function(){console.log("effect"),H()}),[]),console.log("render",t.length,"notes");var R=function(e){setTimeout((function(){F({message:null,isError:!1})}),e)},B=function(e){return e.name!==b};return Object(r.jsxs)("div",{children:[Object(r.jsx)("h2",{children:"Phonebook"}),Object(r.jsx)(m,{message:P.message,isError:P.isError}),Object(r.jsx)(s,{newFilter:S,handleFilterChange:function(e){y(e.target.value)}}),Object(r.jsx)("h2",{children:"Add new"}),Object(r.jsx)(d,{newName:b,handleNameChange:function(e){j(e.target.value)},newNumber:x,handleNumberChange:function(e){w(e.target.value)},addRecord:function(e){if(e.preventDefault(),console.log("button clicked",e.target),t.every(B)){g({name:b,number:x}).then((function(e){console.log("personService.post returned person is:",e),console.log("setPerson name: ",b),i(t.concat(e)),j(""),w(""),F({message:"Uusi tietue ".concat(e.name," lis\xe4tty"),isError:!1}),R(5e3)}))}else{console.log("Phone number update");var n=t.find((function(e){return e.name===b}));if(window.confirm("Henkil\xf6 "+n.name+" on jo olemassa. P\xe4ivitet\xe4\xe4nk\xf6 puhelinnumero?")){var o={name:b,number:x};p(n.id,o).then((function(){j(""),w(""),H(),F({message:"Henkil\xf6n ".concat(o.name," puhelinnumero p\xe4ivitetty"),isError:!1}),R(5e3)}))}}}}),Object(r.jsx)("h2",{children:"Numbers"}),Object(r.jsx)(u,{persons:t,newFilter:S,deletePerson:function(e){console.log("Index.js deletePerson: ",e.name),O(e).then((function(n){console.log("Person deleted",n),H(),F({message:"Henkil\xf6 ".concat(e.name," poistettu"),isError:!1}),R(5e3)})).catch((function(n){H(),F({message:"Henkil\xf6 ".concat(e.name," on jo poistettu palvelimelta."),isError:!0}),R(5e3)}))}})]})};a.a.render(Object(r.jsx)(v,{}),document.getElementById("root"))}},[[40,1,2]]]);
//# sourceMappingURL=main.5520f664.chunk.js.map