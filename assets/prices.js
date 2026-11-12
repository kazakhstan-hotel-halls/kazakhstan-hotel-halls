(function () {
  /* ===== Прайс 2026, цены без НДС. Чтобы поменять цену — исправьте число. ===== */
  var VAT = 0.16; // НДС 16% (на оборудование не начисляется)
  var HALLS = {
    gb: { name: 'Grand Ballroom', cap: [150, 800], area: '900 м²', rent: { h4: 1000000, h8: 1500000, we: 5000000 }, equip: { h4: 1000000, h8: 1500000 }, pkg: { standard: 32000, premium: 40000, min: 200 }, buffetMin: 250 },
    gp: { name: 'Grand Palace', cap: [100, 500], area: '650 м²', rent: { h4: 850000, h8: 1200000, we: 1500000 }, equip: { h4: 350000, h8: 600000 }, pkg: { standard: 20000, premium: 25000, min: 150 }, buffetMin: 100 },
    eh: { name: 'Elegant Hall', cap: [50, 220], area: '230 м² + фойе 100 м²', rent: { h4: 400000, h8: 750000, we: 750000 }, equip: { flat: 100000 }, pkg: { standard: 25000, premium: 30000, min: 50 }, buffetMin: 50 },
    ae: { name: 'Altyn Emel', cap: [30, 200], area: '170 м² + фойе 120 м²', rent: { h4: 300000, h8: 500000, we: 500000 }, equip: { flat: 50000 }, pkg: { standard: 20000, premium: 25000, min: 50 }, buffetMin: 50 },
    abai: { name: 'Abai', cap: [1, 40], area: '60 м²', rent: { h4: 200000, h8: 300000, we: 300000 } },
    ulytau: { name: 'Ulytau', cap: [1, 12], area: '30 м²', rent: { h4: 200000, h8: 300000, we: 300000 } }
  };
  var PKGS = {
    standard: { name: 'Standard full day', menu: [
      ['Конференц-зал', 'Минеральная вода без газа, канцелярские принадлежности'],
      ['Утренний кофе-брейк', 'Чай, кофе, печенье в ассортименте, канапе с сёмгой и творожным сыром, сигара-бёрек'],
      ['Обед', 'Бизнес-ланч, чай, кофе, напитки (соки, вода)'],
      ['Послеобеденный кофе-брейк', 'Ассорти печенья, мини-круассаны, даниш с вишней, фадж-кекс, канапе с ростбифом']] },
    premium: { name: 'Premium full day', menu: [
      ['Конференц-зал', 'Минеральная вода без газа, канцелярские принадлежности'],
      ['Приветственный кофе-брейк', 'Чай, фильтр-кофе, молоко, мёд, лимон, ассорти печенья'],
      ['Утренний кофе-брейк', 'Ассорти печенья, мини-круассаны, даниш с вишней, фадж-кекс, канапе с сёмгой, сигара-бёрек, самса с говядиной'],
      ['Обед', 'Шведский стол, чай, кофе, напитки (соки, вода)'],
      ['Послеобеденный кофе-брейк', 'Соки, минеральная вода, печенье, фадж-кекс, мини-шоты с шоколадным муссом, макаруны, мраморный кекс, ананас на шпажках, канапе с лососем, пачанга-бёрек']] }
  };
  var MENU = [
    { g: 'Кофе-брейки', items: [
      { id: 'cb1', name: 'Кофе-брейк № 1', price: 3600, per: 'guest', max: 4, desc: 'Чай, молоко, мёд, лимон, фильтр-кофе. Печенье: кофейное, курабье, безе с арахисом.' },
      { id: 'cb2', name: 'Кофе-брейк № 2', price: 5500, per: 'guest', max: 4, desc: 'Чай, кофе. Печенье, мини-круассан, шоколадные маффины, круассан с ветчиной из индейки, канапе с сёмгой.' },
      { id: 'cbh', name: '«Здоровый» кофе-брейк', price: 7500, per: 'guest', max: 4, desc: 'Чай, кофе, соки, вода. Гранола с йогуртом, чиа-пудинг с манго, фрукты, сухофрукты, сэндвичи с авокадо.' },
      { id: 'cb3', name: 'Кофе-брейк № 3', price: 8800, per: 'guest', max: 4, desc: 'Чай, кофе, соки, вода. Печенье, маффин, улитка с корицей, тарталетка, круассан с лососем, самса, сигара-бёрек, брускетта с икрой.' },
      { id: 'cb4', name: 'Кофе-брейк № 4', price: 13000, per: 'guest', max: 4, desc: 'Морковный торт, чизкейк, брауни, сконы, тарталетки, мини-круассаны, канапе с креветками, ростбиф, фрукты.' },
      { id: 'cb5', name: 'Кофе-брейк № 5', price: 18000, per: 'guest', max: 4, desc: 'Медовик, малиновый чизкейк, тирамису, профитроли, тарталетки, брускетта с лососем, волованы с икрой, мини-шашлычки из баранины.' }] },
    { g: 'Обед и ужин', items: [
      { id: 'lunch', name: 'Обед (комплексный)', price: 12000, per: 'guest', max: 1, desc: 'Суп, салат, горячее, десерт, чай, кофе, соки — 7 вариантов меню.' },
      { id: 'dinner', name: 'Ужин (комплексный)', price: 15000, per: 'guest', max: 1, desc: 'Суп, салат, горячее, десерт, чай, кофе, соки — 7 вариантов меню.' },
      { id: 'buf1', name: 'Шведский стол № 1', price: 28000, per: 'guest', max: 1, buffet: true, desc: 'Салат-бар, казы, жая, форель, манты, крылышки баффало, десерты, соки.' },
      { id: 'buf2', name: 'Шведский стол № 2', price: 32000, per: 'guest', max: 1, buffet: true, desc: 'Мясные и рыбные деликатесы, сыры, говяжья вырезка, куриный рулет, сёмга, феттучини, десерты, 4 вида соков.' }] },
    { g: 'Банкет', items: [
      { id: 'ban1', name: 'Банкетное меню № 1', price: 50000, per: 'guest', max: 1, desc: 'Салаты, казахские деликатесы, копчёная рыба, бешбармак или медальоны, сибас гриль, десерты, напитки.' },
      { id: 'ban2', name: 'Банкетное меню № 2', price: 65000, per: 'guest', max: 1, desc: 'Салаты, деликатесы, красная икра, говяжьи рёбрышки или бешбармак из конины, стейк из лосося, макаруны.' },
      { id: 'ban3', name: 'Банкетное меню № 3', price: 90000, per: 'guest', max: 1, desc: 'Салаты, белуга, икра, сырная тарелка, конфи из утки, бешбармак, чёрная треска терияки, индивидуальный десерт.' }] },
    { g: 'Фуршет и аперитив', items: [
      { id: 'canape', name: 'Канапе', price: 2000, per: 'piece', step: 10, min: 30, desc: 'Цена за штуку, минимальный заказ — 30 шт.' },
      { id: 'hot', name: 'Горячие закуски', price: 2500, per: 'piece', step: 10, desc: 'Спринг-роллы, фалафель, темпура из креветок, самса, мини-бургеры. Цена за штуку.' },
      { id: 'ap_fruit', name: 'Фруктовое ассорти', price: 10000, per: 'plate', desc: 'За тарелку.' },
      { id: 'ap_nuts', name: 'Орехи и сухофрукты', price: 10000, per: 'plate', desc: 'За тарелку.' },
      { id: 'ap_olives', name: 'Оливки и маслины', price: 10000, per: 'plate', desc: 'За тарелку.' },
      { id: 'ap_berry', name: 'Ягодное ассорти', price: 30000, per: 'plate', desc: 'За тарелку.' },
      { id: 'ap_cheese', name: 'Сырная тарелка', price: 15000, per: 'plate', desc: 'С сухофруктами и виноградом, за тарелку.' }] },
    { g: 'Станции (на 50 гостей)', items: [
      { id: 'st_trad', name: 'Бар традиционной кухни', price: 250000, per: 'station', desc: 'Баурсаки, самса, курт, джент, иримшик, чак-чак.' },
      { id: 'st_anti', name: 'Антипасто', price: 400000, per: 'station', desc: 'Моцарелла, проволоне, перец гриль, оливки, артишоки.' },
      { id: 'st_kz', name: '«Казахстан» — эксклюзивный бар', price: 850000, per: 'station', desc: 'Устрицы — 100 шт., чёрная икра — 0,5 кг.' },
      { id: 'st_sea', name: 'Станция морепродуктов', price: 1500000, per: 'station', desc: 'Креветки, клешни краба, устрицы, мидии на льду, трио соусов.' }] },
    { g: 'Напитки', items: [
      { id: 'alc', name: 'Алкоголь, безлимит', price: 12000, per: 'guest', max: 1, from: true, desc: 'От 12 000 ₸ за гостя: вино Cielo e Terra, пиво Efes, соки, кола, вода. Другие пакеты — по запросу.' }] }
  ];
  var MANAGERS = [
    ['Арайлым', '+7 702 122 10 87', '77021221087', 'arai@grandballroom.kz'],
    ['Аида', '+7 702 478 21 82', '77024782182', 'aida@grandballroom.kz'],
    ['Адема', '+7 747 742 27 44', '77477422744', 'ademi@grandballroom.kz']
  ];
  /* ============================================================================ */

  var UNIT = { piece: 'шт.', plate: 'тар.', station: 'ст.' };
  var PER = { guest: ' / гость', piece: ' / шт.', plate: ' / тарелка', station: ' / станция' };
  var $ = function (id) { return document.getElementById(id); };
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var fmt = function (n) { return Math.round(n).toLocaleString('ru-RU').replace(/[  ]/g, ' ') + ' ₸'; };
  var capStr = function (h) { return h.cap[0] > 1 ? h.cap[0] + '–' + h.cap[1] : 'до ' + h.cap[1]; };
  var MENU_BY_ID = {}; MENU.forEach(function (g) { g.items.forEach(function (m) { MENU_BY_ID[m.id] = m; }); });

  function initial() { return { hall: 'gb', mode: 'rent', pkg: 'standard', dur: 'h8', weekend: false, equip: true, guests: 250, items: {} }; }
  var S = initial();

  /* static tables */
  function renderStatic() {
    $('rentBody').innerHTML = Object.keys(HALLS).map(function (k) {
      var x = HALLS[k];
      var eq = !x.equip ? '—' : x.equip.flat != null ? fmt(x.equip.flat) : fmt(x.equip.h4) + ' / 4 ч · ' + fmt(x.equip.h8) + ' / 8 ч';
      return '<tr><th scope="row">' + esc(x.name) + '</th><td style="color:var(--ink2)">' + capStr(x) + '</td><td style="color:var(--ink2)">' + esc(x.area) + '</td><td>' + fmt(x.rent.h4) + '</td><td>' + fmt(x.rent.h8) + '</td><td>' + fmt(x.rent.we) + '</td><td style="color:var(--ink2)">' + eq + '</td></tr>';
    }).join('');
    var ph = Object.keys(HALLS).filter(function (k) { return HALLS[k].pkg; }).map(function (k) { return HALLS[k]; });
    $('pkgHead').innerHTML = '<tr><th scope="col">За гостя</th>' + ph.map(function (x) { return '<th scope="col">' + esc(x.name) + '<br><span style="font-weight:400;font-size:13px;opacity:.8">от ' + x.pkg.min + ' гостей</span></th>'; }).join('') + '</tr>';
    $('pkgBody').innerHTML = ['standard', 'premium'].map(function (p) {
      return '<tr><th scope="row">' + PKGS[p].name + '</th>' + ph.map(function (x) { return '<td>' + fmt(x.pkg[p]) + '</td>'; }).join('') + '</tr>';
    }).join('');
    $('pkgCards').innerHTML = ['standard', 'premium'].map(function (p) {
      return '<div class="card" style="padding:28px;display:flex;flex-direction:column;gap:14px"><h3 class="serif" style="font-size:24px;font-weight:500">' + PKGS[p].name + '</h3>' +
        PKGS[p].menu.map(function (m) { return '<div style="border-top:1px solid #EEE5D7;padding-top:10px;display:flex;flex-direction:column;gap:2px"><span style="font-size:14px;font-weight:600">' + esc(m[0]) + '</span><span style="font-size:14px;line-height:1.5;color:var(--muted)">' + esc(m[1]) + '</span></div>'; }).join('') + '</div>';
    }).join('');
  }

  function compute() {
    var h = HALLS[S.hall], mode = h.pkg ? S.mode : 'rent', guests = Math.max(1, S.guests || 1);
    var equipPrice = !h.equip ? 0 : h.equip.flat != null ? h.equip.flat : (mode === 'pkg' || S.weekend) ? h.equip.h8 : h.equip[S.dur];
    var equipOn = !!h.equip && S.equip, lines = [];
    if (mode === 'pkg') {
      lines.push({ label: PKGS[S.pkg].name + ': ' + guests + ' × ' + fmt(h.pkg[S.pkg]), net: h.pkg[S.pkg] * guests });
      lines.push({ label: 'Аренда зала', net: 0, text: 'в пакете' });
    } else {
      lines.push(S.weekend ? { label: 'Аренда зала, пт–вс (день)', net: h.rent.we } : { label: 'Аренда зала, ' + (S.dur === 'h4' ? '4 часа' : '8 часов'), net: h.rent[S.dur] });
    }
    if (equipOn) lines.push({ label: 'Оборудование (без НДС)', net: equipPrice, noVat: true });
    Object.keys(S.items).forEach(function (id) {
      var m = MENU_BY_ID[id], q = S.items[id]; if (!m || !q) return;
      var g = m.per === 'guest';
      lines.push({ label: m.name + ': ' + (g ? guests + ' × ' + fmt(m.price) + (q > 1 ? ' × ' + q : '') : q + ' ' + UNIT[m.per] + ' × ' + fmt(m.price)), net: g ? m.price * guests * q : m.price * q });
    });
    var net = lines.reduce(function (a, l) { return a + l.net; }, 0);
    var vat = lines.reduce(function (a, l) { return a + (l.noVat ? 0 : l.net); }, 0) * VAT;
    var hasFood = Object.keys(S.items).some(function (k) { return S.items[k] > 0; });
    var summary = h.name + ' · ' + guests + ' гостей · ' + (S.weekend ? 'пт–вс' : 'будни') + ' · ' + (mode === 'pkg' ? PKGS[S.pkg].name : hasFood ? 'аренда + меню' : 'аренда зала');
    return { h: h, mode: mode, guests: guests, equipPrice: equipPrice, equipOn: equipOn, lines: lines, net: net, vat: vat, total: net + vat, summary: summary };
  }

  function opt(label, on, attrs) { return '<button type="button" class="opt" aria-pressed="' + on + '" ' + attrs + '>' + label + '</button>'; }

  function render() {
    var focusKey = document.activeElement && document.activeElement.dataset ? document.activeElement.dataset.k : null;
    var c = compute(), h = c.h;

    $('hallOpts').innerHTML = Object.keys(HALLS).map(function (k) {
      var x = HALLS[k];
      return '<button type="button" class="opt" data-k="hall-' + k + '" data-hall="' + k + '" aria-pressed="' + (k === S.hall) + '">' + esc(x.name) + '<small>' + capStr(x) + ' гостей</small></button>';
    }).join('');

    var f = '<div class="row" style="gap:24px">';
    f += '<div class="stack" style="gap:8px"><span class="field-label">День недели</span><div class="opts" role="group" aria-label="День недели">' +
      opt('Будни (пн–чт)', !S.weekend, 'data-k="we0" data-we="0"') + opt('Пт, сб, вс', S.weekend, 'data-k="we1" data-we="1"') + '</div></div>';
    if (h.pkg) f += '<div class="stack" style="gap:8px"><span class="field-label">Формат</span><div class="opts" role="group" aria-label="Формат">' +
      opt('Аренда зала', c.mode === 'rent', 'data-k="m-rent" data-mode="rent"') + opt('Конференц-пакет', c.mode === 'pkg', 'data-k="m-pkg" data-mode="pkg"') + '</div></div>';
    if (c.mode === 'pkg') f += '<div class="stack" style="gap:8px"><span class="field-label">Пакет</span><div class="opts" role="group" aria-label="Пакет">' +
      ['standard', 'premium'].map(function (p) { return opt(PKGS[p].name + ' · ' + fmt(h.pkg[p]), S.pkg === p, 'data-k="p-' + p + '" data-pkg="' + p + '"'); }).join('') + '</div></div>';
    if (c.mode === 'rent' && !S.weekend) f += '<div class="stack" style="gap:8px"><span class="field-label">Длительность</span><div class="opts" role="group" aria-label="Длительность">' +
      [['4 часа', 'h4'], ['8 часов', 'h8']].map(function (d) { return opt(d[0] + ' · ' + fmt(h.rent[d[1]]), S.dur === d[1], 'data-k="d-' + d[1] + '" data-dur="' + d[1] + '"'); }).join('') + '</div></div>';
    f += '</div>';
    if (h.equip) f += '<button type="button" class="check" data-k="equip" data-equip aria-pressed="' + c.equipOn + '"><i>' + (c.equipOn ? '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12l5 5 9-10"/></svg>' : '') + '</i><span>Техническое оборудование — <b>' + fmt(c.equipPrice) + '</b>' + (h.equip.flat == null ? (c.mode === 'pkg' || S.weekend ? ' (полный день)' : ' (' + (S.dur === 'h4' ? '4 часа' : '8 часов') + ')') : '') + ', без НДС</span></button>';
    if (c.mode === 'rent' && S.weekend) f += '<p class="note">Пятница, суббота и воскресенье — тариф за полный день: ' + fmt(h.rent.we) + '.</p>';
    $('format').innerHTML = f;

    var gi = $('guests'); if (document.activeElement !== gi) gi.value = c.guests;
    $('capText').textContent = 'Вместимость: ' + capStr(h);
    var w = '';
    if (c.guests > h.cap[1]) w = h.name + ' вмещает до ' + h.cap[1] + ' гостей — выберите зал больше.';
    else if (c.mode === 'pkg' && c.guests < h.pkg.min) w = 'Конференц-пакет в ' + h.name + ' — от ' + h.pkg.min + ' гостей.';
    else if (c.guests < h.cap[0]) w = 'Рекомендуемая вместимость зала — от ' + h.cap[0] + ' гостей.';
    $('guestWarn').hidden = !w; $('guestWarn').textContent = w;

    $('menuTitle').textContent = '4. ' + (c.mode === 'pkg' ? 'Дополнительно к пакету' : 'Питание и напитки — по желанию');
    $('menu').innerHTML = MENU.map(function (grp) {
      return '<div class="menu-group"><h4>' + esc(grp.g) + '</h4>' + grp.items.map(function (m) {
        var q = S.items[m.id] || 0, g = m.per === 'guest', warn = '';
        if (q > 0 && m.buffet && h.buffetMin && c.guests < h.buffetMin) warn = 'Шведский стол в этом зале — от ' + h.buffetMin + ' гостей.';
        var qt = q === 0 ? '—' : g ? (m.max > 1 ? q + ' ×' : 'да') : q + ' ' + UNIT[m.per];
        return '<div class="item' + (q > 0 ? ' on' : '') + '"><div class="txt"><div><span class="nm">' + esc(m.name) + '</span><span class="pr">' + (m.from ? 'от ' : '') + fmt(m.price) + PER[m.per] + '</span></div><span class="ds">' + esc(m.desc) + '</span>' + (warn ? '<span class="wr">' + warn + '</span>' : '') + '</div>' +
          '<div class="qty"><button type="button" class="icon-btn" data-k="dec-' + m.id + '" data-dec="' + m.id + '" aria-label="Убрать: ' + esc(m.name) + '">−</button><b>' + qt + '</b><button type="button" class="icon-btn" data-k="inc-' + m.id + '" data-inc="' + m.id + '" aria-label="Добавить: ' + esc(m.name) + '">+</button></div></div>';
      }).join('') + '</div>';
    }).join('');

    var body = 'Здравствуйте! Прошу подтвердить дату и стоимость.\n\n' + c.summary + '\n\n' +
      c.lines.map(function (l) { return '— ' + l.label + ': ' + (l.text || fmt(l.net)); }).join('\n') +
      '\n\nБез НДС: ' + fmt(c.net) + '\nНДС 16% (кроме оборудования): ' + fmt(c.vat) + '\nИтого с НДС: ' + fmt(c.total) + '\n\nДата: \nИмя и телефон: ';
    var subj = encodeURIComponent('Заявка: ' + h.name + ', ' + c.guests + ' гостей');
    var all = MANAGERS.map(function (m) { return m[3]; }).join(',');
    var waText = encodeURIComponent('Здравствуйте! ' + c.summary + '. Итого с НДС: ' + fmt(c.total));

    $('summary').innerHTML = '<h3>Расчёт</h3><p class="muted">' + esc(c.summary) + '</p>' +
      '<div class="lines">' + c.lines.map(function (l) { return '<div class="ln"><span>' + esc(l.label) + '</span><span>' + (l.text || fmt(l.net)) + '</span></div>'; }).join('') + '</div>' +
      '<div class="lines" style="gap:6px"><div class="ln"><span>Без НДС</span><span>' + fmt(c.net) + '</span></div><div class="ln"><span>НДС 16% (кроме оборудования)</span><span>' + fmt(c.vat) + '</span></div></div>' +
      '<div class="tot"><span>Итого с НДС</span><b>' + fmt(c.total) + '</b></div>' +
      '<span class="muted" style="font-size:13px">≈ ' + fmt(c.total / c.guests) + ' на гостя</span>' +
      '<a class="btn btn-gold" href="mailto:' + all + '?subject=' + subj + '&body=' + encodeURIComponent(body) + '">Отправить заявку</a>' +
      '<div class="lines" style="gap:8px"><span class="eyebrow" style="font-size:12px">Менеджеры по бронированию</span>' +
      MANAGERS.map(function (m) {
        return '<div class="mgr"><div class="stack" style="gap:2px;min-width:0"><span class="muted">' + m[0] + '</span><a href="tel:+' + m[2] + '" style="text-decoration:none;font-size:17px">' + m[1] + '</a><a href="mailto:' + m[3] + '?subject=' + subj + '&body=' + encodeURIComponent(body) + '" style="font-size:14px">' + m[3] + '</a></div>' +
          '<a class="wa" href="https://wa.me/' + m[2] + '?text=' + waText + '" target="_blank" rel="noopener" aria-label="Написать в WhatsApp: ' + m[0] + '">WhatsApp</a></div>';
      }).join('') + '</div>' +
      '<button type="button" class="reset" data-k="reset" data-reset>Сбросить расчёт</button>' +
      '<p class="muted" style="font-size:12px;line-height:1.5">Расчёт предварительный. Цены прайса 2026 без НДС 16%; итог — с НДС, на оборудование НДС не начисляется. Бронь и окончательную стоимость подтверждает менеджер.</p>';

    if (focusKey) { var el = document.querySelector('[data-k="' + focusKey + '"]'); if (el) el.focus(); }
  }

  function setQty(id, q) { S.items[id] = Math.max(0, q); render(); }

  document.addEventListener('DOMContentLoaded', function () {
    renderStatic(); render();
    document.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      var d = b.dataset;
      if (d.hall) { var x = HALLS[d.hall]; S.hall = d.hall; if (!x.pkg) S.mode = 'rent'; S.guests = Math.min(Math.max(S.guests, x.cap[0]), x.cap[1]); }
      else if (d.we != null) S.weekend = d.we === '1';
      else if (d.mode) S.mode = d.mode;
      else if (d.pkg) S.pkg = d.pkg;
      else if (d.dur) S.dur = d.dur;
      else if (d.equip != null) S.equip = !S.equip;
      else if (d.reset != null) S = initial();
      else if (d.inc) { var m = MENU_BY_ID[d.inc], q = S.items[m.id] || 0; return setQty(m.id, m.per === 'guest' ? Math.min(q + 1, m.max || 1) : (q === 0 && m.min ? m.min : q + (m.step || 1))); }
      else if (d.dec) { var m2 = MENU_BY_ID[d.dec], q2 = S.items[m2.id] || 0, st = m2.step || 1; return setQty(m2.id, m2.per === 'guest' ? q2 - 1 : (m2.min && q2 - st < m2.min ? 0 : q2 - st)); }
      else if (b.id === 'gInc') S.guests = Math.min(S.guests + (S.guests >= 50 ? 10 : 1), 1000);
      else if (b.id === 'gDec') S.guests = Math.max(S.guests - (S.guests > 50 ? 10 : 1), 1);
      else return;
      render();
    });
    $('guests').addEventListener('input', function (e) {
      var v = parseInt(e.target.value, 10); if (isNaN(v)) return;
      S.guests = Math.min(Math.max(v, 1), 1000); render();
    });
    $('guests').addEventListener('blur', function (e) { e.target.value = S.guests; });
  });
})();
