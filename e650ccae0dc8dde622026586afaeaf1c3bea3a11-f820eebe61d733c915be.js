"use strict";(self.webpackChunkzanechua_dot_com=self.webpackChunkzanechua_dot_com||[]).push([[289],{2069:function(e,t,n){n.d(t,{Z:function(){return ne}});var r=n(959),a=n(7133);var l=()=>r.createElement("footer",{className:"bg-gray-800"},r.createElement("nav",{className:"flex justify-between max-w-4xl p-4 mx-auto text-sm md:p-8"},r.createElement("p",{className:"text-white"},r.createElement(a.Link,{className:"font-bold no-underline",key:"zanechua-main",to:"/"},"© zanechua.com ",(new Date).getFullYear())),r.createElement("nav",null,[{route:"https://gitlab.com/zanechua",title:"GitLab"},{route:"https://github.com/zanechua",title:"GitHub"},{route:"https://twitter.com/zanejchua",title:"Twitter"},{route:"https://www.linkedin.com/in/zanejchua/",title:"LinkedIn"}].map((e=>r.createElement("a",{className:"block mt-4 font-bold text-white no-underline md:inline-block md:mt-0 md:ml-6",key:e.title,href:e.route,target:"_blank",rel:"nofollow noopener noreferrer"},e.title))))));var i=()=>{const{0:e,1:t}=(0,r.useState)(!1),{site:n}=(0,a.useStaticQuery)("3649515864");return r.createElement("header",{className:"bg-gray-800"},r.createElement("div",{className:"flex flex-wrap items-center justify-between max-w-4xl p-4 mx-auto md:p-8"},r.createElement(a.Link,{to:"/"},r.createElement("h1",{className:"flex items-center text-white no-underline"},r.createElement("span",{className:"text-xl font-bold tracking-tight"},n.siteMetadata.title))),r.createElement("button",{type:"button",className:"flex items-center block px-3 py-2 text-white border border-white rounded md:hidden",onClick:()=>t(!e)},r.createElement("svg",{className:"w-3 h-3 fill-current",viewBox:"0 0 20 20",xmlns:"http://www.w3.org/2000/svg"},r.createElement("title",null,"Menu"),r.createElement("path",{d:"M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"}))),r.createElement("nav",{className:(e?"block":"hidden")+" md:block md:flex md:items-center w-full md:w-auto"},[{route:"/lab",title:"Lab"},{route:"/about",title:"About"}].map((e=>r.createElement(a.Link,{className:"block mt-4 text-white no-underline md:inline-block md:mt-0 md:ml-6",key:e.title,to:e.route},e.title))))))};function o(...e){return e.filter(Boolean).join(" ")}function s(e,t,...n){if(e in t){let r=t[e];return"function"==typeof r?r(...n):r}let r=new Error(`Tried to handle "${e}" but there is no handler defined. Only defined handlers are: ${Object.keys(t).map((e=>`"${e}"`)).join(", ")}.`);throw Error.captureStackTrace&&Error.captureStackTrace(r,s),r}var u,c,d=((c=d||{})[c.None=0]="None",c[c.RenderStrategy=1]="RenderStrategy",c[c.Static=2]="Static",c),m=((u=m||{})[u.Unmount=0]="Unmount",u[u.Hidden=1]="Hidden",u);function f({ourProps:e,theirProps:t,slot:n,defaultTag:r,features:a,visible:l=!0,name:i}){let o=h(t,e);if(l)return p(o,n,r,i);let u=null!=a?a:0;if(2&u){let{static:e=!1,...t}=o;if(e)return p(t,n,r,i)}if(1&u){let{unmount:e=!0,...t}=o;return s(e?0:1,{0(){return null},1(){return p({...t,hidden:!0,style:{display:"none"}},n,r,i)}})}return p(o,n,r,i)}function p(e,t={},n,a){let{as:l=n,children:i,refName:s="ref",...u}=b(e,["unmount","static"]),c=void 0!==e.ref?{[s]:e.ref}:{},d="function"==typeof i?i(t):i;"className"in u&&u.className&&"function"==typeof u.className&&(u.className=u.className(t));let m={};if(t){let e=!1,n=[];for(let[r,a]of Object.entries(t))"boolean"==typeof a&&(e=!0),!0===a&&n.push(r);e&&(m["data-headlessui-state"]=n.join(" "))}if(l===r.Fragment&&Object.keys(g(u)).length>0){if(!(0,r.isValidElement)(d)||Array.isArray(d)&&d.length>1)throw new Error(['Passing props on "Fragment"!',"",`The current component <${a} /> is rendering a "Fragment".`,"However we need to passthrough the following props:",Object.keys(u).map((e=>`  - ${e}`)).join("\n"),"","You can apply a few solutions:",['Add an `as="..."` prop, to ensure that we render an actual element instead of a "Fragment".',"Render a single element as the child so that we can forward the props onto that element."].map((e=>`  - ${e}`)).join("\n")].join("\n"));let e=d.props,t="function"==typeof(null==e?void 0:e.className)?(...t)=>o(null==e?void 0:e.className(...t),u.className):o(null==e?void 0:e.className,u.className),n=t?{className:t}:{};return(0,r.cloneElement)(d,Object.assign({},h(d.props,g(b(u,["ref"]))),m,c,function(...e){return{ref:e.every((e=>null==e))?void 0:t=>{for(let n of e)null!=n&&("function"==typeof n?n(t):n.current=t)}}}(d.ref,c.ref),n))}return(0,r.createElement)(l,Object.assign({},b(u,["ref"]),l!==r.Fragment&&c,l!==r.Fragment&&m),d)}function h(...e){if(0===e.length)return{};if(1===e.length)return e[0];let t={},n={};for(let r of e)for(let e in r)e.startsWith("on")&&"function"==typeof r[e]?(null!=n[e]||(n[e]=[]),n[e].push(r[e])):t[e]=r[e];if(t.disabled||t["aria-disabled"])return Object.assign(t,Object.fromEntries(Object.keys(n).map((e=>[e,void 0]))));for(let r in n)Object.assign(t,{[r](e,...t){let a=n[r];for(let n of a){if((e instanceof Event||(null==e?void 0:e.nativeEvent)instanceof Event)&&e.defaultPrevented)return;n(e,...t)}}});return t}function v(e){var t;return Object.assign((0,r.forwardRef)(e),{displayName:null!=(t=e.displayName)?t:e.name})}function g(e){let t=Object.assign({},e);for(let n in t)void 0===t[n]&&delete t[n];return t}function b(e,t=[]){let n=Object.assign({},e);for(let r of t)r in n&&delete n[r];return n}let E=(0,r.createContext)(null);E.displayName="OpenClosedContext";var w=(e=>(e[e.Open=1]="Open",e[e.Closed=2]="Closed",e[e.Closing=4]="Closing",e[e.Opening=8]="Opening",e))(w||{});function y(){return(0,r.useContext)(E)}function x({value:e,children:t}){return r.createElement(E.Provider,{value:e},t)}var k=Object.defineProperty,N=(e,t,n)=>(((e,t,n)=>{t in e?k(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n})(e,"symbol"!=typeof t?t+"":t,n),n);let F=new class{constructor(){N(this,"current",this.detect()),N(this,"handoffState","pending"),N(this,"currentId",0)}set(e){this.current!==e&&(this.handoffState="pending",this.currentId=0,this.current=e)}reset(){this.set(this.detect())}nextId(){return++this.currentId}get isServer(){return"server"===this.current}get isClient(){return"client"===this.current}detect(){return"undefined"==typeof window||"undefined"==typeof document?"server":"client"}handoff(){"pending"===this.handoffState&&(this.handoffState="complete")}get isHandoffComplete(){return"complete"===this.handoffState}},C=(e,t)=>{F.isServer?(0,r.useEffect)(e,t):(0,r.useLayoutEffect)(e,t)};function T(){let e=(0,r.useRef)(!1);return C((()=>(e.current=!0,()=>{e.current=!1})),[]),e}function S(e){let t=(0,r.useRef)(e);return C((()=>{t.current=e}),[e]),t}function j(){let[e,t]=(0,r.useState)(F.isHandoffComplete);return e&&!1===F.isHandoffComplete&&t(!1),(0,r.useEffect)((()=>{!0!==e&&t(!0)}),[e]),(0,r.useEffect)((()=>F.handoff()),[]),e}let O=function(e){let t=S(e);return r.useCallback(((...e)=>t.current(...e)),[t])},L=Symbol();function P(...e){let t=(0,r.useRef)(e);(0,r.useEffect)((()=>{t.current=e}),[e]);let n=O((e=>{for(let n of t.current)null!=n&&("function"==typeof n?n(e):n.current=e)}));return e.every((e=>null==e||(null==e?void 0:e[L])))?void 0:n}function R(){let e=[],t={addEventListener(e,n,r,a){return e.addEventListener(n,r,a),t.add((()=>e.removeEventListener(n,r,a)))},requestAnimationFrame(...e){let n=requestAnimationFrame(...e);return t.add((()=>cancelAnimationFrame(n)))},nextFrame(...e){return t.requestAnimationFrame((()=>t.requestAnimationFrame(...e)))},setTimeout(...e){let n=setTimeout(...e);return t.add((()=>clearTimeout(n)))},microTask(...e){let n={current:!0};return function(e){"function"==typeof queueMicrotask?queueMicrotask(e):Promise.resolve().then(e).catch((e=>setTimeout((()=>{throw e}))))}((()=>{n.current&&e[0]()})),t.add((()=>{n.current=!1}))},style(e,t,n){let r=e.style.getPropertyValue(t);return Object.assign(e.style,{[t]:n}),this.add((()=>{Object.assign(e.style,{[t]:r})}))},group(e){let t=R();return e(t),this.add((()=>t.dispose()))},add(t){return e.push(t),()=>{let n=e.indexOf(t);if(n>=0)for(let t of e.splice(n,1))t()}},dispose(){for(let t of e.splice(0))t()}};return t}function H(e,...t){e&&t.length>0&&e.classList.add(...t)}function z(e,...t){e&&t.length>0&&e.classList.remove(...t)}function M(e,t,n,r){let a=n?"enter":"leave",l=R(),i=void 0!==r?function(e){let t={called:!1};return(...n)=>{if(!t.called)return t.called=!0,e(...n)}}(r):()=>{};"enter"===a&&(e.removeAttribute("hidden"),e.style.display="");let o=s(a,{enter:()=>t.enter,leave:()=>t.leave}),u=s(a,{enter:()=>t.enterTo,leave:()=>t.leaveTo}),c=s(a,{enter:()=>t.enterFrom,leave:()=>t.leaveFrom});return z(e,...t.enter,...t.enterTo,...t.enterFrom,...t.leave,...t.leaveFrom,...t.leaveTo,...t.entered),H(e,...o,...c),l.nextFrame((()=>{z(e,...c),H(e,...u),function(e,t){let n=R();if(!e)return n.dispose;let{transitionDuration:r,transitionDelay:a}=getComputedStyle(e),[l,i]=[r,a].map((e=>{let[t=0]=e.split(",").filter(Boolean).map((e=>e.includes("ms")?parseFloat(e):1e3*parseFloat(e))).sort(((e,t)=>t-e));return t})),o=l+i;if(0!==o){n.group((n=>{n.setTimeout((()=>{t(),n.dispose()}),o),n.addEventListener(e,"transitionrun",(e=>{e.target===e.currentTarget&&n.dispose()}))}));let r=n.addEventListener(e,"transitionend",(e=>{e.target===e.currentTarget&&(t(),r())}))}else t();n.add((()=>t())),n.dispose}(e,(()=>(z(e,...o),H(e,...t.entered),i())))})),l.dispose}function A(){let[e]=(0,r.useState)(R);return(0,r.useEffect)((()=>()=>e.dispose()),[e]),e}function U(e=""){return e.split(" ").filter((e=>e.trim().length>1))}let q=(0,r.createContext)(null);q.displayName="TransitionContext";var B=(e=>(e.Visible="visible",e.Hidden="hidden",e))(B||{});let I=(0,r.createContext)(null);function $(e){return"children"in e?$(e.children):e.current.filter((({el:e})=>null!==e.current)).filter((({state:e})=>"visible"===e)).length>0}function D(e,t){let n=S(e),a=(0,r.useRef)([]),l=T(),i=A(),o=O(((e,t=m.Hidden)=>{let r=a.current.findIndex((({el:t})=>t===e));-1!==r&&(s(t,{[m.Unmount](){a.current.splice(r,1)},[m.Hidden](){a.current[r].state="hidden"}}),i.microTask((()=>{var e;!$(a)&&l.current&&(null==(e=n.current)||e.call(n))})))})),u=O((e=>{let t=a.current.find((({el:t})=>t===e));return t?"visible"!==t.state&&(t.state="visible"):a.current.push({el:e,state:"visible"}),()=>o(e,m.Unmount)})),c=(0,r.useRef)([]),d=(0,r.useRef)(Promise.resolve()),f=(0,r.useRef)({enter:[],leave:[],idle:[]}),p=O(((e,n,r)=>{c.current.splice(0),t&&(t.chains.current[n]=t.chains.current[n].filter((([t])=>t!==e))),null==t||t.chains.current[n].push([e,new Promise((e=>{c.current.push(e)}))]),null==t||t.chains.current[n].push([e,new Promise((e=>{Promise.all(f.current[n].map((([e,t])=>t))).then((()=>e()))}))]),"enter"===n?d.current=d.current.then((()=>null==t?void 0:t.wait.current)).then((()=>r(n))):r(n)})),h=O(((e,t,n)=>{Promise.all(f.current[t].splice(0).map((([e,t])=>t))).then((()=>{var e;null==(e=c.current.shift())||e()})).then((()=>n(t)))}));return(0,r.useMemo)((()=>({children:a,register:u,unregister:o,onStart:p,onStop:h,wait:d,chains:f})),[u,o,a,p,h,f,d])}function V(){}I.displayName="NestingContext";let _=["beforeEnter","afterEnter","beforeLeave","afterLeave"];function W(e){var t;let n={};for(let r of _)n[r]=null!=(t=e[r])?t:V;return n}let Z=d.RenderStrategy;let G=v((function(e,t){let{show:n,appear:a=!1,unmount:l,...i}=e,o=(0,r.useRef)(null),s=P(o,t);j();let u=y();if(void 0===n&&null!==u&&(n=(u&w.Open)===w.Open),![!0,!1].includes(n))throw new Error("A <Transition /> is used but it is missing a `show={true | false}` prop.");let[c,d]=(0,r.useState)(n?"visible":"hidden"),m=D((()=>{d("hidden")})),[p,h]=(0,r.useState)(!0),v=(0,r.useRef)([n]);C((()=>{!1!==p&&v.current[v.current.length-1]!==n&&(v.current.push(n),h(!1))}),[v,n]);let g=(0,r.useMemo)((()=>({show:n,appear:a,initial:p})),[n,a,p]);(0,r.useEffect)((()=>{if(n)d("visible");else if($(m)){let e=o.current;if(!e)return;let t=e.getBoundingClientRect();0===t.x&&0===t.y&&0===t.width&&0===t.height&&d("hidden")}else d("hidden")}),[n,m]);let b={unmount:l},E=O((()=>{var t;p&&h(!1),null==(t=e.beforeEnter)||t.call(e)})),x=O((()=>{var t;p&&h(!1),null==(t=e.beforeLeave)||t.call(e)}));return r.createElement(I.Provider,{value:m},r.createElement(q.Provider,{value:g},f({ourProps:{...b,as:r.Fragment,children:r.createElement(Q,{ref:s,...b,...i,beforeEnter:E,beforeLeave:x})},theirProps:{},defaultTag:r.Fragment,features:Z,visible:"visible"===c,name:"Transition"})))})),Q=v((function(e,t){let{beforeEnter:n,afterEnter:a,beforeLeave:l,afterLeave:i,enter:u,enterFrom:c,enterTo:d,entered:p,leave:h,leaveFrom:v,leaveTo:g,...b}=e,E=(0,r.useRef)(null),y=P(E,t),k=b.unmount?m.Unmount:m.Hidden,{show:N,appear:F,initial:L}=function(){let e=(0,r.useContext)(q);if(null===e)throw new Error("A <Transition.Child /> is used but it is missing a parent <Transition /> or <Transition.Root />.");return e}(),[H,z]=(0,r.useState)(N?"visible":"hidden"),B=function(){let e=(0,r.useContext)(I);if(null===e)throw new Error("A <Transition.Child /> is used but it is missing a parent <Transition /> or <Transition.Root />.");return e}(),{register:V,unregister:_}=B,G=(0,r.useRef)(null);(0,r.useEffect)((()=>V(E)),[V,E]),(0,r.useEffect)((()=>{if(k===m.Hidden&&E.current)return N&&"visible"!==H?void z("visible"):s(H,{hidden:()=>_(E),visible:()=>V(E)})}),[H,E,V,_,N,k]);let Q=S({enter:U(u),enterFrom:U(c),enterTo:U(d),entered:U(p),leave:U(h),leaveFrom:U(v),leaveTo:U(g)}),Y=function(e){let t=(0,r.useRef)(W(e));return(0,r.useEffect)((()=>{t.current=W(e)}),[e]),t}({beforeEnter:n,afterEnter:a,beforeLeave:l,afterLeave:i}),J=j();(0,r.useEffect)((()=>{if(J&&"visible"===H&&null===E.current)throw new Error("Did you forget to passthrough the `ref` to the actual DOM node?")}),[E,H,J]);let K=L&&!F,X=!J||K||G.current===N?"idle":N?"enter":"leave",ee=function(e=0){let[t,n]=(0,r.useState)(e),a=T(),l=(0,r.useCallback)((e=>{a.current&&n((t=>t|e))}),[t,a]),i=(0,r.useCallback)((e=>Boolean(t&e)),[t]),o=(0,r.useCallback)((e=>{a.current&&n((t=>t&~e))}),[n,a]),s=(0,r.useCallback)((e=>{a.current&&n((t=>t^e))}),[n]);return{flags:t,addFlag:l,hasFlag:i,removeFlag:o,toggleFlag:s}}(0),te=O((e=>s(e,{enter:()=>{ee.addFlag(w.Opening),Y.current.beforeEnter()},leave:()=>{ee.addFlag(w.Closing),Y.current.beforeLeave()},idle:()=>{}}))),ne=O((e=>s(e,{enter:()=>{ee.removeFlag(w.Opening),Y.current.afterEnter()},leave:()=>{ee.removeFlag(w.Closing),Y.current.afterLeave()},idle:()=>{}}))),re=D((()=>{z("hidden"),_(E)}),B);(function({container:e,direction:t,classes:n,onStart:r,onStop:a}){let l=T(),i=A(),o=S(t);C((()=>{let t=R();i.add(t.dispose);let s=e.current;if(s&&"idle"!==o.current&&l.current)return t.dispose(),r.current(o.current),t.add(M(s,n.current,"enter"===o.current,(()=>{t.dispose(),a.current(o.current)}))),t.dispose}),[t])})({container:E,classes:Q,direction:X,onStart:S((e=>{re.onStart(E,e,te)})),onStop:S((e=>{re.onStop(E,e,ne),"leave"===e&&!$(re)&&(z("hidden"),_(E))}))}),(0,r.useEffect)((()=>{K&&(k===m.Hidden?G.current=null:G.current=N)}),[N,K,H]);let ae=b,le={ref:y};return F&&N&&L&&(ae={...ae,className:o(b.className,...Q.current.enter,...Q.current.enterFrom)}),r.createElement(I.Provider,{value:re},r.createElement(x,{value:s(H,{visible:w.Open,hidden:w.Closed})|ee.flags},f({ourProps:le,theirProps:ae,defaultTag:"div",features:Z,visible:"visible"===H,name:"Transition.Child"})))})),Y=v((function(e,t){let n=null!==(0,r.useContext)(q),a=null!==y();return r.createElement(r.Fragment,null,!n&&a?r.createElement(G,{ref:t,...e}):r.createElement(Q,{ref:t,...e}))})),J=Object.assign(G,{Child:Y,Root:G});var K=n(4267);const X=()=>r.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",className:"h-10 w-10",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor"},r.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:"2",d:"M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"}));var ee=()=>{const e=(0,K.Z)((e=>e.hasSwUpdateReady));return r.createElement(J,{show:null!=e&&e,enter:"ease-out duration-300",enterFrom:"opacity-0",enterTo:"opacity-100",leave:"ease-in duration-200",leaveFrom:"opacity-100",leaveTo:"opacity-0"},r.createElement("div",{className:"bg-blue-500 px-4 pt-5 pb-4 sm:(p-6 pb-4)"},r.createElement("div",{className:"sm:(flex items-start)"},r.createElement("div",{className:"mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full sm:(mx-0 h-10 w-10)"},r.createElement(X,null)),r.createElement("div",{className:"mt-3 text-center sm:(mt-0 ml-4 text-left)"},r.createElement("h3",{className:"text-lg leading-6 font-medium text-black dark:text-white"},"Website update"),r.createElement("div",{className:"mt-2"},r.createElement("p",{className:"text-sm text-black dark:text-white"},"Our website has an update available. Please load the update to ensure the best possible experience."))),r.createElement("div",{className:"px-4 py-3 items-center justify-center sm:(px-6 flex flex-row-reverse)"},r.createElement("button",{onClick:()=>window.location.reload(!0),type:"button",className:"flex-1 rounded-md border border-transparent shadow-sm px-4 py-2 text-base text-white bg-gray-800 hover:bg-gray-900 sm:(ml-3 max-w-2xl text-sm)"},"Load")))))};const te=e=>{const{children:t,className:n}=e;return r.createElement("div",{className:"flex flex-col min-h-screen font-firacode "+(n||"")},r.createElement(ee,null),r.createElement(i,null),r.createElement("main",{className:"flex flex-col flex-1 w-full max-w-4xl px-4 py-8 mx-auto md:px-8"},t),r.createElement(l,null))};te.defaultProps={className:""};var ne=te},6826:function(e,t,n){var r=n(959),a=n(7133);const l=e=>{let{description:t,children:n,keywords:l,title:i,path:o}=e;const{site:s}=(0,a.useStaticQuery)("983108779"),{siteUrl:u}=s.siteMetadata,c={title:"Home"===i?s.siteMetadata.title:i+" | "+s.siteMetadata.title,description:t||s.siteMetadata.description,url:""+u+(o||""),keywords:l||[]};return r.createElement(r.Fragment,null,r.createElement("html",{lang:"en"}),r.createElement("title",null,c.title),r.createElement("meta",{name:"description",content:c.description}),r.createElement("meta",{name:"url",content:c.url}),r.createElement("meta",{name:"og:title",content:c.title}),r.createElement("meta",{name:"og:description",content:c.description}),r.createElement("meta",{name:"og:type",content:"website"}),r.createElement("meta",{name:"og:url",content:c.url}),r.createElement("meta",{name:"twitter:card",content:"summary"}),r.createElement("meta",{name:"twitter:creator",content:s.siteMetadata.author}),r.createElement("meta",{name:"twitter:title",content:c.title}),r.createElement("meta",{name:"twitter:url",content:c.url}),r.createElement("meta",{name:"twitter:description",content:c.description}),r.createElement("meta",{name:"keywords",content:["zanechua","homelab","zane j chua","tech geek"].join(", ")+c.keywords.join(", ")}),n)};l.defaultProps={description:"zanechua.com",keywords:[],path:"/"},t.Z=l}}]);
//# sourceMappingURL=e650ccae0dc8dde622026586afaeaf1c3bea3a11-f820eebe61d733c915be.js.map