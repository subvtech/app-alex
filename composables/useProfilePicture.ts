
export const useProfilePicture = (avatar, userId) => {
  const client = useStrapiClient();

  const userStore = useUserStore();
  const { updateImage, uploadImage, removeImage } = useUploadedImage();
  async function removeProfilePicture() {
    if (!avatar.value) return;
    await removeImage(avatar.value.id);
    avatar.value = null;
    userStore.profilePicture = null;
  }

  async function uploadProfilePicture(event: any) {
    if (avatar.value) {
      const { updatedAt } = await updateImage(event, avatar.value.id);

      const url = avatar.value.url?.split('?');
      if (url) avatar.value.url = url[0] + '?' + updatedAt;
    } else {
      const temp = await uploadImage(event);
      avatar.value = { url: temp[0].url, id: temp[0].id };

      await client(`/users/${userId}`, {
        method: 'PUT',
        body: { avatar: temp[0].id },
      });
    }
    userStore.profilePicture = avatar.value;
  }
  return { uploadProfilePicture, removeProfilePicture };
};
