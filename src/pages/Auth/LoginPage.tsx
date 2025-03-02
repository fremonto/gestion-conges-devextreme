import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import TextBox from 'devextreme-react/text-box';
import Button from 'devextreme-react/button';
import { login, clearAuthError } from '@/store/auth/authSlice';
import { AppDispatch, RootState } from '@/store';
import './LoginPage.scss';

const LoginPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.auth);
  
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

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-logo">
          <h1>Gestion des Congés</h1>
        </div>
        
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
      </div>
    </div>
  );
};

export default LoginPage;
