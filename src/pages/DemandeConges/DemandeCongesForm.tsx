import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Form, { Item, GroupItem, Label } from 'devextreme-react/form';
import DateBox from 'devextreme-react/date-box';
import SelectBox from 'devextreme-react/select-box';
import TextArea from 'devextreme-react/text-area';
import Button from 'devextreme-react/button';
import { AppDispatch, RootState } from '@/store';
import { createDemande, updateDemande, fetchDemandes } from '@/store/conges/congesSlice';
import { DemandeConges, CongeType } from '@/types/demandeConges';
import StatusBadge from '@/components/Conges/StatusBadge';
import './DemandeCongesForm.scss';

interface DemandeCongesFormProps {
  isNew: boolean;
  onClose: () => void;
}

const typeCongeOptions = [
  { value: 'Congés payés', text: 'Congés payés' },
  { value: 'RTT', text: 'RTT' },
  { value: 'Maladie', text: 'Maladie' },
  { value: 'Sans solde', text: 'Sans solde' },
  { value: 'Autre', text: 'Autre' },
];

const DemandeCongesForm = ({ isNew, onClose }: DemandeCongesFormProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { selectedDemande, loading, error } = useSelector((state: RootState) => state.conges);
  const { user } = useSelector((state: RootState) => state.auth);
  
  const [formData, setFormData] = useState<Partial<DemandeConges>>({
    dateDebut: new Date(),
    dateFin: new Date(),
    duree: 1,
    typeConge: 'Congés payés' as CongeType,
    motif: '',
    status: 'En attente',
  });
  
  useEffect(() => {
    if (selectedDemande && !isNew) {
      const startDate = selectedDemande.dateDebut 
        ? new Date(selectedDemande.dateDebut) 
        : new Date();
      
      const endDate = selectedDemande.dateFin 
        ? new Date(selectedDemande.dateFin) 
        : new Date();
      
      setFormData({
        ...selectedDemande,
        dateDebut: startDate,
        dateFin: endDate,
      });
    } else if (isNew) {
      setFormData({
        dateDebut: new Date(),
        dateFin: new Date(),
        duree: 1,
        typeConge: 'Congés payés' as CongeType,
        motif: '',
        status: 'En attente',
      });
    }
  }, [selectedDemande, isNew]);
  
  const handleSubmit = async () => {
    if (isNew) {
      await dispatch(createDemande({
        ...formData,
        userId: user?.id,
        userName: user?.name,
        userDepartment: user?.department,
      }));
    } else {
      await dispatch(updateDemande({
        id: selectedDemande?.id as number,
        demande: formData,
      }));
    }
    
    dispatch(fetchDemandes({}));
    onClose();
  };
  
  const handleDateChange = (e: any) => {
    const { name, value } = e.element.dataset;
    
    const startDate = name === 'dateDebut' ? new Date(value) : new Date(formData.dateDebut as Date);
    const endDate = name === 'dateFin' ? new Date(value) : new Date(formData.dateFin as Date);
    
    // Calculer la durée en jours (hors week-ends)
    const duree = calculateWorkingDays(startDate, endDate);
    
    setFormData({
      ...formData,
      [name]: value,
      duree,
    });
  };
  
  const calculateWorkingDays = (startDate: Date, endDate: Date) => {
    let count = 0;
    const curDate = new Date(startDate.getTime());
    
    while (curDate <= endDate) {
      const dayOfWeek = curDate.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        count++;
      }
      curDate.setDate(curDate.getDate() + 1);
    }
    
    return count;
  };
  
  const handleChange = (e: any) => {
    const { name, value } = e.element ? e.element.dataset : e;
    
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  
  const renderStatus = () => {
    if (!formData.status) return null;
    
    return (
      <div className="status-container">
        <StatusBadge status={formData.status} />
        {formData.validateurNom && (
          <div className="validateur-info">
            Validé par: {formData.validateurNom}
          </div>
        )}
      </div>
    );
  };
  
  return (
    <div className="demande-conges-form">
      {error && <div className="form-error">{error}</div>}
      
      <Form
        formData={formData}
        labelLocation="top"
        showColonAfterLabel={false}
      >
        {!isNew && (
          <GroupItem>
            <Item
              render={renderStatus}
            />
          </GroupItem>
        )}
        
        <GroupItem caption="Période">
          <Item
            dataField="dateDebut"
            editorType="dxDateBox"
            editorOptions={{
              type: 'date',
              onValueChanged: handleDateChange,
              elementAttr: { 'data-name': 'dateDebut' },
              min: new Date(),
              disabled: !isNew && formData.status !== 'En attente',
            }}
          />
          
          <Item
            dataField="dateFin"
            editorType="dxDateBox"
            editorOptions={{
              type: 'date',
              onValueChanged: handleDateChange,
              elementAttr: { 'data-name': 'dateFin' },
              min: formData.dateDebut as Date,
              disabled: !isNew && formData.status !== 'En attente',
            }}
          />
          
          <Item
            dataField="duree"
            editorType="dxNumberBox"
            editorOptions={{
              readOnly: true,
              min: 1,
            }}
          />
        </GroupItem>
        
        <GroupItem caption="Informations">
          <Item
            dataField="typeConge"
            editorType="dxSelectBox"
            editorOptions={{
              items: typeCongeOptions,
              valueExpr: 'value',
              displayExpr: 'text',
              onValueChanged: handleChange,
              elementAttr: { 'data-name': 'typeConge' },
              disabled: !isNew && formData.status !== 'En attente',
            }}
          />
          
          <Item
            dataField="motif"
            editorType="dxTextArea"
            editorOptions={{
              height: 90,
              onValueChanged: handleChange,
              elementAttr: { 'data-name': 'motif' },
              disabled: !isNew && formData.status !== 'En attente',
            }}
          />
        </GroupItem>
        
        {!isNew && formData.commentaire && (
          <GroupItem caption="Commentaire du validateur">
            <Item
              dataField="commentaire"
              editorType="dxTextArea"
              editorOptions={{
                height: 60,
                readOnly: true,
              }}
            />
          </GroupItem>
        )}
      </Form>
      
      <div className="form-actions">
        <Button
          text="Annuler"
          type="normal"
          onClick={onClose}
        />
        
        {(isNew || formData.status === 'En attente') && (
          <Button
            text={isNew ? "Créer" : "Mettre à jour"}
            type="default"
            onClick={handleSubmit}
            disabled={loading}
          />
        )}
      </div>
    </div>
  );
};

export default DemandeCongesForm;
