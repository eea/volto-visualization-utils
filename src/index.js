import { visualizationUsage, visualizationRelationships } from './reducers';
import VisualizationUsage from './components/controlpanel/VisualizationUsage';
import VisualizationRelationships from './components/controlpanel/VisualizationRelationships';
import { withManagerPermission } from './helpers';

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

  config.settings.controlpanels = [
    ...config.settings.controlpanels,
    {
      '@id': '/visualization-usage',
      group: 'Visualizations',
      title: 'Visualization usage',
    },
    {
      '@id': '/visualization-relationships',
      group: 'Visualizations',
      title: 'Visualization relationships',
    },
  ];

  config.addonRoutes = [
    ...config.addonRoutes,
    {
      path: '/controlpanel/visualization-usage',
      component: withManagerPermission(VisualizationUsage),
    },
    {
      path: '/controlpanel/visualization-relationships',
      component: withManagerPermission(VisualizationRelationships),
    },
  ];

  // Apply block configurations while preserving existing functionality
  return [
    installVisualizationRelationshipsBlock,
    installVisualizationUsageBlock,
  ].reduce((acc, apply) => apply(acc), config);
};

export default applyConfig;
