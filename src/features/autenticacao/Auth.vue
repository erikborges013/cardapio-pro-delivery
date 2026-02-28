<template>
  <section class="sessao-autenticacao">
    <section class="titulo">
      <h1>CARDÁPIOPRÓ DELIVERY</h1>
    </section>
    <ContainerCard>
      <div id="login-form" v-if="paginaDeLoginAtiva === 'paginaDeLogin'">
        <h1>Login</h1>
        <form id="form-login" @submit.prevent="fazerLogin">
          <BaseInput v-model="inputLogarEmail" tipo="Email" textoPlaceHolder="Email" :obrigatorio="true" />
          <BaseInput v-model="inputLogarSenha" tipo="password" textoPlaceHolder="Senha" :obrigatorio="true" />
          <BaseButtonAuth :texto="textoBotaoAuth" :desativarBotao="desativado" />
        </form>
        <a @click="alternarTela('paginaDeRecuperarSenha')">Esqueci minha senha</a>
        <BaseCheckBox v-model="ativo" texto="Me manter conectado" />
        <p>Não tem uma conta? <a href="#" id="show-register"
            @click="alternarTela('paginaDeRegistro')"><br>Cadastre-se</a></p>
        <p>
          Seus dados são protegidos conforme nossa <a href="/public/politica-de-privacidade.html"><span>Política de
              Privacidade</span></a>.
        </p>
      </div>

      <div class="register-form" v-else-if="paginaDeLoginAtiva === 'paginaDeRegistro'">
        <h1>Cadastro</h1>

        <form class="form-register" @submit.prevent="cadastrarUsuario">
          <p>Faça seu cadastro e ganhe 30 dias de teste grátis</p>
          <BaseInput v-model="inputCadastrarEmail" tipo="Email" textoPlaceHolder="Email" :obrigatorio="true" />
          <BaseInput v-model="inputCadastrarSenha" tipo="password" textoPlaceHolder="Senha" :obrigatorio="true" />
          <BaseButtonAuth :texto="textoBotaoAuth" :desativarBotao="desativado"/>
        </form>

        <p>Já tem uma conta? <a href="#" id="show-login" @click="alternarTela('paginaDeLogin')">Faça login</a></p>
        <p>
          Ao continuar, você concorda com a nossa <a href="/public/politica-de-privacidade.html"><span>Política de
              Privacidade</span></a> e pode solicitar a
          <a href="/public/excluir-conta.html"><span>exclusão dos seus dados</span></a> a qualquer momento.
        </p>
      </div>
      <div class="container_recuperar-senha" v-else-if="paginaDeLoginAtiva === 'paginaDeRecuperarSenha'">
        <form @submit.prevent="recuperarSenha()">
          <p>Recuperação de senha</p>
          <BaseInput v-model="inputEmail" tipo="Email" textoPlaceHolder="Email" :obrigatorio="true" />
          <BaseButtonAuth texto="Recuperar senha" />
        </form>
        <a @click="alternarTela('paginaDeLogin')">Voltar para o login</a>
      </div>
    </ContainerCard>
  </section>
</template>

<script setup lang="ts">
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, browserLocalPersistence, browserSessionPersistence, setPersistence, sendPasswordResetEmail, getAuth } from "firebase/auth";
import { auth, db } from "../../firebase-config";
import { ref } from "vue";
import { useRouter } from "vue-router";
import BaseInput from "../../components/ui/BaseInput.vue";
import BaseButtonAuth from "./BaseButtonAuth.vue";
import BaseCheckBox from "../../components/ui/BaseCheckBox.vue";
import ContainerCard from "./ContainerCard.vue";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";

const router = useRouter();

let paginaDeLoginAtiva = ref<string>("paginaDeLogin");
const inputCadastrarEmail = ref("");
const inputCadastrarSenha = ref("");
const inputLogarEmail = ref("");
const inputLogarSenha = ref("");
const ativo = ref(false);
const esqueceuSenha = ref(false);
const inputEmail = ref("");
const desativado = ref<boolean>(false);
const textoBotaoAuth = ref<string>("Entrar");

function alternarTela(pagina: string) {
  paginaDeLoginAtiva.value = pagina;
  textoBotaoAuth.value = textoBotaoAuth.value === "Entrar" ? "Cadastrar" : "Entrar";
}

async function recuperarSenha() {
  try {
    await sendPasswordResetEmail(getAuth(), inputEmail.value);
    alert("Email de recuperação enviado!");
  } catch (error) {
    console.error(`Erro ao tentar recuperar senha ${error}`)
  } finally {
    paginaDeLoginAtiva.value = 'paginaDeLogin';
    inputEmail.value = '';
  }
  console.log(inputEmail.value);

}

async function cadastrarUsuario() {
  desativado.value = true;
  textoBotaoAuth.value = "Aguarde...";
  try {

    const userCredential = await createUserWithEmailAndPassword(auth, inputCadastrarEmail.value, inputCadastrarSenha.value);
    const user = userCredential.user;

    await setDoc(doc(db, "usuarios", user.uid), {
      email: inputCadastrarEmail.value,
      createdAt: serverTimestamp(),
      statusTesteGratis: true,
    });

    alert("Usuário cadastrado com sucesso e teste iniciado!");
    router.push("admin");
  } catch (error: any) {
    alert("Erro ao cadastrar: " + error.message);
    console.error(error);
  } finally {
    desativado.value = false;
    textoBotaoAuth.value = "Cadastrar";
  }
}

async function fazerLogin() {
  desativado.value = true;
  textoBotaoAuth.value = "Aguarde...";

  try {
    await setPersistence(auth, ativo.value ? browserLocalPersistence : browserSessionPersistence);

    await signInWithEmailAndPassword(auth, inputLogarEmail.value, inputLogarSenha.value);

    router.push("/admin");
  } catch (error: any) {
    alert("E-mail ou senha incorreta");
    console.error(error.message);
  } finally {
    desativado.value = false;
    textoBotaoAuth.value = "Entrar";
  }
}

</script>

<style lang="scss" scoped>
@reference "../../assets/tailwind.css";

.sessao-autenticacao {
  @apply flex flex-col items-center h-screen overflow-hidden box-border pt-[50px] px-[5px] lg:pt-[20px];
  background: var(--background-color);
  font-family: var(--fonte-principal);
}

.titulo {
  @apply mt-0 mb-8;
}

#login-form,
#register-form,
.register-form {
  @apply flex flex-col gap-4 box-border;
}

p {
  @apply text-center;
}

h1 {
  @apply text-center font-normal text-[#ffeb3b];
  text-shadow: 0 0 8px rgba(255, 235, 59, 0.7);
}

a {
  @apply text-center cursor-pointer text-[#ffc107] no-underline;

  &:hover {
    @apply underline;
  }
}

.container_recuperar-senha {
  @apply flex flex-col items-center gap-4;
}

.container_manter-conectado {
  @apply flex gap-4 justify-center items-center;
}

@keyframes bounce {

  0%,
  100% {
    transform: translate(-50%, 0);
  }

  50% {
    transform: translate(-50%, -8px);
  }
}
</style>