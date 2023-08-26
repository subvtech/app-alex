<script>
const { value, successPage } = useRouteStore();
export default {
  async middleware({ redirect }) {
    if (!value || !successPage) {
      return redirect('/register');
    }
  },
};
</script>
