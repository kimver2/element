// 주기율표 테이블 그리드 및 도감 카드 뷰 렌더링 모듈

(function() {
  const CATEGORY_NAMES = {
    'alkali-metal': '알칼리 금속',
    'alkaline-earth': '알칼리 토금속',
    'transition-metal': '전이 금속',
    'post-transition': '후전이 금속',
    'metalloid': '준금속',
    'nonmetal': '반응성 비금속',
    'halogen': '할로겐',
    'noble-gas': '비활성 기체',
    'lanthanide': '란타넘족',
    'actinide': '악티늄족',
    'unknown': '미지/초중원소',
    'hypothetical-alkali': '8주기 알칼리 금속(가상)',
    'hypothetical-alkaline-earth': '8주기 알칼리 토금속(가상)',
    'hypothetical-superactinide': '초악티늄족(가상)'
  };

  let currentCategoryFilter = 'all';
  let currentSearchQuery = '';

  // 그리드 좌표 계산 (col, row)
  function getGridPosition(el) {
    const num = el.num;

    // 란타넘족 (57~71) -> row 9, col 4~18
    if (num >= 57 && num <= 71) {
      return { row: 9, col: (num - 57) + 4 };
    }
    // 악티늄족 (89~103) -> row 10, col 4~18
    if (num >= 89 && num <= 103) {
      return { row: 10, col: (num - 89) + 4 };
    }

    // 1~7주기 본체
    const row = el.period;
    let col = el.group;

    return { row, col };
  }

  // 주기율표 그리드 렌더링
  function renderPeriodicGrid() {
    const gridContainer = document.getElementById('periodic-grid');
    if (!gridContainer || !window.PERIODIC_DATA) return;

    gridContainer.innerHTML = '';
    const elements = window.PERIODIC_DATA.standardElements;

    // 1. 1~118번 원소 타일 생성 및 배치
    elements.forEach(el => {
      const pos = getGridPosition(el);
      const tile = document.createElement('div');
      tile.className = `element-tile cat-${el.category}`;
      tile.style.gridRow = pos.row;
      tile.style.gridColumn = pos.col;
      tile.dataset.num = el.num;
      tile.dataset.category = el.category;
      tile.dataset.nameKo = el.nameKo;
      tile.dataset.nameEn = el.nameEn;
      tile.dataset.symbol = el.symbol;

      tile.innerHTML = `
        <div class="tile-top">
          <span class="tile-num">${el.num}</span>
          ${el.isRadioactive ? '<span class="tile-radio" title="방사성 원소">☢️</span>' : ''}
        </div>
        <div class="tile-symbol">${el.symbol}</div>
        <div class="tile-bottom">
          <div class="tile-name">${el.nameKo}</div>
          <div class="tile-mass">${el.weight}</div>
        </div>
      `;

      tile.addEventListener('click', () => {
        window.openElementModal(el.num);
      });

      gridContainer.appendChild(tile);
    });

    // 2. 란타넘족 / 악티늄족 자리 표시 타일 (row 6 col 3, row 7 col 3)
    const lanHolder = document.createElement('div');
    lanHolder.className = 'group-holder-cell';
    lanHolder.style.gridRow = 6;
    lanHolder.style.gridColumn = 3;
    lanHolder.innerHTML = `<span>57-71</span><span style="font-size:0.65rem">La - Lu</span>`;
    gridContainer.appendChild(lanHolder);

    const actHolder = document.createElement('div');
    actHolder.className = 'group-holder-cell';
    actHolder.style.gridRow = 7;
    actHolder.style.gridColumn = 3;
    actHolder.innerHTML = `<span>89-103</span><span style="font-size:0.65rem">Ac - Lr</span>`;
    gridContainer.appendChild(actHolder);

    // 3. 란타넘/악티늄족 라벨 (row 9 col 1~3, row 10 col 1~3)
    const lanLabel = document.createElement('div');
    lanLabel.className = 'group-holder-cell';
    lanLabel.style.gridRow = 9;
    lanLabel.style.gridColumn = '1 / span 3';
    lanLabel.style.justifyContent = 'center';
    lanLabel.style.background = 'rgba(255, 107, 129, 0.1)';
    lanLabel.style.borderColor = 'var(--cat-lanthanide)';
    lanLabel.style.color = 'var(--cat-lanthanide)';
    lanLabel.innerText = '★ 란타넘족 (희토류)';
    gridContainer.appendChild(lanLabel);

    const actLabel = document.createElement('div');
    actLabel.className = 'group-holder-cell';
    actLabel.style.gridRow = 10;
    actLabel.style.gridColumn = '1 / span 3';
    actLabel.style.justifyContent = 'center';
    actLabel.style.background = 'rgba(232, 67, 147, 0.1)';
    actLabel.style.borderColor = 'var(--cat-actinide)';
    actLabel.style.color = 'var(--cat-actinide)';
    actLabel.innerText = '☢ 악티늄족 (방사성)';
    gridContainer.appendChild(actLabel);
  }

  // 도감 카드 뷰 렌더링
  function renderCardsGrid() {
    const cardsContainer = document.getElementById('cards-grid');
    if (!cardsContainer || !window.PERIODIC_DATA) return;

    cardsContainer.innerHTML = '';
    const allList = [...window.PERIODIC_DATA.standardElements, ...window.PERIODIC_DATA.futureElements];

    allList.forEach(el => {
      const card = document.createElement('div');
      card.className = `element-card cat-${el.category}`;
      card.dataset.num = el.num;
      card.dataset.category = el.category;
      card.dataset.nameKo = el.nameKo;
      card.dataset.nameEn = el.nameEn;
      card.dataset.symbol = el.symbol;

      const catName = CATEGORY_NAMES[el.category] || el.category;
      const isFuture = el.num > 118;

      card.innerHTML = `
        <div class="card-header">
          <div class="card-identity">
            <span class="card-num">#${el.num}</span>
            <span class="card-symbol">${el.symbol}</span>
            <div class="card-names">
              <div class="card-name-ko">${el.nameKo}</div>
              <div class="card-name-en">${el.nameEn}</div>
            </div>
          </div>
          <span class="card-category-badge" style="background: var(--tile-color)">${catName}</span>
        </div>
        <div class="card-summary">${el.summary}</div>
        <div class="card-tags">
          <span class="card-tag">${el.period}주기 ${typeof el.group === 'number' ? el.group + '족' : el.group}</span>
          <span class="card-tag">질량: ${el.weight}</span>
          ${el.isRadioactive ? '<span class="card-tag" style="color:#ff6b81">☢️ 방사성</span>' : ''}
          ${isFuture ? '<span class="card-tag" style="color:var(--accent-gold)">🚀 미래 예측 원소</span>' : ''}
        </div>
      `;

      card.addEventListener('click', () => {
        window.openElementModal(el.num);
      });

      cardsContainer.appendChild(card);
    });
  }

  // 필터 및 검색 적용
  function applyFilters() {
    const query = currentSearchQuery.trim().toLowerCase();
    const filterCat = currentCategoryFilter;

    // 테이블 뷰 타일 필터링
    const tiles = document.querySelectorAll('.element-tile');
    tiles.forEach(tile => {
      const num = tile.dataset.num;
      const cat = tile.dataset.category;
      const nameKo = tile.dataset.nameKo.toLowerCase();
      const nameEn = tile.dataset.nameEn.toLowerCase();
      const symbol = tile.dataset.symbol.toLowerCase();

      const matchCat = (filterCat === 'all' || cat === filterCat);
      const matchQuery = !query || (
        num === query ||
        symbol.includes(query) ||
        nameKo.includes(query) ||
        nameEn.includes(query)
      );

      if (matchCat && matchQuery) {
        tile.classList.remove('dimmed');
        if (query) {
          tile.classList.add('highlighted');
        } else {
          tile.classList.remove('highlighted');
        }
      } else {
        tile.classList.add('dimmed');
        tile.classList.remove('highlighted');
      }
    });

    // 카드 뷰 필터링
    const cards = document.querySelectorAll('.element-card');
    cards.forEach(card => {
      const num = card.dataset.num;
      const cat = card.dataset.category;
      const nameKo = card.dataset.nameKo.toLowerCase();
      const nameEn = card.dataset.nameEn.toLowerCase();
      const symbol = card.dataset.symbol.toLowerCase();

      const matchCat = (filterCat === 'all' || cat === filterCat);
      const matchQuery = !query || (
        num === query ||
        symbol.includes(query) ||
        nameKo.includes(query) ||
        nameEn.includes(query)
      );

      if (matchCat && matchQuery) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });
  }

  // 이벤트 리스너 등록
  function initEvents() {
    // 검색창
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        currentSearchQuery = e.target.value;
        applyFilters();
      });
    }

    // 카테고리 칩
    const chips = document.querySelectorAll('.chip-btn');
    chips.forEach(chip => {
      chip.addEventListener('click', () => {
        chips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        currentCategoryFilter = chip.dataset.cat;
        applyFilters();
      });
    });
  }

  // 초기화 노출
  window.initPeriodicTable = function() {
    renderPeriodicGrid();
    renderCardsGrid();
    initEvents();
  };

  window.CATEGORY_NAMES = CATEGORY_NAMES;
})();
