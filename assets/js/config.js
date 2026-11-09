/* =========================================================
   CONFIGURACIÓN DEL SITIO · Paseíto con Dani
   Todo lo que cambia con frecuencia vive aquí: fechas, enlaces,
   experiencias, catálogo y datos de pago. Edita solo este archivo.
   ========================================================= */
window.PCD_CONFIG = {

  /* --- YouTube --- */
  youtube: {
    canal: "https://www.youtube.com/@paseitocondani",
    // Fecha y hora del estreno (hora de Venezuela, UTC-4). CONFIRMAR HORA con Dani.
    estreno: "2026-11-15T19:00:00-04:00",
    // ID del video para mostrarlo incrustado (ej. el tráiler o el episodio 1). Vacío = no se muestra.
    videoId: "",
    // Isotipo oficial de YouTube (descargarlo de los recursos de marca de YouTube y guardarlo en assets/img/,
    // por ejemplo "assets/img/youtube-isotipo.png"). Vacío = no se muestra.
    isotipo: "assets/img/youtube-isotipo.svg"
  },

  /* --- Endpoints de Google Apps Script (cuenta técnica web@) ---
     Pega aquí la URL de la aplicación web publicada. Vacío = el formulario funciona en modo demostración. */
  endpoints: {
    registro: "",   // Fase 1 · registro / pre-reserva de experiencias
    aliados: "",    // Fase 1 · formulario de marcas aliadas
    pedidos: "",    // Fase 2 · carrito y reporte de pago (merch)
    pago: "",       // Reporte de pago de Experiencias 360° (una pestaña por experiencia)
    club: ""        // Lista de interesados en El Club de Aventureros
  },

  /* --- Experiencias vivenciales ---
     revelado:false muestra "Destino por revelar" (campañas de intriga).
     estado: "abierto" (acepta registros) · "pronto" (sin registro aún) · "agotado" */
  experiencias: [
    // Cada destino desaparece solo del calendario y de la tienda cuando pasa su fechaFin.
    // revelado:false = "Destino por revelar" (intriga). estado: "lista" (lista de espera) · "abierto" (a la venta) · "agotado".
    {
      id: "llanos-2026", titulo: "Los Llanos", fecha: "2026-12-11", fechaFin: "2026-12-13", destino: "Hato Las Caretas, Guárico",
      revelado: true, estado: "abierto", detalle: "Hato Las Caretas · Guárico",
      imagen: "assets/img/prox-caretas-hato.webp",
      resumen: "3 días y 2 noches en el Hato Las Caretas, todo incluido",
      descripcion: "Una inmersión total en la vida del llano, junto a Dani, Mantra y el Hato Las Caretas.",
      // Tarifas en USD por persona. En bolívares se paga a tasa BCV del día.
      tarifas: { divisas: { adulto: 685, nino: 585 }, bolivares: { adulto: 755, nino: 665 } },
      reservaPct: 30,
      info: {
        titulo: "Experiencia Llanera: Guárico, el corazón de Venezuela",
        lugar: "Hato Las Caretas",
        parrafos: [
          "El Hato Las Caretas es una posada miembro del @circuitodelaexcelencia, comprometida con ofrecer lo mejor del llano auténtico, nuestra gastronomía \"Km 0\" y la conservación de nuestra biodiversidad.",
          "Paseíto con Dani ha diseñado junto al Hato Las Caretas una inmersión total en la vida del llano, que te invita también a tu propio viaje hacia adentro y hacia nuestra identidad."
        ],
        incluye: [
          "🛻 Transporte ida y vuelta con salidas desde Caracas, Maracay y Valencia.",
          "🛌 Hospedaje de primera: 3 días y 2 noches.",
          "🎁 Kit de bienvenida con regalitos sorpresa.",
          "🫘 Snacks e hidratación caminera.",
          "🚦 Paradas emblemáticas en el camino.",
          "🛶 Navegada guiada en la represa de Calabozo, su historia y un rato de esparcimiento en el Parque Recreacional Las Playitas.",
          "⛪️ Recorrido por el casco histórico de Calabozo.",
          "🍽️ Pensión completa: refrigerio y brindis de bienvenida, desayunos, almuerzos, snacks y cenas bajo el concepto All You Can Eat, con los mejores sabores del llano.",
          "💧 Hidratación: agua y jugos naturales incluidos en todas las comidas. Momentos de brindis y degustaciones especiales.",
          "🐴 Paseos a caballo por la sabana abierta.",
          "🐄 Faena de ordeño.",
          "🧀 Elaboración artesanal de queso llanero.",
          "🍠 Elaboración de casabe, con visita a las mejores casaberas locales del país.",
          "🏺 Cultura: visita guiada al Museo Casa de la Memoria del Llano.",
          "🌿 Naturaleza: observación de aves, recorridos de interpretación ambiental y caminatas nocturnas para avistamiento de fauna.",
          "🧘🏽‍♀️ Bienestar: meditaciones guiadas en diversos momentos del recorrido, 1 clase de yoga en la sabana abierta, ejercicios de presencia y respiración y dinámicas grupales.",
          "🏊‍♀️ Relax: baños de tanquilla para refrescarse de los \"calorones\".",
          "🎣 Pesca deportiva.",
          "🛶 Paseo estelar por el río Portuguesa y el estero de Camaguán para observar araguatos, aves y nuestras emblemáticas toninas. Incluye serenata llanera y brindis especial.",
          "🐊 Santuario del Caimán del Orinoco: visita guiada al zoocriadero y contribución directa al proyecto de conservación del caimán del Orinoco.",
          "🪕 Parranda llanera: noche de música llanera en vivo y clase de baile de joropo.",
          "🔥 Fogata con intenciones de cierre, con conversas y un compartir especial.",
          "📝 Pueden traer sus bebidas espirituosas favoritas. No se cobra descorche.",
          "📸 Fotos y video profesional de la experiencia.",
          "🙋🏽‍♀️ Dani y todo un equipo guiándolos durante todo el recorrido, apoyando directamente a las comunidades locales."
        ],
        condiciones: "🎟️ Reserva con el 30% y paga en cuotas hasta completar el 100% 4 días antes de la fecha de salida. En caso de no asistir y cancelar tu reserva, solo habrá reembolso con 5 días de notificación previa a la fecha de salida.",
        galeria: ["assets/img/prox-caretas-hato.webp", "assets/img/prox-caretas-piscina.webp", "assets/img/prox-caretas-anfitriones.webp", "assets/img/prox-caretas-meditacion.webp", "assets/img/prox-caretas-ganado.webp", "assets/img/prox-caretas-cafe.webp", "assets/img/prox-caretas-chinchorro.webp", "assets/img/prox-caretas-casona-interior.webp", "assets/img/prox-caretas-atardecer.webp"]
      }
    }
  ],

  /* --- Catálogo "Paseíto contigo" ---
     ⚠️ PRECIOS DE EJEMPLO: reemplazar por los precios oficiales antes de publicar.
     precioUSD:null = "Precio por anunciar" (no se puede agregar al carrito). */
  productos: [
    { id: "club", tipo: "club", categoria: "Pasaporte", nombre: "El Club de Aventureros", etiqueta: "Muy pronto", pictograma: "assets/img/pictograma-pin-arena.png",
      parrafos: [
        "¿Estás listo para llevar tu pasión por viajar a otro nivel? Muy pronto abriremos las puertas al Club de Membresías de Paseíto con Dani, un espacio exclusivo para quienes viven la aventura con intención.",
        "Al unirte, obtendrás tu Pasaporte de Experiencias (en versión física coleccionable o digital para nuestra comunidad internacional), con el cual podrás acumular sellos en cada ruta, desbloquear beneficios con marcas aliadas, acceder a contenido privado y participar por sorpresas increíbles, ¡incluyendo la oportunidad de viajar junto a nosotros!",
        "Déjanos tus datos para avisarte en cuanto activemos las inscripciones y seamos los primeros en abordar esta nueva travesía."
      ] },
    { id: "franela", categoria: "Merch", nombre: "Franela oficial", descripcion: "Algodón, con el logo de Paseíto con Dani.", precioUSD: null, pictograma: "assets/img/pictograma-compa-arena.png" },
    { id: "gorra", categoria: "Merch", nombre: "Gorra El Compa", descripcion: "Para el sol de la ruta, con El Compa bordado.", precioUSD: null, pictograma: "assets/img/pictograma-compa-arena.png" },
    { id: "reseteo-fullday", categoria: "El Reseteo", nombre: "El Reseteo · Full day", descripcion: "Un día de movimiento, meditación, naturaleza, arte y música.", precioUSD: null, pictograma: "assets/img/pictograma-dani-arena.png" },
    { id: "reseteo-weekend", categoria: "El Reseteo", nombre: "El Reseteo · Full weekend", descripcion: "Un fin de semana completo de reconexión.", precioUSD: null, pictograma: "assets/img/pictograma-dani-arena.png" }
  ],

  /* --- Pagos (Fase 2) ---
     tasaEUR: tasa oficial del euro del BCV (Bs por EUR). En Fase 2 se actualiza sola desde Apps Script.
     usdPorEur: referencia para convertir USD a EUR. Completar datos de cada método. */
  pagos: {
    tasaEUR: null,
    usdPorEur: null,
    // ⚠️ COMPLETAR con los datos oficiales de cobro de Paseíto con Dani antes de activar la venta.
    // moneda: "divisas" usa la tarifa en divisas; "bolivares" usa la tarifa en bolívares a tasa BCV.
    metodos: {
      pagomovil:     { nombre: "Pago móvil",    moneda: "bolivares", datos: ["Banco: ____", "Teléfono: ____", "C.I./RIF: ____", "Titular: ____"] },
      transferencia: { nombre: "Transferencia", moneda: "bolivares", datos: ["Banco: ____", "Cuenta: ____", "Titular: ____", "C.I./RIF: ____"] },
      zelle:         { nombre: "Zelle",         moneda: "divisas",   datos: ["Correo: ____", "Titular: ____"] }
    }
  },

  /* --- Jeep · aliado principal ---
     logo y bannerOficial: archivos oficiales entregados por Jeep Venezuela a Dani como embajadora.
     Mientras estén vacíos, la sección usa una foto propia de Dani con El Compa. */
  jeep: { logo: "assets/img/jeep-logo-verde.png", bannerOficial: "" },

  /* --- Aliados --- cada uno: { nombre: "Marca", logo: "assets/img/aliados/marca.png", url: "https://..." } */
  aliados: [
    { nombre: "Miravisión", logo: "assets/img/aliados/miravision.png", url: "" },
    { nombre: "Global Expedition Outfitter (GEO)", logo: "assets/img/aliados/geo.png", url: "" },
    { nombre: "Heros TV", logo: "assets/img/aliados/heros-tv.png", url: "" },
    { nombre: "Neoxpress Logistics", logo: "assets/img/aliados/neoxpress.png", url: "" },
    { nombre: "Makhana", logo: "assets/img/aliados/makhana.png", url: "" }
  ],

  /* --- Créditos --- (URL del sitio de Makhana; vacío = el logo no lleva enlace) */
  creditos: { makhanaUrl: "" },

  /* --- Contacto --- */
  contacto: {
    correo: "paseitocondani@gmail.com", // cuenta del proyecto (hasta tener Workspace)
    whatsapp: ["+58 412-7923790", "+58 414-4990315"],
    instagram: ["danicgonz", "paseitocondani"],
    tiktok: "paseitocondani",
    youtube: "paseitocondani"
  }
};
