export default function (user, entity, action) {
  // FIXME: Corrigir validação para refletir
  // apenas conteúdo que o usuário pode editar.
  const { permissions = {} } = user || {};
  return !!(permissions[entity] || []).includes(action);
}
