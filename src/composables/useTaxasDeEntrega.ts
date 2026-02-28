import { addDoc, collection, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase-config";
import ITaxasDeEntrega from "../interfaces/ITaxasDeEntrega";
import { useTaxasDeEntregaStore } from "../stores/taxasDeEntregaStore";

export default function useTaxasDeEntrega(uid: string) {
    const cadastrar = async (dados: any) => {
        try {
            const colecaoRef = collection(db, "usuarios", uid, "taxas-de-entrega");
            await addDoc(colecaoRef, dados);
            return true
        } catch (error) {
            console.log("Erro ao tentar enviar as taxas para o banco de dados");
            return false;
        }
    }

    const editar = async (dados: any, id: string) => {
        try {
            const docRef = doc(db, "usuarios", uid, "taxas-de-entrega", id);
            await updateDoc(docRef, dados);
            alert("Taxa atualizada com sucesso!");
        } catch (error) {
            console.log("Erro ao editar taxa");
        }
    }

    const limparStatus = async () => {
        const taxaStore = useTaxasDeEntregaStore();
        if (taxaStore.taxaEmEdicao !== null) {
            taxaStore.taxaEmEdicao = null;
        }
    }

    const deletar = async (id: string) => {
        try {
            await deleteDoc(doc(db, "usuarios", uid, "taxas-de-entrega", id));
            alert("Taxa de entrega apagada com sucesso!");
        } catch (error) {
            console.log("Erro ao tentar apagar taxa de entrega", error);
        }

    }
    return { cadastrar, editar, limparStatus, deletar };
}