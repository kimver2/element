// 기생충·선충 마스터 퀴즈

(function() {
  let questions = [];
  let currentIdx = 0;
  let score = 0;
  let answered = false;

  function startQuiz() {
    questions = [...PARASITE_QUIZ_POOL].sort(() => 0.5 - Math.random()).slice(0, 8);
    currentIdx = 0;
    score = 0;
    answered = false;
    renderQuestion();
  }

  function renderQuestion() {
    const container = document.getElementById('p-quiz-box');
    if (!container) return;

    if (currentIdx >= questions.length) {
      if (window.ParasiteAchievements) {
        window.ParasiteAchievements.recordQuizScore(score);
      }
      const pct = Math.round((score / questions.length) * 100);
      container.innerHTML = `
        <div class="quiz-finish-card">
          <div class="quiz-finish-icon">${pct >= 75 ? '🏆' : '🎯'}</div>
          <h3>퀴즈 완료!</h3>
          <p class="quiz-final-score">${questions.length}문제 중 <strong>${score}문제</strong> 정답 (${pct}%)</p>
          <p class="quiz-final-msg">${pct >= 75 ? '훌륭해요! 기생충·선충 박사 수준입니다!' : '좋아요! 도감과 생애주기를 조금 더 탐험하고 다시 도전해 보세요!'}</p>
          <button id="p-quiz-restart" class="quiz-restart-btn">🔄 새 퀴즈 도전하기</button>
        </div>
      `;
      document.getElementById('p-quiz-restart').addEventListener('click', startQuiz);
      return;
    }

    const q = questions[currentIdx];
    answered = false;

    container.innerHTML = `
      <div class="quiz-progress-row">
        <span>문제 ${currentIdx + 1} / ${questions.length}</span>
        <span>현재 점수: <strong>${score}</strong>점</span>
      </div>
      <h3 class="quiz-question-text">${q.q}</h3>
      <div class="quiz-options-list">
        ${q.options.map((opt, idx) => `
          <button class="quiz-opt-btn" data-idx="${idx}">${idx + 1}. ${opt}</button>
        `).join('')}
      </div>
      <div id="p-quiz-explain" class="quiz-explain-box" style="display:none;"></div>
      <div class="quiz-footer-actions">
        <button id="p-quiz-next-btn" class="quiz-next-btn" style="display:none;">다음 문제 →</button>
      </div>
    `;

    container.querySelectorAll('.quiz-opt-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        if (answered) return;
        answered = true;
        const picked = parseInt(btn.dataset.idx, 10);
        const explainBox = document.getElementById('p-quiz-explain');
        const nextBtn = document.getElementById('p-quiz-next-btn');

        container.querySelectorAll('.quiz-opt-btn').forEach((b, idx) => {
          b.disabled = true;
          if (idx === q.answer) b.classList.add('correct');
          else if (idx === picked) b.classList.add('wrong');
        });

        if (picked === q.answer) {
          score++;
          explainBox.innerHTML = `<strong>⭕ 정답!</strong> ${q.explain}`;
          explainBox.className = 'quiz-explain-box ok';
        } else {
          explainBox.innerHTML = `<strong>❌ 오답!</strong> ${q.explain}`;
          explainBox.className = 'quiz-explain-box err';
        }
        explainBox.style.display = 'block';
        nextBtn.style.display = 'inline-flex';
      });
    });

    document.getElementById('p-quiz-next-btn').addEventListener('click', () => {
      currentIdx++;
      renderQuestion();
    });
  }

  window.ParasiteQuiz = {
    init: startQuiz
  };
})();
