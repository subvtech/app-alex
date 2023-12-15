export const useInvitationLink = () => {
    
  function removeAfterLastSlash(url) {
    let lastSlashIndex = url.lastIndexOf('/');
    if (lastSlashIndex !== -1) {
      return url.substring(0, lastSlashIndex);
    } else {
      return url;
    }
  }
  const fullPath = removeAfterLastSlash(window.location.href);

  const generateUrl = (hash) => fullPath + '/join/' + hash;

  return { generateUrl };
};
