const HOSTNAME_PORT = window.location.protocol + "//" + window.location.host;
const HOSTNAME_PORT_SUBDIR = HOSTNAME_PORT + "/" + window.location.pathname.split("/")[1];


async function fetchWrapper(url, options = {}) {
  let response = undefined;
  let json = undefined;
  let error = undefined;
  let status = undefined;
  let ok = undefined;
  
  try {
    response = await fetch(url, options);
    ok = response.ok;
    status = response.status;
    json = await response.json();
  }
  catch (err) {
    error = err;
  }

  return {response: response, json: json, error: error, status: status, ok: ok};
}
