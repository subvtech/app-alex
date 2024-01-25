const list = ['youtube'];

export function isVideo(url: string) {
  return list.some((l) => url.includes(l));
}

export function getProvider(url: string) {
  let provider = '';

  if (isYoutubeVideo(url)) {
    provider = 'youtube';
  } else if (getVimeoId(url)) {
    provider = 'vimeo';
  }

  return provider;
}

export function getEmbedID(url: string) {
  const provider = getProvider(url);

  if (provider === 'vimeo') {
    return getVimeoId(url);
  }

  if (provider !== 'youtube') return '';

  const rx1 = /v=([\w-]+)&?/;
  const rx2 = /youtu\.?be(\.com\/embed)?\/([\w-]+)\??/;

  return (rx1.test(url) || rx2.test(url)) && (RegExp.$2 || RegExp.$1);
}

export function isYoutubeVideo(url: string) {
  return /youtu\.?be/.test(url);
}

export function getVimeoId(url: string) {
  // Look for a string with 'vimeo', then whatever, then a
  // forward slash and a group of digits.
  const match = /vimeo.*\/(\d+)/i.exec(url);

  // If the match isn't null (i.e. it matched)
  if (match) {
    // The grouped/matched digits from the regex
    return match[1];
  }

  return null;
}
