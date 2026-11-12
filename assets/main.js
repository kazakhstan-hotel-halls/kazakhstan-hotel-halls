(function () {
  var IMG = 'assets/img/';
  var TOUR = 'https://pano3d.kz/Kahazakhstan_VR/';
  var TOURS = {
    gb: 'https://pano3d.kz/Kahazakhstan_VR/#media-name=%C2%ABGrand%20Ballroom%C2%BB&yaw=-106.51&pitch=-6.92&fov=130.00',
    gp: 'https://pano3d.kz/Kahazakhstan_VR/#media-name=%C2%ABGrand%20Palace%C2%BB&yaw=0.46&pitch=0.00&fov=110.00',
    eh: 'https://pano3d.kz/Kahazakhstan_VR/#media-name=%C2%ABElegant%20hall%C2%BB&yaw=-15.44&pitch=-5.32&fov=110.00',
    ae: 'https://pano3d.kz/Kahazakhstan_VR/#media-name=%C2%ABAltyn%20Emel%C2%BB&yaw=102.48&pitch=-3.66&fov=110.00'
  };

  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var $ = function (id) { return document.getElementById(id); };
  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var ICON = {
    screen: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="12" rx="1"/><path d="M7 9V8h1M17 9V8h-1M7 13v1h1M17 13v1h-1"/></svg>',
    light: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z"/></svg>',
    flip: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="3" width="14" height="11" rx="1"/><path d="M12 14v3M8 21l4-4 4 4M9 7h6M9 10h4"/></svg>',
    sound: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3M9 21h6"/></svg>',
    podium: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 7h14l-2 4H7zM9 11v8M15 11v8M7 21h10M12 4V7"/></svg>',
    tv: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="4" width="20" height="13" rx="1.5"/><path d="M8 21h8M12 17v4"/></svg>',
    globe: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><ellipse cx="12" cy="12" rx="9" ry="3.5"/><path d="M12 3v18"/></svg>',
    prev: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 6l-6 6 6 6"/></svg>',
    next: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg>',
    pause: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M8 5v14M16 5v14"/></svg>',
    play: '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 4.5v15l13-7.5z"/></svg>',
    note: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 18V5l11-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="17" cy="16" r="3"/></svg>',
    speaker: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9z"/><path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12"/></svg>'
  };
  var TECH = { screen: 'LED-экран', light: 'Световое оборудование', flip: 'Флипчарт', sound: 'Звук, 2 радиомикрофона', podium: 'Трибуна', tv: 'ТВ 132" с HDMI' };

  /* ---------- Halls ---------- */
  var HALLS = [
    { id: 'gb', name: 'Grand Ballroom', ru: 'Гранд Баллрум · главный зал', area: 820, cap: 700,
      desc: 'Главный зал отеля для масштабных конференций, свадеб, гала-ужинов и выставок. Возможна трансформация и зонирование. Рядом — фойе 285 м² с гардеробом.',
      stats: [['820 м²', 'общая площадь'], ['7 м', 'высота потолков'], ['700', 'максимум гостей']],
      dims: 'Глубина 25,3 м · фойе 285 м²',
      photos: ['gb-1.jpg', 'gb-2.jpg', 'gb-3.jpg', 'gb-4.jpg', 'gb-5.jpg', 'gb-hero.jpg'], plan: 'gb_plan.png',
      tech: ['screen', 'light', 'flip', 'sound', 'podium'],
      layouts: [['Банкет', 500, 'gb_banquet.png'], ['Театр', 700, 'gb_theatre.png'], ['Фуршет', 700, 'gb_buffet.png'], ['Класс', 220, 'gb_class.png']],
      m: [500, 700, 700, 220, null] },
    { id: 'gp', name: 'Grand Palace', ru: 'Гранд Палас', area: 641, cap: 550,
      desc: 'Просторный зал для банкетов, форумов, торжеств и презентаций. Современное оборудование и элегантный интерьер с хрустальными люстрами.',
      stats: [['641 м²', 'общая площадь'], ['2,6 м', 'высота потолков'], ['550', 'максимум гостей']],
      dims: '39,6 × 15,8 м · с фойе',
      photos: ['gp-0.jpg', 'gp-1.jpg', 'gp-2.jpg', 'gp-3.jpg', 'gp-4.jpg'], plan: 'gp_plan.png',
      tech: ['screen', 'sound', 'flip', 'podium'],
      layouts: [['Банкет', 400, 'gp_banquet.png'], ['Театр', 550, 'gp_theatre.png']],
      m: [400, 550, null, null, null] },
    { id: 'eh', name: 'Elegant Hall', ru: 'Элегант Холл', area: 217, cap: 200,
      desc: 'Универсальное пространство для деловых мероприятий, приёмов и частных событий. Панорамные окна, LED-экран и гибкая рассадка.',
      stats: [['217 м²', 'общая площадь'], ['25,5 м', 'длина зала'], ['200', 'максимум гостей']],
      dims: '25,5 × 8,5 м · с фойе',
      photos: ['eh-1.jpg', 'eh-2.jpg', 'eh-3.jpg', 'eh-4.jpg', 'eh-5.jpg', 'eh-0.jpg'], plan: 'eh_plan.png',
      tech: ['sound', 'screen'],
      layouts: [['Театр', 200, 'eh_theatre.png'], ['Класс', 70, 'eh_class.png'], ['Банкет', 120, 'eh_banquet.png']],
      m: [120, 200, null, 70, null] },
    { id: 'ae', name: 'Altyn Emel', ru: 'Алтын Эмель', area: 177, cap: 220,
      desc: 'Светлый зал с классическим дизайном для тренингов, фуршетов, свадеб и конференций. Перед залом — фойе 163 м² для кофе-брейков и регистрации.',
      stats: [['177 м²', 'общая площадь'], ['4,4 м', 'высота потолков'], ['220', 'максимум гостей']],
      dims: '20,3 × 8,7 м · фойе 163 м²',
      photos: ['ae-1.jpg', 'ae-2.jpg', 'ae-3.jpg', 'ae-4.jpg', 'ae-5.jpg', 'ae-6.jpg'], plan: 'ae_plan.png',
      tech: ['screen', 'flip', 'podium', 'sound'],
      layouts: [['Театр', 220, 'ae_theatre.png'], ['Класс', 80, 'ae_class.png'], ['«О»-образно', 40, 'ae_o.png'], ['«П»-образно', 30, 'ae_p.png']],
      m: [null, 220, null, 80, '40 / 30'] },
    { id: 'ab', name: 'Abay', ru: 'Абай · переговорная', area: 60, cap: 20,
      desc: 'Зал для переговоров и корпоративных встреч. Полностью оборудован для презентаций: ТВ 132" с HDMI, экран, флипчарт и звук.',
      stats: [['60 м²', 'общая площадь'], ['3 м', 'высота потолков'], ['14 + 6', 'за столом + доп. места']],
      dims: '9,8 × 6,25 м',
      photos: ['ab-1.jpg', 'ab-2.jpg', 'ab-3.jpg', 'ab-4.jpg', 'ab-5.jpg'], plan: 'abay_plan.png',
      tech: ['tv', 'sound', 'screen', 'flip', 'podium'],
      layouts: [['«О»-образно', '14 + 6', 'abay_o.png']],
      m: [null, null, null, null, '14 + 6'] },
    { id: 'ul', name: 'Ulytau', ru: 'Улытау · переговорная', area: 30, cap: 12,
      desc: 'Камерная переговорная для встреч до 12 человек: деловые переговоры, интервью, рабочие сессии.',
      stats: [['30 м²', 'общая площадь'], ['12', 'максимум гостей'], ['1', 'общий стол']],
      dims: '',
      photos: ['ul-1.jpg', 'ul-2.jpg', 'ul-3.jpg', 'ul-4.jpg'], plan: null,
      tech: [], layouts: [],
      m: [null, null, null, null, 'до 12'] }
  ];

  /* ---------- Slideshows ---------- */
  var SHOWS = [
    { id: 'ballroom', key: 'gb', name: 'Grand Ballroom', song: 'canon', eyebrow: 'Свадьбы и гала-вечера', title: 'Grand Ballroom — зал для главного дня',
      desc: 'Хрустальная люстра под куполом, колонны-«лотосы» с золотой подсветкой и до 500 гостей за банкетными столами.',
      slides: [['gb-1.jpg', 'Банкетная рассадка под хрустальной люстрой'], ['gb-2.jpg', 'Центральный танцпол и колонны-«лотосы»'], ['gb-3.jpg', 'Купол с люстрой и золотые панели'], ['gb-4.jpg', 'Простор для 500 гостей'], ['gb-5.jpg', 'Лаунж-зона в фойе']] },
    { id: 'palace', key: 'gp', name: 'Grand Palace', song: 'ode', eyebrow: 'Форумы, банкеты, торжества', title: 'Grand Palace — от форума до свадьбы',
      desc: 'Хрустальные люстры, мраморный танцпол, сцена с LED-экранами и световым шоу. До 550 гостей в театральной рассадке.',
      slides: [['gp-1.jpg', 'Свадебный банкет и стол молодожёнов'], ['gp-2.jpg', 'Вечернее световое шоу и LED-экраны'], ['gp-3.jpg', '«П»-образная рассадка для заседаний'], ['gp-4.jpg', 'Театральная рассадка — вид со сцены']] },
    { id: 'elegant', key: 'eh', name: 'Elegant Hall', song: 'prelude', eyebrow: 'Приёмы и деловые события', title: 'Elegant Hall — свет и вид на парк',
      desc: 'Панорамное остекление с видом на парк, динамическая подсветка потолка, LED-экран и звук. До 200 гостей в театре, до 120 — на банкете.',
      slides: [['eh-1.jpg', 'Банкет у панорамных окон'], ['eh-2.jpg', 'Вид на парк и золотые бра'], ['eh-3.jpg', 'Центральный проход и LED-экран'], ['eh-4.jpg', 'Динамическая подсветка потолка'], ['eh-5.jpg', 'Светлые панели и колонны под дерево']] },
    { id: 'altyn-emel', key: 'ae', name: 'Altyn Emel', song: 'serenade', eyebrow: 'Конференции и тренинги', title: 'Altyn Emel — зал для деловых событий',
      desc: 'Потолок с подсвеченным национальным орнаментом, звук и проектор. До 220 гостей в театре, фойе 163 м² для кофе-брейков и регистрации.',
      slides: [['ae-1.jpg', 'Театральная рассадка на 220 гостей'], ['ae-2.jpg', 'Рассадка «класс» для тренингов'], ['ae-3.jpg', '«П»-образная рассадка для заседаний'], ['ae-4.jpg', 'Фойе 163 м² для кофе-брейков']] },
    { id: 'abay', key: 'ab', name: 'Abay', song: 'elise', eyebrow: 'Переговорная', title: 'Abay — для переговоров и советов директоров',
      desc: 'Длинный стол с кожаными креслами, овальные светящиеся потолки, ТВ, флипчарт и кофе-зона. Вход из холла с казахскими орнаментами.',
      slides: [['ab-1.jpg', 'Стол для переговоров, ТВ и флипчарт'], ['ab-2.jpg', 'Кофе-зона в переговорной'], ['ab-3.jpg', 'Мягкий свет овальных потолков'], ['ab-4.jpg', 'Флипчарт и отдельный вход'], ['ab-5.jpg', 'Вход в Abay с казахскими орнаментами']] },
    { id: 'ulytau', key: 'ul', name: 'Ulytau', song: 'gymnopedie', eyebrow: 'Переговорная', title: 'Ulytau — камерно и конфиденциально',
      desc: 'Стены в тёмном дереве, кожаные кресла, экран для презентаций и собственная кофе-станция. До 12 участников.',
      slides: [['ul-1.jpg', 'Стол для переговоров и экран'], ['ul-2.jpg', 'Готово к встрече: вода, блокноты, папки'], ['ul-3.jpg', 'Кофе-станция у входа'], ['ul-4.jpg', 'Экран для презентаций']] }
  ];

  var showState = {};
  function renderShows() {
    var host = $('shows');
    host.innerHTML = SHOWS.map(function (s) {
      var tour = TOURS[s.key] ? '<a class="btn btn-dark" href="' + TOURS[s.key] + '" target="_blank" rel="noopener">' + ICON.globe + '3D-тур по ' + esc(s.name) + '</a>' : '';
      return '<section class="show" id="' + s.id + '" aria-roledescription="слайд-шоу" aria-label="' + esc(s.name) + '"><div class="wrap">' +
        '<div class="show-head"><div class="stack" style="gap:10px"><p class="eyebrow">' + esc(s.eyebrow) + '</p><h2 class="h2">' + esc(s.title) + '</h2></div>' +
        '<div class="side"><p class="lead">' + esc(s.desc) + '</p>' + tour + '</div></div>' +
        '<div class="stage">' + s.slides.map(function (sl, i) {
          return '<img src="' + IMG + sl[0] + '" alt="' + (i === 0 ? esc(s.name + ': ' + sl[1]) : '') + '"' + (i === 0 ? ' class="on"' : '') + (i > 1 ? ' loading="lazy"' : '') + '>';
        }).join('') +
        '<div class="stage-bar"><div class="stack" style="gap:2px;min-width:0"><span class="cap" data-cap>' + esc(s.slides[0][1]) + '</span><span class="cnt" data-cnt>1 / ' + s.slides.length + '</span></div>' +
        '<div class="ctrl"><button type="button" class="icon-btn" data-act="prev" aria-label="Предыдущее фото">' + ICON.prev + '</button>' +
        '<button type="button" class="icon-btn" data-act="play" aria-label="Пауза слайд-шоу">' + ICON.pause + '</button>' +
        '<button type="button" class="icon-btn" data-act="next" aria-label="Следующее фото">' + ICON.next + '</button>' +
        '<button type="button" class="music-btn" data-act="music" aria-pressed="false">' + ICON.note + '<span>Включить музыку</span></button></div></div></div>' +
        '<div class="dots">' + s.slides.map(function (sl, i) { return '<button type="button" data-dot="' + i + '" aria-label="Фото ' + (i + 1) + ' из ' + s.slides.length + '" aria-current="' + (i === 0) + '"><span></span></button>'; }).join('') + '</div>' +
        '</div></section>';
    }).join('');
    SHOWS.forEach(function (s) {
      showState[s.key] = { i: 0, playing: !reduced };
      var el = $(s.id);
      el.addEventListener('click', function (e) {
        var b = e.target.closest('button'); if (!b) return;
        if (b.dataset.dot != null) goto(s, +b.dataset.dot);
        else if (b.dataset.act === 'prev') goto(s, showState[s.key].i - 1);
        else if (b.dataset.act === 'next') goto(s, showState[s.key].i + 1);
        else if (b.dataset.act === 'play') { showState[s.key].playing = !showState[s.key].playing; paintPlay(s); }
        else if (b.dataset.act === 'music') toggleMusic(s);
      });
      paintPlay(s);
    });
    setInterval(function () {
      if (document.hidden) return;
      SHOWS.forEach(function (s) { if (showState[s.key].playing) goto(s, showState[s.key].i + 1); });
    }, 5500);
  }
  function goto(s, i) {
    var n = s.slides.length; i = (i + n) % n; showState[s.key].i = i;
    var el = $(s.id);
    el.querySelectorAll('.stage img').forEach(function (img, j) { img.classList.toggle('on', j === i); img.alt = j === i ? s.name + ': ' + s.slides[j][1] : ''; });
    el.querySelectorAll('[data-dot]').forEach(function (d, j) { d.setAttribute('aria-current', String(j === i)); });
    el.querySelector('[data-cap]').textContent = s.slides[i][1];
    el.querySelector('[data-cnt]').textContent = (i + 1) + ' / ' + n;
  }
  function paintPlay(s) {
    var b = $(s.id).querySelector('[data-act="play"]'), on = showState[s.key].playing;
    b.innerHTML = on ? ICON.pause : ICON.play; b.setAttribute('aria-label', on ? 'Пауза слайд-шоу' : 'Запустить слайд-шоу');
  }
  function paintMusic() {
    var cur = window.KZMusic.playing();
    SHOWS.forEach(function (s) {
      var b = $(s.id).querySelector('[data-act="music"]'), on = cur === s.song;
      b.setAttribute('aria-pressed', String(on));
      b.innerHTML = (on ? ICON.speaker : ICON.note) + '<span>' + (on ? 'Выключить музыку' : 'Включить музыку') + '</span>';
    });
  }
  function toggleMusic(s) {
    if (window.KZMusic.playing() === s.song) window.KZMusic.stop();
    else if (window.KZMusic.start(s.song)) { showState[s.key].playing = true; paintPlay(s); }
    paintMusic();
  }

  /* ---------- Hall cards + detail ---------- */
  var sel = { hall: 'gb', layout: 0, photo: 0 };
  function renderCards() {
    $('hallCards').innerHTML = HALLS.map(function (h) {
      return '<button type="button" class="hall-card" data-hall="' + h.id + '" aria-pressed="' + (h.id === sel.hall) + '"><img src="' + IMG + h.photos[0] + '" alt="" loading="lazy"><span><b>' + esc(h.name) + '</b><small>' + h.area + ' м² · до ' + h.cap + ' гостей</small></span></button>';
    }).join('');
  }
  function renderDetail() {
    var h = HALLS.filter(function (x) { return x.id === sel.hall; })[0];
    var li = Math.min(sel.layout, Math.max(h.layouts.length - 1, 0)), pi = Math.min(sel.photo, h.photos.length - 1);
    var tour = TOURS[h.id] ? '<a class="btn btn-line-dark" href="' + TOURS[h.id] + '" target="_blank" rel="noopener">3D-тур: ' + esc(h.name) + '</a>' : '';
    var lay = h.layouts[li];
    $('hallDetail').innerHTML =
      '<div class="detail-top"><div class="detail-media"><div class="main"><img src="' + IMG + h.photos[pi] + '" alt="Зал ' + esc(h.name) + '"></div>' +
      (h.photos.length > 1 ? '<div class="thumbs">' + h.photos.map(function (p, i) { return '<button type="button" data-photo="' + i + '" aria-label="Фото ' + (i + 1) + '" aria-current="' + (i === pi) + '"><img src="' + IMG + p + '" alt="" loading="lazy"></button>'; }).join('') + '</div>' : '') +
      '</div><div class="detail-info"><div class="stack" style="gap:6px"><p class="eyebrow">' + esc(h.ru) + '</p><h3>' + esc(h.name) + '</h3></div>' +
      '<p style="font-size:16px;line-height:1.65;color:var(--ink2)">' + esc(h.desc) + '</p>' +
      '<div class="stats3">' + h.stats.map(function (s) { return '<div><b>' + esc(s[0]) + '</b><span>' + esc(s[1]) + '</span></div>'; }).join('') + '</div>' +
      (h.tech.length ? '<div class="stack" style="gap:12px"><h4 style="font-size:14px;font-weight:600">Техническое оснащение</h4><ul class="tech">' + h.tech.map(function (t) { return '<li><i>' + ICON[t] + '</i><span>' + TECH[t] + '</span></li>'; }).join('') + '</ul></div>' : '') +
      '<div class="row" style="gap:10px;margin-top:auto"><a class="btn btn-dark" href="prices.html">Рассчитать стоимость</a><a class="btn btn-line-dark" href="#contacts">Запросить дату</a>' + tour + '</div></div></div>' +
      '<div class="detail-bottom"><div><div class="row" style="justify-content:space-between;align-items:baseline;gap:12px"><h4 class="serif" style="font-size:26px">План зала</h4><span style="font-size:14px;color:var(--muted)">' + esc(h.dims) + '</span></div>' +
      (h.plan ? '<div class="plan-box"><img src="' + IMG + h.plan + '" alt="План зала ' + esc(h.name) + ' с размерами" loading="lazy"></div>' : '<div class="plan-empty">План переговорной предоставим по запросу</div>') +
      '</div><div><h4 class="serif" style="font-size:26px">Рассадка и вместимость</h4>' +
      (h.layouts.length ? '<div class="chips" role="group" aria-label="Варианты рассадки">' + h.layouts.map(function (l, i) {
        return '<button type="button" class="chip" data-layout="' + i + '" aria-pressed="' + (i === li) + '"><b>' + esc(l[0]) + '</b><small>' + (typeof l[1] === 'number' ? 'до ' + l[1] : l[1]) + ' чел.</small></button>';
      }).join('') + '</div><div class="plan-box"><img src="' + IMG + lay[2] + '" alt="Схема рассадки: ' + esc(lay[0]) + '" loading="lazy"></div>' : '<div class="plan-empty">Общий переговорный стол, до 12 участников</div>') +
      '</div></div>';
  }
  function renderCompare() {
    var f = function (v) { return v == null ? '—' : v; };
    $('compareBody').innerHTML = HALLS.map(function (h) {
      return '<tr><th scope="row">' + esc(h.name) + '</th><td style="color:var(--ink2)">' + h.area + ' м²</td>' + h.m.map(function (v) { return '<td>' + f(v) + '</td>'; }).join('') + '</tr>';
    }).join('');
  }

  /* ---------- Intro ---------- */
  function initIntro() {
    var el = $('intro'); if (!el) return;
    var seen = false; try { seen = sessionStorage.getItem('kzIntroSeen') === '1'; } catch (e) {}
    if (seen) { el.remove(); return; }
    var imgs = el.querySelectorAll('img'), lates = el.querySelectorAll('.late'), prog = el.querySelector('.prog'), cap = el.querySelector('.cap');
    var st = reduced ? 5 : 0, timer;
    function paint() {
      var act = st >= 1 ? Math.min(st - 1, imgs.length - 1) : -1;
      imgs.forEach(function (im, i) { im.classList.toggle('on', i === act); });
      lates.forEach(function (l) { l.classList.toggle('on', st >= +l.dataset.at); });
      cap.classList.toggle('on', st >= 1);
      prog.style.width = Math.min(st / 6, 1) * 100 + '%';
    }
    function close() {
      clearInterval(timer);
      try { sessionStorage.setItem('kzIntroSeen', '1'); } catch (e) {}
      el.classList.add('closing'); document.body.style.overflow = '';
      setTimeout(function () { el.remove(); }, 950);
    }
    document.body.style.overflow = 'hidden';
    el.querySelectorAll('[data-close]').forEach(function (b) { b.addEventListener('click', close); });
    document.addEventListener('keydown', function onKey(e) { if (e.key === 'Escape' && document.body.contains(el)) { close(); document.removeEventListener('keydown', onKey); } });
    paint();
    timer = setInterval(function () { if (st >= 6) { close(); return; } st++; paint(); }, 2000);
  }

  document.addEventListener('DOMContentLoaded', function () {
    initIntro();
    renderShows();
    renderCards(); renderDetail(); renderCompare();
    $('hallCards').addEventListener('click', function (e) {
      var b = e.target.closest('[data-hall]'); if (!b) return;
      sel = { hall: b.dataset.hall, layout: 0, photo: 0 }; renderCards(); renderDetail();
      if (window.innerWidth < 900) $('hall').scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
    });
    $('hallDetail').addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      if (b.dataset.photo != null) { sel.photo = +b.dataset.photo; renderDetail(); }
      if (b.dataset.layout != null) { sel.layout = +b.dataset.layout; renderDetail(); }
    });
    $('year').textContent = new Date().getFullYear();
  });
})();
