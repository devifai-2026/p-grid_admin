import { products } from "../../Components/Home/data";

const initialState = {
  loading: true,
  products: products,
  loading_products: true,
  loading_product: true,
  companies: [],
  productReviews: [],
  reviews: [],
  good_reviews: [],
  banners: [],
  productRatingStats: { average: 0, total: 0, breakdown: [0, 0, 0, 0, 0] },
  userProductReview: null,
  page_info: {
    "totalPages": 1,
    "currentPage": 1,
    "total": 10,
  },
};

export default initialState;
