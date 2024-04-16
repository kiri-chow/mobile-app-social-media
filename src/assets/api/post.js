import { callApi } from "./base";

export async function getPostList(search) {
    const params = search ? `?search=${search}` : '';
    return callApi(`/api/posts/own${params}`);
}

export async function createPost(data, id) {
    if (id) {
        data['parent_id'] = id;
    }
    return callApi(`/api/posts`, "POST", data);
}

export async function updatePost(id, data) {
    return callApi(`/api/posts/${id}`, 'PUT', data);
}

export async function deletePost(id) {
    return callApi(`/api/posts/${id}`, "DELETE");
}

export async function getReplyList(id) {
    return callApi(`/api/posts/${id}/replies`);
}

export async function getSuggestedEmoji(content) {
    return callApi(`/api/posts/emoji?content=${content}`);
}