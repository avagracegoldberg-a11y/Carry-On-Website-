"use strict";

const closet = [
  {id:"rib", name:"Ivory Rib Tank", type:"Top", traits:["breathable"]},
  {id:"stripe", name:"Cherry Stripe Shirt", type:"Top", traits:["breathable","polished"]},
  {id:"active", name:"Studio Tank", type:"Top", traits:["active","breathable"]},
  {id:"denim", name:"Straight-Leg Jeans", type:"Bottom", traits:["polished"]},
  {id:"trouser", name:"Tailored Trousers", type:"Bottom", traits:["polished"]},
  {id:"bike", name:"Bike Shorts", type:"Bottom", traits:["active","breathable"]},
  {id:"slip", name:"Midnight Slip Dress", type:"Dress", traits:["polished","breathable"]},
  {id:"trench", name:"Lightweight Trench", type:"Outerwear", traits:["layer","rain","polished"]},
  {id:"sneaker", name:"Retro Walking Sneakers", type:"Shoes", traits:["walk","active"]},
  {id:"cotton-tee", name:"Sky Blue Cotton Tee", type:"Top", traits:["breathable"]},
  {id:"sweater", name:"Charcoal Crewneck", type:"Outerwear", traits:["layer"]},
  {id:"linen-shorts", name:"Linen Shorts", type:"Bottom", traits:["breathable","polished"]},
  {id:"joggers", name:"Technical Joggers", type:"Bottom", traits:["active"]},
  {id:"red-midi", name:"Cherry Midi Dress", type:"Dress", traits:["polished"]},
  {id:"denim-jacket", name:"Cropped Denim Jacket", type:"Outerwear", traits:["layer"]},
  {id:"rain-shell", name:"Hooded Rain Shell", type:"Outerwear", traits:["rain","layer"]},
  {id:"loafers", name:"Black Leather Loafers", type:"Shoes", traits:["polished"]},
  {id:"sandals", name:"Tan Strappy Sandals", type:"Shoes", traits:[]}
];
const categories = {All:"All", Top:"Tops", Bottom:"Bottoms", Dress:"Dresses", Outerwear:"Layers", Shoes:"Shoes"};
const cities = [
  {
    name:"Miami", region:"Florida", code:"MIA", aliases:["miami beach","south beach"], days:[
      ["South Beach boardwalk",84,"Sunny","Choose breathable pieces for the heat.","breathable","kept your South Beach look airy","try a breathable piece for the midday heat"],
      ["Wynwood mural walk",82,"Partly cloudy","Wear shoes comfortable enough for a long walk.","walk","gave you comfortable shoes for the mural walk","walking sneakers would help on the mural route"],
      ["Dinner in Coconut Grove",78,"Clear","Bring one polished piece for dinner.","polished","dressed up dinner in Coconut Grove","a polished piece would suit dinner in Coconut Grove"]
    ],
    twist:{title:"A Wynwood downpour", detail:"An afternoon shower rolls in during the mural walk. It’s now 76°F with rain. Restyle Day 2 with a rain-friendly layer if one made the cut.", trait:"rain", hit:"helped cover you during the Wynwood shower", miss:"a rain-friendly outer layer would help in the Wynwood downpour"}
  },
  {
    name:"Chicago", region:"Illinois", code:"CHI", aliases:["chi","chitown"], days:[
      ["Art Institute and the Loop",61,"Overcast","Wear comfortable shoes for gallery floors and city blocks.","walk","kept you comfortable through the galleries and the Loop","walking sneakers would help on the gallery floors"],
      ["Lakefront Trail walk",57,"Breezy","Pair walking shoes with a warm layer.","walk","suited the walk along Lake Michigan","walking sneakers would help on the Lakefront Trail"]
      ,["Jazz in Uptown",55,"Clear","Choose a polished piece for the jazz club.","polished","worked for your evening in Uptown","a polished piece would fit your evening in Uptown"]
    ],
    twist:{title:"Wind off Lake Michigan", detail:"The lake breeze turns into strong gusts and it feels like 48°F. Revisit your Day 2 look and add a warm outer layer if you packed one.", trait:"layer", hit:"gave you an outer layer for the gusty lakefront", miss:"you had no outer layer in your Day 2 look for the windy lakefront"}
  },
  {
    name:"New York", region:"New York", code:"NYC", aliases:["nyc","new york city","manhattan","ny"], days:[
      ["SoHo and the High Line",68,"Sunny","Wear walkable shoes for a full afternoon on foot.","walk","worked for the miles around SoHo and the High Line","walking sneakers would help for the miles around SoHo"],
      ["Central Park bike ride",70,"Partly cloudy","Style a piece you can move in.","active","gave you room to move on your park ride","an activewear piece would give you room to move on the ride"],
      ["Broadway matinee",63,"Overcast","Pack a polished piece for the theater.","polished","suited the Broadway matinee","a polished piece would suit the theater"]
    ],
    twist:{title:"A rooftop reservation", detail:"Your friends add rooftop drinks after the ride. Bring a polished piece into your Day 2 outfit while keeping it bike-friendly.", trait:"polished", hit:"dressed up your look for rooftop drinks", miss:"a polished piece would help your park look transition to the rooftop"}
  }
];
const app = document.querySelector("#app");
let state = {stage:"search"};
const stages = ["Destination","Itinerary","Pack","Style","Recap"];
const stageIndex = {search:0,trip:1,pack:2,style:3,recap:4};
const itemById = Object.fromEntries(closet.map(item => [item.id,item]));

const button = (label, action, variant="primary", extra="") =>
  `<button type="button" class="${variant}" data-action="${action}" ${extra}>${label}</button>`;
const picture = item => `<img src="assets/${item.id}.jpg" alt="" width="300" height="300">`;
const steps = () => `<ol class="steps" aria-label="Trip progress">${stages.map((label,i) =>
  `<li ${i===stageIndex[state.stage] ? 'aria-current="step"' : ""}><span>${String(i+1).padStart(2,"0")}</span> ${label}</li>`).join("")}</ol>`;
const heading = (title, text) => `<div class="section-heading"><p class="eyebrow">${state.city.code} / ${state.city.region}</p><h1 tabindex="-1">${title}</h1><p>${text}</p></div>`;
function itinerary() {
  return `<section aria-label="Three-day itinerary" class="itinerary"><div class="itinerary-heading"><h2>Trip itinerary</h2><span>Simulated weather</span></div><div class="days">${state.city.days.map(([activity,temp,weather,cue],i) =>
    `<article class="day"><div class="day-meta"><span>DAY 0${i+1}</span><span>${temp}°F · ${weather}</span></div><h3>${activity}</h3><p>${cue}</p></article>`).join("")}</div></section>`;
}
function chooseCity(index) {
  state = {stage:"trip", city:cities[index], bag:[], looks:[], draft:[], day:0, twist:false, category:"All"};
  render();
}
function showSearch() {
  return `<section class="landing"><div class="landing-copy"><p class="eyebrow">A WEEKEND CAPSULE CHALLENGE</p><h1 tabindex="-1">Only a<br><em>Carry-On.</em></h1><p class="intro">Pick a city, pack six pieces, and style your way through three days away.</p>
  <form id="search-form"><label for="destination">Where are you going?</label><div class="search"><input id="destination" autocomplete="off" placeholder="Search for a city" required><button class="primary">Find my trip <span aria-hidden="true">↗</span></button></div></form>
  <div id="city-results" aria-live="polite"></div></div>
  <figure class="hero"><img src="assets/carry-on.jpg" alt="A cherry-red carry-on packed with denim, stripes, and walking sneakers"><figcaption><span>THE WEEKEND EDIT</span><span>PACK LIGHT ✦</span></figcaption></figure></section>`;
}
function normalize(value) {
  return value.toLowerCase().trim().replace(/[^a-z0-9 ]/g,"").replace(/\s+/g," ");
}
function distance(a,b) {
  let row = Array.from({length:b.length+1},(_,i)=>i);
  for (const [i,letter] of Array.from(a).entries()) {
    const next = [i+1];
    for (const [j,other] of Array.from(b).entries()) {
      next.push(Math.min(row[j+1]+1,next[j]+1,row[j]+Number(letter!==other)));
    }
    row = next;
  }
  return row[b.length];
}
function suggestions(submitted=false) {
  const query = normalize(document.querySelector("#destination").value);
  const ranked = cities.map((city,index) => {
    const names = [normalize(city.name),city.code.toLowerCase(),...city.aliases];
    return {city,index,exact:names.includes(query),prefix:names.some(name=>name.includes(query)),score:Math.min(...names.map(name=>distance(query,name)))};
  }).sort((a,b)=>Number(b.exact)-Number(a.exact)||Number(b.prefix)-Number(a.prefix)||a.score-b.score);
  const matches = query ? ranked.filter(result=>result.prefix) : cities.map((city,index)=>({city,index}));
  if (submitted && ranked[0].exact) return chooseCity(ranked[0].index);
  const closest = query && (submitted || !matches.length);
  document.querySelector("#city-results").innerHTML = `<p class="suggestion-label">${closest ? "Closest supported cities" : query ? "Matching destinations" : "Try a destination"}</p><div class="chips">${(closest ? ranked : matches).map(({city,index})=>button(city.name,"city","chip",`data-index="${index}"`)).join("")}</div>`;
}
function isComplete(ids) {
  const has = type => ids.some(id=>itemById[id].type===type);
  return has("Shoes") && (has("Dress") || (has("Top") && has("Bottom")));
}
function itemCard(item, selected) {
  const active = selected.includes(item.id);
  return `<button type="button" class="item ${active ? "selected" : ""}" data-action="item" data-id="${item.id}" aria-pressed="${active}">${picture(item)}<span class="pick" aria-hidden="true">${active ? "✓" : "+"}</span><span class="item-caption"><small>${item.type}</small><strong>${item.name}</strong></span></button>`;
}
function miniItems(ids) {
  return ids.map(id=>`<figure class="mini">${picture(itemById[id])}<figcaption>${itemById[id].name}</figcaption></figure>`).join("");
}
function showPack() {
  const visibleItems = state.category==="All" ? closet : closet.filter(item=>item.type===state.category);
  const filters = Object.entries(categories).map(([id,label]) =>
    button(label,"filter","chip",`data-category="${id}" aria-pressed="${state.category===id}"`)
  ).join("");
  return `${heading("Pack your carry-on.", "Choose six pieces. You’ll style all three days from this bag.")}${itinerary()}
  <div class="game-grid"><section><h2>The closet</h2><div class="chips closet-filters" role="group" aria-label="Filter by clothing type">${filters}</div><div class="closet">${visibleItems.map(item=>itemCard(item,state.bag)).join("")}</div></section>
  <aside class="bag"><div class="bag-title"><h2>Your carry-on</h2><span aria-live="polite">${state.bag.length} / 6</span></div>
  <div class="minis">${state.bag.map(id=>`<button class="mini remove" type="button" data-action="item" data-id="${id}" aria-label="Remove ${itemById[id].name}">${picture(itemById[id])}<span aria-hidden="true">×</span></button>`).join("")}</div>
  <p class="hint" id="bag-hint" aria-live="polite">${state.bag.length===6 && !isComplete(state.bag) ? "Pack shoes and either a dress or a top and bottom to make a complete outfit." : "Your six pieces can be worn more than once."}</p>
  ${button("Lock my bag ↗","lock","primary",state.bag.length===6 && isComplete(state.bag) ? "" : "disabled")}</aside></div>`;
}
function showStyle() {
  const [activity,temp,weather,cue] = state.city.days[state.day];
  return `${heading(`Style day ${state.day+1}.`,activity)}
  <div class="style-cue"><span>${temp}°F · ${weather} · Simulated weather</span><strong>${cue}</strong></div>
  ${state.twist && state.day===1 ? `<aside class="twist" aria-label="Day two surprise"><p class="eyebrow">DAY TWO SURPRISE</p><h2>${state.city.twist.title}</h2><p>${state.city.twist.detail}</p></aside>` : ""}
  <div class="game-grid"><section><h2>From your carry-on</h2><div class="closet">${state.bag.map(id=>itemCard(itemById[id],state.draft)).join("")}</div></section>
  <aside class="bag"><h2>Your look</h2><div class="minis">${miniItems(state.draft)}</div><p class="hint">Pick shoes and either a dress or a top and bottom. Add outerwear if you like.</p>
  ${button(state.twist && state.day===1 ? "Confirm day two ↗" : "Save this look ↗","save","primary",isComplete(state.draft) ? "" : "disabled")}</aside></div>`;
}
function feedback(day,trait,hit,miss) {
  const match = state.looks[day].map(id=>itemById[id]).find(item=>item.traits.includes(trait));
  return match ? `Your ${match.name} ${hit}.` : `Day ${day+1} tip — ${miss}.`;
}
function showRecap() {
  const counts = Object.fromEntries(state.bag.map(id=>[id,state.looks.filter(look=>look.includes(id)).length]));
  const reused = state.bag.filter(id=>counts[id]>1);
  const unused = state.bag.filter(id=>!counts[id]);
  const twist = state.city.twist;
  return `${heading("The trip, styled.",`Three days in ${state.city.name} with six pieces.`)}
  <div class="days recap-days">${state.city.days.map(([activity,,, ,trait,hit,miss],i)=>`<article class="day"><p class="eyebrow">DAY 0${i+1}</p><h3>${activity}</h3><div class="minis">${miniItems(state.looks[i])}</div><p>${feedback(i,trait,hit,miss)}</p>${i===1 ? `<p class="twist-feedback">${feedback(i,twist.trait,twist.hit,twist.miss)}</p>` : ""}</article>`).join("")}</div>
  <div class="summary"><section><h2>Worn again</h2><p>${reused.length ? reused.map(id=>`${itemById[id].name} ×${counts[id]}`).join(" · ") : "Each piece was worn at most once."}</p></section><section><h2>Stayed in the bag</h2><p>${unused.length ? unused.map(id=>itemById[id].name).join(" · ") : "Every piece made it into a look."}</p></section></div>
  <div class="actions">${button("Replay this trip ↗","replay")}${button("Try another city","reset","secondary")}</div>`;
}
function render({keepFocus=false}={}) {
  const active = document.activeElement;
  const focusedId = keepFocus ? active.dataset.id : null;
  const remove = active.classList.contains("remove");
  const category = keepFocus ? active.dataset.category : null;
  const views = {
    search:showSearch,
    trip:()=>`${heading(`Three days in ${state.city.name}.`, "Plan your six pieces around the trip ahead.")}${itinerary()}<div class="actions">${button("Open the closet ↗","pack")}${button("Change destination","reset","secondary")}</div>`,
    pack:showPack, style:showStyle, recap:showRecap
  };
  app.innerHTML = steps() + views[state.stage]();
  if (state.stage==="search") suggestions();
  if (keepFocus && focusedId) {
    const items = Array.from(app.querySelectorAll("[data-id]")).filter(element=>element.dataset.id===focusedId);
    const next = items.find(element=>element.classList.contains("remove")===remove) || items[0];
    (next || app.querySelector('button[data-category][aria-pressed="true"]'))?.focus({preventScroll:true});
  } else if (keepFocus && category) {
    app.querySelector(`button[data-category="${category}"]`)?.focus({preventScroll:true});
  } else if (!keepFocus) {
    window.scrollTo(0,0);
    app.querySelector("h1").focus({preventScroll:true});
  }
}
app.addEventListener("input",event=>{
  if (event.target.id==="destination") suggestions();
});
app.addEventListener("submit",event=>{
  if (event.target.id!=="search-form") return;
  event.preventDefault();
  suggestions(true);
});
app.addEventListener("click",event=>{
  const control = event.target.closest("[data-action]");
  if (!control) return;
  const {action,id,index} = control.dataset;
  switch(action) {
    case "city": return chooseCity(Number(index));
    case "reset": state={stage:"search"}; break;
    case "replay": return chooseCity(cities.indexOf(state.city));
    case "pack": state.stage="pack"; break;
    case "filter":
      state.category=control.dataset.category;
      return render({keepFocus:true});
    case "lock":
      if (state.bag.length!==6 || !isComplete(state.bag)) return;
      state.stage="style";
      break;
    case "item": {
      if (state.stage==="pack") {
        if (state.bag.includes(id)) state.bag=state.bag.filter(piece=>piece!==id);
        else if (state.bag.length<6) state.bag.push(id);
        else {
          document.querySelector("#bag-hint").textContent="Your bag is full. Remove a piece before adding another.";
          return;
        }
      } else if (state.stage==="style" && state.bag.includes(id)) {
        if (state.draft.includes(id)) state.draft=state.draft.filter(piece=>piece!==id);
        else {
          const type = itemById[id].type;
          const replaces = {Dress:["Top","Bottom"],Top:["Dress"],Bottom:["Dress"]};
          state.draft=state.draft.filter(piece=>itemById[piece].type!==type && !replaces[type]?.includes(itemById[piece].type));
          state.draft.push(id);
        }
      }
      return render({keepFocus:true});
    }
    case "save":
      if (!isComplete(state.draft)) return;
      state.looks[state.day]=[...state.draft];
      if (state.day===1 && !state.twist) {
        state.twist=true;
        break;
      }
      if (state.day===2) state.stage="recap";
      else {
        state.day++;
        state.draft=[];
      }
      break;
    default: return;
  }
  render();
});
render({keepFocus:true});
