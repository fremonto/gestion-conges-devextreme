import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Layout from './components/Layout/Layout';
import DemandeCongesPage from './pages/DemandeConges/DemandeCongesPage';
import LoginPage from './pages/Auth/LoginPage';
import NotFoundPage from './pages/NotFound/NotFoundPage';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import { RootState } from './store';
import { checkAuth } from './store/auth/authSlice';

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, loading } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  if (loading) {
    return <div className="loading-screen">Chargement...</div>;
  }

  return (
    <Routes>
      <Route path="/login" element={!isAuthenticated ? <LoginPage /> : <Navigate to="/" />} />
      
      <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route index element={<Navigate to="/demandes" replace />} />
        <Route path="demandes" element={<DemandeCongesPage />} />
      </Route>
      
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
