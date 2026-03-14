import { gql } from '@apollo/client/core';

const USER_FIELDS = `
  id
  fullname
  email
  phone
  status
  role
  scope
  createdAt
  updatedAt
`;

export const FIND_ALL_USERS = gql`
  query FindAllUsers($limit: Int = 5, $offset: Int = 0, $sort: JSON, $filters: JSON) {
    users: findAllUsers(limit: $limit, offset: $offset, sort: $sort, filters: $filters) {
      totalDocs
      limit
      offset
      totalPages
      page
      prevPage
      nextPage
      hasPrevPage
      hasNextPage
      pagingCounter
      docs {
        ${USER_FIELDS}
      }
    }
  }
`;

export const FIND_ALL_USERS_ACTIVE = gql`
  query FindAllUsersActive {
    users: findAllUsersActive {
      id
      fullname
    }
  }
`;

export const FIND_ONE_USER = gql`
  query FindOneUserById($id: ID!) {
    user: findOneUserById(id: $id) {
      ${USER_FIELDS}
    }
  }
`;

export const CREATE_ONE_USER = gql`
  mutation CreateOneUser($input: CreateUserInput!) {
    user: createOneUser(input: $input) {
      ${USER_FIELDS}
    }
  }
`;

export const UPDATE_ONE_USER = gql`
  mutation UpdateOneUserById($id: ID!, $input: UpdateUserInput!) {
    user: updateOneUserById(id: $id, input: $input) {
      ${USER_FIELDS}
    }
  }
`;

export const REMOVE_ONE_USER = gql`
  mutation RemoveOneUserById($id: ID!) {
    user: removeOneUserById(id: $id) {
      ${USER_FIELDS}
    }
  }
`;
