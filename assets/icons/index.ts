import { h } from 'vue';
import type { IconSet, IconProps } from 'vuetify';
import trail from './Trail.vue';
import DragIndicator from './DragIndicator.vue';
import SortArrows from './SortArrows.vue';

const alexAliases = {
  trail,
  DragIndicator,
  SortArrows,
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
