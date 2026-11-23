// 기생충·선충 생존 스탯 카드 배틀 (Top Trumps)

(function() {
  let playerCard = null;
  let aiCard = null;
  let wins = 0;
  let losses = 0;
  let combo = 0;
  let roundDone = false;

  const STAT_LABELS = {
    size: '📏 몸집 크기',
    reproduction: '🥚 번식력',
    resilience: '🛡️ 환경 생존력',
    pathogenicity: '⚠️ 병원성·위험도'
  };

  function pickTwoCards() {
    const shuffled = [...PARASITES_DATA].sort(() => 0.5 - Math.random());
    playerCard = shuffled[0];
    aiCard = shuffled[1];
    roundDone = false;
    renderArena();
  }

  function renderArena() {
    const pSlot = document.getElementById('battle-player-card');
    const aSlot = document.getElementById('battle-ai-card');
    const msgEl = document.getElementById('battle-result-msg');
    if (!pSlot || !aSlot) return;

    const pCat = PARASITE_CATEGORIES[playerCard.category];
    const aCat = PARASITE_CATEGORIES[aiCard.category];

    pSlot.innerHTML = `
      <div class="battle-card-header" style="border-bottom:2px solid ${pCat.color};">
        <span class="battle-role">MY CARD</span>
        <span class="battle-cat">${playerCard.categoryName}</span>
      </div>
      <div class="battle-visual">${window.getParasiteSVG(playerCard, 78)}</div>
      <h3 class="battle-name">${playerCard.name}</h3>
      <p class="battle-sci">${playerCard.scientific}</p>
      <div class="battle-stats-list">
        ${Object.entries(STAT_LABELS).map(([key, label]) => `
          <button class="battle-stat-btn" data-stat="${key}" ${roundDone ? 'disabled' : ''}>
            <span>${label}</span>
            <strong>${playerCard.stats[key]}</strong>
          </button>
        `).join('')}
      </div>
    `;

    aSlot.innerHTML = `
      <div class="battle-card-header" style="border-bottom:2px solid ${aCat.color};">
        <span class="battle-role">RIVAL AI</span>
        <span class="battle-cat">${aiCard.categoryName}</span>
      </div>
      <div class="battle-visual">${window.getParasiteSVG(aiCard, 78)}</div>
      <h3 class="battle-name">${aiCard.name}</h3>
      <p class="battle-sci">${aiCard.scientific}</p>
      <div class="battle-stats-list">
        ${Object.entries(STAT_LABELS).map(([key, label]) => `
          <div class="battle-stat-row-ai">
            <span>${label}</span>
            <strong>${roundDone ? aiCard.stats[key] : '???'}</strong>
          </div>
        `).join('')}
      </div>
    `;

    if (msgEl && !roundDone) {
      msgEl.innerHTML = '⚔️ 나의 카드에서 대결할 스탯 1개를 선택하세요!';
      msgEl.className = 'battle-result-msg';
    }

    pSlot.querySelectorAll('.battle-stat-btn').forEach(btn => {
      btn.addEventListener('click', () => resolveRound(btn.dataset.stat));
    });

    updateScoreboard();
  }

  function resolveRound(statKey) {
    if (roundDone) return;
    roundDone = true;

    const pVal = playerCard.stats[statKey];
    const aVal = aiCard.stats[statKey];
    const msgEl = document.getElementById('battle-result-msg');

    renderArena();

    if (pVal > aVal) {
      wins++;
      combo++;
      if (msgEl) {
        msgEl.innerHTML = `🎉 승리! <strong>${playerCard.name}</strong> (${pVal}) vs ${aiCard.name} (${aVal})`;
        msgEl.className = 'battle-result-msg win';
      }
      if (window.ParasiteAchievements) {
        window.ParasiteAchievements.recordBattleWin(wins);
      }
    } else if (pVal < aVal) {
      losses++;
      combo = 0;
      if (msgEl) {
        msgEl.innerHTML = `💥 패배... ${playerCard.name} (${pVal}) vs <strong>${aiCard.name}</strong> (${aVal})`;
        msgEl.className = 'battle-result-msg lose';
      }
    } else {
      if (msgEl) {
        msgEl.innerHTML = `🤝 무승부! (${pVal} vs ${aVal})`;
        msgEl.className = 'battle-result-msg draw';
      }
    }

    updateScoreboard();
  }

  function updateScoreboard() {
    const wEl = document.getElementById('battle-wins');
    const lEl = document.getElementById('battle-losses');
    const cEl = document.getElementById('battle-combo');
    if (wEl) wEl.textContent = wins;
    if (lEl) lEl.textContent = losses;
    if (cEl) cEl.textContent = combo;
  }

  function init() {
    const nextBtn = document.getElementById('battle-next-btn');
    if (nextBtn) {
      nextBtn.addEventListener('click', pickTwoCards);
    }
    pickTwoCards();
  }

  window.ParasiteBattle = { init };
})();
