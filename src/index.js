import { visualizationUsage, visualizationRelationships } from './reducers';

// Import block installers
import installVisualizationRelationshipsBlock from './components/blocks/VisualizationRelationships';
import installVisualizationUsageBlock from './components/blocks/VisualizationUsage';

const applyConfig = (config) => {
  // addonReducers
  config.addonReducers = {
    ...(config.addonReducers || {}),
    visualizationUsage,
    visualizationRelationships,
  };

  // Apply block configurations while preserving existing functionality
  return [
    installVisualizationRelationshipsBlock,
    installVisualizationUsageBlock,
  ].reduce((acc, apply) => apply(acc), config);
};

export default applyConfig;
