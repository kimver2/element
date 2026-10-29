// 🧪 원소 연금술 결합 실험실 (Molecule Crafting Lab)

(function() {
  const RECIPES = [
    {
      id: 'water',
      name: '물 (Water)',
      formula: 'H₂O',
      ingredients: [1, 1, 8], // H, H, O
      desc: '생명체가 살아가는 데 가장 소중한 기적의 액체!',
      icon: '💧',
      color: '#00d2ff'
    },
    {
      id: 'salt',
      name: '식탁 소금 (염화나트륨)',
      formula: 'NaCl',
      ingredients: [11, 17], // Na, Cl
      desc: '물과 만나면 터지는 나트륨과 독가스 염소가 만나 맛있는 소금이 되었어요!',
      icon: '🧂',
      color: '#ffffff'
    },
    {
      id: 'co2',
      name: '이산화탄소 (탄산가스)',
      formula: 'CO₂',
      ingredients: [6, 8, 8], // C, O, O
      desc: '우리가 숨을 내쉴 때 나오고, 톡 쏘는 탄산음료에 꽉 차 있는 기체!',
      icon: '💨',
      color: '#747d8c'
    },
    {
      id: 'rust',
      name: '녹슨 쇠 (산화철)',
      formula: 'Fe₂O₃',
      ingredients: [26, 8], // Fe, O
      desc: '비와 공기 속 산소를 만난 튼튼한 철이 붉은 가루로 부스러진 모습!',
      icon: '🟫',
      color: '#b71540'
    },
    {
      id: 'sand',
      name: '모래 & 유리 (이산화규소)',
      formula: 'SiO₂',
      ingredients: [14, 8, 8], // Si, O, O
      desc: '해수욕장 백사장 모래이자 투명한 유리창, 스마트폰 액정의 주인공!',
      icon: '🏖️',
      color: '#f8c291'
    },
    {
      id: 'limestone',
      name: '조개껍데기 / 분필 (탄산칼슘)',
      formula: 'CaCO₃',
      ingredients: [20, 6, 8], // Ca, C, O
      desc: '바다 조개들의 단단한 집이자 공룡 화석, 학교 칠판 분필의 주성분!',
      icon: '🐚',
      color: '#e056fd'
    },
    {
      id: 'hcl',
      name: '위액 속 염산 (HCl)',
      formula: 'HCl',
      ingredients: [1, 17], // H, Cl
      desc: '우리 뱃속 위장에서 음식물을 빠르게 녹여 소화시키는 강력한 산성 액체!',
      icon: '🧪',
      color: '#2ed573'
    },
    {
      id: 'battery',
      name: '스마트폰 2차전지 (코발트산리튬)',
      formula: 'LiCoO₂',
      ingredients: [3, 27, 8], // Li, Co, O
      desc: '스마트폰과 전기차를 하루 종일 움직이게 하는 현대 첨단 배터리의 심장!',
      icon: '📱',
      color: '#ffa502'
    },
    {
      id: 'ammonia',
      name: '암모니아 (비료)',
      formula: 'NH₃',
      ingredients: [7, 1], // N, H
      desc: '공기 중 질소를 붙잡아 식물들을 무럭무럭 자라게 한 인류를 구한 기적의 분자!',
      icon: '🌾',
      color: '#38ada9'
    },
    {
      id: 'hydrogen_peroxide',
      name: '과산화수소 (소독약)',
      formula: 'H₂O₂',
      ingredients: [1, 8], // H, O
      desc: '상처에 톡톡 바르면 하얀 거품을 부글부글 내뿜으며 세균을 물리치는 소독약!',
      icon: '🩹',
      color: '#ff6b81'
    },
    {
      id: 'diamond',
      name: '순수 다이아몬드 (Diamond)',
      formula: 'C',
      ingredients: [6, 6, 6], // C, C, C
      desc: '지하 깊은 곳의 엄청난 압력과 열을 견뎌낸 지구상에서 가장 단단한 결정!',
      icon: '💎',
      color: '#00d2ff'
    },
    {
      id: 'gunpowder',
      name: '불꽃놀이 화약 (초석)',
      formula: 'KNO₃',
      ingredients: [19, 7, 8], // K, N, O
      desc: '하늘 높이 날아올라 쾅! 눈부신 불꽃을 터뜨리는 전통 화약의 핵심 성분!',
      icon: '🎆',
      color: '#ff4757'
    }
  ];

  let selectedBeaker = [];
  let discoveredMolecules = JSON.parse(localStorage.getItem('discoveredMolecules') || '[]');

  // 사운드 재생
  function playBeakerSound(type) {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'drop') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(400, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.15);
        osc.start();
        osc.stop(ctx.currentTime + 0.15);
      } else if (type === 'success') {
        // 성공 화음 (도-미-솔-도)
        [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
          const o = ctx.createOscillator();
          const g = ctx.createGain();
          o.connect(g);
          g.connect(ctx.destination);
          o.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.08);
          g.gain.setValueAtTime(0.15, ctx.currentTime + i * 0.08);
          g.gain.linearRampToValueAtTime(0.01, ctx.currentTime + i * 0.08 + 0.3);
          o.start(ctx.currentTime + i * 0.08);
          o.stop(ctx.currentTime + i * 0.08 + 0.35);
        });
      } else if (type === 'fail') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(80, ctx.currentTime + 0.3);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.3);
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
      }
    } catch(e) {}
  }

  function updateBeakerUI() {
    const slotsContainer = document.getElementById('beaker-slots');
    if (!slotsContainer) return;

    slotsContainer.innerHTML = '';
    const all = window.PERIODIC_DATA.standardElements;

    for (let i = 0; i < 3; i++) {
      const slot = document.createElement('div');
      slot.className = 'beaker-slot';
      if (selectedBeaker[i]) {
        const el = all.find(e => e.num === selectedBeaker[i]);
        slot.innerHTML = `
          <div class="slot-elem cat-${el.category}">
            <span class="slot-sym">${el.symbol}</span>
            <span class="slot-name">${el.nameKo}</span>
            <span class="slot-remove">✕</span>
          </div>
        `;
        slot.addEventListener('click', () => {
          selectedBeaker.splice(i, 1);
          updateBeakerUI();
        });
      } else {
        slot.innerHTML = `<span class="slot-empty">원소 선택 (${i + 1})</span>`;
      }
      slotsContainer.appendChild(slot);
    }

    const craftBtn = document.getElementById('craft-btn');
    if (craftBtn) {
      craftBtn.disabled = (selectedBeaker.length < 1);
    }
  }

  // 비커에 원소 추가
  window.addToBeaker = function(num) {
    if (selectedBeaker.length >= 3) {
      alert('비커에는 최대 3개의 원소까지 넣을 수 있어요!');
      return;
    }
    selectedBeaker.push(num);
    playBeakerSound('drop');
    updateBeakerUI();
  };

  // 합성 시도
  function tryCrafting() {
    if (selectedBeaker.length === 0) return;

    const craftBtn = document.getElementById('craft-btn');
    const resultBox = document.getElementById('craft-result-box');
    craftBtn.disabled = true;

    // 비커 부글부글 애니메이션
    const beakerGraphic = document.getElementById('beaker-graphic');
    if (beakerGraphic) {
      beakerGraphic.classList.add('reacting');
    }

    setTimeout(() => {
      if (beakerGraphic) beakerGraphic.classList.remove('reacting');
      craftBtn.disabled = false;

      // 일치하는 레시피 찾기 (원소 집합 비교)
      const sortedInputs = [...selectedBeaker].sort((a,b) => a - b);
      const matched = RECIPES.find(r => {
        const sortedRecipe = [...r.ingredients].sort((a,b) => a - b);
        if (sortedRecipe.length !== sortedInputs.length) return false;
        return sortedRecipe.every((val, idx) => val === sortedInputs[idx]);
      });

      if (matched) {
        playBeakerSound('success');
        if (!discoveredMolecules.includes(matched.id)) {
          discoveredMolecules.push(matched.id);
          localStorage.setItem('discoveredMolecules', JSON.stringify(discoveredMolecules));
          if (window.checkAchievements) window.checkAchievements();
        }

        resultBox.className = 'craft-result-card success';
        resultBox.innerHTML = `
          <div class="cr-icon">${matched.icon}</div>
          <div class="cr-content">
            <div class="cr-title">✨ 대성공! [${matched.name}] 합성 완료!</div>
            <div class="cr-formula" style="color:${matched.color}">${matched.formula}</div>
            <div class="cr-desc">${matched.desc}</div>
          </div>
        `;
        renderDiscoveredList();
      } else {
        playBeakerSound('fail');
        resultBox.className = 'craft-result-card fail';
        resultBox.innerHTML = `
          <div class="cr-icon">💨</div>
          <div class="cr-content">
            <div class="cr-title">💥 반응 실패! (안정하게 결합하지 못함)</div>
            <div class="cr-desc">선택한 원소들은 이 조건에서 쉽게 결합하지 않고 기체로 날아가 버렸어요! 다른 조합을 시도해보세요.</div>
          </div>
        `;
      }

      selectedBeaker = [];
      updateBeakerUI();
    }, 600);
  }

  // 발견된 화합물 컬렉션 렌더링
  function renderDiscoveredList() {
    const listContainer = document.getElementById('molecule-collection-grid');
    const countBadge = document.getElementById('discovered-mol-count');
    if (!listContainer) return;

    listContainer.innerHTML = '';
    if (countBadge) {
      countBadge.innerText = `${discoveredMolecules.length} / ${RECIPES.length}개 발견`;
    }

    RECIPES.forEach(r => {
      const isFound = discoveredMolecules.includes(r.id);
      const card = document.createElement('div');
      card.className = `molecule-badge-card ${isFound ? 'found' : 'locked'}`;

      if (isFound) {
        card.innerHTML = `
          <div class="m-icon">${r.icon}</div>
          <div class="m-info">
            <div class="m-name">${r.name}</div>
            <div class="m-formula" style="color:${r.color}">${r.formula}</div>
          </div>
        `;
      } else {
        card.innerHTML = `
          <div class="m-icon">❓</div>
          <div class="m-info">
            <div class="m-name">미지의 화합물</div>
            <div class="m-formula">레시피를 찾아보세요!</div>
          </div>
        `;
      }
      listContainer.appendChild(card);
    });
  }

  // 원소 선택 팔레트 렌더링
  function renderPalette() {
    const palette = document.getElementById('molecule-palette');
    if (!palette || !window.PERIODIC_DATA) return;

    palette.innerHTML = '';
    // 결합에 자주 쓰이는 주요 원소들 (H, C, N, O, Na, Mg, Al, Si, P, S, Cl, K, Ca, Fe, Co, Cu, Zn, Li 등)
    const keyNums = [1, 3, 6, 7, 8, 11, 12, 13, 14, 15, 16, 17, 19, 20, 26, 27, 29];
    const std = window.PERIODIC_DATA.standardElements;

    keyNums.forEach(num => {
      const el = std.find(e => e.num === num);
      if (!el) return;
      const btn = document.createElement('button');
      btn.className = `palette-elem-btn cat-${el.category}`;
      btn.innerHTML = `<span class="p-sym">${el.symbol}</span><span class="p-name">${el.nameKo}</span>`;
      btn.addEventListener('click', () => window.addToBeaker(el.num));
      palette.appendChild(btn);
    });
  }

  window.initMoleculeLab = function() {
    updateBeakerUI();
    renderPalette();
    renderDiscoveredList();

    const craftBtn = document.getElementById('craft-btn');
    if (craftBtn) {
      craftBtn.addEventListener('click', tryCrafting);
    }
    const clearBtn = document.getElementById('clear-beaker-btn');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        selectedBeaker = [];
        updateBeakerUI();
      });
    }
  };
})();
