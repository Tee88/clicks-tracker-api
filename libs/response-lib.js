export function success(body) {
    return buildResponse(200, body);
  }
  
  export function failure(body) {
    return buildResponse(500, body);
  }
  
  export function badRequest(body) {
    return buildResponse(400, body);
  }
  
  export function forbidden(body) {
    return buildResponse(403, body);
  }
  
  export function notFound(body) {
    return buildResponse(404, body);
  }
  
  export function created(body) {
    return buildResponse(201, body);
  }
  
  export function conflict(body) {
    return buildResponse(409, body);
  }
  
  export function notModified(body) {
    return buildResponse(304, body);
  }

  export function movedPermanently(body, requestedUrl) {
      const customHeaders = { Location: requestedUrl}
    return buildResponse(301, body, customHeaders);
  }
  
  function buildResponse(statusCode, body, extraHeaders = null) {
      let defaultHeaders = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      }
    return {
      statusCode: statusCode,
      headers: {...defaultHeaders, ...extraHeaders},
      body: JSON.stringify(body),
    };
  }
  