declare module "d3-scale-chromatic" {
  export function interpolateCool(t: number): string
  export function interpolateWarm(t: number): string
  export function interpolateViridis(t: number): string
  export function interpolatePlasma(t: number): string
  export function interpolateMagma(t: number): string
  export function interpolateInferno(t: number): string
  export function interpolateCubehelixDefault(t: number): string
  export const schemeCategory10: string[]
  export const schemeAccent: string[][]
  export const schemeDark2: string[][]
  export const schemePaired: string[][]
}
