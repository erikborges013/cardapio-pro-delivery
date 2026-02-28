import { addDoc, collection, deleteDoc, doc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { db } from "../firebase-config";
import IDadosCategoria from "../interfaces/IDadosCategorias";
import { useCategoriaStore } from "../stores/listaDeCategoriasStore";

export default function useCategorias(userId: string) {
    const cadastrar = async (dados: IDadosCategoria) => {
        const { nome, ordem } = dados;
        try {
            await addDoc(collection(db, "usuarios", userId, "categorias"), {
                nome: nome,
                ordem: ordem,
            });
            alert("Categoria cadastrada com sucesso!");
        } catch (error) {
            console.error("Erro ao tentar cadastrar nova categoria", error);
        }
    }
    const editar = async (dados: IDadosCategoria, id: string) => {
        const { nome, ordem } = dados;
        try {
            const categoriaRef = doc(db, "usuarios", userId, "categorias", id);
            await updateDoc(categoriaRef, { nome, ordem });
            alert("Categoria atualizada com sucesso!");
        } catch (error) {
            console.error("Erro ao editar categoria", error);
        }
    }
    const limparStatus = () => {
        const categoriaStore = useCategoriaStore();
        if (categoriaStore.categoriaEmEdicao !== null) {
            categoriaStore.categoriaEmEdicao = null;
        }
    }
    const deletar = async (id: string) => {
        const produtosRef = collection(db, "usuarios", userId, "lanches");
        const q = query(produtosRef, where("categoriaId", "==", id));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            alert(`Não é possível excluir esta categoria. Existem ${querySnapshot.size} produto(s) associados a ela.`);
            return;
        }
        try {
            await deleteDoc(doc(db, "usuarios", userId, "categorias", id));
            alert("Categoria excluída com sucesso!");
        } catch (error) {
            console.error("Erro ao excluir categoria: ", error);
            alert("Ocorreu um erro ao excluir a categoria.");
        }
    }
    return { cadastrar, editar, limparStatus, deletar };
}