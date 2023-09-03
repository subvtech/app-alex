import { h } from 'vue';
import type { IconSet, IconProps } from 'vuetify';
import tickIcon from './customSVGs/tickicon.vue';
import closeIcon from './customSVGs/close-icon.vue';

const alexAliases = {
  tickIcon,
  closeIcon,
};

const alexIcons: IconSet = {
  component: (props: IconProps) => h(alexAliases[props.icon]),
};

export { alexIcons /* aliases */ };
