export const useInvitationLink = () => {
  const { create, delete: _delete } = useStrapi();
  function removeAfterLastSlash(url) {
    const lastSlashIndex = url.lastIndexOf('/');
    if (lastSlashIndex !== -1) {
      return url.substring(0, lastSlashIndex);
    } else {
      return url;
    }
  }
  const fullPath = removeAfterLastSlash(window.location.href);

  const generateUrl = (hash, learningPlanId = 0) =>
    `${fullPath}/${learningPlanId}/join/${hash}`;

  function msToHHMMSS(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    let hours: string | number = Math.floor(totalSeconds / 3600);
    let minutes: string | number = Math.floor(
      (totalSeconds - hours * 3600) / 60,
    );
    let seconds: string | number = totalSeconds - hours * 3600 - minutes * 60;

    // Pad the hours, minutes, and seconds with leading zeros, if required
    hours = hours < 10 ? '0' + hours : hours;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    seconds = seconds < 10 ? '0' + seconds : seconds;

    return hours + ':' + minutes + ':' + seconds;
  }

  const calcRemainingTime = (date: Date) => {
    return new Date(date).getTime() - new Date().getTime();
  };

  const generateNewInvite = async (
    inviteId: number | string | null,
    duration: number,
    learningplanId: number | string,
  ) => {
    try {
      if (inviteId) await _delete('invitation-links', inviteId);
    } catch {}

    const result: any = await create('invitation-links', {
      duration,
      learningplan: learningplanId,
    });

    return result;
  };

  return { generateUrl, msToHHMMSS, calcRemainingTime, generateNewInvite };
};
