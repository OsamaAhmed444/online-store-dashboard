import api from  "./axios";

export const getWishlists = () => {
    return api.get("/wishlists/admin/all")
};

export const getWishlistsStats = () => {
    return api.get("/wishlists/admin/stats");
};