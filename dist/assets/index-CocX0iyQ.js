(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))s(i);new MutationObserver(i=>{for(const o of i)if(o.type==="childList")for(const r of o.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&s(r)}).observe(document,{childList:!0,subtree:!0});function e(i){const o={};return i.integrity&&(o.integrity=i.integrity),i.referrerPolicy&&(o.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?o.credentials="include":i.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function s(i){if(i.ep)return;i.ep=!0;const o=e(i);fetch(i.href,o)}})();const B=(n,t=0,e=1)=>n<t?t:n>e?e:n,kt=999999,et=36;class f{constructor(t=1){this.n=Math.random()*t}get(){return this.n}static get(){return Math.random()}static random(){return Math.random()}static randomInt(t=0){return Math.floor(Math.random()*t)}static randomBell(t=1){return Math.random()*t-Math.random()*t}static randomAngle(){return Math.random()*Math.PI*2}static pickRandom(t=[]){return t[f.randomInt(t.length)]}static randomString(t=kt){return Math.round(Math.random()*t).toString(et)}static uniqueString(){return Number(new Date).toString(et)+f.randomString()}static pick(t=[]){return t[f.randomInt(t.length)]}static chance(t=0){return Math.random()>t}}function rt(n,t){const[e,s]=n;return Math.sqrt((e-t[0])**2+(s-t[1])**2)}function ct(n,t,e){const[s,i]=n,o=Math.floor(t);for(let r=i-o;r<=i+o;r+=1)for(let c=s-o;c<=s+o;c+=1){const a=rt(n,[c,r]);a<=t&&e(c,r,a)}}function at(n,t){return[n[0]+t[0],n[1]+t[1]]}function lt(n,t){return[n[0]-t[0],n[1]-t[1]]}const F=["food","science","culture","gold","production"],Ut={food:"🌾",science:"🧪",culture:"🎭",gold:"🪙",production:"⚙️"},N=()=>{},dt=[-1,-1],ut=[0,-1],ht=[1,-1],ft=[-1,0],mt=[1,0],pt=[-1,1],gt=[0,1],yt=[1,1],At=[0,0],Tt=[ut,ht,mt,yt,gt,pt,ft,dt];class l{constructor(t=[],e=void 0){this.arr=null,this.size=[...t],this.arr=this.getBlankArray(e)}static loopOverGrid(t,e=N,s=N,i=N){const[o,r]=t;for(let c=0;c<r;c+=1){s(c);for(let a=0;a<o;a+=1)e(a,c);i(c)}}static getFlexibleXYArguments(t){return[...t[0]instanceof Array?[...t[0]]:[t[0],t[1]]]}forEachCell(t=N,e=N,s=N){return l.loopOverGrid(this.size,t,e,s)}getBlankArray(t){const e=[];return this.forEachCell((s,i)=>e[i].push(t),()=>e.push([])),e}get(...t){const[e,s]=l.getFlexibleXYArguments(t);try{return this.arr[s][e]}catch{}}set(...t){const[e,s]=l.getFlexibleXYArguments(t),i=t[0]instanceof Array?t[1]:t[2];try{this.arr[s][e]=i}catch{}}clear(t){this.arr=this.getBlankArray(t)}onEdge(...t){const[e,s]=l.getFlexibleXYArguments(t);if(e===0||s===0)return!0;const[i,o]=this.size;return e===i-1||s===o-1}inBounds(...t){const[e,s]=l.getFlexibleXYArguments(t);if(e<0||s<0)return!1;const[i,o]=this.size;return e<i&&s<o}}l.DIRECTIONS=Tt;l.NW=dt;l.N=ut;l.NE=ht;l.W=ft;l.E=mt;l.SW=pt;l.S=gt;l.SE=yt;l.ZERO=At;function Nt(n=1,t=0){return t+Math.random()*(n-t)}function nt(n,t=0){return Math.floor(Nt(n,t))}const xt={W:{name:"water",land:!1},G:{name:"ground",land:!0}},q=()=>{};let Lt=class{constructor(t,e,s=18){this.size=[t,e],this.terrain=new l(this.size,null),this.tileSize=s,this.generate()}getPixelSize(){return[this.size[0]*this.tileSize,this.size[1]*this.tileSize]}loopOverMap(t=q,e=q,s=q){return this.terrain.forEachCell(t,e,s)}inBounds(...t){return this.terrain.inBounds(...t)}getTerrainTypeObject(t){return xt[this.terrain.get(t)]}isLand(t){return this.inBounds(t)?this.getTerrainTypeObject(t).land:!1}generate(){const[e,s]=this.size,i=e/2,o=s/2,r=Math.hypot(i,o);this.terrain.clear();const c=(a,u)=>{const g=Math.hypot(i-a,o-u)/r;return Math.random()+.1>g?"G":"W"};this.loopOverMap((a,u)=>{this.terrain.set(a,u,c(a,u))}),this.loopOverMap((a,u)=>{this.terrain.onEdge(a,u)&&this.terrain.set(a,u,"W")})}render(){let t="";this.loopOverMap((e,s)=>{const i=this.terrain.get(e,s);t+=`<div class="map-cell map-terrain-${i}" id="map-cell-${e}-${s}"></div>`},()=>{t+='<div class="map-row">'},()=>{t+="</div>"}),document.getElementById("map-terrain").innerHTML=t}getRandomCoordinates(t){if(!t){const[i,o]=this.size;return[nt(0,i),nt(0,o)]}const e=1e3;let s=[0,0];for(let i=0;i<e;i+=1){s=this.getRandomCoordinates();const[o,r]=s;if(this.terrain.get(o,r)===t)return s}return s}};function Ct(n=""){return[n,Number(new Date).toString(36),Math.round(Math.random()*9999)].join("_")}const $t=Math.PI*2;class Ot{constructor(t,e,s,i){this.color=s,this.nationalClass=e,this.id=t||Ct("N"),F.forEach(o=>{this[o]=0}),this.blood=0,this.fog=new l(i.size,1),this.borders=new l(i.size,0),this.map=i,this.capital=null}forEachCurrency(t){F.forEach(e=>{t(e,this[e])})}gain(t={}){this.forEachCurrency(e=>{t[e]&&(this[e]+=Number(t[e]))})}canPay(t={}){let e=!0;return this.forEachCurrency(s=>{this[s]<Number(t[s]||0)&&(e=!1)}),e}pay(t={}){this.forEachCurrency(e=>{t[e]&&(this[e]-=Number(t[e]))})}claim(t,e=.72,s=1){return this.borders.get(t)>=e||this.culture<s?!1:(this.culture-=s,this.borders.set(t,e),!0)}clearFog(t,e=0){this.fog.set(t,0),ct(t,e,(s,i)=>{this.fog.set(s,i,0)})}getNationalUnits(t){return t.filter(e=>e.nationId===this.id)}renderBorder(t,e,s="map-borders"){const i=document.getElementById("map-borders-fill"),[o,r]=t;i.width=o,i.height=r;const c=i.getContext("2d");c.clearRect(0,0,o,r);const a=e/2;this.borders.forEachCell((E,R)=>{if(!this.borders.get(E,R))return;const U=E*e+a,P=R*e+a;c.beginPath(),c.arc(U,P,this.borders.get(E,R)*e,0,$t),c.fillStyle="#fff",c.fill(),c.closePath()});const u=document.getElementById(s);u.width=o,u.height=r;const d=u.getContext("2d");d.clearRect(0,0,o,r),d.fillStyle=this.color;const g=c.getImageData(0,0,o,r),{data:w}=g,Y=o*r,L=.8;for(let E=0;E<Y;E+=1){const U=E*4+3,P=o*4;if(w[U]>L)continue;const Z=w[U-4],K=w[U+4],V=w[U-P],J=w[U+P];if(K&&K>L||Z&&Z>L||J&&J>L||V&&V>L){const tt=parseInt(E/o,10),wt=E-tt*o;d.fillRect(wt,tt,1,1)}}d.fill()}renderFog(t,e,s="map-fog"){const i=document.getElementById(s);if(!i)throw Error(`Could not render fog to ${s}`);const[o,r]=t;i.width=o,i.height=r;const c=i.getContext("2d");c.clearRect(0,0,o,r),c.beginPath(),this.fog.forEachCell((a,u)=>{this.fog.get(a,u)&&c.rect(a*e,u*e,e,e)}),c.fillStyle="#000",c.fill(),c.closePath()}render(t,e){const s=t||this.map,i=s.getPixelSize();this.renderFog(i,s.tileSize,e),this.renderBorder(i,s.tileSize)}}class ${constructor(t,e="E",s=["thing"],i="map-cities"){this.id=Ct(e),this.coords=t,this.classes=s,this.containerId=i,this.removed=!1,this.decay=1/0}update(){this.decay-=1,this.decay<=0&&this.remove()}remove(){this.removed=!0,this.derez()}move(t,e){this.coords[0]+=t,this.coords[1]+=e}getMove(t,e){return[this.coords[0]+t,this.coords[1]+e]}getName(){return""}getInnerHtml(){return""}getDistance(t){return rt(this.coords,t)}getClassList(){return[this.id,...this.classes]}getContainerElement(){return document.getElementById(this.containerId)}getElement(t){return(t||this.getContainerElement()).querySelector(`.${this.id}`)}derez(){this.removed=!0;const t=this.getElement();t&&t.remove()}render(t){if(this.removed){this.derez();return}const e=this.getContainerElement();let s=this.getElement(e);if(!s){s=document.createElement("div"),s.dataset.id=this.id;const a=this.getName();a&&(s.title=a),e.appendChild(s)}try{s.classList.add(...this.getClassList())}catch(a){throw console.log(s),Error(a)}s.innerHTML=this.getInnerHtml()||"";const[i,o]=this.coords,[r,c]=t;s.style.transform=`translate(${i*r}px, ${o*c}px)`}}const k={attack:0,convert:0,bribe:0},S={L:{name:"Leader",intelligent:1,explore:.5,defense:{...k,bribe:2,convert:2},harvest:1,research:1,craft:1,invest:1,produce:1,specialNotes:"Can set flags to rally units",cost:null},W:{name:"Warrior",attack:2,defense:{...k,attack:1,bribe:2},harvest:0,invest:1,produce:1,specialNotes:"Good vs. Merchants",cost:{production:2,gold:1}},A:{name:"Artist",convert:2,defense:{...k,attack:2,convert:1},claim:1,harvest:1,research:1,craft:3,invest:1,specialNotes:"Can claim territory; Good vs. Warriors",cost:{culture:2,production:1}},M:{name:"Merchant",bribe:2,defense:{...k,bribe:1,convert:2},harvest:1,research:1,invest:3,craft:1,produce:1,specialNotes:"Good vs. Artists",cost:{gold:2,production:1}},E:{name:"Scout",explore:1.5,defense:{...k},harvest:1,research:1,craft:1,invest:1,produce:1,specialNotes:"Can remove fog of war 1 square in all directions",cost:{production:2}},B:{name:"Builder",defense:{...k},harvest:2,research:2,craft:1,invest:1,produce:3,cost:{production:1,culture:1,gold:1}},S:{name:"Scientist",defense:{...k},harvest:1,research:3,craft:1,invest:1,produce:1,cost:{production:1,culture:1,science:1}},F:{name:"Farmer",defense:{...k},harvest:3,research:0,craft:1,invest:1,produce:2,cost:{production:1,culture:1}}},Rt=9;class W extends ${constructor(t,e){super(e,"C",["city"],"map-cities"),this.nationId=t,this.population=1,this.availableUnitTiers={E:1,W:1,A:0,M:0,B:0,S:0,F:1},this.food=0}getMaxTier(){return Math.min(this.population,Rt)}static getTieredCost(t,e=1){const s={};return Object.keys(t).forEach(i=>{s[i]=(t[i]||0)*e}),s}getUnitTier(t){return this.availableUnitTiers[t]}getUnitBuildCost(t){const{cost:e}=S[t],s=this.getUnitTier(t);return W.getTieredCost(e,s)}getUnlockUnitTierCost(t){const e=this.getUnitTier(t);if(e>=this.getMaxTier())return{};const{cost:s}=S[t],i=W.getTieredCost(s,1);return i.science=(i.science||0)+(e+1)*2,i}unlockUnitTier(t){this.availableUnitTiers[t]=Math.min(this.availableUnitTiers[t]+1,this.getMaxTier())}getPopFoodThreshold(){return this.population*5}feed(t={}){this.food+=t.food||0;const e=this.getPopFoodThreshold();this.food<=e||(this.food-=e,this.population+=1)}getInfoHtml(){return`<h1>City <span class="pop">Pop: ${this.population}</span></h1>
			<div>🌾${this.food}/${this.getPopFoodThreshold()}</div>
		`}getInterfaceHtml(t){const e=Object.keys(this.availableUnitTiers),s=r=>Object.keys(r).map(c=>`${r[c]}${Ut[c]}`).join(" "),i=e.map(r=>{const c=this.availableUnitTiers[r],a=S[r],u=this.getUnitBuildCost(r),g=`
				<button type="button"
					${!t.canPay(u)?'disabled="disabled"':""}
					class="buy-unit"
					data-type="${r}"
					data-city="${this.id}"
					data-tier="${c}"
					>
					<span class="city-unit-cost">${s(u)}</span>
				</button>`;return`<li>
				<span>(${r}) ${a.name} <span class="tier">${c}</span></span>
				${c?g:"N/A"}
			</li>`}),o=e.map(r=>{const c=this.availableUnitTiers[r],a=S[r],u=this.getUnlockUnitTierCost(r),d=c===this.getMaxTier(),g=d?!0:!t.canPay(u),w=d?"MAX":`${c} &rarr; ${c+1}`,Y=d?"Raise pop":s(u);return`<li>
				<span>(${r}) ${a.name} <span class="tier">${w}</span></span>
				<button type="button"
					${g?'disabled="disabled"':""}
					class="upgrade-unit"
					data-type="${r}"
					data-city="${this.id}"
					>
					${Y}
				</button>
			</li>`});return`
			<div class="city-units">
				<input type="radio" id="show-build-list" name="show-city-list" checked="checked" />
				<label for="show-build-list">Build</label>
				<input type="radio" id="show-upgrade-list" name="show-city-list" />
				<label for="show-upgrade-list">Upgrade</label>
				<ul id="city-build-list">${i.join("")}</ul>
				<ul id="city-upgrade-list">${o.join("")}</ul>
			</div>
		`}getName(){const[t,e]=this.coords;return`City (${t}, ${e})`}getInnerHtml(){return this.population}}class Pt extends ${constructor(t,e,s){super(s,"D",["district"],"map-districts"),this.cityId=e,this.nationId=t}}const Bt={harvest:"🌾Harvest Food",research:"🧪Research Science",craft:"🎭Culture Crafting",invest:"🪙Invest Coins",produce:"⚙️Production"},st=["attack","convert","bribe"],Ht=["harvest","research","craft","invest","produce"];class zt extends ${constructor(t,e,s,i,o){super(i,"U",["unit"],"map-units"),this.nationId=t,this.nationalClass=e,this.type=s,this.displayHtml=o,this.commandQueue=[],this.maxAxisMovement=1,this.tier=1,this.dead=!1}queueCommand(t){this.commandQueue.push(t)}popCommand(){return this.commandQueue.shift()}clearCommands(){this.commandQueue.length=0}hasCommands(){return this.commandQueue.length>0}getSkill(t){return(S[this.type][t]||0)+(this.tier-1)}getAttackSkill(){return st.filter(e=>this.getSkill(e))[0]||null}getDefenseVersusAttack(t){return(S[this.type].defense[t]||0)+(this.tier-1)}kill(){this.dead=!0,this.remove()}getName(){return S[this.type].name}getInnerHtml(){return this.displayHtml||this.type}getInfoHtml(){const t=S[this.type],{defense:e}=t,s=d=>{let g="";return d>1?g="good":d<=0&&(g="bad"),`class="${g}"`},i=d=>`<span ${s(d)}>${d}</span>`,o=Object.keys(e).map(d=>`<li>${d}: ${i(e[d])}</li>`),r=Ht.map(d=>`<li>${Bt[d]}: x${i(this.getSkill(d))}</li>`),c=st.filter(d=>this.getSkill(d)),a=c.length?c.map(d=>`<li>${d}: ${this.getSkill(d)}</li>`):['<li class="bad">No attacks</li>'];return`
			<h1>${this.getName()} <span class="tier">Tier ${this.tier}</span></h1>
			<div>
				Harvest skills:
				<ul>
					${r.join("")}
				</ul>
			</div>
			<div>
				Attacks:
				<ul>
					${a.join("")}
				</ul>
			</div>
			<div>
				Defense versus...
				<ul>
					${o.join("")}
				</ul>
			</div>
			${t.specialNotes?`<div>Notes: ${t.specialNotes}</div>`:""}
		`}move(t,e){const s=this.maxAxisMovement*-1;super.move(B(t,s,this.maxAxisMovement),B(e,s,this.maxAxisMovement))}getMove(t,e){const s=this.maxAxisMovement*-1;return super.getMove(B(t,s,this.maxAxisMovement),B(e,s,this.maxAxisMovement))}isIntelligent(){return typeof this.intelligent>"u"?S[this.type].intelligent||0:this.intelligent}getClassList(){return[this.id,...this.classes,this.nationalClass]}}const H={wheat:{currency:"food",pickUpSkill:"harvest",amount:1,emoji:"🌾"},discovery:{currency:"science",pickUpSkill:"research",amount:1,emoji:"🧪"},artwork:{currency:"culture",pickUpSkill:"craft",amount:1,emoji:"🎭"},riches:{currency:"gold",pickUpSkill:"invest",amount:1,emoji:"🪙"},production:{currency:"production",pickUpSkill:"produce",amount:1,emoji:"⚙️"},corpse:{currency:"blood",pickUpSkill:"produce",amount:1,decay:10,emoji:"💀"}},Ft=["wheat","discovery","artwork","riches","production"];class Wt extends ${constructor(t,e="random"){super(t,"R",["resource"],"map-resources"),this.type=e,(this.type==="random"||!this.type)&&this.assignRandomType(),this.decay=H[this.type].decay||1/0}assignRandomType(){return this.type=f.pickRandom(Ft),this.type}getPickUpSkill(){return H[this.type].pickUpSkill}canUnitPickUp(t){const e=this.getPickUpSkill();return t.getSkill(e)>0}unitPicksUp(t){const e={};if(!this.canUnitPickUp(t))return e;const s=this.getPickUpSkill(),{currency:i,amount:o}=H[this.type];return e[i]=t.getSkill(s)*o,e}getName(){return this.type}getInnerHtml(){return H[this.type].emoji}}class jt extends ${constructor(t,e,s=[],i=[]){super(i,"F",["flag",...s],"map-flags"),this.nationId=t,this.type=e,this.followUnitId=null,this.magnetizedUnitId=null,this.decay=50}magnetize(t){if(this.magnetizedUnitId&&t.get(this.magnetizedUnitId))return this.magnetizedUnitId;const e={},s=t.getKeys().filter(o=>{const r=t.get(o),c=r.nationId===this.nationId&&r.type===this.type;return c&&(e[o]=r.getDistance(this.coords)),c});if(s.length===0)return null;s.sort((o,r)=>e[o]-e[r]);const[i]=s;return this.magnetizedUnitId=i,this.magnetizedUnitId}getClassList(){return[this.id,...this.classes]}getInnerHtml(){return`🚩<sup>${this.type}</sup>`}}class x extends Map{constructor(t){super(),this.MyClass=t}update(){this.forEach(t=>{t.update&&t.update(),t.removed&&this.remove(t)})}add(t){if(!t.id)throw new Error("Can only add items with an id");super.set(t.id,t)}addNew(...t){const e=new this.MyClass(...t);return e.setup&&e.setup(),this.add(e),e}remove(t){const e=typeof t=="object"?t.id:t;this.get(e).remove(),this.delete(e)}getKeys(){return Array.from(this.keys())}findAt(t=[]){let e;const[s,i]=t;return this.forEach(o=>{o.coords[0]===s&&o.coords[1]===i&&(e=o)}),e}filter(t){const e=[];return this.forEach(s=>{t(s)&&e.push(s)}),e}render(t){this.forEach(e=>{e.render(t)})}}const Dt=1.5,Xt=200,j=20,Yt=18,qt=j*j/8,_t=(n=1)=>new Promise(t=>{setTimeout(t,n)}),b=new x(Ot),C=new x(W),Et=new x(Pt),m=new x(zt),M=new x(Wt),T=new x(jt),p=new Lt(j,j,Yt);let A="";const h={turn:0,nations:b,cities:C,districts:Et,units:m,resources:M,flags:T,map:p,enemy1:null,pc:null,freeStuff(){F.forEach(n=>{y[n]+=100})}},y=b.addNew("player","nation0","#ffff00",p);h.enemy1=b.addNew("enemy","nation1","#ff0000",p);function vt(){const n=[];return C.forEach(t=>n.push(t.coords)),Et.forEach(t=>n.push(t.coords)),m.forEach(t=>n.push(t.coords)),M.forEach(t=>n.push(t.coords)),T.forEach(t=>n.push(t.coords)),n}function G(n,t=0){if(t>Xt)return null;const e=n||vt(),[s,i]=p.size,o=f.randomInt(s),r=f.randomInt(i);return e.reduce((a,u)=>u[0]===o&&u[1]===r?a+1:a,0)>0?G(e,t+1):[o,r]}function z([n,t]){return vt().reduce((i,o)=>o[0]===n&&o[1]===t?i+1:i,0)>0}function O(n,t,e,s,i=0){let o=f.pickRandom(l.DIRECTIONS);if(i>20&&console.log("Trying to find location to spawn unit",i),i>50&&(o=[o[0]*2,o[1]*2]),i>100)return console.error("Could not find spot for unit"),null;const r=at(s.coords,o);return z(r)?O(n,t,e,s,i+1):m.addNew(n,t,e,r)}function Gt(){const n=p.getRandomCoordinates("G"),t=C.addNew(y.id,n);y.capital=t,y.clearFog(n,2),h.pc=m.addNew(y.id,"nation0","L",at(t.coords,[-1,1]),"@"),h.pc.intelligent=0,["W","A","M","E"].forEach(e=>{O(y.id,"nation0",e,t)}),m.forEach(e=>{e.nationId===y.id&&y.clearFog(e.coords)}),y.claim(t.coords,2,0)}function Qt(){let n=p.getRandomCoordinates("G");if(z(n)&&(n=p.getRandomCoordinates("G")),z(n)&&(n=p.getRandomCoordinates("G")),z(n))throw Error("bad coords");h.enemy1.capital=C.addNew(h.enemy1.id,n),h.enemy1.clearFog(n,2),["L","W","W","E"].forEach(t=>{O(h.enemy1.id,"nation1",t,h.enemy1.capital)})}function Zt(){Gt(),Qt()}function Kt(n,t,e){if(!p.inBounds(e[0],e[1])){console.warn("Cannot create flag here");return}T.addNew(n.nationId,t,[n.nationalClass],e)}function Vt(n,t,e){console.log("COMBAT",n,t,e);const s=t.getSkill(n)+f.randomInt(2),i=e.getDefenseVersusAttack(n)+f.randomInt(2);console.log(s,"vs",i),s>i&&(M.addNew(e.coords,"corpse"),e.kill())}async function Jt(n){const t=n.popCommand();if(!t)return!1;const e=typeof t=="string"?t:t[0];if(await _t(50),e==="move"){const[,s,i]=t,[o,r]=n.getMove(s,i);return p.inBounds(o,r)?(n.move(s,i),!0):!1}if(e==="spawn"){const[,s,i,o,r]=t,c=n.getMove(o,r);return s==="flag"&&Kt(n,i,c),!0}if(e==="attack"){const[,s,i]=t,o=m.findAt(i);if(!o)return console.warn(n.id,"could not attack",i," - no unit found"),!1;Vt(s,n,o)}return!1}function te(n){const t=n.getAttackSkill();if(!t)return;const e=[];if(ct(n.coords,Dt,(i,o)=>{const r=[i,o],c=m.findAt(r);c&&c.nationId!==n.nationId&&e.push(r)}),!e.length)return;const s=f.pickRandom(e);n.clearCommands(),n.queueCommand(["attack",t,s])}async function it(n){te(n),await Jt(n);const t=b.get(n.nationId),e=M.findAt(n.coords);if(e&&e.canUnitPickUp(n)){const o=e.unitPicksUp(n);t.gain(o),M.remove(e)}const s=n.getSkill("explore");s&&t.clearFog(n.coords,s),n.getSkill("claim")&&p.isLand(n.coords)&&t.claim(n.coords),n.isIntelligent()&&ie(n)}function ee(n){const t=n.magnetize(m);if(!t)return;const e=m.get(t),[s,i]=lt(n.coords,e.coords);if(s===0&&i===0){T.remove(n.id);return}e.queueCommand(["move",s,i])}function ne(){T.forEach(n=>ee(n))}function se(){if(M.size>=qt)return;const n=G();n&&(f.chance(.5)||M.addNew(n))}function ie(n){const t=b.get(n.nationId);if(f.chance(.5)){const e=G();if(!e){console.warn("cannot plan without coords");return}const s=lt(e,n.coords);n.queueCommand(["move",s[0],s[1]])}else{const e=f.pickRandom(l.DIRECTIONS),s=t.getNationalUnits(m).filter(o=>!o.isIntelligent()).map(o=>o.type),i=f.pickRandom(s);n.queueCommand(["spawn","flag",i,e[0],e[1]])}}function oe(){C.forEach(n=>{const t=b.get(n.nationId),e={food:1};t.canPay(e)&&(t.pay(e),n.feed(e))})}function re(){const n=h.enemy1,t=f.pickRandom(F),e={};if(e[t]=1,n.gain(e),f.random()>.95){const s=f.pickRandom(["W","W","W","E","A","M"]);O(n.id,n.nationalClass,s,n.capital)}}async function ce(){await it(h.pc),ot(h.pc),ne();const n=m.filter(t=>t!==h.pc);for(let t=0;t<n.length;t+=1){const e=n[t];await it(e),ot(e)}se(),re(),oe(),C.update(),M.update(),m.update(),T.update(),h.turn+=1,D(),It()}function It(){if(m.filter(e=>e.nationId===h.enemy1.id).length===0&&document.querySelector("main").classList.add("game-won"),!h.pc.dead&&!h.pc.removed)return;h.gameOver=!0,document.querySelector("main").classList.add("game-over")}async function Q(n=0){It(),await ce(),(h.pc.hasCommands()||n>10)&&await Q(n+1)}function St(){const t=document.querySelector(".map-cell").getBoundingClientRect();return[t.width,t.height]}function Mt(){const t=A?{"flag-E":"Move Explorer","flag-F":"Move Farmer","flag-W":"Move Warrior","flag-M":"Move Merchant","flag-A":"Move Artist","flag-B":"Move Builder","flag-S":"Move Scientist"}[A]:"Move Leader";document.getElementById("direction-action-text").innerHTML=t,y.forEachCurrency((e,s)=>{document.getElementById(`stats-${e}`).innerText=s}),document.querySelectorAll(".action-list button").forEach(e=>{const{classList:s}=e;A&&s.contains(A)?s.add("selected-action"):s.remove("selected-action")})}function ot(n){const t=St();n.render(t)}function D(){const n=St();C.render(n),m.render(n),M.render(n),T.render(n),y.render(p,"map-player-fog"),Mt()}function X(){return document.querySelector("main").classList}function ae(n){X().add("show-info");const t=document.getElementById("info-content");t.innerHTML=n}function le(){const n=document.getElementById("info-content");n.innerHTML="",X().remove("show-info")}function de(n){const t=n.getInfoHtml();ae(t)}function _(){const n=document.getElementById("city-info-content");n.innerHTML="",X().remove("show-city-view")}function ue(n){const t=b.get(n.nationId);X().add("show-city-view"),document.getElementById("city-info-content").innerHTML=n.getInfoHtml(),document.getElementById("city-interface").innerHTML=n.getInterfaceHtml(t)}function I(n){A=n,Mt()}function v(n){const[t,e]=n;if(A){const s=A.split("-");s[0]==="flag"&&h.pc.queueCommand(["spawn","flag",s[1],t,e]),I("")}else h.pc.queueCommand(["move",t,e]);Q(1)}function he(n,t){const e=C.get(n),s=b.get(e.nationId),i=e.getUnlockUnitTierCost(t);s.canPay(i)&&(s.pay(i),e.unlockUnitTier(t),D())}function fe(n,t){const e=C.get(n),s=b.get(e.nationId),i=e.getUnitBuildCost(t);if(!s.canPay(i))return;s.pay(i);const o=O(s.id,s.nationalClass,t,e);o.tier=e.getUnitTier(t),D()}const bt={"dir-up-left":()=>{v(l.NW)},"dir-up":()=>{v(l.N)},"dir-up-right":()=>{v(l.NE)},"dir-left":()=>{v(l.W)},"dir-none":()=>{v(l.ZERO)},"dir-right":()=>{v(l.E)},"dir-down-left":()=>{v(l.SW)},"dir-down":()=>{v(l.S)},"dir-down-right":()=>{v(l.SE)},"flag-E":()=>I("flag-E"),"flag-F":()=>I("flag-F"),"flag-W":()=>I("flag-W"),"flag-M":()=>I("flag-M"),"flag-A":()=>I("flag-A"),"flag-B":()=>I("flag-B"),"flag-S":()=>I("flag-S"),"move-wait":()=>{Q(1),I("")}},me=Object.keys(bt),pe=[{selector:"#actions",handler:n=>{const t=me.filter(e=>n.target.classList.contains(e));t.length&&bt[t[0]](n)}},{selector:"#map-units",handler:n=>{const t=n.target.closest(".unit");if(!t)return;const e=m.get(t.dataset.id);de(e)}},{selector:"#map-cities",handler:n=>{const t=n.target.closest(".city");if(!t)return;const e=C.get(t.dataset.id);ue(e)}},{selector:"#city-view",handler:n=>{n.target.closest(".close-button")&&_();const t=n.target.closest(".buy-unit");if(t){const{city:s,type:i}=t.dataset;fe(s,i),_()}const e=n.target.closest(".upgrade-unit");if(e){const{city:s,type:i}=e.dataset;he(s,i),_()}}},{selector:"#info",handler:n=>{n.target.closest(".close-button")&&le()}}];function ge(){pe.forEach(({selector:n,handler:t})=>{document.querySelector(n).addEventListener("click",t)})}document.addEventListener("DOMContentLoaded",()=>{Zt(),ge(),p.render(),D()});window.map=p;window.game=h;
