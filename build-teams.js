// Generates teams/<CODE>.html from the data inside transactions.html.
// Run: node build-teams.js
const fs=require('fs');
const src=fs.readFileSync('transactions.html','utf8');
const js=src.split('<script>')[1].split('</script>')[0];
const start=js.indexOf('const TEAMS='), end=js.indexOf('function typeOf');
const ctx=new Function(js.slice(start,end)+';return {TEAMS,D,TYPES,CBS,ESPN}')();
const {TEAMS,D,TYPES,CBS,ESPN}=ctx;
const typeOf=t=>{if(/waivers from|traded/i.test(t))return TYPES[1];for(const x of TYPES)if(x[1].test(t))return x;return['Move',0,'#ddd']};
const fmt=d=>new Date(d+'T12:00:00').toLocaleDateString('en-US',{weekday:'short',month:'short',day:'numeric'});
fs.mkdirSync('teams',{recursive:true});
const codes=Object.keys(TEAMS).sort((a,b)=>TEAMS[a][0].localeCompare(TEAMS[b][0]));
for(const c of codes){
  const [name,color]=TEAMS[c];
  const rows=D.filter(r=>r[1]===c);
  const cnt=n=>rows.filter(r=>typeOf(r[3])[0]===n).length;
  const items=rows.length?rows.map(r=>{const t=typeOf(r[3]);return `<li><div class="dot" style="background:${t[2]}"></div><div class="body"><div class="r1"><b>${r[2]}</b><span class="tag" style="background:${t[2]}">${t[0]}</span><span class="d">${fmt(r[0])}</span></div><p>${r[3]} · <a href="${r[4]==='c'?CBS:ESPN}" target="_blank" rel="noopener">${r[4]==='c'?'CBS Sports':'ESPN'} ↗</a></p></div></li>`}).join(''):'<li class="none">No transactions in this window. Check back after the next update.</li>';
  const nav=codes.map(k=>`<a href="${k}.html"${k===c?' class="on"':''}>${k}</a>`).join('');
  fs.writeFileSync(`teams/${c}.html`,`<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${name} Transactions</title>
<style>
:root{--c:${color};--bg:#0b0f17;--panel:#131a26;--ink:#eef2f8;--muted:#8b97ab;--line:#243049;--accent:#ffd23f}
*{box-sizing:border-box;margin:0}
body{background:var(--bg);color:var(--ink);font:16px/1.5 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif}
.banner{position:relative;overflow:hidden;padding:1.2rem 1rem 2.4rem;background:linear-gradient(135deg,var(--c),#0b0f17 95%);border-bottom:3px solid var(--accent)}
.banner::before{content:"${c}";position:absolute;right:-1rem;bottom:-2.2rem;font-size:clamp(9rem,40vw,18rem);font-weight:900;color:#fff;opacity:.08;letter-spacing:-.05em;line-height:1}
.banner::after{content:"";position:absolute;left:-60px;top:-60px;width:220px;height:220px;border:2px solid #ffffff22;transform:rotate(45deg)}
.in{position:relative;max-width:44rem;margin:0 auto}
.back{color:#ffffffc0;text-decoration:none;font-size:.85rem}
.kick{letter-spacing:.3em;font-size:.68rem;color:var(--accent);font-weight:800;text-transform:uppercase;margin-top:1.4rem}
h1{font-size:clamp(2rem,9vw,3.4rem);font-weight:900;letter-spacing:-.02em;line-height:1.05}
.badge{display:inline-grid;place-items:center;width:4rem;height:4rem;border-radius:18px;background:var(--c);border:3px solid #fff;font-weight:900;font-size:1.3rem;box-shadow:0 8px 30px #0008;margin-bottom:.6rem}
.stats{display:flex;gap:.5rem;margin-top:1rem;flex-wrap:wrap}
.stats div{background:#0007;border:1px solid #ffffff22;border-radius:12px;padding:.4rem .8rem}
.stats b{font-size:1.3rem;display:block;line-height:1.1}.stats small{font-size:.68rem;color:#ffffffa0;text-transform:uppercase;letter-spacing:.08em}
main{max-width:44rem;margin:0 auto;padding:1.2rem 1rem}
ul{list-style:none;padding:0;position:relative}
ul::before{content:"";position:absolute;left:.45rem;top:.5rem;bottom:.5rem;width:2px;background:var(--line)}
li{position:relative;display:flex;gap:.9rem;padding:.55rem 0}
.dot{flex:none;width:.95rem;height:.95rem;border-radius:50%;margin-top:.35rem;border:3px solid var(--bg);z-index:1}
.body{flex:1;background:var(--panel);border:1px solid var(--line);border-left:4px solid var(--c);border-radius:12px;padding:.6rem .9rem}
.r1{display:flex;gap:.5rem;align-items:center;flex-wrap:wrap}
.tag{font-size:.64rem;font-weight:800;letter-spacing:.06em;text-transform:uppercase;border-radius:6px;padding:.1rem .45rem;color:#111}
.d{margin-left:auto;color:var(--muted);font-size:.78rem}
p{color:#c5cede;font-size:.9rem}p a{color:var(--muted);font-size:.78rem}p a:hover{color:var(--accent)}
.none{display:block;color:var(--muted);padding:1.5rem 0}
nav{max-width:44rem;margin:0 auto;padding:0 1rem 2.5rem;display:flex;flex-wrap:wrap;gap:.35rem}
nav a{font-size:.72rem;font-weight:800;text-decoration:none;color:var(--muted);border:1px solid var(--line);border-radius:8px;padding:.2rem .5rem}
nav a.on{background:var(--accent);color:#111;border-color:var(--accent)}
footer{text-align:center;color:var(--muted);font-size:.74rem;padding:0 1rem 2.5rem}
</style></head><body>
<div class="banner"><div class="in"><a class="back" href="../transactions.html">← All teams</a>
<div class="kick">Transaction Wire</div><div class="badge">${c}</div><h1>${name}</h1>
<div class="stats"><div><b>${rows.length}</b><small>Moves</small></div><div><b>${cnt('Signing')}</b><small>Signings</small></div><div><b>${cnt('Trade')}</b><small>Trades</small></div><div><b>${cnt('Release')}</b><small>Releases</small></div></div></div></div>
<main><ul>${items}</ul></main>
<nav>${nav}</nav>
<footer>Compiled from CBS Sports and ESPN. Unofficial fan project; badge is an original color tag, not an official mark.</footer>
</body></html>`);
}
console.log('built',codes.length,'team pages');
