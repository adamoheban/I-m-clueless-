// Nightly build: node build.js
// Reads data.txt -> writes data.js (for the main page) and teams/<CODE>.html (one page per team).
const fs=require('fs');
const lines=fs.readFileSync('data.txt','utf8').split('\n');
let date='',D=[];
for(const l of lines){
  if(l.startsWith('#20')){date=l.slice(1).trim();continue}
  if(!l.trim()||l.startsWith('#'))continue;
  const [t,p,x,s]=l.split('|');D.push([date,t,p,x,s||'c']);
}
fs.writeFileSync('data.js','const D='+JSON.stringify(D)+';\n');
const src=fs.readFileSync('transactions.html','utf8');
const js=src.split('<script>')[1].split('</script>')[0];
const a=js.indexOf('const TEAMS='),b=js.indexOf('const fmt=');
const {TEAMS,TYPES,CBS,ESPN,typeOf}=new Function(js.slice(a,b)+';return {TEAMS,TYPES,CBS,ESPN,typeOf}')();
const fmt=d=>new Date(d+'T12:00:00').toLocaleDateString('en-US',{weekday:'short',month:'short',day:'numeric'});
fs.mkdirSync('teams',{recursive:true});
const codes=Object.keys(TEAMS).sort((x,y)=>(y==='LAD')-(x==='LAD')||TEAMS[x][0].localeCompare(TEAMS[y][0])); // Dodgers always first
for(const c of codes){
  const [name,color]=TEAMS[c];
  const rows=D.filter(r=>r[1]===c);
  const cnt=n=>rows.filter(r=>typeOf(r[3])[0]===n).length;
  let lastDate='';
  const items=rows.length?rows.map(r=>{const t=typeOf(r[3]);let h='';if(r[0]!==lastDate){lastDate=r[0];h=`<li class="day">${fmt(r[0])}</li>`}
    return h+`<li><div class="dot" style="background:${t[2]}"></div><div class="body"><div class="r1"><b>${r[2]}</b><span class="tag" style="background:${t[2]}">${t[0]}</span></div><p>${r[3]} · <a href="${r[4]==='c'?CBS:ESPN}" target="_blank" rel="noopener">${r[4]==='c'?'CBS Sports':'ESPN'} ↗</a></p></div></li>`}).join(''):'<li class="none">No transactions in this window.</li>';
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
li{position:relative;display:flex;gap:.9rem;padding:.35rem 0}
li.day{display:block;padding:.9rem 0 .2rem 1.9rem;font-weight:800;color:var(--accent);font-size:.8rem;letter-spacing:.12em;text-transform:uppercase}
.dot{flex:none;width:.95rem;height:.95rem;border-radius:50%;margin-top:.35rem;border:3px solid var(--bg);z-index:1}
.body{flex:1;background:var(--panel);border:1px solid var(--line);border-left:4px solid var(--c);border-radius:12px;padding:.5rem .9rem}
.r1{display:flex;gap:.5rem;align-items:center;flex-wrap:wrap}
.tag{font-size:.64rem;font-weight:800;letter-spacing:.06em;text-transform:uppercase;border-radius:6px;padding:.1rem .45rem;color:#111}
p{color:#c5cede;font-size:.88rem}p a{color:var(--muted);font-size:.76rem}p a:hover{color:var(--accent)}
.none{display:block;color:var(--muted);padding:1.5rem 0}
nav{max-width:44rem;margin:0 auto;padding:0 1rem 2.5rem;display:flex;flex-wrap:wrap;gap:.35rem}
nav a{font-size:.72rem;font-weight:800;text-decoration:none;color:var(--muted);border:1px solid var(--line);border-radius:8px;padding:.2rem .5rem}
nav a.on{background:var(--accent);color:#111;border-color:var(--accent)}
footer{text-align:center;color:var(--muted);font-size:.74rem;padding:0 1rem 2.5rem}
</style></head><body>
<div class="banner"><div class="in"><a class="back" href="../transactions.html">← All teams</a>
<div class="kick">Transaction Wire</div><div class="badge">${c}</div><h1>${name}</h1>
<div class="stats"><div><b>${rows.length}</b><small>Moves</small></div><div><b>${cnt('Signing')}</b><small>Signings</small></div><div><b>${cnt('Trade')+cnt('Waivers')}</b><small>Trades/claims</small></div><div><b>${cnt('DFA')}</b><small>DFAs</small></div><div><b>${cnt('Free Agency')}</b><small>Free agents</small></div></div></div></div>
<main><ul>${items}</ul></main>
<nav>${nav}</nav>
<footer>Compiled from CBS Sports and ESPN. Unofficial fan project; badge is an original color tag, not an official mark.</footer>
</body></html>`);
}
console.log('built',D.length,'moves,',codes.length,'team pages');

// ---------- Top Transactions + Blockbuster Trades pages ----------
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
const readRows=f=>fs.readFileSync(f,'utf8').split('\n').filter(l=>l.trim()&&!l.startsWith('#')).map(l=>l.split('|'));
const money=m=>m>=1?'$'+(Math.round(m*100)/100).toString().replace(/\.0+$/,'')+'M':'$'+Math.round(m*1000)+'K';
const baseCss=`:root{--bg:#0b0f17;--panel:#131a26;--ink:#eef2f8;--muted:#8b97ab;--line:#243049;--accent:#ffd23f}
*{box-sizing:border-box;margin:0}
body{background:radial-gradient(1200px 500px at 50% -200px,#1b2a4a 0%,var(--bg) 60%) no-repeat,var(--bg);color:var(--ink);font:16px/1.5 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;min-height:100vh}
header{padding:2rem 1rem 1rem;text-align:center}
.back{color:var(--muted);text-decoration:none;font-size:.85rem;display:block;margin-bottom:1rem}
.kicker{letter-spacing:.3em;font-size:.7rem;color:var(--accent);font-weight:700;text-transform:uppercase}
h1{font-size:clamp(2rem,8vw,3.2rem);font-weight:900;letter-spacing:-.02em;margin:.2rem 0}h1 span{color:var(--accent)}
.sub{color:var(--muted);font-size:.9rem;max-width:34rem;margin:0 auto}
main{max-width:44rem;margin:0 auto;padding:1rem 1rem 3rem;display:grid;gap:.9rem}
.card{background:var(--panel);border:1px solid var(--line);border-radius:18px;overflow:hidden;border-left:6px solid var(--c)}
.top{display:flex;gap:.8rem;align-items:center;padding:.9rem 1rem;background:linear-gradient(100deg,color-mix(in srgb,var(--c) 55%,transparent),#0000 80%)}
.rank{font-size:1.6rem;font-weight:900;color:var(--accent);min-width:2rem;text-align:center}
.badge{width:3rem;height:3rem;border-radius:14px;display:grid;place-items:center;background:var(--c);color:#fff;font-weight:900;border:2px solid #ffffff55;text-shadow:0 1px 2px #0008;flex:none}
.who h2{font-size:1.1rem;line-height:1.2}.who small{color:#ffffffb8}
.amt{margin-left:auto;text-align:right}.amt b{font-size:1.5rem;display:block;line-height:1.1}.amt small{color:#ffffffb8;font-size:.72rem}
.bar{height:5px;background:#0006}.bar i{display:block;height:100%;background:var(--accent)}
.body{padding:.7rem 1rem .9rem;color:#c5cede;font-size:.88rem}
.body a{color:var(--muted);font-size:.78rem}.body a:hover{color:var(--accent)}
.empty{background:var(--panel);border:1px dashed var(--line);border-radius:18px;padding:1.6rem 1.2rem;text-align:center;color:var(--muted)}
.empty b{color:var(--ink);display:block;font-size:1.1rem;margin-bottom:.4rem}
h3{font-size:.8rem;letter-spacing:.14em;text-transform:uppercase;color:var(--accent);margin-top:.6rem}
li{list-style:none;background:var(--panel);border:1px solid var(--line);border-radius:12px;padding:.55rem .9rem;font-size:.88rem;color:#c5cede}li b{color:var(--ink)}li span{color:var(--muted);font-size:.76rem;float:right}
ul{display:grid;gap:.4rem;padding:0}
footer{text-align:center;color:var(--muted);font-size:.76rem;padding:0 1rem 2.5rem}footer a{color:var(--muted)}`;
const shell=(title,kicker,h1,sub,body)=>`<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${title}</title><style>${baseCss}</style></head><body>
<header><a class="back" href="transactions.html">← MLB Transaction Wire</a><div class="kicker">${kicker}</div><h1>${h1}</h1><p class="sub">${sub}</p></header>
<main>${body}</main>
<footer>Figures are as reported by the linked sources and may change when deals are finalized. Unofficial fan project; team badges are original color tags, not official marks.</footer></body></html>`;

// Top Transactions
{
  const rows=readRows('contracts.txt').map(r=>({date:r[0],team:r[1],player:r[2],pos:r[3],years:+r[4],total:r[5]===''?null:+r[5],note:r[6],srcLabel:r[7],url:r[8]}));
  const known=rows.filter(r=>r.total!==null).sort((a,b)=>b.total-a.total||b.years-a.years);
  const unknown=rows.filter(r=>r.total===null);
  const max=known.length?known[0].total:1;
  const card=(r,i)=>{const t=TEAMS[r.team]||[r.team,'#444'];const aav=r.total!==null&&r.years?money(r.total/r.years)+' / yr':'';
    return `<section class="card" style="--c:${t[1]}"><div class="top"><div class="rank">${i||'–'}</div><div class="badge">${r.team}</div><div class="who"><h2>${esc(r.player)}</h2><small>${esc(t[0])} · ${esc(r.pos)} · ${r.years}-year deal</small></div><div class="amt"><b>${r.total!==null?money(r.total):'TBD'}</b><small>${aav}</small></div></div>${r.total!==null?`<div class="bar"><i style="width:${Math.max(3,r.total/max*100)}%"></i></div>`:''}<div class="body">${esc(r.note)} <a href="${esc(r.url)}" target="_blank" rel="noopener">${esc(r.srcLabel)} ↗</a></div></section>`};
  const body=known.map((r,i)=>card(r,i+1)).join('')+(unknown.length?`<h3>Dollar terms not yet reported</h3>`+unknown.map(r=>card(r,0)).join(''):'')+(rows.length?'':'<div class="empty"><b>No signings yet</b>Free agency is just getting started.</div>');
  const total=known.reduce((s,r)=>s+r.total,0);
  fs.writeFileSync('top-transactions.html',shell('Top Transactions','Free agency, ranked by dollars','Top <span>Transactions</span>',`Free-agent signings ranked by total contract value. ${rows.length} signings tracked, ${money(total)} committed so far.`,body));
}
// Blockbuster Trades
{
  const rows=readRows('blockbusters.txt').map(r=>({date:r[0],teams:r[1].split(','),head:r[2],det:r[3],srcLabel:r[4],url:r[5]})).sort((a,b)=>b.date.localeCompare(a.date));
  const cards=rows.map(r=>{const c=(TEAMS[r.teams[0]]||['','#444'])[1];return `<section class="card" style="--c:${c}"><div class="top"><div class="badge">${r.teams.map(esc).join('<br>')}</div><div class="who"><h2>${esc(r.head)}</h2><small>${fmt(r.date)}</small></div></div><div class="body">${esc(r.det)} <a href="${esc(r.url)}" target="_blank" rel="noopener">${esc(r.srcLabel)} ↗</a></div></section>`}).join('');
  const recent=D.filter(r=>typeOf(r[3])[0]==='Trade').map(r=>`<li><b>${esc(TEAMS[r[1]][0])}</b>: ${esc(r[2])} — ${esc(r[3])}<span>${fmt(r[0])}</span></li>`).join('');
  const body=(rows.length?cards:`<div class="empty"><b>No blockbusters yet this offseason</b>Every trade so far has been small. When a star changes teams, it shows up here at the top.</div>`)+`<h3>What counts as a blockbuster</h3><div class="empty" style="text-align:left">A star or All-Star-caliber player moves, a big multi-year contract is involved, or three or more notable players or prospects change teams.</div><h3>Every trade so far (${D.filter(r=>typeOf(r[3])[0]==='Trade').length})</h3><ul>${recent}</ul>`;
  fs.writeFileSync('blockbusters.html',shell('Blockbuster Trades','The big ones','Blockbuster <span>Trades</span>','Star-level trades and the biggest deals of the offseason, newest first.',body));
}
console.log('built top-transactions.html and blockbusters.html');

// ---------- Lockout Watch page ----------
{
  const rows=fs.readFileSync('lockout.txt','utf8').split('\n').filter(l=>l.trim()&&!l.startsWith('#')).map(l=>l.split('|'));
  const by=t=>rows.filter(r=>r[0]===t).map(r=>r.slice(1));
  const link=(label,url)=>url?` <a href="${esc(url)}" target="_blank" rel="noopener">${esc(label)} ↗</a>`:'';
  const updated=(by('UPDATED')[0]||[''])[0];
  const st=by('STATUS')[0]||['',''];
  const deadlines=by('DEADLINE').map(r=>`<li><div class="when">${/^\d{4}-/.test(r[0])?fmt(r[0]).replace(/^\w+, /,''):esc(r[0])}</div><div><b>${esc(r[1])}</b><p>${esc(r[2])}${link(r[3],r[4])}</p></div></li>`).join('');
  const pts=t=>by(t).map(r=>`<li>${esc(r[0])}${link(r[1],r[2])}</li>`).join('');
  const offers=by('OFFER').map(r=>`<tr><th>${esc(r[0])}</th><td>${esc(r[1])}</td><td>${esc(r[2])}</td><td>${esc(r[3])}</td></tr>`).join('');
  const news=by('NEWS').sort((a,b)=>b[0].localeCompare(a[0])).map(r=>`<li><div class="when">${fmt(r[0]).replace(/^\w+, /,'')}</div><div><b>${esc(r[1])}</b><p>${esc(r[2])}${link(r[3],r[4])}</p></div></li>`).join('');
  const outlook=by('OUTLOOK').map(r=>`<div class="sc"><h4>${esc(r[0])}</h4><p>${esc(r[1])}${link(r[2],r[3])}</p></div>`).join('');
  const hist=by('HISTORY').map(r=>`<li><b>${esc(r[0])}</b>: ${esc(r[1])}${link(r[2],r[3])}</li>`).join('');
  const css=`${baseCss}
.status{max-width:44rem;margin:1rem auto 0;background:linear-gradient(135deg,#3a1d1d,#131a26);border:1px solid #6b2e2e;border-radius:18px;padding:1.1rem 1.2rem;text-align:left}
.status h2{font-size:1.25rem;line-height:1.25}.status p{color:#d8c4c4;font-size:.9rem;margin-top:.4rem}
.cd{display:flex;gap:.5rem;margin-top:.9rem}.cd div{background:#0008;border:1px solid #ffffff22;border-radius:12px;padding:.4rem .7rem;text-align:center;min-width:3.6rem}.cd b{font-size:1.5rem;display:block;line-height:1.1}.cd small{font-size:.62rem;text-transform:uppercase;letter-spacing:.1em;color:#ffffffa0}
.cdl{font-size:.72rem;color:#d8c4c4;margin-top:.5rem}
.tl{display:grid;gap:.5rem;padding:0}.tl li{display:flex;gap:.9rem;background:var(--panel);border:1px solid var(--line);border-radius:12px;padding:.7rem .9rem;float:none}
.when{flex:none;width:5.2rem;font-size:.74rem;font-weight:800;color:var(--accent);text-transform:uppercase;letter-spacing:.05em}.tl b{color:var(--ink)}.tl p{color:#c5cede;font-size:.86rem;margin-top:.1rem}
.cols{display:grid;gap:.9rem;grid-template-columns:repeat(auto-fit,minmax(18rem,1fr))}
.col{background:var(--panel);border:1px solid var(--line);border-radius:18px;padding:.9rem 1rem}.col.o{border-top:4px solid #5aa9ff}.col.p{border-top:4px solid #ff9f5a}
.col h3{margin:0 0 .5rem}.col ul{gap:.5rem}.col li{background:none;border:0;padding:0;font-size:.88rem;float:none}
.col a,.tl a,.sc a{color:var(--muted);font-size:.76rem;text-decoration:none}.col a:hover,.tl a:hover,.sc a:hover{color:var(--accent)}
.tw{overflow-x:auto;border:1px solid var(--line);border-radius:14px}table{border-collapse:collapse;width:100%;min-width:34rem;font-size:.82rem}
th,td{padding:.55rem .7rem;text-align:left;border-bottom:1px solid var(--line);vertical-align:top;color:#c5cede}thead th{background:#1a2333;color:var(--accent);font-size:.7rem;text-transform:uppercase;letter-spacing:.08em}tbody th{color:var(--ink);font-weight:700;background:#101722}
.sc{background:var(--panel);border:1px solid var(--line);border-radius:14px;padding:.8rem 1rem}.sc h4{font-size:.98rem}.sc p{color:#c5cede;font-size:.86rem;margin-top:.2rem}
.note{color:var(--muted);font-size:.78rem;text-align:center}
main{max-width:52rem}`;
  const page=`<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Lockout Watch</title><style>${css}</style></head><body>
<header><a class="back" href="transactions.html">← MLB Transaction Wire</a><div class="kicker">MLB labor talks</div><h1>Lockout <span>Watch</span></h1><p class="sub">Where owners and players stand, what has been offered, the deadlines, and what the reporting says could happen. Updated ${updated?fmt(updated).replace(/^\w+, /,''):''}.</p>
<div class="status"><h2>${esc(st[0])}</h2><p>${esc(st[1])}${link(st[2],st[3])}</p><div class="cd" id="cd"></div><div class="cdl">until the contract expires (Dec. 1, 11:59 p.m. ET)</div></div></header>
<main>
<h3>Key dates</h3><ul class="tl">${deadlines}</ul>
<h3>Where each side stands</h3><div class="cols"><div class="col o"><h3>Owners / MLB</h3><ul>${pts('OWNERS')}</ul></div><div class="col p"><h3>Players / MLBPA</h3><ul>${pts('PLAYERS')}</ul></div></div>
<h3>What has been offered</h3><div class="tw"><table><thead><tr><th>Issue</th><th>MLB</th><th>MLBPA</th><th>Where it stands</th></tr></thead><tbody>${offers}</tbody></table></div>
<h3>Latest news</h3><ul class="tl">${news}</ul>
<h3>What could happen</h3><div class="cols">${outlook}</div>
<p class="note">These scenarios summarize published reporting and insider opinion. They are not predictions by this site, and betting-market figures may be out of date.</p>
<h3>Past stoppages</h3><ul>${hist}</ul>
</main>
<footer>Positions are as described by the linked sources; each side disputes the other's characterization. Neutral summary, not an endorsement of either side. Unofficial fan project.</footer>
<script>(function(){var end=Date.UTC(2026,11,2,4,59,0);function t(){var d=Math.max(0,end-Date.now()),s=Math.floor(d/1000),D=Math.floor(s/86400),H=Math.floor(s%86400/3600),M=Math.floor(s%3600/60),S=s%60;document.getElementById('cd').innerHTML=[[D,'days'],[H,'hrs'],[M,'min'],[S,'sec']].map(function(x){return '<div><b>'+x[0]+'</b><small>'+x[1]+'</small></div>'}).join('')}t();setInterval(t,1000)})();</script>
</body></html>`;
  fs.writeFileSync('lockout.html',page);
  console.log('built lockout.html');
}
