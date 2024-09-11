import { DisplayManager, VCPFeatureCode } from "@ddc-node/ddc-node";

const manager = new DisplayManager()

const displays = await manager.collect();
const vcpInputSource = VCPFeatureCode.Miscellaneous.InputSource
// const vcpBrightness = VCPFeatureCode.ImageAdjustment.Luminance

const attrPairs = [
  // [vcpBrightness, "Brightness"],
  [vcpInputSource, "Input Source"],
]
for (const display of displays) {
  for (const [vcpAttr, name] of attrPairs) {
    display.updateCapabilities()
    
    const vcpAttrValue = await display.getVcpFeature(vcpAttr);
    
    console.info(`Display at index ${display.index} have a ${name} value of`,display.backend);
    console.info(vcpAttrValue);
  }
}  
  // const vcpFeature = await display.getVcpFeature(VCPFeatureCode.ImageAdjustment.Luminance);
  //   console.info(`Display at index ${display.index} have a brightness value of`);
  //   console.info(vcpFeature);
  //   // await display.setVcpFeature(VCPFeatures.ImageAdjustment.Luminance, vcp_feature.currentValue + 5);
