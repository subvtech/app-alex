<template>
  <div>
    <div class="d-flex align-center justify-space-between mb-4">
      <p class="text-h5 text-gray-800">
        {{ titleHeader }}
      </p>
      <slot
        name="action-button"
        :on-action-button="onActionButton"
        :on-submit="onSubmit"
        :add-meeting="addMeeting"
        :edit-meeting="editMeeting"
      />
    </div>
    <div
      v-if="!showItens"
      class="d-flex flex-column align-center justify-center gap-2"
    >
      <v-img width="150px" height="120px" :src="img" />
      <div>
        <h2 class="text-body-2 text-gray-800 max-w-200 text-center">
          {{ title }}
        </h2>
        <p class="text-body-5 text-gray-800 max-w-200 text-center">
          {{ subtitle }}
        </p>
      </div>
    </div>
    <div v-else class="d-flex flex-column gap-2">
      <slot name="items" :remove-meeting="removeMeeting" />
    </div>
  </div>
</template>

<script setup lang="ts" generic="T extends Partial<LearningClassType>">
import { MeetingPropsType } from '../../Meeting.vue';
import { LearningClassType, LearningScheduleCriation } from './index.vue';

type ClassScheduleProps = {
  titleHeader: string;
  title: string;
  subtitle: string;
  img: string;
  showItens?: boolean;
};
const { showItens = false } = defineProps<ClassScheduleProps>();
const classesData = defineModel<T | null>('classData');
const scheduleData = defineModel<
  (MeetingPropsType & { className: string }) | null
>('schedules');
const classes = defineModel<T[]>({ required: true });
const onActionButton = () => {
  classesData.value = null;
  scheduleData.value = null;
};
const onSubmit = (value: T) => {
  // @ts-ignore // FIXME: corrigir tipagem
  const newItem: T = {
    id: value.id,
    name: value.name,
    schedules: value.schedules || [],
    in_charge_member: value.in_charge_member,
    learning_plan_members: value.learning_plan_members || [],
  };
  if (!classesData.value) {
    classes.value = [...classes.value, newItem];
    return;
  }
  const updatedData = classes.value.map((item) => {
    if (newItem.id === item.id) {
      return newItem;
    }
    return item;
  });
  classes.value = updatedData;
};
const addMeeting = (meeting: MeetingPropsType & { className: string }) => {
  classes.value = classes.value.map((classValue) => {
    if (classValue.name === meeting.className) {
      const newMetting = {
        id: meeting.id,
        interval: meeting.interval,
        date: meeting.date,
        startHour: meeting.startHour,
        endHour: meeting.endHour,
        type: meeting.type,
        location: meeting.location,
        link: meeting.link,
      };
      const updatedClass = {
        ...classValue,
        schedules: [
          ...JSON.parse(JSON.stringify(classValue.schedules)),
          newMetting,
        ],
      };
      return updatedClass;
    }
    return classValue;
  });
};
const removeMeeting = (className: string, id: number) => {
  classes.value = classes.value.filter((item) => {
    const updatedClass = item;
    if (updatedClass.name === className) {
      updatedClass.schedules = item.schedules?.filter(
        (meeting) => meeting.id !== id,
      );
    }
    return updatedClass;
  });
};
const getWrongPlaceValues = (
  meeting: LearningScheduleCriation,
  classes: T[],
) => {
  const wrongPlacesItems: LearningScheduleCriation[] = [];
  classes.forEach((classValue) => {
    if (!classValue.schedules) return;
    classValue.schedules = classValue.schedules.filter((schedule) => {
      const sameIdWrongLocal =
        schedule.id === meeting.id && classValue.name !== meeting.className;
      if (sameIdWrongLocal) {
        wrongPlacesItems.push({ ...schedule, ...meeting });
        return false;
      }
      return true;
    });
  });
  return wrongPlacesItems;
};
const placeRightLocalItems = (
  wrongPlacesItems: LearningScheduleCriation[],
  classes: T[],
) => {
  const newClasses = classes;
  wrongPlacesItems.forEach((item) => {
    newClasses.map((classValue) => {
      const updatedClassValue = classValue;
      if (item.className === classValue.name) {
        updatedClassValue.schedules?.push(item);
      }
      return updatedClassValue;
    });
  });
  return newClasses;
};
const editMeeting = (meeting: LearningScheduleCriation) => {
  const updatedClasses = JSON.parse(
    JSON.stringify(
      classes.value.map((item) => {
        if (item.name === meeting.className) {
          return {
            ...item,
            schedules: item.schedules?.map((oldMeeting) =>
              oldMeeting.id === meeting.id ? meeting : oldMeeting,
            ),
          };
        }
        return item;
      }),
    ),
  );
  const wrongPlacesItems = getWrongPlaceValues(meeting, updatedClasses);
  classes.value = placeRightLocalItems(wrongPlacesItems, updatedClasses);
};
</script>

<style scoped>
.max-w-200 {
  max-width: 200px;
}
</style>
