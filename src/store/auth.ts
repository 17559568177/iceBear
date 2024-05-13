import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

export interface TypePermissions {
    pages: string[];
    menus: string[];
    mebuttonsnus: string[];
}

const initialValue = {
    permissions: {
        pages: ['Login', 'DashBoard', 'Assistant', 'Violation', 'Repository']
    } as TypePermissions
};

// export const useUserStore = create<typeof initialValue>()(
//     persist(() => initialValue, {name: 'token'})
// )

const useAuthStore = create<typeof initialValue>()(immer(() => initialValue));

export { useAuthStore };
