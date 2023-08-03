const editorAttrs = `
  id
  title
  description

  tags {
    id
    tag
    verified
  }

  structure: structures(limit: 1, sort: "createdAt:desc") {
    id
    time
    updatedAt
    version

    blocks(sort: "order:asc") {
      id
      order
      type
      data
      tunes
    }
  }
  author { id username fullname avatar { id url } }
  coauthors { id username fullname avatar { id url } }

  default_class: classes_learning_plans(
    limit: 1,
    where: {class: {default: true}}
  ) {

    id
    class {
      id
      name
      default
      active
      start_at
      end_at
    }

  }

  image { id name url ext }
  isVisible
`;

const planAttrs = `
  ${editorAttrs}
  trails { ${editorAttrs} }
  users { id username avatar { id url } }
`;

export const learningplan = `
  query ($id: ID!) {
    learningplan(id: $id) {
      ${planAttrs}
    }
  }
`;

export const learningplans = `
  query {
    learningplans(where: {learningplan_null: true}) {
      ${planAttrs}
    }
  }
`;

export const authorLearningPlans = `
  query($author_id: ID!) {
    learningplans(where: {learningplan_null: true, author: $author_id}) {
      ${planAttrs}
    }
  }
`;

export const filteredLearningplans = `
  query($q: JSON) {
    learningplans(where: $q) {
      ${planAttrs}
    }
  }
`;

export const trail = `
  query ($id: ID!, $lp_id: ID!) {
    trail: learningplan(id: $id) {
      ${editorAttrs}
    }

    learningplan(id: $lp_id) {
      ${planAttrs}
    }
  }
`;

export const alluser = `
  query($q: JSON) {
    users(where: $q) {
      id
      cpf
      email
      username
      fullname
      role { name }
      isProfessor
      createdAt
      learningplans(where: {learningplan_null: true}) {
        ${planAttrs}
      }
    }
  }
`;

export const user = `
  query($q: JSON) {
    users(where: $q) {
      id
      username
      fullname
      role { name }
      learningplans(where: {learningplan_null: true}) {
        ${planAttrs}
      }
    }
  }
`;

export const role = `
  query($id: ID!, $q: JSON) {
    role(id: $id) {
      id
      name
      permissions(where: $q) {
        action
        controller
        enabled
      }
    }
  }
`;

export const assessmentCriteriaGroups = `
  query($author_id: ID!) {
    assessmentCriteriaGroups(where: {author: $author_id}) {
      id
      title
      author {
        id
      }
      assessment_criterias {
        id
        criteria
      }
    }
  }
`;

const taskAttrs = `
  id
  title
  description
  weight
  begin_at
  deadline_at
  status

  classes_learning_plan {
    id
  }
  learningplan {
    id
  }
  blocks {
    id
  }
  deliverables {
    title
    description
    weight
    type
    metadata
    required
    deliverable_assesment_criteria_groups {
      id
      title
      weight
      criteria_group_id
      assessment_criterias {
        id
        criteria
        weight
        criteria_id
      }
    }
  }
`;

export const tasks = `
  query($params: JSON!) {
    tasks(where: $params) {
      ${taskAttrs}
    }
  }
`;

export const tasksFromUserClass = `
  query($class_id: ID!, $user_id: ID!) {
    tasks(where: {classes_learning_plan: {class: $class_id}}) {
      ${taskAttrs}
      task_submissions(where: {student: $user_id}) {
        id
        status
      }
    }
  }
`;

export const userPlanClasses = `
  query($plan_id: ID!, $user_id: ID!) {
    classes(
      where: {
        classes_learning_plans: {learningplan: $plan_id},
        classes_users: {user: $user_id}
      }
    ) {
      id
    }
  }
`;

export const tags = `
  query($search: String ) {
    tags(where: {tag_contains: $search}) {
      id
      tag
      verified
    }
  }
`

export const tagsByids = `
  query($ids: [ID]! ) {
    tags(where: {id_in: $ids}) {
      id
      tag
      verified
    }
  }
`
