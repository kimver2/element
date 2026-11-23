// 기생충·선충 탐험대 메인 컨트롤러 (탭, 상세 모달, TTS, 캔버스 연동)

(function() {
  let currentModalId = 1;
  let modalAnimator = null;
  let currentModalStain = 'brightfield';

  function initTabs() {
    const tabButtons = document.querySelectorAll('.nav-tab-btn');
    const viewSections = document.querySelectorAll('.view-section');
    const filterBar = document.querySelector('.filter-bar');

    function switchTab(targetViewId) {
      tabButtons.forEach(b => b.classList.toggle('active', b.dataset.view === targetViewId));
      viewSections.forEach(s => s.classList.toggle('active', s.id === targetViewId));

      if (filterBar) {
        filterBar.style.display = (targetViewId === 'view-atlas' || targetViewId === 'view-cards') ? 'flex' : 'none';
      }
    }

    tabButtons.forEach(btn => {
      btn.addEventListener('click', () => switchTab(btn.dataset.view));
    });
    window.switchParasiteTab = switchTab;
  }

  function speakText(text, lang = 'ko-KR') {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = lang;
    utter.rate = 0.95;
    window.speechSynthesis.speak(utter);
  }

  function openParasiteModal(id) {
    const p = PARASITES_DATA.find(x => x.id === id);
    if (!p) return;
    currentModalId = id;

    const modal = document.getElementById('parasite-detail-modal');
    const cat = PARASITE_CATEGORIES[p.category];

    document.getElementById('modal-p-num').textContent = `#${String(p.id).padStart(2, '0')} · ${p.code}`;
    document.getElementById('modal-p-cat').textContent = p.isParasite === false ? '비기생 모델 생물' : p.categoryName;
    document.getElementById('modal-p-cat').style.background = cat.color + '25';
    document.getElementById('modal-p-cat').style.color = cat.color;
    document.getElementById('modal-p-name').textContent = p.name;
    document.getElementById('modal-p-sci').textContent = `${p.scientific} (${p.english})`;

    document.getElementById('modal-p-size').textContent = p.sizeLabel;
    document.getElementById('modal-p-host').textContent = p.host;
    document.getElementById('modal-p-inter').textContent = p.intermediateHost;
    document.getElementById('modal-p-trans').textContent = p.transmission;
    document.getElementById('modal-p-habitat').textContent = p.habitat;
    document.getElementById('modal-p-morph').textContent = p.morphology;
    document.getElementById('modal-p-symptoms').textContent = p.symptoms;
    document.getElementById('modal-p-prevention').textContent = p.prevention;
    document.getElementById('modal-p-fact').textContent = p.funFact;

    const lcList = document.getElementById('modal-p-lifecycle');
    lcList.innerHTML = p.lifeCycle.map((step, i) => `<li><span>${i + 1}단계</span>${step}</li>`).join('');

    const canvas = document.getElementById('modal-parasite-canvas');
    if (canvas) {
      if (!modalAnimator) {
        modalAnimator = new window.ParasiteCanvasAnimator(canvas);
      }
      modalAnimator.setConfig({ parasite: p, stain: currentModalStain, zoom: 1.15, blurPx: 0 });
      modalAnimator.start();
    }

    modal.classList.add('open');
    document.body.classList.add('modal-open');

    if (window.ParasiteAchievements) {
      window.ParasiteAchievements.markExplored(id);
    }
  }

  function closeParasiteModal() {
    const modal = document.getElementById('parasite-detail-modal');
    if (modal) modal.classList.remove('open');
    document.body.classList.remove('modal-open');
    if (modalAnimator) modalAnimator.stop();
  }

  function initModal() {
    const modal = document.getElementById('parasite-detail-modal');
    const closeBtn = document.getElementById('modal-p-close');
    const prevBtn = document.getElementById('modal-p-prev');
    const nextBtn = document.getElementById('modal-p-next');
    const speakKoBtn = document.getElementById('modal-p-speak-ko');
    const speakEnBtn = document.getElementById('modal-p-speak-en');

    if (closeBtn) closeBtn.addEventListener('click', closeParasiteModal);
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) closeParasiteModal();
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        const idx = PARASITES_DATA.findIndex(x => x.id === currentModalId);
        const prev = PARASITES_DATA[(idx - 1 + PARASITES_DATA.length) % PARASITES_DATA.length];
        openParasiteModal(prev.id);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        const idx = PARASITES_DATA.findIndex(x => x.id === currentModalId);
        const next = PARASITES_DATA[(idx + 1) % PARASITES_DATA.length];
        openParasiteModal(next.id);
      });
    }

    if (speakKoBtn) {
      speakKoBtn.addEventListener('click', () => {
        const p = PARASITES_DATA.find(x => x.id === currentModalId);
        if (p) speakText(`${p.name}. ${p.funFact}`, 'ko-KR');
      });
    }

    if (speakEnBtn) {
      speakEnBtn.addEventListener('click', () => {
        const p = PARASITES_DATA.find(x => x.id === currentModalId);
        if (p) speakText(`${p.scientific}. ${p.english}`, 'en-US');
      });
    }

    document.querySelectorAll('.modal-stain-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.modal-stain-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentModalStain = btn.dataset.stain;
        if (modalAnimator) modalAnimator.setConfig({ stain: currentModalStain });
      });
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeParasiteModal();
    });

    window.openParasiteModal = openParasiteModal;
  }

  document.addEventListener('DOMContentLoaded', () => {
    initTabs();
    initModal();
    if (window.ParasiteAchievements) window.ParasiteAchievements.init();
    if (window.ParasiteAtlas) window.ParasiteAtlas.init();
    if (window.ParasiteLifecycle) window.ParasiteLifecycle.init();
    if (window.ParasiteMicroscope) window.ParasiteMicroscope.init();
    if (window.ParasiteBattle) window.ParasiteBattle.init();
    if (window.ParasiteQuiz) window.ParasiteQuiz.init();
  });
})();
