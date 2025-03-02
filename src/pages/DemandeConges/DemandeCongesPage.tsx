import { useEffect, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import DataGrid, {
  Column,
  Paging,
  Pager,
  FilterRow,
  HeaderFilter,
  ColumnChooser,
  SearchPanel,
  Export,
  Editing,
  Toolbar,
  Item,
  Selection,
} from 'devextreme-react/data-grid';
import Button from 'devextreme-react/button';
import Popup from 'devextreme-react/popup';
import { AppDispatch, RootState } from '@/store';
import { fetchDemandes, fetchDemandeById } from '@/store/conges/congesSlice';
import StatusBadge from '@/components/Conges/StatusBadge';
import DemandeCongesForm from './DemandeCongesForm';
import './DemandeCongesPage.scss';

const DemandeCongesPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { demandes, selectedDemande, loading, totalCount } = useSelector(
    (state: RootState) => state.conges
  );
  
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [isNewDemande, setIsNewDemande] = useState(false);

  useEffect(() => {
    dispatch(fetchDemandes({}));
  }, [dispatch]);

  const handleEdit = useCallback((e: any) => {
    dispatch(fetchDemandeById(e.row.data.id)).then(() => {
      setIsNewDemande(false);
      setIsPopupVisible(true);
    });
  }, [dispatch]);

  const handleAdd = useCallback(() => {
    setIsNewDemande(true);
    setIsPopupVisible(true);
  }, []);

  const handlePopupClose = useCallback(() => {
    setIsPopupVisible(false);
  }, []);

  const renderStatusCell = (data: any) => {
    return <StatusBadge status={data.value} />;
  };

  const renderDateCell = (data: any) => {
    if (!data.value) return '';
    const date = new Date(data.value);
    return date.toLocaleDateString('fr-FR');
  };

  return (
    <div className="demandes-conges-page">
      <h1 className="page-title">Demandes de congés</h1>

      <div className="card">
        <DataGrid
          dataSource={demandes}
          showBorders={true}
          focusedRowEnabled={true}
          keyExpr="id"
          rowAlternationEnabled={true}
          columnAutoWidth={true}
          wordWrapEnabled={true}
          height="calc(100vh - 180px)"
          onRowDblClick={handleEdit}
        >
          <Selection mode="single" />
          <SearchPanel visible={true} highlightCaseSensitive={true} />
          <FilterRow visible={true} />
          <HeaderFilter visible={true} />
          <ColumnChooser enabled={true} />
          <Export enabled={true} allowExportSelectedData={true} />
          <Editing
            mode="popup"
            allowUpdating={false}
            allowAdding={false}
            allowDeleting={false}
          />
          <Paging defaultPageSize={10} />
          <Pager
            showPageSizeSelector={true}
            allowedPageSizes={[10, 20, 50]}
            showInfo={true}
          />

          <Column
            dataField="id"
            caption="ID"
            dataType="number"
            width={70}
            alignment="center"
          />
          <Column
            dataField="userName"
            caption="Employé"
            dataType="string"
          />
          <Column
            dataField="userDepartment"
            caption="Département"
            dataType="string"
          />
          <Column
            dataField="dateDebut"
            caption="Date début"
            dataType="date"
            cellRender={renderDateCell}
          />
          <Column
            dataField="dateFin"
            caption="Date fin"
            dataType="date"
            cellRender={renderDateCell}
          />
          <Column
            dataField="duree"
            caption="Durée (jours)"
            dataType="number"
            alignment="center"
          />
          <Column
            dataField="typeConge"
            caption="Type"
            dataType="string"
          />
          <Column
            dataField="status"
            caption="Statut"
            dataType="string"
            cellRender={renderStatusCell}
          />
          <Column
            dataField="dateCreation"
            caption="Date création"
            dataType="date"
            cellRender={renderDateCell}
            visible={false}
          />
          <Column
            dataField="motif"
            caption="Motif"
            dataType="string"
            visible={false}
          />
          <Column type="buttons">
            <Item name="edit" />
          </Column>

          <Toolbar>
            <Item location="before">
              <Button
                icon="plus"
                text="Nouvelle demande"
                type="default"
                onClick={handleAdd}
              />
            </Item>
            <Item name="columnChooserButton" />
            <Item name="searchPanel" />
            <Item name="exportButton" />
          </Toolbar>
        </DataGrid>
      </div>

      <Popup
        title={isNewDemande ? "Nouvelle demande de congés" : "Détails de la demande"}
        showTitle={true}
        visible={isPopupVisible}
        onHiding={handlePopupClose}
        dragEnabled={false}
        closeOnOutsideClick={true}
        showCloseButton={true}
        width={600}
        height="auto"
        className="demande-popup"
      >
        <DemandeCongesForm
          isNew={isNewDemande}
          onClose={handlePopupClose}
        />
      </Popup>
    </div>
  );
};

export default DemandeCongesPage;
