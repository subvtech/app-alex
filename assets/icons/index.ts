import { h } from 'vue';
import type { IconSet, IconProps } from 'vuetify';
import trail from './Trail.vue';
import DragIndicator from './DragIndicator.vue';

const alexAliases = {
  trail,
  DragIndicator,
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
