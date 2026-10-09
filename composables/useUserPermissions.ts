const loading = ref(false);
const user = useStrapiUser<StrapiUser>();
const permissions = ref<string[]>([]);
const strapiClient = useStrapiClient();

export function useUserPermissions() {
  const fetchPermissions = async () => {
    const roleId = user.value?.role?.id;
    if (!roleId || permissions.value.length || loading.value) {
      return;
    }
    loading.value = true;

    try {
      const { role } = await strapiClient<{ role: StrapiUser['role'] }>(
        `users-permissions/roles/${roleId}`,
      );

      permissions.value = Object.entries(role?.permissions || {}).flatMap(([apiKey, apiVal]) =>
        Object.entries(apiVal?.controllers || {}).flatMap(([ctrlKey, ctrlVal]) =>
          Object.entries(ctrlVal || {})
            .filter(([_, actionVal]) => actionVal?.enabled)
            .map(([actionKey]) => `${apiKey}.${ctrlKey}:${actionKey}`),
        ),
      );
    } catch (err) {
      console.error('Failed to fetch user permissions:', err);
    } finally {
      loading.value = false;
    }
  };

  onMounted(() => {
    fetchPermissions();
  });

  watch(() => user.value?.role?.id, () => {
    fetchPermissions();
  });

  return permissions;
}
