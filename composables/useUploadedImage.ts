const client = useStrapiClient();
export const useUploadedImage = () => {
  const updateImage = async (event, imageId) => {
    const files: FileList | null | undefined = event.target
      ? (event.target as HTMLInputElement).files
      : null;

    if (!files) return;

    const formData = new FormData();

    formData.append('files', files[0]);
    const data = await client<any>(`/upload?id=${imageId}`, {
      method: 'POST',
      body: formData,
    });

    return data;
  };

  return { updateImage };
};
