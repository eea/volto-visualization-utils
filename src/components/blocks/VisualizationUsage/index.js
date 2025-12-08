import { BLOCK_ID, BLOCK_TITLE, BLOCK_GROUP } from './constants';
import VisualizationUsageView from './View';
import VisualizationUsageEdit from './Edit';
import tableSVG from '@plone/volto/icons/table.svg';

const installVisualizationUsageBlock = (config) => {
  config.blocks.blocksConfig[BLOCK_ID] = {
    id: BLOCK_ID,
    title: BLOCK_TITLE,
    icon: tableSVG,
    group: BLOCK_GROUP,
    view: VisualizationUsageView,
    edit: VisualizationUsageEdit,
    restricted: false,
    mostUsed: false,
    sidebarTab: 1,
    security: {
      addPermission: [],
      view: [],
    },
  };

  // Ensure the data_blocks group exists
  if (
    !config.blocks.groupBlocksOrder.find((group) => group.id === BLOCK_GROUP)
  ) {
    config.blocks.groupBlocksOrder = [
      ...config.blocks.groupBlocksOrder,
      {
        id: BLOCK_GROUP,
        title: 'Data blocks',
      },
    ];
  }

  return config;
};

export default installVisualizationUsageBlock;
