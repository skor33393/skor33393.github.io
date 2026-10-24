(() => {
let size = [390, 844];
const fit = () => document.querySelectorAll('.phone').forEach(phone => {
 const inner = phone.querySelector('.phone-inner');
 const available = phone.parentElement.clientWidth;
 const width = Math.min(size[0] + 14, available);
 const scale = (width - 14) / size[0];
 phone.style.width = width + 'px'; phone.style.height = (size[1] * scale + 14) + 'px';
 inner.style.width = size[0] + 'px';inner.style.height = size[1] + 'px';inner.style.transform = `scale(${scale})`;
});
document.querySelectorAll('[data-device]').forEach(button => button.addEventListener('click', () => {
 size = button.dataset.device.split(',').map(Number);
 document.querySelectorAll('[data-device]').forEach(b => b.setAttribute('aria-pressed', String(b === button)));
 fit();
}));
addEventListener('resize',fit);fit();
})();
