export enum VCPInputSource {
  dp = 0x0F,
  hdmi1 = 0x05
}

export const VCPInputSourceValues = Object.values(VCPInputSource).filter(it => typeof it === "number")

export interface VCPSwitchSourceRequest {
  source: VCPInputSource
}