"use strict";(self.webpackChunkdevdocs=self.webpackChunkdevdocs||[]).push([[29349],{28442:function(e,t){t.Z=function(e){return"string"==typeof e}},15788:function(e,t,n){n.d(t,{Z:function(){return K}});var r=n(83117),o=n(80102),i=n(67294),s=n.t(i,2),a=n(86010),u=n(27192),l=n(69348),c=n(54502),p=n(51705),d=n(9327),f=n(18791);var h=n(21073),m=n(220);function b(e,t){var n=Object.create(null);return e&&i.Children.map(e,(function(e){return e})).forEach((function(e){n[e.key]=function(e){return t&&(0,i.isValidElement)(e)?t(e):e}(e)})),n}function v(e,t,n){return null!=n[t]?n[t]:e.props[t]}function y(e,t,n){var r=b(e.children),o=function(e,t){function n(n){return n in t?t[n]:e[n]}e=e||{},t=t||{};var r,o=Object.create(null),i=[];for(var s in e)s in t?i.length&&(o[s]=i,i=[]):i.push(s);var a={};for(var u in t){if(o[u])for(r=0;r<o[u].length;r++){var l=o[u][r];a[o[u][r]]=n(l)}a[u]=n(u)}for(r=0;r<i.length;r++)a[i[r]]=n(i[r]);return a}(t,r);return Object.keys(o).forEach((function(s){var a=o[s];if((0,i.isValidElement)(a)){var u=s in t,l=s in r,c=t[s],p=(0,i.isValidElement)(c)&&!c.props.in;!l||u&&!p?l||!u||p?l&&u&&(0,i.isValidElement)(c)&&(o[s]=(0,i.cloneElement)(a,{onExited:n.bind(null,a),in:c.props.in,exit:v(a,"exit",e),enter:v(a,"enter",e)})):o[s]=(0,i.cloneElement)(a,{in:!1}):o[s]=(0,i.cloneElement)(a,{onExited:n.bind(null,a),in:!0,exit:v(a,"exit",e),enter:v(a,"enter",e)})}})),o}var g=Object.values||function(e){return Object.keys(e).map((function(t){return e[t]}))},x=function(e){function t(t,n){var r,o=(r=e.call(this,t,n)||this).handleExited.bind(function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}(r));return r.state={contextValue:{isMounting:!0},handleExited:o,firstRender:!0},r}(0,h.Z)(t,e);var n=t.prototype;return n.componentDidMount=function(){this.mounted=!0,this.setState({contextValue:{isMounting:!1}})},n.componentWillUnmount=function(){this.mounted=!1},t.getDerivedStateFromProps=function(e,t){var n,r,o=t.children,s=t.handleExited;return{children:t.firstRender?(n=e,r=s,b(n.children,(function(e){return(0,i.cloneElement)(e,{onExited:r.bind(null,e),in:!0,appear:v(e,"appear",n),enter:v(e,"enter",n),exit:v(e,"exit",n)})}))):y(e,o,s),firstRender:!1}},n.handleExited=function(e,t){var n=b(this.props.children);e.key in n||(e.props.onExited&&e.props.onExited(t),this.mounted&&this.setState((function(t){var n=(0,r.Z)({},t.children);return delete n[e.key],{children:n}})))},n.render=function(){var e=this.props,t=e.component,n=e.childFactory,r=(0,o.Z)(e,["component","childFactory"]),s=this.state.contextValue,a=g(this.state.children).map(n);return delete r.appear,delete r.enter,delete r.exit,null===t?i.createElement(m.Z.Provider,{value:s},a):i.createElement(m.Z.Provider,{value:s},i.createElement(t,r,a))},t}(i.Component);x.propTypes={},x.defaultProps={component:"div",childFactory:function(e){return e}};var Z=x,R=(n(68357),n(8679),n(73772));s.useInsertionEffect?s.useInsertionEffect:i.useLayoutEffect;function E(){for(var e=arguments.length,t=new Array(e),n=0;n<e;n++)t[n]=arguments[n];return(0,R.O)(t)}var M=function(){var e=E.apply(void 0,arguments),t="animation-"+e.name;return{name:t,styles:"@keyframes "+t+"{"+e.styles+"}",anim:1,toString:function(){return"_EMO_"+this.name+"_"+this.styles+"_EMO_"}}};var k=n(85893);var P=function(e){const{className:t,classes:n,pulsate:r=!1,rippleX:o,rippleY:s,rippleSize:u,in:l,onExited:c,timeout:p}=e,[d,f]=i.useState(!1),h=(0,a.Z)(t,n.ripple,n.rippleVisible,r&&n.ripplePulsate),m={width:u,height:u,top:-u/2+s,left:-u/2+o},b=(0,a.Z)(n.child,d&&n.childLeaving,r&&n.childPulsate);return l||d||f(!0),i.useEffect((()=>{if(!l&&null!=c){const e=setTimeout(c,p);return()=>{clearTimeout(e)}}}),[c,l,p]),(0,k.jsx)("span",{className:h,style:m,children:(0,k.jsx)("span",{className:b})})},T=n(76087);var C=(0,T.Z)("MuiTouchRipple",["root","ripple","rippleVisible","ripplePulsate","child","childLeaving","childPulsate"]);const V=["center","classes","className"];let w,S,$,j,D=e=>e;const L=M(w||(w=D`
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
`)),N=(0,l.ZP)("span",{name:"MuiTouchRipple",slot:"Root"})({overflow:"hidden",pointerEvents:"none",position:"absolute",zIndex:0,top:0,right:0,bottom:0,left:0,borderRadius:"inherit"}),O=(0,l.ZP)(P,{name:"MuiTouchRipple",slot:"Ripple"})(j||(j=D`
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
`),C.rippleVisible,L,550,(({theme:e})=>e.transitions.easing.easeInOut),C.ripplePulsate,(({theme:e})=>e.transitions.duration.shorter),C.child,C.childLeaving,B,550,(({theme:e})=>e.transitions.easing.easeInOut),C.childPulsate,I,(({theme:e})=>e.transitions.easing.easeInOut));var F=i.forwardRef((function(e,t){const n=(0,c.Z)({props:e,name:"MuiTouchRipple"}),{center:s=!1,classes:u={},className:l}=n,p=(0,o.Z)(n,V),[d,f]=i.useState([]),h=i.useRef(0),m=i.useRef(null);i.useEffect((()=>{m.current&&(m.current(),m.current=null)}),[d]);const b=i.useRef(!1),v=i.useRef(null),y=i.useRef(null),g=i.useRef(null);i.useEffect((()=>()=>{clearTimeout(v.current)}),[]);const x=i.useCallback((e=>{const{pulsate:t,rippleX:n,rippleY:r,rippleSize:o,cb:i}=e;f((e=>[...e,(0,k.jsx)(O,{classes:{ripple:(0,a.Z)(u.ripple,C.ripple),rippleVisible:(0,a.Z)(u.rippleVisible,C.rippleVisible),ripplePulsate:(0,a.Z)(u.ripplePulsate,C.ripplePulsate),child:(0,a.Z)(u.child,C.child),childLeaving:(0,a.Z)(u.childLeaving,C.childLeaving),childPulsate:(0,a.Z)(u.childPulsate,C.childPulsate)},timeout:550,pulsate:t,rippleX:n,rippleY:r,rippleSize:o},h.current)])),h.current+=1,m.current=i}),[u]),R=i.useCallback(((e={},t={},n)=>{const{pulsate:r=!1,center:o=s||t.pulsate,fakeElement:i=!1}=t;if("mousedown"===e.type&&b.current)return void(b.current=!1);"touchstart"===e.type&&(b.current=!0);const a=i?null:g.current,u=a?a.getBoundingClientRect():{width:0,height:0,left:0,top:0};let l,c,p;if(o||0===e.clientX&&0===e.clientY||!e.clientX&&!e.touches)l=Math.round(u.width/2),c=Math.round(u.height/2);else{const{clientX:t,clientY:n}=e.touches?e.touches[0]:e;l=Math.round(t-u.left),c=Math.round(n-u.top)}if(o)p=Math.sqrt((2*u.width**2+u.height**2)/3),p%2==0&&(p+=1);else{const e=2*Math.max(Math.abs((a?a.clientWidth:0)-l),l)+2,t=2*Math.max(Math.abs((a?a.clientHeight:0)-c),c)+2;p=Math.sqrt(e**2+t**2)}e.touches?null===y.current&&(y.current=()=>{x({pulsate:r,rippleX:l,rippleY:c,rippleSize:p,cb:n})},v.current=setTimeout((()=>{y.current&&(y.current(),y.current=null)}),80)):x({pulsate:r,rippleX:l,rippleY:c,rippleSize:p,cb:n})}),[s,x]),E=i.useCallback((()=>{R({},{pulsate:!0})}),[R]),M=i.useCallback(((e,t)=>{if(clearTimeout(v.current),"touchend"===e.type&&y.current)return y.current(),y.current=null,void(v.current=setTimeout((()=>{M(e,t)})));y.current=null,f((e=>e.length>0?e.slice(1):e)),m.current=t}),[]);return i.useImperativeHandle(t,(()=>({pulsate:E,start:R,stop:M})),[E,R,M]),(0,k.jsx)(N,(0,r.Z)({className:(0,a.Z)(u.root,C.root,l),ref:g},p,{children:(0,k.jsx)(Z,{component:null,exit:!0,children:d})}))})),z=n(28979);function A(e){return(0,z.Z)("MuiButtonBase",e)}var X=(0,T.Z)("MuiButtonBase",["root","disabled","focusVisible"]);const U=["action","centerRipple","children","className","component","disabled","disableRipple","disableTouchRipple","focusRipple","focusVisibleClassName","LinkComponent","onBlur","onClick","onContextMenu","onDragLeave","onFocus","onFocusVisible","onKeyDown","onKeyUp","onMouseDown","onMouseLeave","onMouseUp","onTouchEnd","onTouchMove","onTouchStart","tabIndex","TouchRippleProps","touchRippleRef","type"],Y=(0,l.ZP)("button",{name:"MuiButtonBase",slot:"Root",overridesResolver:(e,t)=>t.root})({display:"inline-flex",alignItems:"center",justifyContent:"center",position:"relative",boxSizing:"border-box",WebkitTapHighlightColor:"transparent",backgroundColor:"transparent",outline:0,border:0,margin:0,borderRadius:0,padding:0,cursor:"pointer",userSelect:"none",verticalAlign:"middle",MozAppearance:"none",WebkitAppearance:"none",textDecoration:"none",color:"inherit","&::-moz-focus-inner":{borderStyle:"none"},[`&.${X.disabled}`]:{pointerEvents:"none",cursor:"default"},"@media print":{colorAdjust:"exact"}});var K=i.forwardRef((function(e,t){const n=(0,c.Z)({props:e,name:"MuiButtonBase"}),{action:s,centerRipple:l=!1,children:h,className:m,component:b="button",disabled:v=!1,disableRipple:y=!1,disableTouchRipple:g=!1,focusRipple:x=!1,LinkComponent:Z="a",onBlur:R,onClick:E,onContextMenu:M,onDragLeave:P,onFocus:T,onFocusVisible:C,onKeyDown:V,onKeyUp:w,onMouseDown:S,onMouseLeave:$,onMouseUp:j,onTouchEnd:D,onTouchMove:L,onTouchStart:B,tabIndex:I=0,TouchRippleProps:N,touchRippleRef:O,type:z}=n,X=(0,o.Z)(n,U),K=i.useRef(null),_=i.useRef(null),H=(0,p.Z)(_,O),{isFocusVisibleRef:W,onFocus:q,onBlur:G,ref:J}=(0,f.Z)(),[Q,ee]=i.useState(!1);v&&Q&&ee(!1),i.useImperativeHandle(s,(()=>({focusVisible:()=>{ee(!0),K.current.focus()}})),[]);const[te,ne]=i.useState(!1);i.useEffect((()=>{ne(!0)}),[]);const re=te&&!y&&!v;function oe(e,t,n=g){return(0,d.Z)((r=>{t&&t(r);return!n&&_.current&&_.current[e](r),!0}))}i.useEffect((()=>{Q&&x&&!y&&te&&_.current.pulsate()}),[y,x,Q,te]);const ie=oe("start",S),se=oe("stop",M),ae=oe("stop",P),ue=oe("stop",j),le=oe("stop",(e=>{Q&&e.preventDefault(),$&&$(e)})),ce=oe("start",B),pe=oe("stop",D),de=oe("stop",L),fe=oe("stop",(e=>{G(e),!1===W.current&&ee(!1),R&&R(e)}),!1),he=(0,d.Z)((e=>{K.current||(K.current=e.currentTarget),q(e),!0===W.current&&(ee(!0),C&&C(e)),T&&T(e)})),me=()=>{const e=K.current;return b&&"button"!==b&&!("A"===e.tagName&&e.href)},be=i.useRef(!1),ve=(0,d.Z)((e=>{x&&!be.current&&Q&&_.current&&" "===e.key&&(be.current=!0,_.current.stop(e,(()=>{_.current.start(e)}))),e.target===e.currentTarget&&me()&&" "===e.key&&e.preventDefault(),V&&V(e),e.target===e.currentTarget&&me()&&"Enter"===e.key&&!v&&(e.preventDefault(),E&&E(e))})),ye=(0,d.Z)((e=>{x&&" "===e.key&&_.current&&Q&&!e.defaultPrevented&&(be.current=!1,_.current.stop(e,(()=>{_.current.pulsate(e)}))),w&&w(e),E&&e.target===e.currentTarget&&me()&&" "===e.key&&!e.defaultPrevented&&E(e)}));let ge=b;"button"===ge&&(X.href||X.to)&&(ge=Z);const xe={};"button"===ge?(xe.type=void 0===z?"button":z,xe.disabled=v):(X.href||X.to||(xe.role="button"),v&&(xe["aria-disabled"]=v));const Ze=(0,p.Z)(J,K),Re=(0,p.Z)(t,Ze);const Ee=(0,r.Z)({},n,{centerRipple:l,component:b,disabled:v,disableRipple:y,disableTouchRipple:g,focusRipple:x,tabIndex:I,focusVisible:Q}),Me=(e=>{const{disabled:t,focusVisible:n,focusVisibleClassName:r,classes:o}=e,i={root:["root",t&&"disabled",n&&"focusVisible"]},s=(0,u.Z)(i,A,o);return n&&r&&(s.root+=` ${r}`),s})(Ee);return(0,k.jsxs)(Y,(0,r.Z)({as:ge,className:(0,a.Z)(Me.root,m),ownerState:Ee,onBlur:fe,onClick:E,onContextMenu:se,onFocus:he,onKeyDown:ve,onKeyUp:ye,onMouseDown:ie,onMouseLeave:le,onMouseUp:ue,onDragLeave:ae,onTouchEnd:pe,onTouchMove:de,onTouchStart:ce,ref:Re,tabIndex:v?-1:I,type:z},xe,X,{children:[h,re?(0,k.jsx)(F,(0,r.Z)({ref:H,center:l},N)):null]}))}))},39707:function(e,t,n){n.d(t,{Z:function(){return u}});var r=n(83117),o=n(80102),i=n(59766),s=n(48528);const a=["sx"];function u(e){const{sx:t}=e,n=(0,o.Z)(e,a),{systemProps:u,otherProps:l}=(e=>{const t={systemProps:{},otherProps:{}};return Object.keys(e).forEach((n=>{s.Gc[n]?t.systemProps[n]=e[n]:t.otherProps[n]=e[n]})),t})(n);let c;return c=Array.isArray(t)?[u,...t]:"function"==typeof t?(...e)=>{const n=t(...e);return(0,i.P)(n)?(0,r.Z)({},u,n):u}:(0,r.Z)({},u,t),(0,r.Z)({},l,{sx:c})}},220:function(e,t,n){var r=n(67294);t.Z=r.createContext(null)}}]);