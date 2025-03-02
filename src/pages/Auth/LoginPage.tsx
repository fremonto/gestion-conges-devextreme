import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import TextBox from 'devextreme-react/text-box';
import Button from 'devextreme-react/button';
import Tabs from 'devextreme-react/tabs';
import { login, clearAuthError, register } from '@/store/auth/authSlice';
import { AppDispatch, RootState } from '@/store';
import RegisterForm from './RegisterForm';
import './LoginPage.scss';

const LoginPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.auth);
  
  const [activeTab, setActiveTab] = useState(0);
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e: any) => {
    const { name, value } = e.element.dataset;
    
    if (error) {
      dispatch(clearAuthError());
    }
    
    setCredentials({
      ...credentials,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!credentials.email || !credentials.password) {
      return;
    }
    
    dispatch(login(credentials));
  };

  const handleTabChange = (e: any) => {
    setActiveTab(e.value);
    // Effacer les erreurs lors du changement d'onglet
    if (error) {
      dispatch(clearAuthError());
    }
  };

  const handleRegisterSuccess = () => {
    // Revenir à l'onglet de connexion après une inscription réussie
    setActiveTab(0);
  };

  const tabItems = [
    { text: 'Connexion', id: 0 },
    { text: 'Inscription', id: 1 }
  ];

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-logo">
          <h1>Gestion des Congés</h1>
        </div>
        
        <Tabs
          items={tabItems}
          selectedIndex={activeTab}
          onSelectedIndexChange={handleTabChange}
          className="auth-tabs"
        />
        
        {activeTab === 0 ? (
          <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <TextBox
                id="email"
                name="email"
                value={credentials.email}
                onValueChanged={handleChange}
                elementAttr={{ 'data-name': 'email' }}
                placeholder="Entrez votre email"
                mode="email"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Mot de passe</label>
              <TextBox
                id="password"
                name="password"
                value={credentials.password}
                onValueChanged={handleChange}
                elementAttr={{ 'data-name': 'password' }}
                placeholder="Entrez votre mot de passe"
                mode="password"
              />
            </div>
            
            {error && <div className="login-error">{error}</div>}
            
            <div className="form-group">
              <Button
                text="Se connecter"
                type="default"
                useSubmitBehavior={true}
                width="100%"
                disabled={loading}
              />
            </div>
            
            <div className="login-links">
              <a href="#" className="forgot-password">
                Mot de passe oublié?
              </a>
            </div>
          </form>
        ) : (
          <RegisterForm onSuccess={handleRegisterSuccess} />
        )}
      </div>
    </div>
  );
};

export default LoginPage;
