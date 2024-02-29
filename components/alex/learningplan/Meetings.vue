<template>
  <alex-custom-card
    class="w-100"
    :title="$t('components.meeting.title')"
    align-content="align-center"
    :show-icon="false"
    :href="`${learningPlanId}/settings`"
  >
    <template #content>
      <div
        v-if="myData.length === 0"
        class="d-flex justify-center w-100"
        :class="isEditing ? 'bordered pa-6' : ''"
      >
        <span class="desactivated">{{
          $t(
            `components.courses.meeting.empty.${
              isFacilitator ? 'facilitator' : 'student'
            }`,
          )
        }}</span>
      </div>
      <course-meeting
        v-for="(item, index) in myData"
        v-else
        :key="index"
        :date="new Date(item.date)"
        :start-hour="item.startHour"
        :end-hour="item.endHour"
        :interval="item.interval"
        :variant="variant"
        :dropdown-props="[
          {
            onClick: () => editMeeting(item),
            text: 'Editar',
            icon: 'mdi-pencil',
          },
          {
            onClick: () => openExclusionDialog(item.id),
            text: 'Apagar',
            icon: 'mdi-trash-can-outline',
            warning: true,
          },
        ]"
      />
      <alex-learningplan-dialogs-delete-schedule
        :dialog="dialogMeetingExclusion"
        :remove-function="removeMeeting"
        @close="dialogMeetingExclusion = false"
      />
    </template>

    <template v-if="variant === 'editing' && canEdit" #footer>
      <div class="d-flex w-100 justify-end">
        <alex-custom-button prepend-icon="mdi-plus" variant="primary"
          >{{ $t('components.courses.settings.meetings.add') }}
          <alex-learningplan-dialogs-schedule
            v-model="createScheduleModal"
            v-model:data="editData"
            @submit="
              (values) =>
                !editData ? addMeeting(values) : updateMeeting(values)
            "
          />
        </alex-custom-button>
      </div>
    </template>
  </alex-custom-card>
</template>

<script setup lang="ts">
import {
  MeetingVariantType,
  MeetingPropsType,
} from '@/components/CourseMeeting.vue';

const { create, update, delete: _delete } = useStrapi();

export type ScheduleResponseType = {
  id: number;
  attributes: MeetingPropsType;
};

export interface MeetingsPropsType {
  variant?: MeetingVariantType;
  data: MeetingPropsType[];
  endDate: Date;
  canEdit: boolean;
  learningPlanId: number;
  isFacilitator: boolean;
}

const props = withDefaults(defineProps<MeetingsPropsType>(), {
  data: () => [],
  canEdit: false,
  variant: 'list',
  isFacilitator: false,
});

const { data } = toRefs(props);
const myData = toRef(data.value);

const createScheduleModal = ref(false);
const dialogMeetingExclusion = ref(false);
const deleteId = ref();

const editData = ref<MeetingPropsType | null>(null);

const setDateTime = (
  endHour: string,
  startHour: string,
  date: Date,
  interval: number,
) => {
  const [endHours, endMinutes] = endHour.split(':');
  const [startHours, startMinutes] = startHour.split(':');

  const meetingStartDate = new Date(date);
  meetingStartDate.setHours(parseInt(startHours));
  meetingStartDate.setMinutes(parseInt(startMinutes));

  const meetingEndDate = interval === 0 ? date : props.endDate;
  meetingEndDate.setHours(parseInt(endHours));
  meetingEndDate.setMinutes(parseInt(endMinutes));
  return [meetingStartDate, meetingEndDate];
};

const addMeeting = async (values: MeetingPropsType) => {
  createScheduleModal.value = false;

  const [meetingStartDate, meetingEndDate] = setDateTime(
    values.endHour,
    values.startHour,
    values.date,
    values.interval,
  );

  const result = await create('learning-plan-meeting-schedules', {
    ...values,
    name: 'name',
    learningplan: props.learningPlanId,
    startDate: meetingStartDate,
    endDate: meetingEndDate,
  });

  myData.value.push({ ...values, id: result.data.id.toString() });
};

const editMeeting = (values: MeetingPropsType) => {
  createScheduleModal.value = true;
  editData.value = values;
};

const updateMeeting = async (values) => {
  createScheduleModal.value = false;
  const [meetingStartDate, meetingEndDate] = setDateTime(
    values.endHour,
    values.startHour,
    values.date,
    values.interval,
  );

  myData.value = myData.value.map((meeting) => {
    if (meeting.id === values.id) {
      return {
        ...values,
        startDate: meetingStartDate,
        endDate: meetingEndDate,
        learningplan: props.learningPlanId,
      };
    }
    return meeting;
  });

  await update('learning-plan-meeting-schedules', values.id, {
    ...values,
    startDate: meetingStartDate,
    endDate: meetingEndDate,
  });
  editData.value = null;
};

const openExclusionDialog = (id) => {
  dialogMeetingExclusion.value = true;
  if (id) deleteId.value = id;
};

const removeMeeting = async () => {
  dialogMeetingExclusion.value = false;
  await _delete('learning-plan-meeting-schedules', deleteId.value);
  myData.value = myData.value.filter((item) => item.id !== deleteId.value);
};

const isEditing = computed(() => props.variant === 'editing');

watch(data, () => {
  myData.value = data.value;
});
</script>

<style scoped lang="scss">
.title {
  color: var(--Cinza-Cinza-800, #454d54);

  /* Header/H5 */
  font-family: Sen;
  font-size: 18px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  letter-spacing: 0.36px;
}

.bordered {
  border-radius: 8px;
  border: 1px solid var(--Cinza-Cinza-100, #ebedef);
}

.desactivated {
  color: var(--cinza-cinza-500, #8291a1);
  text-align: center;

  /* Body/P1 */
  font-family: Sen;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 135%; /* 21.6px */
  letter-spacing: 0.32px;
}
</style>
