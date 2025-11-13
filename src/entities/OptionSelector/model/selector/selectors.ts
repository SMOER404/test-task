import {RootStore} from "app/providers/StoreProvider";

export const selectOptions = (state: RootStore) => state.optionSelector.options;
export const selectSelectedValue = (state: RootStore) => state.optionSelector.selectedOption;
export const selectLoading = (state: RootStore) => state.optionSelector.isLoading;
export const selectMessage = (state: RootStore) => state.optionSelector.message;
export const selectError = (state: RootStore) => state.optionSelector.error;


