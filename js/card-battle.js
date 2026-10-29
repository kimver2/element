// ⚔️ 원소 카드 스탯 배틀 (밸런스 매칭 & 양방향 전략 배틀 시스템)

(function() {
  let playerCard = null;
  let rivalCard = null;
  let battleWins = 0;
  let battleStreak = 0;
  let isBattling = false;

  // 화학 반응성 추정 점수 (1~100)
  function getReactivity(el) {
    if (el.category === 'noble-gas') return 8;
    if (el.category === 'alkali-metal') return 95 - (7 - el.period) * 4;
    if (el.category === 'halogen') return 92 - (el.period - 2) * 5;
    if (el.category === 'alkaline-earth') return 70 + (el.period * 2);
    if (el.isRadioactive) return 85;
    if (['Au', 'Pt', 'Ir'].includes(el.symbol)) return 15; // 반응성 매우 낮음
    return 35 + (el.num % 45);
  }

  // 희귀도/가치 추정 점수 (1~100)
  function getRarity(el) {
    if (el.num > 110) return 99;
    if ([78, 79, 45, 46, 44, 98].includes(el.num)) return 95; // 금, 백금, 캘리포늄 등
    if (el.isRadioactive) return 85;
    if (el.category === 'lanthanide') return 78;
    if ([1, 6, 8, 26, 13, 14, 20].includes(el.num)) return 15; // 수소, 탄소, 산소, 철, 알루미늄 등 흔함
    return 25 + (el.num % 50);
  }

  // 속성 상성 계산 (가위바위보 보너스 +20%)
  function getAffinityMultiplier(attacker, defender) {
    const aCat = attacker.category;
    const dCat = defender.category;

    // 1. 활성 원소(알칼리/할로겐) -> 비활성 기체 공략
    if ((aCat === 'alkali-metal' || aCat === 'halogen') && dCat === 'noble-gas') return 1.25;
    // 2. 비활성 기체 -> 방사성/초중원소 안정화 방어
    if (aCat === 'noble-gas' && (defender.isRadioactive || defender.num > 100)) return 1.25;
    // 3. 방사성 원소 -> 일반 전이 금속 압도
    if (attacker.isRadioactive && dCat === 'transition-metal') return 1.25;
    // 4. 전이 금속 -> 반응성 비금속/알칼리 침식 방어
    if (aCat === 'transition-metal' && (dCat === 'alkali-metal' || dCat === 'halogen')) return 1.25;

    return 1.0;
  }

  // 특정 스탯에서 A가 B를 이기는지 판별
  // mp: 높을수록 승리 (고온 내열)
  // lightness: 밀도가 낮을수록 승리! (수소, 헬륨, 탄소의 필살기)
  // react: 높을수록 승리 (화학 반응성)
  // rarity: 높을수록 승리 (희귀도)
  function compareStat(statKey, cardA, cardB) {
    const aMp = cardA.meltingPoint !== undefined ? cardA.meltingPoint : 1000;
    const bMp = cardB.meltingPoint !== undefined ? cardB.meltingPoint : 1000;
    const aDens = cardA.density !== undefined ? cardA.density : 5.0;
    const bDens = cardB.density !== undefined ? cardB.density : 5.0;
    const aReact = getReactivity(cardA);
    const bReact = getReactivity(cardB);
    const aRarity = getRarity(cardA);
    const bRarity = getRarity(cardB);

    if (statKey === 'mp') return aMp > bMp ? 1 : aMp < bMp ? -1 : 0;
    if (statKey === 'lightness') return aDens < bDens ? 1 : aDens > bDens ? -1 : 0; // 가벼울수록 승리!
    if (statKey === 'react') return aReact > bReact ? 1 : aReact < bReact ? -1 : 0;
    if (statKey === 'rarity') return aRarity > bRarity ? 1 : aRarity < bRarity ? -1 : 0;
    return 0;
  }

  // 밸런스 검증: 플레이어가 이길 수 있는 스탯과 라이벌이 이길 수 있는 스탯이 각각 최소 1개 이상 존재해야 함!
  function isMatchBalanced(cPlayer, cRival) {
    const stats = ['mp', 'lightness', 'react', 'rarity'];
    let playerWins = 0;
    let rivalWins = 0;

    stats.forEach(st => {
      const cmp = compareStat(st, cPlayer, cRival);
      if (cmp > 0) playerWins++;
      else if (cmp < 0) rivalWins++;
    });

    // 플레이어가 4개 다 이기거나(무조건 승리), 라이벌이 4개 다 이기는(무조건 패배) 조합은 탈락!
    return playerWins >= 1 && rivalWins >= 1;
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

  function renderBattleCard(el, containerId, hideStats = false, opponent = null) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const mp = el.meltingPoint !== undefined ? el.meltingPoint : 1000;
    const dens = el.density !== undefined ? el.density : 5.0;
    const react = getReactivity(el);
    const rarity = getRarity(el);
    const rarityLabel = el.rarity || 'COMMON';

    let advantageTag = '';
    if (opponent) {
      const mult = getAffinityMultiplier(el, opponent);
      if (mult > 1.0) {
        advantageTag = `<div class="affinity-tag advantage">⚡ 속성 상성 우위! (+25% 파워)</div>`;
      }
    }

    container.innerHTML = `
      <div class="battle-card-box cat-${el.category}">
        <div class="bcard-top">
          <span class="bcard-num">#${el.num}</span>
          <span class="rarity-badge ${rarityLabel.toLowerCase()}">${rarityLabel}</span>
        </div>
        <div class="bcard-symbol">${el.symbol}</div>
        <div class="bcard-name">${el.nameKo} <small style="color:var(--text-muted)">(${el.nameEn})</small></div>
        ${advantageTag}
        
        <div class="bcard-stats">
          <div class="bstat-row" data-stat="mp">
            <span class="stat-name">🔥 고온 내열 (녹는점)</span>
            <span class="stat-rule">[높을수록 승리]</span>
            <span class="stat-val">${hideStats ? '???' : mp + ' ℃'}</span>
          </div>
          <div class="bstat-row" data-stat="lightness">
            <span class="stat-name">🚀 가벼움 (민첩성)</span>
            <span class="stat-rule" style="color:var(--accent-cyan); font-weight:700;">[가벼울수록 승리!]</span>
            <span class="stat-val">${hideStats ? '???' : dens + ' g/cm³'}</span>
          </div>
          <div class="bstat-row" data-stat="react">
            <span class="stat-name">💥 화학 반응성</span>
            <span class="stat-rule">[높을수록 승리]</span>
            <span class="stat-val">${hideStats ? '???' : react + ' 점'}</span>
          </div>
          <div class="bstat-row" data-stat="rarity">
            <span class="stat-name">💎 희귀도 가치</span>
            <span class="stat-rule">[높을수록 승리]</span>
            <span class="stat-val">${hideStats ? '???' : rarity + ' 점'}</span>
          </div>
        </div>
      </div>
    `;
  }

  // 밸런스가 잡힌 카드 2장 뽑기 (무조건 이기거나 무조건 지는 조합 원천 차단!)
  function drawNewCards() {
    isBattling = false;
    playerCard = pickRandomElement();

    // 밸런스가 맞는 라이벌 카드가 나올 때까지 탐색 (최대 100회)
    let foundRival = null;
    for (let i = 0; i < 100; i++) {
      const candidate = pickRandomElement();
      if (candidate.num !== playerCard.num && isMatchBalanced(playerCard, candidate)) {
        foundRival = candidate;
        break;
      }
    }

    if (!foundRival) {
      // 혹시 못 찾을 경우 다른 플레이어 카드로 다시 시도
      playerCard = pickRandomElement();
      foundRival = pickRandomElement();
    }
    rivalCard = foundRival;

    renderBattleCard(playerCard, 'player-card-container', false, rivalCard);
    renderBattleCard(rivalCard, 'rival-card-container', true, playerCard); // 라이벌 스탯은 물음표

    const resultBox = document.getElementById('battle-result-msg');
    if (resultBox) {
      resultBox.innerHTML = `👉 나의 강점 스탯을 선택하세요! <b style="color:var(--accent-gold);">(💡 가벼움 승부는 밀도가 낮을수록 승리합니다!)</b>`;
      resultBox.className = 'battle-result-bar normal';
    }

    // 플레이어 스탯 행 클릭 이벤트 바인딩
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

    // 라이벌 스탯 전체 공개
    renderBattleCard(rivalCard, 'rival-card-container', false, playerCard);

    // 상성 배수
    const pMult = getAffinityMultiplier(playerCard, rivalCard);
    const rMult = getAffinityMultiplier(rivalCard, playerCard);

    const pMp = (playerCard.meltingPoint !== undefined ? playerCard.meltingPoint : 1000) * (pMult > 1 ? 1.15 : 1.0);
    const rMp = (rivalCard.meltingPoint !== undefined ? rivalCard.meltingPoint : 1000) * (rMult > 1 ? 1.15 : 1.0);

    // 가벼움: 밀도에 상성 보너스를 주어 가벼운 효과 증대
    const pDens = (playerCard.density !== undefined ? playerCard.density : 5.0) / (pMult > 1 ? 1.2 : 1.0);
    const rDens = (rivalCard.density !== undefined ? rivalCard.density : 5.0) / (rMult > 1 ? 1.2 : 1.0);

    const pReact = Math.round(getReactivity(playerCard) * pMult);
    const rReact = Math.round(getReactivity(rivalCard) * rMult);

    const pRarity = Math.round(getRarity(playerCard) * pMult);
    const rRarity = Math.round(getRarity(rivalCard) * rMult);

    let isWin = false;
    let isDraw = false;
    let statLabel = '';
    let pDisplayVal = '';
    let rDisplayVal = '';

    if (statKey === 'mp') {
      statLabel = '고온 내열 (녹는점)';
      isWin = pMp > rMp;
      isDraw = pMp === rMp;
      pDisplayVal = `${Math.round(pMp)}℃`;
      rDisplayVal = `${Math.round(rMp)}℃`;
    } else if (statKey === 'lightness') {
      statLabel = '가벼움 (민첩성)';
      // 🚀 가벼움 승부는 밀도가 낮을수록 승리!
      isWin = pDens < rDens;
      isDraw = pDens === rDens;
      pDisplayVal = `${pDens.toFixed(3)}g/cm³ (더 가벼움!)`;
      rDisplayVal = `${rDens.toFixed(3)}g/cm³`;
    } else if (statKey === 'react') {
      statLabel = '화학 반응성';
      isWin = pReact > rReact;
      isDraw = pReact === rReact;
      pDisplayVal = `${pReact}점`;
      rDisplayVal = `${rReact}점`;
    } else {
      statLabel = '희귀도 가치';
      isWin = pRarity > rRarity;
      isDraw = pRarity === rRarity;
      pDisplayVal = `${pRarity}점`;
      rDisplayVal = `${rRarity}점`;
    }

    playBattleSound(isWin);

    const resultBox = document.getElementById('battle-result-msg');
    const scoreBadge = document.getElementById('battle-score-badge');

    if (isDraw) {
      resultBox.className = 'battle-result-bar draw';
      resultBox.innerHTML = `🤝 무승부! [${statLabel}] 둘의 수치가 호각입니다! (${pDisplayVal} vs ${rDisplayVal})`;
    } else if (isWin) {
      battleWins++;
      battleStreak++;
      resultBox.className = 'battle-result-bar win';
      resultBox.innerHTML = `🏆 승리! 나의 <b>${playerCard.nameKo}</b>(${pDisplayVal})이(가) 라이벌의 <b>${rivalCard.nameKo}</b>(${rDisplayVal})을(를) [${statLabel}] 대결에서 제압했습니다!`;
    } else {
      battleStreak = 0;
      resultBox.className = 'battle-result-bar lose';
      resultBox.innerHTML = `😢 패배! 라이벌의 <b>${rivalCard.nameKo}</b>(${rDisplayVal})이(가) [${statLabel}] 대결에서 더 우세했습니다! (나: ${pDisplayVal})`;
    }

    if (scoreBadge) {
      scoreBadge.innerText = `승리: ${battleWins}승 | 연속: ${battleStreak}콤보`;
    }
  }

  window.initCardBattle = function() {
    drawNewCards();
    const newDrawBtn = document.getElementById('battle-new-draw-btn');
    if (newDrawBtn) {
      const newBtn = newDrawBtn.cloneNode(true);
      newDrawBtn.parentNode.replaceChild(newBtn, newDrawBtn);
      newBtn.addEventListener('click', drawNewCards);
    }
  };
})();
