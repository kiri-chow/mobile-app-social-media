import { jwtDecode } from "jwt-decode";


const token = localStorage.getItem('token');

export const userInfo = typeof (token) === 'string' ? jwtDecode(token) : {};

export function logout() {
    localStorage.removeItem('token');
}

export async function callApi(url, method = "GET", data = null) {
    const request = {
        method: method,
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    };

    if (["PUT", "POST"].includes(method)) {
        request.headers['Content-Type'] = 'application/json';
        if (data) {
            request.body = JSON.stringify(data);
        }
    }
    return fetch(url, request).then(async (response) => {
        if (response.ok) {
            return response.json();
        } else if (response.status === 413) {
            throw new Error("file too large!");
        } else {
            const json = await response.json();
            throw new Error(json.message);
        }
    }
    ).catch((error) => { throw error; });
}