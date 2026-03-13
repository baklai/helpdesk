import { gql } from '@apollo/client/core';

// --- ORGANIZATION ---

export const FIND_ALL_ORGANIZATIONS = gql`
  query FindAllOrganizations {
    organizations: findAllOrganizations {
      id
      name
      address
      description
      createdAt
      updatedAt
    }
  }
`;

export const FIND_ONE_ORGANIZATION = gql`
  query FindOneOrganizationById($id: ID!) {
    organization: findOneOrganizationById(id: $id) {
      id
      name
      address
      description
      createdAt
      updatedAt
    }
  }
`;

export const CREATE_ONE_ORGANIZATION = gql`
  mutation CreateOneOrganization($input: CreateOrganizationInput!) {
    organization: createOneOrganization(input: $input) {
      id
      name
      address
      description
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_ONE_ORGANIZATION = gql`
  mutation UpdateOneOrganizationById($id: ID!, $input: UpdateOrganizationInput!) {
    organization: updateOneOrganizationById(id: $id, input: $input) {
      id
      name
      address
      description
      createdAt
      updatedAt
    }
  }
`;

export const REMOVE_ONE_ORGANIZATION = gql`
  mutation RemoveOneOrganizationById($id: ID!) {
    organization: removeOneOrganizationById(id: $id) {
      id
      name
      address
      description
      createdAt
      updatedAt
    }
  }
`;
