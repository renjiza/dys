import global from '../stores/globalstore';

export const apiUrl = 'http://192.168.0.154:1313/'

export function separator(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

export const get = async (requestUrl, params) => {
    const parameter = { ...params, ...global.cookie }
    const base = requestUrl.indexOf('http') !== -1 ? "" : apiUrl
    const esc = encodeURIComponent
    const queryParams = "?" + Object.keys(parameter).map(k => esc(k) + '=' + esc(parameter[k])).join('&')
    return await fetch(base + requestUrl + queryParams, {
        method: 'GET',
        mode: 'cors',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'text/plain',
        },

    })
    .then(raw => raw.json())
}

export const post = async (requestUrl, params) => {
    const parameter = { ...params, ...global.cookie }
    const base = requestUrl.indexOf('http') !== -1 ? "" : apiUrl
    return await fetch(base + requestUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(parameter)
    })
    .then(raw => raw.json())
}

export const put = async (requestUrl, params) => {
    const parameter = { ...params, ...global.cookie }
    const base = requestUrl.indexOf('http') !== -1 ? "" : apiUrl
    return await fetch(base + requestUrl, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(parameter)
    })
    .then(raw => raw.json())
}

export const del = async (requestUrl, params) => {
    const parameter = { ...params, ...global.cookie }
    const base = requestUrl.indexOf('http') !== -1 ? "" : apiUrl
    const esc = encodeURIComponent
    const queryParams = "?" + Object.keys(parameter).map(k => esc(k) + '=' + esc(parameter[k])).join('&')
    return await fetch(base + requestUrl + queryParams, {
        method: 'DELETE',
        mode: 'cors',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'text/plain',
        },

    })
    .then(raw => raw.json())
}