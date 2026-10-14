'use strict';
/* Diktieren (Spracherkennung des Browsers) und Vorlesen der Coach-Antworten. Wird nach app.js geladen. */
const SR=window.SpeechRecognition||window.webkitSpeechRecognition,TTS=window.speechSynthesis;
let recog=null,recBtn=null;

// Mikrofon-Knopf: data-mic="id" oder das Textfeld daneben
const micTarget=b=>b.dataset.mic?document.getElementById(b.dataset.mic):b.parentElement.querySelector('textarea,input');
function dictate(b){
  if(recog){const same=recBtn===b;try{recog.stop()}catch{}if(same)return}
  const el=micTarget(b);if(!el)return;
  const r=new SR();r.lang=LANG==='de'?'de-DE':'en-US';r.interimResults=true;r.continuous=false; // stoppt nach einer Sprechpause, nochmal tippen zum Weitersprechen
  const base=el.value?el.value.replace(/\s*$/,' '):'';
  r.onresult=e=>{let s='';for(let i=0;i<e.results.length;i++)s+=e.results[i][0].transcript;el.value=(base+s).replace(/\s+/g,' ').replace(/^\s+/,'')};
  r.onerror=e=>{if(e.error==='not-allowed'||e.error==='service-not-allowed')toast(tr('Bitte erlaube den Zugriff aufs Mikrofon.'));else if(e.error!=='no-speech'&&e.error!=='aborted')toast(tr('Diktieren hat nicht geklappt.'))};
  r.onend=()=>{b.classList.remove('rec');if(recog===r){recog=null;recBtn=null}el.dispatchEvent(new Event('input',{bubbles:true}));el.dispatchEvent(new Event('change',{bubbles:true}))};
  recog=r;recBtn=b;b.classList.add('rec');
  try{r.start()}catch{b.classList.remove('rec');recog=null;recBtn=null}
}
document.addEventListener('click',e=>{
  const b=e.target.closest('.mic');if(!b)return;e.preventDefault();
  if(!SR)return toast(tr('Dein Browser kann hier nicht diktieren. Nutze das Mikrofon auf deiner Tastatur.'));
  dictate(b);
});

// Vorlesen
function speak(text){
  if(!TTS||!text)return;TTS.cancel();
  const u=new SpeechSynthesisUtterance(text);u.lang=LANG==='de'?'de-DE':'en-US';
  const v=TTS.getVoices().filter(x=>(x.lang||'').toLowerCase().startsWith(LANG));if(v.length)u.voice=v.find(x=>x.localService)||v[0];
  TTS.speak(u);
}
const ttsOn=()=>!!LS.get('sb_tts',false);
if(!TTS)$('ttsRow').hidden=true;
$('ttsOn').checked=ttsOn();
$('ttsOn').onchange=()=>{LS.set('sb_tts',$('ttsOn').checked);if($('ttsOn').checked)speak(tr('Ich lese dir die Antworten vor.'));else TTS&&TTS.cancel()};
// iPhone gibt die Sprachausgabe erst nach einem Tippen frei: beim Senden kurz anstoßen
$('chatSend').addEventListener('click',()=>{if(ttsOn()&&TTS&&!TTS.speaking){const u=new SpeechSynthesisUtterance(' ');u.volume=0;TTS.speak(u)}});
document.addEventListener('visibilitychange',()=>{if(document.hidden&&TTS)TTS.cancel()});
