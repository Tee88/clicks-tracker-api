import { found, failure } from "../../../../libs/response-lib";
import platform from "platform";
export async function main(event, context) {
    
    const requestedUrl = event.pathParameters.proxy
    const {sourceIp, userAgent} = event.requestContext.identity

    console.log("IP", sourceIp)
    console.log("UA", userAgent)

    const info = platform.parse(userAgent)
    const {name: browser, version: browserVersion, product: device,description} = info
    const os =  info.os.toString()

    console.log("browser",browser)
    console.log("browserVersion",browserVersion)
    console.log("device",device)
    console.log("description",description)
    console.log("os",os)
    return movedPermanently({ success: true }, requestedUrl)

    return found({ success: true }, requestedUrl);
}