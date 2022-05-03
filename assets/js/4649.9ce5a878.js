"use strict";(self.webpackChunkdevdocs=self.webpackChunkdevdocs||[]).push([[4649],{6054:function(e,t,n){n.d(t,{Z:function(){return K}});var r=n(7462),o=n(3366),i=n(7294),s=n.t(i,2),a=n(6010),l=n(7192),u=n(9348),c=n(4502),p=n(1705),d=n(9327),h=n(8791);var f=n(4578),m=n(220);function b(e,t){var n=Object.create(null);return e&&i.Children.map(e,(function(e){return e})).forEach((function(e){n[e.key]=function(e){return t&&(0,i.isValidElement)(e)?t(e):e}(e)})),n}function v(e,t,n){return null!=n[t]?n[t]:e.props[t]}function y(e,t,n){var r=b(e.children),o=function(e,t){function n(n){return n in t?t[n]:e[n]}e=e||{},t=t||{};var r,o=Object.create(null),i=[];for(var s in e)s in t?i.length&&(o[s]=i,i=[]):i.push(s);var a={};for(var l in t){if(o[l])for(r=0;r<o[l].length;r++){var u=o[l][r];a[o[l][r]]=n(u)}a[l]=n(l)}for(r=0;r<i.length;r++)a[i[r]]=n(i[r]);return a}(t,r);return Object.keys(o).forEach((function(s){var a=o[s];if((0,i.isValidElement)(a)){var l=s in t,u=s in r,c=t[s],p=(0,i.isValidElement)(c)&&!c.props.in;!u||l&&!p?u||!l||p?u&&l&&(0,i.isValidElement)(c)&&(o[s]=(0,i.cloneElement)(a,{onExited:n.bind(null,a),in:c.props.in,exit:v(a,"exit",e),enter:v(a,"enter",e)})):o[s]=(0,i.cloneElement)(a,{in:!1}):o[s]=(0,i.cloneElement)(a,{onExited:n.bind(null,a),in:!0,exit:v(a,"exit",e),enter:v(a,"enter",e)})}})),o}var g=Object.values||function(e){return Object.keys(e).map((function(t){return e[t]}))},x=function(e){function t(t,n){var r,o=(r=e.call(this,t,n)||this).handleExited.bind(function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}(r));return r.state={contextValue:{isMounting:!0},handleExited:o,firstRender:!0},r}(0,f.Z)(t,e);var n=t.prototype;return n.componentDidMount=function(){this.mounted=!0,this.setState({contextValue:{isMounting:!1}})},n.componentWillUnmount=function(){this.mounted=!1},t.getDerivedStateFromProps=function(e,t){var n,r,o=t.children,s=t.handleExited;return{children:t.firstRender?(n=e,r=s,b(n.children,(function(e){return(0,i.cloneElement)(e,{onExited:r.bind(null,e),in:!0,appear:v(e,"appear",n),enter:v(e,"enter",n),exit:v(e,"exit",n)})}))):y(e,o,s),firstRender:!1}},n.handleExited=function(e,t){var n=b(this.props.children);e.key in n||(e.props.onExited&&e.props.onExited(t),this.mounted&&this.setState((function(t){var n=(0,r.Z)({},t.children);return delete n[e.key],{children:n}})))},n.render=function(){var e=this.props,t=e.component,n=e.childFactory,r=(0,o.Z)(e,["component","childFactory"]),s=this.state.contextValue,a=g(this.state.children).map(n);return delete r.appear,delete r.enter,delete r.exit,null===t?i.createElement(m.Z.Provider,{value:s},a):i.createElement(m.Z.Provider,{value:s},i.createElement(t,r,a))},t}(i.Component);x.propTypes={},x.defaultProps={component:"div",childFactory:function(e){return e}};var R=x,Z=(n(8357),n(8679),n(3772));s.useInsertionEffect?s.useInsertionEffect:i.useLayoutEffect;function E(){for(var e=arguments.length,t=new Array(e),n=0;n<e;n++)t[n]=arguments[n];return(0,Z.O)(t)}var M=function(){var e=E.apply(void 0,arguments),t="animation-"+e.name;return{name:t,styles:"@keyframes "+t+"{"+e.styles+"}",anim:1,toString:function(){return"_EMO_"+this.name+"_"+this.styles+"_EMO_"}}};var k=n(5893);var P=function(e){const{className:t,classes:n,pulsate:r=!1,rippleX:o,rippleY:s,rippleSize:l,in:u,onExited:c,timeout:p}=e,[d,h]=i.useState(!1),f=(0,a.Z)(t,n.ripple,n.rippleVisible,r&&n.ripplePulsate),m={width:l,height:l,top:-l/2+s,left:-l/2+o},b=(0,a.Z)(n.child,d&&n.childLeaving,r&&n.childPulsate);return u||d||h(!0),i.useEffect((()=>{if(!u&&null!=c){const e=setTimeout(c,p);return()=>{clearTimeout(e)}}}),[c,u,p]),(0,k.jsx)("span",{className:f,style:m,children:(0,k.jsx)("span",{className:b})})},T=n(6087);var C=(0,T.Z)("MuiTouchRipple",["root","ripple","rippleVisible","ripplePulsate","child","childLeaving","childPulsate"]);const V=["center","classes","className"];let w,S,$,j,D=e=>e;const L=M(w||(w=D`
  0% {
    transform: scale(0);
    opacity: 0.1;
  }

  100% {
    transform: scale(1);
    opacity: 0.3;
  }
`)),B=M(S||(S=D`
  0% {
    opacity: 1;
  }

  100% {
    opacity: 0;
  }
`)),I=M($||($=D`
  0% {
    transform: scale(1);
  }

  50% {
    transform: scale(0.92);
  }

  100% {
    transform: scale(1);
  }
`)),N=(0,u.ZP)("span",{name:"MuiTouchRipple",slot:"Root"})({overflow:"hidden",pointerEvents:"none",position:"absolute",zIndex:0,top:0,right:0,bottom:0,left:0,borderRadius:"inherit"}),O=(0,u.ZP)(P,{name:"MuiTouchRipple",slot:"Ripple"})(j||(j=D`
  opacity: 0;
  position: absolute;

  &.${0} {
    opacity: 0.3;
    transform: scale(1);
    animation-name: ${0};
    animation-duration: ${0}ms;
    animation-timing-function: ${0};
  }

  &.${0} {
    animation-duration: ${0}ms;
  }

  & .${0} {
    opacity: 1;
    display: block;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: currentColor;
  }

  & .${0} {
    opacity: 0;
    animation-name: ${0};
    animation-duration: ${0}ms;
    animation-timing-function: ${0};
  }

  & .${0} {
    position: absolute;
    /* @noflip */
    left: 0px;
    top: 0;
    animation-name: ${0};
    animation-duration: 2500ms;
    animation-timing-function: ${0};
    animation-iteration-count: infinite;
    animation-delay: 200ms;
  }
`),C.rippleVisible,L,550,(({theme:e})=>e.transitions.easing.easeInOut),C.ripplePulsate,(({theme:e})=>e.transitions.duration.shorter),C.child,C.childLeaving,B,550,(({theme:e})=>e.transitions.easing.easeInOut),C.childPulsate,I,(({theme:e})=>e.transitions.easing.easeInOut));var F=i.forwardRef((function(e,t){const n=(0,c.Z)({props:e,name:"MuiTouchRipple"}),{center:s=!1,classes:l={},className:u}=n,p=(0,o.Z)(n,V),[d,h]=i.useState([]),f=i.useRef(0),m=i.useRef(null);i.useEffect((()=>{m.current&&(m.current(),m.current=null)}),[d]);const b=i.useRef(!1),v=i.useRef(null),y=i.useRef(null),g=i.useRef(null);i.useEffect((()=>()=>{clearTimeout(v.current)}),[]);const x=i.useCallback((e=>{const{pulsate:t,rippleX:n,rippleY:r,rippleSize:o,cb:i}=e;h((e=>[...e,(0,k.jsx)(O,{classes:{ripple:(0,a.Z)(l.ripple,C.ripple),rippleVisible:(0,a.Z)(l.rippleVisible,C.rippleVisible),ripplePulsate:(0,a.Z)(l.ripplePulsate,C.ripplePulsate),child:(0,a.Z)(l.child,C.child),childLeaving:(0,a.Z)(l.childLeaving,C.childLeaving),childPulsate:(0,a.Z)(l.childPulsate,C.childPulsate)},timeout:550,pulsate:t,rippleX:n,rippleY:r,rippleSize:o},f.current)])),f.current+=1,m.current=i}),[l]),Z=i.useCallback(((e={},t={},n)=>{const{pulsate:r=!1,center:o=s||t.pulsate,fakeElement:i=!1}=t;if("mousedown"===e.type&&b.current)return void(b.current=!1);"touchstart"===e.type&&(b.current=!0);const a=i?null:g.current,l=a?a.getBoundingClientRect():{width:0,height:0,left:0,top:0};let u,c,p;if(o||0===e.clientX&&0===e.clientY||!e.clientX&&!e.touches)u=Math.round(l.width/2),c=Math.round(l.height/2);else{const{clientX:t,clientY:n}=e.touches?e.touches[0]:e;u=Math.round(t-l.left),c=Math.round(n-l.top)}if(o)p=Math.sqrt((2*l.width**2+l.height**2)/3),p%2==0&&(p+=1);else{const e=2*Math.max(Math.abs((a?a.clientWidth:0)-u),u)+2,t=2*Math.max(Math.abs((a?a.clientHeight:0)-c),c)+2;p=Math.sqrt(e**2+t**2)}e.touches?null===y.current&&(y.current=()=>{x({pulsate:r,rippleX:u,rippleY:c,rippleSize:p,cb:n})},v.current=setTimeout((()=>{y.current&&(y.current(),y.current=null)}),80)):x({pulsate:r,rippleX:u,rippleY:c,rippleSize:p,cb:n})}),[s,x]),E=i.useCallback((()=>{Z({},{pulsate:!0})}),[Z]),M=i.useCallback(((e,t)=>{if(clearTimeout(v.current),"touchend"===e.type&&y.current)return y.current(),y.current=null,void(v.current=setTimeout((()=>{M(e,t)})));y.current=null,h((e=>e.length>0?e.slice(1):e)),m.current=t}),[]);return i.useImperativeHandle(t,(()=>({pulsate:E,start:Z,stop:M})),[E,Z,M]),(0,k.jsx)(N,(0,r.Z)({className:(0,a.Z)(l.root,C.root,u),ref:g},p,{children:(0,k.jsx)(R,{component:null,exit:!0,children:d})}))})),z=n(8979);function A(e){return(0,z.Z)("MuiButtonBase",e)}var X=(0,T.Z)("MuiButtonBase",["root","disabled","focusVisible"]);const U=["action","centerRipple","children","className","component","disabled","disableRipple","disableTouchRipple","focusRipple","focusVisibleClassName","LinkComponent","onBlur","onClick","onContextMenu","onDragLeave","onFocus","onFocusVisible","onKeyDown","onKeyUp","onMouseDown","onMouseLeave","onMouseUp","onTouchEnd","onTouchMove","onTouchStart","tabIndex","TouchRippleProps","touchRippleRef","type"],Y=(0,u.ZP)("button",{name:"MuiButtonBase",slot:"Root",overridesResolver:(e,t)=>t.root})({display:"inline-flex",alignItems:"center",justifyContent:"center",position:"relative",boxSizing:"border-box",WebkitTapHighlightColor:"transparent",backgroundColor:"transparent",outline:0,border:0,margin:0,borderRadius:0,padding:0,cursor:"pointer",userSelect:"none",verticalAlign:"middle",MozAppearance:"none",WebkitAppearance:"none",textDecoration:"none",color:"inherit","&::-moz-focus-inner":{borderStyle:"none"},[`&.${X.disabled}`]:{pointerEvents:"none",cursor:"default"},"@media print":{colorAdjust:"exact"}});var K=i.forwardRef((function(e,t){const n=(0,c.Z)({props:e,name:"MuiButtonBase"}),{action:s,centerRipple:u=!1,children:f,className:m,component:b="button",disabled:v=!1,disableRipple:y=!1,disableTouchRipple:g=!1,focusRipple:x=!1,LinkComponent:R="a",onBlur:Z,onClick:E,onContextMenu:M,onDragLeave:P,onFocus:T,onFocusVisible:C,onKeyDown:V,onKeyUp:w,onMouseDown:S,onMouseLeave:$,onMouseUp:j,onTouchEnd:D,onTouchMove:L,onTouchStart:B,tabIndex:I=0,TouchRippleProps:N,touchRippleRef:O,type:z}=n,X=(0,o.Z)(n,U),K=i.useRef(null),_=i.useRef(null),H=(0,p.Z)(_,O),{isFocusVisibleRef:W,onFocus:q,onBlur:G,ref:J}=(0,h.Z)(),[Q,ee]=i.useState(!1);v&&Q&&ee(!1),i.useImperativeHandle(s,(()=>({focusVisible:()=>{ee(!0),K.current.focus()}})),[]);const[te,ne]=i.useState(!1);i.useEffect((()=>{ne(!0)}),[]);const re=te&&!y&&!v;function oe(e,t,n=g){return(0,d.Z)((r=>{t&&t(r);return!n&&_.current&&_.current[e](r),!0}))}i.useEffect((()=>{Q&&x&&!y&&te&&_.current.pulsate()}),[y,x,Q,te]);const ie=oe("start",S),se=oe("stop",M),ae=oe("stop",P),le=oe("stop",j),ue=oe("stop",(e=>{Q&&e.preventDefault(),$&&$(e)})),ce=oe("start",B),pe=oe("stop",D),de=oe("stop",L),he=oe("stop",(e=>{G(e),!1===W.current&&ee(!1),Z&&Z(e)}),!1),fe=(0,d.Z)((e=>{K.current||(K.current=e.currentTarget),q(e),!0===W.current&&(ee(!0),C&&C(e)),T&&T(e)})),me=()=>{const e=K.current;return b&&"button"!==b&&!("A"===e.tagName&&e.href)},be=i.useRef(!1),ve=(0,d.Z)((e=>{x&&!be.current&&Q&&_.current&&" "===e.key&&(be.current=!0,_.current.stop(e,(()=>{_.current.start(e)}))),e.target===e.currentTarget&&me()&&" "===e.key&&e.preventDefault(),V&&V(e),e.target===e.currentTarget&&me()&&"Enter"===e.key&&!v&&(e.preventDefault(),E&&E(e))})),ye=(0,d.Z)((e=>{x&&" "===e.key&&_.current&&Q&&!e.defaultPrevented&&(be.current=!1,_.current.stop(e,(()=>{_.current.pulsate(e)}))),w&&w(e),E&&e.target===e.currentTarget&&me()&&" "===e.key&&!e.defaultPrevented&&E(e)}));let ge=b;"button"===ge&&(X.href||X.to)&&(ge=R);const xe={};"button"===ge?(xe.type=void 0===z?"button":z,xe.disabled=v):(X.href||X.to||(xe.role="button"),v&&(xe["aria-disabled"]=v));const Re=(0,p.Z)(J,K),Ze=(0,p.Z)(t,Re);const Ee=(0,r.Z)({},n,{centerRipple:u,component:b,disabled:v,disableRipple:y,disableTouchRipple:g,focusRipple:x,tabIndex:I,focusVisible:Q}),Me=(e=>{const{disabled:t,focusVisible:n,focusVisibleClassName:r,classes:o}=e,i={root:["root",t&&"disabled",n&&"focusVisible"]},s=(0,l.Z)(i,A,o);return n&&r&&(s.root+=` ${r}`),s})(Ee);return(0,k.jsxs)(Y,(0,r.Z)({as:ge,className:(0,a.Z)(Me.root,m),ownerState:Ee,onBlur:he,onClick:E,onContextMenu:se,onFocus:fe,onKeyDown:ve,onKeyUp:ye,onMouseDown:ie,onMouseLeave:ue,onMouseUp:le,onDragLeave:ae,onTouchEnd:pe,onTouchMove:de,onTouchStart:ce,ref:Ze,tabIndex:v?-1:I,type:z},xe,X,{children:[f,re?(0,k.jsx)(F,(0,r.Z)({ref:H,center:u},N)):null]}))}))},9707:function(e,t,n){n.d(t,{Z:function(){return l}});var r=n(7462),o=n(3366),i=n(9766),s=n(8528);const a=["sx"];function l(e){const{sx:t}=e,n=(0,o.Z)(e,a),{systemProps:l,otherProps:u}=(e=>{const t={systemProps:{},otherProps:{}};return Object.keys(e).forEach((n=>{s.Gc[n]?t.systemProps[n]=e[n]:t.otherProps[n]=e[n]})),t})(n);let c;return c=Array.isArray(t)?[l,...t]:"function"==typeof t?(...e)=>{const n=t(...e);return(0,i.P)(n)?(0,r.Z)({},l,n):l}:(0,r.Z)({},l,t),(0,r.Z)({},u,{sx:c})}}}]);