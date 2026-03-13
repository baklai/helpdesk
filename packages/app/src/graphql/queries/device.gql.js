import { gql } from '@apollo/client/core';

// --- DEVICE ---

export const FIND_ALL_DEVICES = gql`
  query FindAllDevices {
    devices: findAllDevices {
      id
      name
      description
      createdAt
      updatedAt
    }
  }
`;

export const FIND_ONE_DEVICE = gql`
  query FindOneDeviceById($id: ID!) {
    device: findOneDeviceById(id: $id) {
      id
      name
      description
      createdAt
      updatedAt
    }
  }
`;

export const CREATE_ONE_DEVICE = gql`
  mutation CreateOneDevice($input: CreateDeviceInput!) {
    device: createOneDevice(input: $input) {
      id
      name
      description
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_ONE_DEVICE = gql`
  mutation UpdateOneDeviceById($id: ID!, $input: UpdateDeviceInput!) {
    device: updateOneDeviceById(id: $id, input: $input) {
      id
      name
      description
      createdAt
      updatedAt
    }
  }
`;

export const REMOVE_ONE_DEVICE = gql`
  mutation RemoveOneDeviceById($id: ID!) {
    device: removeOneDeviceById(id: $id) {
      id
      name
      description
      createdAt
      updatedAt
    }
  }
`;
