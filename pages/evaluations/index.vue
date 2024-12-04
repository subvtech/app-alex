<script setup lang="ts">
    definePageMeta({
      middleware:[(to)=> to.path + '/me'],
    });
</script>

