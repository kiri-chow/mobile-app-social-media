import { callApi } from "./base";


export async function getCurrentUser() {
    return callApi("/api/users/current");
}

export async function getAllUsers(search=null, page=1, perPage=20) {
    let params = []
    if ( search ) {
        params.push(`search=${search}`);
    }
    params = params.concat([
        `page=${page}`,
        `perPage=${perPage}`,
    ]);
    return callApi(`/api/users?${params.join('&')}`);
}

export async function updateUser(id, data) {
    return callApi(`/api/users/${id}`, "PUT", data);
}

export async function hideUser(id) {
    return callApi(`/api/users/${id}/invisible`, 'PUT');
}

export async function deleteUser(id) {
    return callApi(`/api/users/${id}`, 'DELETE');
}

export async function followUser(id) {
    return callApi(`/api/users/${id}/follow`, 'POST');
}

export async function unfollowUser(id) {
    return callApi(`/api/users/${id}/follow`, "DELETE");
}

export async function getFollowed() {
    return callApi(`/api/users/followed`);
}

export async function getFollowings() {
    return callApi(`/api/users/followings`);
}

export async function getFollowerSet() {
    const data = await getFollowings();
    return new Set(data.map(x => x.follower_id));
}

export async function getFollowedSet() {
    const data = await getFollowed();
    return new Set(data.map(x => x.user_id));
}