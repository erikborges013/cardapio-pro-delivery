import { getActivePinia, type Store } from "pinia";

export function destruirStores(): void {
    const pinia = getActivePinia() as any;
    console.log("Destruindo stores");
    if (pinia) {
        const stores = pinia._s as Record<string, Store>;

        Object.values(stores).forEach((store) => {
            if (typeof store.$reset === "function") {
                store.$reset();
            }
        });
    }
}