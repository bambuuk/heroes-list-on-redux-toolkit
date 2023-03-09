import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { useHttp } from "../../hooks/http.hook";

const initialState = {
  filters: [],
  filtersLoadingStatus: 'idle',
  activeFilter: 'all'
}

// в данном методе должны возвращать промис и обрабатывать его
// в extraReducers метода createSlice
export const fetchFilters = createAsyncThunk(
  'filters/fetchFilters',
  () => {
    const { request } = useHttp();
    return request("http://localhost:3001/filters");
  }
)

const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    filtersActiveFilterChanged: (state, action) => {
      state.activeFilter = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFilters.pending, state => { state.filtersLoadingStatus = 'loading' })
      .addCase(fetchFilters.fulfilled, (state, action) => {
        state.filters = action.payload;
        state.filtersLoadingStatus = 'idle';
      })
      .addCase(fetchFilters.rejected, state => { state.filtersLoadingStatus = 'error' })
  }
});

const { actions, reducer } = filtersSlice;

export default reducer;
export const {
  filtersFetching,
  filtersFetched,
  filtersFetchingError,
  filtersActiveFilterChanged
} = actions;

