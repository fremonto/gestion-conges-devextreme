import { useNavigate } from 'react-router-dom';
import Button from 'devextreme-react/button';
import './NotFoundPage.scss';

const NotFoundPage = () => {
  const navigate = useNavigate();

  const handleReturn = () => {
    navigate('/');
  };

  return (
    <div className="not-found-page">
      <div className="not-found-container">
        <h1 className="error-code">404</h1>
        <h2 className="error-title">Page non trouvée</h2>
        <p className="error-description">
          La page que vous recherchez n'existe pas ou a été déplacée.
        </p>
        <Button
          text="Retour à l'accueil"
          type="default"
          onClick={handleReturn}
          width={200}
        />
      </div>
    </div>
  );
};

export default NotFoundPage;
