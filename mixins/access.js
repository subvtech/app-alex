import hasAccess from '~/helpers/hasAccess';

export default {
  methods: {
    hasAccess(entity, action) {
      return hasAccess(this.$strapi.user, entity, action);
    },
  },
};
