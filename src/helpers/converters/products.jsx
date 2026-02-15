export const convertProducts = (baseProducts) => {
  return baseProducts.map((product, index) => {
    return {
      id: product?._id ?? index + 1,
      price: String(product.price),
      originalPrice: String(product.price + (product.productDiscount || 0)),
      discount: `${product.productDiscount || 0}%`,
      rating: `${product.averageRating || 0}(${product.totalReviews || 0})`,
      title: product.name,
      description: product.description,
      types: product.colors.map((c) => ({
        color: c.hexCode,
        image: c.images[0]?.url || "",
        color_name: c.color,
        hoverImages: c.images.map((img) => img.url)
      })),
      ...product
    };
  });
};
