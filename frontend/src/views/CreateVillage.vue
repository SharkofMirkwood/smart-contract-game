<template>
  <div class="create-village">
    <h1>Create village</h1>

    <div>
      <b-form inline @submit="onSubmit">

        <b-form-input
          id="inline-form-input-name"
          class="mb-2 mr-sm-2 mb-sm-0"
          placeholder="Name"
          v-model="form.name"
          :disabled="!currentAddress"
        ></b-form-input>

        <b-form-input
          id="inline-form-input-x"
          class="mb-2 mr-sm-2 mb-sm-0"
          placeholder="X"
          v-model="form.x"
          :disabled="!currentAddress"
        ></b-form-input>

        <b-form-input
          id="inline-form-input-y"
          class="mb-2 mr-sm-2 mb-sm-0"
          placeholder="Y"
          v-model="form.y"
          :disabled="!currentAddress"
        ></b-form-input>

        <b-button :disabled="!currentAddress" type="submit" variant="primary">Submit</b-button>

      </b-form>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Store } from 'vuex';
import { AppState } from '../store/index';

@Component
export default class CreateVillage extends Vue {
  $router: any;

  $store: Store<AppState>;

  form = {
    name: '',
    x: 0,
    y: 0,
  };

  get contract() {
    return this.$store.state.contract;
  }

  get currentAddress() {
    return this.$store.state.ethAddress;
  }

  async onSubmit(event: Event) {
    event.preventDefault();
    console.log(this.form);
    this.createVillage(this.form.name, this.form.x, this.form.y);
  }

  async createVillage(name: string, x: number, y: number) {
    const result = await this.contract.methods.createVillage(name, x, y).send({ from: this.currentAddress });
    console.log('result', result);
    this.resetForm();
  }

  resetForm() {
    this.form.name = '';
    this.form.x = 0;
    this.form.y = 0;
  }
}
</script>
