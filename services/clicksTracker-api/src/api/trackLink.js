import {movedPermanently} from "../../../../libs/response-lib"
export async function main(event, context) {
    
   
    const {sourceIp, userAgent} = event.requestContext.identity

    console.log("IP", sourceIp)
    console.log("UA", userAgent)
    return movedPermanently({ success: true })

}