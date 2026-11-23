// 기생충·선충 SVG 일러스트 & 애니메이션 캔버스 렌더러

(function() {
  // 카드/타일용 생물 형태 SVG 생성
  function getParasiteSVG(parasite, size = 76) {
    const cat = PARASITE_CATEGORIES[parasite.category] || { color: '#10b981' };
    const color = cat.color;
    const type = parasite.shapeType;

    let inner = '';
    if (type === 'roundworm' || type === 'hookworm' || type === 'filaria') {
      inner = `
        <path d="M12,56 C22,22 38,68 50,30 C58,12 68,26 66,44" fill="none" stroke="${color}" stroke-width="6.5" stroke-linecap="round"/>
        <path d="M12,56 C22,22 38,68 50,30 C58,12 68,26 66,44" fill="none" stroke="rgba(255,255,255,0.35)" stroke-width="2" stroke-linecap="round"/>
        <circle cx="66" cy="44" r="2.6" fill="#fff"/>
      `;
    } else if (type === 'pinworm' || type === 'celegans') {
      inner = `
        <path d="M10,44 C26,18 42,60 56,28 C62,18 68,22 70,34" fill="none" stroke="${color}" stroke-width="4" stroke-linecap="round"/>
        <path d="M16,40 C28,26 42,50 54,32" fill="none" stroke="#a7f3d0" stroke-width="1.4" stroke-dasharray="3 3"/>
        <circle cx="66" cy="28" r="2" fill="#fff"/>
      `;
    } else if (type === 'whipworm') {
      inner = `
        <path d="M12,54 C16,38 24,20 38,24" fill="none" stroke="${color}" stroke-width="7" stroke-linecap="round"/>
        <path d="M38,24 C50,28 52,52 68,36" fill="none" stroke="${color}" stroke-width="2.2" stroke-linecap="round"/>
      `;
    } else if (type === 'spiral') {
      inner = `
        <ellipse cx="40" cy="40" rx="24" ry="19" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.28)" stroke-width="2" stroke-dasharray="4 3"/>
        <path d="M40,40 m-2,0 a 4,4 0 1,0 8,0 a 8,8 0 1,0 -16,0 a 12,12 0 1,0 24,0" fill="none" stroke="${color}" stroke-width="3.6" stroke-linecap="round"/>
      `;
    } else if (type === 'fluke') {
      inner = `
        <path d="M40,12 C56,20 62,48 40,68 C18,48 24,20 40,12 Z" fill="${color}33" stroke="${color}" stroke-width="3"/>
        <circle cx="40" cy="22" r="4.5" fill="none" stroke="#fff" stroke-width="2"/>
        <circle cx="40" cy="36" r="5.5" fill="none" stroke="#fff" stroke-width="2"/>
        <path d="M34,46 Q40,56 46,46" fill="none" stroke="${color}" stroke-width="2.2"/>
      `;
    } else if (type === 'tapeworm') {
      inner = `
        <circle cx="20" cy="22" r="7" fill="${color}55" stroke="${color}" stroke-width="2.5"/>
        <circle cx="17" cy="20" r="1.6" fill="#fff"/>
        <circle cx="23" cy="20" r="1.6" fill="#fff"/>
        <rect x="24" y="26" width="12" height="9" rx="2" fill="${color}44" stroke="${color}" stroke-width="2"/>
        <rect x="33" y="34" width="14" height="10" rx="2" fill="${color}55" stroke="${color}" stroke-width="2"/>
        <rect x="44" y="43" width="16" height="11" rx="2" fill="${color}66" stroke="${color}" stroke-width="2"/>
        <rect x="55" y="53" width="14" height="10" rx="2" fill="${color}44" stroke="${color}" stroke-width="2"/>
      `;
    } else if (type === 'protozoa-ring') {
      inner = `
        <circle cx="40" cy="40" r="24" fill="rgba(244,63,94,0.18)" stroke="#fb7185" stroke-width="2.5"/>
        <circle cx="42" cy="40" r="11" fill="none" stroke="${color}" stroke-width="3"/>
        <circle cx="51" cy="34" r="3.5" fill="#fff"/>
      `;
    } else if (type === 'protozoa-crescent') {
      inner = `
        <path d="M54,18 C32,20 20,44 36,64 C28,46 36,30 54,18 Z" fill="${color}66" stroke="${color}" stroke-width="2.5"/>
        <circle cx="38" cy="42" r="3.5" fill="#fff"/>
      `;
    } else if (type === 'amoeba') {
      inner = `
        <path d="M26,24 C34,12 52,18 56,30 C66,34 62,54 48,56 C44,66 24,62 22,48 C12,42 18,28 26,24 Z" fill="${color}44" stroke="${color}" stroke-width="2.8"/>
        <circle cx="38" cy="38" r="6" fill="rgba(255,255,255,0.45)" stroke="#fff" stroke-width="1.5"/>
        <circle cx="48" cy="44" r="2.5" fill="#fb7185"/>
      `;
    } else if (type === 'giardia') {
      inner = `
        <path d="M40,14 C56,14 60,38 40,62 C20,38 24,14 40,14 Z" fill="${color}33" stroke="${color}" stroke-width="2.6"/>
        <circle cx="33" cy="30" r="4" fill="#fff"/>
        <circle cx="47" cy="30" r="4" fill="#fff"/>
        <circle cx="33" cy="30" r="1.6" fill="#0f172a"/>
        <circle cx="47" cy="30" r="1.6" fill="#0f172a"/>
        <path d="M32,42 Q40,48 48,42" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round"/>
        <path d="M32,58 L26,70 M40,62 L40,73 M48,58 L54,70" stroke="${color}" stroke-width="2" stroke-linecap="round"/>
      `;
    } else if (type === 'mite' || type === 'louse') {
      inner = `
        <ellipse cx="40" cy="42" rx="16" ry="20" fill="${color}44" stroke="${color}" stroke-width="2.5"/>
        <circle cx="40" cy="19" r="6" fill="${color}66" stroke="${color}" stroke-width="2"/>
        <path d="M25,30 L12,24 M24,40 L10,40 M25,50 L13,56 M55,30 L68,24 M56,40 L70,40 M55,50 L67,56" stroke="${color}" stroke-width="2.4" stroke-linecap="round"/>
      `;
    }

    return `<svg viewBox="0 0 80 80" width="${size}" height="${size}" class="parasite-svg" aria-hidden="true">${inner}</svg>`;
  }

  // 애니메이션 캔버스 컨트롤러
  class ParasiteCanvasAnimator {
    constructor(canvas) {
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d');
      this.rafId = null;
      this.parasite = null;
      this.stain = 'brightfield'; // brightfield | giemsa | fluorescence | darkfield
      this.zoom = 1; // 0.6 ~ 2.5
      this.blurPx = 0;
      this.t = 0;
    }

    setConfig({ parasite, stain, zoom, blurPx }) {
      if (parasite !== undefined) this.parasite = parasite;
      if (stain !== undefined) this.stain = stain;
      if (zoom !== undefined) this.zoom = zoom;
      if (blurPx !== undefined) this.blurPx = blurPx;
    }

    start() {
      if (this.rafId) cancelAnimationFrame(this.rafId);
      const loop = () => {
        this.t += 0.035;
        this.draw();
        this.rafId = requestAnimationFrame(loop);
      };
      loop();
    }

    stop() {
      if (this.rafId) {
        cancelAnimationFrame(this.rafId);
        this.rafId = null;
      }
    }

    draw() {
      const { canvas, ctx, parasite, stain, zoom, blurPx, t } = this;
      if (!parasite || !ctx) return;

      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      // 배경 (염색/조명 모드별)
      let bg1 = '#0f172a', bg2 = '#020617', strokeCol = '#10b981', fillCol = 'rgba(16,185,129,0.28)';
      if (stain === 'brightfield') {
        bg1 = '#e2e8f0'; bg2 = '#cbd5e1';
        strokeCol = (PARASITE_CATEGORIES[parasite.category] || {}).color || '#0f766e';
        fillCol = strokeCol + '44';
      } else if (stain === 'giemsa') {
        bg1 = '#f3e8ff'; bg2 = '#d8b4fe';
        strokeCol = '#6b21a8';
        fillCol = 'rgba(147, 51, 234, 0.35)';
      } else if (stain === 'fluorescence') {
        bg1 = '#04120c'; bg2 = '#020617';
        strokeCol = '#4ade80';
        fillCol = 'rgba(74, 222, 128, 0.28)';
      } else if (stain === 'darkfield') {
        bg1 = '#0b1120'; bg2 = '#020617';
        strokeCol = '#38bdf8';
        fillCol = 'rgba(56, 189, 248, 0.22)';
      }

      const grad = ctx.createRadialGradient(w / 2, h / 2, 10, w / 2, h / 2, w * 0.55);
      grad.addColorStop(0, bg1);
      grad.addColorStop(1, bg2);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // 현미경 눈금선
      ctx.save();
      ctx.strokeStyle = stain === 'brightfield' || stain === 'giemsa' ? 'rgba(15,23,42,0.12)' : 'rgba(255,255,255,0.08)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(w / 2, 12); ctx.lineTo(w / 2, h - 12);
      ctx.moveTo(12, h / 2); ctx.lineTo(w - 12, h / 2);
      ctx.stroke();
      ctx.restore();

      ctx.save();
      if (blurPx > 0) ctx.filter = `blur(${blurPx}px)`;
      ctx.translate(w / 2, h / 2);
      ctx.scale(zoom, zoom);

      // 부유 입자
      for (let i = 0; i < 10; i++) {
        const px = Math.sin(t * 0.4 + i * 2.1) * (w * 0.35);
        const py = Math.cos(t * 0.35 + i * 1.7) * (h * 0.32);
        ctx.fillStyle = stain === 'brightfield' ? 'rgba(100,116,139,0.22)' : 'rgba(255,255,255,0.15)';
        ctx.beginPath();
        ctx.arc(px, py, 2 + (i % 3), 0, Math.PI * 2);
        ctx.fill();
      }

      const type = parasite.shapeType;
      ctx.strokeStyle = strokeCol;
      ctx.fillStyle = fillCol;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      if (type === 'roundworm' || type === 'pinworm' || type === 'celegans' || type === 'hookworm' || type === 'filaria') {
        const amp = type === 'celegans' ? 18 : 24;
        const thick = type === 'roundworm' ? 11 : type === 'celegans' ? 6 : 8;
        ctx.beginPath();
        for (let x = -90; x <= 90; x += 4) {
          const y = Math.sin(x * 0.055 - t * 2.1) * amp * Math.cos(x * 0.008);
          if (x === -90) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.lineWidth = thick;
        ctx.stroke();

        // 내부 소화관/형광 라인
        ctx.beginPath();
        for (let x = -80; x <= 80; x += 4) {
          const y = Math.sin(x * 0.055 - t * 2.1) * amp * Math.cos(x * 0.008);
          if (x === -80) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = stain === 'fluorescence' ? '#bef264' : 'rgba(255,255,255,0.45)';
        ctx.lineWidth = Math.max(1.5, thick * 0.3);
        ctx.stroke();
      } else if (type === 'whipworm') {
        ctx.beginPath();
        ctx.lineWidth = 10;
        ctx.moveTo(-75, Math.sin(t) * 8);
        ctx.quadraticCurveTo(-35, -18 + Math.sin(t) * 6, -5, 4);
        ctx.stroke();
        ctx.beginPath();
        ctx.lineWidth = 3;
        ctx.moveTo(-5, 4);
        ctx.bezierCurveTo(25, 22 + Math.cos(t * 1.5) * 14, 55, -26 + Math.sin(t * 1.5) * 14, 85, 6);
        ctx.stroke();
      } else if (type === 'spiral') {
        ctx.strokeStyle = 'rgba(148,163,184,0.45)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.ellipse(0, 0, 62, 46, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.strokeStyle = strokeCol;
        ctx.lineWidth = 6;
        ctx.beginPath();
        for (let a = 0; a < Math.PI * 5.2; a += 0.12) {
          const r = 4 + a * 2.3;
          const x = Math.cos(a + Math.sin(t) * 0.2) * r;
          const y = Math.sin(a + Math.sin(t) * 0.2) * r;
          if (a === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      } else if (type === 'fluke') {
        const wobble = Math.sin(t * 1.6) * 6;
        ctx.beginPath();
        ctx.moveTo(0, -56);
        ctx.bezierCurveTo(46 + wobble, -24, 42 - wobble, 32, 0, 58);
        ctx.bezierCurveTo(-42 + wobble, 32, -46 - wobble, -24, 0, -56);
        ctx.fill();
        ctx.lineWidth = 3.5;
        ctx.stroke();
        // 입흡반 & 배흡반
        ctx.beginPath(); ctx.arc(0, -34, 7, 0, Math.PI * 2); ctx.stroke();
        ctx.beginPath(); ctx.arc(0, -10, 9, 0, Math.PI * 2); ctx.stroke();
      } else if (type === 'tapeworm') {
        for (let i = 0; i < 7; i++) {
          const x = -72 + i * 24;
          const y = Math.sin(t * 1.4 + i * 0.6) * 12;
          const segW = 14 + i * 2.2;
          const segH = 12 + i * 1.8;
          ctx.fillRect(x - segW / 2, y - segH / 2, segW, segH);
          ctx.lineWidth = 2.2;
          ctx.strokeRect(x - segW / 2, y - segH / 2, segW, segH);
        }
      } else if (type === 'protozoa-ring') {
        // 적혈구 3개 + 반지 모양 말라리아
        const cells = [[-48, -18], [16, 12], [52, -26]];
        cells.forEach(([cx, cy], idx) => {
          const ox = cx + Math.sin(t + idx) * 4;
          const oy = cy + Math.cos(t + idx) * 4;
          ctx.fillStyle = stain === 'giemsa' ? 'rgba(244, 114, 182, 0.35)' : 'rgba(239, 68, 68, 0.32)';
          ctx.strokeStyle = '#fb7185';
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.arc(ox, oy, 26, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
          if (idx === 1) {
            ctx.strokeStyle = strokeCol;
            ctx.lineWidth = 3.5;
            ctx.beginPath();
            ctx.arc(ox + 2, oy + 2, 10, 0, Math.PI * 2);
            ctx.stroke();
            ctx.fillStyle = stain === 'fluorescence' ? '#bef264' : '#be123c';
            ctx.beginPath();
            ctx.arc(ox + 11, oy - 3, 4, 0, Math.PI * 2);
            ctx.fill();
          }
        });
      } else if (type === 'protozoa-crescent') {
        for (let i = 0; i < 3; i++) {
          ctx.save();
          ctx.translate((i - 1) * 44, Math.sin(t + i) * 18);
          ctx.rotate(i * 0.7 + Math.sin(t * 0.8) * 0.25);
          ctx.beginPath();
          ctx.moveTo(18, -22);
          ctx.quadraticCurveTo(-20, 0, 18, 22);
          ctx.quadraticCurveTo(-2, 0, 18, -22);
          ctx.fill();
          ctx.lineWidth = 2.5;
          ctx.stroke();
          ctx.restore();
        }
      } else if (type === 'amoeba') {
        ctx.beginPath();
        for (let a = 0; a <= Math.PI * 2 + 0.2; a += 0.25) {
          const r = 36 + Math.sin(a * 4 + t * 2) * 10 + Math.cos(a * 3 - t * 1.5) * 6;
          const x = Math.cos(a) * r;
          const y = Math.sin(a) * r;
          if (a === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fill();
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.beginPath(); ctx.arc(-6, -4, 9, 0, Math.PI * 2); ctx.stroke();
      } else if (type === 'giardia') {
        const dy = Math.sin(t * 2) * 8;
        ctx.save();
        ctx.translate(0, dy);
        ctx.beginPath();
        ctx.moveTo(0, -44);
        ctx.bezierCurveTo(36, -40, 38, 12, 0, 44);
        ctx.bezierCurveTo(-38, 12, -36, -40, 0, -44);
        ctx.fill();
        ctx.lineWidth = 3;
        ctx.stroke();
        // 눈 두 개 & 미소
        ctx.fillStyle = '#fff';
        ctx.beginPath(); ctx.arc(-12, -14, 6, 0, Math.PI * 2); ctx.arc(12, -14, 6, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#0f172a';
        ctx.beginPath(); ctx.arc(-12, -14, 2.5, 0, Math.PI * 2); ctx.arc(12, -14, 2.5, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(0, 2, 12, 0.2, Math.PI - 0.2); ctx.stroke();
        // 편모
        for (let f = -1; f <= 1; f++) {
          ctx.beginPath();
          ctx.moveTo(f * 10, 38);
          ctx.quadraticCurveTo(f * 18 + Math.sin(t * 4) * 8, 56, f * 22, 74);
          ctx.stroke();
        }
        ctx.restore();
      } else {
        // mite or louse
        const legMove = Math.sin(t * 3) * 4;
        ctx.beginPath();
        ctx.ellipse(0, 6, 26, 34, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.beginPath(); ctx.arc(0, -34, 11, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        for (let side of [-1, 1]) {
          for (let l = 0; l < 3; l++) {
            const ly = -12 + l * 18;
            ctx.beginPath();
            ctx.moveTo(side * 24, ly);
            ctx.lineTo(side * 46, ly - 8 + (l % 2 === 0 ? legMove : -legMove));
            ctx.stroke();
          }
        }
      }

      ctx.restore();
    }
  }

  window.getParasiteSVG = getParasiteSVG;
  window.ParasiteCanvasAnimator = ParasiteCanvasAnimator;
})();
