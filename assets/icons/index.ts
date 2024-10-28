import { h } from 'vue';
import type { IconProps, IconSet } from 'vuetify';
import ArticleFilled from './ArticleFilled.vue';
import DragIndicator from './DragIndicator.vue';
import FactCheck from './FactCheck.vue';
import HistoryEdu from './HistoryEdu.vue';
import Kanban from './Kanban.vue';
import ManageHistory from './ManageHistory.vue';
import ProjectConfig from './ProjectConfig.vue';
import RoundAddPhoto from './RoundAddPhoto.vue';
import Sprint from './Sprint.vue';
import trail from './Trail.vue';

const alexAliases = {
  trail,
  DragIndicator,
  RoundAddPhoto,
  Kanban,
  ProjectConfig,
  Sprint,
  ManageHistory,
  HistoryEdu,
  FactCheck,
  ArticleFilled,
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
