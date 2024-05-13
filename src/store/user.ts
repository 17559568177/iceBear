import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

const initialValue = {
    token: localStorage.getItem('user') ?? '',
    usrId: 'Guest',
    nickname: 'Guest',
    avatar: '',
    name: 'Guest',
    role: -1
};

// export const useUserStore = create<typeof initialValue>()(
//     persist(() => initialValue, {name: 'token'})
// )

const useUserStore = create<typeof initialValue>()(immer(persist(() => initialValue, { name: 'user' })));

export { useUserStore };
