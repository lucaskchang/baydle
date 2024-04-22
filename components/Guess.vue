<template>
  <div class="mx-auto mt-2 py-4">
    <div class="flex flex-col">
      <div class="rounded-lg text-xl">
        {{ guess.Name }}
      </div>
      <div class="mt-4 flex flex-row space-x-4 text-white">
        <div class="flex w-1/2 flex-col rounded-lg p-4" :class="rolesValue">
          <p class="text-sm font-semibold">Job Title</p>
          <p>{{ guess['Job Title'] }}</p>
        </div>
        <div class="flex w-1/2 flex-col rounded-lg p-4" :class="officeValue">
          <p class="text-sm font-semibold">Office</p>
          <p>{{ guess['Office'] }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import teachers from '~/assets/data/teachers.json';
import order from '~/assets/data/order.json';

const startDate = new Date('2024-4-21');
const date = new Date();
const difInDays = Math.floor(
  (date.getTime() - startDate.getTime()) / (1000 * 3600 * 24),
);

const teacher = ref(teachers[order[difInDays]]);

const props = defineProps({
  guessName: {
    type: String,
    required: true,
  },
});

const guess = computed(() => {
  return teachers[props.guessName];
});

const officeValue = computed(() => {
  if (teacher.value['True Office'] === guess.value['True Office']) {
    return 'bg-[#6AAA64]';
  } else if (
    Math.floor(teacher.value['True Office'] / 100) ===
    Math.floor(guess.value['True Office'] / 100)
  ) {
    return 'bg-[#C9B458]';
  } else {
    return 'bg-[#787C7E]';
  }
});

const rolesValue = computed(() => {
  if (teacher.value['Job Title'] === guess.value['Job Title']) {
    return 'bg-[#6AAA64]';
  }
  for (const role of teacher.value.Roles) {
    if (guess.value.Roles.includes(role)) {
      return 'bg-[#C9B458]';
    }
  }
  return 'bg-[#787C7E]';
});
</script>
