// set timestamp when page loads
document.addEventListener('DOMContentLoaded', ()=>{
const ts = document.getElementById('timestamp');
if(ts) ts.value = new Date().toISOString();
// animate cards
document.querySelectorAll('.card').forEach((c,i)=>setTimeout(()=>c.classList.add('show'), i*140));
// dialogs open/close
document.querySelectorAll('.card-link').forEach(a=>{
a.addEventListener('click', e=>{
e.preventDefault();
const id = a.getAttribute('data-target');
const dlg = document.getElementById(id);
if(dlg && typeof dlg.showModal === 'function'){
dlg.showModal();
dlg.querySelector('[data-close]')?.focus();
}
});
});
document.querySelectorAll('dialog [data-close]').forEach(b=>b.addEventListener('click', ()=>b.closest('dialog').close()));
// Basic form consistency checks before submit: email and password confirmation
const form = document.getElementById('membershipForm');
form && form.addEventListener('submit', (e)=>{
const email = form.querySelector('input[name="email"]');
const emailC = form.querySelector('input[name="emailConfirm"]');
const pwd = form.querySelector('input[name="password"]');
const pwdC = form.querySelector('input[name="passwordConfirm"]');
if(email && emailC && email.value !== emailC.value){
  alert('Email and Re-type Email do not match.');
  emailC.focus();
  e.preventDefault();
  return false;
}
if(pwd && pwdC && pwd.value !== pwdC.value){
  alert('Password and Re-type Password do not match.');
  pwdC.focus();
  e.preventDefault();
  return false;
}
// allow submit (GET) to thankyou.html
});
});




