import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import AOS from "aos";
import "aos/dist/aos.css";
import { useUserStorage } from './useUserStorage';

export const useProductListing = (initialProducts, filterOptions) => {
    const { isLoggedIn } = useUserStorage();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    const [showFilter, setShowFilter] = useState(false);
    const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'recommended');

    // Initialize active filters
    const [activeFilters, setActiveFilters] = useState(() => {
        const filters = {};
        if (filterOptions) {
            Object.keys(filterOptions).forEach(key => {
                const paramValue = searchParams.get(key);
                filters[key] = paramValue ? paramValue.split(',') : [];
            });
        }
        return filters;
    });

    // Initialize AOS and Wishlist
    useEffect(() => {
        window.scrollTo(0, 0);

        AOS.init({
            duration: 1000,
            easing: "ease-out-cubic",
            once: true,
            offset: 100,
        });
    }, []);

    // Sync URL Params
    useEffect(() => {
        const params = {};

        // Preserve existing query params that are not filters (like 'q' for search)
        searchParams.forEach((value, key) => {
            if (!filterOptions || !Object.keys(filterOptions).includes(key) && key !== 'sortBy') {
                params[key] = value;
            }
        });

        Object.keys(activeFilters).forEach(key => {
            if (activeFilters[key].length > 0) {
                params[key] = activeFilters[key].join(',');
            }
        });

        if (sortBy !== 'recommended') {
            params.sortBy = sortBy;
        }

        setSearchParams(params, { replace: true });
    }, [activeFilters, sortBy, setSearchParams, filterOptions]);


    const handleCardClick = (productId) => {
        navigate(`/product-details/${productId}`);
    };

    // Sync activeFilters with filterOptions keys (to handle dynamic filters)
    useEffect(() => {
        if (filterOptions) {
            setActiveFilters(prev => {
                const newFilters = { ...prev };
                let hasChanges = false;
                Object.keys(filterOptions).forEach(key => {
                    if (newFilters[key] === undefined) {
                        newFilters[key] = [];
                        hasChanges = true;
                    }
                });
                return hasChanges ? newFilters : prev;
            });
        }
    }, [filterOptions]);

    const toggleFilter = (category, value) => {
        setActiveFilters(prev => {
            const currentCategoryValues = prev[category] || [];

            // Price filter should only allow one selection at a time
            if (category === 'price' || category === 'gender' || category === 'material' || category === 'frameSize') {
                // If clicking the same value, deselect it; otherwise, replace with new value
                return {
                    ...prev,
                    [category]: currentCategoryValues.includes(value) ? [] : [value]
                };
            }

            // Other filters allow multiple selections
            return {
                ...prev,
                [category]: currentCategoryValues.includes(value)
                    ? currentCategoryValues.filter(item => item !== value)
                    : [...currentCategoryValues, value]
            };
        });
    };

    const clearAllFilters = () => {
        const resetFilters = {};
        if (filterOptions) {
            Object.keys(filterOptions).forEach(key => {
                resetFilters[key] = [];
            });
        }
        setActiveFilters(resetFilters);
        setSortBy('recommended');
        searchParams.delete('page');
        setSearchParams(searchParams);
    };

    // Filtering and Sorting Logic
    const getFilteredAndSortedProducts = (productsToFilter = initialProducts) => {
        let result = [...productsToFilter];

        // Sidebar Filters
        Object.keys(activeFilters).forEach(key => {
            if (activeFilters[key].length > 0) {
                result = result.filter(p => {
                    const productValue = p[key];
                    if (!productValue) return true;
                    return activeFilters[key].includes(productValue);
                });
            }
        });

        // Sorting
        result.sort((a, b) => {
            switch (sortBy) {
                case 'price-low': return parseInt(a.price) - parseInt(b.price);
                case 'price-high': return parseInt(b.price) - parseInt(a.price);
                case 'newest': return b.id - a.id;
                case 'popular': {
                    const aCount = parseInt(a.rating?.match(/\((\d+)\)/)?.[1] || 0);
                    const bCount = parseInt(b.rating?.match(/\((\d+)\)/)?.[1] || 0);
                    return bCount - aCount;
                }
                case 'rating': {
                    const aRating = parseFloat(a.rating);
                    const bRating = parseFloat(b.rating);
                    return bRating - aRating;
                }
                default: return 0;
            }
        });

        return result;
    };

    return {
        showFilter,
        setShowFilter,
        sortBy,
        setSortBy,
        activeFilters,
        handleCardClick,
        toggleFilter,
        clearAllFilters,
        getFilteredAndSortedProducts
    };
};
