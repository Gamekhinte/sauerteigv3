'use strict';
/* Hefe Hanz: Maskottchen (Starter-Tab), kurze Tour beim ersten Start und Video-Tutorial in den Optionen.
   Wird vor app.js geladen. Alles, was Daten aus app.js braucht (LS, pet, goTab, ...), läuft erst in Ereignissen. */

const HZ_INK='#3b2a1a',HZ_GOLD='#e8a94f';
function hzShade(h,f){const n=parseInt(h.slice(1),16),c=v=>Math.max(0,Math.min(255,Math.round(v*f)));
  return '#'+((1<<24)+(c(n>>16)<<16)+(c(n>>8&255)<<8)+c(n&255)).toString(16).slice(1)}

// o: {col, eye, acc, mood (0 hungrig, 1 geht so, 2 satt), cls, label}
function hanzSVG(o={}){
  const ink=HZ_INK,col=o.col||HZ_GOLD,rim=hzShade(col,.84),m=o.mood??2;
  const eyes=[
    `<g class="hz-eyes"><ellipse cx="74" cy="106" rx="15" ry="18" fill="#fff"/><ellipse cx="126" cy="106" rx="15" ry="18" fill="#fff"/><circle cx="76" cy="109" r="10" fill="${ink}"/><circle cx="128" cy="109" r="10" fill="${ink}"/><circle cx="79.5" cy="105" r="3.5" fill="#fff"/><circle cx="131.5" cy="105" r="3.5" fill="#fff"/></g>`,
    `<g><path d="M62 110q12-14 24 0M114 110q12-14 24 0" fill="none" stroke="${ink}" stroke-width="5" stroke-linecap="round"/></g>`,
    `<g class="hz-eyes"><ellipse cx="74" cy="108" rx="14" ry="14" fill="#fff"/><ellipse cx="126" cy="108" rx="14" ry="14" fill="#fff"/><circle cx="75" cy="112" r="8" fill="${ink}"/><circle cx="127" cy="112" r="8" fill="${ink}"/><path d="M59 107a15 14 0 0 1 30 0zM111 107a15 14 0 0 1 30 0z" fill="${rim}"/><path d="M59 107h30M111 107h30" stroke="${ink}" stroke-width="3" stroke-linecap="round"/></g>`,
    `<g><rect x="55" y="95" width="40" height="23" rx="9" fill="${ink}"/><rect x="105" y="95" width="40" height="23" rx="9" fill="${ink}"/><path d="M95 103h10" stroke="${ink}" stroke-width="4"/><path d="M63 101h10M113 101h10" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".45"/></g>`][o.eye||0];
  const mouth=[`<path d="M88 141q12-10 24 0" fill="none" stroke="${ink}" stroke-width="4.5" stroke-linecap="round"/>`,
    `<path d="M90 137h20" stroke="${ink}" stroke-width="4.5" stroke-linecap="round"/>`,
    `<path d="M88 132q12 11 24 0" fill="none" stroke="${ink}" stroke-width="4.5" stroke-linecap="round"/>`][m];
  const fl=[0,72,144,216,288].map(a=>`<circle cx="${(142+9*Math.cos(a*Math.PI/180)).toFixed(1)}" cy="${(52+9*Math.sin(a*Math.PI/180)).toFixed(1)}" r="7" fill="#f08aa5" stroke="${ink}" stroke-width="2"/>`).join('');
  const acc=['',
    `<path d="M70 60v-14a15 15 0 0 1 10-27 20 20 0 0 1 40 0 15 15 0 0 1 10 27v14z" fill="#fff" stroke="${ink}" stroke-width="3" stroke-linejoin="round"/><path d="M70 52h60" stroke="${ink}" stroke-width="2.5"/>`,
    fl+`<circle cx="142" cy="52" r="5.5" fill="#f2c230" stroke="${ink}" stroke-width="2"/>`,
    `<path d="M100 46L79 33v26zM100 46l21-13v26z" fill="#e0556b" stroke="${ink}" stroke-width="2.5" stroke-linejoin="round"/><circle cx="100" cy="46" r="6" fill="#c23a50" stroke="${ink}" stroke-width="2"/>`,
    `<path d="M72 56l-4-26 17 13 15-20 15 20 17-13-4 26z" fill="#f2c230" stroke="${ink}" stroke-width="3" stroke-linejoin="round"/>`][o.acc||0];
  return `<svg viewBox="0 0 200 200" class="hz m${m}${o.cls?' '+o.cls:''}" role="img" aria-label="${o.label||'Hefe Hanz'}">
<ellipse cx="100" cy="182" rx="58" ry="8" fill="${ink}" opacity=".13"/>
<g class="hz-hop"><g class="hz-body">
<path d="M100 40C146 40 170 76 170 114S140 172 100 172 30 152 30 114 54 40 100 40z" fill="${rim}"/>
<path d="M100 49C140 49 161 80 161 114S135 163 100 163 39 146 39 114 60 49 100 49z" fill="${col}"/>
<path d="M78 62l-8 14M100 56v16M122 62l8 14" stroke="#fff" stroke-width="6" stroke-linecap="round" opacity=".45"/>
<ellipse cx="56" cy="128" rx="13" ry="8" fill="#f08a80" opacity=".75"/><ellipse cx="144" cy="128" rx="13" ry="8" fill="#f08a80" opacity=".75"/>
${eyes}${mouth}<ellipse class="hz-open" cx="100" cy="137" rx="11" ry="9" fill="#6b2a22"/>${acc}
</g></g></svg>`;
}

/* ---------- Reaktionen im Starter-Tab ---------- */
const HZ_SAY={tap:['Blubb blubb.','Mehl her!','Heute backen wir was Schönes.','Kitzel mich nicht!','Ich wachse und wachse.'],
  fed:['Lecker, danke!','Mmmh, frisches Mehl.','Jetzt hab ich Kraft.'],hungry:['Ich hab Hunger.','Fütterst du mich bald?']};
let hzT;
function hzReact(kind){
  const box=document.getElementById('petArt'),s=box&&box.querySelector('.hz');if(!s)return;
  s.classList.remove('jump');void s.getBoundingClientRect();s.classList.add('jump');
  if(kind==='fed')for(let i=0;i<4;i++){const h=document.createElement('i');h.className='hz-heart';h.textContent='♥';
    h.style.left=(35+Math.random()*30)+'%';h.style.animationDelay=(i*.12)+'s';box.appendChild(h);setTimeout(()=>h.remove(),1600)}
  const list=kind==='fed'?HZ_SAY.fed:(typeof petMood==='function'&&petMood()===0?HZ_SAY.hungry:HZ_SAY.tap);
  const say=document.getElementById('petSay');
  if(say){say.textContent=tr(list[Math.floor(Math.random()*list.length)]);say.classList.add('on');clearTimeout(hzT);hzT=setTimeout(()=>say.classList.remove('on'),2600)}
}
document.getElementById('petArt')?.addEventListener('click',()=>hzReact('tap'));

/* ---------- Kurze Tour ---------- */
const TUT=['Hallo, ich bin Hefe Hanz. Ich zeige dir kurz, wie LilDough funktioniert.',
  'Sag mir einfach, wann dein Brot fertig sein soll. Ich rechne rückwärts und sage dir, wann du anfangen musst.',
  'Für jeden Schritt bekommst du eine Erinnerung, auch wenn die App zu ist. Tippe dafür im Plan auf Aktivieren.',
  'Schläfst du nachts? Trag unter Ruhezeit ein, wann nichts anstehen soll. Dann startet kein Schritt mitten in der Nacht.',
  'Unter Mehr findest du den Brot-Coach, deinen Starter, deine Rezepte und die Optionen.',
  'Dein Niveau kannst du in den Optionen jederzeit ändern. Es bestimmt, welche Begriffe und Einstellungen du siehst. Alles dort wirkt sofort auf die ganze App.'];
let tutI=0,tutTalk;
function hzTalkFor(el,ms){const s=el.querySelector('.hz');if(!s)return;s.classList.add('talk');clearTimeout(tutTalk);tutTalk=setTimeout(()=>s.classList.remove('talk'),ms)}
function tutShow(){
  const t=tr(TUT[tutI]);document.getElementById('tutT').textContent=t;
  document.getElementById('tutDots').innerHTML=TUT.map((_,i)=>`<i class="${i===tutI?'on':''}"></i>`).join('');
  document.getElementById('tutNext').textContent=tutI===TUT.length-1?tr('LOS GEHT’S'):tr('WEITER');
  hzTalkFor(document.getElementById('tutHz'),Math.min(4500,t.split(' ').length*260));
}
function openTut(){tutI=0;document.getElementById('tutHz').innerHTML=hanzSVG({label:'Hefe Hanz'});document.getElementById('tut').hidden=false;tutShow()}
function closeTut(){document.getElementById('tut').hidden=true;LS.set('sb_tut',1);if(typeof goTab==='function')goTab('bake')}
document.getElementById('tutNext').onclick=()=>{if(tutI<TUT.length-1){tutI++;tutShow()}else closeTut()};
document.getElementById('tutSkip').onclick=closeTut;

/* ---------- Video-Tutorial ----------
   Bilder liegen in tut/1.jpg bis tut/9.jpg. Sprachaufnahmen (z. B. aus ElevenLabs) optional als
   tut/de-1.mp3 bis tut/de-9.mp3 bzw. tut/en-1.mp3 ... Fehlen sie, laufen die Szenen mit Untertiteln nach Zeit. */
const VSC=[
  'Hallo, ich bin Hefe Hanz, dein Sauerteig-Helfer. Ich zeige dir jetzt, was LilDough alles kann.',
  'Wähle dein Brot und sag mir, bis wann es fertig sein soll. Dann tippst du auf Plan erstellen, und ich rechne aus, wann du anfangen musst.',
  'Jeder Schritt hat einen Countdown. Ist er geschafft, tippst du auf Schritt erledigt. Ich erinnere dich an den nächsten, auch wenn die App zu ist.',
  'Mit der Ruhezeit legst du fest, wann nichts anstehen soll, zum Beispiel nachts. Ich plane dann einfach drumherum.',
  'Im Rechner siehst du alle Mengen für deine Personen oder dein Mehl. Der Wasser-Guide hilft dir bei der richtigen Wassermenge.',
  'Im Brot-Coach stellst du Fragen zu deinem Teig oder schickst ein Foto. Drei Schnellfragen passend zu deinem Schritt sind schon vorbereitet.',
  'Und hier wohne ich! Du kannst mich füttern, anziehen und beim Wachsen zusehen. Mit dem Peak-Tagebuch lerne ich, wie schnell dein Starter wirklich ist.',
  'Nach dem Backen hältst du Foto, Sterne und Notizen im Back-Tagebuch fest. So wird jedes Brot ein bisschen besser.',
  'In den Optionen stellst du dein Niveau ein, also Neuling, Fortgeschritten oder Profi. Das ändert Begriffe und Einstellungen in der ganzen App. Viel Spaß beim Backen!'];
const V={i:0,playing:false,timer:0,audio:null,ctx:null,an:null,hasAudio:null,raf:0};
const vEl=id=>document.getElementById(id);
let vPre=[];
function vShow(){
  const im=vEl('vImg');im.hidden=false;im.onerror=()=>{im.hidden=true};im.src=`tut/${V.i+1}.jpg`; // fehlt ein Bild, bleibt nur Hanz mit Untertitel
  vEl('vSub').textContent=tr(VSC[V.i]);
  vEl('vProg').style.width=((V.i+1)/VSC.length*100)+'%';
  vEl('vPlay').textContent=V.playing?tr('PAUSE'):(V.i===VSC.length-1&&V.done?tr('NOCHMAL'):tr('ABSPIELEN'));
}
function vMouth(on,sync){const s=vEl('vHz').querySelector('.hz');if(!s)return;s.classList.toggle('talk',on&&!sync);s.classList.toggle('sync',on&&!!sync);if(!on)s.style.removeProperty('--mo')}
function vStop(){V.playing=false;clearTimeout(V.timer);cancelAnimationFrame(V.raf);if(V.audio){V.audio.onended=null;V.audio.pause()}vMouth(false);vShow()}
async function vProbe(){
  if(V.hasAudio!==null)return V.hasAudio;
  try{const r=await fetch(`tut/${LANG}-1.mp3`,{method:'HEAD',cache:'no-store'});V.hasAudio=r.ok}catch{V.hasAudio=false}
  return V.hasAudio;
}
function vLip(){ // Mund folgt der Lautstärke der Aufnahme
  const s=vEl('vHz').querySelector('.hz'),buf=new Uint8Array(V.an.fftSize);
  const tick=()=>{V.an.getByteTimeDomainData(buf);let q=0;for(const b of buf){const d=(b-128)/128;q+=d*d}
    s.style.setProperty('--mo',Math.min(1,Math.sqrt(q/buf.length)*7).toFixed(2));V.raf=requestAnimationFrame(tick)};
  tick();
}
// Muss direkt im Tipp-Ereignis laufen, sonst bleibt der Ton auf dem iPhone gesperrt
function vUnlock(){
  if(!V.audio){V.audio=new Audio();V.audio.preload='auto';V.audio.src=`tut/${LANG}-${V.i+1}.mp3`;V.unlockP=V.audio.play().then(()=>V.audio.pause()).catch(()=>{})}
  if(!V.ctx){try{V.ctx=new (window.AudioContext||window.webkitAudioContext)()}catch{V.noAn=true}}
  try{V.ctx?.resume()}catch{}
}
// Lautstärke-Messung nur anschließen, wenn der AudioContext wirklich läuft. Sonst bliebe die Aufnahme stumm.
async function vWire(){
  if(V.an||V.noAn||!V.ctx)return;
  if(V.ctx.state!=='running')await Promise.race([V.ctx.resume().catch(()=>{}),new Promise(r=>setTimeout(r,400))]);
  if(V.ctx.state!=='running'){V.noAn=true;return}
  try{const src=V.ctx.createMediaElementSource(V.audio);V.an=V.ctx.createAnalyser();V.an.fftSize=512;src.connect(V.an);V.an.connect(V.ctx.destination)}catch{V.noAn=true}
}
async function vPlayScene(){
  clearTimeout(V.timer);cancelAnimationFrame(V.raf);vShow();
  const next=()=>{vMouth(false);if(!V.playing)return;if(V.i<VSC.length-1){V.timer=setTimeout(()=>{V.i++;vPlayScene()},700)}else{V.playing=false;V.done=true;vShow()}};
  if(await vProbe()){
    await V.unlockP;await vWire();
    V.audio.src=`tut/${LANG}-${V.i+1}.mp3`;V.audio.onended=next;
    try{await V.audio.play();vMouth(true,!!V.an);if(V.an)vLip();return}catch{}
  }
  vMouth(true);V.timer=setTimeout(next,Math.max(3500,tr(VSC[V.i]).split(' ').length*330));
}
function openVid(){vPre=VSC.map((_,i)=>{const m=new Image();m.src=`tut/${i+1}.jpg`;return m}); // alle Bilder vorab laden
  V.i=0;V.done=false;V.playing=false;vEl('vHz').innerHTML=hanzSVG({label:'Hefe Hanz'});vEl('vid').hidden=false;vShow()}
vEl('vPlay').onclick=()=>{if(V.playing){vStop();return}if(V.done){V.i=0;V.done=false}vUnlock();V.playing=true;vPlayScene()};
vEl('vPrev').onclick=()=>{const p=V.playing;vStop();V.i=Math.max(0,V.i-1);V.done=false;if(p){V.playing=true;vPlayScene()}else vShow()};
vEl('vNext').onclick=()=>{const p=V.playing;vStop();V.i=Math.min(VSC.length-1,V.i+1);if(p){V.playing=true;vPlayScene()}else vShow()};
vEl('vClose').onclick=()=>{vStop();vEl('vid').hidden=true};
vEl('tutAgain').onclick=()=>openTut();
vEl('vidOpen').onclick=()=>openVid();
