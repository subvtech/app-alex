const client = useStrapiClient();
export const useUploadedImage = () => {
  const updateImage = async (event: Event, imageId: string): Promise<any> => {
    const files: FileList | null | undefined = event.target
      ? (event.target as HTMLInputElement).files
      : null;

    if (!files) return;

    const formData = new FormData();

    formData.append('files', files[0]);
    try {
      const data = await client<any>(`/upload?id=${imageId}`, {
        method: 'POST',
        body: formData,
      });
      return data;
    } catch (error) {
      console.error(`Error updating image: ${error}`);
    }
  };

  const uploadImage = async (event) => {
    const files: FileList | null | undefined = event.target
      ? (event.target as HTMLInputElement).files
      : null;

    if (!files) return;

    const formData = new FormData();

    formData.append('files', files[0]);
    const data = await client<any>('/upload', {
      method: 'POST',
      body: formData,
    });

    return data;
  };

  const removeImage = async (imageId) => {
    const data = await client<any>(`/upload/files/${imageId}`, {
      method: 'DELETE',
    });

    return data;
  };

  return { updateImage, uploadImage, removeImage };
};
