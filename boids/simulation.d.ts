/* tslint:disable */
/* eslint-disable */
export class Simulation {
  private constructor();
  free(): void;
  static new(canvas: HTMLCanvasElement, boids_count: number, group_count: number, colliders: HTMLElement[]): Simulation;
  update_colliders(colliders: HTMLElement[]): void;
  force_field(x: number, y: number): void;
  disable_force_field(): void;
  draw(dt: number, min_speed: number, max_speed: number, seperation_range: number, avoid_factor: number, alignment_range: number, matching_factor: number, cohesion_range: number, centering_range: number, fov: number, force_field_range: number, base_size: number, r: number, g: number, b: number): void;
  draw_inspected(seperation_range: number, alignment_range: number, cohesion_range: number, fov: number): void;
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly __wbg_simulation_free: (a: number, b: number) => void;
  readonly simulation_new: (a: any, b: number, c: number, d: number, e: number) => number;
  readonly simulation_update_colliders: (a: number, b: number, c: number) => void;
  readonly simulation_force_field: (a: number, b: number, c: number) => void;
  readonly simulation_disable_force_field: (a: number) => void;
  readonly simulation_draw: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number, j: number, k: number, l: number, m: number, n: number, o: number, p: number) => [number, number];
  readonly simulation_draw_inspected: (a: number, b: number, c: number, d: number, e: number) => [number, number];
  readonly __wbindgen_exn_store: (a: number) => void;
  readonly __externref_table_alloc: () => number;
  readonly __wbindgen_export_2: WebAssembly.Table;
  readonly __wbindgen_malloc: (a: number, b: number) => number;
  readonly __wbindgen_realloc: (a: number, b: number, c: number, d: number) => number;
  readonly __externref_table_dealloc: (a: number) => void;
  readonly __wbindgen_start: () => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;
/**
* Instantiates the given `module`, which can either be bytes or
* a precompiled `WebAssembly.Module`.
*
* @param {{ module: SyncInitInput }} module - Passing `SyncInitInput` directly is deprecated.
*
* @returns {InitOutput}
*/
export function initSync(module: { module: SyncInitInput } | SyncInitInput): InitOutput;

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {{ module_or_path: InitInput | Promise<InitInput> }} module_or_path - Passing `InitInput` directly is deprecated.
*
* @returns {Promise<InitOutput>}
*/
export default function __wbg_init (module_or_path?: { module_or_path: InitInput | Promise<InitInput> } | InitInput | Promise<InitInput>): Promise<InitOutput>;
