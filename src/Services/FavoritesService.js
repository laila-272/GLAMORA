import api, { getAuthHeaders } from "./api.js";

// Get favorites
export const getFavorites = async () => {
  const headers = getAuthHeaders();

 

  const response = await api.get("/favorites", {
    headers,
  });

 

  return Array.isArray(response.data) ? response.data : [];
};

// Add favorite
export const addFavorite = async (productId) => {
  const response = await api.post(
    "/favorites",
    {
      product_id: productId,
    },
    {
      headers: getAuthHeaders(),
    },
  );

  

  return response.data;
};

// Remove favorite
export const removeFavorite = async (productId) => {
  const response = await api.delete(`/favorites/${productId}`, {
    headers: getAuthHeaders(),
  });



  return response.data;
};
