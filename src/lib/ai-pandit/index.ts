/**
 * AI Pandit Module — Public API
 *
 * This is the ONLY file that should be imported from outside the module.
 * Single function export + type re-exports.
 */

export { consultPandit } from './core';
export type {
  PanditQuery,
  PanditResponse,
  PanditConfig,
} from './types';
