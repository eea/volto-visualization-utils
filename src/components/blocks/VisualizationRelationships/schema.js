import { DEFAULT_ITEMS_PER_PAGE } from './constants';

export const VisualizationRelationshipsSchema = () => ({
  title: 'Visualization Relationships',
  fieldsets: [
    {
      id: 'default',
      title: 'Default',
      fields: ['title', 'description'],
    },
    {
      id: 'display',
      title: 'Display',
      fields: ['itemsPerPage', 'showDownload'],
    },
  ],

  properties: {
    title: {
      title: 'Title',
      description: 'Enter a title for this block',
      type: 'string',
    },
    description: {
      title: 'Description',
      description: 'Enter a description for this block',
      widget: 'textarea',
    },
    itemsPerPage: {
      title: 'Items per page',
      description: 'Number of items to display per page',
      type: 'choice',
      choices: [
        ['10', '10'],
        ['25', '25'],
        ['50', '50'],
        ['All', 'All'],
      ],
      default: DEFAULT_ITEMS_PER_PAGE.toString(),
    },
    showDownload: {
      title: 'Show download button',
      description: 'Display the Excel download button',
      type: 'boolean',
      default: true,
    },
  },

  required: [],
});
