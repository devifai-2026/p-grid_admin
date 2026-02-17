import { useState } from 'react';
import { apiCall } from '../apicall/apiCall';

export const usePropertyAPIs = () => {
  const [loading, setLoading] = useState(false);

  const getProperties = (onSuccess, onError) => {
    apiCall.get({
      route: '/properties',
      onSuccess: (data) => {
        if (onSuccess) onSuccess(data);
      },
      onError: (error) => {
        if (onError) onError(error);
      },
      setLoading,
    });
  };

  const createProperty = (payload, onSuccess, onError) => {
    apiCall.post({
      route: '/properties',
      payload,
      onSuccess: (data) => {
        if (onSuccess) onSuccess(data);
      },
      onError: (error) => {
        if (onError) onError(error);
      },
      setLoading,
    });
  };

  const getAmenities = (onSuccess, onError) => {
    apiCall.get({
      route: '/amenities',
      onSuccess: (data) => {
        if (onSuccess) onSuccess(data);
      },
      onError: (error) => {
        if (onError) onError(error);
      },
      setLoading,
    });
  };

  const getCaretakers = (onSuccess, onError) => {
    apiCall.get({
      route: '/caretakers',
      onSuccess: (data) => {
        if (onSuccess) onSuccess(data);
      },
      onError: (error) => {
        if (onError) onError(error);
      },
      setLoading,
    });
  };

  const getPropertyById = (id, onSuccess, onError) => {
    apiCall.get({
      route: `/properties/${id}`,
      onSuccess: (data) => {
        if (onSuccess) onSuccess(data);
      },
      onError: (error) => {
        if (onError) onError(error);
      },
      setLoading,
    });
  };

  return {
    getProperties,
    getPropertyById,
    createProperty,
    getAmenities,
    getCaretakers,
    loading,
  };
};
