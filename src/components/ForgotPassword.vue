<template>
  <Card title="Forgot password" :is-loading="isFormProcessing" :card-style="{ 'box-shadow': 'none' }">
    <v-form ref="formRef" v-model="valid" lazy-validation @submit="validate">
      <div style="opacity: 0; transform: translateX(10px)">
        <v-text-field
          clearable
          :disabled="isFormProcessing"
          label="Email"
          variant="underlined"
          v-model="form.email"
          :rules="form.getInputRules('email')"
          type="email"
          name="email"
          required
          @update:model-value="(value) => form.cacheInput('email', value)"
        ></v-text-field>
      </div>
      <div class="d-flex align-center gap-2 flex-wrap mt-3" style="opacity: 0; transform: translateX(20px)">
        <v-btn color="primary" class="text-capitalize" size="small" type="submit" :disabled="isFormProcessing">
          Send
        </v-btn>
        <v-btn
          color="primary"
          variant="outlined"
          size="small"
          class="text-capitalize"
          @click="redirect(pathes.login)"
          :disabled="isFormProcessing"
        >
          Back to login
        </v-btn>
      </div>
    </v-form>
  </Card>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue';
import Card from './Card.vue';
import { ForgotPassword, pathes, wait } from '../lib';
import { useFocus, useRedirect, useRequest } from '../hooks';
import { ForgotPasswordApi } from '../apis';
import { useNotification } from '@kyvg/vue3-notification';

const formRef = ref();
const form = reactive(new ForgotPassword());
const valid = reactive(true);
const request = useRequest();
const redirect = useRedirect();
const focus = useFocus();
const notification = useNotification();
const isFormProcessing = request.isApiProcessing(ForgotPasswordApi);

onMounted(async () => {
  await wait(10);

  for (const node of formRef.value.children) {
    node.style.transition = 'opacity 0.2s, transform 0.3s';
    node.style.opacity = 1;
    node.style.transform = 'translateX(0px)';

    await wait();
  }

  focus('email');
});

async function validate(event) {
  event.preventDefault();
  const { valid } = await formRef.value.validate();
  if (valid) {
    request.build(new ForgotPasswordApi(form)).then((response) => {
      form.clearCachedForm();
      formRef.value.reset();
      notification.notify({ text: response.data.message, title: 'Success', type: 'success' });
    });
  }
}
</script>
