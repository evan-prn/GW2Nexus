import httpClient from './httpClient';
import ENDPOINTS from './endpoint';
import type {
  ApiDataResponse,
  ApiFacetedResponse,
  ApiPaginatedResponse,
  Item,
  ItemComment,
  ItemCommentPayload,
  ItemCommentReportPayload,
  ItemFilters,
  ItemSummary,
  UserMention,
} from '../types/item.types';

const buildItemsParams = (filters: ItemFilters) => ({
  q: filters.q,
  page: filters.page,
  per_page: filters.per_page,
  sort: filters.sort,
  type: filters.type,
  rarity: filters.rarity,
  binding: filters.binding,
  weapon_type: filters.weapon_type,
  armor_type: filters.armor_type,
  armor_weight: filters.armor_weight,
  stat_set_id: filters.stat_set_id,
  level_min: filters.level_min,
  level_max: filters.level_max,
  profession: filters.profession,
  game_type: filters.game_type,
});

export const fetchItems = async (filters: ItemFilters): Promise<ApiFacetedResponse<ItemSummary>> => {
  const response = await httpClient.get<ApiFacetedResponse<ItemSummary>>(ENDPOINTS.items.index, {
    params: buildItemsParams(filters),
  });
  return response.data;
};

export const fetchItemAutocomplete = async (q: string): Promise<ApiDataResponse<ItemSummary[]>> => {
  const response = await httpClient.get<ApiDataResponse<ItemSummary[]>>(ENDPOINTS.items.autocomplete, {
    params: { q },
  });
  return response.data;
};

export const fetchItemDetail = async (gw2Id: number): Promise<ApiDataResponse<Item>> => {
  const response = await httpClient.get<ApiDataResponse<Item>>(ENDPOINTS.items.show(gw2Id));
  return response.data;
};

export const resolveChatCode = async (code: string): Promise<ApiDataResponse<Item>> => {
  const response = await httpClient.get<ApiDataResponse<Item>>(ENDPOINTS.items.resolveCode, {
    params: { code },
  });
  return response.data;
};

export const resolveChatCodesBatch = async (
  codes: string[],
): Promise<{ data: Record<string, ItemSummary> }> => {
  const response = await httpClient.post<{ data: Record<string, ItemSummary> }>(
    ENDPOINTS.items.resolveCodes,
    { codes },
  );
  return response.data;
};

export const fetchFavorites = async (page = 1): Promise<ApiPaginatedResponse<ItemSummary>> => {
  const response = await httpClient.get<ApiPaginatedResponse<ItemSummary>>(ENDPOINTS.items.favorites, {
    params: { page },
  });
  return response.data;
};

export const addItemFavorite = async (gw2Id: number): Promise<ApiDataResponse<null>> => {
  const response = await httpClient.post<ApiDataResponse<null>>(ENDPOINTS.items.favorite(gw2Id));
  return response.data;
};

export const removeItemFavorite = async (gw2Id: number): Promise<ApiDataResponse<null>> => {
  const response = await httpClient.delete<ApiDataResponse<null>>(ENDPOINTS.items.favorite(gw2Id));
  return response.data;
};

export const fetchItemComments = async (gw2Id: number, page = 1): Promise<ApiPaginatedResponse<ItemComment>> => {
  const response = await httpClient.get<ApiPaginatedResponse<ItemComment>>(
    ENDPOINTS.items.comments.index(gw2Id),
    { params: { page } },
  );
  return response.data;
};

export const createItemComment = async (
  gw2Id: number,
  payload: ItemCommentPayload,
): Promise<ApiDataResponse<ItemComment>> => {
  const response = await httpClient.post<ApiDataResponse<ItemComment>>(
    ENDPOINTS.items.comments.store(gw2Id),
    payload,
  );
  return response.data;
};

export const updateItemComment = async (
  commentId: number,
  payload: ItemCommentPayload,
): Promise<ApiDataResponse<ItemComment>> => {
  const response = await httpClient.patch<ApiDataResponse<ItemComment>>(
    ENDPOINTS.items.comments.update(commentId),
    payload,
  );
  return response.data;
};

export const deleteItemComment = async (commentId: number): Promise<ApiDataResponse<null>> => {
  const response = await httpClient.delete<ApiDataResponse<null>>(
    ENDPOINTS.items.comments.destroy(commentId),
  );
  return response.data;
};

export const reportItemComment = async (
  commentId: number,
  payload: ItemCommentReportPayload,
): Promise<ApiDataResponse<{ id: number }>> => {
  const response = await httpClient.post<ApiDataResponse<{ id: number }>>(
    ENDPOINTS.items.comments.reports(commentId),
    payload,
  );
  return response.data;
};

export const searchUsers = async (q: string): Promise<ApiDataResponse<UserMention[]>> => {
  const response = await httpClient.get<ApiDataResponse<UserMention[]>>(ENDPOINTS.users.search, {
    params: { q },
  });
  return response.data;
};
