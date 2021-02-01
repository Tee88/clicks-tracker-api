import { found, failure } from "../../../../libs/response-lib";
import * as dynamoDbLib from "../../../../libs/dynamodb-lib";
import Link from "../models/link";

import platform from "platform";

const link = new Link(dynamoDbLib);

export async function main(event, context) {
  const requestedUrl = event.pathParameters.proxy;
  const { sourceIp, userAgent } = event.requestContext.identity;

  const info = platform.parse(userAgent);
  const {
    name: browser,
    version: browserVersion,
    product: device,
    description,
  } = info;
  const os = info.os.toString();

  const clickEventData = {
    requestedUrl,
    sourceIp,
    browser,
    browserVersion,
    device,
    os,
    description,
  };

  try {
    await link.storeClickEvent(clickEventData);
    return found({ success: true }, requestedUrl);
  } catch (e) {
    return failure({ status: false, error: e.message });
  }
}
