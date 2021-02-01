export default class Link {
  constructor(db) {
    this.db = db;
  }

  async storeClickEvent(clickEventData) {
    console.log("TABLE", process.env.trackerTable);

    const {
      requestedUrl,
      sourceIp,
      browser,
      browserVersion,
      device,
      os,
      description,
    } = clickEventData;

    // insert (put) click event (pk:url, sk:ip_<ip>#timestamp_<time>, par:...evenIntfo)

    const createdAt = Date.now();
    const storeEventParams = {
      TableName: process.env.trackerTable,
      Item: {
        PK: `link_${requestedUrl}`,
        SK: `ip_${sourceIp}#timestamp_${createdAt}`,
        browser: browser || undefined,
        browserVersion: browserVersion || undefined,
        device: device || undefined,
        os: os || undefined,
        description: description || undefined,
        createdAt,
      },
    };

    await this.db.call("put", storeEventParams);
    // increment (update) url visit count (pk:url, sk:info, par1:count, par2: updatedAt)
    const updateTotalLinkClickCountParams = {
      TableName: process.env.trackerTable,
      Key: {
        PK: `link_${requestedUrl}`,
        SK: "info",
      },
      ExpressionAttributeValues: {
        ":countInc": 1,
        ":updatedAt": Date.now(),
      },
      UpdateExpression: "ADD clickCount :countInc SET updatedAt = :updatedAt",
    };
    await this.db.call("update", updateTotalLinkClickCountParams);
    // // increment (update) url/ip visit count (pk:url, sk:ip_<ip>#timestamp_<time>, par:count, ip:<ip>)
    const updateTotalLinkClickPerIpCountParams = {
      TableName: process.env.trackerTable,
      Key: {
        PK: `link_${requestedUrl}`,
        SK: `ip_${sourceIp}#info`,
      },
      ExpressionAttributeValues: {
        ":ip": sourceIp,
        ":countInc": 1,
        ":updatedAt": Date.now(),
      },
      UpdateExpression:
        "ADD clickCount :countInc SET updatedAt = :updatedAt, ip = :ip",
    };
    await this.db.call("update", updateTotalLinkClickPerIpCountParams);
  }
}
