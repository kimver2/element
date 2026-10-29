// 🏆 탐험가 업적 배지 & 도감 진척도 시스템

(function() {
  const ACHIEVEMENTS = [
    {
      id: 'first_step',
      title: '🌟 첫 걸음',
      desc: '첫 번째 원소 도감을 열어보았습니다.',
      check: (data) => data.explored.length >= 1
    },
    {
      id: 'alkali_master',
      title: '💥 폭발의 달인',
      desc: '1족 알칼리 금속(리튬, 나트륨, 칼륨 등) 6총사를 모두 탐험했습니다!',
      check: (data) => [3, 11, 19, 37, 55, 87].every(n => data.explored.includes(n))
    },
    {
      id: 'noble_party',
      title: '🎈 풍선 파티',
      desc: '18족 비활성 기체 7총사를 모두 탐험했습니다!',
      check: (data) => [2, 10, 18, 36, 54, 86, 118].every(n => data.explored.includes(n))
    },
    {
      id: 'radiation_master',
      title: '☢️ 방사능 연구원',
      desc: '방사성 원소 10개 이상을 탐험했습니다.',
      check: (data, std) => {
        const rads = std.filter(e => e.isRadioactive).map(e => e.num);
        return data.explored.filter(n => rads.includes(n)).length >= 10;
      }
    },
    {
      id: 'precious_metals',
      title: '👑 귀금속 수집가',
      desc: '금(79), 은(47), 백금(78), 구리(29)를 모두 탐험했습니다!',
      check: (data) => [79, 47, 78, 29].every(n => data.explored.includes(n))
    },
    {
      id: 'alchemist',
      title: '🧪 전설의 연금술사',
      desc: '분자 실험실에서 화합물 5종 이상을 합성했습니다!',
      check: (data) => data.molecules.length >= 5
    },
    {
      id: 'future_pioneer',
      title: '🚀 8주기 개척자',
      desc: '8주기 미래 가상 원소 도감을 탐험했습니다!',
      check: (data) => [119, 120, 126].some(n => data.explored.includes(n))
    }
  ];

  function getExplored() {
    return JSON.parse(localStorage.getItem('exploredElements') || '[]');
  }

  function getMolecules() {
    return JSON.parse(localStorage.getItem('discoveredMolecules') || '[]');
  }

  function getUnlockedAchievements() {
    return JSON.parse(localStorage.getItem('unlockedAchievements') || '[]');
  }

  // 토스트 알림
  function showAchievementToast(ach) {
    const toast = document.createElement('div');
    toast.className = 'achievement-toast';
    toast.innerHTML = `
      <div class="at-icon">🏆</div>
      <div class="at-body">
        <div class="at-title">업적 달성! ${ach.title}</div>
        <div class="at-desc">${ach.desc}</div>
      </div>
    `;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.classList.add('show');
    }, 50);
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 400);
    }, 4000);
  }

  // 업적 및 진척도 갱신
  window.checkAchievements = function() {
    const explored = getExplored();
    const molecules = getMolecules();
    const unlocked = getUnlockedAchievements();
    const std = window.PERIODIC_DATA.standardElements;

    // 상단 프로그레스 바 갱신
    const progressBar = document.getElementById('explorer-progress-fill');
    const progressLabel = document.getElementById('explorer-progress-label');
    const stdCount = std.length;
    const currentCount = explored.filter(n => n <= 118).length;
    const percent = Math.round((currentCount / stdCount) * 100);

    if (progressBar) progressBar.style.width = `${percent}%`;
    if (progressLabel) progressLabel.innerText = `도감 완성률: ${currentCount} / ${stdCount} (${percent}%)`;

    // 업적 검사
    const dataState = { explored, molecules };
    ACHIEVEMENTS.forEach(ach => {
      if (!unlocked.includes(ach.id) && ach.check(dataState, std)) {
        unlocked.push(ach.id);
        localStorage.setItem('unlockedAchievements', JSON.stringify(unlocked));
        showAchievementToast(ach);
      }
    });

    renderAchievementsList();
  };

  // 원소 탐험 등록
  window.markElementExplored = function(num) {
    const explored = getExplored();
    if (!explored.includes(num)) {
      explored.push(num);
      localStorage.setItem('exploredElements', JSON.stringify(explored));
      window.checkAchievements();
    }
  };

  function renderAchievementsList() {
    const listContainer = document.getElementById('achievements-list-grid');
    if (!listContainer) return;

    const unlocked = getUnlockedAchievements();
    listContainer.innerHTML = '';

    ACHIEVEMENTS.forEach(ach => {
      const isDone = unlocked.includes(ach.id);
      const card = document.createElement('div');
      card.className = `achievement-item ${isDone ? 'unlocked' : 'locked'}`;
      card.innerHTML = `
        <div class="ach-icon">${isDone ? '🏆' : '🔒'}</div>
        <div class="ach-info">
          <div class="ach-name">${ach.title}</div>
          <div class="ach-desc">${ach.desc}</div>
        </div>
      `;
      listContainer.appendChild(card);
    });
  }

  window.initAchievements = function() {
    window.checkAchievements();
    renderAchievementsList();
  };
})();
