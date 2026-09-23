import { ChemicalElement } from '../types/element';
import { elementsPart1 } from './elementsPart1';
import { elementsPart2 } from './elementsPart2';
import { elementsPart3 } from './elementsPart3';
import { elementsPart4 } from './elementsPart4';

// Combine all 118 elements
const rawElements: ChemicalElement[] = [
  ...elementsPart1,
  ...elementsPart2,
  ...elementsPart3,
  ...elementsPart4,
];

// Helper to determine exact grid positions in standard periodic table
function computeGridPositions(element: ChemicalElement): { gridRow: number; gridCol: number } {
  const z = element.atomicNumber;

  // Period 1
  if (z === 1) return { gridRow: 1, gridCol: 1 };
  if (z === 2) return { gridRow: 1, gridCol: 18 };

  // Period 2
  if (z >= 3 && z <= 4) return { gridRow: 2, gridCol: z - 2 }; // Li: col 1, Be: col 2
  if (z >= 5 && z <= 10) return { gridRow: 2, gridCol: z + 8 }; // B: col 13 ... Ne: col 18

  // Period 3
  if (z >= 11 && z <= 12) return { gridRow: 3, gridCol: z - 10 }; // Na: col 1, Mg: col 2
  if (z >= 13 && z <= 18) return { gridRow: 3, gridCol: z }; // Al: col 13 ... Ar: col 18

  // Period 4 (K to Kr: 19 to 36)
  if (z >= 19 && z <= 36) return { gridRow: 4, gridCol: z - 18 };

  // Period 5 (Rb to Xe: 37 to 54)
  if (z >= 37 && z <= 54) return { gridRow: 5, gridCol: z - 36 };

  // Period 6 Main: Cs (55), Ba (56)
  if (z === 55) return { gridRow: 6, gridCol: 1 };
  if (z === 56) return { gridRow: 6, gridCol: 2 };
  // Lanthanides (57 to 71: La to Lu) placed in separate row (Row 9, cols 4 to 18)
  if (z >= 57 && z <= 71) {
    return { gridRow: 9, gridCol: (z - 57) + 4 };
  }
  // Period 6 post-lanthanides: Hf (72) to Rn (86) in cols 4 to 18
  if (z >= 72 && z <= 86) {
    return { gridRow: 6, gridCol: (z - 72) + 4 };
  }

  // Period 7 Main: Fr (87), Ra (88)
  if (z === 87) return { gridRow: 7, gridCol: 1 };
  if (z === 88) return { gridRow: 7, gridCol: 2 };
  // Actinides (89 to 103: Ac to Lr) placed in separate row (Row 10, cols 4 to 18)
  if (z >= 89 && z <= 103) {
    return { gridRow: 10, gridCol: (z - 89) + 4 };
  }
  // Period 7 post-actinides: Rf (104) to Og (118) in cols 4 to 18
  if (z >= 104 && z <= 118) {
    return { gridRow: 7, gridCol: (z - 104) + 4 };
  }

  return { gridRow: 1, gridCol: 1 };
}

export const ELEMENTS: ChemicalElement[] = rawElements.map((el) => {
  const { gridRow, gridCol } = computeGridPositions(el);
  return {
    ...el,
    gridRow,
    gridCol,
  };
});

// Quick map for O(1) lookup by atomic number
export const ELEMENTS_BY_NUMBER: Map<number, ChemicalElement> = new Map(
  ELEMENTS.map((el) => [el.atomicNumber, el])
);

// Quick map by symbol (case insensitive)
export const ELEMENTS_BY_SYMBOL: Map<string, ChemicalElement> = new Map(
  ELEMENTS.map((el) => [el.symbol.toLowerCase(), el])
);

// Search function supporting Thai name, English name, symbol, and atomic number
export function searchElements(query: string, elements: ChemicalElement[] = ELEMENTS): ChemicalElement[] {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed) return elements;

  const numeric = parseInt(trimmed, 10);
  const isExactNumeric = !isNaN(numeric) && numeric >= 1 && numeric <= 118 && String(numeric) === trimmed;

  return elements.filter((el) => {
    // Exact atomic number match
    if (isExactNumeric && el.atomicNumber === numeric) return true;

    // Symbol match (starts with or exact)
    const sym = el.symbol.toLowerCase();
    if (sym === trimmed || sym.startsWith(trimmed)) return true;

    // Thai name match
    if (el.nameTh.toLowerCase().includes(trimmed)) return true;

    // English name match
    if (el.nameEn.toLowerCase().includes(trimmed)) return true;

    // Atomic number string match
    if (String(el.atomicNumber).includes(trimmed)) return true;

    // Category / Uses match as fallback
    if (el.categoryTh.toLowerCase().includes(trimmed)) return true;
    if (el.uses.toLowerCase().includes(trimmed)) return true;

    return false;
  });
}
