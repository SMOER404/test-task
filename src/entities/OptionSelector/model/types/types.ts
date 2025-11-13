export interface Option {
    name: string;
    value: string;
}

export interface OptionState {
    options: Option[];
    selectedOption: string | null;
    isLoading: boolean;
    error: string | null;
    message: string | null;
}
