export const API_URL = "http://88.200.63.148:30170";

export async function apiFetch(url, options={}) {
    return fetch(API_URL + url, {
        ...options,
        headers:{
            "Content-Type":"application/json",
            ...options.headers
        }
    });
}


export async function authFetch(url, options={}) {
    const token = localStorage.getItem("token");

    return fetch(API_URL + url, {
        ...options,
        headers:{
            "Content-Type":"application/json",
            Authorization:`Bearer ${token}`,
            ...options.headers
        }
    });
}