// ⚔️ 원소 카드 스탯 배틀 (Element Top Trumps)

(function() {
  let playerCard = null;
  let rivalCard = null;
  let battleWins = 0;
  let battleStreak = 0;
  let isBattling = false;

  // 화학 반응성 추정 점수 (1~100)
  function getReactivity(el) {
    if (el.category === 'noble-gas') return 5;
    if (el.category === 'alkali-metal') return 95 - (7 - el.period) * 5;
    if (el.category === 'halogen') return 90 - (el.period - 2) * 5;
    if (el.category === 'alkaline-earth') return 75;
    if (el.isRadioactive) return 85;
    return 40 + (el.num % 40);
  }

  // 희귀도/가치 추정 점수 (1~100)
  function getRarity(el) {
    if (el.num > 100) return 99;
    if ([78, 79, 45, 46, 44, 98].includes(el.num)) return 95; // 금, 백금, 캘리포늄 등
    if (el.category === 'lanthanide') return 80;
    if ([1, 6, 8, 26, 13, 14].includes(el.num)) return 15; // 수소, 산소, 철, 알루미늄 등 흔함
    return 30 + (el.num % 50);
  }

  function pickRandomElement() {
    const std = window.PERIODIC_DATA.standardElements;
    return std[Math.floor(Math.random() * std.length)];
  }

  function playBattleSound(isWin) {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (isWin) {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.25);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.3);
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
      } else {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(200, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(100, ctx.currentTime + 0.25);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.3);
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
      }
    } catch(e) {}
  }

  function renderBattleCard(el, containerId, hideStats = false) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const mp = el.meltingPoint !== undefined ? el.meltingPoint : 1000;
    const dens = el.density !== undefined ? el.density : 5.0;
    const react = getReactivity(el);
    const rarity = getRarity(el);

    container.innerHTML = `
      <div class="battle-card-box cat-${el.category}">
        <div class="bcard-top">
          <span class="bcard-num">#${el.num}</span>
          <span class="bcard-cat">${el.category}</span>
        </div>
        <div class="bcard-symbol">${el.symbol}</div>
        <div class="bcard-name">${el.nameKo} <small>(${el.nameEn})</small></div>
        
        <div class="bcard-stats">
          <div class="bstat-row" data-stat="mp">
            <span class="stat-name">🌡️ 녹는점</span>
            <span class="stat-val">${hideStats ? '???' : mp + ' ℃'}</span>
          </div>
          <div class="bstat-row" data-stat="dens">
            <span class="stat-name">⚖️ 밀도</span>
            <span class="stat-val">${hideStats ? '???' : dens + ' g/cm³'}</span>
          </div>
          <div class="bstat-row" data-stat="react">
            <span class="stat-name">💥 반응성</span>
            <span class="stat-val">${hideStats ? '???' : react + ' 점'}</span>
          </div>
          <div class="bstat-row" data-stat="rarity">
            <span class="stat-name">💎 희귀도</span>
            <span class="stat-val">${hideStats ? '???' : rarity + ' 점'}</span>
          </div>
        </div>
      </div>
    `;
  }

  function drawNewCards() {
    isBattling = false;
    playerCard = pickRandomElement();
    rivalCard = pickRandomElement();
    while (rivalCard.num === playerCard.num) {
      rivalCard = pickRandomElement();
    }

    renderBattleCard(playerCard, 'player-card-container', false);
    renderBattleCard(rivalCard, 'rival-card-container', true); // 라이벌 스탯은 대결 전까지 물음표

    const resultBox = document.getElementById('battle-result-msg');
    if (resultBox) {
      resultBox.innerHTML = `👉 승리할 것 같은 스탯 버튼을 골라 대결을 신청하세요!`;
      resultBox.className = 'battle-result-bar normal';
    }

    // 플레이어 스탯 행 클릭 가능하게
    const statRows = document.querySelectorAll('#player-card-container .bstat-row');
    statRows.forEach(row => {
      row.style.cursor = 'pointer';
      row.addEventListener('click', () => {
        if (isBattling) return;
        executeBattle(row.dataset.stat);
      });
    });
  }

  function executeBattle(statKey) {
    isBattling = true;

    // 라이벌 스탯 공개
    renderBattleCard(rivalCard, 'rival-card-container', false);

    const pMp = playerCard.meltingPoint || 1000;
    const rMp = rivalCard.meltingPoint || 1000;
    const pDens = playerCard.density || 5.0;
    const rDens = rivalCard.density || 5.0;
    const pReact = getReactivity(playerCard);
    const rReact = getReactivity(rivalCard);
    const pRarity = getRarity(playerCard);
    const rRarity = getRarity(rivalCard);

    let pVal, rVal, statLabel;
    if (statKey === 'mp') { pVal = pMp; rVal = rMp; statLabel = '녹는점'; }
    else if (statKey === 'dens') { pVal = pDens; rVal = rDens; statLabel = '밀도'; }
    else if (statKey === 'react') { pVal = pReact; rVal = rReact; statLabel = '반응성'; }
    else { pVal = pRarity; rVal = rRarity; statLabel = '희귀도'; }

    const isWin = pVal > rVal;
    const isDraw = pVal === rVal;

    playBattleSound(isWin);

    const resultBox = document.getElementById('battle-result-msg');
    const scoreBadge = document.getElementById('battle-score-badge');

    if (isDraw) {
      resultBox.className = 'battle-result-bar draw';
      resultBox.innerHTML = `🤝 무승부! 둘의 ${statLabel} 수치가 같습니다! (${pVal} vs ${rVal})`;
    } else if (isWin) {
      battleWins++;
      battleStreak++;
      resultBox.className = 'battle-result-bar win';
      resultBox.innerHTML = `🏆 승리! 나의 ${playerCard.nameKo}(${pVal}) > 라이벌의 ${rivalCard.nameKo}(${rVal})!`;
    } else {
      battleStreak = 0;
      resultBox.className = 'battle-result-bar lose';
      resultBox.innerHTML = `😢 패배! 라이벌의 ${rivalCard.nameKo}(${rVal})이 나의 ${playerCard.nameKo}(${pVal})보다 높았습니다!`;
    }

    if (scoreBadge) {
      scoreBadge.innerText = `승리: ${battleWins}승 | 연속: ${battleStreak}콤보`;
    }
  }

  window.initCardBattle = function() {
    drawNewCards();
    const newDrawBtn = document.getElementById('battle-new-draw-btn');
    if (newDrawBtn) {
      newDrawBtn.addEventListener('click', drawNewCards);
    }
  };
})();
