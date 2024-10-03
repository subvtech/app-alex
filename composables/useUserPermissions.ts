const loading = ref(false);
const user = useStrapiUser<StrapiUser>();
const permissions = ref<string[]>([]);
const strapiClient = useStrapiClient();

export function useUserPermissions() {
  onMounted(async () => {
    if (!permissions.value.length && !loading.value) {
      loading.value = true;

      try {
        const { role } = await strapiClient<{ role: StrapiUser['role'] }>(
          `users-permissions/roles/${user.value.role.id}`,
        );

        permissions.value = Object.entries(role.permissions || {}).flatMap(([apiKey, apiVal]) =>
          Object.entries(apiVal.controllers).flatMap(([ctrlKey, ctrlVal]) =>
            Object.entries(ctrlVal)
              .filter(([_, actionVal]) => actionVal.enabled)
              .map(([actionKey]) => `${apiKey}.${ctrlKey}:${actionKey}`),
          ),
        );
      } finally {
        loading.value = false;
      }
    }
  });

  return permissions;
}
