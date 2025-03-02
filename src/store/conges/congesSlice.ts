import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { congesService } from '@/api/congesService';
import { DemandeConges } from '@/types/demandeConges';

interface CongesState {
  demandes: DemandeConges[];
  selectedDemande: DemandeConges | null;
  loading: boolean;
  error: string | null;
  totalCount: number;
}

const initialState: CongesState = {
  demandes: [],
  selectedDemande: null,
  loading: false,
  error: null,
  totalCount: 0,
};

export const fetchDemandes = createAsyncThunk(
  'conges/fetchDemandes',
  async (params: { skip?: number; take?: number; filter?: any; sort?: any }, { rejectWithValue }) => {
    try {
      const response = await congesService.getDemandes(params);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Échec de récupération des demandes');
    }
  }
);

export const fetchDemandeById = createAsyncThunk(
  'conges/fetchDemandeById',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await congesService.getDemandeById(id);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Échec de récupération de la demande');
    }
  }
);

export const createDemande = createAsyncThunk(
  'conges/createDemande',
  async (demande: Partial<DemandeConges>, { rejectWithValue }) => {
    try {
      const response = await congesService.createDemande(demande);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Échec de création de la demande');
    }
  }
);

export const updateDemande = createAsyncThunk(
  'conges/updateDemande',
  async ({ id, demande }: { id: number; demande: Partial<DemandeConges> }, { rejectWithValue }) => {
    try {
      const response = await congesService.updateDemande(id, demande);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Échec de mise à jour de la demande');
    }
  }
);

export const deleteDemande = createAsyncThunk(
  'conges/deleteDemande',
  async (id: number, { rejectWithValue }) => {
    try {
      await congesService.deleteDemande(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Échec de suppression de la demande');
    }
  }
);

const congesSlice = createSlice({
  name: 'conges',
  initialState,
  reducers: {
    clearSelectedDemande: (state) => {
      state.selectedDemande = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Demandes
      .addCase(fetchDemandes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDemandes.fulfilled, (state, action) => {
        state.demandes = action.payload.data;
        state.totalCount = action.payload.totalCount;
        state.loading = false;
      })
      .addCase(fetchDemandes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Fetch Demande By Id
      .addCase(fetchDemandeById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDemandeById.fulfilled, (state, action) => {
        state.selectedDemande = action.payload;
        state.loading = false;
      })
      .addCase(fetchDemandeById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Create Demande
      .addCase(createDemande.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createDemande.fulfilled, (state, action) => {
        state.demandes.push(action.payload);
        state.totalCount += 1;
        state.loading = false;
      })
      .addCase(createDemande.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Update Demande
      .addCase(updateDemande.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateDemande.fulfilled, (state, action) => {
        const index = state.demandes.findIndex(
          (demande) => demande.id === action.payload.id
        );
        if (index !== -1) {
          state.demandes[index] = action.payload;
        }
        state.selectedDemande = action.payload;
        state.loading = false;
      })
      .addCase(updateDemande.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Delete Demande
      .addCase(deleteDemande.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteDemande.fulfilled, (state, action) => {
        state.demandes = state.demandes.filter(
          (demande) => demande.id !== action.payload
        );
        state.totalCount -= 1;
        state.loading = false;
      })
      .addCase(deleteDemande.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearSelectedDemande, clearError } = congesSlice.actions;
export default congesSlice.reducer;
