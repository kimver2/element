// 🎯 원소 마스터 퀴즈 게임 모듈 (정답 철저 마스킹 & 고품질 보기 시스템)

(function() {
  let score = 0;
  let combo = 0;
  let currentQuestion = null;
  let isAnswered = false;

  function playQuizSound(isCorrect) {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);

      if (isCorrect) {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, audioCtx.currentTime); // C5
        osc.frequency.setValueAtTime(659.25, audioCtx.currentTime + 0.1); // E5
        gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, audioCtx.currentTime + 0.35);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.35);
      } else {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(200, audioCtx.currentTime);
        osc.frequency.linearRampToValueAtTime(120, audioCtx.currentTime + 0.25);
        gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.3);
      }
    } catch(e) {}
  }

  function getLevelTitle(s) {
    if (s >= 150) return '🏆 노벨 화학상 후보!';
    if (s >= 100) return '👑 주기율표 대마스터';
    if (s >= 60) return '⚡ 화학 박사';
    if (s >= 30) return '🔭 원소 탐험대장';
    if (s >= 10) return '🌱 원소 새싹이';
    return '🐣 초보 관찰자';
  }

  function updateScoreBadge() {
    const badge = document.getElementById('quiz-score-badge');
    if (badge) {
      badge.innerText = `점수: ${score}점 (연속 ${combo}콤보) | ${getLevelTitle(score)}`;
    }
  }

  // 지문 내 정답 원소 이름, 기호, 별칭을 [ ??? ]로 완벽 마스킹하는 함수
  function maskTargetWords(text, target) {
    if (!text) return '';
    let result = text;

    const words = [
      target.nameKo,
      target.nameEn,
      target.symbol
    ];

    // 한국어 옛 명칭 및 파생 단어 매핑
    if (target.nameKo === '플루오린') words.push('불소');
    if (target.nameKo === '아이오딘') words.push('요오드');
    if (target.nameKo === '나트륨') words.push('소듐');
    if (target.nameKo === '칼륨') words.push('포타슘');
    if (target.nameKo === '규소') words.push('실리콘');
    if (target.nameKo === '저마늄') words.push('게르마늄');
    if (target.nameKo === '타이타늄') words.push('티타늄');
    if (target.nameKo === '텅스텐') words.push('볼프람');
    if (target.nameKo === '철') words.push('철근', '철분', '강철');

    // 긴 단어부터 먼저 치환되도록 내림차순 정렬
    words.sort((a, b) => b.length - a.length);

    // 마스킹 수행
    words.forEach(word => {
      if (!word || word.length === 0) return;
      // 특수문자 이스케이프
      const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(escaped, 'gi');
      result = result.replace(regex, '<b style="color:var(--accent-gold); text-decoration:underline;">[ ??? ]</b>');
    });

    return result;
  }

  // 비슷한 기호나 같은 계열에서 헷갈리는 매력적인 오답 고르기
  function getSmartDistractors(target, allList, stdList) {
    let pool = [];

    // 1. 기호 첫 글자가 같은 원소들 (예: N -> Na, Ne, Ni, Nb)
    const firstLetter = target.symbol.charAt(0);
    const sameLetter = stdList.filter(e => e.num !== target.num && e.symbol.charAt(0) === firstLetter);
    if (sameLetter.length >= 2) {
      pool.push(...sameLetter);
    }

    // 2. 같은 카테고리 원소들
    const sameCat = stdList.filter(e => e.num !== target.num && e.category === target.category);
    pool.push(...sameCat);

    // 3. 같은 주기 원소들
    const samePeriod = stdList.filter(e => e.num !== target.num && e.period === target.period);
    pool.push(...samePeriod);

    // 중복 제거 및 섞기
    const uniquePool = Array.from(new Set(pool)).filter(e => e.num !== target.num);
    const shuffled = uniquePool.sort(() => 0.5 - Math.random());

    let picked = shuffled.slice(0, 3);
    // 부족하면 전체 목록에서 무작위 보충
    if (picked.length < 3) {
      const rest = stdList.filter(e => e.num !== target.num && !picked.some(p => p.num === e.num));
      const more = rest.sort(() => 0.5 - Math.random()).slice(0, 3 - picked.length);
      picked = [...picked, ...more];
    }

    return picked;
  }

  // 문제 생성기
  function generateQuestion() {
    if (!window.PERIODIC_DATA) return null;
    const all = [...window.PERIODIC_DATA.standardElements, ...window.PERIODIC_DATA.futureElements];
    const std = window.PERIODIC_DATA.standardElements;
    const future = window.PERIODIC_DATA.futureElements;

    // 문제 유형 선택 (0: 기호->이름, 1: 이름->기호, 2: 원자번호, 3: 쓰임새, 4: 과학상식, 5: 8주기 미래원소)
    const typeChoices = [0, 1, 2, 3, 4];
    // 20% 확률로 8주기 미래 원소 문제 출제!
    if (Math.random() < 0.25) {
      typeChoices.push(5);
    }
    const type = typeChoices[Math.floor(Math.random() * typeChoices.length)];

    if (type === 0) {
      // [유형 1] 기호 보고 한글 이름 맞추기
      const target = all[Math.floor(Math.random() * all.length)];
      const wrongs = getSmartDistractors(target, all, std);
      const options = [target, ...wrongs].sort(() => 0.5 - Math.random());

      return {
        tag: '🔤 기호 ➔ 이름',
        question: `원소 기호 <b style="color:var(--accent-cyan); font-size:1.8rem; letter-spacing:1px;">${target.symbol}</b>의 한글 이름은 무엇일까요?`,
        correctIndex: options.indexOf(target),
        // 번호 힌트 없이 깔끔하게 이름만 출력!
        options: options.map(o => o.nameKo),
        explanation: `정답은 <b>${target.nameKo}</b> (${target.symbol}, ${target.num}번)입니다!<br>${target.summary}`
      };

    } else if (type === 1) {
      // [유형 2] 이름 보고 기호 맞추기
      const target = all[Math.floor(Math.random() * all.length)];
      const wrongs = getSmartDistractors(target, all, std);
      const options = [target, ...wrongs].sort(() => 0.5 - Math.random());

      return {
        tag: '⚛️ 이름 ➔ 기호',
        question: `<b style="color:var(--accent-gold); font-size:1.6rem;">${target.nameKo}</b>의 원소 기호는 무엇일까요?`,
        correctIndex: options.indexOf(target),
        options: options.map(o => o.symbol),
        explanation: `<b>${target.nameKo}</b>의 원소 기호는 [ <b>${target.symbol}</b> ] 입니다! (원자번호 ${target.num}번)`
      };

    } else if (type === 2) {
      // [유형 3] 원자 번호 ➔ 원소 이름 맞추기 (주기율표 매니아용!)
      // 번호 특징이 뚜렷한 원소들 우선 (1번, 2번, 6번, 8번, 26번, 79번, 82번, 92번, 118번 등)
      const specialNums = [1, 2, 6, 7, 8, 11, 13, 20, 26, 29, 47, 79, 80, 82, 92, 94, 118];
      let target;
      if (Math.random() < 0.6) {
        const pNum = specialNums[Math.floor(Math.random() * specialNums.length)];
        target = std.find(e => e.num === pNum);
      } else {
        target = std[Math.floor(Math.random() * std.length)];
      }

      const wrongs = getSmartDistractors(target, all, std);
      const options = [target, ...wrongs].sort(() => 0.5 - Math.random());

      return {
        tag: '🔢 원자 번호 퀴즈',
        question: `주기율표의 원자 번호 <b style="color:#ff6b81; font-size:1.8rem;">#${target.num}번</b> 원소는 누구일까요?`,
        correctIndex: options.indexOf(target),
        options: options.map(o => `${o.nameKo} (${o.symbol})`),
        explanation: `정답은 <b>#${target.num}번 ${target.nameKo} (${target.symbol})</b>! ${target.summary}`
      };

    } else if (type === 3) {
      // [유형 4] 일상 쓰임새 ➔ 원소 맞추기 (정답 단어 마스킹!)
      const candidates = std.filter(e => e.uses && e.uses.length > 5);
      const target = candidates[Math.floor(Math.random() * candidates.length)];
      const wrongs = getSmartDistractors(target, all, std);
      const options = [target, ...wrongs].sort(() => 0.5 - Math.random());

      const maskedUses = maskTargetWords(target.uses, target);

      return {
        tag: '💡 어디에 쓰일까?',
        question: `다음 일상 속 쓰임새를 가진 원소는 누구일까요?<br><div style="margin-top:10px; padding:12px; background:rgba(0,0,0,0.3); border-radius:10px; font-size:1.05rem; color:#fff;">"${maskedUses}"</div>`,
        correctIndex: options.indexOf(target),
        // 보기에는 기호나 번호 없이 이름만!
        options: options.map(o => o.nameKo),
        explanation: `정답은 <b>${target.nameKo} (${target.symbol})</b>!<br>실제 쓰임새: ${target.uses}`
      };

    } else if (type === 4) {
      // [유형 5] 놀라운 과학 비밀 / 신기한 특징 (정답 단어 마스킹!)
      const candidates = std.filter(e => e.funFact && e.funFact.length > 10);
      const target = candidates[Math.floor(Math.random() * candidates.length)];
      const wrongs = getSmartDistractors(target, all, std);
      const options = [target, ...wrongs].sort(() => 0.5 - Math.random());

      const maskedFact = maskTargetWords(target.funFact, target);

      return {
        tag: '🤯 놀라운 과학 비밀',
        question: `이 신기한 비밀의 주인공 원소는 누구일까요?<br><div style="margin-top:10px; padding:12px; background:rgba(255,190,59,0.1); border-left:4px solid var(--accent-gold); border-radius:8px; font-size:1.02rem; color:#fff;">"${maskedFact}"</div>`,
        correctIndex: options.indexOf(target),
        options: options.map(o => o.nameKo),
        explanation: `정답은 <b>${target.nameKo} (${target.symbol})</b>!<br>비밀: ${target.funFact}`
      };

    } else {
      // [유형 6] 🚀 8주기 미래 가상 원소 퀴즈!
      const target = future[Math.floor(Math.random() * future.length)];
      const wrongs = future.filter(e => e.num !== target.num).concat(std.slice(-4)).sort(() => 0.5 - Math.random()).slice(0, 3);
      const options = [target, ...wrongs].sort(() => 0.5 - Math.random());

      return {
        tag: '🚀 8주기 미래 탐험',
        question: `과학자들이 합성을 도전 중인 8주기 <b style="color:var(--accent-gold); font-size:1.5rem;">${target.num}번</b> 가상 원소의 기호는?`,
        correctIndex: options.indexOf(target),
        options: options.map(o => `${o.symbol} (${o.nameKo})`),
        explanation: `정답은 <b>${target.num}번 ${target.nameKo} (${target.symbol})</b>!<br>${target.summary}`
      };
    }
  }

  function renderNextQuestion() {
    isAnswered = false;
    currentQuestion = generateQuestion();
    if (!currentQuestion) return;

    const qBox = document.getElementById('quiz-question-box');
    const optionsBox = document.getElementById('quiz-options-box');
    const feedbackBox = document.getElementById('quiz-feedback-box');
    const nextBtn = document.getElementById('quiz-next-btn');

    if (!qBox || !optionsBox) return;

    feedbackBox.innerHTML = '';
    feedbackBox.style.color = '';
    nextBtn.style.display = 'none';

    // 퀴즈 문제 렌더링 (상단에 유형 태그 배지 부착)
    qBox.innerHTML = `
      <div style="margin-bottom:12px;">
        <span style="background:rgba(0,210,255,0.15); border:1px solid var(--accent-cyan); color:var(--accent-cyan); font-size:0.8rem; font-weight:800; padding:4px 10px; border-radius:12px;">
          ${currentQuestion.tag}
        </span>
      </div>
      <div>${currentQuestion.question}</div>
    `;

    optionsBox.innerHTML = '';

    currentQuestion.options.forEach((optText, idx) => {
      const btn = document.createElement('button');
      btn.className = 'quiz-option-btn';
      btn.innerHTML = `<span style="display:inline-block; width:26px; height:26px; line-height:24px; text-align:center; background:rgba(255,255,255,0.08); border-radius:50%; margin-right:10px; font-size:0.85rem;">${idx + 1}</span> ${optText}`;

      btn.addEventListener('click', () => {
        if (isAnswered) return;
        isAnswered = true;

        const isCorrect = (idx === currentQuestion.correctIndex);
        playQuizSound(isCorrect);

        const allButtons = optionsBox.querySelectorAll('.quiz-option-btn');
        allButtons.forEach((b, bIdx) => {
          b.disabled = true;
          if (bIdx === currentQuestion.correctIndex) {
            b.classList.add('correct');
          } else if (bIdx === idx && !isCorrect) {
            b.classList.add('wrong');
          }
        });

        if (isCorrect) {
          combo++;
          const gained = 10 + Math.min(combo * 2, 10);
          score += gained;
          feedbackBox.innerHTML = `
            <div style="font-size:1.15rem; font-weight:900; color:#2ed573; margin-bottom:6px;">
              🎉 정답입니다! (+${gained}점) ${combo > 1 ? `<span style="color:var(--accent-gold)">🔥 ${combo}연속 정답!</span>` : ''}
            </div>
            <div style="font-size:0.92rem; color:var(--text-bright); line-height:1.5;">${currentQuestion.explanation}</div>
          `;
        } else {
          combo = 0;
          feedbackBox.innerHTML = `
            <div style="font-size:1.15rem; font-weight:900; color:#ff4757; margin-bottom:6px;">
              앗, 아쉬워요! 정답을 확인해보세요. 💡
            </div>
            <div style="font-size:0.92rem; color:var(--text-bright); line-height:1.5;">${currentQuestion.explanation}</div>
          `;
        }

        updateScoreBadge();
        nextBtn.style.display = 'inline-block';
        nextBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      });

      optionsBox.appendChild(btn);
    });
  }

  window.initQuiz = function() {
    updateScoreBadge();
    const nextBtn = document.getElementById('quiz-next-btn');
    if (nextBtn) {
      // 기존 이벤트 중복 방지를 위해 clone 후 교체
      const newBtn = nextBtn.cloneNode(true);
      nextBtn.parentNode.replaceChild(newBtn, nextBtn);
      newBtn.addEventListener('click', renderNextQuestion);
    }
    renderNextQuestion();
  };
})();
