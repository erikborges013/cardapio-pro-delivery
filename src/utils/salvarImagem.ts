import { getDownloadURL, uploadBytes, ref } from 'firebase/storage';
import { storage } from '../firebase-config';
import { Ref } from 'vue';


export default async function salvarImagem(imagem: any, userId: string) {
  try {
    const nomeArquivo = `${Date.now()}-${imagem.name}`;
    const imagemRef = ref(storage, `usuarios/${userId}/lanches/${nomeArquivo}`);
    await uploadBytes(imagemRef, imagem);
    return await getDownloadURL(imagemRef);
  } catch (error) {
    console.error("Erro ao salvar imagem");
  }

}