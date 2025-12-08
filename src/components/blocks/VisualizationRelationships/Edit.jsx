import { compose } from 'redux';
import { SidebarPortal } from '@plone/volto/components';
import InlineForm from '@plone/volto/components/manage/Form/InlineForm';
import VisualizationRelationshipsView from './View';
import { VisualizationRelationshipsSchema } from './schema';
import { connectToVisualizationRelationships } from '../../../hocs/connectToVisualizationRelationships';

// Memoize schema to prevent recreation on every render
const schema = VisualizationRelationshipsSchema();

const VisualizationRelationshipsEdit = (props) => {
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
      <VisualizationRelationshipsView
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

export default compose(connectToVisualizationRelationships())(
  VisualizationRelationshipsEdit,
);
