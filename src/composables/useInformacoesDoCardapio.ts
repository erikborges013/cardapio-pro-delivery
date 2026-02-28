import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { db, doc, getDoc, storage } from "../firebase-config";
import { serverTimestamp, setDoc } from "firebase/firestore";
import { ref as vueRef } from "vue";

export default function useInformacoesDoCardapio(uid: string) {
    const carregando = vueRef(false);
    const salvarImagem = async (uid: string, arquivo: File) => {
        if (!arquivo) {
            alert("Você precisa escolher uma imagem para o seu cardápio.");
            throw new Error("Imagem obrigatória.");
        }
        const nomeDaImagem = `${Date.now()}-${arquivo.name}`;
        const storageRef = ref(storage, `usuarios/${uid}/configuracoes/${nomeDaImagem}`);
        await uploadBytes(storageRef, arquivo);
        return await getDownloadURL(storageRef);
    }

    const salvarNoBancoDeDados = async (dadosCompletos: any) => {

        const dados = {
            nomeDoEstabelecimento: dadosCompletos.nomeEstabelecimento,
            cidade: dadosCompletos.cidade,
            endereco: { cidade: dadosCompletos.cidade, bairro: dadosCompletos.bairro, numero: dadosCompletos.numeroEstabelecimento, rua: dadosCompletos.rua },
            pedidoMinimo: dadosCompletos.pedidoMinimo,
            whatsApp: dadosCompletos.ddd + dadosCompletos.celular,
            tempoDeEntrega: dadosCompletos.horaEstimadaEntrega + ":" + dadosCompletos.minutosEstimadoEntrega,
            tempoDeRetirada: dadosCompletos.horaEstimadaRetirada + ":" + dadosCompletos.minutosEstimadoRetirada,
            horaInicialFuncionamento: dadosCompletos.horaInicialFuncionamento,
            horaFinalFuncionamento: dadosCompletos.horaFinalFuncionamento,
            diasDeFuncionamento: dadosCompletos.diasSelecionados,
            imagemUrl: dadosCompletos.imagemPrevia,
        };
        console.log(dados);

        if (
            !dados.nomeDoEstabelecimento ||
            dados.pedidoMinimo === null ||
            dados.pedidoMinimo === undefined ||
            isNaN(dados.pedidoMinimo) ||
            !dados.whatsApp ||
            !dados.horaInicialFuncionamento ||
            !dados.horaFinalFuncionamento
        ) {
            alert("Por favor, preencha todos os dados corretamente.");
            return;
        }
        carregando.value = true;
        try {
            let url = null;
            if (dadosCompletos.imagem) {
                dadosCompletos.urlAntiga?.includes('firebasestorage') && await deleteObject(ref(storage, dadosCompletos.urlAntiga)).catch(() => { });
                url = await salvarImagem(uid, dadosCompletos.imagem);
            }
            else if (!dadosCompletos.urlAntiga) {
                alert("Você precisa escolher uma imagem para o seu cardápio.");
                return;
            }
            const infoRef = doc(db, "usuarios", uid, "configuracoes", "dados-principais");
            const snapshot = await getDoc(infoRef);

            let payload: any = {
                ...dados,
                imagemUrl: url || dadosCompletos.urlAntiga,
            };

            if (!snapshot.exists()) {
                payload.criadoEm = serverTimestamp();
            } else {
                payload.atualizadoEm = serverTimestamp();
            }
            await setDoc(infoRef, payload, { merge: true });
            return true;
        } catch (error) {
            console.error("Erro ao tentar cadastrar informações.", error);
            return false;
        } finally {
            carregando.value = false;
        }
    }

    return { salvarNoBancoDeDados, carregando };
}