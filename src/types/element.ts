export type ElementCategory =
  | 'alkali-metal'
  | 'alkaline-earth'
  | 'transition-metal'
  | 'post-transition'
  | 'metalloid'
  | 'reactive-nonmetal'
  | 'halogen'
  | 'noble-gas'
  | 'lanthanide'
  | 'actinide'
  | 'unknown';

export type ElementState = 'solid' | 'liquid' | 'gas' | 'synthetic';

export interface ChemicalElement {
  atomicNumber: number;
  symbol: string;
  nameTh: string;
  nameEn: string;
  atomicMass: string;
  group: number | null; // 1-18 or null for f-block
  period: number; // 1-7
  category: ElementCategory;
  categoryTh: string;
  state: ElementState;
  stateTh: string;
  electronConfig: string;
  uses: string;
  discoveredBy?: string;
  yearDiscovered?: string | number;
  meltingPoint?: number | null; // in Celsius
  boilingPoint?: number | null; // in Celsius
  density?: number | null; // in g/cm³ (or g/L for gases)
  electronegativity?: number | null;
  block: 's' | 'p' | 'd' | 'f';
  summary: string;
  gridRow?: number;
  gridCol?: number;
}

export interface CategoryInfo {
  id: ElementCategory;
  nameTh: string;
  nameEn: string;
  color: string;
  bgColor: string;
  solidBg: string;
  borderColor: string;
  hoverBg: string;
  textColor: string;
  badgeBg: string;
  icon: string;
  descriptionTh: string;
}
