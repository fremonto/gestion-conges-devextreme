import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Form, { 
  Item, 
  ButtonItem, 
  RequiredRule, 
  EmailRule, 
  StringLengthRule, 
  CustomRule
} from 'devextreme-react/form';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { authService } from '@/api/authService';
import { AppDispatch, RootState } from '@/store';
import RegisterSuccess from './registerSuccess';
import './RegisterForm.scss';

// Action asynchrone pour l'inscription
export const register = createAsyncThunk(
  'auth/register',
  async (userData: any, { rejectWithValue }) => {
    try {
      const response = await authService.register(userData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Échec de l\'inscription');
    }
  }
);

interface RegisterFormProps {
  onSuccess: () => void;
}

const RegisterForm = ({ onSuccess }: RegisterFormProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.auth);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    department: ''
  });
  
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

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
    
    const resultAction = await dispatch(register(userData));
    
    if (register.fulfilled.match(resultAction)) {
      setRegistrationSuccess(true);
    }
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
  
  const handleRegistrationSuccess = () => {
    setRegistrationSuccess(false);
    onSuccess();
  };

  if (registrationSuccess) {
    return <RegisterSuccess onClose={handleRegistrationSuccess} />;
  }

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
