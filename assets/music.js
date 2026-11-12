/* Live-synthesized public-domain pieces for the hall slideshows.
   Pachelbel — Canon in D; Beethoven — Ode to Joy, Für Elise; Bach — Prelude in C;
   Mozart — Eine kleine Nachtmusik (theme); Satie — Gymnopédie No. 1. */
(function () {
  function buildSong(name) {
    var D = [50, 57, 62, 66], A = [45, 52, 57, 61], Bm = [47, 54, 59, 62], Fm = [42, 49, 54, 57], G = [43, 50, 55, 59];
    var pat = [0, 1, 2, 3, 2, 1, 2, 3];
    var ev = [];
    function add(at, m, dur, vol, type) { ev.push({ at: at, m: m, dur: dur, vol: vol, type: type }); }
    var t, step;

    if (name === 'elise') {
      step = 0.2;
      var Am = [45, 52, 57], E = [40, 52, 56];
      [[8, Am], [14, E], [20, Am], [32, Am], [38, E], [44, Am]].forEach(function (x) {
        x[1].forEach(function (m, j) { add(x[0] + j, m, 1.0, 0.09, 'sine'); });
      });
      var em = [[76,1],[75,1],[76,1],[75,1],[76,1],[71,1],[74,1],[72,1],[69,2],[0,1],[60,1],[64,1],[69,1],[71,2],[0,1],[64,1],[68,1],[71,1],[72,2],[0,1],[64,1],[76,1],[75,1],
        [76,1],[75,1],[76,1],[71,1],[74,1],[72,1],[69,2],[0,1],[60,1],[64,1],[69,1],[71,2],[0,1],[64,1],[72,1],[71,1],[69,4],[0,2]];
      t = 0; em.forEach(function (x) { if (x[0]) add(t, x[0], Math.max(x[1], 2) * step * 1.3, 0.13, 'triangle'); t += x[1]; });
      return { step: step, len: 50, ev: ev };
    }
    if (name === 'gymnopedie') {
      step = 0.72;
      for (var b = 0; b < 12; b++) {
        var c = b % 2 === 0 ? [43, [59, 62, 66]] : [38, [57, 61, 66]];
        add(b * 3, c[0], 3 * step, 0.13, 'sine');
        c[1].forEach(function (m) { add(b * 3 + 1, m, 2 * step * 1.1, 0.06, 'triangle'); });
      }
      [[13,78,1],[14,81,1],[15,79,1],[16,78,1],[17,73,1],[18,71,1],[19,73,1],[20,74,1],[21,69,3],[24,66,11]].forEach(function (x) { add(x[0], x[1], x[2] * step * 0.95, 0.12, 'sine'); });
      return { step: step, len: 36, ev: ev };
    }
    if (name === 'serenade') {
      step = 0.2;
      var Gc = [43,55,59,62], D7 = [50,54,57,60], Cc = [48,52,55,60], Amn = [45,52,57,60], Dc = [50,54,57,62];
      [Gc,Gc,Gc,Gc,D7,D7,Dc,Dc,Cc,Cc,Amn,Dc,Gc,Dc,Gc,Gc].forEach(function (ch, i) {
        add(i * 4, ch[0], 0.5, 0.11, 'sine');
        [1, 3, 2, 3].forEach(function (k, j) { add(i * 4 + j, ch[k], 0.3, 0.06, 'triangle'); });
      });
      var sm = [[67,2],[0,1],[62,1],[67,2],[0,1],[62,1],[67,1],[62,1],[67,1],[71,1],[74,2],[0,2],
        [72,2],[0,1],[69,1],[72,2],[0,1],[69,1],[72,1],[69,1],[66,1],[69,1],[62,2],[0,2],
        [76,2],[74,2],[72,2],[71,2],[69,2],[71,2],[72,2],[69,2],[67,2],[71,2],[74,2],[66,2],[67,4],[0,4]];
      t = 0; sm.forEach(function (x) { if (x[0]) add(t, x[0], x[1] * step * 0.9, 0.14, 'triangle'); t += x[1]; });
      return { step: step, len: 64, ev: ev };
    }
    if (name === 'prelude') {
      step = 0.17;
      var bars = [[60,64,67,72,76],[60,62,69,74,77],[59,62,67,74,77],[60,64,67,72,76],[60,64,69,76,81],[60,62,66,69,74],[59,62,67,74,79],[59,60,64,67,72],[57,60,64,67,72],[50,57,62,66,72],[55,59,62,67,71],[55,58,64,67,73],[53,57,62,69,74],[53,56,62,65,71],[52,55,60,67,72],[52,53,57,60,65]];
      bars.forEach(function (n, b) {
        for (var h = 0; h < 2; h++) {
          var at = b * 16 + h * 8;
          add(at, n[0], 8 * step * 1.1, 0.12, 'triangle');
          add(at + 1, n[1], 7 * step * 1.05, 0.09, 'triangle');
          [2, 3, 4, 2, 3, 4].forEach(function (k, j) { add(at + 2 + j, n[k], 0.7, j % 3 === 0 ? 0.1 : 0.08, 'triangle'); });
          if (h === 0) add(at, n[0] - 12, 16 * step, 0.09, 'sine');
        }
      });
      return { step: step, len: 256, ev: ev };
    }
    if (name === 'ode') {
      step = 0.27;
      [D, A, D, A, D, A, D, null].forEach(function (ch, b) {
        for (var p = 0; p < 8; p++) {
          var cc = ch || (p < 4 ? A : D);
          add(b * 8 + p, cc[pat[p]], 1.1, p % 4 === 0 ? 0.14 : 0.09, 'triangle');
          if (p % 4 === 0) add(b * 8 + p, cc[0] - 12, 1.2, 0.12, 'sine');
        }
      });
      var ph = [[78,1],[78,1],[79,1],[81,1],[81,1],[79,1],[78,1],[76,1],[74,1],[74,1],[76,1],[78,1]];
      var om = ph.concat([[78,1.5],[76,0.5],[76,2]], ph, [[76,1.5],[74,0.5],[74,2]]);
      t = 0; om.forEach(function (x) { add(t, x[0], x[1] * 2 * step * 0.95, 0.13, 'sine'); t += x[1] * 2; });
      return { step: step, len: 64, ev: ev };
    }
    // canon
    step = 0.25;
    var chords = [D, A, Bm, Fm, G, D, G, A];
    var mel1 = [78,76,74,73,71,69,71,73];
    var mel2 = [[74,73],[71,73],[74,76],[73,71],[71,69],[69,74],[71,74],[76,73]];
    for (var bar = 0; bar < 16; bar++) {
      var ci = bar % 8, ch = chords[ci];
      for (var q = 0; q < 8; q++) add(bar * 8 + q, ch[pat[q]], 1.4, q === 0 ? 0.16 : 0.1, 'triangle');
      add(bar * 8, ch[0] - 12, 2.2, 0.12, 'sine');
      if (bar < 8) add(bar * 8, mel1[ci], 1.9, 0.11, 'sine');
      else { add(bar * 8, mel2[ci][0], 0.95, 0.11, 'sine'); add(bar * 8 + 4, mel2[ci][1], 0.95, 0.11, 'sine'); }
    }
    return { step: step, len: 128, ev: ev };
  }

  var current = null;
  function stop() {
    var a = current; if (!a) return; current = null;
    clearInterval(a.timer);
    try {
      a.master.gain.cancelScheduledValues(a.ctx.currentTime);
      a.master.gain.setValueAtTime(a.master.gain.value, a.ctx.currentTime);
      a.master.gain.linearRampToValueAtTime(0, a.ctx.currentTime + 0.6);
      setTimeout(function () { a.ctx.close(); }, 800);
    } catch (e) { try { a.ctx.close(); } catch (e2) {} }
  }
  function start(name) {
    stop();
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return false;
    var ctx = new AC();
    var master = ctx.createGain();
    master.gain.setValueAtTime(0, ctx.currentTime);
    master.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 2);
    var lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 2600;
    var delay = ctx.createDelay(); delay.delayTime.value = 0.33;
    var fb = ctx.createGain(); fb.gain.value = 0.32;
    var wet = ctx.createGain(); wet.gain.value = 0.35;
    lp.connect(master); lp.connect(delay); delay.connect(fb); fb.connect(delay); delay.connect(wet); wet.connect(master);
    master.connect(ctx.destination);
    var song = buildSong(name), byStep = {};
    song.ev.forEach(function (e) { (byStep[e.at] = byStep[e.at] || []).push(e); });
    function note(m, t0, dur, vol, type) {
      var o = ctx.createOscillator(), g = ctx.createGain();
      o.type = type; o.frequency.value = 440 * Math.pow(2, (m - 69) / 12);
      g.gain.setValueAtTime(0.0001, t0);
      g.gain.exponentialRampToValueAtTime(vol, t0 + 0.015);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
      o.connect(g); g.connect(lp); o.start(t0); o.stop(t0 + dur + 0.05);
    }
    var a = { ctx: ctx, master: master, n: 0, next: ctx.currentTime + 0.1, name: name };
    function tick() {
      while (a.next < ctx.currentTime + 0.4) {
        (byStep[a.n % song.len] || []).forEach(function (e) { note(e.m, a.next, e.dur, e.vol, e.type); });
        a.next += song.step; a.n += 1;
      }
    }
    a.timer = setInterval(tick, 100); tick();
    current = a;
    return true;
  }
  window.KZMusic = { start: start, stop: stop, playing: function () { return current ? current.name : null; } };
})();
