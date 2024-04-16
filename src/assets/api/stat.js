import { callApi } from "./base";


export async function getFollowerStats() {
    return callApi(`/api/stats/followers`);
}

export async function getUserStats() {
    return callApi(`/api/stats/usersCount`);
}

export async function getUserGenderStats() {
    return callApi(`/api/stats/usersGender`);
}