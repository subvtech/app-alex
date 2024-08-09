import { h } from 'vue';
import type { IconSet, IconProps } from 'vuetify';
import trail from './Trail.vue';
import DragIndicator from './DragIndicator.vue';
import RoundAddPhoto from './RoundAddPhoto.vue';
import Kanban from './Kanban.vue';

const alexAliases = {
  trail,
  DragIndicator,
  RoundAddPhoto,
  Kanban,
};

const alexIcons: IconSet = {
  component: (props: IconProps) =>
    h(props.tag, [
      h(alexAliases[props.icon as string], {
        class: 'v-icon__svg',
      }),
    ]),
};

export { alexIcons /* aliases */ };
