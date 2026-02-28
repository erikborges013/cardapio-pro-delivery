export function comprimirImagem(arquivo: File, qualidade = 0.7, larguraMax = 800): Promise<File> {
  return new Promise((resolve, reject) => {
    const leitor = new FileReader();
    leitor.onload = function (event) {
      const img = new Image();
      img.onload = function () {
        const proporcao = img.width / img.height;
        const novaLargura = Math.min(larguraMax, img.width);
        const novaAltura = novaLargura / proporcao;

        const canvas = document.createElement("canvas");
        canvas.width = novaLargura;
        canvas.height = novaAltura;
        const ctx = canvas.getContext("2d");
        ctx!.drawImage(img, 0, 0, novaLargura, novaAltura);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              return reject(new Error("Erro ao comprimir a imagem"));
            }
            const imagemComprimida = new File([blob], arquivo.name, {
              type: "image/jpeg",
              lastModified: Date.now(),
            });
            resolve(imagemComprimida);
          },
          "image/jpeg",
          qualidade
        );
      };
      img.onerror = () => {
        reject(new Error("Erro ao carregar a imagem"));
      };
      img.src = event.target!.result as string;
    };

    leitor.onerror = () => {
      reject(new Error("Erro ao ler o arquivo com FileReader"));
    };
    leitor.readAsDataURL(arquivo);
  });
}
