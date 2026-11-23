// 기생충·선충 탐험대 도감 완성률 & 업적 시스템

(function() {
  const KEY_EXPLORED = 'exploredParasites';
  const KEY_UNLOCKED = 'unlockedParasiteAchievements';
  const KEY_STATS = 'parasiteLabStats';

  function getExplored() {
    return JSON.parse(localStorage.getItem(KEY_EXPLORED) || '[]');
  }

  function getUnlocked() {
    return JSON.parse(localStorage.getItem(KEY_UNLOCKED) || '[]');
  }

  function getStats() {
    return JSON.parse(localStorage.getItem(KEY_STATS) || '{"blockedCount":0,"microscopeSolved":0,"battleWins":0,"quizBest":0}');
  }

  function saveStats(stats) {
    localStorage.setItem(KEY_STATS, JSON.stringify(stats));
  }

  function evaluateAchievements() {
    const ctx = {
      explored: getExplored(),
      ...getStats()
    };
    const unlocked = getUnlocked();
    let newlyUnlocked = false;

    PARASITE_ACHIEVEMENTS.forEach(ach => {
      if (!unlocked.includes(ach.id) && ach.check(ctx)) {
        unlocked.push(ach.id);
        newlyUnlocked = true;
      }
    });

    if (newlyUnlocked) {
      localStorage.setItem(KEY_UNLOCKED, JSON.stringify(unlocked));
    }
    renderAchievements();
    updateProgressBar();
  }

  function markExplored(id) {
    const explored = getExplored();
    if (!explored.includes(id)) {
      explored.push(id);
      localStorage.setItem(KEY_EXPLORED, JSON.stringify(explored));
      evaluateAchievements();
      if (window.ParasiteAtlas) window.ParasiteAtlas.refresh();
    }
  }

  function recordBlocked(count) {
    const stats = getStats();
    if (count > stats.blockedCount) {
      stats.blockedCount = count;
      saveStats(stats);
      evaluateAchievements();
    }
  }

  function recordMicroscope(count) {
    const stats = getStats();
    if (count > stats.microscopeSolved) {
      stats.microscopeSolved = count;
      saveStats(stats);
      evaluateAchievements();
    }
  }

  function recordBattleWin(wins) {
    const stats = getStats();
    if (wins > stats.battleWins) {
      stats.battleWins = wins;
      saveStats(stats);
      evaluateAchievements();
    }
  }

  function recordQuizScore(score) {
    const stats = getStats();
    if (score > stats.quizBest) {
      stats.quizBest = score;
      saveStats(stats);
      evaluateAchievements();
    }
  }

  function updateProgressBar() {
    const explored = getExplored();
    const total = PARASITES_DATA.length;
    const pct = Math.round((explored.length / total) * 100);
    const label = document.getElementById('p-explorer-progress-label');
    const fill = document.getElementById('p-explorer-progress-fill');
    if (label) label.textContent = `도감 완성률: ${explored.length} / ${total} (${pct}%)`;
    if (fill) fill.style.width = `${pct}%`;
  }

  function renderAchievements() {
    const grid = document.getElementById('p-achievements-grid');
    if (!grid) return;

    const unlocked = getUnlocked();
    grid.innerHTML = PARASITE_ACHIEVEMENTS.map(ach => {
      const isDone = unlocked.includes(ach.id);
      return `
        <div class="ach-card ${isDone ? 'unlocked' : 'locked'}">
          <div class="ach-icon">${ach.icon}</div>
          <div class="ach-info">
            <h4 class="ach-name">${ach.name}</h4>
            <p class="ach-desc">${ach.desc}</p>
          </div>
          <span class="ach-badge">${isDone ? '획득 ✓' : '잠김'}</span>
        </div>
      `;
    }).join('');
  }

  window.ParasiteAchievements = {
    init: () => {
      updateProgressBar();
      renderAchievements();
    },
    getExplored,
    markExplored,
    recordBlocked,
    recordMicroscope,
    recordBattleWin,
    recordQuizScore
  };
})();
