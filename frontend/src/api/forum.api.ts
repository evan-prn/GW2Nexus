import httpClient from './httpClient';
import ENDPOINTS from './endpoint';
import type {
  ApiDataResponse,
  ApiPaginatedResponse,
  ForumCategory,
  ForumPost,
  ForumPostPayload,
  ForumPostReport,
  ForumPostReportPayload,
  ForumThread,
  ForumThreadPayload,
} from '../types/forum.types';

export const fetchForumCategories = async (): Promise<ApiDataResponse<ForumCategory[]>> => {
  const response = await httpClient.get<ApiDataResponse<ForumCategory[]>>(ENDPOINTS.forum.categories.index);
  return response.data;
};

export const fetchForumCategory = async (categorySlug: string): Promise<ApiDataResponse<ForumCategory>> => {
  const response = await httpClient.get<ApiDataResponse<ForumCategory>>(
    ENDPOINTS.forum.categories.show(categorySlug),
  );
  return response.data;
};

export const fetchForumCategoryThreads = async (
  categorySlug: string,
  page = 1,
): Promise<ApiPaginatedResponse<ForumThread>> => {
  const response = await httpClient.get<ApiPaginatedResponse<ForumThread>>(
    ENDPOINTS.forum.categories.threads(categorySlug),
    { params: { page } },
  );
  return response.data;
};

export const fetchForumThread = async (threadSlug: string): Promise<ApiDataResponse<ForumThread>> => {
  const response = await httpClient.get<ApiDataResponse<ForumThread>>(
    ENDPOINTS.forum.threads.show(threadSlug),
  );
  return response.data;
};

export const fetchForumThreadPosts = async (
  threadSlug: string,
  page = 1,
): Promise<ApiPaginatedResponse<ForumPost>> => {
  const response = await httpClient.get<ApiPaginatedResponse<ForumPost>>(
    ENDPOINTS.forum.threads.posts(threadSlug),
    { params: { page } },
  );
  return response.data;
};

export const createForumThread = async (
  categorySlug: string,
  payload: ForumThreadPayload,
): Promise<ApiDataResponse<ForumThread>> => {
  const response = await httpClient.post<ApiDataResponse<ForumThread>>(
    ENDPOINTS.forum.threads.store(categorySlug),
    payload,
  );
  return response.data;
};

export const createForumPost = async (
  threadSlug: string,
  payload: ForumPostPayload,
): Promise<ApiDataResponse<ForumPost>> => {
  const response = await httpClient.post<ApiDataResponse<ForumPost>>(
    ENDPOINTS.forum.posts.store(threadSlug),
    payload,
  );
  return response.data;
};

export const updateForumPost = async (
  postId: number,
  payload: ForumPostPayload,
): Promise<ApiDataResponse<ForumPost>> => {
  const response = await httpClient.patch<ApiDataResponse<ForumPost>>(
    ENDPOINTS.forum.posts.update(postId),
    payload,
  );
  return response.data;
};

export const deleteForumPost = async (postId: number): Promise<ApiDataResponse<null>> => {
  const response = await httpClient.delete<ApiDataResponse<null>>(ENDPOINTS.forum.posts.destroy(postId));
  return response.data;
};

export const reportForumPost = async (
  postId: number,
  payload: ForumPostReportPayload,
): Promise<ApiDataResponse<ForumPostReport>> => {
  const response = await httpClient.post<ApiDataResponse<ForumPostReport>>(
    ENDPOINTS.forum.posts.reports(postId),
    payload,
  );
  return response.data;
};
