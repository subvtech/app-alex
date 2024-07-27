import { VueRenderer } from '@tiptap/vue-3';
import tippy from 'tippy.js';

import MentionList from './MentionList.vue';

const strapi = useStrapiUtils();

export default {
  items: async (props, taskId = 0) => {
    const task = await strapi.find<TaskSimple>('tasks', {
      populate: [
        'task_members',
        'task_members.learning_plan_group.group_members.student_member.user.avatar',
        'task_members.learning_plan_member',
        'task_members.learning_plan_member.user',
        'task_members.learning_plan_member.user.avatar',
      ],
      filters: {
        id: taskId,
      },
    });

    const taskMembers = task.data && task.data[0] && task.data[0].task_members;

    if (!taskMembers) {
      return [];
    }

    const users: (UserSimple | undefined)[] = [];

    taskMembers.forEach((member) => {
      if (member.learning_plan_member?.user) {
        users.push(member.learning_plan_member?.user);
      }

      // Pegar membros dos grupos
      else if (member.learning_plan_group?.group_members) {
        member.learning_plan_group?.group_members.forEach((member) => {
          users.push(member.student_member.user);
        });
      }
    });

    return [...new Set(users)]
      .filter((user) => user !== undefined)
      .filter(
        ({ fullname, username }) =>
          fullname.toLowerCase().startsWith(props.query.toLowerCase()) ||
          username.toLowerCase().startsWith(props.query.toLowerCase()),
      )
      .slice(0, 5);
  },

  render: () => {
    let component;
    let popup;

    return {
      onStart: (props) => {
        component = new VueRenderer(MentionList, {
          // using vue 2:
          // parent: this,
          // propsData: props,
          // using vue 3:
          props,
          editor: props.editor,
        });

        if (!props.clientRect) {
          return;
        }

        popup = tippy('body', {
          getReferenceClientRect: props.clientRect,
          appendTo: () => document.body,
          content: component.element,
          showOnCreate: true,
          interactive: true,
          trigger: 'manual',
          placement: 'bottom-start',
        });
      },

      onUpdate(props) {
        component.updateProps(props);

        if (!props.clientRect) {
          return;
        }

        popup[0].setProps({
          getReferenceClientRect: props.clientRect,
        });
      },

      onKeyDown(props) {
        if (props.event.key === 'Escape') {
          popup[0].hide();

          return true;
        }

        return component.ref?.onKeyDown(props);
      },

      onExit() {
        popup[0].destroy();
        component.destroy();
      },
    };
  },
};
