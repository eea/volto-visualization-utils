import { compose } from 'redux';
import { SidebarPortal } from '@plone/volto/components';
import InlineForm from '@plone/volto/components/manage/Form/InlineForm';
import VisualizationUsageView from './View';
import { VisualizationUsageSchema } from './schema';
import { connectToVisualizationUsage } from '../../../hocs/connectToVisualizationUsage';

// Memoize schema to prevent recreation on every render
const schema = VisualizationUsageSchema();

const VisualizationUsageEdit = (props) => {
  const {
    block,
    data,
    selected,
    onChangeBlock,
    visualizationData,
    baseUrl,
    activePage,
    itemsPerPage,
    pages,
    setActivePage,
    setItemsPerPage,
  } = props;

  return (
    <>
      <VisualizationUsageView
        data={data}
        visualizationData={visualizationData}
        baseUrl={baseUrl}
        activePage={activePage}
        itemsPerPage={itemsPerPage}
        pages={pages}
        setActivePage={setActivePage}
        setItemsPerPage={setItemsPerPage}
      />
      <SidebarPortal selected={selected}>
        <InlineForm
          schema={schema}
          title={schema.title}
          onChangeField={(id, value) => {
            onChangeBlock(block, {
              ...data,
              [id]: value,
            });
          }}
          formData={data}
        />
      </SidebarPortal>
    </>
  );
};

export default compose(connectToVisualizationUsage())(VisualizationUsageEdit);
