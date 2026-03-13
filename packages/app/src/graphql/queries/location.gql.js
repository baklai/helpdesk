import { gql } from '@apollo/client/core';

// --- LOCATION ---

export const FIND_ALL_LOCATIONS = gql`
  query FindAllLocations {
    locations: findAllLocations {
      id
      name
      region
    }
  }
`;

export const FIND_ONE_LOCATION = gql`
  query FindOneLocationById($id: ID!) {
    location: findOneLocationById(id: $id) {
      id
      name
      region
    }
  }
`;

export const CREATE_ONE_LOCATION = gql`
  mutation CreateOneLocation($input: CreateLocationInput!) {
    location: createOneLocation(input: $input) {
      id
      name
      region
    }
  }
`;

export const UPDATE_ONE_LOCATION = gql`
  mutation UpdateOneLocationById($id: ID!, $input: UpdateLocationInput!) {
    location: updateOneLocationById(id: $id, input: $input) {
      id
      name
      region
    }
  }
`;

export const REMOVE_ONE_LOCATION = gql`
  mutation RemoveOneLocationById($id: ID!) {
    location: removeOneLocationById(id: $id) {
      id
      name
      region
    }
  }
`;
