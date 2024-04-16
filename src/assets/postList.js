import { getPostList } from './api/post';

export async function getPostListDescend() {
    const posts = await getPostList();
    return posts.posts.sort((x, y) => x.created_at > y.created_at ? -1 : 1);
}

