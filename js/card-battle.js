// ⚔️ 원소 카드 스탯 배틀 (전기 전도도 스탯 & 자유로운 카드 교체 시스템 - v2.3)

(function() {
  let playerCard = null;
  let rivalCard = null;
  let battleWins = 0;
  let battleStreak = 0;
  let isBattling = false;

  // 1. ⚡ 전기 전도도 파워 (1~100) - 원자 번호와 완전히 무관한 고유 스탯!
  // 은(100), 구리(97), 금(76), 알루미늄(65), 칼슘(35), 철(18), 백금(16), 납(8), 비금속/기체(0~2)
  function getConductivity(el) {
    const sym = el.symbol;
    if (sym === 'Ag') return 100; // 은 1등
    if (sym === 'Cu') return 97;  // 구리 2등
    if (sym === 'Au') return 76;  // 금 3등
    if (sym === 'Al') return 65;  // 알루미늄 4등
    if (sym === 'Ca') return 35;
    if (sym === 'Mg') return 38;
    if (sym === 'Na') return 32;
    if (sym === 'Zn') return 28;
    if (sym === 'Ni') return 24;
    if (sym === 'Fe') return 18;  // 철
    if (sym === 'Pt') return 16;  // 백금
    if (sym === 'Sn') return 15;  // 주석
    if (sym === 'Pb') return 8;   // 납
    if (sym === 'Ti') return 4;   // 타이타늄
    if (sym === 'Hg') return 2;   // 수은

    // 일반 분류별 추정
    if (el.category === 'transition-metal') return 20 + (el.num % 25);
    if (el.category === 'post-transition') return 15 + (el.num % 15);
    if (el.category === 'alkali-metal') return 25 + (el.num % 10);
    if (el.category === 'alkaline-earth') return 22 + (el.num % 10);
    if (el.category === 'metalloid') return 5 + (el.num % 6);
    // 비금속/기체는 전기 전도도 거의 0
    return 1;
  }

  // 2. 💥 화학 반응 폭발력 (1~100) - 알칼리/할로겐 최강, 금/백금/비활성기체 최하
  function getReactivity(el) {
    if (el.category === 'noble-gas') return 5;
    if (['Au', 'Pt', 'Ir'].includes(el.symbol)) return 12; // 금, 백금은 반응 안 함
    if (el.category === 'alkali-metal') return 95 - (7 - el.period) * 4; // 프랑슘, 세슘, 나트륨 최강
    if (el.category === 'halogen') return 94 - (el.period - 2) * 5;      // 플루오린, 염소 최강
    if (el.category === 'alkaline-earth') return 72 + (el.period * 2);
    if (el.isRadioactive) return 86;
    return 30 + (el.num % 40);
  }

  // 3. 💎 희귀도 및 가치 (1~100) - 캘리포늄, 금, 백금, 초중원소 최강
  function getRarity(el) {
    if (el.num > 110) return 99;
    if ([78, 79, 45, 46, 44, 98].includes(el.num)) return 96; // 금, 백금, 캘리포늄 등
    if (el.isRadioactive) return 88;
    if (el.category === 'lanthanide') return 80;
    if ([1, 6, 8, 26, 13, 14, 20].includes(el.num)) return 15; // 수소, 산소, 철, 알루미늄 등 흔함
    return 28 + (el.num % 48);
  }

  // 4. 🔥 고온 내열 (녹는점 ℃)
  function getMeltingPoint(el) {
    return el.meltingPoint !== undefined ? el.meltingPoint : 1000;
  }

  // 속성 상성 가위바위보 (+25% 파워)
  function getAffinityMultiplier(attacker, defender) {
    const aCat = attacker.category;
    const dCat = defender.category;
    if ((aCat === 'alkali-metal' || aCat === 'halogen') && dCat === 'noble-gas') return 1.25;
    if (aCat === 'noble-gas' && (defender.isRadioactive || defender.num > 100)) return 1.25;
    if (attacker.isRadioactive && dCat === 'transition-metal') return 1.25;
    if (aCat === 'transition-metal' && (dCat === 'alkali-metal' || dCat === 'halogen')) return 1.25;
    return 1.0;
  }

  // 특정 스탯 승패 비교 (원자 번호와 상관없이 각 스탯 고유의 규칙 적용)
  function compareStat(statKey, cardA, cardB) {
    const aMp = getMeltingPoint(cardA);
    const bMp = getMeltingPoint(cardB);
    const aElec = getConductivity(cardA);
    const bElec = getConductivity(cardB);
    const aReact = getReactivity(cardA);
    const bReact = getReactivity(cardB);
    const aRarity = getRarity(cardA);
    const bRarity = getRarity(cardB);

    if (statKey === 'mp') return aMp > bMp ? 1 : aMp < bMp ? -1 : 0;
    if (statKey === 'elec') return aElec > bElec ? 1 : aElec < bElec ? -1 : 0;
    if (statKey === 'react') return aReact > bReact ? 1 : aReact < bReact ? -1 : 0;
    if (statKey === 'rarity') return aRarity > bRarity ? 1 : aRarity < bRarity ? -1 : 0;
    return 0;
  }

  // 밸런스 검증: 플레이어가 이길 수 있는 스탯과 라이벌이 이길 수 있는 스탯이 각각 1개 이상 존재!
  function isMatchBalanced(cPlayer, cRival) {
    const stats = ['mp', 'elec', 'react', 'rarity'];
    let playerWins = 0;
    let rivalWins = 0;

    stats.forEach(st => {
      const cmp = compareStat(st, cPlayer, cRival);
      if (cmp > 0) playerWins++;
      else if (cmp < 0) rivalWins++;
    });

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

    const mp = getMeltingPoint(el);
    const elec = getConductivity(el);
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
          <!-- 스탯 1: 녹는점 -->
          <div class="bstat-row" data-stat="mp">
            <span class="stat-name">🔥 고온 내열 (녹는점)</span>
            <span class="stat-val">${hideStats ? '???' : mp + ' ℃'}</span>
          </div>

          <!-- 스탯 2: 전기 전도도 (밀도 대신 원자번호와 무관한 전기 파워!) -->
          <div class="bstat-row" data-stat="elec">
            <span class="stat-name">⚡ 전기 전도 파워</span>
            <span class="stat-val">${hideStats ? '???' : elec + ' 점'}</span>
          </div>

          <!-- 스탯 3: 화학 반응성 -->
          <div class="bstat-row" data-stat="react">
            <span class="stat-name">💥 반응 폭발력</span>
            <span class="stat-val">${hideStats ? '???' : react + ' 점'}</span>
          </div>

          <!-- 스탯 4: 희귀도 -->
          <div class="bstat-row" data-stat="rarity">
            <span class="stat-name">💎 희귀도 가치</span>
            <span class="stat-val">${hideStats ? '???' : rarity + ' 점'}</span>
          </div>
        </div>
      </div>
    `;
  }

  // 균형 잡힌 카드 페어 세팅
  function setupMatchup(keepPlayer = false, keepRival = false) {
    isBattling = false;

    if (!keepPlayer || !playerCard) {
      playerCard = pickRandomElement();
    }

    if (!keepRival || !rivalCard) {
      let found = null;
      for (let i = 0; i < 100; i++) {
        const candidate = pickRandomElement();
        if (candidate.num !== playerCard.num && isMatchBalanced(playerCard, candidate)) {
          found = candidate;
          break;
        }
      }
      rivalCard = found || pickRandomElement();
    }

    renderBattleCard(playerCard, 'player-card-container', false, rivalCard);
    renderBattleCard(rivalCard, 'rival-card-container', true, playerCard);

    const resultBox = document.getElementById('battle-result-msg');
    if (resultBox) {
      resultBox.innerHTML = `👉 승리할 것 같은 나의 스탯을 터치해 대결을 시작하세요!`;
      resultBox.className = 'battle-result-bar normal';
    }

    // 플레이어 스탯 클릭 이벤트 바인딩
    const statRows = document.querySelectorAll('#player-card-container .bstat-row');
    statRows.forEach(row => {
      row.style.cursor = 'pointer';
      row.addEventListener('click', () => {
        if (isBattling) return;
        executeBattle(row.dataset.stat);
      });
    });
  }

  // 대결 실행 (카드를 골랐을 때)
  function executeBattle(statKey) {
    isBattling = true;

    // 라이벌 스탯 전체 공개
    renderBattleCard(rivalCard, 'rival-card-container', false, playerCard);

    const pMult = getAffinityMultiplier(playerCard, rivalCard);
    const rMult = getAffinityMultiplier(rivalCard, playerCard);

    const pMp = Math.round(getMeltingPoint(playerCard) * (pMult > 1 ? 1.15 : 1.0));
    const rMp = Math.round(getMeltingPoint(rivalCard) * (rMult > 1 ? 1.15 : 1.0));

    const pElec = Math.round(getConductivity(playerCard) * pMult);
    const rElec = Math.round(getConductivity(rivalCard) * rMult);

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
      statLabel = '고온 내열';
      isWin = pMp > rMp;
      isDraw = pMp === rMp;
      pDisplayVal = `${pMp}℃`;
      rDisplayVal = `${rMp}℃`;
    } else if (statKey === 'elec') {
      statLabel = '전기 전도 파워';
      isWin = pElec > rElec;
      isDraw = pElec === rElec;
      pDisplayVal = `${pElec}점`;
      rDisplayVal = `${rElec}점`;
    } else if (statKey === 'react') {
      statLabel = '반응 폭발력';
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

    let resultHtml = '';
    if (isDraw) {
      resultBox.className = 'battle-result-bar draw';
      resultHtml = `🤝 무승부! [${statLabel}] 대결에서 호각입니다! (${pDisplayVal} vs ${rDisplayVal})`;
    } else if (isWin) {
      battleWins++;
      battleStreak++;
      resultBox.className = 'battle-result-bar win';
      resultHtml = `🏆 승리! 나의 <b>${playerCard.nameKo}</b>(${pDisplayVal})이(가) 라이벌 <b>${rivalCard.nameKo}</b>(${rDisplayVal})을(를) [${statLabel}]에서 꺾었습니다!`;
    } else {
      battleStreak = 0;
      resultBox.className = 'battle-result-bar lose';
      resultHtml = `😢 패배! 라이벌 <b>${rivalCard.nameKo}</b>(${rDisplayVal})의 [${statLabel}]이 더 강했습니다! (나: ${pDisplayVal})`;
    }

    // 🎴 카드를 골랐을 때 다음 카드를 손쉽게 뽑을 수 있는 액션 버튼들 즉시 노출!
    resultBox.innerHTML = `
      <div style="margin-bottom:12px;">${resultHtml}</div>
      <div class="next-action-row">
        <button id="next-match-btn" class="fire-btn" style="padding:9px 18px; font-size:0.95rem; background:linear-gradient(135deg, #00d2ff, #0072ff);">
          🎴 다음 카드 대결하기! ➔
        </button>
        <button id="reroll-rival-btn" class="modal-nav-btn" style="padding:8px 14px; font-size:0.85rem;">
          👥 라이벌만 바꾸기 (내 카드 유지)
        </button>
        <button id="reroll-player-btn" class="modal-nav-btn" style="padding:8px 14px; font-size:0.85rem;">
          🔁 내 카드만 바꾸기
        </button>
      </div>
    `;

    // 액션 버튼 이벤트 바인딩
    document.getElementById('next-match-btn').addEventListener('click', () => setupMatchup(false, false));
    document.getElementById('reroll-rival-btn').addEventListener('click', () => setupMatchup(true, false));
    document.getElementById('reroll-player-btn').addEventListener('click', () => setupMatchup(false, true));

    if (scoreBadge) {
      scoreBadge.innerText = `승리: ${battleWins}승 | 연속: ${battleStreak}콤보`;
    }

    resultBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  window.initCardBattle = function() {
    setupMatchup(false, false);

    // 상단 새 카드 뽑기 버튼 바인딩
    const newDrawBtn = document.getElementById('battle-new-draw-btn');
    if (newDrawBtn) {
      const newBtn = newDrawBtn.cloneNode(true);
      newDrawBtn.parentNode.replaceChild(newBtn, newDrawBtn);
      newBtn.addEventListener('click', () => setupMatchup(false, false));
    }
  };
})();
