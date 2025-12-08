import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import { IntlProvider } from 'react-intl';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import VisualizationRelationshipsView from './View';

const mockStore = configureStore([thunk]);

const mockState = {
  visualizationRelationships: {
    get: { loading: false },
    items: [],
    items_total: 0,
  },
};

describe('VisualizationRelationshipsView', () => {
  it('renders without crashing', () => {
    const store = mockStore(mockState);

    const props = {
      data: {
        title: 'Test Title',
        description: 'Test Description',
        showDownload: true,
        itemsPerPage: '10',
      },
      visualizationData: mockState.visualizationRelationships,
      baseUrl: '/test',
      activePage: 1,
      itemsPerPage: 10,
      pages: '',
      setActivePage: jest.fn(),
      setItemsPerPage: jest.fn(),
    };

    render(
      <Provider store={store}>
        <IntlProvider locale="en" messages={{}}>
          <MemoryRouter>
            <VisualizationRelationshipsView {...props} />
          </MemoryRouter>
        </IntlProvider>
      </Provider>,
    );

    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });

  it('renders loading state', () => {
    const loadingState = {
      visualizationRelationships: {
        get: { loading: true },
        items: [],
        items_total: 0,
      },
    };

    const store = mockStore(loadingState);

    const props = {
      data: {},
      visualizationData: loadingState.visualizationRelationships,
      baseUrl: '/test',
      activePage: 1,
      itemsPerPage: 10,
      pages: '',
      setActivePage: jest.fn(),
      setItemsPerPage: jest.fn(),
    };

    render(
      <Provider store={store}>
        <IntlProvider locale="en" messages={{}}>
          <MemoryRouter>
            <VisualizationRelationshipsView {...props} />
          </MemoryRouter>
        </IntlProvider>
      </Provider>,
    );

    // Should show loader when loading
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });
});
