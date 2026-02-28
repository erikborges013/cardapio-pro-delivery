import { FieldValue, Timestamp } from "firebase/firestore";
import { IEndereco } from "./IEndereco";

export interface IInformacoesDoCardapio {
    atualizadoEm: Timestamp | FieldValue,
    criadoEm: Timestamp | FieldValue,
    diasDeFuncionamento: string[],
    endereco: IEndereco,
    horaFinalFuncionamento: string,
    horaInicialFuncionamento: string,
    imagemUrl: string,
    nomeDoEstabelecimento: string,
    pedidoMinimo: number,
    tempoDeEntrega: string,
    tempoDeRetirada: string,
    whatsApp: string
}

export interface TDadosParaManipulacao {
    imagem?: File,
    imagemPrevia?: string | null,
    urlAntiga?: string,
    nomeEstabelecimento: string,
    cidade: string,
    numeroEstabelecimento: string,
    bairro: string,
    rua: string,
    horaEstimadaEntrega: string,
    minutosEstimadoEntrega: string,
    horaEstimadaRetirada: string,
    minutosEstimadoRetirada: string,
    pedidoMinimo: number,
    ddd: string,
    celular: string,
    horaFinalFuncionamento: string,
    horaInicialFuncionamento: string,
    diasSelecionados: string[],
}
