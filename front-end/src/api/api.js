export const API_URL = import.meta.env.VITE_API_URL;
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