// 가상 현미경 관찰 & 표본 감별 랩

(function() {
  let currentSlideIdx = 0;
  let currentZoom = 100;
  let currentFocus = 50; // 0~100, 50이 정초점
  let currentStain = 'brightfield';
  let animator = null;
  let solvedSlides = new Set();

  function getZoomScale(zoomVal) {
    if (zoomVal === 40) return 0.75;
    if (zoomVal === 100) return 1.05;
    if (zoomVal === 400) return 1.5;
    if (zoomVal === 1000) return 2.1;
    return 1.0;
  }

  function updateCanvas() {
    const slide = MICROSCOPE_SLIDES[currentSlideIdx];
    const specimen = PARASITES_DATA.find(p => p.id === slide.specimenId);
    if (!animator || !specimen) return;

    const focusDiff = Math.abs(currentFocus - 50);
    const blurPx = Math.round((focusDiff / 50) * 7 * 10) / 10;

    animator.setConfig({
      parasite: specimen,
      stain: currentStain,
      zoom: getZoomScale(currentZoom),
      blurPx
    });

    const focusStatus = document.getElementById('micro-focus-status');
    if (focusStatus) {
      if (focusDiff <= 6) {
        focusStatus.textContent = '✨ 초점 완벽 (선명함)';
        focusStatus.style.color = '#4ade80';
      } else if (focusDiff <= 20) {
        focusStatus.textContent = '🔍 초점 근접 (미세 조절 필요)';
        focusStatus.style.color = '#fbbf24';
      } else {
        focusStatus.textContent = '🌫️ 흐림 (초점 다이얼을 50 근처로 맞추세요)';
        focusStatus.style.color = '#f87171';
      }
    }
  }

  function renderSlideUI() {
    const slide = MICROSCOPE_SLIDES[currentSlideIdx];
    const specimen = PARASITES_DATA.find(p => p.id === slide.specimenId);

    const tabsEl = document.getElementById('micro-slide-tabs');
    if (tabsEl) {
      tabsEl.innerHTML = MICROSCOPE_SLIDES.map((s, idx) => `
        <button class="micro-slide-btn ${idx === currentSlideIdx ? 'active' : ''} ${solvedSlides.has(s.id) ? 'solved' : ''}" data-idx="${idx}">
          <span>${solvedSlides.has(s.id) ? '✅' : '🧫'}</span>
          <span>표본 ${idx + 1}: ${s.title}</span>
        </button>
      `).join('');

      tabsEl.querySelectorAll('.micro-slide-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          currentSlideIdx = parseInt(btn.dataset.idx, 10);
          currentFocus = 25;
          const slider = document.getElementById('micro-focus-slider');
          if (slider) slider.value = '25';
          renderSlideUI();
          updateCanvas();
        });
      });
    }

    const clueEl = document.getElementById('micro-clue-text');
    if (clueEl) {
      clueEl.innerHTML = `<strong>관찰 단서:</strong> ${slide.hint} <span class="micro-tip">(${slide.clue})</span>`;
    }

    // 감별 퀴즈 선택지 (정답 1개 + 오답 3개)
    const optionsEl = document.getElementById('micro-guess-options');
    const feedbackEl = document.getElementById('micro-guess-feedback');
    if (optionsEl && specimen) {
      if (feedbackEl) feedbackEl.innerHTML = '';
      const distractors = PARASITES_DATA
        .filter(p => p.id !== specimen.id)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);
      const choices = [specimen, ...distractors].sort((a, b) => a.id - b.id);

      optionsEl.innerHTML = choices.map(c => `
        <button class="micro-choice-btn" data-id="${c.id}">
          ${window.getParasiteSVG(c, 34)}
          <span>${c.name} <small>(${c.categoryName})</small></span>
        </button>
      `).join('');

      optionsEl.querySelectorAll('.micro-choice-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const pickedId = parseInt(btn.dataset.id, 10);
          if (pickedId === specimen.id) {
            btn.classList.add('correct');
            solvedSlides.add(slide.id);
            if (feedbackEl) {
              feedbackEl.innerHTML = `<div class="micro-fb ok">🎉 정답입니다! <strong>${specimen.name} (${specimen.scientific})</strong> 감별 성공!</div>`;
            }
            if (window.ParasiteAchievements) {
              window.ParasiteAchievements.recordMicroscope(solvedSlides.size);
              window.ParasiteAchievements.markExplored(specimen.id);
            }
            renderSlideUI();
          } else {
            btn.classList.add('wrong');
            if (feedbackEl) {
              feedbackEl.innerHTML = `<div class="micro-fb err">❌ 아쉽네요! 초점을 50에 맞추고 염색/배율을 조절해 다시 관찰해 보세요.</div>`;
            }
          }
        });
      });
    }
  }

  function init() {
    const canvas = document.getElementById('microscope-canvas');
    if (!canvas) return;

    animator = new window.ParasiteCanvasAnimator(canvas);
    animator.start();

    document.querySelectorAll('.micro-zoom-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.micro-zoom-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentZoom = parseInt(btn.dataset.zoom, 10);
        updateCanvas();
      });
    });

    document.querySelectorAll('.micro-stain-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.micro-stain-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentStain = btn.dataset.stain;
        updateCanvas();
      });
    });

    const focusSlider = document.getElementById('micro-focus-slider');
    if (focusSlider) {
      focusSlider.addEventListener('input', (e) => {
        currentFocus = parseInt(e.target.value, 10);
        updateCanvas();
      });
    }

    renderSlideUI();
    updateCanvas();
  }

  window.ParasiteMicroscope = { init };
})();
