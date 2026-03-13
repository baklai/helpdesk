import { gql } from '@apollo/client/core';

// --- POSITION ---

export const FIND_ALL_POSITIONS = gql`
  query FindAllPositions {
    positions: findAllPositions {
      id
      name
      createdAt
      updatedAt
    }
  }
`;

export const FIND_ONE_POSITION = gql`
  query FindOnePositionById($id: ID!) {
    position: findOnePositionById(id: $id) {
      id
      name
      createdAt
      updatedAt
    }
  }
`;

export const CREATE_ONE_POSITION = gql`
  mutation CreateOnePosition($input: CreatePositionInput!) {
    position: createOnePosition(input: $input) {
      id
      name
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_ONE_POSITION = gql`
  mutation UpdateOnePositionById($id: ID!, $input: UpdatePositionInput!) {
    position: updateOnePositionById(id: $id, input: $input) {
      id
      name
      createdAt
      updatedAt
    }
  }
`;

export const REMOVE_ONE_POSITION = gql`
  mutation RemoveOnePositionById($id: ID!) {
    position: removeOnePositionById(id: $id) {
      id
      name
      createdAt
      updatedAt
    }
  }
`;
