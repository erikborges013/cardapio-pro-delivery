import { Timestamp } from "firebase/firestore";
import IAdicionais from "./IAdicionais";

export interface IProduto {
    adicionais: IAdicionais[],
    categoriaId: string,
    criadoEm: Timestamp,
    id: string,
    imagemURL: string,
    ingredientes: string,
    nome: string,
    peso: string,
    preco: number,
}