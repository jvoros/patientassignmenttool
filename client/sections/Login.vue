<script setup>
import { ref } from "vue";
import { useAuth } from "../use";

const auth = useAuth();

const site = "stmarks";
const codeFromForm = ref();
const { error } = useAuth();

const login = async () => {
  auth.login(codeFromForm.value, site);
  codeFromForm.value = "";
};
</script>
<template>
  <form>
    <Card class="w-full max-w-sm mx-auto mt-12">
      <CardHeader>
        <img src="/assets/pat.svg" alt="Patient Assignment Tool Logo" class="w-24 mb-4" />
        <CardTitle class="text-4xl font-bold">Welcome to the Rotation.</CardTitle>
      </CardHeader>
      <CardContent class="grid gap-4">
        <div class="grid gap-2">
          <Label for="code"
            >Access Code
            <span v-if="error" class="float-right text-sm text-red-500">{{ error }}</span>
          </Label>
          <Input id="code" type="password" v-model="codeFromForm" />
        </div>
      </CardContent>
      <CardFooter>
        <Button class="w-full" @click.prevent="login">Login</Button>
      </CardFooter>
    </Card>
  </form>
</template>
