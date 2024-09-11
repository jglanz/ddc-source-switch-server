import Express from  "express"
import * as http from "http"
import { VCPInputSource, VCPInputSourceValues, VCPSwitchSourceRequest } from "./API"
import { Continuous, Display, DisplayManager, VCPFeatureCode } from "@ddc-node/ddc-node"
// import assert from "node:assert"

const vcpInputSource = VCPFeatureCode.Miscellaneous.InputSource

let displayCache: Display = null

async function getDisplay() {
  if (displayCache) {
    return displayCache
  }

  const displayManager = new DisplayManager()
  const displays = await displayManager.collect();
  // assert(displays.length !== 0)
  return (displayCache = displays[0])
}

async function setInputSource(inputSource: VCPInputSource) {
  const display = await getDisplay()

  let vcpInputSourceValue = (await display.getVcpFeature(vcpInputSource)) as Continuous;
    const response = {
      error: null as string,
      from: vcpInputSourceValue.currentValue,
      to: 0
    }
    
    if (!VCPInputSourceValues.includes(vcpInputSourceValue.currentValue)) {
      response.error = `Unknown current input source`
      console.warn(response.error)
    }

    await display.setVcpFeature(vcpInputSource, inputSource)
    .catch(err => {
      response.error += `\n${err.message}`
      console.warn("setVCP input source failed", err)
    })

    vcpInputSourceValue = (await display.getVcpFeature(vcpInputSource)) as Continuous
    response.to = vcpInputSourceValue.currentValue
    return response
}

async function run() {
  const app = Express()
  app.route("/set-source")
  .get(async (req,res,next) => {
    const sourceStr = req.query["source"] as string
    const newInputSource = parseInt(sourceStr, 16) as VCPInputSource
    const response = await setInputSource(newInputSource)
    console.info("New input source param",newInputSource, "response", response)
    res.send( response)
    // res.send({
    //   to: newInputSource
    // })
  })
  .post<any, any, VCPSwitchSourceRequest>(async (req,res,next) => {
    const reqBody = req.body
    const response = await setInputSource(reqBody.source)
    res.send( response)
  })
  http.createServer(app).listen(9999)
}

export default run()
// .catch(console.error)
// .finally(() => process.exit(0))