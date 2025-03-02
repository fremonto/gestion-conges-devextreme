import React from 'react';
import { Button } from 'devextreme-react/button';

interface RegisterSuccessProps {
  onClose: () => void;
}

const RegisterSuccess: React.FC<RegisterSuccessProps> = ({ onClose }) => {
  return (
    <div className="register-success">
      <div className="success-icon">
        <i className="dx-icon-check"></i>
      </div>
      <h3>Inscription réussie!</h3>
      <p>Votre compte a été créé avec succès.</p>
      <p>Vous pouvez maintenant vous connecter avec vos identifiants.</p>
      <Button
        text="Retour à la connexion"
        type="default"
        onClick={onClose}
      />
    </div>
  );
};

export default RegisterSuccess;
