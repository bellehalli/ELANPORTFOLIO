
const menuToggle=document.querySelector('[data-menu-toggle]');
const mobileMenu=document.querySelector('[data-mobile-menu]');
const toast=document.querySelector('[data-toast]');
menuToggle?.addEventListener('click',()=>{const open=mobileMenu?.classList.toggle('open')??false;menuToggle.setAttribute('aria-expanded',String(open));});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){mobileMenu?.classList.remove('open');menuToggle?.setAttribute('aria-expanded','false');}});
document.querySelectorAll('[data-demo-form]').forEach(form=>form.addEventListener('submit',e=>{e.preventDefault();toast?.classList.add('show');setTimeout(()=>toast?.classList.remove('show'),2500)}));

// Before / after slider
document.querySelectorAll('[data-ba]').forEach(slider=>{
 const input=slider.querySelector('input[type=range]'); const after=slider.querySelector('.ba-after'); const divider=slider.querySelector('.ba-divider'); const handle=slider.querySelector('.ba-handle');
 const update=()=>{const v=Number(input.value);after.style.clipPath=`inset(0 0 0 ${v}%)`;divider.style.left=`${v}%`;handle.style.left=`${v}%`;}; input.addEventListener('input',update);update();
});

// Treatment finder
const quiz=document.querySelector('[data-quiz-form]');
if(quiz){
 const title=document.querySelector('[data-quiz-title]'),copy=document.querySelector('[data-quiz-copy]'),link=document.querySelector('[data-quiz-link]');
 quiz.addEventListener('submit',e=>{e.preventDefault();const fd=new FormData(quiz);const concern=fd.get('concern')||'aging';const map={
 aging:['Tox + Skin Renewal','Soften expression lines while improving texture and glow.','toxin.html'],
 acne:['Clear Skin Plan','Pair corrective facials with laser or peel-based resurfacing.','treatments.html'],
 pigment:['Brightening Laser Plan','Target uneven tone and visible pigmentation with a staged laser plan.','laser.html'],
 lips:['Lip Enhancement','Build natural shape and hydration with conservative dermal filler.','filler.html'],
 body:['Body Sculpt Consultation','Start with a consultation to match goals to the right contouring plan.','book.html'],
 wellness:['Skin + Wellness Reset','Combine maintenance facials, LED and consistent home care.','memberships.html']
 };const r=map[concern];title.textContent=r[0];copy.textContent=r[1];link.href=r[2];});
}

// Package builder
const serviceButtons=[...document.querySelectorAll('[data-service-add]')];
const builderItems=document.querySelector('[data-builder-items]');const builderTotal=document.querySelector('[data-builder-total]');const builderField=document.querySelector('[data-builder-field]');
const selected=new Map();
function renderBuilder(){
 if(!builderItems)return;
 const entries=[...selected.entries()];
 builderItems.innerHTML=entries.length?entries.map(([name,item])=>`<div class="builder-item"><span>${name}</span><strong>$${item.price}</strong></div>`).join(''):'<p class="muted">Add treatments to build a sample plan.</p>';
 const total=entries.reduce((s,[,i])=>s+i.price,0);builderTotal.textContent=`$${total.toLocaleString()}`;
 if(builderField)builderField.value=entries.map(([n])=>n).join(', ');
}
serviceButtons.forEach(btn=>btn.addEventListener('click',()=>{const name=btn.dataset.serviceAdd,price=Number(btn.dataset.price);if(selected.has(name))selected.delete(name);else selected.set(name,{price});btn.textContent=selected.has(name)?'−':'+';renderBuilder();}));
renderBuilder();

// Provider matching
const providerForm=document.querySelector('[data-provider-form]');
if(providerForm){
 providerForm.addEventListener('submit',e=>{e.preventDefault();const fd=new FormData(providerForm);const goal=fd.get('goal');const out=document.querySelector('[data-provider-result]');const map={injectables:'Dr. Maya Ellis — Injectables & facial balancing',skin:'Jordan Price, PA-C — Skin, laser & corrective plans',body:'Nia Brooks, RN — Body contouring & wellness'};out.textContent=map[goal]||map.skin;});
}

document.querySelector('[data-demo-gift]')?.addEventListener('click',()=>{toast?.classList.add('show');setTimeout(()=>toast?.classList.remove('show'),2500);});
