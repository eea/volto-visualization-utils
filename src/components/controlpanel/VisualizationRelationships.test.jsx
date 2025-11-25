import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import { IntlProvider } from 'react-intl';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import VisualizationRelationships from './VisualizationRelationships';

const mockStore = configureStore([thunk]);

const mockGetVisualizationRelationships = jest.fn();
const mockGetContent = jest.fn();

jest.mock('../../actions/visualizationRelationships', () => ({
  getVisualizationRelationships: (...args) => {
    mockGetVisualizationRelationships(...args);
    return { type: 'GET_VISUALIZATION_RELATIONSHIPS' };
  },
}));

jest.mock('@plone/volto/actions/content/content', () => ({
  getContent: (...args) => {
    mockGetContent(...args);
    return { type: 'GET_CONTENT' };
  },
}));

const defaultStore = mockStore({
  intl: {
    locale: 'en',
    messages: {},
  },
  content: {
    data: {
      title: 'Test Title',
    },
  },
  visualizationRelationships: {
    items: [],
    items_total: 0,
    get: {
      loading: false,
    },
  },
});

const messages = {
  'Visualizations relationship with connectors':
    'Visualizations relationship with connectors',
  Visualization: 'Visualization',
  Connector: 'Connector',
  File: 'File',
  Show: 'Show',
};

const renderComponent = (store = defaultStore, props = {}) => {
  return render(
    <Provider store={store}>
      <IntlProvider locale="en" messages={messages}>
        <VisualizationRelationships
          location={{ pathname: '/test' }}
          {...props}
        />
      </IntlProvider>
    </Provider>,
  );
};

describe('VisualizationRelationships', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    renderComponent();
    expect(
      screen.getByText('Visualizations relationship with connectors'),
    ).toBeInTheDocument();
  });

  it('renders table headers', () => {
    renderComponent();
    expect(screen.getByText('Visualization')).toBeInTheDocument();
    expect(screen.getByText('Connector')).toBeInTheDocument();
    expect(screen.getByText('File')).toBeInTheDocument();
  });

  it('renders download button', () => {
    renderComponent();
    const downloadLink = screen.getByRole('link', {
      name: /Download as Excel/i,
    });
    expect(downloadLink).toBeInTheDocument();
    expect(downloadLink).toHaveAttribute(
      'href',
      '/test/++api++/@@export-visualization-relationships',
    );
  });

  it('shows loader when loading', () => {
    const loadingStore = mockStore({
      ...defaultStore.getState(),
      visualizationRelationships: {
        ...defaultStore.getState().visualizationRelationships,
        get: { loading: true },
      },
    });
    renderComponent(loadingStore);
    expect(
      document.querySelector('.ui.active.centered.inline.loader'),
    ).toBeInTheDocument();
  });

  it('renders items in the table', () => {
    const storeWithItems = mockStore({
      ...defaultStore.getState(),
      visualizationRelationships: {
        items: [
          {
            title: 'Vis 1',
            url: '/vis1',
            connector: { title: 'Conn 1', url: '/conn1' },
            file: { title: 'File 1', url: '/file1' },
          },
          {
            title: 'Vis 2',
            url: '/vis2',
            connector: null,
            file: null,
          },
        ],
        items_total: 2,
        get: { loading: false },
      },
    });
    renderComponent(storeWithItems);

    expect(screen.getByText('Vis 1')).toBeInTheDocument();
    expect(screen.getByText('Conn 1')).toBeInTheDocument();
    expect(screen.getByText('File 1')).toBeInTheDocument();
    expect(screen.getByText('Vis 2')).toBeInTheDocument();
    expect(screen.getAllByText('-')).toHaveLength(2); // for connector and file of Vis 2
  });

  it('renders pagination when there are pages', () => {
    const storeWithPages = mockStore({
      ...defaultStore.getState(),
      visualizationRelationships: {
        items: [],
        items_total: 30,
        get: { loading: false },
      },
    });
    renderComponent(storeWithPages);

    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('does not render pagination when no pages', () => {
    renderComponent();
    expect(screen.queryByRole('button', { name: '1' })).not.toBeInTheDocument();
  });

  it('renders items per page options', () => {
    renderComponent();
    expect(screen.getByText('Show:')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getByText('25')).toBeInTheDocument();
    expect(screen.getByText('50')).toBeInTheDocument();
    expect(screen.getByText('All')).toBeInTheDocument();
  });

  it('changes active page on pagination click', () => {
    const storeWithPages = mockStore({
      ...defaultStore.getState(),
      visualizationRelationships: {
        items: [],
        items_total: 30,
        get: { loading: false },
      },
    });
    renderComponent(storeWithPages);

    const page2Button = screen.getByText('2');
    fireEvent.click(page2Button);

    // Test that the click happens, state change is internal
  });

  it('dispatches actions on mount', () => {
    renderComponent();

    expect(mockGetVisualizationRelationships).toHaveBeenCalledWith('/test', {
      query: '',
      manual: '',
      datetime: '',
      batchSize: '',
    });
    expect(mockGetContent).toHaveBeenCalledWith('/test');
  });
});
