import { onSchedule } from "firebase-functions/v2/scheduler";
import * as logger from "firebase-functions/logger";
import admin from "firebase-admin";
import nodemailer from "nodemailer";

admin.initializeApp();
const db = admin.firestore();

// 1. Configuração do Email (Transporter)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// 2. A função agendada
// Note que mudamos de "exports.checkTrialExpiration =" para "export const checkTrialExpiration ="
export const checkTrialExpiration = onSchedule("every day 09:00", async (event) => {
  logger.log("Iniciando verificação diária de testes expirados...");

  const hoje = new Date();

  // Calcula 30 dias atrás
  const trintaDiasAtras = new Date();
  trintaDiasAtras.setDate(hoje.getDate() - 30);

  const startOfDay = new Date(trintaDiasAtras);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(trintaDiasAtras);
  endOfDay.setHours(23, 59, 59, 999);

  try {
    const snapshot = await db.collection("usuarios").where("createdAt", ">=", startOfDay).where("createdAt", "<=", endOfDay).get();

    if (snapshot.empty) {
      logger.log("Nenhum usuário completou 30 dias hoje.");
      return;
    }

    logger.log(`Encontrados ${snapshot.size} usuários para notificar.`);

    const emailPromises = [];
    const desmarcarTesteGratis = [];

    for (const doc of snapshot.docs) {
      const user = doc.data();

      if (user.email) {
        const mailOptions = {
          from: '"Equipe CardápioPró Delivery" cardapioprodeliverycontato@gmail.com',
          to: user.email,
          subject: "Seu teste grátis acabou!",
          html: `
            <div style="font-family: Arial, sans-serif; padding: 20px;">
              <h2>Olá, ${user.name || "Usuário"}!</h2>
              <p>Já se passaram 30 dias desde que você se juntou a nós.</p>
              <p>Seu período de teste gratuito encerrou hoje.</p>
              <p><strong>Por favor, acesse o app para regularizar sua conta.</strong></p>
            </div>
          `,
        };
  
        emailPromises.push(transporter.sendMail(mailOptions));
        desmarcarTesteGratis.push(db.collection("usuarios").doc(doc.id).update({ statusTesteGratis: false })
        );

      }
    }

    await Promise.all(emailPromises);
    await Promise.all(desmarcarTesteGratis);
    logger.log(`Sucesso: ${emailPromises.length} emails enviados.`);
  } catch (error) {
    logger.error("Erro fatal ao enviar emails:", error);
  }
});
