// 🌀 빙글빙글 2D 전자 껍질(보어 원자 모형) 캔버스 애니메이션

(function() {
  let canvas = null;
  let ctx = null;
  let animId = null;
  let currentShells = [1];
  let currentSymbol = 'H';
  let currentNumber = 1;
  let angleOffset = 0;

  function drawAtom() {
    if (!canvas || !ctx) return;
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;

    ctx.clearRect(0, 0, width, height);

    // 1. 원자핵 그리기 (중심)
    const nucleusRadius = 18;
    const nucGrad = ctx.createRadialGradient(centerX - 3, centerY - 3, 2, centerX, centerY, nucleusRadius);
    nucGrad.addColorStop(0, '#00d2ff');
    nucGrad.addColorStop(0.7, '#0055ff');
    nucGrad.addColorStop(1, '#002277');

    ctx.save();
    ctx.beginPath();
    ctx.arc(centerX, centerY, nucleusRadius, 0, Math.PI * 2);
    ctx.fillStyle = nucGrad;
    ctx.shadowColor = '#00d2ff';
    ctx.shadowBlur = 15;
    ctx.fill();

    // 원자 번호 텍스트
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 12px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowBlur = 0;
    ctx.fillText(`${currentNumber}+`, centerX, centerY);
    ctx.restore();

    // 2. 전자 껍질 궤도 및 전자들 그리기
    const baseRadius = 28;
    const radiusStep = 16;
    const shellColors = ['#ff6b81', '#ffa502', '#2ed573', '#1e90ff', '#e056fd', '#00cec9', '#f1c40f'];

    currentShells.forEach((electronCount, shellIdx) => {
      const radius = baseRadius + shellIdx * radiusStep;
      const color = shellColors[shellIdx % shellColors.length];

      // 궤도 원선
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.lineWidth = 1.2;
      ctx.setLineDash([3, 3]);
      ctx.stroke();
      ctx.setLineDash([]);

      // 전자들 배치 및 회전
      const speed = (shellIdx % 2 === 0 ? 1 : -1) * (0.015 - shellIdx * 0.0012);
      const shellAngle = angleOffset * speed * 2;

      for (let i = 0; i < electronCount; i++) {
        const angle = shellAngle + (i * (Math.PI * 2 / electronCount));
        const ex = centerX + Math.cos(angle) * radius;
        const ey = centerY + Math.sin(angle) * radius;

        // 전자 그리기
        ctx.save();
        ctx.beginPath();
        ctx.arc(ex, ey, 4.5, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.shadowColor = color;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.restore();
      }
    });

    angleOffset += 1;
    animId = requestAnimationFrame(drawAtom);
  }

  window.renderAtomModel = function(num, symbol, shells) {
    canvas = document.getElementById('atom-canvas');
    if (!canvas) return;
    ctx = canvas.getContext('2d');

    currentNumber = num;
    currentSymbol = symbol;
    currentShells = shells || [1];

    if (animId) {
      cancelAnimationFrame(animId);
    }
    drawAtom();
  };
})();
