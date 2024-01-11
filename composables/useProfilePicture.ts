export const useProfilePicture = (profile, userId) => {
  const client = useStrapiClient();
  const userStore = useUserStore();

  const { updateImage, uploadImage, removeImage } = useUploadedImage();
  async function removeProfilePicture() {
    if (!profile.value) return;
    await removeImage(profile.value.id);
    profile.value = null;
    userStore.avatar = undefined;
  }

  async function uploadProfilePicture(event: any) {
    if (profile.value) {
      const { updatedAt } = await updateImage(event, profile.value.id);

      const url = profile.value.url?.split('?');
      if (url) profile.value.url = url[0] + '?' + updatedAt;
    } else {
      const temp = await uploadImage(event);
      profile.value = { url: temp[0].url, id: temp[0].id };

      await client(`/users/${userId}`, {
        method: 'PUT',
        body: { avatar: temp[0].id },
      });
    }

    userStore.avatar = profile.value;
  }
  return { uploadProfilePicture, removeProfilePicture };
};
