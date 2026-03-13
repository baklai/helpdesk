import { gql } from '@apollo/client/core';

const MAILBOX_FIELDS = `
  id
  reqnum
  email
  fullname
  phone
  status
  comment
  organization { id name address description }
  subdivision { id code name address description organization }
  department { id name description }
  position { id name }
  createdAt
  updatedAt
`;

export const FIND_ALL_MAILBOXES = gql`
  query FindAllMailboxes($limit: Int = 5, $offset: Int = 0, $sort: JSON, $filters: JSON) {
    mailboxes: findAllMailboxes(limit: $limit, offset: $offset, sort: $sort, filters: $filters) {
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
        ${MAILBOX_FIELDS}
      }
    }
  }
`;

export const FIND_ONE_MAILBOX = gql`
  query FindOneMailboxById($id: ID!) {
    mailbox: findOneMailboxById(id: $id) {
      ${MAILBOX_FIELDS}
    }
  }
`;

export const CREATE_ONE_MAILBOX = gql`
  mutation CreateOneMailbox($input: CreateMailboxInput!) {
    mailbox: createOneMailbox(input: $input) {
      ${MAILBOX_FIELDS}
    }
  }
`;

export const UPDATE_ONE_MAILBOX = gql`
  mutation UpdateOneMailboxById($id: ID!, $input: UpdateMailboxInput!) {
    mailbox: updateOneMailboxById(id: $id, input: $input) {
      ${MAILBOX_FIELDS}
    }
  }
`;

export const REMOVE_ONE_MAILBOX = gql`
  mutation RemoveOneMailboxById($id: ID!) {
    mailbox: removeOneMailboxById(id: $id) {
      ${MAILBOX_FIELDS}
    }
  }
`;
