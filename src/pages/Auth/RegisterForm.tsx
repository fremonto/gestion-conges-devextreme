import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Form, { 
  Item, 
  ButtonItem, 
  RequiredRule, 
  EmailRule, 
  StringLengthRule,
  CustomRule 
} from 'devextreme-react/form';
import { register } from '@/store/auth/authSlice';
import { AppDispatch, RootState } from '@/store';
import './RegisterForm.scss';

interface RegisterFormProps {
  onSuccess: () => void;
}

const RegisterForm = ({ onSuccess }: RegisterFormProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error, registrationSuccess } = useSelector((state: RootState) => state.auth);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    department: ''
  });

  // Surveiller le succès de l'inscription pour appeler onSuccess
  useEffect(() => {
    if (registrationSuccess) {
      onSuccess();
    }
  }, [registrationSuccess, onSuccess]);

  const handleFieldChange = (e: any) => {
    const { dataField, value } = e.component.option();
    setFormData({
      ...formData,
      [dataField]: value
    });
  };

  const comparePasswords = (e: any) => {
    return formData.password === formData.confirmPassword;
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    // Supprimer le champ confirmPassword avant d'envoyer à l'API
    const { confirmPassword, ...userData } = formData;
    
    // Simulation d'API pour le développement local
    // Dans une vraie application, ceci serait la vraie requête API
    if (process.env.NODE_ENV === 'development') {
      console.log('Inscription simulée en mode développement:', userData);
      // Simuler un délai de traitement de 1 seconde
      setTimeout(() => {
        onSuccess();
      }, 1000);
      return;
    }
    
    dispatch(register(userData));
  };

  const departmentOptions = [
    'Ressources Humaines',
    'Informatique',
    'Finance',
    'Marketing',
    'Production',
    'Ventes',
    'Direction'
  ];

  return (
    <div className="register-form">
      {error && <div className="form-error">{error}</div>}
      
      <Form
        formData={formData}
        onFieldDataChanged={handleFieldChange}
        showColonAfterLabel={false}
        labelLocation="top"
      >
        <Item
          dataField="name"
          label={{ text: "Nom complet" }}
        >
          <RequiredRule message="Le nom est requis" />
        </Item>
        
        <Item
          dataField="email"
          label={{ text: "Email" }}
        >
          <RequiredRule message="L'email est requis" />
          <EmailRule message="Format d'email invalide" />
        </Item>
        
        <Item
          dataField="department"
          editorType="dxSelectBox"
          editorOptions={{
            items: departmentOptions,
            searchEnabled: true,
            placeholder: "Sélectionnez un département"
          }}
          label={{ text: "Département" }}
        >
          <RequiredRule message="Le département est requis" />
        </Item>
        
        <Item
          dataField="password"
          editorType="dxTextBox"
          editorOptions={{ mode: 'password' }}
          label={{ text: "Mot de passe" }}
        >
          <RequiredRule message="Le mot de passe est requis" />
          <StringLengthRule min={6} message="Le mot de passe doit contenir au moins 6 caractères" />
        </Item>
        
        <Item
          dataField="confirmPassword"
          editorType="dxTextBox"
          editorOptions={{ mode: 'password' }}
          label={{ text: "Confirmer le mot de passe" }}
        >
          <RequiredRule message="La confirmation du mot de passe est requise" />
          <StringLengthRule min={6} message="Le mot de passe doit contenir au moins 6 caractères" />
          <CustomRule
            message="Les mots de passe ne correspondent pas"
            validationCallback={comparePasswords}
          />
        </Item>
        
        <ButtonItem
          buttonOptions={{
            text: "S'inscrire",
            type: "default",
            useSubmitBehavior: true,
            onClick: handleSubmit,
            disabled: loading
          }}
        />
      </Form>
    </div>
  );
};

export default RegisterForm;
