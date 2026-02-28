import { getDoc, doc } from "firebase/firestore";
import { db } from "../firebase-config";
import { useAuthStore } from "../stores/authStore";

export async function buscarDataCriacaoConta() {
    const uid = useAuthStore().uid;
    if (uid) {
        const dataRef = doc(db, "usuarios", uid);
        const dados = await getDoc(dataRef);
        const data = dados.data()?.createdAt.toDate();
        data.setHours(0,0,0,0);
        return data;
    }
    
}