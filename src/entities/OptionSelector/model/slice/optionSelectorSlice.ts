import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {Option, OptionState} from "entities/OptionSelector";
import {apiService} from "../../../../services/api";

// Асинхронные thunk actions
export const fetchOptions = createAsyncThunk(
    'optionSelector/fetchOptions',
    async (_, {rejectWithValue}) => {
        try {
            return await apiService.fetchOptions();
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const sendSelectedOption = createAsyncThunk(
    'optionSelector/sendSelectedOption',
    async (value: string, {rejectWithValue}) => {
        try {
            return await apiService.sendSelectedOption(value);
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);


const initialState: OptionState = {
    options: [],
    selectedOption: null,
    message: null,
    isLoading: false,
    error: null,
};

const optionSelectorSlice = createSlice({
    name: 'optionSelector',
    initialState,
    reducers: {
        setOptions: (state, action: PayloadAction<Option[]>) => {
            state.options = action.payload;
        },
        setSelectedValue: (state, action: PayloadAction<string | null>) => {
            state.selectedOption = action.payload;
        },
        setMessage: (state, action: PayloadAction<string | null>) => {
            state.message = action.payload;
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        reset: () => initialState,
    },
    extraReducers: (builder) => {
        builder
            // fetchOptions cases
            .addCase(fetchOptions.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchOptions.fulfilled, (state, action) => {
                state.isLoading = false;
                state.options = action.payload;
            })
            .addCase(fetchOptions.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            // sendSelectedOption cases
            .addCase(sendSelectedOption.fulfilled, (state, action) => {
                state.message = action.payload.message;
            })
            .addCase(sendSelectedOption.rejected, (state, action) => {
                state.error = action.payload as string;
            });
    },
});

export const {reducer: optionSelectorReducer} = optionSelectorSlice;
export const {actions: optionSelectorActions} = optionSelectorSlice;

