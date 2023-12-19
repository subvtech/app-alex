export function useStrapiHelpers() {
  const { t } = useI18n();
  const ERRORS = {
    'Invalid Identifier or Password': t('erros.invalidIdentifierPassword'),
    'Your account has been blocked by an administrator': t(
      'erros.blockedByAdministrator',
    ),
    'Your account email is not confirmed': t('erros.emailIsNotConfirmed'),
    default: t('erros.default'),
  };
  const mapStrapiErrors = (message: string) => {
    return ERRORS[message] || ERRORS.default;
  };

  return {
    mapStrapiErrors,
  };
}
