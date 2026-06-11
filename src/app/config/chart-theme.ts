export type ZoomPerfil = 'fechas' | 'categorias';

export const CHART_COLORS = {
  // Core colour
  primaryColor: '#38BDF8',

  // Supporting colours
  dustyGreen: '#78C67B',
  forestGreen: '#145A52',
  grey: '#333333',
  highlightOrange: '#FF9132',

  // Neutrals
  white: '#FFFFFF',
  black: '#000000',
  axis: '#666666',
  grid: '#CCCCCC',
  backgroundBar: 'rgba(180,180,180,0.10)',

  // Status
  success: '#00A064',
  warning: '#FF9132',
  danger: '#E74C3C',
};

export const CHART_TINTS = {
  primaryColor: {
    100: '#38BDF8',
    75: '#6DCCFA',
    50: '#9BDBFC',
    25: '#CDEDFE',
  },

  secondaryColor: {
    100: '#183BD6',
    75: '#526CE0',
    50: '#8C9DEB',
    25: '#C5CEF5',
  },

  dustyGreen: {
    100: '#78C67B',
    75: '#9AD49C',
    50: '#BCE3BD',
    25: '#DDF1DE',
  },

  forestGreen: {
    100: '#145A52',
    75: '#4F837D',
    50: '#8AADA8',
    25: '#C4D6D4',
  },

  grey: {
    100: '#333333',
    75: '#666666',
    50: '#999999',
    25: '#CCCCCC',
  },

  highlightOrange: {
    100: '#FF9132',
    75: '#FFAD65',
    50: '#FFC899',
    25: '#FFE4CC',
  },
};

export const CHART_PALETTE = [
  CHART_COLORS.primaryColor,
  CHART_COLORS.dustyGreen,
  CHART_COLORS.forestGreen,
  CHART_COLORS.highlightOrange,
  CHART_TINTS.primaryColor[75],
  CHART_TINTS.forestGreen[75],
  CHART_TINTS.dustyGreen[75],
  CHART_TINTS.grey[75],
];

export const CHART_KPI_COLORS = {
  disponibilidad: CHART_COLORS.primaryColor,
  utilizacion: CHART_COLORS.forestGreen,
  rendimiento: CHART_COLORS.dustyGreen,
  mttr: CHART_COLORS.highlightOrange,
  mtbf: CHART_COLORS.primaryColor,
};

export const CHART_THEME = {
  colors: {
    primary: CHART_TINTS.primaryColor[100],
    primary75: CHART_TINTS.primaryColor[75],
    primary50: CHART_TINTS.primaryColor[50],
    primary25: CHART_TINTS.primaryColor[25],

    primarySoft: '#CDEDFE',
    secondary: CHART_TINTS.secondaryColor[100],
    secondary75: CHART_TINTS.secondaryColor[75],
    secondary50: CHART_TINTS.secondaryColor[50],
    secondary25: CHART_TINTS.secondaryColor[25],

    text: CHART_TINTS.grey[100],
    textMuted: CHART_TINTS.grey[75],
    border: CHART_TINTS.grey[25],
    gridLine: '#E5E7EB',
    danger: '#E74C3C',
    success: CHART_TINTS.dustyGreen[100],
    warning: CHART_TINTS.highlightOrange[100],

    primaryScale3: [
      CHART_TINTS.primaryColor[100],
      CHART_TINTS.primaryColor[75],
      CHART_TINTS.primaryColor[50],
    ],

    primaryScale4: [
      CHART_TINTS.primaryColor[100],
      CHART_TINTS.primaryColor[75],
      CHART_TINTS.primaryColor[50],
      CHART_TINTS.primaryColor[25],
    ],

    turnos: {
      DIA: '#38BDF8',
      NOCHE: '#0B1F3A',
      DEFAULT: '#94A3B8',
    },
  },

  title: {
    left: 'center',
    top: 10,
    textStyle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#0B1F3A',
    },
  },

  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow',
    },
    backgroundColor: '#FFFFFF',
    borderColor: '#CCCCCC',
    borderWidth: 1,
    textStyle: {
      color: '#333333',
      fontSize: 12,
    },
  },

  legend: {
    orient: 'horizontal',
    bottom: 5,
    left: 'center',
    itemWidth: 18,
    itemHeight: 10,
    textStyle: {
      fontSize: 11,
      fontWeight: 'bold',
      color: '#0B1F3A',
    },
  },

  dataZoom: {
    inside: {
      type: 'inside',
      xAxisIndex: 0,
      zoomOnMouseWheel: true,
      moveOnMouseMove: true,
      moveOnMouseWheel: true,
    },
    slider: {
      type: 'slider',
      xAxisIndex: 0,
      height: 20,
      bottom: 35,
      borderColor: '#CCCCCC',
      fillerColor: 'rgba(56, 189, 248, 0.20)',
      handleStyle: {
        color: '#38BDF8',
        borderColor: '#0B1F3A',
      },
      textStyle: {
        color: '#666666',
      },
    },
  },

  grid: {
    left: '10%',
    right: '5%',
    top: '15%',
    bottom: '10%',
    containLabel: true,
  },

  xAxisCategory: {
    type: 'category',
    axisLabel: {
      fontSize: 11,
      fontWeight: 'bold',
      color: '#333333',
      interval: 0,
      rotate: 0,
    },
    axisLine: {
      lineStyle: {
        color: '#333333',
      },
    },
    axisTick: {
      alignWithLabel: true,
    },
  },

  yAxisValue: {
    type: 'value',
    axisLabel: {
      fontSize: 11,
      color: '#333333',
      formatter: '{value}',
    },
    splitLine: {
      show: true,
      lineStyle: {
        type: 'dashed',
        color: '#E5E7EB',
        width: 1,
      },
    },
    axisLine: {
      show: false,
    },
    axisTick: {
      show: false,
    },
  },

  bar: {
    barWidth: 50,
    itemStyle: {
      shadowColor: 'rgba(0, 0, 0, 0.15)',
      shadowBlur: 5,
    },
    label: {
      show: true,
      position: 'inside',
      fontWeight: 'bold',
      fontSize: 11,
      color: '#FFFFFF',
    },
  },
  pareto: {
    bar: CHART_COLORS.primaryColor,
    line: CHART_COLORS.black,
    symbol: CHART_COLORS.black,
  },
};

export function getTurnoColor(turno: string): string {
  const turnoNormalizado = String(turno || '')
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase();

  if (turnoNormalizado === 'DIA') {
    return CHART_THEME.colors.turnos.DIA;
  }

  if (turnoNormalizado === 'NOCHE') {
    return CHART_THEME.colors.turnos.NOCHE;
  }

  return CHART_THEME.colors.turnos.DEFAULT;
}

export function colorPorTipoPerforacion(index: number): string {
  const colores = [
    CHART_TINTS.primaryColor[100],
    CHART_TINTS.primaryColor[75],
    CHART_TINTS.primaryColor[50],
    CHART_TINTS.primaryColor[25],
    CHART_TINTS.secondaryColor?.[100],
    CHART_TINTS.secondaryColor?.[75],
  ].filter(Boolean);

  return colores[index % colores.length];
}

export function colorPorDisponibilidad(valor: number): string {
  if (valor >= 90) return CHART_TINTS.primaryColor[100];
  if (valor >= 75) return CHART_TINTS.primaryColor[75];
  if (valor >= 50) return CHART_TINTS.primaryColor[50];
  return CHART_TINTS.primaryColor[25];
}

export function colorPorUtilizacion(valor: number): string {
  if (valor >= 90) return CHART_TINTS.primaryColor[100];
  if (valor >= 75) return CHART_TINTS.primaryColor[75];
  if (valor >= 50) return CHART_TINTS.primaryColor[50];
  return CHART_TINTS.primaryColor[25];
}

export function colorPorRendimiento(valor: number): string {
  if (valor >= 100) return CHART_TINTS.primaryColor[100];
  if (valor >= 70) return CHART_TINTS.primaryColor[75];
  if (valor >= 40) return CHART_TINTS.primaryColor[50];
  return CHART_TINTS.primaryColor[25];
}

export function colorPorMTTR(valor: number): string {
  if (valor >= 100) return CHART_TINTS.primaryColor[100];
  if (valor >= 75) return CHART_TINTS.primaryColor[75];
  if (valor >= 50) return CHART_TINTS.primaryColor[50];
  return CHART_TINTS.primaryColor[25];
}

export function colorPorMTBF(valor: number): string {
  if (valor >= 100) return CHART_TINTS.primaryColor[100];
  if (valor >= 75) return CHART_TINTS.primaryColor[75];
  if (valor >= 50) return CHART_TINTS.primaryColor[50];
  return CHART_TINTS.primaryColor[25];
}

export const CHART_TEXT_STYLE = {
  fontFamily: 'Arial',
  color: CHART_COLORS.grey,
};

export const CHART_TITLE_STYLE = {
  fontSize: 14,
  fontWeight: 'bold',
  color: CHART_COLORS.grey,
  fontFamily: 'Arial',
};

export const CHART_AXIS_LABEL = {
  fontSize: 10,
  color: CHART_COLORS.grey,
  fontFamily: 'Arial',
};

export const CHART_SPLIT_LINE = {
  lineStyle: {
    type: 'dashed',
    color: CHART_COLORS.grid,
  },
};

export const CHART_LINE_STYLE = {
  lineStyle: {
    width: 2,
    type: 'dashed',
    color: CHART_COLORS.black,
  },
  itemStyle: {
    color: CHART_COLORS.black,
  },
  label: {
    color: CHART_COLORS.black,
  },
};

export const CHART_BAR_SHADOW = {
  shadowColor: 'rgba(0,0,0,0.20)',
  shadowBlur: 6,
  shadowOffsetY: 2,
};

export const CHART_BACKGROUND_BAR = {
  color: CHART_COLORS.backgroundBar,
  borderRadius: 5,
};

export const CHART_GRID_VERTICAL = {
  left: '8%',
  right: '5%',
  top: '20%',
  bottom: '25%',
  containLabel: true,
};

export const CHART_GRID_HORIZONTAL = {
  left: '30%',
  right: '12%',
  top: '18%',
  bottom: '18%',
  containLabel: true,
};

export function calcularZoomInicial(
  cantidad: number,
  perfil: ZoomPerfil = 'categorias',
): number {
  if (cantidad <= 0) return 100;

  if (perfil === 'fechas') {
    if (cantidad <= 7) return 100;
    if (cantidad <= 15) return 70;
    if (cantidad <= 31) return 45;
    if (cantidad <= 60) return 25;

    return 15;
  }

  if (cantidad <= 6) return 100;
  if (cantidad <= 10) return 70;
  if (cantidad <= 15) return 50;
  if (cantidad <= 25) return 35;

  return 25;
}
