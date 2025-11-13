import {SelectedOptionResponse} from "./types/types";
import {Option} from "entities/OptionSelector";

const API_BASE = 'http://localhost:8000';

export const apiService = {

    async fetchOptions(): Promise<Option[]> {
        const response = await fetch(`${API_BASE}/options/for/select`);

        if (!response.ok) {
            throw new Error(`Failed to fetch options: ${response.statusText}`);
        }

        return response.json();
    },

    async sendSelectedOption(value: string): Promise<SelectedOptionResponse> {
        const response = await fetch(`${API_BASE}/selected/option`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({value}),
        });

        if (!response.ok) {
            throw new Error(`Failed to send option: ${response.statusText}`);
        }

        return response.json();
    },
};

