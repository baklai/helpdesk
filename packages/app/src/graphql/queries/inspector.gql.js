import { gql } from '@apollo/client/core';

const INSPECTOR_FIELDS = `
  id
  ipaddress
  baseboard
  bios
  os
  cpu
  diskdrive
  memorychip
  netadapter
  printer
  product
  share
  useraccount
  usergroup
  useradmin
  isIpaddress
  baseboardName
  cpuName
  system
  hddSize
  ramSize
  fixupdate
  countUseraccount
  countProduct
  countShare
  expiresAt
  createdAt
  updatedAt
`;

export const FIND_ALL_INSPECTORS = gql`
  query FindAllInspectors($limit: Int = 5, $offset: Int = 0, $sort: JSON, $filters: JSON) {
    inspectors: findAllInspectors(limit: $limit, offset: $offset, sort: $sort, filters: $filters) {
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
        ${INSPECTOR_FIELDS}
      }
    }
  }
`;

export const FIND_ONE_INSPECTOR = gql`
  query FindOneInspectorById($id: ID!) {
    inspector: findOneInspectorById(id: $id) {
      ${INSPECTOR_FIELDS}
    }
  }
`;

export const CREATE_ONE_INSPECTOR = gql`
  mutation CreateOneInspector($input: CreateInspectorInput!) {
    createOneInspector(input: $input)
  }
`;

export const REMOVE_ONE_INSPECTOR = gql`
  mutation RemoveOneInspectorById($id: ID!) {
    inspector: removeOneInspectorById(id: $id) {
      ${INSPECTOR_FIELDS}
    }
  }
`;
