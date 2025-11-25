import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import { IntlProvider } from 'react-intl';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import VisualizationUsage from './VisualizationUsage';

const mockStore = configureStore([thunk]);

const mockGetVisualizationUsage = jest.fn();
const mockGetContent = jest.fn();

jest.mock('../../actions/visualizationUsage', () => ({
  getVisualizationUsage: (...args) => {
    mockGetVisualizationUsage(...args);
    return { type: 'GET_VISUALIZATION_USAGE' };
  },
}));

jest.mock('@plone/volto/actions/content/content', () => ({
  getContent: (...args) => {
    mockGetContent(...args);
    return { type: 'GET_CONTENT' };
  },
}));

jest.mock('@plone/volto/components/manage/Contents/circle', () => {
  return function Circle({ color }) {
    return <div data-testid="circle" style={{ backgroundColor: color }} />;
  };
});

jest.mock('@plone/volto/registry', () => ({
  default: {
    settings: {
      workflowMapping: {
        published: { color: 'green' },
        private: { color: 'red' },
      },
    },
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
  visualizationUsage: {
    items: {},
    items_total: 0,
    get: {
      loading: false,
    },
  },
});

const messages = {
  'Visualization Usage': 'Visualization Usage',
  Visualization: 'Visualization',
  Usage: 'Usage',
  Show: 'Show',
  published: 'Published',
  private: 'Private',
};

const renderComponent = (store = defaultStore, props = {}) => {
  return render(
    <Provider store={store}>
      <IntlProvider locale="en" messages={messages}>
        <VisualizationUsage
          location={{ pathname: '/test' }}
          {...props}
        />
      </IntlProvider>
    </Provider>,
  );
};

describe('VisualizationUsage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    renderComponent();
    expect(screen.getByText('Visualization Usage')).toBeInTheDocument();
  });

  it('renders table headers', () => {
    renderComponent();
    expect(screen.getByText('Visualization')).toBeInTheDocument();
    expect(screen.getByText('Usage')).toBeInTheDocument();
  });

  it('renders download button', () => {
    renderComponent();
    const downloadLink = screen.getByRole('link', { name: /Download as Excel/i });
    expect(downloadLink).toBeInTheDocument();
    expect(downloadLink).toHaveAttribute('href', '/test/++api++/@@export-visualization-usage');
  });

  it('shows loader when loading', () => {
    const loadingStore = mockStore({
      ...defaultStore.getState(),
      visualizationUsage: {
        ...defaultStore.getState().visualizationUsage,
        get: { loading: true },
      },
    });
    renderComponent(loadingStore);
    expect(document.querySelector('.ui.active.centered.inline.loader')).toBeInTheDocument();
  });



  it('renders pagination when there are pages', () => {
    const storeWithPages = mockStore({
      ...defaultStore.getState(),
      visualizationUsage: {
        items: {},
        items_total: 30,
        get: { loading: false },
      },
    });
    renderComponent(storeWithPages);

    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('does not render pagination when no pages', () => {
    renderComponent();
    expect(screen.queryByText('1')).not.toBeInTheDocument();
  });

  it('renders items per page options', () => {
    renderComponent();
    expect(screen.getByText('Show:')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getByText('25')).toBeInTheDocument();
    expect(screen.getByText('50')).toBeInTheDocument();
    expect(screen.getByText('All')).toBeInTheDocument();
  });

  it('dispatches actions on mount', () => {
    renderComponent();

    expect(mockGetVisualizationUsage).toHaveBeenCalledWith('/test', {
      query: '',
      manual: '',
      datetime: '',
      batchSize: '',
    });
    expect(mockGetContent).toHaveBeenCalledWith('/test');
  });
});