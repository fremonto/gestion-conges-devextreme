import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import DataGrid, {
  Column,
  Paging,
  Pager,
  FilterRow,
  HeaderFilter,
  Editing,
  Lookup,
  Form,
  Popup,
  ColumnFixing,
  Export,
  Selection,
  Toolbar,
  Item,
} from 'devextreme-react/data-grid';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { AppDispatch, RootState } from '@/store';
import { User, UserRole } from '@/types/user';
import './AdminPage.scss';

// Simuler des requêtes API pour les utilisateurs
const fetchUsersApi = async () => {
  // Dans une vraie application, cette fonction appellerait une API
  // Ici, nous retournons des données fictives pour la démonstration
  return {
    data: [
      {
        id: 1,
        name: 'Admin Système',
        email: 'admin@example.com',
        role: 'ADMIN',
        department: 'Informatique',
        soldeConges: 25,
        soldeRtt: 10,
        dateCreation: '2023-01-01',
        actif: true,
      },
      {
        id: 2,
        name: 'Manager RH',
        email: 'manager@example.com',
        role: 'MANAGER',
        department: 'Ressources Humaines',
        soldeConges: 25,
        soldeRtt: 10,
        dateCreation: '2023-01-15',
        actif: true,
      },
      {
        id: 3,
        name: 'Utilisateur Standard',
        email: 'user@example.com',
        role: 'USER',
        department: 'Marketing',
        soldeConges: 25,
        soldeRtt: 10,
        dateCreation: '2023-02-01',
        actif: true,
      },
    ],
  };
};

// Actions Redux pour gérer les utilisateurs
export const fetchUsers = createAsyncThunk('admin/fetchUsers', async () => {
  const response = await fetchUsersApi();
  return response.data;
});

const AdminPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUsers = async () => {
      setLoading(true);
      try {
        const resultAction = await dispatch(fetchUsers());
        if (fetchUsers.fulfilled.match(resultAction)) {
          setUsers(resultAction.payload);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des utilisateurs:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, [dispatch]);

  const handleRowUpdating = (e: any) => {
    // Dans une vraie application, cette fonction appellerait une API
    // pour mettre à jour l'utilisateur
    const updatedUsers = [...users];
    const index = updatedUsers.findIndex((u) => u.id === e.key);
    updatedUsers[index] = { ...updatedUsers[index], ...e.newData };
    setUsers(updatedUsers);
    e.cancel = true; // Annuler l'opération DataGrid par défaut
  };

  const handleRowRemoving = (e: any) => {
    // Dans une vraie application, cette fonction appellerait une API
    // pour supprimer l'utilisateur
    const filteredUsers = users.filter((u) => u.id !== e.key);
    setUsers(filteredUsers);
    e.cancel = true; // Annuler l'opération DataGrid par défaut
  };

  const handleRowInserting = (e: any) => {
    // Dans une vraie application, cette fonction appellerait une API
    // pour ajouter l'utilisateur
    const newUser = {
      ...e.data,
      id: Math.max(...users.map((u) => u.id)) + 1,
      dateCreation: new Date().toISOString(),
    };
    setUsers([...users, newUser]);
    e.cancel = true; // Annuler l'opération DataGrid par défaut
  };

  const departmentOptions = [
    'Ressources Humaines',
    'Informatique',
    'Finance',
    'Marketing',
    'Production',
    'Ventes',
    'Direction',
  ];

  const roleOptions = [
    { value: 'USER', text: 'Utilisateur' },
    { value: 'MANAGER', text: 'Manager' },
    { value: 'ADMIN', text: 'Administrateur' },
  ];

  return (
    <div className="admin-page">
      <h1 className="page-title">Administration des utilisateurs</h1>

      <div className="card">
        <DataGrid
          dataSource={users}
          showBorders={true}
          focusedRowEnabled={true}
          keyExpr="id"
          rowAlternationEnabled={true}
          columnAutoWidth={true}
          wordWrapEnabled={true}
          height="calc(100vh - 180px)"
          onRowUpdating={handleRowUpdating}
          onRowRemoving={handleRowRemoving}
          onRowInserting={handleRowInserting}
        >
          <Selection mode="single" />
          <FilterRow visible={true} />
          <HeaderFilter visible={true} />
          <ColumnFixing enabled={true} />
          <Export enabled={true} />
          <Editing
            mode="popup"
            allowUpdating={true}
            allowAdding={true}
            allowDeleting={true}
            useIcons={true}
          >
            <Popup
              title="Informations utilisateur"
              showTitle={true}
              width={700}
              height="auto"
            />
            <Form>
              <Item itemType="group" colCount={2} colSpan={2}>
                <Item dataField="name" />
                <Item dataField="email" />
                <Item dataField="role" />
                <Item dataField="department" />
                <Item dataField="soldeConges" />
                <Item dataField="soldeRtt" />
                <Item dataField="actif" />
              </Item>
            </Form>
          </Editing>

          <Column
            dataField="id"
            caption="ID"
            dataType="number"
            width={70}
            allowEditing={false}
            fixed={true}
          />
          <Column
            dataField="name"
            caption="Nom"
            dataType="string"
            validationRules={[{ type: 'required' }]}
          />
          <Column
            dataField="email"
            caption="Email"
            dataType="string"
            validationRules={[{ type: 'required' }, { type: 'email' }]}
          />
          <Column
            dataField="role"
            caption="Rôle"
            dataType="string"
            validationRules={[{ type: 'required' }]}
          >
            <Lookup
              dataSource={roleOptions}
              valueExpr="value"
              displayExpr="text"
            />
          </Column>
          <Column
            dataField="department"
            caption="Département"
            dataType="string"
            validationRules={[{ type: 'required' }]}
          >
            <Lookup dataSource={departmentOptions} />
          </Column>
          <Column
            dataField="soldeConges"
            caption="Solde CP"
            dataType="number"
            validationRules={[{ type: 'required' }, { type: 'range', min: 0, max: 100 }]}
          />
          <Column
            dataField="soldeRtt"
            caption="Solde RTT"
            dataType="number"
            validationRules={[{ type: 'required' }, { type: 'range', min: 0, max: 50 }]}
          />
          <Column
            dataField="dateCreation"
            caption="Date création"
            dataType="date"
            allowEditing={false}
          />
          <Column
            dataField="actif"
            caption="Actif"
            dataType="boolean"
          />

          <Paging defaultPageSize={10} />
          <Pager
            showPageSizeSelector={true}
            allowedPageSizes={[10, 20, 50]}
            showInfo={true}
          />

          <Toolbar>
            <Item name="addRowButton" showText="always" />
            <Item name="exportButton" />
            <Item name="columnChooserButton" />
          </Toolbar>
        </DataGrid>
      </div>
    </div>
  );
};

export default AdminPage;
