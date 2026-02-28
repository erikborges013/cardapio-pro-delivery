import { addDoc, collection, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase-config";
import IAdicionais from "../interfaces/IAdicionais";
import { useAdicionaisStore } from "../stores/listaDeAdicionaisStore";
import { listaDeProdutos } from "../stores/listaDeProdutosStore";
import useProduto from "./useProduto";
import converterParaNumber from "../utils/normalizarPreco";

export default function useAdicionais(uid: string) {
    const editar = async (dados: any, id: string) => {
        const updateData = { ...dados };
        const adicionalRef = doc(db, "usuarios", uid, "adicionais", id);
        try {
            await updateDoc(adicionalRef, updateData);
        } catch (error) {
            console.error("Erro ao tentar atualizar adicional: ", error);
            alert("Erro ao tentar atualizar adicional.");
        }

    }

    const cadastrar = async (dados: any) => {
        try {
            await addDoc(collection(db, "usuarios", uid, "adicionais"), {
                ...dados,
                criadoEm: new Date(),
            });
        } catch (error) {
            console.error("Erro ao editar adicional", error);
        }
    }

    const limparStatus = () => {
        const adicionalStore = useAdicionaisStore();
        if (adicionalStore.adicionalEmEdicao !== null) {
            adicionalStore.adicionalEmEdicao = null;
        }
    }

    const deletar = async (id: string): Promise<boolean> => {
        try {
            await deleteDoc(doc(db, "usuarios", uid, "adicionais", id));
            return true;
        } catch (error) {
            console.error("Erro ao tentar deletar adicionais");
            return false;
        }
    }
    return { editar, cadastrar, limparStatus, deletar };
}