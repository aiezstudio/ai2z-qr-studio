'use strict';

const editor = document.querySelector('#editor');
const content = document.querySelector('#content');
const ink = document.querySelector('#ink');
const paper = document.querySelector('#paper');
const feedback = document.querySelector('#feedback');
const canvas = document.querySelector('#qr');
const empty = document.querySelector('#empty');
const download = document.querySelector('#download');
const context = canvas.getContext('2d');
let timer;

function luminance(hex) {
  const channels = hex.slice(1).match(/../g).map((value) => {
    const channel = parseInt(value, 16) / 255;
    return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
  });
  return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
}

function clearPreview(message = '', invalidContent = false) {
  canvas.hidden = true;
  empty.hidden = false;
  download.disabled = true;
  feedback.textContent = message;
  content.setAttribute('aria-invalid', String(invalidContent));
}

function validUrl(value) {
  try {
    return /^https?:\/\//i.test(value) && Boolean(new URL(value).hostname) && !/\s/.test(value);
  } catch {
    return false;
  }
}

function render() {
  const isUrl = editor.elements.mode.value === 'url';
  const value = isUrl ? content.value.trim() : content.value;
  document.querySelector('#content-label').textContent = isUrl ? 'URL laman web' : 'Teks untuk dikodkan';
  content.placeholder = isUrl ? 'https://contoh.my' : 'Taip atau tampal teks anda';
  content.inputMode = isUrl ? 'url' : 'text';

  if (!value.trim()) return clearPreview('Masukkan pautan atau teks untuk bermula.');
  if (isUrl && !validUrl(value)) return clearPreview('Masukkan URL lengkap yang bermula dengan https:// atau http://.', true);
  if (new TextEncoder().encode(value).length > 2000) return clearPreview('Kandungan melebihi had 2,000 bait UTF-8.', true);
  if ((luminance(paper.value) + 0.05) / (luminance(ink.value) + 0.05) < 4.5) {
    return clearPreview('Pilih warna kod yang lebih gelap dan latar yang lebih cerah.');
  }
  if (typeof window.qrcode !== 'function') return clearPreview('Pustaka QR gagal dimuatkan. Semak internet dan muat semula halaman.');

  let qr;
  try {
    const makeQr = window.qrcode;
    makeQr.stringToBytes = makeQr.stringToBytesFuncs['UTF-8'];
    qr = makeQr(0, 'M');
    qr.addData(value, 'Byte');
    qr.make();
  } catch {
    return clearPreview('Kandungan tidak dapat dikodkan. Cuba pendekkan teks atau pautan.', true);
  }

  const modules = qr.getModuleCount();
  const margin = 4;
  const scale = Math.ceil(1024 / (modules + margin * 2));
  canvas.width = canvas.height = (modules + margin * 2) * scale;
  context.fillStyle = paper.value;
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = ink.value;
  for (let row = 0; row < modules; row += 1) {
    for (let col = 0; col < modules; col += 1) {
      if (qr.isDark(row, col)) context.fillRect((col + margin) * scale, (row + margin) * scale, scale, scale);
    }
  }

  feedback.textContent = '';
  content.setAttribute('aria-invalid', 'false');
  canvas.hidden = false;
  empty.hidden = true;
  download.disabled = false;
}

editor.addEventListener('submit', (event) => event.preventDefault());
editor.addEventListener('input', () => {
  clearTimeout(timer);
  download.disabled = true;
  timer = setTimeout(render, 100);
});
editor.addEventListener('reset', () => {
  clearTimeout(timer);
  clearPreview();
  timer = setTimeout(render, 0);
});
download.addEventListener('click', () => {
  const link = document.createElement('a');
  link.href = canvas.toDataURL('image/png');
  link.download = 'ai2z-qr-code.png';
  link.click();
});
render();
