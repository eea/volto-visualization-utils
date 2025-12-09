import { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { getBaseUrl } from '@plone/volto/helpers/Url/Url';
import { getVisualizationRelationships } from '../actions/visualizationRelationships';

export const connectToVisualizationRelationships = () => (WrappedComponent) => {
  return (props) => {
    const location = useLocation();
    const dispatch = useDispatch();

    // Enhanced store initialization with comprehensive safety checks
    const visualizations = useSelector((state) => {
      if (!state) {
        return { get: { loading: false }, items: [], items_total: 0 };
      }

      if (!state.visualizationRelationships) {
        return { get: { loading: false }, items: [], items_total: 0 };
      }

      const stateData = state.visualizationRelationships;

      // Validate state structure
      if (!stateData || typeof stateData !== 'object') {
        return { get: { loading: false }, items: [], items_total: 0 };
      }

      if (!stateData.get || typeof stateData.get !== 'object') {
        return { ...stateData, get: { loading: false } };
      }

      return stateData;
    });

    const [activePage, setActivePage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    // Auto-detect base URL from current location
    const baseUrl = getBaseUrl(location.pathname);

    // Track last request to prevent duplicates
    const lastRequestRef = useRef(null);

    // Create a stable request key for deduplication
    const requestKey = useMemo(() => {
      return `${baseUrl}-${activePage}-${itemsPerPage}`;
    }, [baseUrl, activePage, itemsPerPage]);

    const updateResults = useCallback(() => {
      // Enhanced safety checks
      if (
        !visualizations ||
        requestKey === lastRequestRef.current ||
        visualizations.get?.loading
      ) {
        return;
      }

      const requestOptions = {
        batchStart: (activePage - 1) * itemsPerPage,
        batchSize: itemsPerPage === 'All' ? 999999999999 : itemsPerPage,
      };

      lastRequestRef.current = requestKey;
      dispatch(getVisualizationRelationships(baseUrl, requestOptions));
    }, [
      dispatch,
      activePage,
      itemsPerPage,
      baseUrl,
      requestKey,
      visualizations,
    ]);

    // Calculate page count from results
    const pages = useMemo(() => {
      let pages = Math.ceil((visualizations?.items_total || 0) / itemsPerPage);
      if (pages === 0 || isNaN(pages)) {
        pages = '';
      }
      return pages;
    }, [visualizations?.items_total, itemsPerPage]);

    // Single consolidated useEffect for data fetching
    useEffect(() => {
      updateResults();
    }, [updateResults]);

    const enhancedProps = {
      ...props,
      visualizationData: visualizations,
      baseUrl,
      activePage,
      itemsPerPage,
      pages,
      setActivePage,
      setItemsPerPage,
      updateResults,
    };

    return <WrappedComponent {...enhancedProps} />;
  };
};
