/* ================= DATA ================= */
const CATEGORIES = ["Kegiatan Organisasi","Liputan Acara","Prestasi","Dokumentasi","Workshop","Multimedia","Pengumuman"];

const NEWS = [
  {id:1,title:"UI In Cinema",
   cat:"Kegiatan Organisasi",
   date:"21 Februari 2024",
   author:"Ditreux_16",
   img:""galeri/4.JPG",
   excerpt:"Perjuangan Ms. Ditreux mempersembahkan UI In Cinema.",
   content:["Setelah melewati berbagai perbedaan, dalam pendapat, tema dan opsi lainnya, akhirnya Ms. Ditreux menemukan tema finalnya.",
            "Persembahan ini menjadi bukti kerja keras latihan rutin yang dilakukan seminggu terakhir dengan asa solid kekeluargaan.",
            "Pihak Program menyampaikan apresiasi tinggi dan berharap persembahan ini dapat memotivasi siswa lain untuk terus berkarya."],
   gallery:["galeri/1.JPG","galeri/2.JPG","galeri/3.JPG"]},
];

const GALLERY_IMAGES = [
  "galeri/1.JPG","galeri/2.JPG","galeri/3.JPG","galeri/4.JPG"
];

const TEAM = [
  {name:"Dewi Wuryan",role:"Pembina",group:"Pembina",img:"tim/dewi1.JPG"},
  {name:"Feby Auril",role:"Ketua Organisasi",group:"Pimpinan",img:"https://picsum.photos/id/91/300/300"},
  {name:"Nabila Zakira Az-Zahra",role:"Kepala Redaksi",group:"Redaksi",img:"https://picsum.photos/id/65/300/300"},
  {name:"Rizky Firmansyah",role:"Editor Berita",group:"Redaksi",img:"https://picsum.photos/id/1005/300/300"},
  {name:"Bagas Wirawan",role:"Kepala Fotografi",group:"Fotografi",img:"https://picsum.photos/id/1012/300/300"},
  {name:"Citra Ayu",role:"Fotografer",group:"Fotografi",img:"https://picsum.photos/id/1027/300/300"},
  {name:"Dimas Anggara",role:"Kepala Videografi",group:"Videografi",img:"https://picsum.photos/id/1074/300/300"},
  {name:"Fira Amalia",role:"Videografer",group:"Videografi",img:"https://picsum.photos/id/1062/300/300"},
  {name:"Galih Prasetyo",role:"Kepala Multimedia",group:"Multimedia",img:"https://picsum.photos/id/1084/300/300"},
  {name:"Hana Putri",role:"Desainer Grafis",group:"Multimedia",img:"https://picsum.photos/id/1027/300/300"}
];

/* ================= STATE ================= */
let currentCategory = "Semua";
let searchTerm = "";
let currentPage = 1;
const PER_PAGE = 6;
let currentTeamFilter = "Semua";
let lightboxImages = [];
let lightboxIndex = 0;

/* ================= UTIL ================= */
function catIcon(){
  return `<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>`;
}
function userIcon(){
  return `<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/></svg>`;
}

function renderCard(item){
  return `
  <div class="card" onclick="openDetail(${item.id})">
    <div class="card-img">
      <img src="${item.img}" alt="${item.title}" loading="lazy">
      <span class="card-cat">${item.cat}</span>
    </div>
    <div class="card-body">
      <div class="card-meta">
        <span>${catIcon()} ${item.date}</span>
        <span>${userIcon()} ${item.author}</span>
      </div>
      <h3>${item.title}</h3>
      <p>${item.excerpt}</p>
      <span class="card-link">Baca Selengkapnya
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
      </span>
    </div>
  </div>`;
}

/* ================= ADMIN DATA STORE (localStorage) ================= */
const ADMIN_PASSWORD = 'lensa2026';
const LS_NEWS_KEY = 'lensa_admin_news';
const LS_GALLERY_KEY = 'lensa_admin_gallery';
const LS_SESSION_KEY = 'lensa_admin_session';

function getStoredNews(){
  try{ return JSON.parse(localStorage.getItem(LS_NEWS_KEY)) || []; } catch(e){ return []; }
}
function saveStoredNews(list){
  try{ localStorage.setItem(LS_NEWS_KEY, JSON.stringify(list)); } catch(e){ alert('Gagal menyimpan: penyimpanan browser penuh. Coba gunakan foto berukuran lebih kecil.'); }
}
function getStoredGallery(){
  try{ return JSON.parse(localStorage.getItem(LS_GALLERY_KEY)) || []; } catch(e){ return []; }
}
function saveStoredGallery(list){
  try{ localStorage.setItem(LS_GALLERY_KEY, JSON.stringify(list)); } catch(e){ alert('Gagal menyimpan: penyimpanan browser penuh. Coba gunakan foto berukuran lebih kecil.'); }
}
// Combined list: admin-uploaded items appear first (newest), then default demo content
function getAllNews(){
  return [...getStoredNews(), ...NEWS];
}
function getAllGalleryImages(){
  return [...getStoredGallery().map(g=>g.img), ...GALLERY_IMAGES];
}

/* ================= HOME NEWS ================= */
function renderHomeNews(){
  const grid = document.getElementById('homeNewsGrid');
  grid.innerHTML = getAllNews().slice(0,3).map(renderCard).join('');
}

/* ================= BERITA PAGE ================= */
function renderFilters(){
  const bar = document.getElementById('filterBar');
  const all = ["Semua", ...CATEGORIES];
  bar.innerHTML = all.map(c => `<button class="filter-chip ${c===currentCategory?'active':''}" onclick="setCategory('${c}')">${c}</button>`).join('');
}
function setCategory(cat){
  currentCategory = cat;
  currentPage = 1;
  renderFilters();
  renderNewsList();
}
function getFiltered(){
  return getAllNews().filter(n=>{
    const matchCat = currentCategory === "Semua" || n.cat === currentCategory;
    const matchSearch = n.title.toLowerCase().includes(searchTerm.toLowerCase()) || n.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCat && matchSearch;
  });
}
function renderNewsList(){
  const filtered = getFiltered();
  const grid = document.getElementById('allNewsGrid');
  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  if(currentPage > totalPages) currentPage = totalPages;
  const start = (currentPage-1)*PER_PAGE;
  const pageItems = filtered.slice(start, start+PER_PAGE);

  if(pageItems.length === 0){
    grid.innerHTML = `<div class="empty-state">
      <svg viewBox="0 0 24 24" fill="none" stroke-width="1.6" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>
      <p>Tidak ada berita yang ditemukan untuk pencarian ini.</p>
    </div>`;
  } else {
    grid.innerHTML = pageItems.map(renderCard).join('');
  }
  renderPagination(totalPages);
  observeReveals();
}
function renderPagination(totalPages){
  const pag = document.getElementById('pagination');
  if(totalPages <= 1){ pag.innerHTML=''; return; }
  let html = '';
  for(let i=1;i<=totalPages;i++){
    html += `<button class="page-btn ${i===currentPage?'active':''}" onclick="goToPage(${i})">${i}</button>`;
  }
  pag.innerHTML = html;
}
function goToPage(p){
  currentPage = p;
  renderNewsList();
  document.getElementById('page-berita').scrollIntoView({behavior:'instant'});
}

/* ================= DETAIL PAGE ================= */
let currentDetailGallery = [];
function openDetail(id){
  navigateTo('detail', id);
}
function renderDetail(id){
  const all = getAllNews();
  const idx = all.findIndex(n=>n.id===id);
  const item = all[idx];
  const prev = all[idx-1];
  const next = all[idx+1];
  const container = document.getElementById('detailContent');
  if(!item){ container.innerHTML = '<p>Berita tidak ditemukan.</p>'; return; }
  currentDetailGallery = item.gallery || [];

  container.innerHTML = `
    <div class="detail-cover"><img src="${item.img}" alt="${item.title}"></div>
    <span class="detail-cat">${item.cat}</span>
    <h1>${item.title}</h1>
    <div class="detail-meta">
      <span>${userIcon()} ${item.author}</span>
      <span>${catIcon()} ${item.date}</span>
    </div>
    <div class="detail-body">
      ${item.content.map(p=>`<p>${p}</p>`).join('')}
    </div>
    <div class="detail-gallery">
      ${(item.gallery||[]).map((g,i)=>`<img src="${g}" alt="galeri ${i+1}" loading="lazy" onclick="openLightbox(currentDetailGallery, ${i})">`).join('')}
    </div>
    <div class="detail-nav">
      ${prev ? `<a onclick="openDetail(${prev.id})" href="#"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M15 18l-6-6 6-6"/></svg> Berita Sebelumnya</a>` : `<span></span>`}
      <a onclick="navigateTo('home')" href="#home" style="justify-content:center;">Kembali ke Beranda</a>
      ${next ? `<a onclick="openDetail(${next.id})" href="#" style="justify-content:flex-end;">Berita Berikutnya <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M9 18l6-6-6-6"/></svg></a>` : `<span></span>`}
    </div>
  `;
}

/* ================= GALLERY PAGE ================= */
let currentGalleryImages = [];
function renderGallery(){
  const grid = document.getElementById('galleryGrid');
  currentGalleryImages = getAllGalleryImages();
  grid.innerHTML = currentGalleryImages.map((img,i)=>`
    <div class="gallery-item" onclick="openLightbox(currentGalleryImages, ${i})">
      <img src="${img}" alt="dokumentasi ${i+1}" loading="lazy">
      <div class="gallery-overlay"><span>Dokumentasi Kegiatan #${i+1}</span></div>
    </div>
  `).join('');
}

/* ================= LIGHTBOX ================= */
function openLightbox(images, index){
  lightboxImages = images;
  lightboxIndex = index;
  document.getElementById('lightboxImg').src = images[index];
  document.getElementById('lightbox').classList.add('open');
}
function closeLightbox(){ document.getElementById('lightbox').classList.remove('open'); }
function shiftLightbox(dir){
  lightboxIndex = (lightboxIndex + dir + lightboxImages.length) % lightboxImages.length;
  document.getElementById('lightboxImg').src = lightboxImages[lightboxIndex];
}
document.getElementById('lbClose').onclick = closeLightbox;
document.getElementById('lbPrev').onclick = ()=>shiftLightbox(-1);
document.getElementById('lbNext').onclick = ()=>shiftLightbox(1);
document.getElementById('lightbox').addEventListener('click',(e)=>{ if(e.target.id==='lightbox') closeLightbox(); });
document.addEventListener('keydown',(e)=>{
  if(!document.getElementById('lightbox').classList.contains('open')) return;
  if(e.key==='Escape') closeLightbox();
  if(e.key==='ArrowRight') shiftLightbox(1);
  if(e.key==='ArrowLeft') shiftLightbox(-1);
});

/* ================= TEAM PAGE ================= */
function renderTeamTabs(){
  const groups = ["Semua","Pembina","Pimpinan","Redaksi","Fotografi","Videografi","Multimedia"];
  document.getElementById('teamTabs').innerHTML = groups.map(g=>`<button class="filter-chip ${g===currentTeamFilter?'active':''}" onclick="setTeamFilter('${g}')">${g}</button>`).join('');
}
function setTeamFilter(g){
  currentTeamFilter = g;
  renderTeamTabs();
  renderTeamGrid();
}
function renderTeamGrid(){
  const filtered = currentTeamFilter==="Semua" ? TEAM : TEAM.filter(t=>t.group===currentTeamFilter);
  document.getElementById('teamGrid').innerHTML = filtered.map(t=>`
    <div class="profile-card">
      <div class="profile-photo"><img src="${t.img}" alt="${t.name}" loading="lazy"></div>
      <h5>${t.name}</h5>
      <span>${t.role}</span>
    </div>
  `).join('');
}

/* ================= ADMIN PANEL LOGIC ================= */
let newsMainImgData = null;
let newsGalleryImgData = [];
let galleryUploadData = [];

function isAdminLoggedIn(){
  return sessionStorage.getItem(LS_SESSION_KEY) === 'true';
}
function renderAdminEntry(){
  if(isAdminLoggedIn()){
    document.getElementById('adminLoginScreen').style.display = 'none';
    document.getElementById('adminDashboard').style.display = 'block';
    populateCategorySelect();
    renderAdminNewsList();
    renderAdminGalleryGrid();
  } else {
    document.getElementById('adminLoginScreen').style.display = 'block';
    document.getElementById('adminDashboard').style.display = 'none';
  }
}
function populateCategorySelect(){
  const sel = document.getElementById('newsCat');
  if(sel && sel.options.length === 0){
    sel.innerHTML = CATEGORIES.map(c=>`<option value="${c}">${c}</option>`).join('');
  }
}
document.getElementById('adminLoginForm').addEventListener('submit', function(e){
  e.preventDefault();
  const pass = document.getElementById('adminPasswordInput').value;
  if(pass === ADMIN_PASSWORD){
    sessionStorage.setItem(LS_SESSION_KEY, 'true');
    document.getElementById('adminLoginError').style.display = 'none';
    renderAdminEntry();
  } else {
    document.getElementById('adminLoginError').style.display = 'block';
  }
});
document.getElementById('adminLogoutBtn').addEventListener('click', function(){
  sessionStorage.removeItem(LS_SESSION_KEY);
  document.getElementById('adminPasswordInput').value = '';
  renderAdminEntry();
});

function switchAdminTab(tab){
  document.querySelectorAll('.admin-panel').forEach(p=>p.classList.remove('active'));
  document.getElementById('tab-'+tab).classList.add('active');
  document.querySelectorAll('.admin-tabs .filter-chip').forEach(b=>b.classList.toggle('active', b.dataset.tab===tab));
  if(tab==='kelolaBerita') renderAdminNewsList();
  if(tab==='kelolaFoto') renderAdminGalleryGrid();
}

function fileToDataURL(file){
  return new Promise((resolve, reject)=>{
    const reader = new FileReader();
    reader.onload = ()=>resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/* ---- Upload: berita foto utama ---- */
document.getElementById('newsMainImg').addEventListener('change', async function(e){
  const file = e.target.files[0];
  if(!file) return;
  newsMainImgData = await fileToDataURL(file);
  document.getElementById('newsMainPreview').innerHTML = `<img src="${newsMainImgData}" alt="preview">`;
});

/* ---- Upload: berita galeri foto ---- */
document.getElementById('newsGalleryImg').addEventListener('change', async function(e){
  const files = Array.from(e.target.files);
  for(const file of files){
    const dataUrl = await fileToDataURL(file);
    newsGalleryImgData.push(dataUrl);
  }
  renderNewsGalleryPreview();
});
function renderNewsGalleryPreview(){
  document.getElementById('newsGalleryPreview').innerHTML = newsGalleryImgData.map((d,i)=>`
    <div class="upload-thumb-wrap"><img src="${d}"><div class="upload-thumb-remove" onclick="removeNewsGalleryImg(${i})">×</div></div>
  `).join('');
}
function removeNewsGalleryImg(i){
  newsGalleryImgData.splice(i,1);
  renderNewsGalleryPreview();
}

/* ---- Submit: form berita baru ---- */
document.getElementById('newsForm').addEventListener('submit', function(e){
  e.preventDefault();
  if(!newsMainImgData){ alert('Silakan unggah foto utama berita terlebih dahulu.'); return; }
  const newItem = {
    id: Date.now(),
    title: document.getElementById('newsTitle').value,
    cat: document.getElementById('newsCat').value,
    date: document.getElementById('newsDate').value,
    author: document.getElementById('newsAuthor').value,
    img: newsMainImgData,
    excerpt: document.getElementById('newsExcerpt').value,
    content: document.getElementById('newsContent').value.split('\n').filter(p=>p.trim() !== ''),
    gallery: newsGalleryImgData.length ? [...newsGalleryImgData] : [newsMainImgData]
  };
  const list = getStoredNews();
  list.unshift(newItem);
  saveStoredNews(list);

  e.target.reset();
  newsMainImgData = null;
  newsGalleryImgData = [];
  document.getElementById('newsMainPreview').innerHTML = '';
  document.getElementById('newsGalleryPreview').innerHTML = '';
  document.getElementById('newsFormMsg').style.display = 'block';
  setTimeout(()=>{ document.getElementById('newsFormMsg').style.display = 'none'; }, 2500);

  renderHomeNews();
  renderNewsList();
  renderAdminNewsList();
});

function renderAdminNewsList(){
  const stored = getStoredNews();
  const container = document.getElementById('adminNewsList');
  if(stored.length === 0){
    container.innerHTML = `<div class="admin-empty">Belum ada berita yang diunggah admin. Berita bawaan (demo) dikelola langsung lewat kode.</div>`;
    return;
  }
  container.innerHTML = stored.map(n => `
    <div class="admin-list-item">
      <img src="${n.img}" alt="${n.title}">
      <div class="info">
        <h6>${n.title}</h6>
        <span><span class="badge-source badge-admin">Admin</span>${n.cat} · ${n.date}</span>
      </div>
      <button class="btn-danger btn-sm" onclick="deleteAdminNews(${n.id})">Hapus</button>
    </div>
  `).join('');
}
function deleteAdminNews(id){
  if(!confirm('Hapus berita ini?')) return;
  const list = getStoredNews().filter(n=>n.id !== id);
  saveStoredNews(list);
  renderAdminNewsList();
  renderHomeNews();
  renderNewsList();
}

/* ---- Upload: galeri langsung ---- */
document.getElementById('galleryImgInput').addEventListener('change', async function(e){
  const files = Array.from(e.target.files);
  for(const file of files){
    const dataUrl = await fileToDataURL(file);
    galleryUploadData.push(dataUrl);
  }
  renderGalleryUploadPreview();
});
function renderGalleryUploadPreview(){
  document.getElementById('galleryPreview').innerHTML = galleryUploadData.map((d,i)=>`
    <div class="upload-thumb-wrap"><img src="${d}"><div class="upload-thumb-remove" onclick="removeGalleryUploadImg(${i})">×</div></div>
  `).join('');
}
function removeGalleryUploadImg(i){
  galleryUploadData.splice(i,1);
  renderGalleryUploadPreview();
}
document.getElementById('galleryForm').addEventListener('submit', function(e){
  e.preventDefault();
  if(galleryUploadData.length === 0){ alert('Silakan pilih minimal satu foto.'); return; }
  const list = getStoredGallery();
  galleryUploadData.forEach(img => list.unshift({ id: Date.now()+Math.random(), img }));
  saveStoredGallery(list);

  galleryUploadData = [];
  document.getElementById('galleryPreview').innerHTML = '';
  e.target.reset();
  document.getElementById('galleryFormMsg').style.display = 'block';
  setTimeout(()=>{ document.getElementById('galleryFormMsg').style.display = 'none'; }, 2500);

  renderGallery();
  renderAdminGalleryGrid();
});

function renderAdminGalleryGrid(){
  const stored = getStoredGallery();
  const container = document.getElementById('adminGalleryGrid');
  if(stored.length === 0){
    container.innerHTML = `<div class="admin-empty" style="grid-column:1/-1;">Belum ada foto yang diunggah admin ke galeri.</div>`;
    return;
  }
  container.innerHTML = stored.map(g => `
    <div class="gallery-item admin-owned">
      <img src="${g.img}" alt="foto admin">
      <div class="gallery-overlay" style="opacity:1;justify-content:space-between;align-items:flex-end;">
        <span>Diunggah admin</span>
        <button class="btn-danger btn-sm" onclick="deleteAdminGalleryImg(${g.id})">Hapus</button>
      </div>
    </div>
  `).join('');
}
function deleteAdminGalleryImg(id){
  if(!confirm('Hapus foto ini dari galeri?')) return;
  const list = getStoredGallery().filter(g=>g.id !== id);
  saveStoredGallery(list);
  renderAdminGalleryGrid();
  renderGallery();
}

/* ================= NAVIGATION (SPA) ================= */
function navigateTo(page, param){
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  document.getElementById('page-'+page).classList.add('active');
  document.querySelectorAll('.nav-links a').forEach(a=>a.classList.toggle('active', a.dataset.page===page));

  if(page==='detail' && param){
    renderDetail(param);
    window.location.hash = 'berita/'+param;
  } else {
    window.location.hash = page;
  }
  if(page==='admin'){ renderAdminEntry(); }
  window.scrollTo({top:0, behavior:'instant'});
  document.getElementById('navLinks').classList.remove('open');
  observeReveals();
}

function handleHashRoute(){
  const hash = window.location.hash.replace('#','') || 'home';
  if(hash.startsWith('berita/')){
    const id = parseInt(hash.split('/')[1]);
    navigateTo('detail', id);
  } else if(['home','berita','galeri','tentang','tim','kontak','admin'].includes(hash)){
    navigateTo(hash);
  } else {
    navigateTo('home');
  }
}

/* ================= SCROLL / NAVBAR ================= */
window.addEventListener('scroll', ()=>{
  document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 40);
});

/* ================= REVEAL ANIMATION ================= */
let revealObserver;
function observeReveals(){
  if(revealObserver) revealObserver.disconnect();
  revealObserver = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); revealObserver.unobserve(e.target); } });
  },{threshold:0.12});
  document.querySelectorAll('.reveal').forEach(el=>revealObserver.observe(el));
}

/* ================= STAT COUNTER ================= */
function animateCounters(){
  document.querySelectorAll('[data-count]').forEach(el=>{
    const target = parseInt(el.dataset.count);
    let current = 0;
    const step = Math.max(1, Math.ceil(target/60));
    const timer = setInterval(()=>{
      current += step;
      if(current >= target){ current = target; clearInterval(timer); }
      el.textContent = current;
    }, 25);
  });
}
const statObserver = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{ if(e.isIntersecting){ animateCounters(); statObserver.disconnect(); } });
},{threshold:0.3});

/* ================= DARK MODE ================= */
document.getElementById('darkToggle').addEventListener('click', ()=>{
  const body = document.body;
  const next = body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  body.setAttribute('data-theme', next);
});

/* ================= SEARCH ================= */
document.getElementById('searchInput').addEventListener('input',(e)=>{
  searchTerm = e.target.value;
  currentPage = 1;
  renderNewsList();
});

/* ================= HAMBURGER ================= */
document.getElementById('hamburgerBtn').addEventListener('click', ()=>{
  document.getElementById('navLinks').classList.toggle('open');
});

/* ================= CONTACT FORM ================= */
document.getElementById('contactForm').addEventListener('submit',(e)=>{
  e.preventDefault();
  const btn = e.target.querySelector('button[type="submit"]');
  const originalText = btn.textContent;
  btn.textContent = 'Terkirim ✓';
  e.target.reset();
  setTimeout(()=>{ btn.textContent = originalText; }, 2200);
});

/* ================= PARALLAX HERO ================= */
window.addEventListener('scroll', ()=>{
  const hero = document.querySelector('.hero');
  if(!hero) return;
  const y = window.scrollY;
  if(y < window.innerHeight){
    document.querySelector('.orb1').style.transform = `translateY(${y*0.25}px)`;
    document.querySelector('.orb2').style.transform = `translateY(${y*0.18}px)`;
  }
});

/* ================= INIT ================= */
window.addEventListener('load', ()=>{
  setTimeout(()=>{ document.getElementById('loader').classList.add('hide'); }, 500);
});

renderHomeNews();
renderFilters();
renderNewsList();
renderGallery();
renderTeamTabs();
renderTeamGrid();
handleHashRoute();
observeReveals();
statObserver.observe(document.querySelector('.stats-section'));
window.addEventListener('hashchange', handleHashRoute);
