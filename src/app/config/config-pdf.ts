import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
export const PDF_CHART_PIXEL_RATIO = 2;
let PDF_HEADER_CONTEXT: PdfHeaderContext = {};

export interface PdfChartExportItem {
  title: string;
  image: string;
}
export interface PdfChartComponent {
  getChartImage: (pixelRatio?: number) => string | null;
  getChartTitle?: () => string;
}
export interface PdfChartConfig {
  component?: PdfChartComponent | null;
  title: string;
}

export interface PdfTablaContinuaConfig {
  tituloReporte: string;
  tituloTabla: string;
  columnas: string[];
  filas: any[][];
  startY: number;
  marginLeft?: number;
  marginRight?: number;
  columnStyles?: any;
}
export interface PdfHeaderContext {
  fechaInicio?: string | Date | null;
  fechaFin?: string | Date | null;
  turno?: string | null;
  tipoOperacion?: string | null;
  fechaGeneracion?: Date;
}

export function configurarCabeceraPDF(context: PdfHeaderContext): void {
  PDF_HEADER_CONTEXT = {
    ...context,
    fechaGeneracion: context.fechaGeneracion || new Date(),
  };
}
function formatearFechaFiltroPDF(valor?: string | Date | null): string {
  if (!valor) return '-';

  if (valor instanceof Date) {
    return formatearFechaSimplePDF(valor);
  }

  const texto = String(valor).trim();

  // Si viene como YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(texto)) {
    const [anio, mes, dia] = texto.split('-');
    return `${dia}/${mes}/${anio}`;
  }

  return texto;
}
function formatearFechaSimplePDF(fecha: Date): string {
  const dia = String(fecha.getDate()).padStart(2, '0');
  const mes = String(fecha.getMonth() + 1).padStart(2, '0');
  const anio = fecha.getFullYear();

  return `${dia}/${mes}/${anio}`;
}
function formatearFechaHoraPDF(fecha: Date): string {
  const dia = String(fecha.getDate()).padStart(2, '0');
  const mes = String(fecha.getMonth() + 1).padStart(2, '0');
  const anio = fecha.getFullYear();

  const hora = String(fecha.getHours()).padStart(2, '0');
  const minuto = String(fecha.getMinutes()).padStart(2, '0');

  return `${dia}/${mes}/${anio} ${hora}:${minuto}`;
}

export function agregarCabeceraPDF(pdf: jsPDF, titulo: string): void {
  const pageWidth = pdf.internal.pageSize.getWidth();

  const fechaGeneracion = formatearFechaHoraPDF(
    PDF_HEADER_CONTEXT.fechaGeneracion || new Date(),
  );

  const fechaInicio = formatearFechaFiltroPDF(PDF_HEADER_CONTEXT.fechaInicio);
  const fechaFin = formatearFechaFiltroPDF(PDF_HEADER_CONTEXT.fechaFin);

  const turno = PDF_HEADER_CONTEXT.turno || 'TODOS';
  const tipoOperacion =
    PDF_HEADER_CONTEXT.tipoOperacion || 'OPERACIÓN NO ESPECIFICADA';

  const textoFiltro = `Filtro: ${fechaInicio} - ${fechaFin}`;
  const textoGeneracion = `Generado: ${fechaGeneracion}`;
  const textoTurno = `Turno: ${turno}`;
  const textoOperacion = `Operación: ${tipoOperacion}`;

  // =========================
  // TÍTULO PRINCIPAL
  // =========================
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(12);
  pdf.setTextColor(11, 31, 58);

  pdf.text(titulo, pageWidth / 2, 10, {
    align: 'center',
  });

  // =========================
  // SUBTÍTULO OPERACIÓN
  // =========================
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(8);
  pdf.setTextColor(56, 189, 248);

  pdf.text(textoOperacion, pageWidth / 2, 15, {
    align: 'center',
  });

  // =========================
  // DATOS DEL REPORTE
  // =========================
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(7);
  pdf.setTextColor(90, 90, 90);

  pdf.text(textoFiltro, 10, 20);
  pdf.text(textoTurno, pageWidth / 2, 20, {
    align: 'center',
  });
  pdf.text(textoGeneracion, pageWidth - 10, 20, {
    align: 'right',
  });

  // Línea separadora
  pdf.setDrawColor(56, 189, 248);
  pdf.setLineWidth(0.4);
  pdf.line(10, 23, pageWidth - 10, 23);
}

export function agregarTablaContinuaPDF(
  pdf: jsPDF,
  config: PdfTablaContinuaConfig,
): number {
  const {
    tituloReporte,
    tituloTabla,
    columnas,
    filas,
    marginLeft = 8,
    marginRight = 8,
    columnStyles = {},
  } = config;

  if (!filas || filas.length === 0) {
    console.warn(`Sin datos para tabla: ${tituloTabla}`);
    return config.startY;
  }

  const pageHeight = pdf.internal.pageSize.getHeight();

  let startY = config.startY;

  // Si ya no hay espacio para iniciar una tabla, recién ahí crea nueva página
  if (startY > pageHeight - 35) {
    pdf.addPage();
    agregarCabeceraPDF(pdf, tituloReporte);
    startY = 24;
  }

  // Título de tabla
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(9);
  pdf.setTextColor(11, 31, 58);
  pdf.text(tituloTabla, marginLeft, startY);

  autoTable(pdf, {
    head: [columnas],
    body: filas,
    startY: startY + 4,
    margin: {
      top: 24,
      left: marginLeft,
      right: marginRight,
      bottom: 12,
    },
    tableWidth: 'auto',
    theme: 'grid',
    styles: {
      fontSize: 6.2,
      cellPadding: 1.3,
      overflow: 'linebreak',
      valign: 'middle',
      textColor: [51, 51, 51],
    },
    headStyles: {
      fillColor: [56, 189, 248],
      textColor: [11, 31, 58],
      fontStyle: 'bold',
      fontSize: 6.3,
      halign: 'center',
    },
    alternateRowStyles: {
      fillColor: [247, 249, 248],
    },
    columnStyles,
    didDrawPage: () => {
      agregarCabeceraPDF(pdf, tituloReporte);
    },
  });

  const finalY = (pdf as any).lastAutoTable?.finalY || startY + 10;

  let nextY = finalY + 8;

  // Si terminó casi al final, prepara la siguiente tabla en nueva página
  if (nextY > pageHeight - 20) {
    pdf.addPage();
    agregarCabeceraPDF(pdf, tituloReporte);
    nextY = 24;
  }

  return nextY;
}

export function agregarPaginaTablaPDF(
  pdf: jsPDF,
  titulo: string,
  columnas: string[],
  filas: any[][],
): void {
  if (!filas || filas.length === 0) {
    console.warn(`Sin datos para tabla: ${titulo}`);
    return;
  }

  pdf.addPage();

  autoTable(pdf, {
    head: [columnas],
    body: filas,
    startY: 24,
    margin: {
      top: 24,
      left: 10,
      right: 10,
      bottom: 12,
    },
    theme: 'grid',
    styles: {
      fontSize: 7,
      cellPadding: 1.8,
      overflow: 'linebreak',
      valign: 'middle',
      textColor: [51, 51, 51],
    },
    headStyles: {
      fillColor: [56, 189, 248],
      textColor: [11, 31, 58],
      fontStyle: 'bold',
      fontSize: 7,
      halign: 'center',
    },
    alternateRowStyles: {
      fillColor: [247, 249, 248],
    },
    didDrawPage: () => {
      agregarCabeceraPDF(pdf, titulo);
    },
  });
}

export function agregarTablaPrimeraPerforacionPDF(
  pdf: jsPDF,
  rows: any[],
  titulo: string,
  x: number,
  y: number,
  width: number,
  height: number,
): void {
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(10);
  pdf.setTextColor(11, 31, 58);
  pdf.text(titulo, x, y - 3);

  pdf.setDrawColor(220, 220, 220);
  pdf.setFillColor(255, 255, 255);
  pdf.roundedRect(x, y, width, height, 3, 3, 'FD');

  const rowsLimitadas = rows.slice(0, 9);

  autoTable(pdf, {
    startY: y + 4,
    margin: {
      left: x + 2,
      right: pdf.internal.pageSize.getWidth() - (x + width - 2),
    },
    tableWidth: width - 4,
    head: [['Equipo', 'Fecha', 'Hora', 'Labor']],
    body: rowsLimitadas.map((item) => [
      item.modelo_equipo || '',
      item.fecha || '',
      item.hora_inicio || '',
      item.labor_fr || '',
    ]),
    theme: 'grid',
    styles: {
      fontSize: 6.5,
      cellPadding: 1.4,
      overflow: 'linebreak',
      valign: 'middle',
    },
    headStyles: {
      fillColor: [56, 189, 248],
      textColor: [11, 31, 58],
      fontStyle: 'bold',
      fontSize: 6.8,
    },
    bodyStyles: {
      textColor: [51, 51, 51],
    },
    alternateRowStyles: {
      fillColor: [247, 249, 248],
    },
  });

  if (rows.length > rowsLimitadas.length) {
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(7);
    pdf.setTextColor(100, 100, 100);
    pdf.text(
      `Mostrando ${rowsLimitadas.length} de ${rows.length} registros`,
      x + 3,
      y + height - 4,
    );
  }
}

export function agregarGraficoEnPaginaActual(
  pdf: jsPDF,
  chart: PdfChartConfig,
  posicion: {
    x: number;
    y: number;
    width: number;
    height: number;
  },
): void {
  const image = obtenerImagenChart(chart.component);

  if (!image) {
    console.warn(`No se pudo exportar el gráfico: ${chart.title}`);
    return;
  }

  agregarGraficoEchartsPDF(
    pdf,
    image,
    chart.title,
    posicion.x,
    posicion.y,
    posicion.width,
    posicion.height,
  );
}

export function agregarGraficoEchartsPDF(
  pdf: jsPDF,
  imgData: string,
  titulo: string,
  x: number,
  y: number,
  width: number,
  height: number,
): void {
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(7);
  pdf.setTextColor(11, 31, 58);
  pdf.text(titulo, x, y - 2);

  pdf.setDrawColor(220, 220, 220);
  pdf.setFillColor(255, 255, 255);
  pdf.roundedRect(x, y, width, height, 2.5, 2.5, 'FD');

  pdf.addImage(
    imgData,
    'JPEG',
    x + 1.2,
    y + 1.2,
    width - 2.4,
    height - 2.4,
    undefined,
    'SLOW',
  );
}

export function agregarGraficoEchartsPDFProporcional(
  pdf: jsPDF,
  imgData: string,
  titulo: string,
  x: number,
  y: number,
  width: number,
  height: number,
  padding: number = 1.5,
  modoAjuste: 'proporcional' | 'rellenar' = 'proporcional',
): void {
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(7);
  pdf.setTextColor(11, 31, 58);
  pdf.text(titulo, x, y - 2);

  pdf.setDrawColor(220, 220, 220);
  pdf.setFillColor(255, 255, 255);
  pdf.roundedRect(x, y, width, height, 2.5, 2.5, 'FD');

  const contentX = x + padding;
  const contentY = y + padding;
  const contentWidth = width - padding * 2;
  const contentHeight = height - padding * 2;

  let drawX = contentX;
  let drawY = contentY;
  let drawWidth = contentWidth;
  let drawHeight = contentHeight;

  if (modoAjuste === 'proporcional') {
    const props = pdf.getImageProperties(imgData);

    const imgRatio = props.width / props.height;
    const boxRatio = contentWidth / contentHeight;

    if (imgRatio > boxRatio) {
      drawWidth = contentWidth;
      drawHeight = contentWidth / imgRatio;
    } else {
      drawHeight = contentHeight;
      drawWidth = contentHeight * imgRatio;
    }

    drawX = contentX + (contentWidth - drawWidth) / 2;
    drawY = contentY + (contentHeight - drawHeight) / 2;
  }

  pdf.addImage(
    imgData,
    'JPEG',
    drawX,
    drawY,
    drawWidth,
    drawHeight,
    undefined,
    'MEDIUM',
  );
}

export function agregarPaginaGraficoCompleto(
  pdf: jsPDF,
  config: {
    tituloPagina: string;
    tituloGrafico: string;
    component?: PdfChartComponent | null;
  },
): void {
  const image = obtenerImagenChart(config.component);

  if (!image) {
    console.warn(`No se pudo exportar el gráfico: ${config.tituloGrafico}`);
    return;
  }

  pdf.addPage();

  agregarCabeceraPDF(pdf, config.tituloPagina);

  agregarGraficoEchartsPDF(pdf, image, config.tituloGrafico, 12, 24, 273, 160);
}

export function agregarPaginaConGraficos2x2(
  pdf: jsPDF,
  tituloPagina: string,
  charts: PdfChartConfig[],
): void {
  const chartsExportables = convertirChartsAImagenes(charts);

  if (chartsExportables.length === 0) {
    console.warn(`No hay gráficos exportables para: ${tituloPagina}`);
    return;
  }

  agregarPaginaGraficos2x2(pdf, tituloPagina, chartsExportables);
}

export function agregarPaginaGraficos2x2(
  pdf: jsPDF,
  tituloPagina: string,
  charts: PdfChartExportItem[],
): void {
  pdf.addPage();

  agregarCabeceraPDF(pdf, tituloPagina);

  const marginX = 12;
  const startY = 24;
  const gapX = 9;
  const gapY = 10;

  const pageWidth = pdf.internal.pageSize.getWidth();

  const cardWidth = (pageWidth - marginX * 2 - gapX) / 2;
  const cardHeight = 74;

  const posiciones = [
    { x: marginX, y: startY },
    { x: marginX + cardWidth + gapX, y: startY },
    { x: marginX, y: startY + cardHeight + gapY },
    { x: marginX + cardWidth + gapX, y: startY + cardHeight + gapY },
  ];

  charts.slice(0, 4).forEach((chart, index) => {
    const pos = posiciones[index];

    agregarGraficoEchartsPDF(
      pdf,
      chart.image,
      chart.title,
      pos.x,
      pos.y,
      cardWidth,
      cardHeight,
    );
  });
}

export function convertirChartsAImagenes(
  charts: PdfChartConfig[],
  pixelRatio: number = PDF_CHART_PIXEL_RATIO,
): PdfChartExportItem[] {
  return charts
    .map((chart) => {
      const image = obtenerImagenChart(chart.component);

      if (!image) return null;

      return {
        title: chart.title,
        image,
      };
    })
    .filter((item): item is PdfChartExportItem => item !== null);
}

export function obtenerImagenChart(
  chart?: PdfChartComponent | null,
): string | null {
  if (!chart || typeof chart.getChartImage !== 'function') {
    return null;
  }

  return chart.getChartImage(PDF_CHART_PIXEL_RATIO);
}

export function agregarPaginaGraficos2x3(
  pdf: jsPDF,
  tituloPagina: string,
  charts: PdfChartExportItem[],
): void {
  pdf.addPage();

  agregarCabeceraPDF(pdf, tituloPagina);

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  const marginX = 8;
  const startY = 30;
  const bottomMargin = 8;

  const gapX = 6;
  const gapY = 7;

  const cardWidth = (pageWidth - marginX * 2 - gapX) / 2;

  const availableHeight = pageHeight - startY - bottomMargin;
  const maxCardHeight = (availableHeight - gapY * 2) / 3;

  // Mientras más alto el ratio, más bajo será el cuadro.
  // 1.65 = más alto
  // 1.85 = equilibrado
  // 2.00 = más compacto
  const chartRatio = 1.9;

  const cardHeight = Math.min(maxCardHeight, cardWidth / chartRatio);

  const posiciones = [
    { x: marginX, y: startY },
    { x: marginX + cardWidth + gapX, y: startY },

    { x: marginX, y: startY + cardHeight + gapY },
    { x: marginX + cardWidth + gapX, y: startY + cardHeight + gapY },

    { x: marginX, y: startY + (cardHeight + gapY) * 2 },
    { x: marginX + cardWidth + gapX, y: startY + (cardHeight + gapY) * 2 },
  ];

  charts.slice(0, 6).forEach((chart, index) => {
    const pos = posiciones[index];

    agregarGraficoEchartsPDFProporcional(
      pdf,
      chart.image,
      chart.title,
      pos.x,
      pos.y,
      cardWidth,
      cardHeight,
    );
  });
}
export function agregarPaginaConGraficos2x3(
  pdf: jsPDF,
  tituloPagina: string,
  charts: PdfChartConfig[],
): void {
  const chartsExportables = convertirChartsAImagenes(charts);

  if (chartsExportables.length === 0) {
    console.warn(`No hay gráficos exportables para: ${tituloPagina}`);
    return;
  }

  agregarPaginaGraficos2x3(pdf, tituloPagina, chartsExportables);
}

export function agregarPaginaConGraficos3x2(
  pdf: jsPDF,
  tituloPagina: string,
  charts: PdfChartConfig[],
): void {
  const chartsExportables = convertirChartsAImagenes(charts);

  if (chartsExportables.length === 0) {
    console.warn(`No hay gráficos exportables para: ${tituloPagina}`);
    return;
  }

  agregarPaginaGraficos3x2(pdf, tituloPagina, chartsExportables);
}

export function agregarPaginaGraficos3x2(
  pdf: jsPDF,
  tituloPagina: string,
  charts: PdfChartExportItem[],
): void {
  pdf.addPage();

  agregarCabeceraPDF(pdf, tituloPagina);

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  const marginX = 8;
  const startY = 24;
  const bottomMargin = 8;

  const gapX = 6;
  const gapY = 8;

  const cardWidth = (pageWidth - marginX * 2 - gapX * 2) / 3;
  const cardHeight = (pageHeight - startY - bottomMargin - gapY) / 2;

  const posiciones = [
    { x: marginX, y: startY },
    { x: marginX + cardWidth + gapX, y: startY },
    { x: marginX + (cardWidth + gapX) * 2, y: startY },

    { x: marginX, y: startY + cardHeight + gapY },
    { x: marginX + cardWidth + gapX, y: startY + cardHeight + gapY },
    { x: marginX + (cardWidth + gapX) * 2, y: startY + cardHeight + gapY },
  ];

  charts.slice(0, 6).forEach((chart, index) => {
    const pos = posiciones[index];

    agregarGraficoEchartsPDF(
      pdf,
      chart.image,
      chart.title,
      pos.x,
      pos.y,
      cardWidth,
      cardHeight,
    );
  });
}
