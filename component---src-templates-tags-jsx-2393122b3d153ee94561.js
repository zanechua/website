"use strict";(self.webpackChunkzanechua_dot_com=self.webpackChunkzanechua_dot_com||[]).push([[575],{2433:function(e,t,a){var l=a(5919),n=a.n(l),r=a(959),o=a(7133),c=a(1826),s=a(2411);t.Z=e=>{let{post:t}=e;const a=(0,c.d)(t.frontmatter.featuredImage),{tags:l}=t.frontmatter;return r.createElement("div",{className:"w-full lg:flex py-4"},r.createElement(o.Link,{to:t.fields.urlPath,className:"block h-56 lg:w-64 lg:h-auto flex-none bg-cover rounded-t lg:rounded-t-none lg:rounded-l text-center overflow-hidden",style:{backgroundImage:"url("+a+")",backgroundPosition:"center center"},title:t.frontmatter.title}),r.createElement("div",{className:"flex-1 border-r border-b border-l border-gray-800 lg:border-l-0 lg:border-t lg:border-gray-700 rounded-b lg:rounded-b-none lg:rounded-r p-4 flex flex-col justify-between leading-normal bg-gray-800"},r.createElement(o.Link,{to:t.fields.urlPath},r.createElement("div",{className:"mb-8"},r.createElement("div",{className:"text-white font-bold text-xl mb-2 text-left"},t.frontmatter.title),r.createElement("p",{className:"text-white text-base text-left"},t.excerpt))),r.createElement("div",{className:"flex flex-row"},r.createElement("div",{className:"flex pr-2 text-sm"},r.createElement("p",{className:"text-white"},t.frontmatter.date)),r.createElement("div",{className:"flex-1 ml-auto text-right"},null!==l&&l.map((e=>r.createElement(s.Z,{key:n()(e)+"-post-"+t.frontmatter.slug,tag:e})))))))}},8015:function(e,t,a){a.r(t);var l=a(959),n=a(7133),r=a(2069),o=a(2433),c=a(6826);t.default=e=>{let{pageContext:t,data:a,location:s}=e;const{tag:m}=t,{edges:d,totalCount:i}=a.allMarkdownRemark,f=d.filter((e=>!!e.node.frontmatter.date)).map((e=>l.createElement(o.Z,{key:e.node.id,post:e.node})));return l.createElement(r.Z,null,l.createElement(c.Z,{keywords:["zanechua","homelab","zane j chua","tech geek"],title:"Tags",path:s.pathname}),l.createElement("section",null,l.createElement("div",{className:"flex flex-row justify-center items-center"},l.createElement("div",{className:"flex-1"},l.createElement("h1",{className:"text-2xl font-bold"},i," Post(s) with"," ",l.createElement("span",{className:"inline-flex items-center justify-center px-2 py-1 font-bold leading-none text-white bg-blue-500 rounded"},m)," ","tag")),l.createElement("div",{className:"flex-1 ml-auto text-right"},l.createElement(n.Link,{to:"/tags",className:"font-bold"},"All Tags"))),l.createElement("div",{className:"items-center"},f)))}}}]);
//# sourceMappingURL=component---src-templates-tags-jsx-2393122b3d153ee94561.js.map