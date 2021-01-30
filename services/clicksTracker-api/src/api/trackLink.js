import {movedPermanently} from "../../../../libs/response-lib"
export async function main(event, context) {
    console.log("Hello from link tracker")
    return movedPermanently({ success: true })

}