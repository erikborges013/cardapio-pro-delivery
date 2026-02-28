import { addDoc, collection, deleteDoc, doc, updateDoc } from "firebase/firestore";
import salvarImagem from "../utils/salvarImagem";
import { db, deleteObject, storage, } from "../firebase-config";
import { ref as documentRef } from "firebase/storage";
import { listaDeProdutos } from "../stores/listaDeProdutosStore";

export default function useProduto() {

    const cadastrar = async (dados: any, userId: string, imagem?: File,): Promise<boolean> => {
        
        try {
            limparStatus();
            if (!userId) {
                console.log("Uid do usuário não encontrado!");
                return false;
            }
            const imagemURL = imagem ? await salvarImagem(imagem, userId) : null;

            await addDoc(collection(db, "usuarios", userId, "lanches"), {
                ...dados,
                imagemURL,
                criadoEm: new Date(),
            });

            return true;
        } catch (error) {
            console.log("Erro ai tentar cadastrar produto", error);
            return false;
        }
    }

    const editar = async (userId: string, id: string, dados: any, imagemNova?: File): Promise<boolean> => {
        try {
            const produtos = listaDeProdutos();
            const produtoEmEdicao = produtos.produtoEmEdicao;
            const imagemAntiga = produtoEmEdicao?.imagemURL;

            const updateData: any = { ...dados };
            const lancheRef = doc(db, "usuarios", userId!, "lanches", id);

            if (imagemNova) {

                if (imagemAntiga) {
                    const imagemAntigaRef = documentRef(storage, imagemAntiga);
                    await deleteObject(imagemAntigaRef);
                }
                const imagemURL = await salvarImagem(imagemNova, userId!);
                updateData.imagemURL = imagemURL;

            }
            await updateDoc(lancheRef, { ...updateData });
            limparStatus();
            return true;
        } catch (error) {
            console.error("Erro ao editar produto:", error);
            return false;
        }
    }

    const limparStatus = () => {
        const produtosStore = listaDeProdutos();
        if (produtosStore.produtoEmEdicao !== null) {
            produtosStore.produtoEmEdicao = null;
        }

    }

    const deletar = async (docPath: string, imagemUrl?: string | null) => {
        try {
            if (!docPath) {
                console.warn("Caminho do documento (docPath) não fornecido.");
                return;
            }
            await deleteDoc(doc(db, docPath));

            if (imagemUrl) {
                try {
                    const imagemRef = documentRef(storage, imagemUrl);
                    await deleteObject(imagemRef);
                } catch (error) {
                    console.error("Erro ao excluir imagem", error);
                }

            }

            alert("Lanche excluído com sucesso!");
            return true;
        } catch (error) {
            console.error("Erro ao excluir o lanche: ", error);
            alert("Ocorreu um erro ao excluir o lanche.");
            return false;
        }
    }


    return { cadastrar, editar, limparStatus, deletar };
}