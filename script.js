
const toggle=document.querySelector('[data-menu-toggle]'), menu=document.querySelector('[data-mobile-menu]');
if(toggle&&menu){toggle.addEventListener('click',()=>menu.classList.toggle('open'))}
document.querySelectorAll('[data-demo-form]').forEach(form=>form.addEventListener('submit',e=>{e.preventDefault(); const note=form.querySelector('[data-form-note]'); if(note) note.textContent='Demo only — your request was not submitted.';}));
document.querySelectorAll('.gift-amount').forEach(btn=>btn.addEventListener('click',()=>alert('Portfolio demo only — no purchase was made.')));
