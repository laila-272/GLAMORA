import api from "./api";

export const getProducts = async () => {
  const { data } = await api.get("/products");

  if (!Array.isArray(data)) {
    throw new Error("Invalid products response");
  }

  return data;
};
