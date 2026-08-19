// Mobile embed boot — only init below 480px (wrapper is fixed full-viewport via CSS)
var w=document.getElementById('falwrap_falmobile01');if(!w)return;
var mq=window.matchMedia('(max-width:479px)');
function fitSvg(){var s=w.firstElementChild;if(!s)return;s.setAttribute('preserveAspectRatio','xMidYMid slice');s.style.width='100%';s.style.height='100%';s.style.maxWidth='none';}
function mount(){if(!mq.matches)return;FalGlitchDustWebflow.mountEmbed('falwrap_falmobile01','faldata_falmobile01');fitSvg();}
function onMq(){if(mq.matches)mount();else w.innerHTML='';}
if(mq.matches)mount();
if(mq.addEventListener)mq.addEventListener('change',onMq);else mq.addListener(onMq);
