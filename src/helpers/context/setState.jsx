export default function appReducer(state, action) {
  switch (action.type) {

    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_PRODUCTS":
      return { ...state, products: action.payload };
    case "SET_COMPANIES":
      return { ...state, companies: action.payload };
    case "SET_PRODUCT_REVIEWS":
      return { ...state, productReviews: action.payload };
    case "SET_REVIEWS":
      return { ...state, reviews: action.payload };
    case "SET_RATING_STATS":
      return { ...state, productRatingStats: action.payload };
    case "SET_USER_REVIEW":
      return { ...state, userProductReview: action.payload };
    case "SET_LOADING_PRODUCTS":
      return { ...state, loading_products: action.payload };
    case "SET_LOADING_PRODUCT":
      return { ...state, loading_product: action.payload };
    case "SET_PAGE_INFO":
      return { ...state, page_info: action.payload };
    case "SET_GOOD_REVIEWS":
      return { ...state, good_reviews: action.payload };
    case "SET_BANNERS":
      return { ...state, banners: action.payload };

    default:
      return state;
  }
}
