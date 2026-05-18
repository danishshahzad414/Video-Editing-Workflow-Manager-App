export const FPS = 30;
export const WIDTH = 1920;
export const HEIGHT = 1080;

export const CARD_DUR = 45;   // 1.5s @ 30fps
export const GAP = 1;         // 1 black frame between cards
export const OUTRO_DUR = 78;  // 2.6s

export const CARDS_DATA = [
  { label: 'Salary',     line1: 'PREMIUM',    line2: 'GLOBAL SALARY',       accent: '#C9A84C' },
  { label: 'Healthcare', line1: 'WORLD-CLASS', line2: 'HEALTHCARE',          accent: '#4C7FC9' },
  { label: 'PR',         line1: 'AUSTRALIAN',  line2: 'PERMANENT RESIDENCY', accent: '#2D6A4F' },
];

export const TOTAL_FRAMES =
  CARDS_DATA.length * CARD_DUR + CARDS_DATA.length * GAP + OUTRO_DUR;
