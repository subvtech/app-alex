<template>
  <alex-custom-dialog
    v-model="value"
    title="Criar novo projeto"
    name-main-button="Criar"
    name-second-button="Cancelar"
    :steps-config="stepsConfig"
    :loading="loading"
    step-class="d-flex gap-1"
    stepper-indicator-class="d-flex"
    stepper
    persistent
    @on-main-action="createProject"
  >
    <template #step1>
      <alex-inputs-text-field
        v-model="projectInfo.title"
        density="comfortable"
        name="title"
        label="Como vai se chamar seu Projeto?"
        placeholder="Digite um nome"
        required
      />

      <alex-inputs-text-area
        v-model="projectInfo.description"
        density="comfortable"
        name="description"
        label="Do que se trata seu Projeto?"
        placeholder="Digite uma descrição"
        theme="light"
        required
      />

      <div class="w-100 d-flex gap-4 flex-wrap">
        <alex-inputs-date
          v-model="projectInfo.startDate"
          class="flex-grow-1 min-w-60"
          name="startDate"
          label="Quando iniciará seu Projeto?"
          required
          density="comfortable"
          :allowed-dates="disablePastDates"
        />
        <alex-inputs-date
          v-model="projectInfo.endDate"
          class="flex-grow-1 min-w-60"
          density="comfortable"
          name="endDate"
          required
          label="Quando terminará seu Projeto?"
          :allowed-dates="disablePastDates"
        />
      </div>
      <alex-inputs-combobox
        v-model="projectInfo.areas"
        name="areas"
        multiple
        clearable
        label="Quais as áreas de atuação do Projeto?"
        placeholder="Selecione as áreas"
        hide-details
        item-title="text"
        :items="selectionFields?.data || []"
      />
      <TransitionGroup
        name="list"
        tag="div"
        class="w-100 d-flex gap-2 flex-wrap py-2 position-relative"
      >
        <alex-custom-chip
          v-for="(area, index) in projectInfo.areas"
          :key="area.id"
          :text="area.text"
          status="secondary"
          clickable
          @click="removeItem(index, 'area')"
        />
      </TransitionGroup>
      <alex-inputs-combobox
        v-model="projectInfo.product"
        name="product"
        label="Qual será o Produto do seu Projeto?"
        placeholder="Selecione um tipo de produto"
        hide-details
        item-title="text"
        :items="selectionProducts?.data || []"
      />
    </template>
    <template #step2>
      <alex-inputs-select
        v-model="associatedCourses"
        name="associatedCourses"
        label="Selecionar cursos"
        placeholder="Selecione os cursos associados"
        no-data-text="Você não possui cursos disponíveis"
        class="position-relative"
        item-title="title"
        :items="availableCoursesData || []"
        multiple
        hide-details
        return-object
        :menu-props="{
          offset: [5, 0],
        }"
        @update:menu="selectMenu = $event"
      >
        <template #item="{ props: courses, item }">
          <v-list-item class="pa-1" v-bind="courses" title="">
            <template #default>
              <div
                class="d-flex align-end pa-2 tw-flex-row ga-4 tw-cursor-pointer w-100"
              >
                <div
                  class="tw-w-[120px] tw-h-[80px] rounded-lg tw-bg-cover elevation-1 tw-bg-center"
                  :style="`background-image: url('${
                    item.raw.cover_image
                      ? item.raw.cover_image
                      : '/images/cover_image_course.svg'
                  }')`"
                />
                <div class="d-flex flex-column gap-1 align-start">
                  <p class="text-body-2 text-primary-0 tw-overflow-hidden">
                    {{ item.raw.title }}
                  </p>
                  <div class="d-flex gap-2 align-center justify-center width">
                    <v-avatar
                      :variant="
                        item.raw.facilitator.avatar ? 'flat' : 'outlined'
                      "
                      :image="item.raw.facilitator.avatar"
                      :alt="item.raw.facilitator.name"
                      size="36"
                      color="gray-600"
                      rounded="lg"
                      class="image-border"
                    >
                      <template v-if="!item.raw.facilitator.avatar" #default>
                        {{ getInitials(item.raw.facilitator.name) }}
                      </template>
                    </v-avatar>
                    <h4 class="text-body-3 text-gray-600 tw-overflow-hidden">
                      {{ item.raw.facilitator.name }}
                    </h4>
                  </div>
                </div>
              </div>
            </template>
          </v-list-item>
        </template>
      </alex-inputs-select>
      <TransitionGroup
        :name="selectMenu ? '' : 'list'"
        tag="div"
        class="w-100 d-flex gap-2 flex-wrap position-relative mt-4"
      >
        <div
          v-for="(course, index) in associatedCourses"
          :key="course.id"
          class="tw-w-[150px] tw-h-[100px] rounded-lg tw-bg-cover card tw-overflow-hidden d-flex align-end elevation-1"
          :style="`background-image: url('${
            course.cover_image
              ? course.cover_image
              : '/images/cover_image_course.svg'
          }')`"
        >
          <alex-custom-button
            class="delete-btn tw-rounded-l"
            variant="secondary"
            size="small"
            icon="mdi-trash-can-outline"
            @click.stop="removeItem(index, 'course')"
          />
          <div class="text-shadow height-15 w-100 d-flex align-end">
            <p class="ellipsis lines-2 text-body-6 text-white mx-2 my-4">
              {{ course.title }}
            </p>
          </div>
        </div>
      </TransitionGroup>
    </template>
    <template #step3>
      <alex-learningplan-task-members
        kind="project"
        :learningplan-ids="associatedCourses.map((course) => course.id)"
        :students="students"
        @set-members="(e) => (students = e)"
      />
    </template>
  </alex-custom-dialog>
</template>

<script setup lang="ts">
type FieldSimpleOptionalId = Omit<FieldSimple, 'id'> & { id?: number };
type ProductSimpleOptionalId = Omit<ProductSimple, 'id'> & { id?: number };

interface ProjectType {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  areas: FieldSimpleOptionalId[];
  product: ProductSimpleOptionalId | null;
}

interface CoursesInfo {
  id: number;
  title: string;
  cover_image?: string;
  facilitator: {
    id: number;
    name: string;
    avatar?: string;
  };
}

const students = ref<LearningPlanMemberSimple[]>([]);

const loading = ref(false);

withDefaults(defineProps<{ modelValue?: boolean }>(), {
  modelValue: false,
});
const emit = defineEmits(['update:modelValue', 'submit']);
const value = defineModel<boolean>({ required: true });
const { find } = useStrapiUtils();
const client = useStrapiClient();

const projectInfo = ref<ProjectType>({
  title: '',
  description: '',
  startDate: '',
  endDate: '',
  areas: [],
  product: null,
});

const user = useStrapiUser<User>();
const { setMessage } = useMessageStore();

const queryConfig = {
  filters: {
    members: {
      $and: [
        { user: { id: { $eq: user.value.id } } },
        { status: { $eq: 'joined' } },
      ],
    },
    $or: [
      {
        members: {
          user: { id: { $eq: user.value.id } },
          role: { $ne: 'student' },
        },
      },
      {
        hidden: { $eq: false },
      },
    ],
    archived_at: { $notNull: false },
  },
  populate: {
    cover_image: true,
    members: {
      populate: ['user.avatar'],
      filters: {
        role: { $eq: 'facilitator' },
      },
    },
  },
  sort: 'id:desc',
};

const { data: availableCoursesData } = await useAsyncData(
  'availableCourses',
  () => find<LearningPlanSimple>('learningplans', queryConfig),
  {
    default: () => ({ meta: 0, data: [] as LearningPlanSimple[] }),
    lazy: true,
    transform: (value) =>
      value.data.map((course) => ({
        id: course.id,
        title: course.title,
        cover_image: course.cover_image?.url,
        facilitator: {
          id: course.members[0].user.id,
          name: course.members[0].user.fullname,
          avatar: course.members[0].user.avatar?.url,
        },
      })),
  },
);

const { data: selectionProducts } = await useAsyncData(
  'availableProducts',
  () =>
    find<ProductSimple>('products', {
      filters: {
        $or: [{ isPublic: true }, { verified_by: user.value.id }],
      },
    }),
  {
    default: () => ({ meta: 0, data: [] }),
    lazy: true,
  },
);

const { data: selectionFields } = await useAsyncData(
  'availableFields',
  () =>
    find<ProductSimple>('fields', {
      filters: {
        $or: [{ isPublic: true }, { verified_by: user.value.id }],
      },
    }),
  {
    default: () => ({ meta: 0, data: [] }),
    lazy: true,
  },
);

const associatedCourses = ref<CoursesInfo[]>([]);

const selectMenu = ref(false);

const { createProjectRules } = useFormRules();

const removeItem = (index: number, type: string) => {
  if (type === 'area') {
    const newAreas = [...projectInfo.value.areas];
    newAreas.splice(index, 1);
    projectInfo.value.areas = newAreas;
  } else if (type === 'course') {
    const newCourses = [...associatedCourses.value];
    newCourses.splice(index, 1);
    associatedCourses.value = newCourses;
  }
};

const stepsConfig = {
  step1: {
    title: 'Informações',
    subtitle: 'Básicas',
    scheme: createProjectRules,
  },
  step2: {
    title: 'Cursos',
    subtitle: 'Associados',
  },
  step3: {
    title: 'Integrantes',
    subtitle: 'Cadastrados',
  },
};

watch(
  () => projectInfo.value.areas,
  (newAreas) => {
    const lastArea = newAreas[newAreas.length - 1];
    if (typeof lastArea === 'string') {
      newComboboxItem(lastArea, 'area');
    }
  },
  { deep: true },
);

watch(
  () => projectInfo.value.product,
  (newProduct) => {
    if (typeof newProduct === 'string') {
      newComboboxItem(newProduct, 'product');
    }
  },
);

const newComboboxItem = (text: string, type: 'area' | 'product') => {
  const newItem = {
    text,
    isPublic: false,
    verified_date: new Date(),
    verified_by: user.value.id,
  };

  type === 'area'
    ? projectInfo.value.areas.splice(
        projectInfo.value.areas.length - 1,
        1,
        newItem,
      )
    : (projectInfo.value.product = newItem);
};

const disablePastDates = (date: Date) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const passedDate = new Date(date);
  return passedDate >= today;
};

const createProject = async () => {
  try {
    loading.value = true;
    await client('learningplans/create-project', {
      method: 'POST',
      body: {
        title: projectInfo.value.title,
        description: projectInfo.value.description,
        start_date: projectInfo.value.startDate,
        end_date: projectInfo.value.endDate,
        slug: `project-${projectInfo.value.title}`,
        type: 'project',
        fields: projectInfo.value.areas,
        product: projectInfo.value.product,
        course: associatedCourses.value.map((course) => course.id),
        users: students.value.map((student) => student.user?.id || student.id),
      },
    });
    emit('submit');
    emit('update:modelValue', false);
    setMessage('Projeto Criado com sucesso', 'success', true);
  } catch (error) {
    setMessage('Erro ao criar o projeto, tente novamente', 'error', true);
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.card {
  position: relative;
  background-position: center;
  min-width: 150px;
  transition:
    box-shadow 0.5s,
    transform 0.3s;
}

.text-shadow {
  background: linear-gradient(
    180deg,
    rgba(0, 0, 0, 0) 10.81%,
    rgba(0, 0, 0, 0.37) 48.72%,
    rgba(0, 0, 0, 0.7) 100%
  );
}

.delete-btn {
  position: absolute !important;
  top: 8px;
  right: 8px;
}

.image-border {
  border: 1px solid rgb(var(--v-theme-gray-400));
}

.select-item {
  transition: all 0.3s;
  &:hover {
    background-color: rgb(var(--v-theme-secondary--2));
  }
}

.list-move,
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease-out;
}
.list-leave-to,
.list-enter-from {
  opacity: 0;
}

.list-enter-from {
  transform: translateX(90px);
}

.list-leave-active {
  position: absolute;
}
</style>
