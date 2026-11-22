/* ============================================================
   Dearest yao — interaction layer
   pure vanilla JS / no dependencies
   ============================================================ */
(function(){
'use strict';

/* ---------------- config ---------------- */
var CFG = {
  name:'yao',
  fullName:'陆星瑶',
  writer:'王依然',
  passcode:'1112',
  birth:'2004.11.12',
  age:22,
  goal:7,
  photos:42,
  cardPhotos:['assets/photos/p05.jpg','assets/photos/p12.jpg','assets/photos/p36.jpg','assets/photos/p39.jpg'],
  captions:[
    '18岁生日快乐','还记得我当时哭的好丢人…','那天阳光很好','课间十分钟','小皇冠','五个人的教室',
    '宿舍的灯','喵','这个特效好好看哈哈哈','两个汉堡','黑胶一样的我们','小鸟飞过头顶',
    '宿舍合照1','逃课的晚上','FALL','放学吃串串～','和你聊天我也很幸福','镜子里的两个人',
    "It's a secret that I love u",'梦里的本初子午线。。','特别幸运遇到你','video call！','我爱你们呀',
    '宿舍合照2','一鹿彤行','好萌的你们','比个耶','好想再去大吃一口！','很萌的一张呀','回到长沙…',
    '震撼美味！','汽水和桌游','在上海地铁～','一起来的外滩','井拍的雷霆照片1','外滩的风',
    '三个冰淇淋','写在纸上','井拍的雷霆照片2','笑起来咋都这么萌！','镜子里的我们','一颗一颗拼起来'
  ],
  /* the real letter — from 王依然, 2026.11.10 */
  letter:[
    '生日快乐～',
    '马上就要 22 岁了，我竟然还有一些紧张。',
    '「我一点也没做好二十岁的准备，挺纳闷的，就像谁从背后推给我一样。」20、21、22，似乎没有人在这些时候真的不会感到焦虑和迷茫。',
    '你决定去深圳，大概也是下了很大决心吧。现在想想，深圳和你带给我的感觉很像——开放、包容，好像总有一股往前闯、往新处出发的劲头，而且就之前去深圳的来看，那里骑电动车颇有种你的架势哈哈哈。所以我觉得，你去深圳一定会是一个很好的选择。',
    '下次见面，我就要好好拜见一个职场精英了哈哈。一个人去到一座陌生的城市，利落地把自己安顿下来，简直是大女主！真的很棒！',
    '我们好像从高一住进一个寝室那天，就一直在用各自的方式往不同的方向跑。我们好像经常会隔着大半个中国，不过我还是很经常想你。',
    '有时候我会想到你梦里的各种计划，想到那天晚上逃掉补习，在学校楼顶偷偷玩手机，想到每个晚自习都特别吵闹、最后还要和别人道歉，好搞笑。想回到你的电动车后座，在马路上跑，吹风，淋雨，什么也不用想。',
    '但是回不去，也不必回去。你往前大步走的样子，比想象的还要稳更坚定。',
    '这次生日没办法来陪你，不要太怪我 🥺，我的实力目前还跟不上我的心意。过几天我也要开始实习攒钱了！最近学了一点 AI，就给你做了一个小小的网站，可能还会有点粗糙草率啊啊。',
    '给你写信真的需要勇气！也不知道我在胡言乱语些什么，语言如此匮乏之人……所以想想还会有点心疼你，只能看到这样的文字。而我，每次看到你写的都会想要珍藏的程度！',
    '祝你有一个特别精彩的 22 岁，一定可以成为你想成为的人，开启你独一无二的人生。要好好吃饭、好好休息、好好生活。在深圳有风，有光，也有退路。累的时候，做回那个在高中跟我抢零食的女孩吧。'
  ]
};

var SPARK = '<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M50 0 C53 30 70 47 100 50 C70 53 53 70 50 100 C47 70 30 53 0 50 C30 47 47 30 50 0Z"/></svg>';
var KEY = 'dearest-yao-v1';

/* ---------------- state ---------------- */
var state = load();
function load(){
  var base = {best:{stars:0,cards:0,candles:0},badges:{},egg:false,opened:false};
  try{ var raw = localStorage.getItem(KEY); if(raw){ var o=JSON.parse(raw); return {
    best:Object.assign({},base.best,o.best||{}),
    badges:Object.assign({},base.badges,o.badges||{}),
    egg:!!o.egg, opened:!!o.opened }; } }catch(e){}
  return base;
}
function save(){ try{ localStorage.setItem(KEY,JSON.stringify(state)); }catch(e){} }
function totalStars(){
  var n=0; for(var k in state.best) n+=state.best[k];
  if(state.egg) n+=1;
  return n;
}
function isUnlocked(){ return totalStars()>=CFG.goal; }

var params = new URLSearchParams(location.search);
/* static snapshot mode — also a safe fallback for reduced-motion / slow devices */
if(params.get('static')==='1') document.documentElement.classList.add('no-anim');
if(params.get('dream')==='all'){
  state.best={stars:3,cards:3,candles:3}; state.egg=true; state.opened=true;
  ['combo','perfect','wish','egg'].forEach(function(b){ state.badges[b]=true; });
  save();
}

/* ---------------- helpers ---------------- */
function $(id){
  var el=document.getElementById(id);
  if(el) return el;
  try{ return document.querySelector(id); }catch(e){ return null; }
}
function $$(sel,root){ return Array.prototype.slice.call((root||document).querySelectorAll(sel)); }
function clamp(v,a,b){ return Math.max(a,Math.min(b,v)); }
function rand(a,b){ return a+Math.random()*(b-a); }
function shuffle(arr){ for(var i=arr.length-1;i>0;i--){ var j=Math.floor(Math.random()*(i+1)); var t=arr[i];arr[i]=arr[j];arr[j]=t; } return arr; }

var toastTimer;
function toast(msg){
  var t=$('toast'); t.textContent=msg; t.classList.add('show');
  clearTimeout(toastTimer); toastTimer=setTimeout(function(){ t.classList.remove('show'); },2300);
}

/* tiny synthesized sound, off by default */
var audioOn=false, audioCtx=null;
function beep(freq,dur,type,vol){
  if(!audioOn) return;
  try{
    audioCtx = audioCtx || new (window.AudioContext||window.webkitAudioContext)();
    var o=audioCtx.createOscillator(), g=audioCtx.createGain();
    o.type=type||'sine'; o.frequency.value=freq;
    g.gain.setValueAtTime(0,audioCtx.currentTime);
    g.gain.linearRampToValueAtTime(vol||.06,audioCtx.currentTime+.012);
    g.gain.exponentialRampToValueAtTime(.0001,audioCtx.currentTime+(dur||.16));
    o.connect(g); g.connect(audioCtx.destination); o.start(); o.stop(audioCtx.currentTime+(dur||.16)+.02);
  }catch(e){}
}
$('sound-toggle').addEventListener('click',function(){
  audioOn=!audioOn; this.classList.toggle('on',audioOn); this.textContent=audioOn?'♫':'♪';
  toast(audioOn?'音效已打开':'音效已静音'); if(audioOn) beep(660,.12,'sine',.05);
});

/* ---------------- screen router ---------------- */
var current='intro';
function show(id){
  if(current===id) return;
  /* leaving a page stops its work: the star timer, the wall video, etc. */
  if(current==='stars') stopStars();
  if(current==='wall') pauseWallVideo();
  $$('.screen').forEach(function(s){ s.classList.toggle('active',s.id===id); });
  current=id;
  window.scrollTo(0,0);
  var scr=$('.screen.active'); if(scr) scr.scrollTop=0;
  if(id==='hub') renderHub();
  if(id==='wall'){ buildWall(); playWallVideo(); }
  if(id==='finale') enterFinale();
  if(id==='stars') resetStars();
  if(id==='cards') resetCards();
  if(id==='candles') resetCandles();
}
$$('[data-back]').forEach(function(b){ b.addEventListener('click',function(){ show('hub'); }); });
document.addEventListener('click',function(e){
  var b=e.target && e.target.closest && e.target.closest('[data-to-letter]');
  if(b){ show('finale'); beep(620,.14,'sine',.05); }
});
$$('[data-go]').forEach(function(b){ b.addEventListener('click',function(){
  var dest=b.getAttribute('data-go');
  if(dest==='egg'){ doEgg(); return; }
  if(dest==='finale' && !isUnlocked()){
    toast('还差 '+(CFG.goal-totalStars())+' 颗星星 ✳'); beep(220,.16,'triangle',.04); return;
  }
  show(dest); beep(520,.1,'sine',.04);
}); });

/* ---------------- HUB ---------------- */
function renderHub(){
  var n=totalStars();
  $('hubStars').textContent=Math.min(n,CFG.goal);
  $('hubMeter').style.width=clamp(n/CFG.goal*100,0,100)+'%';
  ['stars','cards','candles'].forEach(function(k){
    var el=$$('[data-stars="'+k+'"]')[0]; if(!el) return;
    var v=state.best[k]||0; el.textContent='✳'.repeat(v)+'·'.repeat(3-v);
  });
  var q=$('questFinale'), st=$('finaleState');
  if(isUnlocked()){ q.classList.remove('locked'); st.textContent='UNLOCKED ✳'; }
  else { q.classList.add('locked'); st.textContent=CFG.goal-n+' STARS TO GO'; }
  $$('[data-badge]').forEach(function(b){ b.classList.toggle('off',!state.badges[b.getAttribute('data-badge')]); });
  $('needStars').textContent=Math.max(0,CFG.goal-n);
}
function award(game,rank,msg){
  var prev=state.best[game]||0;
  if(rank>prev){ state.best[game]=rank; toast((msg||'新的纪录')+' · '+rank+' 星 ✳'); }
  else toast(msg||'完成 ✳');
  beep(880,.24,'sine',.06); setTimeout(function(){ beep(1180,.22,'sine',.05); },130);
  save(); renderHub();
  /* once all seven stars are in, every result card can take her to the letter */
  if(isUnlocked()) $$('[data-to-letter]').forEach(function(b){ b.hidden=false; });
}
function badge(name,label){
  if(state.badges[name]) return;
  state.badges[name]=true; save(); renderHub(); toast('徽章解锁 · '+label+' ✳');
  beep(1040,.3,'sine',.06);
}

/* stickers around the hub */
(function(){
  var box=$('hubStickers'); if(!box) return;
  var pos=[[6,14],[92,26],[16,68],[84,78],[48,8],[70,52]];
  pos.forEach(function(p,i){
    var s=document.createElementNS('http://www.w3.org/2000/svg','svg');
    s.setAttribute('viewBox','0 0 100 100'); s.innerHTML='<path d="M50 0 C53 30 70 47 100 50 C70 53 53 70 50 100 C47 70 30 53 0 50 C30 47 47 30 50 0Z"/>';
    s.style.left=p[0]+'%'; s.style.top=p[1]+'%'; s.style.animationDelay=(i*.7)+'s';
    s.style.fill=i%2?'rgba(255,255,255,.9)':'rgba(198,242,74,.85)';
    box.appendChild(s);
  });
  for(var i=0;i<10;i++){
    var b=document.createElement('span'); b.className='bub';
    var sz=rand(8,26); b.style.width=sz+'px'; b.style.height=sz+'px';
    b.style.left=rand(3,95)+'%'; b.style.bottom='-10%'; b.style.animationDelay=rand(0,11)+'s';
    b.style.animationDuration=rand(9,16)+'s'; box.appendChild(b);
  }
})();

/* hidden egg: click the logo 5 times */
var logoHits=0;
$('hubLogo').addEventListener('click',function(){
  logoHits++;
  if(logoHits===5){ doEgg(); logoHits=0; }
  else if(logoHits>=3) toast('还在梦里… 再点 '+(5-logoHits)+' 下');
});
function doEgg(){
  badge('egg','还在梦里');
  if(!state.egg){ state.egg=true; save(); renderHub(); toast('找到一颗藏起来的星星 ✳'); }
  else toast('这颗星星已经在你口袋里了 ✳');
  var box=$('hubStickers');
  for(var i=0;i<18;i++){
    (function(i){ setTimeout(function(){
      var s=document.createElement('div'); s.textContent='✳';
      s.style.cssText='position:fixed;left:'+rand(8,92)+'vw;top:'+rand(12,86)+'vh;font-size:'+rand(16,34)+'px;color:#c6f24a;pointer-events:none;z-index:90;animation:floatUp 1.8s ease-out forwards';
      document.body.appendChild(s); setTimeout(function(){ s.remove(); },1900);
    },i*70); })(i);
  }
  beep(1320,.35,'sine',.05);
}

/* ---------------- intro · press & hold to make a wish ---------------- */
var hold = { active:false, start:0, raf:0, readyTimer:0, ready:false, done:false, duration:1700 };
var wishLights = $$('#wishLights span');
var RING = 339.3;

function setLights(n){ wishLights.forEach(function(s,i){ s.classList.toggle('lit', i<n); }); }
/* completion is timer-driven so it never depends on frame pacing */
function markReady(){
  if(!hold.active || hold.ready) return;
  hold.ready=true;
  $('ringFill').style.strokeDashoffset='0';
  setLights(7);
  $('introFrame').classList.add('ready');
  $('holdLabel').textContent='可 以 松 手 了';
  beep(880,.26,'sine',.06);
  var r=$('wishHold').getBoundingClientRect();
  if(window.MB) MB.burst(r.left+r.width/2, r.top+r.height/2, 18, {speed:.9});
}
function tickHold(){
  if(!hold.active) return;
  if(!hold.ready){
    var p=clamp((Date.now()-hold.start)/hold.duration,0,1);
    $('ringFill').style.strokeDashoffset=(RING*(1-p)).toFixed(1);
    setLights(Math.floor(p*7));
  }
  hold.raf=requestAnimationFrame(tickHold);
}
function wishDown(e){
  if(current!=='intro' || hold.done || hold.active) return;
  if(e.target && e.target.closest && e.target.closest('#introSkip')) return;
  if(e.preventDefault) e.preventDefault();
  hold.active=true; hold.ready=false; hold.start=Date.now();
  $('introFrame').classList.remove('ready');
  $('introFrame').classList.add('holding');
  $('holdLabel').textContent='正 在 许 愿…';
  beep(440,.12,'sine',.045);
  clearTimeout(hold.readyTimer);
  hold.readyTimer=setTimeout(markReady,hold.duration);
  tickHold();
}
function wishUp(){
  if(!hold.active) return;
  hold.active=false; cancelAnimationFrame(hold.raf); clearTimeout(hold.readyTimer);
  $('introFrame').classList.remove('holding','ready');
  if(hold.ready && !hold.done){ completeWish(); return; }
  $('ringFill').style.strokeDashoffset = RING;
  setLights(0);
  $('holdLabel').textContent='按 住 许 愿';
  toast('再按久一点点，愿望还没许完 ✳');
}
function completeWish(){
  hold.done=true;
  var r=$('introFrame').getBoundingClientRect();
  if(window.MB){
    MB.burst(r.left+r.width*.30, r.top+r.height*.46, 46,
      {speed:1.9,colors:['#cbef78','#fffdf6','#5b7fbd','#f2c8d8','#c8bfdf']});
    MB.ripple(r.left+r.width/2, r.top+r.height/2);
  }
  $('intro').classList.add('complete');
  $('holdLabel').textContent='愿 望 收 好 了';
  beep(660,.2,'sine',.06);
  setTimeout(function(){ beep(990,.3,'sine',.05); },170);
  setTimeout(function(){ show(params.get('skip')==='1' ? 'hub' : 'gate'); },1450);
}
$('introFrame').addEventListener('pointerdown', wishDown);
document.addEventListener('pointerup', wishUp);
document.addEventListener('pointercancel', wishUp);
document.addEventListener('keyup', function(e){
  if((e.key===' '||e.code==='Space') && current==='intro') wishUp();
});
$('introSkip').addEventListener('click', function(){ show('gate'); });

/* ---------------- gate ---------------- */
var pin='';
function renderPin(){
  $$('#pinRow .pin-slot').forEach(function(s,i){ s.textContent=pin[i]||''; s.classList.toggle('filled',!!pin[i]); });
}
function checkPin(){
  if(pin===CFG.passcode){
    $$('#pinRow .pin-slot').forEach(function(s){ s.classList.add('done'); });
    state.opened=true; save();
    beep(660,.18,'sine',.06); setTimeout(function(){ beep(990,.3,'sine',.05); },150);
    var card=$('gateCard');
    card.style.transition='opacity .8s ease,transform .8s ease,filter .8s ease';
    card.style.opacity='0'; card.style.transform='scale(1.08)'; card.style.filter='blur(14px)';
    setTimeout(function(){ show('hub'); toast('欢迎回来，'+CFG.name+' ✳'); },760);
  } else {
    var c=$('gateCard'); c.classList.remove('shake'); void c.offsetWidth; c.classList.add('shake');
    toast('还不是这天，再想想 · '+CFG.birth.slice(5)); beep(190,.2,'triangle',.05);
    setTimeout(function(){ pin=''; renderPin(); },420);
  }
}
function pressKey(k){
  if(current!=='gate') return;
  if(k==='clear'){ pin=''; }
  else if(k==='del'){ pin=pin.slice(0,-1); }
  else if(/^[0-9]$/.test(k)){ if(pin.length<4){ pin+=k; beep(420+pin.length*90,.07,'sine',.035); } }
  renderPin();
  if(pin.length===4) setTimeout(checkPin,220);
}
$$('#keypad .key').forEach(function(b){ b.addEventListener('click',function(){ pressKey(b.getAttribute('data-k')); }); });
$('hintBtn').addEventListener('click',function(){ toast('暗号是那天的月份和日子 · '+CFG.birth.slice(5).replace('.',' / ')); });
(function(){
  var box=$('gateStars');
  for(var i=0;i<12;i++){
    var s=document.createElementNS('http://www.w3.org/2000/svg','svg');
    s.setAttribute('viewBox','0 0 100 100'); s.setAttribute('class','sparkle');
    s.innerHTML='<path d="M50 0 C53 30 70 47 100 50 C70 53 53 70 50 100 C47 70 30 53 0 50 C30 47 47 30 50 0Z"/>';
    s.style.left=rand(2,96)+'%'; s.style.top=rand(60,100)+'%';
    s.style.width=rand(10,22)+'px'; s.style.height=s.style.width;
    s.style.animationDelay=rand(0,9)+'s'; s.style.animationDuration=rand(7,13)+'s';
    box.appendChild(s);
  }
})();

/* ---------------- game 1 · catch the stars ---------------- */
var sRun=false, sLeft=20, sScore=0, sCombo=1, sHits=0, sTimer=null, sSpawn=null;
function sHud(){
  $('sTime').textContent=Math.max(0,Math.ceil(sLeft));
  $('sScore').textContent=sScore; $('sCombo').textContent='×'+sCombo;
  $('sTarget').textContent=sHits+' / 12';
  $('timeFill').style.width=clamp(sLeft/20*100,0,100)+'%';
}
function resetStars(){
  stopStars(); $('starLayer').innerHTML=''; $('starResult').classList.remove('show');
  $('starPanel').classList.remove('playing');
  sLeft=20; sScore=0; sCombo=1; sHits=0; sHud();
  var dots=$('fieldDots'); dots.innerHTML='';
  for(var i=0;i<26;i++){
    var d=document.createElement('i');
    d.style.left=rand(2,98)+'%'; d.style.top=rand(4,94)+'%'; d.style.animationDelay=rand(0,4)+'s';
    dots.appendChild(d);
  }
  for(var j=0;j<9;j++){
    var s=document.createElementNS('http://www.w3.org/2000/svg','svg');
    s.setAttribute('viewBox','0 0 100 100'); s.setAttribute('class','idle-star');
    s.innerHTML='<path d="M50 0 C53 30 70 47 100 50 C70 53 53 70 50 100 C47 70 30 53 0 50 C30 47 47 30 50 0Z"/>';
    var sz=rand(18,40);
    s.style.left=rand(6,90)+'%'; s.style.top=rand(10,82)+'%';
    s.style.width=sz+'px'; s.style.height=sz+'px';
    s.style.animationDelay=rand(0,6)+'s'; s.style.animationDuration=rand(5,9)+'s';
    dots.appendChild(s);
  }
}
function stopStars(){ sRun=false; clearInterval(sTimer); clearTimeout(sSpawn); }
function spawnStar(){
  if(!sRun) return;
  var layer=$('starLayer');
  if(layer.children.length<6){
    var b=document.createElement('button'); b.className='catch-star'; b.setAttribute('aria-label','抓到一颗星星');
    var sz=rand(32,56);
    b.style.cssText='left:'+rand(6,88)+'%;top:'+rand(12,76)+'%;width:'+sz+'px;height:'+sz+'px';
    b.innerHTML=SPARK;
    var alive=true, life=setTimeout(function(){
      if(!alive) return; alive=false; b.remove(); sCombo=1; sHud();
    },rand(1400,2200));
    b.addEventListener('click',function(ev){
      if(!alive) return; alive=false; clearTimeout(life);
      b.classList.add('hit'); setTimeout(function(){ b.remove(); },360);
      sHits++; sScore+=10*sCombo; sCombo=clamp(sCombo+1,1,6); sHud();
      beep(680+sCombo*90,.09,'sine',.045);
      var pop=document.createElement('span'); pop.className='score-pop';
      pop.textContent='+'+(10*(sCombo-1));
      pop.style.left=b.style.left; pop.style.top=b.style.top;
      $('starPanel').appendChild(pop); setTimeout(function(){ pop.remove(); },1000);
      if(sCombo>=3){
        var cp=$('comboPop'); cp.textContent='COMBO ×'+sCombo;
        cp.classList.remove('show'); void cp.offsetWidth; cp.classList.add('show');
        if(sCombo>=5) badge('combo','连击大师');
      }
    });
    layer.appendChild(b);
  }
  sSpawn=setTimeout(spawnStar,rand(380,720));
}
function startStars(){
  resetStars(); sRun=true; $('starPanel').classList.add('playing'); $('starStart').textContent='正在抓…';
  sTimer=setInterval(function(){
    sLeft-=.1; sHud();
    if(sLeft<=0) finishStars();
  },100);
  spawnStar(); beep(520,.12,'sine',.05);
}
function finishStars(){
  stopStars(); $('starLayer').innerHTML=''; $('starStart').textContent='开始抓星星';
  $('starPanel').classList.remove('playing');
  var rank=sHits>=12?3:(sHits>=8?2:1);
  $('starRank').textContent='✳'.repeat(rank)+'·'.repeat(3-rank);
  $('starDesc').textContent='抓到了 '+sHits+' 颗星星 · 得分 '+sScore;
  $('starResult').classList.add('show');
  award('stars',rank,'星星都回来了');
}
$('starStart').addEventListener('click',function(){ if(!sRun) startStars(); });
$$('[data-retry="stars"]')[0].addEventListener('click',function(){ startStars(); });

/* ---------------- game 2 · memory polaroids ---------------- */
var cFirst=null, cLock=false, cMoves=0, cPairs=0;
function resetCards(){
  var board=$('cardBoard'); board.innerHTML=''; $('cardResult').classList.remove('show');
  cFirst=null; cLock=false; cMoves=0; cPairs=0; updateCardHud();
  /* warm the four pictures as soon as this game opens, so a flip never
     reveals an empty white frame while the image is still decoding */
  var warm=[];
  CFG.cardPhotos.forEach(function(s){ var im=new Image(); im.src=s; warm.push(im); });
  var deck=shuffle(CFG.cardPhotos.concat(CFG.cardPhotos));
  deck.forEach(function(src,i){
    var b=document.createElement('button'); b.className='flip'; b.setAttribute('data-src',src); b.setAttribute('aria-label','翻一张照片');
    b.innerHTML='<div class="flip-inner">'+
      '<div class="flip-face flip-back"><div class="inner">'+SPARK+'</div><span class="no">NO. '+(i+1)+'</span></div>'+
      '<div class="flip-face flip-front"><img src="'+src+'" alt="回忆照片" /></div>'+
    '</div>';
    b.addEventListener('click',function(){ flipCard(b); });
    board.appendChild(b);
  });
}
function updateCardHud(){
  $('cMoves').textContent=cMoves; $('cPairs').textContent=cPairs+' / 4';
  var best=loadBest('cards'); $('cBest').textContent=best?best+' 步':'—';
}
function loadBest(k){ try{ return JSON.parse(localStorage.getItem('dearest-yao-best')||'{}')[k]||0; }catch(e){ return 0; } }
function saveBest(k,v){
  var o={}; try{ o=JSON.parse(localStorage.getItem('dearest-yao-best')||'{}'); }catch(e){}
  if(!o[k]||v<o[k]){ o[k]=v; try{ localStorage.setItem('dearest-yao-best',JSON.stringify(o)); }catch(e){} }
}
function flipCard(b){
  if(cLock||b.classList.contains('flipped')||b.classList.contains('matched')) return;
  b.classList.add('flipped'); beep(560,.09,'sine',.04);
  if(!cFirst){ cFirst=b; return; }
  cMoves++; updateCardHud(); cLock=true;
  var a=cFirst; cFirst=null;
  if(a.getAttribute('data-src')===b.getAttribute('data-src')){
    setTimeout(function(){
      a.classList.add('matched'); b.classList.add('matched'); cPairs++; updateCardHud(); cLock=false;
      beep(880,.18,'sine',.05);
      if(cPairs===4) finishCards();
    },420);
  } else {
    setTimeout(function(){ a.classList.remove('flipped'); b.classList.remove('flipped'); cLock=false; },900);
  }
}
function finishCards(){
  saveBest('cards',cMoves);
  var rank=cMoves<=6?3:(cMoves<=11?2:1);
  if(cMoves<=6) badge('perfect','一次翻对');
  $('cardRank').textContent='✳'.repeat(rank)+'·'.repeat(3-rank);
  $('cardDesc').textContent='用了 '+cMoves+' 步找齐四对 · 最佳 '+cMoves+' 步';
  setTimeout(function(){ $('cardResult').classList.add('show'); },520);
  award('cards',rank,'四对都找到了');
}
$('cardRestart').addEventListener('click',resetCards);
$$('[data-retry="cards"]')[0].addEventListener('click',resetCards);

/* ---------------- game 3 · candles ---------------- */
var kNext=1, kMistakes=0, kOut=0;
function resetCandles(){
  $('candleResult').classList.remove('show');
  $$('#cakeWrap .candle').forEach(function(c){ c.remove(); });
  $$('#candlePanel .confetti').forEach(function(c){ c.remove(); });
  kNext=1; kMistakes=0; kOut=0; updateCandleHud();
  var wrap=$('cakeWrap');
  var defs=[
    {x:80,bottom:162},{x:110,bottom:162},{x:140,bottom:162},{x:170,bottom:162},{x:200,bottom:162},
    {x:48,bottom:108},{x:232,bottom:108}
  ];
  defs.sort(function(a,b){ return a.x-b.x; });
  defs.forEach(function(d,i){
    var c=document.createElement('button'); c.className='candle';
    c.style.left=d.x+'px'; c.style.bottom=d.bottom+'px';
    c.setAttribute('data-order',i+1); c.setAttribute('aria-label','吹灭第 '+(i+1)+' 根蜡烛');
    c.innerHTML='<span class="flame"></span>';
    c.addEventListener('click',function(){ blow(c,false); });
    wrap.appendChild(c);
  });
}
function updateCandleHud(){
  $('kOut').textContent=kOut+' / 7';
  $('kOrder').textContent=kOut===7?'完成':'下一根 '+(kNext>7?'—':kNext);
}
function blow(c,forced){
  if(c.classList.contains('out')) return;
  var order=+c.getAttribute('data-order');
  if(!forced){ if(order!==kNext) kMistakes++; else kNext++; }
  c.classList.add('out'); kOut++; updateCandleHud(); beep(300+order*45,.11,'sine',.04);
  if(kOut===7) finishCandles();
}
function blowAll(forcedMistakes){
  $$('#cakeWrap .candle').forEach(function(c){ if(!c.classList.contains('out')){ c.classList.add('out'); kOut++; } });
  kMistakes+=forcedMistakes; kNext=8; updateCandleHud();
  if(kOut===7) finishCandles();
}
function finishCandles(){
  badge('wish','愿望送达');
  var rank=kMistakes===0?3:(kMistakes<=2?2:1);
  $('candleRank').textContent='✳'.repeat(rank)+'·'.repeat(3-rank);
  $('candleDesc').textContent=kMistakes===0?'七根都按亮起的顺序熄灭了':'愿望照样送到了 · 有 '+kMistakes+' 次抢先';
  var panel=$('candlePanel'), colors=['#c6f24a','#ffffff','#c9c2e3','#a5dbe9','#f3c1d9'];
  for(var i=0;i<64;i++){
    var p=document.createElement('i'); p.className='confetti';
    p.style.left=rand(2,98)+'%'; p.style.background=colors[i%colors.length];
    p.style.animationDelay=rand(0,.9)+'s'; p.style.animationDuration=rand(2.4,4)+'s';
    p.style.borderRadius=i%3===0?'50%':'1px';
    panel.appendChild(p);
  }
  setTimeout(function(){ $('candleResult').classList.add('show'); },1000);
  award('candles',rank,'愿望送达');
}
$('candleRestart').addEventListener('click',resetCandles);
$$('[data-retry="candles"]')[0].addEventListener('click',resetCandles);

/* ---------------- memory wall ----------------
   42 polaroids + the video are only created / requested when she actually
   opens the wall. Nothing from this page competes with the games on load. */
var wallBuilt=false;
function buildWall(){
  if(wallBuilt) return; wallBuilt=true;
  var grid=$('wallGrid'), frag=document.createDocumentFragment();
  for(var i=1;i<=CFG.photos;i++){
    (function(i){
      var m=document.createElement('figure'); m.className='memo';
      m.style.setProperty('--r',rand(-4,4).toFixed(1)+'deg');
      var src='assets/photos/p'+String(i).padStart(2,'0')+'.jpg';
      m.innerHTML='<span class="tape"></span><img src="'+src+'" alt="'+CFG.captions[i-1]+'" loading="lazy" decoding="async" />'+
        '<span class="idx">'+String(i).padStart(2,'0')+' / 42</span>'+
        '<figcaption class="cap">'+CFG.captions[i-1]+'</figcaption>';
      m.addEventListener('click',function(){ openLightbox(i-1); });
      frag.appendChild(m);
    })(i);
  }
  grid.appendChild(frag);
}
function playWallVideo(){
  var v=$('wallVideo'); if(!v) return;
  if(v.preload==='none') v.preload='metadata';
  v.play().catch(function(){});
}
function pauseWallVideo(){
  var v=$('wallVideo'); if(v && !v.paused) v.pause();
}
var lbIndex=0, lbMode='photos', lbPage=1;
function openLightbox(i){
  lbMode='photos';
  lbIndex=(i+CFG.photos)%CFG.photos;
  $('lbImg').src='assets/photos/p'+String(lbIndex+1).padStart(2,'0')+'.jpg';
  $('lbCap').textContent=CFG.captions[lbIndex];
  $('lbMeta').textContent=String(lbIndex+1).padStart(2,'0')+' / 42 · A DREAM MADE OF US';
  $('lightbox').classList.add('show');
}
function openLetterPage(i){
  lbMode='letter'; lbPage=i;
  $('lbImg').src='assets/letter/page'+i+'.jpg';
  $('lbCap').textContent='手写原稿 · 0'+i;
  $('lbMeta').textContent='A LETTER FROM '+CFG.writer+' / 2026.11.10';
  $('lightbox').classList.add('show');
}
function closeLightbox(){ $('lightbox').classList.remove('show'); lbMode='photos'; }
function lbStep(d){ if(lbMode==='letter') openLetterPage(lbPage===1?2:1); else openLightbox(lbIndex+d); }
$('lbClose').addEventListener('click',closeLightbox);
$('lbPrev').addEventListener('click',function(e){ e.stopPropagation(); lbStep(-1); });
$('lbNext').addEventListener('click',function(e){ e.stopPropagation(); lbStep(1); });
$('lightbox').addEventListener('click',function(e){ if(e.target===this) closeLightbox(); });

/* ---------------- finale · the letter, shown directly ---------------- */
var letterTimers=[];
function buildLetter(){
  var box=$('letterText'); box.innerHTML='';
  CFG.letter.forEach(function(t){
    var p=document.createElement('p');
    var mark='在深圳有风，有光，也有退路';
    var k=t.indexOf(mark);
    if(k>=0){
      p.appendChild(document.createTextNode(t.slice(0,k)));
      var em=document.createElement('em'); em.textContent=mark; p.appendChild(em);
      p.appendChild(document.createTextNode(t.slice(k+mark.length)));
    } else p.textContent=t;
    box.appendChild(p);
  });
}
function clearLetterTimers(){ letterTimers.forEach(clearTimeout); letterTimers=[]; }
function enterFinale(){
  clearLetterTimers();
  buildLetter();
  var locked=!isUnlocked();
  $('finale').classList.toggle('locked',locked);
  $('lockedNote').hidden=!locked;
  $('needStars').textContent=Math.max(0,CFG.goal-totalStars());
  $('saveCard').disabled=locked;
  var ps=$$('#letterText p');
  /* static / direct-link previews show the whole letter at once */
  if(locked || params.get('static')==='1' || params.get('open')==='1'){
    ps.forEach(function(p){ p.classList.add('shown'); });
    return;
  }
  ps.forEach(function(p,i){
    letterTimers.push(setTimeout(function(){ p.classList.add('shown'); },100+i*120));
  });
}
$('letterSheet').addEventListener('click',function(){
  clearLetterTimers();
  $$('#letterText p').forEach(function(p){ p.classList.add('shown'); });
});
$$('[data-letter-page]').forEach(function(b){
  b.addEventListener('click',function(){ openLetterPage(+b.getAttribute('data-letter-page')); });
});

/* downloadable keepsake card */
$('saveCard').addEventListener('click',async function(){
  try{ await document.fonts.ready; }catch(e){}
  var c=document.createElement('canvas'); c.width=900; c.height=1200;
  var x=c.getContext('2d');
  var g=x.createLinearGradient(0,0,900,1200);
  g.addColorStop(0,'#f8f6ee'); g.addColorStop(.5,'#eef1e6'); g.addColorStop(1,'#dce6d1');
  x.fillStyle=g; x.fillRect(0,0,900,1200);
  x.fillStyle='rgba(255,253,246,.92)'; x.fillRect(60,60,780,1080);
  x.strokeStyle='#cbef78'; x.lineWidth=2; x.strokeRect(76,76,748,1048);
  x.strokeStyle='rgba(43,53,44,.14)'; x.lineWidth=1; x.strokeRect(88,88,724,1024);
  x.save(); x.globalAlpha=.085; x.fillStyle='#5b7fbd'; x.textAlign='center';
  x.font='400 300px "Instrument Serif", Georgia, serif'; x.fillText('22',450,640); x.restore();
  var img=new Image(); img.src='assets/photos/p39.jpg';
  try{ await new Promise(function(res,rej){ img.onload=res; img.onerror=rej; setTimeout(res,1500); }); }catch(e){}
  if(img.width){
    var tw=620,th=460,tx=140,ty=250;
    var r=Math.max(tw/img.width,th/img.height);
    var w=img.width*r,h=img.height*r;
    x.save(); x.beginPath(); x.rect(tx,ty,tw,th); x.clip();
    x.drawImage(img,tx+(tw-w)/2,ty+(th-h)/2,w,h); x.restore();
    x.strokeStyle='#fffdf6'; x.lineWidth=12; x.strokeRect(tx,ty,tw,th);
  }
  x.textAlign='center';
  x.fillStyle='#3f6099'; x.font='110px Italianno, cursive'; x.fillText('Dearest',450,190);
  x.font='300 26px "Cormorant Garamond", Georgia, serif'; x.fillStyle='#6f6796';
  x.fillText('A DREAM MADE OF US',450,770);
  x.font='400 30px "Songti SC", serif'; x.fillStyle='#24362b';
  x.fillText('生 日 快 乐 · 陆星瑶',450,838);
  x.font='400 18px "DM Mono", monospace'; x.fillStyle='#6c796a';
  x.fillText(CFG.birth+'   ·   TWENTY TWO',450,884);
  x.fillStyle='#5b7a20'; x.font='400 20px "DM Mono", monospace';
  x.fillText('✳ '+Math.min(totalStars(),9)+' STARS COLLECTED',450,950);
  x.font='400 24px Caveat, cursive'; x.fillStyle='#6f6796';
  x.fillText('this dream never ends',450,1030);
  x.font='400 14px "DM Mono", monospace'; x.fillStyle='#9ba895';
  x.fillText('LETTER BY WANG YIRAN / 2026.11.10',450,1088);
  try{
    var a=document.createElement('a'); a.download='dearest-xingyao-22.png'; a.href=c.toDataURL('image/png'); a.click();
    toast('纪念卡已保存 ♡'); badge('wish','愿望送达');
  }catch(e){ toast('保存失败，换个浏览器试试'); }
});

/* ---------------- global keys ---------------- */
var konami=[], seq=['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
document.addEventListener('keydown',function(e){
  if(e.key==='Escape'){
    if($('lightbox').classList.contains('show')) closeLightbox();
    else if(current!=='gate'&&current!=='hub') show('hub');
    return;
  }
  if($('lightbox').classList.contains('show')){
    if(e.key==='ArrowLeft') lbStep(-1);
    if(e.key==='ArrowRight') lbStep(1);
    return;
  }
  if(current==='intro' && (e.key===' '||e.code==='Space')){
    e.preventDefault();
    if(!e.repeat) wishDown({target:null,preventDefault:function(){}});
    return;
  }
  if(current==='gate'){
    if(/^[0-9]$/.test(e.key)) pressKey(e.key);
    else if(e.key==='Backspace') pressKey('del');
    else if(e.key==='Enter'&&pin.length===4) checkPin();
    else if(e.key.toLowerCase()==='c') pressKey('clear');
  } else if(e.key===' '||e.code==='Space'){
    e.preventDefault();
    if(current==='stars'&&!sRun) startStars();
    else if(current==='candles'&&kOut<7) blowAll(3);
  }
  konami.push(e.key); if(konami.length>seq.length) konami.shift();
  if(konami.join(',')===seq.join(',')){
    konami=[]; ['combo','perfect','wish','egg'].forEach(function(b){ state.badges[b]=true; });
    if(!state.egg) state.egg=true; save(); renderHub(); toast('你念出了梦的咒语 ✳'); doEgg();
  }
});

/* ---------------- boot ---------------- */
renderHub();
if(isUnlocked()) $$('[data-to-letter]').forEach(function(b){ b.hidden=false; });
var target=params.get('screen');
if(target && $(target) && target!=='intro'){
  $$('.screen').forEach(function(s){ s.classList.toggle('active',s.id===target); });
  current=target;
  if(target==='wall'){ buildWall(); playWallVideo(); }
  if(target==='finale') enterFinale();
  if(target==='hub') renderHub();
  if(target==='stars') resetStars();
  if(target==='cards') resetCards();
  if(target==='candles') resetCandles();
}
if(params.get('dream')==='all'&&!target){
  $$('.screen').forEach(function(s){ s.classList.toggle('active',s.id==='hub'); });
  current='hub'; renderHub();
}
if(window.MB) MB.scan();

/* QA hooks — only active with an explicit ?qa= parameter */
if(params.get('qa')==='wish'){
  setTimeout(function(){
    $('introFrame').dispatchEvent(new PointerEvent('pointerdown',{bubbles:true,cancelable:true}));
    setTimeout(function(){ document.dispatchEvent(new PointerEvent('pointerup',{bubbles:true})); },2000);
  },200);
}
if(params.get('qa')==='pin'){
  ['1','1','1','2'].forEach(function(k,i){ setTimeout(function(){ pressKey(k); },150+i*90); });
}
if(params.get('qa')==='flip'){
  setTimeout(function(){
    $$('#cardBoard .flip').slice(0,4).forEach(function(b){
      b.classList.add('flipped');
      var inner=b.querySelector('.flip-inner');
      inner.style.transition='none'; inner.style.transform='rotateY(180deg)';
    });
  },260);
}
if(params.get('qa')==='pop'){
  setTimeout(function(){
    document.title='POP|'+$$('#introStage .layer').map(function(el){
      var cs=getComputedStyle(el);
      return el.className.replace('layer ','').trim()+':'+cs.animationName+'@'+cs.animationDelay;
    }).join('|');
  },480);
}
if(params.get('qa')==='state'){
  setTimeout(function(){
    document.title='STATE|active='+current+
      '|memos='+$$('#wallGrid .memo').length+
      '|videoPreload='+$('wallVideo').preload+
      '|hidden='+$$('.screen:not(.active)').map(function(s){ return getComputedStyle(s).display; }).join(',')+
      '|letterBtns='+$$('[data-to-letter]').filter(function(b){ return !b.hidden; }).length+
      '|caps='+$$('#cardBoard .cap').length;
  },500);
}
})();
