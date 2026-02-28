import nodemailer from "nodemailer"; //Aqui é importado a biblioteca do nodemailer

async function enviarEmail(destinatario, assunto, mensagem) {
  try {
    //configuração para usar os serviços do gmail
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    //Aqui usamos o transporter para enviar o email
    const info = await transporter.sendMail({
      from: `"CardápioPró Delivery" <${process.env.EMAIL_USER}>`,
      to: destinatario,
      subject: assunto,
      text: mensagem,
      html: `<p>${mensagem}</p>`,
    });
    console.log("Email enviado:", info.messageId);
  } catch (error) {
    console.error("Erro ao tentar enviar email", error);
    throw new Error("Erro ao tentar enviar email", error);
  }
}
export default enviarEmail;
