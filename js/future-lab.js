// 🚀 8주기 미래 원소 & 입자 가속기 충돌 시뮬레이터

(function() {
  const PROJECTILES = [
    { num: 20, symbol: 'Ca-48', name: '칼슘-48 (중성자 부자 칼슘)', protons: 20, mass: 48, color: '#ffa502' },
    { num: 22, symbol: 'Ti-50', name: '티타늄-50 (차세대 빔 입자)', protons: 22, mass: 50, color: '#2ed573' },
    { num: 23, symbol: 'V-51',  name: '바나듐-51 (고에너지 빔)', protons: 23, mass: 51, color: '#1e90ff' },
    { num: 24, symbol: 'Cr-54', name: '크로뮴-54 (초중량 융합용)', protons: 24, mass: 54, color: '#e056fd' }
  ];

  const TARGETS = [
    { num: 92, symbol: 'U-238',  name: '우라늄-238 표적', protons: 92, mass: 238, color: '#ff6b81' },
    { num: 94, symbol: 'Pu-244', name: '플루토늄-244 표적', protons: 94, mass: 244, color: '#ff4757' },
    { num: 96, symbol: 'Cm-248', name: '퀴륨-248 표적', protons: 96, mass: 248, color: '#e84393' },
    { num: 97, symbol: 'Bk-249', name: '버클륨-249 표적 (119번 열쇠)', protons: 97, mass: 249, color: '#9b59b6' },
    { num: 98, symbol: 'Cf-249', name: '캘리포늄-249 표적 (120번 열쇠)', protons: 98, mass: 249, color: '#f1c40f' },
    { num: 99, symbol: 'Es-254', name: '아인슈타이늄-254 표적', protons: 99, mass: 254, color: '#00cec9' }
  ];

  // 효과음 생성기 (Web Audio API)
  function playSound(type) {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);

      if (type === 'fire') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(800, audioCtx.currentTime + 0.3);
        gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, audioCtx.currentTime + 0.35);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.35);
      } else if (type === 'bang') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(100, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(30, audioCtx.currentTime + 0.5);
        gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.5);
      }
    } catch(e) {
      // 오디오 미지원 환경 무시
    }
  }

  function initCollider() {
    const projSelect = document.getElementById('projectile-select');
    const targetSelect = document.getElementById('target-select');
    const fireBtn = document.getElementById('fire-collider-btn');
    const projParticle = document.getElementById('particle-proj');
    const targetParticle = document.getElementById('particle-target');
    const resultBox = document.getElementById('collision-result');

    if (!projSelect || !targetSelect || !fireBtn) return;

    // 셀렉트 박스 채우기
    projSelect.innerHTML = PROJECTILES.map((p, idx) => 
      `<option value="${idx}">${p.name} (Z=${p.protons})</option>`
    ).join('');

    targetSelect.innerHTML = TARGETS.map((t, idx) => 
      `<option value="${idx}">${t.name} (Z=${t.protons})</option>`
    ).join('');

    function updateParticles() {
      const p = PROJECTILES[projSelect.value];
      const t = TARGETS[targetSelect.value];
      if (projParticle) {
        projParticle.innerText = p.symbol;
        projParticle.style.background = p.color;
      }
      if (targetParticle) {
        targetParticle.innerText = t.symbol;
        targetParticle.style.background = t.color;
      }
    }

    projSelect.addEventListener('change', updateParticles);
    targetSelect.addEventListener('change', updateParticles);
    updateParticles();

    // 발사 버튼 클릭 시 충돌 시뮬레이션
    fireBtn.addEventListener('click', () => {
      fireBtn.disabled = true;
      playSound('fire');

      // 충돌 애니메이션
      projParticle.style.transform = 'translateX(130px) scale(1.1)';
      targetParticle.style.transform = 'translateX(-130px) scale(1.1)';

      setTimeout(() => {
        playSound('bang');
        // 섬광 플래시
        const stage = document.querySelector('.collider-stage');
        stage.style.boxShadow = '0 0 50px #ffea00, inset 0 0 40px #ff3300';

        const p = PROJECTILES[projSelect.value];
        const t = TARGETS[targetSelect.value];
        const totalProtons = p.protons + t.protons;
        const totalMass = p.mass + t.mass - 3; // 충돌 시 중성자 3개 방출(증발) 가정

        setTimeout(() => {
          stage.style.boxShadow = 'none';
          projParticle.style.transform = 'none';
          targetParticle.style.transform = 'none';
          fireBtn.disabled = false;

          showCollisionResult(totalProtons, totalMass, p, t);
        }, 400);
      }, 500);
    });
  }

  function showCollisionResult(protons, mass, p, t) {
    const resultBox = document.getElementById('collision-result');
    if (!resultBox) return;

    resultBox.classList.add('active');

    // 생성된 원소 찾기
    const all = [...window.PERIODIC_DATA.standardElements, ...window.PERIODIC_DATA.futureElements];
    const createdEl = all.find(e => e.num === protons);

    let titleHtml = '';
    let descHtml = '';

    if (protons === 118) {
      titleHtml = `🎉 118번 오가네손(Og) 합성 성공!`;
      descHtml = `${p.symbol} + ${t.symbol} 충돌로 현재 주기율표의 끝판왕인 <b>118번 오가네손</b> 원자핵 1개가 합성되었습니다! (약 0.0007초 후 붕괴)`;
    } else if (protons === 119) {
      titleHtml = `🚀 대발견! 119번 우눈엔늄(Uue) 합성 성공!`;
      descHtml = `축하합니다! 인류 최초로 <b>8주기 첫 번째 원소(119번)</b>를 합성해 새로운 주기율표의 문을 열었습니다! 전 세계 물리학계가 발칵 뒤집혔습니다! 🏆`;
    } else if (protons === 120) {
      titleHtml = `🌟 대발견! 120번 우눈비늄(Ubn) 합성 성공!`;
      descHtml = `엄청납니다! <b>8주기 알칼리 토금속 120번 원소</b>를 합성했습니다! 과학자들은 이 원소가 '안정성의 섬'으로 가는 징검다리가 될 것이라 기대합니다!`;
    } else if (protons === 122) {
      titleHtml = `✨ 미지의 초악티늄족 122번 우눈비븀(Ubb) 합성!`;
      descHtml = `양성자 수 122개! 자연계에 한 번도 존재하지 않았던 초악티늄족 원소가 관측되었습니다!`;
    } else if (protons >= 126) {
      titleHtml = `🏝️ 기적! '안정성의 섬' 마법수(Z=126) 도달!`;
      descHtml = `경축! 양성자 마법수(Magic number) 126개에 도달했습니다! 이 원자핵은 순식간에 사라지지 않고 오랫동안 안정하게 살아남을 가능성이 매우 높습니다!`;
    } else if (createdEl) {
      titleHtml = `⚗️ ${protons}번 ${createdEl.nameKo}(${createdEl.symbol}) 합성 완료!`;
      descHtml = `${p.name}와 ${t.name}의 핵융합으로 ${protons}번 ${createdEl.nameKo} 원자핵이 관측되었습니다.`;
    } else {
      titleHtml = `🧪 새로운 초중원소 (Z=${protons}) 원자핵 순간 관측!`;
      descHtml = `양성자 수 ${protons}개의 거대 원자핵이 탄생했으나, 1마이크로초 만에 자발 핵분열로 쪼개졌습니다.`;
    }

    resultBox.innerHTML = `
      <div style="font-size:1.2rem; font-weight:900; color:var(--accent-gold); margin-bottom:8px;">${titleHtml}</div>
      <div style="font-size:0.95rem; line-height:1.5; color:var(--text-bright); margin-bottom:12px;">${descHtml}</div>
      <div style="font-size:0.82rem; color:var(--text-muted); background:rgba(0,0,0,0.3); padding:8px 12px; border-radius:8px;">
        💡 반응식: <b>${p.symbol}</b> (Z=${p.protons}) + <b>${t.symbol}</b> (Z=${t.protons}) → <b>Z=${protons}</b> 원자핵 + 3n (중성자 방출)
      </div>
    `;

    resultBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  // 8주기 미래 원소 카드 목록 렌더링
  function renderFutureCards() {
    const container = document.getElementById('future-elements-list');
    if (!container || !window.PERIODIC_DATA) return;

    container.innerHTML = '';
    const futureList = window.PERIODIC_DATA.futureElements;

    futureList.forEach(el => {
      const card = document.createElement('div');
      card.className = `element-card cat-${el.category}`;
      card.style.borderColor = 'rgba(241, 196, 15, 0.4)';

      card.innerHTML = `
        <div class="card-header">
          <div class="card-identity">
            <span class="card-num" style="color:var(--accent-gold)">#${el.num}</span>
            <span class="card-symbol" style="color:var(--accent-gold)">${el.symbol}</span>
            <div class="card-names">
              <div class="card-name-ko">${el.nameKo}</div>
              <div class="card-name-en">${el.nameEn}</div>
            </div>
          </div>
          <span class="card-category-badge" style="background:#d4ac0d">🚀 미래 가상 원소</span>
        </div>
        <div class="card-summary" style="font-weight:600">${el.summary}</div>
        <p style="font-size:0.85rem; color:var(--text-muted); margin-bottom:10px;">${el.funFact}</p>
        <div class="card-tags">
          <span class="card-tag">8주기 ${typeof el.group === 'number' ? el.group + '족' : el.group}</span>
          <span class="card-tag">예상 질량: ${el.weight}</span>
          <span class="card-tag" style="color:#2ed573">현재 연구 중</span>
        </div>
      `;

      card.addEventListener('click', () => {
        window.openElementModal(el.num);
      });

      container.appendChild(card);
    });
  }

  window.initFutureLab = function() {
    renderFutureCards();
    initCollider();
  };
})();
