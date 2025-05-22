import { get, post, put, del } from "./requester";

const baseUrl = import.meta.env.VITE_API_URL + "/review";

const getByProduct = (productId) => get(`${baseUrl}/${productId}`);
const create = (reviewData) => post(baseUrl, reviewData);
const update = (reviewData) => put(baseUrl, reviewData);
const like = (reviewId, data) => put(`${baseUrl}/${reviewId}/like`, data);
const dislike = (reviewId, data) => put(`${baseUrl}/${reviewId}/dislike`, data);
const remove = (reviewId) => del(`${baseUrl}/${reviewId}`);
const addComment = (reviewId, commentData) => post(`${baseUrl}/${reviewId}/comments`, commentData);
const removeComment = (reviewId, commentId) => del(`${baseUrl}/${reviewId}/comments/${commentId}`);

const reviewApi = {
    getByProduct,
    create,
    update,
    like,
    dislike,
    remove,
    addComment,
    removeComment,
};

export default reviewApi;
