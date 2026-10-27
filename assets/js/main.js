/* =========================================================
   Paseíto con Dani · lógica del sitio
   ========================================================= */
(function () {
  "use strict";
  const C = window.PCD_CONFIG || {};
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));
  const MESES = ["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];
  const fecha = (iso) => { const [y,m,d] = iso.split("-").map(Number); return new Date(y, m - 1, d); };
  const esc = (t) => String(t ?? "").replace(/[&<>"']/g, c => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[c]));

  /* ---------- Navegación móvil ---------- */
  const toggle = $(".nav__toggle"), menu = $("#menu");
  toggle?.addEventListener("click", () => { const o = menu.classList.toggle("open"); toggle.setAttribute("aria-expanded", o); });
  $$("#menu a").forEach(a => a.addEventListener("click", () => { menu.classList.remove("open"); toggle.setAttribute("aria-expanded", false); }));

  /* ---------- Fondos ilustrados: mapa de Venezuela con rutas y pines ---------- */
  const REGIONES = {
    pais:    { vb: [-20, -20, 1420, 1240], ruta: ["maracaibo","merida","barquisimeto","calabozo","caracas","cumana","margarita","tucupita","canaima","roraima"] },
    llanos:  { vb: [300, 180, 720, 460],   ruta: ["barquisimeto","calabozo","apure","ayacucho"], ruta2: ["chuao","caracas","calabozo"] },
    andes:   { vb: [60, 60, 560, 480],     ruta: ["maracaibo","coro","barquisimeto","trujillo","merida"] },
    guayana: { vb: [520, 380, 900, 820],   ruta: ["calabozo","apure","ayacucho","canaima","roraima"], ruta2: ["tucupita","canaima"] },
    costa:   { vb: [300, 60, 960, 380],    ruta: ["coro","chuao","caracas","cumana","margarita"] }
  };
  const PIN = "M0-18c-6 0-10 4.5-10 10 0 7.5 10 18 10 18s10-10.5 10-18c0-5.5-4-10-10-10zm0 13.5a3.6 3.6 0 1 1 0-7.2 3.6 3.6 0 0 1 0 7.2z";
  function mapa(region) {
    const M = window.PCD_MAP; if (!M) return "";
    const R = REGIONES[region] || REGIONES.pais; const [x, y, w, h] = R.vb;
    const curva = (keys) => {
      const p = keys.map(k => M.cities[k]).filter(Boolean); if (p.length < 2) return "";
      let d = `M${p[0][0]} ${p[0][1]}`;
      for (let i = 1; i < p.length; i++) { const [ax, ay] = p[i-1], [bx, by] = p[i]; const mx = (ax+bx)/2, my = (ay+by)/2 - Math.abs(bx-ax)*0.18; d += ` Q${mx} ${my} ${bx} ${by}`; }
      return `<path d="${d}" fill="none" stroke="currentColor" stroke-width="2.2" stroke-dasharray="9 8" vector-effect="non-scaling-stroke" stroke-linecap="round"/>`;
    };
    const pins = [...new Set([...(R.ruta||[]), ...(R.ruta2||[])])].map(k => { const c = M.cities[k]; const s = w / 1100; return c ? `<path d="${PIN}" transform="translate(${c[0]} ${c[1]}) scale(${s})" fill="currentColor"/>` : ""; }).join("");
    return `<svg viewBox="${x} ${y} ${w} ${h}" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <g fill="none" stroke="currentColor" stroke-linejoin="round" vector-effect="non-scaling-stroke">
        ${M.states.map(d => `<path d="${d}" stroke-width=".9" vector-effect="non-scaling-stroke" opacity=".85"/>`).join("")}
        <path d="${M.country}" stroke-width="1.4" vector-effect="non-scaling-stroke"/>
      </g>${curva(R.ruta||[])}${curva(R.ruta2||[])}${pins}</svg>`;
  }
  $$(".map-bg[data-region]").forEach(el => el.innerHTML = mapa(el.dataset.region));

  /* ---------- Íconos en línea fina: mariposa y colibrí ---------- */
  const DECO = {
    mariposa: `<svg viewBox="0 0 160 110" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M4 100c18-4 26-22 44-18s14 20 30 6" stroke-dasharray="3 6" opacity=".7"/><g transform="translate(70 4) rotate(12)"><path d="M40 28v44"/><path d="M40 34C28 12 0 10 0 30c0 14 22 20 40 12"/><path d="M40 34C52 12 80 10 80 30c0 14-22 20-40 12"/><path d="M40 46C26 48 10 58 16 72c5 10 20 2 24-14"/><path d="M40 46C54 48 70 58 64 72c-5 10-20 2-24-14"/><path d="M40 28c-2-8-6-13-11-15M40 28c2-8 6-13 11-15"/><circle cx="28" cy="13" r="1.4"/><circle cx="52" cy="13" r="1.4"/><path d="M12 28c6-8 16-8 22 4M68 28c-6-8-16-8-22 4" opacity=".6"/></g></svg>`,
    colibri: `<svg viewBox="0 0 170 100" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M166 90c-16 2-22-14-36-10s-14 14-26 8" stroke-dasharray="3 6" opacity=".7"/><g transform="translate(0 2)"><path d="M6 40l30 6"/><path d="M36 46c2-8 10-12 17-9 6 3 9 9 16 12 10 4 20 3 26 10"/><path d="M36 46c3 7 12 12 22 12 9 0 15 4 21 9l16 14"/><path d="M79 67l22 6M95 59l18 2"/><circle cx="44" cy="44" r="1.4" fill="currentColor"/><path d="M58 42c4-14 16-28 36-36-6 14-12 26-28 39"/><path d="M62 44c8-6 20-10 34-10-8 6-16 12-30 14" opacity=".6"/></g></svg>`
  };
  $$("[data-deco]").forEach(el => { el.innerHTML = DECO[el.dataset.deco] || ""; el.setAttribute("aria-hidden", "true"); });
  const PICT = { dani: "assets/img/pictograma-dani-carbon.png", compa: "assets/img/pictograma-compa-carbon.png", mantra: "assets/img/pictograma-mantra-carbon.png" };
  $$("[data-pict]").forEach(el => { el.style.setProperty("--img", `url("${new URL(PICT[el.dataset.pict], document.baseURI).href}")`); el.setAttribute("aria-hidden", "true"); });
  // Fondo de la tienda: pasaporte y franela en líneas finas
  const tiendaFondo = $("[data-deco-fondo='tienda']");
  if (tiendaFondo) tiendaFondo.innerHTML = `<svg viewBox="0 0 1200 700" preserveAspectRatio="xMidYMid slice" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round">
    <g transform="translate(930 90) rotate(8)"><rect x="0" y="0" width="200" height="280" rx="14"/><circle cx="100" cy="110" r="46"/><path d="M54 110h92M100 64c-20 26-20 66 0 92M100 64c20 26 20 66 0 92M62 88c24 8 52 8 76 0M62 132c24-8 52-8 76 0"/><path d="M50 210h100M70 236h60"/></g>
    <g transform="translate(40 430) rotate(-6)"><path d="M70 0l40 18c14 10 46 10 60 0l40-18 60 40-30 52-30-14v170H40V78L10 92l-30-52z"/><path d="M110 18c10 22 50 22 60 0"/></g>
    <g transform="translate(1000 520) rotate(-12)"><rect x="0" y="0" width="120" height="120" rx="60"/><path d="M60 22v76M22 60h76" opacity=".5"/></g></svg>`;

  /* ---------- Huellitas de Mantra que "caminan" ---------- */
  const PATITA = `<g><ellipse cx="0" cy="5" rx="7.5" ry="6.2"/><ellipse cx="-8" cy="-4.5" rx="2.9" ry="3.8" transform="rotate(-20 -8 -4.5)"/><ellipse cx="-3" cy="-9.5" rx="2.9" ry="3.8" transform="rotate(-6 -3 -9.5)"/><ellipse cx="3" cy="-9.5" rx="2.9" ry="3.8" transform="rotate(6 3 -9.5)"/><ellipse cx="8" cy="-4.5" rx="2.9" ry="3.8" transform="rotate(20 8 -4.5)"/></g>`;
  const RUTAS_HUELLAS = { ola: [[-20,120],[300,20],[700,190],[1220,60]], subida: [[1220,150],[900,140],[600,20],[-20,60]] };
  $$("[data-huellas]").forEach(el => {
    const [p0,p1,p2,p3] = RUTAS_HUELLAS[el.dataset.huellas] || RUTAS_HUELLAS.ola;
    const B = (t, i) => (1-t)**3*p0[i] + 3*(1-t)**2*t*p1[i] + 3*(1-t)*t**2*p2[i] + t**3*p3[i];
    const n = 16; let g = "";
    for (let k = 0; k < n; k++) {
      const t = (k + .5) / n, x = B(t,0), y = B(t,1), dx = B(t+.01,0) - x, dy = B(t+.01,1) - y;
      const ang = Math.atan2(dy, dx), lado = k % 2 ? 1 : -1, off = 11 * lado;
      const px = x - Math.sin(ang) * off, py = y + Math.cos(ang) * off;
      g += `<g class="pisada" style="--i:${k}" transform="translate(${px.toFixed(1)} ${py.toFixed(1)}) rotate(${(ang*180/Math.PI + 90).toFixed(1)}) scale(1.15)">${PATITA}</g>`;
    }
    el.innerHTML = `<svg viewBox="0 0 1200 210" fill="currentColor">${g}</svg>`;
  });

  /* ---------- SVG en línea (logo El Reseteo) ---------- */
  $$("[data-svg]").forEach(el => fetch(el.dataset.svg).then(r => r.text()).then(t => el.innerHTML = t).catch(() => { el.innerHTML = `<img src="${el.dataset.svg}" alt="El Reseteo">`; }));

  /* ---------- Cuenta regresiva YouTube ---------- */
  const yt = C.youtube || {};
  $$("[data-yt-link]").forEach(a => a.href = yt.canal || a.href);
  const estreno = yt.estreno ? new Date(yt.estreno) : null;
  const cd = $("[data-countdown]");
  function tick() {
    if (!estreno || !cd) return;
    let ms = estreno - new Date();
    if (ms <= 0) {
      cd.hidden = true; $("[data-yt-titulo]").textContent = "¡Ya estamos al aire!";
      if (yt.videoId) { const v = $("[data-yt-video]"); v.hidden = false; v.innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${esc(yt.videoId)}" title="Paseíto con Dani en YouTube" allow="accelerometer; encrypted-media; picture-in-picture" allowfullscreen loading="lazy"></iframe>`; }
      clearInterval(timer); return;
    }
    const d = Math.floor(ms / 864e5); ms -= d * 864e5; const h = Math.floor(ms / 36e5); ms -= h * 36e5; const m = Math.floor(ms / 6e4); const s = Math.floor((ms - m * 6e4) / 1e3);
    $("[data-d]").textContent = String(d).padStart(2, "0"); $("[data-h]").textContent = String(h).padStart(2, "0");
    $("[data-m]").textContent = String(m).padStart(2, "0"); $("[data-s]").textContent = String(s).padStart(2, "0");
  }
  if (estreno) { const f = estreno; $("[data-yt-titulo]").textContent = `El primer capítulo se estrena el ${f.getDate()} de ${MESES[f.getMonth()]}`; }
  const timer = setInterval(tick, 1000); tick();

  /* ---------- Envío de formularios a Google Apps Script ---------- */
  async function enviar(form, tipo, extra = {}) {
    const estado = $("[data-estado]", form); const btn = $("button[type=submit]", form);
    if (!form.checkValidity()) { form.reportValidity(); return false; }
    const datos = Object.fromEntries(new FormData(form)); Object.assign(datos, extra, { tipo, enviado: new Date().toISOString() });
    const url = (C.endpoints || {})[tipo];
    btn.disabled = true;
    try {
      if (url) {
        // Apps Script: se envía como texto plano para evitar el bloqueo CORS de la petición previa.
        await fetch(url, { method: "POST", mode: "no-cors", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify(datos) });
        estado.innerHTML = `<div class="aviso">¡Listo! Recibimos tus datos y te escribiremos muy pronto. 🌿</div>`;
      } else {
        console.info("[Modo demostración] Datos que se enviarían:", datos);
        estado.innerHTML = `<div class="aviso">Modo demostración: el formulario funciona, pero aún no está conectado a Google Sheets.</div>`;
      }
      form.reset(); return true;
    } catch (e) {
      estado.innerHTML = `<div class="aviso aviso--error">No pudimos enviar tus datos. Inténtalo de nuevo o escríbenos a ${esc((C.contacto||{}).correo)}.</div>`; return false;
    } finally { btn.disabled = false; }
  }
  const fAliados = $("[data-form='aliados']");
  fAliados?.addEventListener("submit", e => { e.preventDefault(); enviar(fAliados, "aliados"); });

  /* ---------- Calendario de experiencias ---------- */
  const EXP = (C.experiencias || []).slice().sort((a, b) => (a.fecha || "9999").localeCompare(b.fecha || "9999"));
  const hoy = new Date(); hoy.setHours(0, 0, 0, 0);
  const proxima = EXP.find(e => e.fecha && fecha(e.fecha) >= hoy);
  let vista = proxima ? fecha(proxima.fecha) : new Date(hoy); vista.setDate(1);
  const nombreDestino = e => e.revelado ? e.destino : "Destino por revelar";
  function pintarCalendario() {
    const grid = $("[data-cal-grid]"); if (!grid) return;
    $("[data-cal-titulo]").textContent = `${MESES[vista.getMonth()]} ${vista.getFullYear()}`;
    const dows = ["L","M","M","J","V","S","D"].map(d => `<div class="cal__dow">${d}</div>`).join("");
    const primero = new Date(vista); const offset = (primero.getDay() + 6) % 7;
    const inicio = new Date(primero); inicio.setDate(1 - offset);
    let celdas = "";
    for (let i = 0; i < 42; i++) {
      const d = new Date(inicio); d.setDate(inicio.getDate() + i);
      const iso = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
      const ev = EXP.find(e => e.fecha === iso && e.revelado);
      const fuera = d.getMonth() !== vista.getMonth(); const esHoy = d.getTime() === hoy.getTime();
      if (ev && !fuera) celdas += `<button class="cal__dia cal__dia--evento ${ev.revelado ? "" : "cal__dia--intriga"}" data-ev="${ev.id}" aria-label="${esc(ev.titulo)}, ${d.getDate()} de ${MESES[d.getMonth()]}">${d.getDate()}</button>`;
      else celdas += `<div class="cal__dia ${fuera ? "cal__dia--fuera" : ""} ${esHoy ? "cal__dia--hoy" : ""}">${d.getDate()}</div>`;
    }
    grid.innerHTML = dows + celdas;
    $$("[data-ev]", grid).forEach(b => b.addEventListener("click", () => abrirEvento(b.dataset.ev)));
  }
  function pintarAgenda() {
    const ag = $("[data-agenda]"); if (!ag) return;
    ag.innerHTML = EXP.filter(e => !e.fecha || fecha(e.fecha) >= hoy).map(e => {
      const f = e.fecha && e.revelado ? fecha(e.fecha) : null; const abierto = e.estado === "abierto" || e.estado === "lista";
      return `<article class="evento ${e.revelado ? "" : "evento--intriga"}">
        <div class="evento__fecha">${f ? `${f.getDate()}<small>${MESES[f.getMonth()].slice(0,3)} ${f.getFullYear()}</small>` : `?<small>Pronto</small>`}</div>
        <h4>${esc(e.titulo)}</h4>
        <span class="bitacora">${f ? esc(nombreDestino(e)) : "Fecha y destino por revelar"}</span>
        ${abierto ? `<button class="btn btn--primario" data-reservar="${e.id}">${e.estado === "lista" ? "Quiero enterarme primero" : "Reservar mi lugar"}</button>` : `<span class="tag ${e.estado === "agotado" ? "tag--linea" : "tag--orquidea"}">${e.estado === "agotado" ? "Cupos agotados" : "Muy pronto"}</span>`}
      </article>`;
    }).join("") || `<p>Muy pronto anunciaremos nuevas fechas.</p>`;
    $$("[data-reservar]", ag).forEach(b => b.addEventListener("click", () => abrirEvento(b.dataset.reservar)));
  }
  $("[data-cal-prev]")?.addEventListener("click", () => { vista.setMonth(vista.getMonth() - 1); pintarCalendario(); });
  $("[data-cal-next]")?.addEventListener("click", () => { vista.setMonth(vista.getMonth() + 1); pintarCalendario(); });
  pintarCalendario(); pintarAgenda();

  const modal = $("[data-modal]"); const fReg = $("[data-form='registro']");
  function abrirEvento(id) {
    const e = EXP.find(x => x.id === id); if (!e) return; const f = e.fecha && e.revelado ? fecha(e.fecha) : null;
    $("[data-modal-fecha]").textContent = f ? `${f.getDate()} de ${MESES[f.getMonth()]} ${f.getFullYear()} · ${nombreDestino(e)}` : "Fecha y destino por revelar";
    $("[data-modal-titulo]").textContent = e.titulo; $("[data-modal-desc]").textContent = e.descripcion || "";
    fReg.experiencia.value = `${e.titulo} (${e.fecha})`; $("[data-estado]", fReg).innerHTML = "";
    const abierto = e.estado === "abierto" || e.estado === "lista"; fReg.hidden = !abierto;
    $("button[type=submit]", fReg).textContent = e.estado === "lista" ? "Avísenme primero" : "Reservar mi lugar";
    $(".bitacora", fReg).textContent = e.estado === "lista" ? "Te avisaremos antes que a nadie cuando revelemos la fecha y el destino." : "Este registro es una pre-reserva. Te contactaremos para confirmar tu cupo y el pago.";
    if (!abierto) $("[data-modal-desc]").textContent += " El registro abre muy pronto: síguenos en redes para enterarte primero.";
    modal.classList.add("open"); modal.setAttribute("aria-hidden", "false"); (abierto ? $("#r-nombre") : $("[data-cerrar-modal]", modal)).focus();
  }
  const cerrarModal = () => { modal.classList.remove("open"); modal.setAttribute("aria-hidden", "true"); };
  $$("[data-cerrar-modal]").forEach(b => b.addEventListener("click", cerrarModal));
  fReg?.addEventListener("submit", e => { e.preventDefault(); enviar(fReg, "registro"); });

  /* ---------- Tienda y carrito ---------- */
  const PROD = C.productos || []; const P = C.pagos || {};
  const cats = ["Todo", ...new Set(PROD.map(p => p.categoria))];
  let filtro = "Todo";
  const usd = n => `$${Number(n).toLocaleString("es-VE", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
  function pintarFiltros() {
    $("[data-filtros]").innerHTML = cats.map(c => `<button class="filtro" aria-pressed="${c === filtro}" data-cat="${esc(c)}">${esc(c)}</button>`).join("");
    $$("[data-cat]").forEach(b => b.addEventListener("click", () => { filtro = b.dataset.cat; pintarFiltros(); pintarProductos(); }));
  }
  function pintarProductos() {
    $("[data-productos]").innerHTML = PROD.filter(p => filtro === "Todo" || p.categoria === filtro).map(p => `
      <article class="producto">
        <div class="producto__img">${p.imagen ? `<img src="${esc(p.imagen)}" alt="" loading="lazy">` : `<img class="pict" src="${esc(p.pictograma || "assets/img/pictograma-pin-arena.png")}" alt="">`}${p.etiqueta ? `<span class="tag">${esc(p.etiqueta)}</span>` : ""}</div>
        <div class="producto__body"><span class="etiqueta" style="margin:0">${esc(p.categoria)}</span><h4>${esc(p.nombre)}</h4><p>${esc(p.descripcion)}</p>
          <div class="producto__pie">${p.precioUSD != null ? `<span class="precio">${usd(p.precioUSD)}</span><button class="btn btn--primario" data-agregar="${p.id}">Agregar</button>` : `<span class="bitacora">Precio por anunciar</span><button class="btn btn--secundario" disabled>Muy pronto</button>`}</div>
        </div></article>`).join("");
    $$("[data-agregar]").forEach(b => b.addEventListener("click", () => agregar(b.dataset.agregar)));
  }
  $$("[data-filtrar]").forEach(a => a.addEventListener("click", () => { filtro = a.dataset.filtrar; pintarFiltros(); pintarProductos(); }));
  pintarFiltros(); pintarProductos();

  let carrito = []; try { carrito = JSON.parse(localStorage.getItem("pcd-carrito") || "[]"); } catch (e) {}
  const guardar = () => { try { localStorage.setItem("pcd-carrito", JSON.stringify(carrito)); } catch (e) {} pintarCarrito(); };
  const total = () => carrito.reduce((s, l) => { const p = PROD.find(x => x.id === l.id); return s + (p && p.precioUSD ? p.precioUSD * l.cant : 0); }, 0);
  function agregar(id) { const l = carrito.find(x => x.id === id); l ? l.cant++ : carrito.push({ id, cant: 1 }); guardar(); abrirCarrito(); }
  const drawer = $("[data-drawer]");
  function abrirCarrito() { drawer.classList.add("open"); drawer.setAttribute("aria-hidden", "false"); }
  const cerrarCarrito = () => { drawer.classList.remove("open"); drawer.setAttribute("aria-hidden", "true"); };
  $$("[data-abrir-carrito]").forEach(b => b.addEventListener("click", abrirCarrito));
  $$("[data-cerrar-carrito]").forEach(b => b.addEventListener("click", cerrarCarrito));
  document.addEventListener("keydown", e => { if (e.key === "Escape") { cerrarCarrito(); cerrarModal(); } });

  function montoBs(usdTotal) { if (!P.tasaEUR || !P.usdPorEur) return null; return usdTotal / P.usdPorEur * P.tasaEUR; }
  function pintarCarrito() {
    const n = carrito.reduce((s, l) => s + l.cant, 0); const badge = $("[data-badge]"); badge.hidden = !n; badge.textContent = n;
    const body = $("[data-carrito-body]"), foot = $("[data-carrito-foot]");
    if (!carrito.length) { body.innerHTML = `<p>Tu carrito está vacío. ¡La ruta te espera!</p>`; foot.innerHTML = ""; return; }
    body.innerHTML = carrito.map(l => { const p = PROD.find(x => x.id === l.id) || {}; return `<div class="linea"><strong>${esc(p.nombre)}</strong><span>${usd((p.precioUSD||0) * l.cant)}</span>
      <span class="linea__cant"><button data-menos="${l.id}" aria-label="Quitar uno">−</button>${l.cant}<button data-mas="${l.id}" aria-label="Agregar uno">+</button></span></div>`; }).join("") + `
      <form data-form="pedidos" novalidate style="margin-top:18px">
        <h4 class="subtitulo" style="font-size:16px">Método de pago</h4>
        <div class="metodos">${Object.entries(P.metodos || {}).map(([k, m], i) => `<label class="metodo"><input type="radio" name="metodo" value="${esc(m.nombre)}" data-metodo="${k}" ${i === 0 ? "checked" : ""}> <span><strong>${esc(m.nombre)}</strong></span></label>`).join("")}</div>
        <div class="datos-pago" data-datos-pago></div>
        <h4 class="subtitulo" style="font-size:16px">Datos del comprobante</h4>
        <div class="campos-2">
          <div class="campo"><label for="p-ref">N.º de referencia</label><input id="p-ref" name="referencia" required></div>
          <div class="campo"><label for="p-fecha">Fecha del pago</label><input id="p-fecha" name="fechaPago" type="date" required></div>
          <div class="campo"><label for="p-monto">Monto pagado</label><input id="p-monto" name="monto" inputmode="decimal" required></div>
          <div class="campo"><label for="p-tel">WhatsApp</label><input id="p-tel" name="telefono" type="tel" required></div>
        </div>
        <div class="campos-2"><div class="campo"><label for="p-nombre">Nombre</label><input id="p-nombre" name="nombre" required></div>
        <div class="campo"><label for="p-correo">Correo</label><input id="p-correo" name="correo" type="email" required></div></div>
        <button class="btn btn--primario" type="submit" style="width:100%">Reportar mi pago</button>
        <p class="bitacora" style="margin-top:10px">Verificamos cada pago a mano. Al confirmarlo, te llegará un correo con tu código QR.</p>
        <div data-estado></div>
      </form>`;
    const t = total(), bs = montoBs(t);
    foot.innerHTML = `<div class="total"><span>Total</span><span>${usd(t)}</span></div>${bs ? `<div class="bitacora">≈ Bs ${bs.toLocaleString("es-VE", { maximumFractionDigits: 2 })} (tasa oficial del euro, BCV)</div>` : ""}`;
    $$("[data-mas]", body).forEach(b => b.addEventListener("click", () => { carrito.find(x => x.id === b.dataset.mas).cant++; guardar(); }));
    $$("[data-menos]", body).forEach(b => b.addEventListener("click", () => { const l = carrito.find(x => x.id === b.dataset.menos); l.cant--; if (l.cant <= 0) carrito = carrito.filter(x => x !== l); guardar(); }));
    const fP = $("[data-form='pedidos']", body); const datosPago = $("[data-datos-pago]", fP);
    const mostrarDatos = () => { const k = $("input[name=metodo]:checked", fP)?.dataset.metodo; const m = (P.metodos || {})[k]; datosPago.textContent = m ? m.datos + (k === "pagomovil" && bs ? ` · Monto: Bs ${bs.toLocaleString("es-VE", { maximumFractionDigits: 2 })}` : "") : ""; };
    $$("input[name=metodo]", fP).forEach(r => r.addEventListener("change", mostrarDatos)); mostrarDatos();
    fP.addEventListener("submit", async e => { e.preventDefault();
      const items = carrito.map(l => { const p = PROD.find(x => x.id === l.id) || {}; return `${l.cant} x ${p.nombre}`; }).join("; ");
      const ok = await enviar(fP, "pedidos", { productos: items, totalUSD: total() }); if (ok) { carrito = []; try { localStorage.removeItem("pcd-carrito"); } catch (e) {} setTimeout(pintarCarrito, 2500); } });
  }
  pintarCarrito();

  /* ---------- Contacto y créditos ---------- */
  const K = C.contacto || {};
  const ico = {
    mail: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>`,
    ig: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg>`,
    tt: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M14 3v11.5a3.5 3.5 0 1 1-3.5-3.5"/><path d="M14 3c.5 2.8 2.5 4.6 5 4.8"/></svg>`,
    wa: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"><path d="M4 20l1.3-4A8 8 0 1 1 8.4 19z"/><path d="M9.2 8.6c.2-.5.6-.5.9-.5l.6 1.4c.1.3-.4.8-.6 1 .5 1 1.3 1.8 2.4 2.4.2-.2.7-.7 1-.6l1.4.6c0 .3 0 .7-.5.9-.9.5-2.4.2-3.9-1.2-1.5-1.5-1.9-3-1.3-4z" fill="currentColor" stroke="none"/></svg>`,
    yt: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="2.5" y="5.5" width="19" height="13" rx="4"/><path d="m10 9 5 3-5 3z" fill="currentColor"/></svg>`
  };
  const canales = [];
  if (K.whatsapp) { const n = K.whatsapp.replace(/\D/g, ""); canales.push(`<li><a href="https://wa.me/${n}" target="_blank" rel="noopener">${ico.wa}${esc(K.whatsapp)}</a></li>`); }
  if (K.correo) canales.push(`<li><a href="mailto:${esc(K.correo)}">${ico.mail}${esc(K.correo)}</a></li>`);
  (K.instagram || []).forEach(u => canales.push(`<li><a href="https://instagram.com/${esc(u)}" target="_blank" rel="noopener">${ico.ig}@${esc(u)}</a></li>`));
  if (K.tiktok) canales.push(`<li><a href="https://www.tiktok.com/@${esc(K.tiktok)}" target="_blank" rel="noopener">${ico.tt}@${esc(K.tiktok)}</a></li>`);
  if (K.youtube) canales.push(`<li><a href="https://www.youtube.com/@${esc(K.youtube)}" target="_blank" rel="noopener">${ico.yt}@${esc(K.youtube)}</a></li>`);
  const ul = $("[data-canales]"); if (ul) ul.innerHTML = canales.join("");
  const mk = $("[data-makhana]"); const mkUrl = (C.creditos || {}).makhanaUrl;
  if (mk) { if (mkUrl) mk.href = mkUrl; else { mk.removeAttribute("target"); mk.removeAttribute("rel"); } }
})();
