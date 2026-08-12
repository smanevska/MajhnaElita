export const API_URL = import.meta.env.VITE_API_URL;

//for public API requests
export async function apiFetch(url, options={}) {
    return fetch(API_URL+url,{
        ...options,
        headers:{
            "Content-Type":"application/json",
            ...options.headers
        }
    });
}

//for protected API requests that need login token
export async function authFetch(url, options={}) {
    const token = localStorage.getItem("token");
    const isFormData = options.body instanceof FormData;
    return fetch(API_URL + url, {
        ...options,
        headers:{
            ...(isFormData ? {} : { "Content-Type": "application/json" }),
            Authorization:`Bearer ${token}`,
            ...options.headers
        }
    });
}