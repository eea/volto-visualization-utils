import { GET_VISUALIZATION_USAGE } from '../constants/ActionTypes';

const initialState = {
  get: {
    loaded: false,
    loading: false,
    error: null,
  },
  items: [],
};

/**
 * Get request key
 * @function getRequestKey
 * @param {string} actionType Action type.
 * @returns {string} Request key.
 */
function getRequestKey(actionType) {
  return actionType.split('_')[0].toLowerCase();
}

/**
 * Visualizations usage reducer.
 * @function aliases
 * @param {Object} state Current state.
 * @param {Object} action Action to be handled.
 * @returns {Object} New state.
 */

export default function visualizationUsage(state = initialState, action = {}) {
  switch (action.type) {
    case `${GET_VISUALIZATION_USAGE}_PENDING`:
      return {
        ...state,
        [getRequestKey(action.type)]: {
          loading: true,
          loaded: false,
          error: null,
        },
      };
    case `${GET_VISUALIZATION_USAGE}_SUCCESS`:
      return {
        ...state,
        items: action.result?.data,
        items_total: action.result?.count,
        [getRequestKey(action.type)]: {
          loading: false,
          loaded: true,
          error: null,
        },
      };
    case `${GET_VISUALIZATION_USAGE}_FAIL`:
      return {
        ...state,
        [getRequestKey(action.type)]: {
          loading: false,
          loaded: false,
          error: action.error,
        },
      };
    default:
      return state;
  }
}
