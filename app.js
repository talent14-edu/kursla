/* KURSLA.ai v1 - hero katları, canlı akış, yolculuk, orkestrasyon, paneller, SSS, form */
(() => {
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const az = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---- veri (canlı kursla.ai metinleri) ---- */
// Kat kutuları hero_gunduz.png (1536x1024) üzerinde ölçüldü, % cinsinden: [sol, üst, sağ, alt].
// Akşam görseli aynı hizada üretildi, aynı kutular geçerli.
const KATLAR = [
  { id: 'yonetici', no: 4, ad: 'Yönetici', kutu: [39.4, 13.7, 93.4, 33.2],
    baslik: 'Yönetici paneli', metin: 'Merkezin kapasitesini, öğretmen verimliliğini ve öğrenci gelişimini tek ekrandan izleyin.',
    ozellik: ['Kapasite ve doluluk takibi', 'Öğretmen görüşme ve planlama verimi', 'Desteğe ihtiyaç duyan öğrenci listesi'],
    mock: { t: 'Merkez özeti', m: 'BU HAFTA', s: [['Aktif öğrenci', '142 / 150'], ['Birebir seans', '96 görüşme'], ['AI-LA uyarısı', '3 öğrenci', 1]], c: [52, 64, 58, 72, 80, 76, 92] } },
  { id: 'ogretmen', no: 3, ad: 'Öğretmen', kutu: [39.4, 35.4, 93.4, 51.3],
    baslik: 'Öğretmen paneli', metin: 'Plan hazırlığıyla uğraşmadan, doğrudan öğrenciyle geçirdiğiniz zamana odaklanın.',
    ozellik: ['Öğrenci bazlı hazır haftalık plan', 'Eksik konu ve öncelik uyarıları', 'Birebir seans ajandası'],
    mock: { t: 'Günün akışı', m: 'BUGÜN', s: [['Ahmet Y. · 8-A', '15:30 seans'], ['Öncelikli konu', 'Üslü ifadeler'], ['Onay bekleyen plan', '4 öğrenci', 1]] } },
  { id: 'ogrenci', no: 2, ad: 'Öğrenci', kutu: [39.4, 53.2, 93.4, 68.8],
    baslik: 'Öğrenci ekranı', metin: 'Ne çalışacağını düşünmeden, her gün net ve ulaşılabilir görevlerle ilerle.',
    ozellik: ['Günlük üç adımlık çalışma planı', 'Tek girişle tüm içerik platformları', 'Haftalık ilerleme özeti'],
    mock: { t: 'Bugünkü plan', m: '3 GÖREV', s: [['Konu anlatımı', 'Tamamlandı'], ['Odaklanma çalışması', 'Tamamlandı'], ['Deneme testi', 'Bekliyor', 1]] } },
  { id: 'veli', no: 1, ad: 'Veli', kutu: [39.4, 70.8, 93.4, 92.3],
    baslik: 'Veli raporu', metin: 'Karmaşık grafikler yerine, çocuğunuzun gelişimini anlatan sade bir haftalık özet.',
    ozellik: ['Haftalık çalışma süresi', 'Akademik gelişim özeti', 'Öğretmen notu ve devam bilgisi'],
    mock: { t: 'Haftalık özet', m: 'CAN T.', s: [['Bireysel çalışma', '18 saat'], ['Okuma hızı', '+%20'], ['Öğretmen notu', 'Var', 1]], c: [30, 42, 38, 55, 61, 58, 70] } },
];
// AI-LA şaftı: [sol, üst, genişlik, yükseklik] %
const SAFT = [61.6, 7.6, 4.4, 84.9];

const OLAYLAR = [
  ['Ahmet Y. için eksik konu tespit edildi', 'ogrenci'],
  ['Öğretmene birebir seans önerildi', 'ogretmen'],
  ['Haftalık plan yeniden kuruldu', 'ogrenci'],
  ['Veli gelişim raporu gönderildi', 'veli'],
  ['İçerik Platformu konu anlatımı öğrenciye atandı', 'ogrenci'],
  ['Zeynep K. deneme netini 18 artırdı', 'yonetici'],
  ['Can T. akşam çalışmasını tamamladı', 'ogrenci'],
  ['Soru asistanı 41 soruyu çözdü', 'ogretmen'],
];

const SSS = [
  ['KURSLA.ai bir kurs merkezi mi?', 'Hayır. KURSLA.ai fiziksel bir kurs merkezi değildir; mevcut kurs merkezlerine yapay zekâ desteği ve bireysel mentörlük sağlayan bir sistemdir. Öğrenci sizin merkezinizde, sizin öğretmenlerinizle çalışır.'],
  ['Yapay zekâ öğretmenin yerini alıyor mu?', 'Hayır. AI-LA hazırlık ve takip işlerini üstlenir; öğretmen rehberlik, motivasyon ve birebir koçluğa daha fazla zaman ayırır.'],
  ['Dönüşüm ne kadar sürüyor?', 'Merkezin büyüklüğüne göre değişmekle birlikte, analizden operasyona kadar tipik süreç ortalama sekiz haftadır.'],
  ['Bölge koruması var mı?', 'Evet. Her merkeze tanımlı bir bölge tahsis edilir ve aynı bölgede ikinci bir lisans verilmez.'],
  ['Öğretmenlerim yeni sisteme uyum sağlayabilir mi?', 'Uygulamalı ekip eğitimi süreç kapsamındadır. Paneller günlük işleyişe göre tasarlandığı için teknik bilgi gerektirmez.'],
  ['Eğitim sektöründe deneyimim yok, başvurabilir miyim?', 'Evet. Yeni kurulum modelinde eğitim ve mentörlük kurgusu, personel eğitimi ve veli tanıtım desteği tarafımızdan sağlanır; fiziksel kurulum ve işletme size aittir.'],
];

const mockHTML = (k) => {
  const m = k.mock;
  const satir = m.s.map((r, i) => `<div class="mock-satir${r[2] ? ' altin' : ''}" style="--i:${i}"><span>${r[0]}</span><b>${r[1]}</b></div>`).join('');
  const cubuk = m.c ? `<div class="mock-cubuk" aria-hidden="true">${m.c.map((h, i) => `<i style="--h:${h}%;--i:${i}"></i>`).join('')}</div>` : '';
  return `<div class="mock-ust"><b>${m.t}</b><small>${m.m}</small></div>${satir}${cubuk}`;
};

/* ---- menü ---- */
const nav = $('#nav'), links = $('.links'), menu = $('#menu');
menu.addEventListener('click', () => { const a = links.classList.toggle('acik'); menu.setAttribute('aria-expanded', a); });
links.addEventListener('click', e => { if (e.target.closest('a')) { links.classList.remove('acik'); menu.setAttribute('aria-expanded', false); } });
addEventListener('scroll', () => nav.classList.toggle('kaydi', scrollY > 30), { passive: true });

/* ---- gündüz / akşam ---- */
const mod = $('#mod');
const aksamYap = (a) => {
  document.body.classList.toggle('aksam', a);
  mod.setAttribute('aria-pressed', a);
  mod.setAttribute('aria-label', a ? 'Gündüze geç' : 'Akşam etüdüne geç');
  try { localStorage.setItem('kursla-aksam', a ? '1' : '0'); } catch (e) {}
};
mod.addEventListener('click', () => aksamYap(!document.body.classList.contains('aksam')));
try { if (localStorage.getItem('kursla-aksam') === '1') aksamYap(true); } catch (e) {}

/* ---- hero katları ---- */
const katlarEl = $('#katlar'), kart = $('#katKart'), baslik = $('#baslik');
const cek = $('#cekirdek');
Object.assign(cek.style, { left: SAFT[0] + '%', top: SAFT[1] + '%', width: SAFT[2] + '%', height: SAFT[3] + '%' });
// Kat merkezinin şaft tabanından yüksekliği (%), nabız hedefi için
const hedef = (k) => (SAFT[1] + SAFT[3] - (k.kutu[1] + k.kutu[3]) / 2) / SAFT[3] * 100;

KATLAR.forEach((k, i) => {
  const b = document.createElement('button');
  b.type = 'button'; b.className = 'kat'; b.dataset.id = k.id;
  b.setAttribute('aria-label', `${k.no}. kat: ${k.baslik}`);
  const [x1, y1, x2, y2] = k.kutu;
  Object.assign(b.style, { left: x1 + '%', top: y1 + '%', width: (x2 - x1) + '%', height: (y2 - y1) + '%' });
  b.innerHTML = `<span class="pin"><i>${k.no}</i>${k.ad}</span>`;
  b.addEventListener('click', () => katAc(i));
  katlarEl.appendChild(b);
});

/* Yönlendiren el: bina uyandıktan sonra Yönetici -> Öğretmen -> Öğrenci -> Veli katlarına sırayla dokunur.
   İki tur atar; ziyaretçi bir kata dokununca hemen çekilir. Hero'ya geri dönülürse bir kez daha oynar. */
const el = $('#el');
let elOynuyor = false, elBitti = false, elTur = 0;
const bekle = ms => new Promise(r => setTimeout(r, ms));
const elHedef = k => { const [x1, y1, x2, y2] = k.kutu; return [x1 + (x2 - x1) * .3, y1 + (y2 - y1) * .62]; };
async function elOynat() {
  if (az || elOynuyor || elBitti || seciliKat >= 0) return;
  elOynuyor = true;
  const [sx, sy] = elHedef(KATLAR[0]);
  el.style.left = (sx - 6) + '%'; el.style.top = (sy - 10) + '%';
  await bekle(60); el.classList.add('gorun');
  for (let tur = 0; tur < 2 && !elBitti; tur++) {
    for (const k of KATLAR) {
      if (elBitti) break;
      const [x, y] = elHedef(k);
      el.style.left = x + '%'; el.style.top = y + '%';
      await bekle(950);
      if (elBitti) break;
      const b = $(`.kat[data-id="${k.id}"]`);
      el.classList.add('bas'); b.classList.add('dokun');
      await bekle(260); el.classList.remove('bas');
      await bekle(700); b.classList.remove('dokun');
    }
    await bekle(500);
  }
  el.classList.remove('gorun');
  $$('.kat.dokun').forEach(b => b.classList.remove('dokun'));
  elOynuyor = false;
  if (++elTur >= 2) elBitti = true;
}
function elDur() { elBitti = true; el.classList.remove('gorun', 'bas'); $$('.kat.dokun').forEach(b => b.classList.remove('dokun')); }
setTimeout(elOynat, az ? 0 : 3900);
new IntersectionObserver(([e]) => { if (e.isIntersecting && elTur === 1) setTimeout(elOynat, 600); }, { threshold: .6 }).observe($('#ust'));

let seciliKat = -1;
function katAc(i) {
  elDur();
  seciliKat = i;
  const k = KATLAR[i];
  $$('.kat').forEach((b, j) => b.classList.toggle('secili', j === i));
  $('#katNo').textContent = `${k.no}. kat · ${k.ad}`;
  $('#katBaslik').textContent = k.baslik;
  $('#katMetin').textContent = k.metin;
  $('#katMock').innerHTML = mockHTML(k);
  $('#katGit').onclick = () => sekmeSec(k.id);
  baslik.classList.add('gizli');
  kart.hidden = false;
  nabizGonder(k);
  if (innerWidth <= 1100) kart.scrollIntoView({ behavior: az ? 'auto' : 'smooth', block: 'nearest' });
}
function katKapat() {
  seciliKat = -1;
  $$('.kat').forEach(b => b.classList.remove('secili'));
  kart.hidden = true;
  baslik.classList.remove('gizli');
}
$('#kapat').addEventListener('click', katKapat);
$('#katSonra').addEventListener('click', () => katAc(seciliKat <= 0 ? KATLAR.length - 1 : seciliKat - 1));
$('#katOnce').addEventListener('click', () => katAc(seciliKat >= KATLAR.length - 1 ? 0 : seciliKat + 1));
addEventListener('keydown', e => { if (e.key === 'Escape' && !kart.hidden) katKapat(); });

/* AI-LA nabzı: şaftın tabanından ilgili kata yükselir, kat parlar */
const nabiz = $('#nabiz');
function nabizGonder(k) {
  const h = hedef(k);
  nabiz.classList.remove('git');
  nabiz.style.setProperty('--hedef', h + '%');
  nabiz.style.setProperty('--sure', (0.5 + h / 100 * 0.8) + 's');
  void nabiz.offsetWidth;
  nabiz.classList.add('git');
  const b = $(`.kat[data-id="${k.id}"]`);
  setTimeout(() => { b.classList.remove('flas'); void b.offsetWidth; b.classList.add('flas'); }, (0.4 + h / 100 * 0.8) * 1000);
}

/* ---- canlı akış ---- */
const liste = $('#akisListe'), takip = $('#takip');
let oi = 0;
function olay() {
  const [metin, id] = OLAYLAR[oi++ % OLAYLAR.length];
  const li = document.createElement('li');
  li.textContent = metin;
  liste.replaceChildren(li);
  if (seciliKat < 0 || KATLAR[seciliKat].id === id) nabizGonder(KATLAR.find(k => k.id === id));
}
liste.innerHTML = '<li>Merkezdeki tüm katlar AI-LA ile bağlanıyor</li>';
let akisZaman = null, acilis = true;
const akisBasla = () => {
  if (akisZaman) return;
  if (acilis && !az) {
    // Bina "uyanır": AI-LA ışığı şafttan veliden yöneticiye her kata sırayla akar.
    acilis = false;
    [...KATLAR].reverse().forEach((k, i) => setTimeout(() => nabizGonder(k), 500 + i * 650));
    akisZaman = setTimeout(() => { akisZaman = null; akisBasla(); }, 500 + 4 * 650 + 600);
    return;
  }
  olay(); akisZaman = setInterval(olay, 3200);
};
const akisDur = () => { clearInterval(akisZaman); clearTimeout(akisZaman); akisZaman = null; };
new IntersectionObserver(([e]) => (e.isIntersecting && !document.hidden ? akisBasla() : akisDur()), { threshold: .2 }).observe($('#ust'));
document.addEventListener('visibilitychange', () => (document.hidden ? akisDur() : akisBasla()));
setInterval(() => { if (akisZaman) takip.textContent = 140 + Math.round(Math.random() * 4); }, 5200);

/* ---- görünürlük animasyonları + sayılar ---- */
const io = new IntersectionObserver(es => es.forEach(e => {
  if (!e.isIntersecting) return;
  e.target.classList.add('goster');
  io.unobserve(e.target);
}), { threshold: .15, rootMargin: '0px 0px -40px 0px' });
$$('.gor').forEach(el => io.observe(el));

const sayIO = new IntersectionObserver(es => es.forEach(e => {
  if (!e.isIntersecting) return;
  sayIO.unobserve(e.target);
  const el = e.target, son = +el.dataset.say, on = el.dataset.on || '', ek = el.dataset.son || '';
  const t0 = performance.now(), sure = az ? 1 : 1100;
  const adim = t => { const p = Math.min(1, (t - t0) / sure); el.textContent = on + Math.round(son * (1 - Math.pow(1 - p, 3))) + ek; if (p < 1) requestAnimationFrame(adim); };
  requestAnimationFrame(adim);
}), { threshold: .6 });
$$('[data-say]').forEach(el => sayIO.observe(el));

/* ---- kaydırmaya bağlı: dönüşüm çizgisi + öğrenci yolculuğu ---- */
const donusum = $('#donusum'), adimlar = $$('#donusum li');
const yolDolu = $('#yolDolu'), yolcu = $('#yolcu'), patika = $('#patika'), duraklar = $$('#duraklar li');
const yolUz = yolDolu.getTotalLength();
yolDolu.style.strokeDasharray = yolUz;
// Durakları yolun üzerine yerleştir (viewBox 1200x260, svg 260px yüksek)
function durakYerlestir() {
  const w = patika.clientWidth;
  duraklar.forEach(li => {
    const p = yolDolu.getPointAtLength(+li.dataset.t * yolUz);
    // Kutu kenarlardan taşmasın; nokta yine çizginin üstünde kalsın (--dx).
    const x = p.x / 1200 * w, xk = Math.min(w - 100, Math.max(100, x));
    li.style.left = xk + 'px';
    li.style.setProperty('--dx', (x - xk) + 'px');
    li.style.top = (p.y - 11) + 'px';
  });
}
const ilerleme = (el, bas = .85, bit = .35) => {
  const r = el.getBoundingClientRect(), h = innerHeight;
  return Math.max(0, Math.min(1, (h * bas - r.top) / (r.height + h * (bas - bit))));
};
function kaydir() {
  const p1 = ilerleme(donusum);
  donusum.style.setProperty('--ilerle', p1);
  adimlar.forEach((li, i) => li.classList.toggle('gecti', p1 >= i / adimlar.length + .05));

  if (innerWidth > 820) {
    const p2 = ilerleme(patika, .8, .45);
    yolDolu.style.strokeDashoffset = yolUz * (1 - p2);
    const pt = yolDolu.getPointAtLength(Math.max(.001, p2) * yolUz);
    yolcu.style.transform = `translate(${pt.x / 1200 * patika.clientWidth}px, ${pt.y}px)`;
    duraklar.forEach(li => li.classList.toggle('gecti', p2 >= +li.dataset.t - .02));
  } else {
    const p2 = ilerleme(patika, .9, .5);
    duraklar.forEach((li, i) => li.classList.toggle('gecti', p2 >= i / duraklar.length));
  }
}
let kb = false;
addEventListener('scroll', () => { if (!kb) { kb = true; requestAnimationFrame(() => { kaydir(); kb = false; }); } }, { passive: true });
addEventListener('resize', () => { durakYerlestir(); kaydir(); });
durakYerlestir(); kaydir();

/* ---- ekosistem -> kursiyerin beceri haritası ---- */
// Örnek kursiyer verisi (AI-LA beceri haritası mantığı: alan = alt becerilerin ortalaması).
// eksik = hatalı soruların konu eksiği payı (%), kalanı dikkat hatası.
const ALANLAR = [
  { ad: 'Matematik', alt: [['Sayılar', 68], ['Cebir', 48], ['Geometri', 64]], eksik: 64, oneri: 'Üslü ifadeler için 2 konu anlatımı ve 1 birebir seans planlandı.' },
  { ad: 'Türkçe', alt: [['Okuduğunu anlama', 86], ['Sözcük', 80], ['Paragraf', 76]], eksik: 35, oneri: 'Paragraf sorularına süreli tekrar eklendi.' },
  { ad: 'Fen', alt: [['Kavram', 70], ['Deney yorumu', 58], ['Problem', 66]], eksik: 58, oneri: 'Deney yorumu için görselli konu tekrarı atandı.' },
  { ad: 'İngilizce', alt: [['Kelime', 78], ['Okuma', 72], ['Dinleme', 64]], eksik: 47, oneri: 'Haftada 3 kısa dinleme görevi plana girdi.' },
  { ad: 'Okuma hızı', alt: [['Hız', 76], ['Anlama', 88], ['Odak', 74]], eksik: 28, oneri: 'Hızlıokuma Platformunda göz egzersizi serisi başladı.' },
  { ad: 'Çalışma düzeni', alt: [['Düzenlilik', 88], ['Görev', 92], ['Odak süresi', 70]], eksik: 22, oneri: 'Akşam çalışması 25 dakikalık bloklara bölündü.' },
];
const ESKI = [52, 74, 58, 64, 66, 72]; // 4 hafta önce
const KAYNAKLAR = [
  { id: 'icerik', ad: 'İçerik Platformu', img: 'n_icerik' },
  { id: 'hizli', ad: 'Hızlıokuma Platformu', img: 'n_hizliokuma' },
  { id: 'seans', ad: 'Birebir seans', img: 'r_ogretmen' },
  { id: 'plan', ad: 'Günlük plan', img: 'r_ogrenci' },
];
// [kaynak, alan, alt beceri, artış, etiket]
const BESLEME = [
  ['icerik', 0, 1, 3, 'Üslü ifadeler konu anlatımı tamamlandı'],
  ['hizli', 4, 0, 2, 'Göz egzersizi serisi: 3. gün'],
  ['seans', 0, 1, 4, 'Birebir seans: cebir tekrarı'],
  ['plan', 5, 2, 2, '25 dakikalık odak bloğu bitti'],
  ['icerik', 2, 1, 3, 'Deney yorumu videosu izlendi'],
  ['hizli', 1, 2, 2, 'Süreli paragraf okuması'],
  ['plan', 3, 2, 2, 'Dinleme görevi tamamlandı'],
  ['icerik', 3, 0, 1, 'Kelime kartları tekrarı'],
];
const BAZ = ALANLAR.map(a => a.alt.map(x => x[1]));
const ort = a => Math.round(a.alt.reduce((t, x) => t + x[1], 0) / a.alt.length);

const besle = $('#besle'), kaynakUl = $('#kaynaklar'), radar = $('#radar'), detay = $('#alanDetay');
const cizgi = $('#besleCizgi'), cekAi = $('#cekirdekAi');
kaynakUl.innerHTML = KAYNAKLAR.map(k => `<li><button type="button" class="kaynak" data-id="${k.id}"><img src="img/${k.img}.webp" alt="">${k.ad}</button></li>`).join('');

// Radar: 6 eksen, yarıçap 100 = puan 100
const RR = 100, aci = i => -Math.PI / 2 + i * Math.PI / 3;
const nokta = (i, v) => [Math.cos(aci(i)) * RR * v / 100, Math.sin(aci(i)) * RR * v / 100];
const poly = vals => vals.map((v, i) => nokta(i, v).map(n => n.toFixed(1)).join(',')).join(' ');
let seciliAlan = 0, elleSecim = 0;
function radarCiz() {
  let g = '';
  [25, 50, 75, 100].forEach(v => { g += `<polygon class="izgara" points="${poly(Array(6).fill(v))}"/>`; });
  ALANLAR.forEach((a, i) => { const [x, y] = nokta(i, 100); g += `<line class="eksen" x1="0" y1="0" x2="${x}" y2="${y}"/>`; });
  g += `<polygon class="eski" points="${poly(ESKI)}"/><polygon class="simdi" id="simdi" points="${poly(ALANLAR.map(ort))}"/>`;
  ALANLAR.forEach((a, i) => {
    const [x, y] = nokta(i, ort(a));
    g += `<circle class="nokta" id="nk${i}" cx="${x}" cy="${y}" r="4.5"/>`;
  });
  ALANLAR.forEach((a, i) => {
    const [x, y] = nokta(i, 126), anc = Math.abs(x) < 5 ? 'middle' : x > 0 ? 'start' : 'end';
    g += `<g class="etiket-g" data-i="${i}" tabindex="0" role="button" aria-label="${a.ad}"><text x="${x}" y="${y - 2}" text-anchor="${anc}">${a.ad}</text><text class="puan" id="pu${i}" x="${x}" y="${y + 14}" text-anchor="${anc}">${ort(a)}</text></g>`;
  });
  radar.innerHTML = g;
  $$('.etiket-g', radar).forEach(el => {
    const sec = () => { elleSecim = Date.now(); alanSec(+el.dataset.i); };
    el.addEventListener('click', sec);
    el.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); sec(); } });
  });
}
function radarGuncelle() {
  $('#simdi', radar).setAttribute('points', poly(ALANLAR.map(ort)));
  ALANLAR.forEach((a, i) => {
    const [x, y] = nokta(i, ort(a));
    const c = $('#nk' + i, radar); c.setAttribute('cx', x); c.setAttribute('cy', y);
    $('#pu' + i, radar).textContent = ort(a);
  });
}
function alanSec(i) {
  seciliAlan = i;
  const a = ALANLAR[i], min = Math.min(...a.alt.map(x => x[1]));
  $$('.etiket-g', radar).forEach(el => el.classList.toggle('secili', +el.dataset.i === i));
  detay.innerHTML = `<h3>${a.ad}<b>${ort(a)}</b></h3>` +
    a.alt.map(([ad, v]) => `<div class="alt-beceri${v === min ? ' zayif' : ''}"><span>${ad}</span><em>${v}</em><i style="--v:${v}%"></i></div>`).join('') +
    `<div class="ayrim"><div class="ayrim-cubuk"><span style="width:${a.eksik}%"></span><span style="width:${100 - a.eksik}%"></span></div>` +
    `<div class="ayrim-etiket"><span>Konu eksiği <b>%${a.eksik}</b></span><span>Dikkat hatası <b>%${100 - a.eksik}</b></span></div></div>` +
    `<p class="oneri">${a.oneri}</p>`;
}
radarCiz(); alanSec(0);

// Akış çizgileri: her kaynaktan AI-LA'ya, AI-LA'dan haritaya
let hatlar = {};
function hatCiz() {
  if (innerWidth <= 1100) return;
  const r0 = besle.getBoundingClientRect();
  const rel = el => { const r = el.getBoundingClientRect(); return { l: r.left - r0.left, r: r.right - r0.left, t: r.top - r0.top, b: r.bottom - r0.top, cy: (r.top + r.bottom) / 2 - r0.top, cx: (r.left + r.right) / 2 - r0.left }; };
  const c = rel($('img', cekAi)), h = rel($('#harita'));
  let s = '';
  $$('.kaynak', kaynakUl).forEach(b => {
    const k = rel(b), mx = (k.r + c.l) / 2;
    s += `<path class="hat" id="hat-${b.dataset.id}" d="M${k.r} ${k.cy} C ${mx} ${k.cy}, ${mx} ${c.cy}, ${c.l + 8} ${c.cy}"/>`;
  });
  s += `<path class="hat" id="hat-cikis" d="M${c.r - 8} ${c.cy} L ${h.l} ${c.cy}"/>`;
  cizgi.setAttribute('viewBox', `0 0 ${r0.width} ${r0.height}`);
  cizgi.innerHTML = s;
  hatlar = {}; $$('.hat', cizgi).forEach(p => { hatlar[p.id.slice(4)] = p; });
}
function zerreGonder(yol, sure) {
  return new Promise(son => {
    if (!yol || az) return setTimeout(son, az ? 0 : sure);
    const z = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    z.setAttribute('r', 5); z.setAttribute('class', 'zerre'); cizgi.appendChild(z);
    const L = yol.getTotalLength(), t0 = performance.now();
    yol.classList.add('aktif');
    const ad = t => {
      const p = Math.min(1, (t - t0) / sure), q = p < .5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
      const pt = yol.getPointAtLength(q * L); z.setAttribute('cx', pt.x); z.setAttribute('cy', pt.y);
      if (p < 1) requestAnimationFrame(ad); else { z.remove(); yol.classList.remove('aktif'); son(); }
    };
    requestAnimationFrame(ad);
  });
}
let bi = 0, besleZaman = null, besleDongu = 0;
async function beslemeAdim() {
  const [kid, ai, si, art, etiket] = BESLEME[bi];
  bi = (bi + 1) % BESLEME.length;
  if (bi === 0 && ++besleDongu % 2 === 0) { ALANLAR.forEach((a, i) => a.alt.forEach((x, j) => { x[1] = BAZ[i][j]; })); radarGuncelle(); }
  const btn = $(`.kaynak[data-id="${kid}"]`, kaynakUl);
  $$('.kaynak', kaynakUl).forEach(b => b.classList.toggle('aktif', b === btn));
  await zerreGonder(hatlar[kid], 900);
  cekAi.classList.remove('nabiz'); void cekAi.offsetWidth; cekAi.classList.add('nabiz');
  await zerreGonder(hatlar.cikis, 600);
  const a = ALANLAR[ai]; a.alt[si][1] = Math.min(96, a.alt[si][1] + art);
  radarGuncelle();
  if (Date.now() - elleSecim > 8000 || seciliAlan === ai) alanSec(ai);
  const [x, y] = nokta(ai, ort(a));
  const t = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  t.setAttribute('class', 'artis'); t.setAttribute('x', x + 8); t.setAttribute('y', y - 8); t.textContent = `+${art}`;
  radar.appendChild(t); setTimeout(() => t.remove(), 1500);
  const m = $('#sonOlayMetin'); m.replaceWith(Object.assign(document.createElement('span'), { id: 'sonOlayMetin', textContent: `${KAYNAKLAR.find(k => k.id === kid).ad} → ${a.ad}: ${etiket}` }));
  setTimeout(() => btn.classList.remove('aktif'), 900);
}
$$('.kaynak', kaynakUl).forEach(b => b.addEventListener('click', () => {
  const i = BESLEME.findIndex(e => e[0] === b.dataset.id); if (i >= 0) { bi = i; beslemeAdim(); }
}));
const besleBasla = () => { if (!besleZaman) { hatCiz(); beslemeAdim(); besleZaman = setInterval(beslemeAdim, 3400); } };
const besleDur = () => { clearInterval(besleZaman); besleZaman = null; };
new IntersectionObserver(([e]) => (e.isIntersecting && !document.hidden ? besleBasla() : besleDur()), { threshold: .25 }).observe(besle);
addEventListener('resize', hatCiz);
addEventListener('load', hatCiz);

/* ---- paneller ---- */
const sekmeler = $('#sekmeler'), panelAlan = $('#panelAlan');
const SIRA = ['yonetici', 'ogretmen', 'ogrenci', 'veli'];
SIRA.forEach(id => {
  const k = KATLAR.find(x => x.id === id);
  const b = document.createElement('button');
  b.type = 'button'; b.className = 'sekme'; b.role = 'tab'; b.id = 'sekme-' + id;
  b.setAttribute('aria-controls', 'panelAlan'); b.setAttribute('aria-selected', 'false');
  b.innerHTML = `<img src="img/r_${id}.webp" alt="">${k.ad}`;
  b.addEventListener('click', () => sekmeSec(id));
  sekmeler.appendChild(b);
});
function sekmeSec(id) {
  const k = KATLAR.find(x => x.id === id);
  $$('.sekme').forEach(b => b.setAttribute('aria-selected', b.id === 'sekme-' + id));
  panelAlan.setAttribute('role', 'tabpanel');
  panelAlan.setAttribute('aria-labelledby', 'sekme-' + id);
  panelAlan.innerHTML = `<div class="panel"><div><img class="panel-gorsel" src="img/r_${id}.webp" alt=""><h3>${k.baslik}</h3><p>${k.metin}</p><ul>${k.ozellik.map(o => `<li>${o}</li>`).join('')}</ul></div><div class="mock">${mockHTML(k)}</div></div>`;
}
sekmeSec('yonetici');
sekmeler.addEventListener('keydown', e => {
  if (!['ArrowLeft', 'ArrowRight'].includes(e.key)) return;
  const i = SIRA.findIndex(id => $('#sekme-' + id).getAttribute('aria-selected') === 'true');
  const n = SIRA[(i + (e.key === 'ArrowRight' ? 1 : SIRA.length - 1)) % SIRA.length];
  sekmeSec(n); $('#sekme-' + n).focus();
});

/* ---- SSS ---- */
$('#sssListe').innerHTML = SSS.map(([q, a], i) => `<details><summary>${q}</summary><p>${a}</p></details>`).join('');

/* ---- başvuru formu ----
   Apps Script -> Google E-Tablo "KURSLA.ai Başvuruları" (egitim Drive) + e-posta mada@talent14.com (cc egitim@talent14.com).
   Script: kursla/form/Kod.gs. Web uygulaması yayınlanınca /exec adresini FORM_ENDPOINT'e yaz.
   text/plain gövde: CORS ön isteği çıkmaz, Apps Script'e doğrudan düşer. */
const FORM_ENDPOINT = 'https://script.google.com/macros/s/AKfycby2_UD9UKuDEmk4nz4O5gmDaWWSAe2j_tIdGr7U5R2TMAVAY6KKvYN29heUicUoxbKP2Q/exec';
$$('[data-tur]').forEach(a => a.addEventListener('click', () => { const r = $(`input[name=tur][value=${a.dataset.tur}]`); if (r) r.checked = true; }));
const form = $('#form'), gonder = $('button[type=submit]', form), fhata = $('.form-hata', form);
const url = new URLSearchParams(location.search);
form.kaynak.value = url.get('utm_source') || document.referrer.replace(/^https?:\/\//, '').split('/')[0] || 'doğrudan';
form.kampanya.value = url.get('utm_campaign') || '';
const telGecerli = v => v.replace(/\D/g, '').replace(/^90/, '').replace(/^0/, '').length === 10;
form.addEventListener('submit', async e => {
  e.preventDefault();
  fhata.hidden = true;
  let ok = true;
  $$('input[required]', form).forEach(inp => {
    const v = inp.value.trim();
    const bad = !v || (inp.type === 'email' && !/^\S+@\S+\.\S+$/.test(v)) || (inp.type === 'tel' && !telGecerli(v));
    inp.classList.toggle('hata', bad); if (bad) ok = false;
  });
  if (!ok) {
    fhata.textContent = 'Lütfen işaretli alanları kontrol edin. Telefon 10 haneli olmalı (05XX XXX XX XX).';
    fhata.hidden = false; $('input.hata', form).focus(); return;
  }
  const veri = Object.fromEntries(new FormData(form));
  gonder.disabled = true; gonder.firstChild.textContent = 'Gönderiliyor… ';
  try {
    // Adres girilmeden başvuruyu kaydetmeden "alındı" deme: uyarı göster, kimse sessizce kaybolmasın.
    if (!FORM_ENDPOINT) throw new Error('form bağlı değil');
    const r = await fetch(FORM_ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(veri) });
    const j = await r.json();
    if (!j.ok) throw new Error(j.hata || 'kaydedilemedi');
    $('#tamam').hidden = false; gonder.hidden = true; form.reset();
  } catch (err) {
    fhata.textContent = 'Başvuru gönderilemedi. Lütfen tekrar deneyin ya da info@kursla.ai adresine yazın.';
    fhata.hidden = false; gonder.disabled = false; gonder.firstChild.textContent = 'Başvuruyu gönder ';
  }
});

/* ---- aktif menü bağlantısı ---- */
const bolumIO = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) $$('.links a').forEach(a => a.classList.toggle('aktif', a.getAttribute('href') === '#' + e.target.id));
}), { rootMargin: '-45% 0px -50% 0px' });
['model', 'nasil', 'ekosistem', 'franchise', 'uygulama'].forEach(id => bolumIO.observe($('#' + id)));
})();
