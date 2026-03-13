import { gql } from '@apollo/client/core';

// Базовые поля IP-адреса (для списка — без email, inventory)
const IPADDRESS_BASE_FIELDS = `
  id
  ipaddress
  mask
  gateway
  indexip
  cidr { value mask }
  reqnum
  fullname
  phone
  autoanswer
  internet { reqnum status comment createdAt updatedAt }
  comment
  device { id name description }
  location { id name region }
  organization { id name address description }
  subdivision { id code name address description organization }
  department { id name description }
  position { id name }
  createdAt
  updatedAt
`;

// Полные поля (деталь записи) — включая email, inventory
const IPADDRESS_FULL_FIELDS = `
  ${IPADDRESS_BASE_FIELDS}
  email
  inventory
`;

export const FIND_ALL_IPADDRESSES = gql`
  query FindAllIpaddresses($limit: Int = 5, $offset: Int = 0, $sort: JSON, $filters: JSON) {
    ipaddresses: findAllIpaddresses(
      limit: $limit
      offset: $offset
      sort: $sort
      filters: $filters
    ) {
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
        ${IPADDRESS_BASE_FIELDS}
      }
    }
  }
`;

export const FIND_ONE_IPADDRESS = gql`
  query FindOneIpaddressById($id: ID!) {
    ipaddress: findOneIpaddressById(id: $id) {
      ${IPADDRESS_FULL_FIELDS}
    }
  }
`;

export const FIND_ONE_IPADDRESS_BY_IP = gql`
  query FindOneIpaddressByIP($ip: String!) {
    ipaddress: findOneIpaddressByIP(ip: $ip) {
      ${IPADDRESS_BASE_FIELDS}
    }
  }
`;

export const CREATE_ONE_IPADDRESS = gql`
  mutation CreateOneIpaddress($input: CreateIpaddressInput!) {
    ipaddress: createOneIpaddress(input: $input) {
      ${IPADDRESS_BASE_FIELDS}
    }
  }
`;

export const UPDATE_ONE_IPADDRESS = gql`
  mutation UpdateOneIpaddressById($id: ID!, $input: UpdateIpaddressInput!) {
    ipaddress: updateOneIpaddressById(id: $id, input: $input) {
      ${IPADDRESS_BASE_FIELDS}
    }
  }
`;

export const REMOVE_ONE_IPADDRESS = gql`
  mutation RemoveOneIpaddressById($id: ID!) {
    ipaddress: removeOneIpaddressById(id: $id) {
      id
      ipaddress
      createdAt
      updatedAt
    }
  }
`;
