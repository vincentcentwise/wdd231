// js/modal.js
export function openModal(id) {
  const dlg = document.getElementById(id);
  if (!dlg) return;
  if (typeof dlg.showModal === 'function') {
    dlg.showModal();
  } else {
    // fallback: add class and aria
    dlg.setAttribute('open','');
  }
  // focus first focusable element
  const focusable = dlg.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
  if (focusable) focusable.focus();
}

export function closeModal(id) {
  const dlg = document.getElementById(id);
  if (!dlg) return;
  if (typeof dlg.close === 'function') dlg.close();
  else dlg.removeAttribute('open');
}
