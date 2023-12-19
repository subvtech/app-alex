export function useStrapiHelpers() {
  const { t } = useI18n();
  const ERRORS = {
    'Invalid identifier or password': t('errors.invalidIdentifierPassword'),
    'Your account has been blocked by an administrator': t(
      'errors.blockedByAdministrator',
    ),
    'Your account email is not confirmed': t('errors.emailIsNotConfirmed'),
    default: t('errors.default'),
  };
  const mapStrapiErrors = (message: string) => {
    return ERRORS[message] || ERRORS.default;
  };

  return {
    mapStrapiErrors,
  };
}
