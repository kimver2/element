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

        // 플로팅 줌 컨트롤은 주기율표 뷰에서만 표시
        const floatingZoomBar = document.getElementById('floating-zoom-bar');
        if (floatingZoomBar) {
          if (targetViewId === 'view-table') {
            floatingZoomBar.style.display = 'flex';
          } else {
            floatingZoomBar.style.display = 'none';
          }
        }
      });
    });
  }

  // 발음 듣기 (Web Speech Synthesis API) - 또렷한 여성 음성 최적화
  let cachedVoices = [];
  function loadVoices() {
    if ('speechSynthesis' in window) {
      cachedVoices = window.speechSynthesis.getVoices();
    }
  }

  if ('speechSynthesis' in window) {
    loadVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }

  function findBestVoice(lang) {
    if (!cachedVoices || cachedVoices.length === 0) {
      loadVoices();
    }
    const voices = cachedVoices || [];
    if (!voices.length) return null;

    const isEn = lang.toLowerCase().startsWith('en');
    const isKo = lang.toLowerCase().startsWith('ko');

    if (isEn) {
      const enVoices = voices.filter(v => v.lang && v.lang.toLowerCase().replace('_', '-').startsWith('en'));
      if (!enVoices.length) return null;

      // 1순위: 명시적 여성 고품질 영어 음성 (Samantha, Victoria, Karen, Jenny, Aria, Zira 등)
      const preferredFemaleNames = [
        'samantha', 'victoria', 'karen', 'jenny', 'aria', 'zira', 'ava',
        'allison', 'serena', 'moira', 'fiona', 'tessa', 'susan', 'female'
      ];
      for (const name of preferredFemaleNames) {
        const found = enVoices.find(v => v.name.toLowerCase().includes(name));
        if (found) return found;
      }

      // 2순위: Google US English / Google English
      const googleVoice = enVoices.find(v => {
        const n = v.name.toLowerCase();
        return n.includes('google') && (n.includes('us english') || n.includes('english'));
      });
      if (googleVoice) return googleVoice;

      // 3순위: 남성 키워드가 없는 영어 음성
      const maleKeywords = ['male', 'david', 'mark', 'george', 'alex', 'daniel', 'fred', 'bruce', 'tom', 'guy', 'james', 'john'];
      const nonMale = enVoices.find(v => {
        const n = v.name.toLowerCase();
        return !maleKeywords.some(m => n.includes(m));
      });
      if (nonMale) return nonMale;

      return enVoices[0];
    }

    if (isKo) {
      const koVoices = voices.filter(v => v.lang && v.lang.toLowerCase().replace('_', '-').startsWith('ko'));
      if (!koVoices.length) return null;

      const preferredKoFemales = ['yuna', 'sora', 'sunhi', 'heami', 'female', 'google'];
      for (const name of preferredKoFemales) {
        const found = koVoices.find(v => v.name.toLowerCase().includes(name));
        if (found) return found;
      }
      return koVoices[0];
    }

    return voices.find(v => v.lang && v.lang.toLowerCase().startsWith(lang.toLowerCase())) || null;
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

    const voice = findBestVoice(lang);
    if (voice) {
      utter.voice = voice;
      if (voice.lang) utter.lang = voice.lang;
    }

    // 초등학생이 또렷하고 친근하게 들을 수 있도록 맑은 여성 톤 & 속도 세팅
    if (lang.toLowerCase().startsWith('en')) {
      utter.rate = 0.90;  // 영단어 발음이 뭉개지지 않는 또렷한 속도
      utter.pitch = 1.08; // 맑고 또렷한 톤
    } else {
      utter.rate = 0.92;
      utter.pitch = 1.05;
    }

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

    // 🔤 1. 원소 기호의 비밀 바인딩
    const secretBox = document.getElementById('modal-secret-text');
    if (secretBox) {
      secretBox.innerText = el.symbolSecret || '기호의 비밀 정보를 준비 중이에요!';
    }

    // 🔥 2. 불꽃 반응 실험실 바인딩
    const flameContent = document.getElementById('modal-flame-content');
    if (flameContent) {
      if (el.flameColor) {
        flameContent.innerHTML = `
          <div class="flame-visual-wrap">
            <div class="animated-flame" style="--flame-color:${el.flameColor.color};"></div>
          </div>
          <div class="flame-info-wrap">
            <div class="flame-color-title" style="color:${el.flameColor.color}; font-size:1.1rem; font-weight:800;">
              ${el.flameColor.nameKo}
            </div>
            <div style="font-size:0.85rem; color:var(--text-muted); margin-top:2px;">
              영문 명칭: ${el.flameColor.nameEn}
            </div>
            <div style="font-size:0.88rem; color:var(--text-bright); margin-top:6px;">
              불꽃놀이 화약에 <b>${el.nameKo}</b> 화합물을 넣으면 이 아름다운 불꽃색이 밤하늘을 수놓아요! 🎆
            </div>
          </div>
        `;
      } else {
        flameContent.innerHTML = `
          <div style="font-size:0.88rem; color:var(--text-muted); padding:8px 0;">
            💡 이 원소는 고유의 뚜렷한 가시광선 불꽃 반응 색상을 나타내지 않습니다. (주로 알칼리/알칼리토 금속과 구리에서 관찰돼요)
          </div>
        `;
      }
    }

    // ⚠️ 3. 위험도 & 빌런 등급 게이지 바인딩
    const hazardContent = document.getElementById('modal-hazard-content');
    if (hazardContent) {
      const h = el.hazard || { toxicity: 1, reactivity: 2, radiation: 1, safety: 'SAFE', safetyLabel: '안전', safetyColor: '#2ed573' };
      
      function getStars(cnt) {
        return '★'.repeat(cnt) + '☆'.repeat(5 - cnt);
      }

      hazardContent.innerHTML = `
        <div class="hazard-stat-row">
          <span class="h-name">☠️ 치사 독성 (Toxicity)</span>
          <span class="h-stars" style="color:#ff6b81;">${getStars(h.toxicity)}</span>
        </div>
        <div class="hazard-stat-row">
          <span class="h-name">💥 화학 반응성 (Reactivity)</span>
          <span class="h-stars" style="color:#ffa502;">${getStars(h.reactivity)}</span>
        </div>
        <div class="hazard-stat-row">
          <span class="h-name">☢️ 방사선 위험 (Radiation)</span>
          <span class="h-stars" style="color:#e056fd;">${getStars(h.radiation)}</span>
        </div>
        <div class="hazard-badge-banner" style="border:1px solid ${h.safetyColor}; color:${h.safetyColor}; background:rgba(0,0,0,0.3);">
          종합 안전도: <b>${h.safetyLabel}</b>
        </div>
      `;
    }

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
