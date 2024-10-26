<script setup lang="ts">
definePageMeta({
  middleware: [(to) => to.path + '/criteria'],
});
</script>
