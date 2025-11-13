import { GET_VISUALIZATION_USAGE } from '../constants/ActionTypes';

export function getVisualizationUsage(url, options = {}) {
  const { query, batchSize, batchStart, ...rest } = options;
  const params = new URLSearchParams({
    q: query ?? '',
    b_start: batchStart ?? 0,
    b_size: batchSize ?? 99999999999,
    ...rest,
  });
  return {
    type: GET_VISUALIZATION_USAGE,
    request: {
      op: 'get',
      path: `${url}/@@visualization-usage?${params.toString()}`,
    },
  };
}
