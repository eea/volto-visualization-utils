import { Loader, Menu, Pagination, Table } from 'semantic-ui-react';
import { FormattedMessage } from 'react-intl';
import { useMemo } from 'react';
import map from 'lodash/map';
import { connectToVisualizationRelationships } from '../../../hocs/connectToVisualizationRelationships';
import config from '@plone/volto/registry';

const VisualizationRelationshipsView = connectToVisualizationRelationships()((
  props,
) => {
  const {
    data = {},
    visualizationData = { get: { loading: true }, items: [], items_total: 0 },
    baseUrl,
    activePage,
    itemsPerPage,
    pages,
    setActivePage,
    setItemsPerPage,
  } = props;

  const {
    title,
    description,
    showDownload = true,
    itemsPerPage: blockItemsPerPage = '10',
  } = data;

  // Memoize calculations to prevent unnecessary re-renders
  const currentItemsPerPage = useMemo(
    () => blockItemsPerPage || itemsPerPage,
    [blockItemsPerPage, itemsPerPage],
  );

  const itemsPerPageChoices = useMemo(() => [10, 25, 50, 'All'], []);

  // Safe check for loading state
  const isLoading =
    visualizationData?.get?.loading === true ||
    !visualizationData?.items ||
    !Array.isArray(visualizationData.items);

  const hasItems =
    !isLoading && visualizationData.items && visualizationData.items.length > 0;
  const root = config.settings.prefixPath ?? '';

  return (
    <div className="visualization-relationships-block">
      {title && <h3>{title}</h3>}
      {description && <p>{description}</p>}

      {showDownload && (
        <div style={{ marginBottom: '1rem' }}>
          <a
            href={`${root}/++api++${baseUrl.replace(
              root,
              '',
            )}/@@export-visualization-relationships`}
            title="Download"
            target="_blank"
            rel="noopener"
            className="ui button primary download-as-xls"
          >
            <i className="ri-file-download-line"></i>
            Download as Excel
          </a>
        </div>
      )}

      <Table celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>
              <FormattedMessage
                id="Visualization"
                defaultMessage="Visualization"
              />
            </Table.HeaderCell>
            <Table.HeaderCell>
              <FormattedMessage id="Connector" defaultMessage="Connector" />
            </Table.HeaderCell>
            <Table.HeaderCell>
              <FormattedMessage id="File" defaultMessage="File" />
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {isLoading && (
            <Table.Row>
              <Table.Cell colSpan="3">
                <Loader active inline="centered" />
              </Table.Cell>
            </Table.Row>
          )}

          {hasItems &&
            visualizationData.items.map((item) => (
              <Table.Row key={item.url}>
                <Table.Cell>
                  <strong>
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      href={item.url}
                    >
                      {item.title}
                    </a>
                  </strong>
                </Table.Cell>
                <Table.Cell>
                  <strong>
                    {item.connector ? (
                      <a
                        target="_blank"
                        rel="noopener noreferrer"
                        href={item.connector.url}
                      >
                        {item.connector.title}
                      </a>
                    ) : (
                      '-'
                    )}
                  </strong>
                </Table.Cell>
                <Table.Cell>
                  <strong>
                    {item.file ? (
                      <a
                        target="_blank"
                        rel="noopener noreferrer"
                        href={item.file.url}
                      >
                        {item.file.title}
                      </a>
                    ) : (
                      '-'
                    )}
                  </strong>
                </Table.Cell>
              </Table.Row>
            ))}

          {!isLoading && !hasItems && (
            <Table.Row>
              <Table.Cell colSpan="3" textAlign="center">
                <FormattedMessage
                  id="No data available"
                  defaultMessage="No data available"
                />
              </Table.Cell>
            </Table.Row>
          )}
        </Table.Body>
      </Table>

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          marginBottom: '20px',
        }}
      >
        {pages && (
          <Pagination
            boundaryRange={0}
            activePage={activePage}
            ellipsisItem={null}
            firstItem={null}
            lastItem={null}
            siblingRange={1}
            totalPages={pages}
            onPageChange={(_, { activePage }) => setActivePage(activePage)}
          />
        )}

        <Menu.Menu
          position="right"
          style={{ display: 'flex', marginLeft: 'auto' }}
        >
          <Menu.Item style={{ color: 'grey' }}>
            <FormattedMessage id="Show" defaultMessage="Show" />:
          </Menu.Item>
          {map(itemsPerPageChoices, (size) => (
            <Menu.Item
              style={{
                padding: '0 0.4em',
                margin: '0em 0.357em',
                cursor: 'pointer',
              }}
              key={size}
              value={size}
              active={size === currentItemsPerPage}
              onClick={() => {
                setItemsPerPage(size);
                setActivePage(1);
              }}
            >
              {size}
            </Menu.Item>
          ))}
        </Menu.Menu>
      </div>
    </div>
  );
});

export default VisualizationRelationshipsView;
