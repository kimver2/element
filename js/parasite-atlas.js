// 기생충·선충 분류 도감 보드 + 크기 스케일 필터 + 카드 도감

(function() {
  let currentCategory = 'all';
  let currentSearch = '';
  let currentScaleRange = 'all'; // all | micro | small | medium | large

  function matchesScale(p, range) {
    if (range === 'all') return true;
    if (range === 'micro') return p.sizeMicrons < 100; // < 100 µm (원충)
    if (range === 'small') return p.sizeMicrons >= 100 && p.sizeMicrons <= 5000; // 0.1 ~ 5 mm
    if (range === 'medium') return p.sizeMicrons > 5000 && p.sizeMicrons <= 100000; // 5 mm ~ 10 cm
    if (range === 'large') return p.sizeMicrons > 100000; // > 10 cm (회충, 조충)
    return true;
  }

  function getFilteredParasites() {
    const q = currentSearch.trim().toLowerCase();
    return PARASITES_DATA.filter(p => {
      const catMatch = currentCategory === 'all' || p.category === currentCategory;
      const scaleMatch = matchesScale(p, currentScaleRange);
      const searchMatch = !q ||
        p.name.toLowerCase().includes(q) ||
        p.english.toLowerCase().includes(q) ||
        p.scientific.toLowerCase().includes(q) ||
        p.code.toLowerCase().includes(q) ||
        p.host.toLowerCase().includes(q) ||
        p.transmission.toLowerCase().includes(q);
      return catMatch && scaleMatch && searchMatch;
    });
  }

  function renderAtlas() {
    const container = document.getElementById('parasite-atlas-groups');
    if (!container) return;

    const explored = window.ParasiteAchievements ? window.ParasiteAchievements.getExplored() : [];
    const filteredIds = new Set(getFilteredParasites().map(p => p.id));

    let html = '';
    Object.entries(PARASITE_CATEGORIES).forEach(([catKey, catInfo]) => {
      const items = PARASITES_DATA.filter(p => p.category === catKey);
      if (items.length === 0) return;

      html += `
        <div class="atlas-group-block" data-cat="${catKey}">
          <div class="atlas-group-header" style="border-left: 4px solid ${catInfo.color};">
            <div>
              <h3 class="atlas-group-title">${catInfo.name} <span class="group-count">${items.length}종</span></h3>
              <p class="atlas-group-desc">${catInfo.desc}</p>
            </div>
          </div>
          <div class="atlas-tiles-grid">
      `;

      items.forEach(p => {
        const isMatched = filteredIds.has(p.id);
        const isExplored = explored.includes(p.id);
        const nonParasiteBadge = p.isParasite === false ? '<span class="non-parasite-tag">비기생 모델</span>' : '';
        html += `
          <button class="parasite-tile ${isMatched ? '' : 'dimmed'} ${isExplored ? 'explored' : ''}"
                  data-id="${p.id}"
                  style="--tile-accent:${catInfo.color};">
            <div class="tile-top">
              <span class="tile-num">#${String(p.id).padStart(2, '0')}</span>
              <span class="tile-code">${p.code}</span>
            </div>
            <div class="tile-svg-wrap">${window.getParasiteSVG(p, 52)}</div>
            <div class="tile-name">${p.name}</div>
            <div class="tile-size">${p.sizeLabel}</div>
            ${nonParasiteBadge}
            ${isExplored ? '<span class="tile-check" title="탐험 완료">✓</span>' : ''}
          </button>
        `;
      });

      html += `</div></div>`;
    });

    container.innerHTML = html;

    container.querySelectorAll('.parasite-tile').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = parseInt(btn.dataset.id, 10);
        if (window.openParasiteModal) window.openParasiteModal(id);
      });
    });
  }

  function renderCards() {
    const grid = document.getElementById('parasite-cards-grid');
    if (!grid) return;

    const list = getFilteredParasites();
    if (list.length === 0) {
      grid.innerHTML = `<div class="empty-state-box">🔍 검색 조건에 맞는 기생충·선충이 없습니다.</div>`;
      return;
    }

    const explored = window.ParasiteAchievements ? window.ParasiteAchievements.getExplored() : [];

    grid.innerHTML = list.map(p => {
      const cat = PARASITE_CATEGORIES[p.category];
      const isExplored = explored.includes(p.id);
      return `
        <article class="p-card ${isExplored ? 'explored' : ''}" data-id="${p.id}" style="--card-accent:${cat.color};">
          <div class="p-card-head">
            <span class="p-card-num">#${String(p.id).padStart(2, '0')} · ${p.code}</span>
            <span class="p-card-cat" style="background:${cat.color}22;color:${cat.color};border:1px solid ${cat.color}55;">
              ${p.isParasite === false ? '비기생 모델 생물' : p.categoryName}
            </span>
          </div>
          <div class="p-card-visual">
            ${window.getParasiteSVG(p, 84)}
          </div>
          <h3 class="p-card-title">${p.name}</h3>
          <p class="p-card-sci">${p.scientific}</p>
          <div class="p-card-meta">
            <div><span>📏 크기</span><strong>${p.sizeLabel}</strong></div>
            <div><span>🏠 숙주</span><strong>${p.host}</strong></div>
          </div>
          <p class="p-card-fact">${p.funFact}</p>
        </article>
      `;
    }).join('');

    grid.querySelectorAll('.p-card').forEach(card => {
      card.addEventListener('click', () => {
        const id = parseInt(card.dataset.id, 10);
        if (window.openParasiteModal) window.openParasiteModal(id);
      });
    });
  }

  function initControls() {
    const searchInput = document.getElementById('p-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        currentSearch = e.target.value;
        renderAtlas();
        renderCards();
      });
    }

    document.querySelectorAll('.p-chip-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.p-chip-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentCategory = btn.dataset.cat;
        renderAtlas();
        renderCards();
      });
    });

    document.querySelectorAll('.scale-preset-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.scale-preset-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentScaleRange = btn.dataset.scale;
        renderAtlas();
        renderCards();
      });
    });
  }

  window.ParasiteAtlas = {
    init: () => {
      initControls();
      renderAtlas();
      renderCards();
    },
    refresh: () => {
      renderAtlas();
      renderCards();
    }
  };
})();
