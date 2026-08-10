<template>
  <div class="date-picker-grid-docs">
    <ECard>
      <EDatePicker
        v-model="selectedDate"
        color="primary"
        :highlighted="highlightedDates"
        :disabled="disabledDates"
      />
    </ECard>

    <ECard>
      <h3>Dentro de Dialog</h3>
      <p>
        Fecha guardada:
        <strong>{{ dialogText }}</strong>
      </p>
      <EButton color="secondary" @click="dateDialog = true">
        Abrir Date Picker
      </EButton>

      <EDialog v-model="dateDialog">
        <ECard>
          <EDatePicker
            v-model="dialogDate"
            color="secondary"
            close-on-change
            :highlighted="highlightedDates"
            :disabled="disabledDates"
          />
        </ECard>
      </EDialog>
    </ECard>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";
import EButton from "@/components/button/index.vue";
import ECard from "@/components/card/index.vue";
import EDatePicker from "@/components/date-picker/index.vue";
import EDialog from "@/components/dialog/index.vue";

const selectedDate = ref(new Date());
const dialogDate = ref(new Date());
const dateDialog = ref(false);

const plusDays = (offset: number): Date => {
  const base = new Date();
  base.setHours(0, 0, 0, 0);
  base.setDate(base.getDate() + offset);
  return base;
};

const highlightedDates = {
  dates: [plusDays(2), plusDays(7), plusDays(11)],
};

const disabledDates = {
  days: [0, 6],
};

const formatPlaygroundDate = (value?: Date | string): string => {
  const date = value ? new Date(value) : new Date();
  return date.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

const selectedText = computed(() => formatPlaygroundDate(selectedDate.value));
const dialogText = computed(() => formatPlaygroundDate(dialogDate.value));
</script>

<style scoped>
.date-picker-grid-docs {
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  margin-top: 8px;
}

.date-picker-grid-docs h3,
.date-picker-grid-docs h4 {
  margin-bottom: 8px;
}

.date-picker-grid-docs p {
  margin: 0 0 12px;
}
</style>
