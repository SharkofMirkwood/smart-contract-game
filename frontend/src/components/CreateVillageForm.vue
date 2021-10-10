<template>
  <div>
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
          :disabled="!currentAddress || x !== null"
        ></b-form-input>

        <b-form-input
          id="inline-form-input-y"
          class="mb-2 mr-sm-2 mb-sm-0"
          placeholder="Y"
          v-model="form.y"
          :disabled="!currentAddress || y !== null"
        ></b-form-input>

        <b-button :disabled="!currentAddress" type="submit" variant="primary">Submit</b-button>

      </b-form>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { Store } from 'vuex';
import { AppState } from '../store/index';
import { Village } from '../types';

@Component
export default class CreateVillageForm extends Vue {
  $router: any;

  $store: Store<AppState>;

  villages: Village[] = [];

  @Prop({ default: null }) x: number;

  @Prop({ default: null }) y: number;

  form = {
    name: '',
    x: 0,
    y: 0,
  };

  get nftContract() {
    return this.$store.state.nftContract;
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
    const value = await this.nftContract.methods.getNextVillageCost().call();
    console.log('cost', value);
    const result = await this.nftContract.methods.createVillage(name, x, y).send({ from: this.currentAddress, value });
    console.log('result', result);
    this.resetForm();
    this.$emit('success', parseInt(result.events.NewVillage.returnValues.villageId, 10));
  }

  resetForm() {
    this.form.name = '';
    this.form.x = 0;
    this.form.y = 0;
  }

  constructor() {
    super();
    this.form.x = this.x || 0;
    this.form.y = this.y || 0;
  }
}
</script>
