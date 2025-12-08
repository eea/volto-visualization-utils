import { Loader, Menu, Pagination, Table } from 'semantic-ui-react';
import { FormattedMessage, defineMessages, useIntl } from 'react-intl';
import { useMemo } from 'react';
import Circle from '@plone/volto/components/manage/Contents/circle';
import config from '@plone/volto/registry';
import map from 'lodash/map';

const messages = defineMessages({
  private: {
    id: 'private',
    defaultMessage: 'Private',
  },
  pending: {
    id: 'pending',
    defaultMessage: 'Pending',
  },
  published: {
    id: 'published',
    defaultMessage: 'Published',
  },
  intranet: {
    id: 'intranet',
    defaultMessage: 'Intranet',
  },
  draft: {
    id: 'draft',
    defaultMessage: 'Draft',
  },
  no_workflow_state: {
    id: 'no workflow state',
    defaultMessage: 'No workflow state',
  },
  none: {
    id: 'Not available',
    defaultMessage: 'None',
  },
});

const VisualizationUsageView = (props) => {
  const {
    data = {},
    visualizationData,
    baseUrl,
    activePage,
    itemsPerPage,
    pages,
    setActivePage,
    setItemsPerPage,
  } = props;

  const intl = useIntl();
  const {
    title,
    description,
    showDownload = true,
    itemsPerPage: blockItemsPerPage = '10',
  } = data;

  // Memoize calculations to prevent unnecessary re-renders
  const currentItemsPerPage = useMemo(() => 
    blockItemsPerPage || itemsPerPage, 
    [blockItemsPerPage, itemsPerPage]
  );
  
  const itemsPerPageChoices = useMemo(() => [10, 25, 50, 'All'], []);

  return (
    <div className="visualization-usage-block">
      {title && <h3>{title}</h3>}
      {description && <p>{description}</p>}

      {showDownload && (
        <div style={{ marginBottom: '1rem' }}>
          <a
            href={`${baseUrl}/++api++/@@export-visualization-usage`}
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
              <FormattedMessage id="Usage" defaultMessage="Usage" />
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {(!visualizationData || 
            typeof visualizationData !== 'object' || 
            visualizationData === null || 
            !visualizationData.get) && (
            <Table.Row>
              <Table.Cell colSpan="2">
                <Loader active inline="centered" />
              </Table.Cell>
            </Table.Row>
          )}

          {visualizationData && 
           typeof visualizationData === 'object' && 
           visualizationData !== null && 
           visualizationData.get && 
           Object.keys(visualizationData.items || {}).map((item) => (
            <Table.Row key={item}>
              <Table.Cell>
                <strong>{item}</strong>
              </Table.Cell>

              <Table.Cell>
                {(visualizationData?.items?.[item] || []).map((obj) => (
                  <div key={obj.url}>
                    <span>
                      <Circle
                        color={
                          config.settings.workflowMapping[obj.review_state]
                            ?.color || 'grey'
                        }
                        size="15px"
                      />
                    </span>
                    {messages[obj.review_state]
                      ? intl.formatMessage(messages[obj.review_state])
                      : obj.review_title ||
                        obj.review_state ||
                        intl.formatMessage(messages.no_workflow_state)}
                    <span> </span>
                    <a target="_blank" rel="noopener noreferrer" href={obj.url}>
                      {obj.path}
                    </a>
                  </div>
                ))}
              </Table.Cell>
            </Table.Row>
          ))}
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
};

export default VisualizationUsageView;
