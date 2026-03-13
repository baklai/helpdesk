import { gql } from '@apollo/client/core';

const REQUEST_FIELDS = `
  id
  fullname
  phone
  ipaddress
  reqnum
  request
  comment
  conclusion
  status
  opened { id fullname }
  closed { id fullname }
  position { id name }
  location { id name region }
  organization { id name address description }
  subdivision { id code name address description organization }
  department { id name description }
  createdAt
  updatedAt
`;

export const FIND_ALL_REQUESTS = gql`
  query FindAllRequests($limit: Int = 5, $offset: Int = 0, $sort: JSON, $filters: JSON) {
    requests: findAllRequests(limit: $limit, offset: $offset, sort: $sort, filters: $filters) {
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
        ${REQUEST_FIELDS}
      }
    }
  }
`;

export const FIND_ONE_REQUEST = gql`
  query FindOneRequestById($id: ID!) {
    request: findOneRequestById(id: $id) {
      ${REQUEST_FIELDS}
    }
  }
`;

export const CREATE_ONE_REQUEST = gql`
  mutation CreateOneRequest($input: CreateRequestInput!) {
    request: createOneRequest(input: $input) {
      ${REQUEST_FIELDS}
    }
  }
`;

export const UPDATE_ONE_REQUEST = gql`
  mutation UpdateOneRequestById($id: ID!, $input: UpdateRequestInput!) {
    request: updateOneRequestById(id: $id, input: $input) {
      ${REQUEST_FIELDS}
    }
  }
`;

export const REMOVE_ONE_REQUEST = gql`
  mutation RemoveOneRequestById($id: ID!) {
    request: removeOneRequestById(id: $id) {
      id
      status
      createdAt
      updatedAt
    }
  }
`;
