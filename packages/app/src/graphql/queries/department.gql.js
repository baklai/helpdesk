import { gql } from '@apollo/client/core';

// --- DEPARTMENT ---

export const FIND_ALL_DEPARTMENTS = gql`
  query FindAllDepartments {
    departments: findAllDepartments {
      id
      name
      description
      createdAt
      updatedAt
    }
  }
`;

export const FIND_ONE_DEPARTMENT = gql`
  query FindOneDepartmentById($id: ID!) {
    department: findOneDepartmentById(id: $id) {
      id
      name
      description
      createdAt
      updatedAt
    }
  }
`;

export const CREATE_ONE_DEPARTMENT = gql`
  mutation CreateOneDepartment($input: CreateDepartmentInput!) {
    department: createOneDepartment(input: $input) {
      id
      name
      description
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_ONE_DEPARTMENT = gql`
  mutation UpdateOneDepartmentById($id: ID!, $input: UpdateDepartmentInput!) {
    department: updateOneDepartmentById(id: $id, input: $input) {
      id
      name
      description
      createdAt
      updatedAt
    }
  }
`;

export const REMOVE_ONE_DEPARTMENT = gql`
  mutation RemoveOneDepartmentById($id: ID!) {
    department: removeOneDepartmentById(id: $id) {
      id
      name
      description
      createdAt
      updatedAt
    }
  }
`;
