import { StoreApi, UseBoundStore, create } from 'zustand';
import { persist } from 'zustand/middleware';

const initialValue = {
    model: '',
    temperature: 0.5,
    multiplicity: 0.5,
    maxToken: 0.5,
    platformSearch: false,
    knowledgeSearch: true,
    repository: [''],
    GlobalMode: true,
    isStream: true,
    recType: 1,
    searchType: 1,
    style: 1
};

type WithSelectors<S> = S extends { getState: () => infer T } ? S & { use: { [K in keyof T]: () => T[K] } } : never;

const createSelectors = <S extends UseBoundStore<StoreApi<object>>>(_store: S) => {
    const store = _store as WithSelectors<typeof _store>;
    store.use = {};
    for (const k of Object.keys(store.getState())) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (store.use as any)[k] = () => store(s => s[k as keyof typeof s]);
    }

    return store;
};

const useKeyStore = createSelectors(
    create<typeof initialValue>()(
        persist(() => ({ ...initialValue }), {
            name: 'gpt-key'
        })
    )
);

export { useKeyStore };
