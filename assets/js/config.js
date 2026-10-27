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
    estreno: "2026-11-13T19:00:00-04:00",
    // ID del video para mostrarlo incrustado (ej. el tráiler o el episodio 1). Vacío = no se muestra.
    videoId: ""
  },

  /* --- Endpoints de Google Apps Script (cuenta técnica web@) ---
     Pega aquí la URL de la aplicación web publicada. Vacío = el formulario funciona en modo demostración. */
  endpoints: {
    registro: "",   // Fase 1 · registro / pre-reserva de experiencias
    aliados: "",    // Fase 1 · formulario de marcas aliadas
    pedidos: ""     // Fase 2 · carrito y reporte de pago
  },

  /* --- Experiencias vivenciales ---
     revelado:false muestra "Destino por revelar" (campañas de intriga).
     estado: "abierto" (acepta registros) · "pronto" (sin registro aún) · "agotado" */
  experiencias: [
    // Campaña de intriga: mientras revelado sea false, NO se muestra fecha ni destino y el calendario no marca nada.
    // Para revelar: completa fecha ("AAAA-MM-DD") y destino, y cambia revelado a true y estado a "abierto".
    { id: "proximo", titulo: "Próximo evento", fecha: null, destino: "", revelado: false, estado: "lista",
      descripcion: "Muy pronto revelaremos la fecha y el destino de nuestra próxima experiencia 360. Déjanos tus datos y serás de las primeras personas en saberlo." }
  ],

  /* --- Catálogo "Paseíto contigo" ---
     ⚠️ PRECIOS DE EJEMPLO: reemplazar por los precios oficiales antes de publicar.
     precioUSD:null = "Precio por anunciar" (no se puede agregar al carrito). */
  productos: [
    { id: "experiencia-360", categoria: "Experiencias", nombre: "Experiencia 360", descripcion: "Tu lugar en la próxima expedición con Dani y Mantra. Fecha y destino por revelar.", precioUSD: null, imagen: "assets/img/noche-llanera.webp", etiqueta: "Cupos limitados" },
    { id: "pasaporte", categoria: "Pasaporte", nombre: "Pasaporte de Paseíto con Dani", descripcion: "Colecciona un sello por cada experiencia vivida.", precioUSD: null, pictograma: "assets/img/pictograma-pin-arena.png", etiqueta: "Nuevo" },
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
    metodos: {
      pagomovil: { nombre: "Pago móvil", datos: "Banco: ____ · Teléfono: ____ · C.I./RIF: ____" },
      zelle:     { nombre: "Zelle",      datos: "Correo: ____ · Titular: ____" },
      binance:   { nombre: "Binance",    datos: "Correo o Pay ID: ____" }
    }
  },

  /* --- Créditos --- (URL del sitio de Makhana; vacío = el logo no lleva enlace) */
  creditos: { makhanaUrl: "" },

  /* --- Contacto --- */
  contacto: {
    correo: "danicgonz@gmail.com", // temporal hasta tener el correo de Workspace
    whatsapp: "+58 412-7923790",
    instagram: ["paseitocondani", "elreseteo"],
    tiktok: "paseitocondani",
    youtube: "paseitocondani"
  }
};
