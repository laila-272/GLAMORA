import api from "./api";

export const getBrands = async () => {
  const { data } = await api.get("/brands");

  if (!Array.isArray(data)) {
    throw new Error("Invalid brands response");
  }

  return data;
};
