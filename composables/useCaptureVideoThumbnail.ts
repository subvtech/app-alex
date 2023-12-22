export function useCaptureVideoThumbnail(file: File) {
  return new Promise((resolve, reject) => {
    const videoEl = document.createElement('video');
    videoEl.muted = true;
    videoEl.autoplay = false;
    videoEl.preload = 'metadata';
    videoEl.src = URL.createObjectURL(file);

    videoEl.addEventListener('loadedmetadata', () => {
      const canvas = document.createElement('canvas');
      canvas.width = videoEl.videoWidth;
      canvas.height = videoEl.videoHeight;
      const ctx = canvas.getContext('2d');
      const seekTime = Math.min(3, videoEl.duration);
      videoEl.currentTime = seekTime;

      videoEl.addEventListener('seeked', () => {
        ctx?.drawImage(videoEl, 0, 0, canvas.width, canvas.height);
        const thumbnailDataUrl = canvas.toDataURL('image/jpeg');
        videoEl.remove();
        canvas.remove();
        resolve(thumbnailDataUrl);
      });

      videoEl.addEventListener('error', (e) => {
        reject(e);
      });
    });
  });
}

export function useGetYoutubeThumbnail(url: string) {
  return `https://img.youtube.com/vi/${url.split('v=')[1]}/0.jpg`;
}

export function useGetVimeoThumbnail(url: string) {
  return `https://vumbnail.com/${url.split('vimeo.com/')[1]}.jpg`;
}
