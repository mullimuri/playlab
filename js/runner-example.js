/* 외부 파일을 사용하지 않는 터치 게임 예시. 교사가 교체할 수 있습니다. */
window.PLAYLAB_RUNNER_EXAMPLE = `<!doctype html>
<html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>별을 잡아라!</title>
<style>
*{box-sizing:border-box}body{margin:0;background:#211a38;color:#f5f0ff;font-family:-apple-system,BlinkMacSystemFont,sans-serif;min-height:100vh;min-height:100dvh;display:flex;flex-direction:column}
header{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:18px 20px;background:#2c2345}h1{font-size:18px;margin:0}header p{font-size:12px;margin:6px 0 0;color:#c5b8da}.stats{text-align:right;white-space:nowrap;font-size:13px;line-height:1.8}.stats b{color:#c7f483}
#stage{flex:1;min-height:180px;position:relative;overflow:hidden;background-image:radial-gradient(#ffffff16 1px,transparent 1px);background-size:24px 24px}
#star{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);height:68px;width:68px;border:1px solid #ead897;border-radius:21px;font-size:44px;color:#fbe88e;background:#f3dd7420;touch-action:manipulation;cursor:pointer;line-height:1;box-shadow:0 0 35px #f3dd7416}
#star:active{background:#f3dd7460}#star:disabled{opacity:.4;cursor:default}
#overlay{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;flex-direction:column;text-align:center;background:#211a38ef;padding:24px}
#overlay[hidden]{display:none}#overlay h2{font-size:25px;margin:0 0 13px}#overlay p{font-size:14px;color:#c8bddd;line-height:1.9;margin:0 0 24px}#start{border:0;border-radius:12px;padding:16px 24px;font-size:16px;font-weight:700;color:#2a2140;background:#c7f483;min-height:52px;cursor:pointer}
footer{padding:12px 16px;text-align:center;font-size:11px;color:#bbacd0}
@media(max-height:350px){header{padding:10px 16px}header p{display:none}#overlay h2{font-size:20px;margin-bottom:5px}#overlay p{margin-bottom:10px}footer{padding:6px}}
</style></head><body>
<header><div><h1>✦ 별을 잡아라!</h1><p>15초 안에 별을 몇 개 잡을 수 있을까요?</p></div><div class="stats">점수 <b id="score">0</b><br>남은 시간 <b id="time">15</b>초</div></header>
<main id="stage"><button id="star" type="button" aria-label="별 잡기" disabled>★</button><div id="overlay"><h2 id="title">반짝, 네 차례야.</h2><p id="description">나타나는 별을 터치하세요.<br>15초 동안 최대한 많이 잡아 보세요!</p><button id="start" type="button">게임 시작</button></div></main>
<footer>화면의 별을 터치하거나 클릭하세요. · 외부 파일 없는 예시 게임</footer>
<script>
(function(){
const stage=document.getElementById('stage'),star=document.getElementById('star'),overlay=document.getElementById('overlay');
let score=0,playing=false,until=0,timer=null;
function move(){const rect=stage.getBoundingClientRect();star.style.left=(38+Math.random()*Math.max(0,rect.width-76))+'px';star.style.top=(38+Math.random()*Math.max(0,rect.height-76))+'px';}
function tick(){const remaining=Math.max(0,Math.ceil((until-performance.now())/1000));document.getElementById('time').textContent=remaining;if(!remaining){playing=false;star.disabled=true;clearInterval(timer);overlay.hidden=false;document.getElementById('title').textContent='별 '+score+'개를 잡았어요!';document.getElementById('description').textContent='다시 도전해서 나만의 기록을 만들어 보세요.';document.getElementById('start').textContent='다시 시작';}}
document.getElementById('start').addEventListener('click',function(){clearInterval(timer);score=0;playing=true;until=performance.now()+15000;document.getElementById('score').textContent=0;overlay.hidden=true;star.disabled=false;move();tick();timer=setInterval(tick,100);});
star.addEventListener('click',function(){if(!playing)return;if(performance.now()>=until){tick();return;}score++;document.getElementById('score').textContent=score;move();});
addEventListener('resize',function(){if(playing)move();});
})();
<\/script></body></html>`;
