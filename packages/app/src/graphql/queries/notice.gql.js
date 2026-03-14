import { gql } from '@apollo/client/core';

export const FIND_ALL_NOTICES = gql`
  query FindAllNotices {
    notices: findAllNotices {
      id
      title
      message
      status
      user
      expiresAt
      createdAt
      updatedAt
    }
  }
`;

export const CREATE_ONE_NOTICE = gql`
  mutation CreateOneNotice($input: CreateNoticeInput!) {
    status: createOneNotice(input: $input)
  }
`;

export const REMOVE_ONE_NOTICE = gql`
  mutation RemoveOneNoticeById($id: String!) {
    notice: removeOneNoticeById(id: $id) {
      id
      title
      message
      status
      user
      expiresAt
      createdAt
      updatedAt
    }
  }
`;
