import { gql } from '@apollo/client/core';

// --- SUBDIVISION ---

export const FIND_ALL_SUBDIVISIONS = gql`
  query FindAllSubdivisions {
    subdivisions: findAllSubdivisions {
      id
      code
      name
      address
      description
      organization {
        id
        name
      }
      createdAt
      updatedAt
    }
  }
`;

export const FIND_ONE_SUBDIVISION = gql`
  query FindOneSubdivisionById($id: ID!) {
    subdivision: findOneSubdivisionById(id: $id) {
      id
      code
      name
      address
      description
      organization
      createdAt
      updatedAt
    }
  }
`;

export const CREATE_ONE_SUBDIVISION = gql`
  mutation CreateOneSubdivision($input: CreateSubdivisionInput!) {
    subdivision: createOneSubdivision(input: $input) {
      id
      code
      name
      address
      description
      organization
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_ONE_SUBDIVISION = gql`
  mutation UpdateOneSubdivisionById($id: ID!, $input: UpdateSubdivisionInput!) {
    subdivision: updateOneSubdivisionById(id: $id, input: $input) {
      id
      code
      name
      address
      description
      organization
      createdAt
      updatedAt
    }
  }
`;

export const REMOVE_ONE_SUBDIVISION = gql`
  mutation RemoveOneSubdivisionById($id: ID!) {
    subdivision: removeOneSubdivisionById(id: $id) {
      id
      code
      name
      address
      description
      organization
      createdAt
      updatedAt
    }
  }
`;
