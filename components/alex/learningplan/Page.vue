<template>
  <v-container fluid>
    <alex-learningplan-viewer
      v-if="!editing"
      :structure="learningPlan.structure[0]"
      :has-permission="hasPermission"
      :author="learningPlan.author"
      :co-authors="learningPlan.coauthors"
      @edit="editing = true"

    />
    <template v-else>
      <alex-learningplan-editor
        :data="learningPlan"
        @back="onEditorBack"
        @updated="$emit('updated')"
      />
      <v-dialog v-model="visible" width="500">
        <v-card>
          <v-card-title class="primary white--text">
            Sair do Editor?
          </v-card-title>

          <v-card-text class="mt-5">
            Você pode possuir alterações que não foram salvas. Deseja sair?
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              @click="cancelLeaveAction"
            >
              Cancelar
            </v-btn>
            <v-btn
              color="primary"
              @click="confirmLeaveAction"
            >
              Confirmar saída
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </template>
  </v-container>
</template>

<script>

export default {
  beforeRouteLeave (_to, _from, next) {
    if (!this.editing) return;

    this.visible = true;
    this.waitForLeaveConfirmation(next);
  },
  props: {
    learningPlan: {
      type: Object,
      required: true,
    },
    hasPermission: {
      type: Boolean,
    }
  },
  data() {
    return {
      editing: false,
      visible: false,
      confirmLeave: null,
    }
  },
  methods: {
    onEditorBack() {
      this.visible = true;
      this.waitForLeaveConfirmation(null, true);
    },
    confirmLeaveAction() {
      this.confirmLeave = true;
      this.editing = false;
      this.visible = false;
    },
    cancelLeaveAction() {
      this.confirmLeave = false;
      this.visible = false;
    },
    waitForLeaveConfirmation(next, onlyReset = false) {
      if (this.confirmLeave !== null) {
        this.confirmLeave = null;
        if (!onlyReset) return next(this.confirmLeave);
      } else {
        setTimeout(() => this.waitForLeaveConfirmation(next, onlyReset), 500);
      }
    }
  }
}
</script>
