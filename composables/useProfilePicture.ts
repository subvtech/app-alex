export const useProfilePicture = (profile, userId) => {
  const client = useStrapiClient();
  const userStore = useUserStore();
  const isLoading = ref(false);
  const { updateImage, uploadImage, removeImage } = useUploadedImage();
  async function removeProfilePicture() {
    if (!(profile.value && userStore.user)) return;
    isLoading.value = true;
    await removeImage(profile.value.id);
    userStore.user.avatar = undefined;
    isLoading.value = false;
  }

  async function uploadProfilePicture(event: any) {
    if (!userStore.user) return;

    isLoading.value = true;
    if (profile.value) {
      const { updatedAt } = await updateImage(event, profile.value.id);

      const url = profile.value.url?.split('?');
      if (url) profile.value.url = url[0] + '?' + updatedAt;
    } else {
      const temp = await uploadImage(event);
      userStore.user.avatar = { url: temp[0].url, id: temp[0].id };

      await client(`/users/${userId}`, {
        method: 'PUT',
        body: { avatar: temp[0].id },
      });
    }

    userStore.user.avatar = profile.value;
    isLoading.value = false;
  }
  return { uploadProfilePicture, removeProfilePicture, isLoading };
};
