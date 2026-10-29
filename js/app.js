// 메인 애플리케이션 진입점 & 모달/TTS/탭 오케스트레이션

(function() {
  let currentModalElementNum = 1;

  // 탭 전환 제어
  function initTabs() {
    const tabButtons = document.querySelectorAll('.nav-tab-btn');
    const viewSections = document.querySelectorAll('.view-section');
    const filterBar = document.querySelector('.filter-bar');

    tabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetViewId = btn.dataset.view;

        tabButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        viewSections.forEach(section => {
          if (section.id === targetViewId) {
            section.classList.add('active');
          } else {
            section.classList.remove('active');
          }
        });

        // 주기율표/카드도감 뷰에서만 검색/필터바 표시 (나머지 탭에서는 숨겨 화면 확보)
        if (filterBar) {
          if (targetViewId === 'view-table' || targetViewId === 'view-cards') {
            filterBar.style.display = 'flex';
          } else {
            filterBar.style.display = 'none';
          }
        }
      });
    });
  }

  // 발음 듣기 (Web Speech Synthesis API)
  function speakElement(text, lang = 'ko-KR') {
    if (!('speechSynthesis' in window)) {
      alert('이 브라우저는 음성 발음을 지원하지 않습니다.');
      return;
    }
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = lang;
    utter.rate = 0.95;
    window.speechSynthesis.speak(utter);
  }

  // 원소 상세 모달 열기
  window.openElementModal = function(num) {
    if (!window.PERIODIC_DATA) return;
    const all = [...window.PERIODIC_DATA.standardElements, ...window.PERIODIC_DATA.futureElements];
    const el = all.find(e => e.num === num);
    if (!el) return;

    currentModalElementNum = num;

    // 🏆 도감 탐험 업적에 등록
    if (window.markElementExplored) {
      window.markElementExplored(num);
    }

    const modalOverlay = document.getElementById('element-modal-overlay');
    const modalBox = document.getElementById('detail-modal-box');
    if (!modalOverlay || !modalBox) return;

    const catName = (window.CATEGORY_NAMES && window.CATEGORY_NAMES[el.category]) || el.category;
    const colorVar = `var(--cat-${el.category}, #00d2ff)`;
    modalBox.style.setProperty('--modal-color', colorVar);

    // 모달 데이터 채우기
    document.getElementById('modal-elem-num').innerText = `#${el.num} ${el.symbol}`;
    document.getElementById('modal-elem-name-ko').innerText = el.nameKo;
    document.getElementById('modal-elem-name-en').innerText = el.nameEn;
    
    // 🌀 2D 보어 원자 모형 캔버스 애니메이션 가동!
    if (window.renderAtomModel) {
      window.renderAtomModel(el.num, el.symbol, el.shells);
    }

    // 배지
    const badgeRow = document.getElementById('modal-badges');
    const isFuture = el.num > 118;
    badgeRow.innerHTML = `
      <span class="modal-badge" style="background:${colorVar}; color:#fff;">${catName}</span>
      <span class="modal-badge" style="background:rgba(255,255,255,0.1); color:var(--text-main);">${el.period}주기 ${typeof el.group === 'number' ? el.group + '족' : el.group}</span>
      <span class="modal-badge" style="background:rgba(255,255,255,0.1); color:var(--text-main);">원자량: ${el.weight}</span>
      <span class="modal-badge" style="background:rgba(255,255,255,0.1); color:var(--accent-gold);">녹는점: ${el.meltingPoint !== undefined ? el.meltingPoint + '℃' : '미정'}</span>
      ${el.isRadioactive ? '<span class="modal-badge" style="background:rgba(255, 71, 87, 0.25); color:#ff4757; border:1px solid #ff4757;">☢️ 방사성 원소</span>' : ''}
      ${isFuture ? '<span class="modal-badge" style="background:rgba(241, 196, 15, 0.25); color:var(--accent-gold); border:1px solid var(--accent-gold);">🚀 8주기 미래 가상 원소</span>' : ''}
    `;

    // 텍스트 섹션
    document.getElementById('modal-summary-text').innerText = el.summary;
    document.getElementById('modal-uses-text').innerText = el.uses || '정보 준비 중';
    document.getElementById('modal-discovery-text').innerHTML = `
      <b>발견 / 연구:</b> ${el.discovery || '기록 없음'}<br>
      <b>어원 유래:</b> ${el.origin || '기록 없음'}
    `;
    document.getElementById('modal-funfact-text').innerText = el.funFact || '놀라운 비밀을 연구 중이에요!';

    // 이전/다음 버튼 제어
    const prevBtn = document.getElementById('modal-prev-btn');
    const nextBtn = document.getElementById('modal-next-btn');
    if (prevBtn) prevBtn.disabled = (num <= 1);
    if (nextBtn) nextBtn.disabled = (num >= 126);

    modalOverlay.classList.add('active');
  };

  function closeModal() {
    const modalOverlay = document.getElementById('element-modal-overlay');
    if (modalOverlay) {
      modalOverlay.classList.remove('active');
    }
  }

  function initModalEvents() {
    const modalOverlay = document.getElementById('element-modal-overlay');
    const closeBtn = document.getElementById('modal-close-btn');
    const prevBtn = document.getElementById('modal-prev-btn');
    const nextBtn = document.getElementById('modal-next-btn');
    const speakKoBtn = document.getElementById('speak-ko-btn');
    const speakEnBtn = document.getElementById('speak-en-btn');

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (modalOverlay) {
      modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) closeModal();
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        const all = [...window.PERIODIC_DATA.standardElements, ...window.PERIODIC_DATA.futureElements];
        const currentIndex = all.findIndex(e => e.num === currentModalElementNum);
        if (currentIndex > 0) {
          window.openElementModal(all[currentIndex - 1].num);
        }
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        const all = [...window.PERIODIC_DATA.standardElements, ...window.PERIODIC_DATA.futureElements];
        const currentIndex = all.findIndex(e => e.num === currentModalElementNum);
        if (currentIndex < all.length - 1) {
          window.openElementModal(all[currentIndex + 1].num);
        }
      });
    }

    if (speakKoBtn) {
      speakKoBtn.addEventListener('click', () => {
        const nameKo = document.getElementById('modal-elem-name-ko').innerText;
        speakElement(nameKo, 'ko-KR');
      });
    }
    if (speakEnBtn) {
      speakEnBtn.addEventListener('click', () => {
        const nameEn = document.getElementById('modal-elem-name-en').innerText;
        speakElement(nameEn, 'en-US');
      });
    }

    window.addEventListener('keydown', (e) => {
      if (!modalOverlay || !modalOverlay.classList.contains('active')) return;
      if (e.key === 'Escape') closeModal();
      if (e.key === 'ArrowLeft' && prevBtn && !prevBtn.disabled) prevBtn.click();
      if (e.key === 'ArrowRight' && nextBtn && !nextBtn.disabled) nextBtn.click();
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    initTabs();
    initModalEvents();

    if (window.initPeriodicTable) window.initPeriodicTable();
    if (window.initTempSlider) window.initTempSlider();
    if (window.initMoleculeLab) window.initMoleculeLab();
    if (window.initCardBattle) window.initCardBattle();
    if (window.initAchievements) window.initAchievements();
    if (window.initFutureLab) window.initFutureLab();
    if (window.initQuiz) window.initQuiz();
  });
})();
