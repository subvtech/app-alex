const editorAttrs = `
  title
  description
  isVisible
  image {
    data {
      id
      attributes {
        url
        name
        ext
      }
    }
  }
  tags {
    data {
      id
      attributes {
        tag
        verified
      }
    }
  }
  structure: structures(pagination: {limit: 1}, sort: "createdAt:desc") {
    data {
      id
      attributes {
        time
        updatedAt
        version
        blocks(sort: "order") {
          data {
            id
            attributes {
              order
              type
              data
              tunes
            }
          }
        }
      }
    }
  }
  author {
    data {
      id
      attributes {
        username
        fullname
        avatar {
          data {
            id
            attributes {
              url
            }
          }
        }
      }
    }
  }
  coauthors {
    data {
      id
      attributes {
        username
        fullname
        avatar {
          data {
            id
            attributes {
              url
            }
          }
        }
      }
    }
  }
  default_class: classes_learning_plans(filters: {class: {default: {eq: true}}},pagination: {limit: 1}) {
    data {
      id
      attributes {
        class {
          data {
            id
            attributes {
              name
              default
              active
              start_at
              end_at
            }
          }
        }
      }
    }
  }
  
`;

const planAttrs = `
 data {
  id 
  attributes {
    ${editorAttrs}
    trails {
      data {
        id
        attributes {
          ${editorAttrs}
        }
      }
    }
  }
 }
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
    learningplans(filters: {learningplan: {id: {null: true}}) {
      ${planAttrs}
    }
  }
`;

export const authorLearningPlans = `
  query($author_id: ID!) {
    learningplans(filters: {learningplan: {id: {null: true}}, author: {id: {eq: $author_id}}}) {
      ${planAttrs}
    }
  }
`;

export const filteredLearningplans = `
  query($q: JSON) {
    learningplans(filters: $q) {
      ${planAttrs}
    }
  }
`;

export const trail = `
  query ($id: ID!, $lp_id: ID!) {
    trail: learningplan(id: $id) {
      data {
        id
        attributes {
          ${editorAttrs}
        }
      }
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
    users(filters: $q) { 
      data { 
        id
        attributes {
          username
          fullname
          role { 
            data {
              id
              attributes {
                name 
              }
            }
          }
          learningplans(filters: {learningplan: {id: {null: true}}) {
            ${planAttrs}
          }
        }
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
    classes (filters: {classes_learning_plans: {learningplan: {id: {eq: $plan_id}}}, classes_users: {id: {eq: $user_id}}}){
      data {
        id
        attributes {
          active
        
        }
        
      }
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
`;

export const tagsByids = `
  query($ids: [ID]! ) {
    tags(where: {id_in: $ids}) {
      id
      tag
      verified
    }
  }
`;

export const GetLearningPlans = `
query ($userId: ID!) {
  learningplans(filters: { members: { user: { id: { eq: $userId } } } }) {
    data {
      id
      attributes {
        title
        description
        start_date
        end_date
        hidden
      	learning_structure{
          data{
            attributes{
              trails{
                data{
                  id
                }
              }
            }
          }
        }
        tags{
          data{
            attributes{
              text
              isGeneral
            }
          }
        }
        cover_image {
          data {
            attributes {
              url
            }
          }
        }
        members(filters: {role: {eq: "facilitator"}}) {
          data {
           attributes{ 
            user{
              data{
                attributes{
                  fullname
                  institutions{
                    data{
                      attributes{
                        name
                      }
                    }
                  }
                  avatar{
                    data{
                      attributes{
                        url
                      }
                    }
                  }
                }
              }
            }
          }
          }
        }
      }
    }
  }
}
`;
