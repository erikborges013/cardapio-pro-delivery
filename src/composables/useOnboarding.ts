import { toRaw } from "vue";
import { TDadosParaManipulacao } from "../interfaces/IInformacoesDoCardapio";
type TaxaDeEntrega = {
    nome: string;
    taxa: number;
}

export function useIndexDB() {
    let db: IDBDatabase;

    const abrirBanco = (): Promise<void> => {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open("GaleriaDB", 1);

            request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
                const target = event.target as IDBOpenDBRequest;
                db = target.result;

                if (!db.objectStoreNames.contains("GaleriaDB")) {
                    db.createObjectStore("GaleriaDB", { keyPath: 'id' });
                }
            };

            request.onsuccess = (event: Event) => {
                const target = event.target as IDBOpenDBRequest;
                db = target.result;
                console.log("Banco de dados pronto!");
                resolve();
            }

            request.onerror = (event: Event) => {
                const target = event.target as IDBOpenDBRequest;
                console.error("Erro ao abrir banco:", target.error);
                reject(target.error);
            }
        });
    }

    const salvarInformacoesDoCardapioNoIndexDB = (idConfig: string, informacoesDoCardapio?: TDadosParaManipulacao): Promise<void> => {
        return new Promise((resolve, reject) => {
            if (!db) {
                reject(new Error("O banco de dados não foi inicializado. Chame abrirBanco() primeiro."));
                return;
            }
            let informacoesDoCardapioSemReatividade: TDadosParaManipulacao | null = null;
            if (informacoesDoCardapio) {
                informacoesDoCardapioSemReatividade = {
                    nomeEstabelecimento: informacoesDoCardapio.nomeEstabelecimento,
                    cidade: informacoesDoCardapio.cidade,
                    bairro: informacoesDoCardapio.bairro,
                    rua: informacoesDoCardapio.rua,
                    numeroEstabelecimento: informacoesDoCardapio.numeroEstabelecimento,
                    ddd: informacoesDoCardapio.ddd,
                    celular: informacoesDoCardapio.celular,
                    horaEstimadaEntrega: informacoesDoCardapio.horaEstimadaEntrega,
                    minutosEstimadoEntrega: informacoesDoCardapio.minutosEstimadoEntrega,
                    horaEstimadaRetirada: informacoesDoCardapio.horaEstimadaRetirada,
                    minutosEstimadoRetirada: informacoesDoCardapio.minutosEstimadoRetirada,
                    horaInicialFuncionamento: informacoesDoCardapio.horaInicialFuncionamento,
                    horaFinalFuncionamento: informacoesDoCardapio.horaFinalFuncionamento,
                    diasSelecionados: informacoesDoCardapio.diasSelecionados,
                    pedidoMinimo: informacoesDoCardapio.pedidoMinimo,
                }
            }


            const transaction = db.transaction(['GaleriaDB'], 'readwrite');
            const store = transaction.objectStore('GaleriaDB');

            if (informacoesDoCardapioSemReatividade !== null && informacoesDoCardapio) {
                const registro = {
                    id: idConfig,
                    imagem: toRaw(informacoesDoCardapio.imagem),
                    informacoesDoCardapio: JSON.parse(JSON.stringify(informacoesDoCardapioSemReatividade)),
                }

                const request = store.put(registro);
                request.onsuccess = () => {
                    console.log("Dados salvos com sucesso no IndexDB!");
                    resolve();
                }

                request.onerror = (event: Event) => {
                    const target = event.target as IDBRequest;
                    console.error("Erro ao salvar dados no banco", target.error);
                    reject(target.error);
                }
            }
        });
    }

    const salvarFormasDePagamentoNoIndexdDB = (idConfig: string, formasDePagamento: string[]): Promise<void> => {
        return new Promise((resolve, reject) => {
            if (!db) {
                reject(new Error("O banco de dados não foi inicializado. Chame abrirBanco() primeiro."));
                return;
            }
            const transaction = db.transaction(['GaleriaDB'], 'readwrite');
            const store = transaction.objectStore('GaleriaDB');
            if (formasDePagamento.length > 0) {
                const registro = {
                    id: idConfig,
                    formasDePagamento: toRaw(formasDePagamento),
                }
                const request = store.put(registro);
                request.onsuccess = () => {
                    console.log("Formas de pagamento salvas com sucesso no indexdDB");
                    resolve();
                }
                request.onerror = (event: Event) => {
                    const target = event.target as IDBRequest;
                    console.error("Erro ao salvar formas de pagamento no indexdDB", target.error);
                    reject(target.error);
                }
            }
        })
    }

        const salvarTaxaDeEntregaNoIndexdDB = (idConfig: string, taxaDeEntrega: TaxaDeEntrega): Promise<void> => {
        return new Promise((resolve, reject) => {
            if (!db) {
                reject(new Error("O banco de dados não foi inicializado. Chame abrirBanco() primeiro."));
                return;
            }
            const transaction = db.transaction(['GaleriaDB'], 'readwrite');
            const store = transaction.objectStore('GaleriaDB');
            if (taxaDeEntrega) {
                const registro = {
                    id: idConfig,
                    taxaDeEntrega: toRaw(taxaDeEntrega),
                }
                const request = store.put(registro);
                request.onsuccess = () => {
                    console.log("Taxa de entrega salva com sucesso no indexdDB");
                    resolve();
                }
                request.onerror = (event: Event) => {
                    const target = event.target as IDBRequest;
                    console.error("Erro ao salvar taxa de entrega no indexdDB", target.error);
                    reject(target.error);
                }
            }
        })
    }


    const carregarDadosDoIndexDB = (idConfig: string): Promise<any | null> => {
        return new Promise((resolve, reject) => {
            if (!db) {
                reject(new Error("O banco de dados não foi inicializado. Chame abrirBanco() primeiro."));
                return;
            }
            const transaction = db.transaction(['GaleriaDB'], 'readonly');
            const store = transaction.objectStore('GaleriaDB');
            const request = store.get(idConfig);

            request.onsuccess = (event) => {
                const target = event.target as IDBRequest;
                const registro = target.result;

                if (registro) {
                    console.log("Dados carregados com sucesso!");
                    resolve(registro);
                } else {
                    console.log("Nenhum registro encontrado com esse ID.");
                    resolve(null);
                }
            };

            request.onerror = (event: Event) => {
                const target = event.target as IDBOpenDBRequest;
                console.error("Erro ao buscar informações", target.error);
                reject(target.error);
            };
        });
    }

    return { abrirBanco, salvarInformacoesDoCardapioNoIndexDB, carregarDadosDoIndexDB, salvarFormasDePagamentoNoIndexdDB, salvarTaxaDeEntregaNoIndexdDB };
}