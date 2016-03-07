// function createXHR() {
//   var xhr = new XMLHttpRequest();
//   if ("withCredentials" in xhr) {
//     // Most browsers.
//   } else if (typeof XDomainRequest != "undefined") {
//     // IE8 & IE9
//     xhr = new XDomainRequest();
//   }
//   return xhr;
// }

export const fetch = function fetch (token, url, endpoint, context, {method, body} = {method: 'GET', body: null}) {
  console.log('fetch with context',context)

  return new Promise(function (resolve, reject) {
    let req = new XMLHttpRequest()

    req.onerror = (event) => {
      reject({
        code: "AJAX_ERROR",
        title: "Request to endpoint failed",
        description: "The request failed. Check that the endpoint is valid?",
        details: {
          endpoint: endpoint
        }
      })
    }

    req.onload = () => {
      if (req.status >= 200 && req.status < 400) {
        // The 204 response MUST NOT include a message-body ...
        if (req.status === 204) {
            resolve(null)
        }

        try {
          resolve(JSON.parse(req.responseText))
        } catch (e) {
          reject({
            code: "INVALID_RESPONSE",
            title: "Response isn't valid JSON",
            description: "The response couldn't be parsed into an Javascript object. Check that the endpoint is valid?",
            details: {
              endpoint: endpoint,
              responseText: req.responseText
            }
          })
        }
      } else {
        try {
          reject(JSON.parse(req.responseText))
        } catch (e) {
          reject({
            code: "INVALID_RESPONSE",
            title: "Response isn't valid JSON",
            description: "The response couldn't be parsed into an Javascript object. Check that the endpoint is valid?",
            details: {
              endpoint: endpoint,
              responseText: req.responseText
            }
          })
        }
      }
    }

    req.open(method, endpoint + url, true)
    req.setRequestHeader('Content-Type', 'application/json')

    if (token) {
      req.setRequestHeader('Authorization', 'Bearer ' + token)
    }

    if (context) {
      req.setRequestHeader('Context', window.btoa(JSON.stringify(context)))
    }

    if (body) {
      let content = (Object.prototype.toString.call(body) === '[object String]') ? body : JSON.stringify(body)
      req.send(content)
    } else {
      req.send()
    }
  })
}
