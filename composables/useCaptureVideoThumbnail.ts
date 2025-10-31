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

const extractYoutubeId = (url: string) => {
  const shortLinkMatch = url.match(/youtu\.be\/([^?&#]+)/);
  if (shortLinkMatch?.[1]) return shortLinkMatch[1];

  const embedMatch = url.match(/embed\/([^?&#]+)/);
  if (embedMatch?.[1]) return embedMatch[1];

  const paramMatch = url.match(/[?&]v=([^?&#]+)/);
  if (paramMatch?.[1]) return paramMatch[1];

  return '';
};

export function useGetYoutubeThumbnail(url: string) {
  const videoId = extractYoutubeId(url);
  return videoId ? `https://img.youtube.com/vi/${videoId}/0.jpg` : '';
}

export function useGetVimeoThumbnail(url: string) {
  return `https://vumbnail.com/${url.split('vimeo.com/')[1]}.jpg`;
}
