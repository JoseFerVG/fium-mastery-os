import { DuolingoUnit } from '../types/duolingo';
import { AOC_UNITS } from './duolingo/aocUnits';
import { ASO_UNITS } from './duolingo/asoUnits';
import { ALF_UNITS } from './duolingo/alfUnits';
import { TDS_UNITS } from './duolingo/tdsUnits';
import { ISO_UNITS } from './duolingo/isoUnits';
import { SEMESTER_2_UNITS } from './duolingo/semester2Units';

/**
 * FIUMingo Mastery OS - Unified Learning Path Data
 *
 * Comprehensive, exam-calibrated Duolingo units and dense lessons
 * covering all 5 subjects of the 1st semester (AOC, ASO, ALF, TDS, ISO)
 * plus full coverage for 2nd semester subjects (AC, AR, ST, SI).
 */
export const DUOLINGO_UNITS: DuolingoUnit[] = [
  ...AOC_UNITS,
  ...ASO_UNITS,
  ...ALF_UNITS,
  ...TDS_UNITS,
  ...ISO_UNITS,
  ...SEMESTER_2_UNITS,
];
