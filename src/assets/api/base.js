const token = localStorage.getItem('token');

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
            request.json = JSON.stringify(data);
        }
    }
    console.log(request);
    return fetch(url, request).then(async (response) => {
        if (response.ok) {
            return response.json();
        } else {
            const json = await response.json();
            throw new Error(json.message);
        }
    }
    ).catch((error) => { throw error; });
}