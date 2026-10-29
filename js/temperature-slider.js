// 🌡️ 주기율표 온도 조절기 (Temperature Slider)

(function() {
  let currentTemp = 25; // 기본 상온 25℃

  function updateElementStatesByTemp(temp) {
    currentTemp = temp;
    const std = window.PERIODIC_DATA.standardElements;
    const tiles = document.querySelectorAll('.element-tile');

    // 디스플레이 레이블 업데이트
    const tempDisplay = document.getElementById('temp-display-val');
    if (tempDisplay) {
      tempDisplay.innerText = `${temp > 0 ? '+' : ''}${temp} ℃`;
    }

    tiles.forEach(tile => {
      const num = parseInt(tile.dataset.num);
      const el = std.find(e => e.num === num);
      if (!el || el.meltingPoint === undefined) return;

      const mp = el.meltingPoint;
      const bp = el.boilingPoint;

      let state = 'solid';
      let stateIcon = '🪨';
      let stateClass = 'state-solid';

      if (temp < mp) {
        state = 'solid';
        stateIcon = '🪨';
        stateClass = 'state-solid';
      } else if (temp >= mp && temp < bp) {
        state = 'liquid';
        stateIcon = '💧';
        stateClass = 'state-liquid';
      } else {
        state = 'gas';
        stateIcon = '💨';
        stateClass = 'state-gas';
      }

      // 타일에 상태 클래스 적용
      tile.classList.remove('state-solid', 'state-liquid', 'state-gas');
      tile.classList.add(stateClass);

      // 타일 내 상태 아이콘 업데이트 (없으면 생성)
      let iconSpan = tile.querySelector('.temp-state-icon');
      if (!iconSpan) {
        iconSpan = document.createElement('span');
        iconSpan.className = 'temp-state-icon';
        const topRow = tile.querySelector('.tile-top');
        if (topRow) topRow.appendChild(iconSpan);
      }
      iconSpan.innerText = stateIcon;
      iconSpan.title = `상태: ${state === 'solid' ? '고체' : state === 'liquid' ? '액체' : '기체'} (녹는점: ${mp}℃, 끓는점: ${bp}℃)`;
    });
  }

  window.initTempSlider = function() {
    const slider = document.getElementById('temp-slider-input');
    const presets = document.querySelectorAll('.temp-preset-btn');

    if (slider) {
      slider.addEventListener('input', (e) => {
        const val = parseInt(e.target.value);
        updateElementStatesByTemp(val);
      });
    }

    presets.forEach(btn => {
      btn.addEventListener('click', () => {
        const temp = parseInt(btn.dataset.temp);
        if (slider) slider.value = temp;
        updateElementStatesByTemp(temp);

        presets.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });

    // 기본 25℃ 적용
    updateElementStatesByTemp(25);
  };
})();
