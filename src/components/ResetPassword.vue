<template>
  <Card title="Reset password" :is-loading="isFormProcessing" :card-style="{ 'box-shadow': 'none' }">
    <v-form ref="formRef" v-model="valid" lazy-validation @submit="validate">
      <div style="opacity: 0; transform: translateX(10px)">
        <v-text-field
          clearable
          :disabled="isFormProcessing"
          label="Password"
          variant="underlined"
          v-model="form.password"
          :rules="form.getInputRules('password')"
          type="password"
          name="password"
          required
          autocomplete="off"
        ></v-text-field>
      </div>
      <div style="opacity: 0; transform: translateX(20px)">
        <v-text-field
          clearable
          :disabled="isFormProcessing"
          label="Confirmed password"
          variant="underlined"
          v-model="form.confirmedPassword"
          :rules="form.getInputRules('confirmedPassword')"
          type="password"
          name="confirmedPassword"
          required
          autocomplete="off"
        ></v-text-field>
      </div>
      <div style="opacity: 0; transform: translateX(30px)" class="d-flex align-center gap-2 flex-wrap mt-3">
        <v-btn color="primary" class="text-capitalize" size="small" type="submit" :disabled="isFormProcessing">
          Send
        </v-btn>
        <v-btn
          color="primary"
          variant="outlined"
          size="small"
          class="text-capitalize"
          type="button"
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
import { reactive, onMounted, ref, watch } from 'vue';
import Card from './Card.vue';
import { ResetPassword, pathes, wait } from '../lib';
import { useFocus, useRequest, useRedirect } from '../hooks';
import { ResetPasswordApi } from '../apis';
import { useNotification } from '@kyvg/vue3-notification';

const formRef = ref();
const form = reactive(new ResetPassword());
const valid = ref(true);
const request = useRequest();
const redirect = useRedirect();
const focus = useFocus();
const notification = useNotification();
const isFormProcessing = request.isApiProcessing(ResetPasswordApi);

onMounted(async () => {
  await wait(10);

  for (const node of formRef.value.children) {
    node.style.transition = 'opacity 0.2s, transform 0.3s';
    node.style.opacity = 1;
    node.style.transform = 'translateX(0px)';

    await wait();
  }

  focus('password');
});

async function validate(event) {
  event.preventDefault();
  const { valid } = await formRef.value.validate();
  if (valid) {
    request.build(new ResetPasswordApi(form)).then((response) => {
      form.clearCachedForm();
      formRef.value.reset();
      notification.notify({ text: 'Your password was changed.', title: 'Success', type: 'success' });
      redirect(pathes.login);
    });
  }
}

watch(
  () => form,
  (form) => {
    form.bindInputsRules();
  },
  { deep: true }
);
</script>
