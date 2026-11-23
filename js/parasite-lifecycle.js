// 생애주기(생활사) 시뮬레이터 & 예방 차단 시뮬레이터

(function() {
  let selectedId = 1; // 기본: 회충
  let activeStep = 0;
  let activeActions = new Set();

  function renderLifeCycleSelector() {
    const sel = document.getElementById('lc-species-select');
    if (!sel) return;
    sel.innerHTML = PARASITES_DATA.map(p =>
      `<option value="${p.id}">#${p.id} ${p.name} (${p.categoryName})</option>`
    ).join('');
    sel.value = String(selectedId);
    sel.addEventListener('change', (e) => {
      selectedId = parseInt(e.target.value, 10);
      activeStep = 0;
      renderLifeCycleFlow();
    });
  }

  function renderLifeCycleFlow() {
    const p = PARASITES_DATA.find(x => x.id === selectedId) || PARASITES_DATA[0];
    const flowEl = document.getElementById('lc-flow-container');
    const summaryEl = document.getElementById('lc-species-summary');
    if (!flowEl || !summaryEl) return;

    const cat = PARASITE_CATEGORIES[p.category];
    summaryEl.innerHTML = `
      <div class="lc-summary-left">
        ${window.getParasiteSVG(p, 58)}
        <div>
          <h4>${p.name} <span style="color:${cat.color};font-size:0.85rem;">(${p.scientific})</span></h4>
          <p><strong>숙주:</strong> ${p.host} · <strong>중간숙주:</strong> ${p.intermediateHost}</p>
          <p><strong>감염 경로:</strong> ${p.transmission}</p>
        </div>
      </div>
      <div class="lc-summary-actions">
        <button id="lc-next-step-btn" class="lc-step-btn">▶ 다음 단계 보기</button>
      </div>
    `;

    const stepsHtml = p.lifeCycle.map((stepText, idx) => {
      const isCurrent = idx === activeStep;
      const isDone = idx < activeStep;
      return `
        <div class="lc-step-card ${isCurrent ? 'active' : ''} ${isDone ? 'done' : ''}" data-step="${idx}">
          <div class="lc-step-num">STEP ${idx + 1}</div>
          <div class="lc-step-text">${stepText}</div>
        </div>
        ${idx < p.lifeCycle.length - 1 ? '<div class="lc-arrow">➔</div>' : ''}
      `;
    }).join('');

    flowEl.innerHTML = stepsHtml;

    flowEl.querySelectorAll('.lc-step-card').forEach(card => {
      card.addEventListener('click', () => {
        activeStep = parseInt(card.dataset.step, 10);
        renderLifeCycleFlow();
      });
    });

    const nextBtn = document.getElementById('lc-next-step-btn');
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        activeStep = (activeStep + 1) % p.lifeCycle.length;
        renderLifeCycleFlow();
      });
    }
  }

  function renderPreventionLab() {
    const btnGrid = document.getElementById('prevention-actions-grid');
    const resultEl = document.getElementById('prevention-result-grid');
    const counterEl = document.getElementById('prevention-blocked-counter');
    if (!btnGrid || !resultEl) return;

    btnGrid.innerHTML = PREVENTION_ACTIONS.map(act => {
      const isOn = activeActions.has(act.id);
      return `
        <button class="prev-action-btn ${isOn ? 'active' : ''}" data-act="${act.id}">
          <div class="prev-act-icon">${act.icon}</div>
          <div class="prev-act-info">
            <div class="prev-act-name">${act.name}</div>
            <div class="prev-act-desc">${act.desc}</div>
          </div>
          <span class="prev-act-toggle">${isOn ? 'ON ✓' : 'OFF'}</span>
        </button>
      `;
    }).join('');

    const blockedIds = new Set();
    PREVENTION_ACTIONS.forEach(act => {
      if (activeActions.has(act.id)) {
        act.blocks.forEach(id => blockedIds.add(id));
      }
    });

    const targets = PARASITES_DATA.filter(p => p.isParasite !== false && p.id !== 12 && p.id !== 31);
    if (counterEl) {
      counterEl.textContent = `차단 성공: ${blockedIds.size}종 / ${targets.length}종 (인체·반려동물 기생충)`;
    }

    if (window.ParasiteAchievements) {
      window.ParasiteAchievements.recordBlocked(blockedIds.size);
    }

    resultEl.innerHTML = targets.map(p => {
      const isBlocked = blockedIds.has(p.id);
      return `
        <div class="prev-target-chip ${isBlocked ? 'blocked' : ''}">
          <span>${isBlocked ? '🛡️' : '⚠️'}</span>
          <span>${p.name}</span>
        </div>
      `;
    }).join('');

    btnGrid.querySelectorAll('.prev-action-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.act;
        if (activeActions.has(id)) activeActions.delete(id);
        else activeActions.add(id);
        renderPreventionLab();
      });
    });
  }

  window.ParasiteLifecycle = {
    init: () => {
      renderLifeCycleSelector();
      renderLifeCycleFlow();
      renderPreventionLab();
    }
  };
})();
