export const transformOrders = (rawOrders = []) => {
  return rawOrders.map((order) => {
    // Normalize status
    const statusMap = {
      cancelled: "cancelled",
      delivered: "delivered",
      shipping: "shipping",
      pending: "shipping",
    };

    const status = statusMap[order.status] || "pending";

    // Resolve product image based on selected color
    const colorData = order.productId?.colors?.find(
      (c) => c.color === order.color
    );

    const productImage =
      colorData?.images?.[0]?.url ||
      order.productId?.colors?.[0]?.images?.[0]?.url ||
      "";

    // Format order date
    const orderDate = new Date(order.createdAt).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

    return {
      id: order._id,
      orderId: order._id,
      date: orderDate,
      status,
      total: order.pricing?.totalAmount || 0,

      shippingAddress: {
        name: "Customer",
        line1: order.address || "",
        city: order.address?.split(",")?.[1]?.trim() || "N/A",
        state: "",
        zip: "",
      },

      products: [
        {
          id: order.productId?._id,
          name: order.productId?.name || "Product",
          image: productImage,
          frameSize: order.productId?.frameType?.size || "N/A",
          frameType: order.productId?.frameType?.name || "N/A",
          quantity: order.quantity || 1,
          price: order.pricing?.productPrice || 0,
          color: order.color,
          status: "Paid",
        },
      ],
    };
  });
};
