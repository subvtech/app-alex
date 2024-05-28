<template>
  <v-menu class="invite-member">
    <!-- Exibição -->
    <template #activator="{ props }">
      <alex-custom-button
        v-bind="props"
        class="ml-auto"
        variant="secondary"
        prepend-icon="mdi-plus"
        >{{
          $t('components.learningPlan.members.invite.label')
        }}</alex-custom-button
      >
    </template>

    <!-- Opções -->
    <v-list class="list pt-1">
      <alex-inputs-text-field
        class="px-4 py-2"
        name="member"
        :placeholder="$t('components.learningPlan.members.invite.search')"
        prepend-inner-icon="mdi-magnify"
        density="compact"
        clearable
      />

      <hr />

      <!-- Turmas -->
      <p class="pa-4 pb-2 text-body-4 text-gray-800 lines-1 ellipsis">
        {{ $t('components.learningPlan.members.invite.classes') }}
      </p>

      <v-list-item
        v-for="(group, index) in classes"
        :key="index"
        :value="index"
        class="px-4 py-2"
      >
        <v-list-item-title
          ><div class="d-flex align-center ga-4">
            <v-img
              class="avatar flex-0-0 rounded-circle"
              :src="
                group.avatarUrl ||
                'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'
              "
              :alt="$t('components.learningPlan.members.class')"
              aspect-ratio="1"
              cover
            />
            <p class="text-body-4 text-gray-900 lines-1 ellipsis">
              {{
                group.name || $t('components.learningPlan.members.missing.name')
              }}
            </p>
          </div></v-list-item-title
        >
      </v-list-item>

      <!-- Alunos -->
      <div v-for="(group, index) in classes" :key="index">
        <p class="pa-4 pb-2 text-body-4 text-gray-800 lines-1 ellipsis">
          {{ $t('components.learningPlan.members.invite.members') }} ({{
            group.name
          }})
        </p>

        <v-list-item
          v-for="(student, studentIndex) in group.students"
          :key="group.name + studentIndex"
          :value="studentIndex"
          class="px-4 py-2"
        >
          <v-list-item-title
            ><div class="d-flex align-center ga-4">
              <v-img
                class="avatar flex-0-0 rounded-circle"
                :src="
                  student.avatarUrl ||
                  'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'
                "
                :alt="$t('components.learningPlan.members.class')"
                aspect-ratio="1"
                cover
              />
              <div>
                <p class="text-body-4 text-gray-900 lines-1 ellipsis">
                  {{
                    student.name ||
                    $t('components.learningPlan.members.missing.name')
                  }}
                </p>
                <p class="text-body-5 text-gray-500 lines-1 ellipsis">
                  {{
                    student.email ||
                    $t('components.learningPlan.members.missing.email')
                  }}
                </p>
              </div>
            </div></v-list-item-title
          >
        </v-list-item>
      </div>
    </v-list>
  </v-menu>
</template>

<script setup lang="ts">
interface StudentProps {
  name: string;
  email: string;
  avatarUrl: string;
}

interface ClassesProps {
  name: string;
  avatarUrl: string;
  students: StudentProps[];
}

const classes: ClassesProps[] = [
  {
    name: 'Turma A',
    avatarUrl:
      'https://cdn.pixabay.com/photo/2024/02/26/19/39/monochrome-image-8598798_640.jpg',
    students: [
      {
        name: 'Lucas Cassiano Teste Teste Teste Teste Teste Teste Teste',
        email: 'lucascassiano@gmail.com',
        avatarUrl:
          'https://cdn.pixabay.com/photo/2024/02/26/19/39/monochrome-image-8598798_640.jpg',
      },
      {
        name: 'Jorge Almeida',
        email: 'jorgealmeida@hotmail.com',
        avatarUrl:
          'https://cdn.pixabay.com/photo/2024/02/26/19/39/monochrome-image-8598798_640.jpg',
      },
      {
        name: 'José Pereira da Silva',
        email: 'josepereiradasilva@gmail.com',
        avatarUrl:
          'https://cdn.pixabay.com/photo/2024/02/26/19/39/monochrome-image-8598798_640.jpg',
      },
    ],
  },
  {
    name: 'Turma B',
    avatarUrl:
      'https://cdn.pixabay.com/photo/2024/02/26/19/39/monochrome-image-8598798_640.jpg',
    students: [
      {
        name: 'Lucas Cassiano',
        email: 'lucascassiano@gmail.com',
        avatarUrl:
          'https://cdn.pixabay.com/photo/2024/02/26/19/39/monochrome-image-8598798_640.jpg',
      },
      {
        name: 'Jorge Almeida',
        email: 'jorgealmeida@hotmail.com',
        avatarUrl:
          'https://cdn.pixabay.com/photo/2024/02/26/19/39/monochrome-image-8598798_640.jpg',
      },
    ],
  },
];
</script>

<style scoped>
.invite-member .list {
  width: 320px;
  max-height: 95%;
}

.avatar {
  width: 40px;
  height: 40px;
}
</style>

<style>
.invite-member .v-input__details {
  display: none !important;
}
</style>
