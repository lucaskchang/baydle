<template>
  <div class="px-2 pt-12 transition duration-300 ease-in-out">
    <div class="mx-auto w-full lg:w-1/3">
      <p class="text-center text-5xl font-bold">🔎 Baydle 🔍</p>
      <p class="my-3 text-center text-sm">{{ guesses.length }} / 10 guesses</p>
      <UInputMenu
        v-model="selectedTeacher"
        :options="teacherList"
        placeholder="Choose a staffulty member"
      />

      <UModal v-model="resultModal">
        <div class="p-6">
          <p class="text-center text-3xl font-bold">🔎 Baydle 🔍</p>
          <div class="my-8">
            <p class="text-center text-lg">
              Wins: {{ wins.length }} | Losses: {{ losses.length }} | Streak:
              {{ streak }}
            </p>
            <div class="my-4">
              <p
                v-if="hasWon"
                class="text-center text-2xl font-bold text-[#6AAA64]"
              >
                You won! Today's staffulty member is {{ teacher.Name }}.
              </p>
              <p
                v-if="hasLost"
                class="text-center text-2xl font-bold text-[#E53E3E]"
              >
                You lost! Today's staffulty member is {{ teacher.Name }}.
              </p>
            </div>
          </div>
          <div class="mt-4 flex justify-center">
            <UButton
              block
              color="gray"
              variant="solid"
              @click="resultModal = false"
              >Close</UButton
            >
          </div>
        </div>
      </UModal>

      <div v-if="guesses.length === 0" class="mt-8">
        <p>
          Welcome to Baydle, a game where you guess the Bay staffulty member
          based on their job title and office number.
        </p>
        <p class="mt-4">
          Select a staffulty member from the dropdown above to get started!
        </p>
        <p class="mt-4">
          <span class="font-semibold text-red-500">Warning:</span> Baydle is
          currently in beta. Please play with caution and report any errors to
          <a
            href="mailto:lchang24@bayschoolsf.org"
            class="font-semibold text-blue-400 hover:text-blue-500"
          >
            lchang24@bayschoolsf.org
          </a>
        </p>
      </div>

      <Guess v-for="guess in guesses" :key="guess" :guess-name="guess" />

      <UDivider label="GAMEPLAY" class="mb-4 mt-8" />

      <div>
        <div class="mt-4 flex flex-row space-x-2 text-sm">
          <div class="flex w-1/2 flex-col space-y-2">
            <p class="text-xl font-bold">Job Title</p>
            <p>A green job title means the job title is spot-on.</p>
            <p>
              A yellow job title means the two teachers share at least one role
              or are in the same department.
            </p>
            <p>
              A gray job title means the two teachers are in different
              departments.
            </p>
          </div>
          <div class="flex w-1/2 flex-col space-y-2">
            <p class="text-xl font-bold">Office Number</p>
            <p>A green office number means the office number is spot-on.</p>
            <p>
              A yellow office number means the office is on the same floor (or
              building in the case of 36L and PC) as the correct office.
            </p>
            <p>
              A gray office number means the office is on a different floor or
              building.
            </p>
          </div>
        </div>
        <p class="mt-4 text-xl font-bold">Example</p>
        <div class="mx-auto mt-2 py-4">
          <div class="flex flex-col">
            <div class="rounded-lg text-xl">Scott Mackey</div>
            <div class="mt-4 flex flex-row space-x-4 text-white">
              <div class="flex w-1/2 flex-col rounded-lg bg-[#6AAA64] p-4">
                <p class="text-sm font-semibold">Job Title</p>
                <p>Faculty (Humanities)</p>
              </div>
              <div class="flex w-1/2 flex-col rounded-lg bg-[#787C7E] p-4">
                <p class="text-sm font-semibold">Office</p>
                <p>315</p>
              </div>
            </div>
          </div>
        </div>
        <p class="mt-2 indent-8 text-sm">
          In this example, the guess is Scott Mackey. The guesser guessed that
          Scott Mackey is a teacher in the Humanities department which is
          spot-on, so it is green. The guesser also guessed that Scott Mackey is
          in office 315, which is on the wrong floor, so it is gray.
        </p>
        <p class="mt-2 indent-8 text-sm">
          Possible guesses at this point include Nikhil Wadhwani and Hannah
          Wagner.
        </p>
      </div>
    </div>
    <ThemeSwitcher />
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

const teacherList = Object.keys(teachers);
const selectedTeacher = ref('');

const resultModal = ref(false);
const wins = ref([]) as Ref<string[]>;
const lastWin = computed(() => {
  return new Date(wins.value[wins.value.length - 1]);
});
const numOfGuesses = ref([]);
const losses = ref([]) as Ref<string[]>;
const lastLoss = computed(() => {
  return new Date(losses.value[losses.value.length - 1]);
});
const streak = ref(0);

const guesses = ref([]);
const hasWon = computed(() => {
  return guesses.value.includes(teacher.value.Name);
});

const hasLost = computed(() => {
  return guesses.value.length >= 10 && !hasWon.value;
});

watch(hasWon, (value) => {
  if (value) {
    resultModal.value = true;
    if (date.getDate() !== lastWin.value.getDate()) {
      wins.value.push(date.toISOString());
      numOfGuesses.value.push(guesses.value.length);
      localStorage.setItem('guesses', JSON.stringify(numOfGuesses.value));
      localStorage.setItem('wins', JSON.stringify(wins.value));
      if (date.getDate() === lastWin.value.getDate() + 1) {
        streak.value = streak.value + 1;
        localStorage.setItem('streak', streak.value.toString());
      } else {
        streak.value = 1;
        localStorage.setItem('streak', streak.value.toString());
      }
    }
  }
});

watch(hasLost, (value) => {
  if (value) {
    resultModal.value = true;
  }
  streak.value = 0;
  localStorage.setItem('streak', streak.value.toString());
  if (date.getDate() !== lastLoss.value.getDate()) {
    losses.value.push(date.toISOString());
    localStorage.setItem('losses', JSON.stringify(losses.value));
  }
});

watch(selectedTeacher, () => {
  if (selectedTeacher.value && !hasWon.value && !hasLost.value) {
    guesses.value.unshift(selectedTeacher.value);
    selectedTeacher.value = '';
  }
});

const saveGameState = () => {
  localStorage.setItem('baydle', JSON.stringify(guesses.value));
  localStorage.setItem('baydle-date', date.toISOString());
};
watch(guesses, saveGameState, { deep: true });

onMounted(() => {
  const savedDate = localStorage.getItem('baydle-date');
  if (savedDate && new Date(savedDate).getDate() !== date.getDate()) {
    localStorage.removeItem('baydle');
    localStorage.removeItem('baydle-date');
  }
  const savedGameState = localStorage.getItem('baydle');
  if (savedGameState) {
    guesses.value = JSON.parse(savedGameState);
  }
  const savedWins = localStorage.getItem('wins');
  if (savedWins) {
    wins.value = JSON.parse(savedWins);
  }
  const savedLosses = localStorage.getItem('losses');
  if (savedLosses) {
    losses.value = JSON.parse(savedLosses);
  }
  const savedNumOfGuesses = localStorage.getItem('numOfGuesses');
  if (savedNumOfGuesses) {
    numOfGuesses.value = JSON.parse(savedNumOfGuesses);
  }
  const savedStreak = localStorage.getItem('streak');
  if (savedStreak) {
    streak.value = parseInt(savedStreak);
  }
});
</script>
