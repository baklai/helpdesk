import { gql } from '@apollo/client/core';

export const FIND_ALL_REPORTS = gql`
  query FindAllReports {
    reports: findAllReports {
      id
      creator {
        id
        fullname
      }
      name
      description
      datacollection
      createdAt
      updatedAt
    }
  }
`;

export const FIND_ONE_REPORT = gql`
  query FindOneReportById($id: ID!) {
    report: findOneReportById(id: $id) {
      id
      creator {
        id
        fullname
      }
      name
      description
      datacollection
      fields
      sorts
      filters
      createdAt
      updatedAt
    }
  }
`;

export const CREATE_ONE_REPORT = gql`
  mutation CreateOneReport($input: CreateReportInput!) {
    report: createOneReport(input: $input) {
      id
      creator {
        id
        fullname
      }
      name
      description
      datacollection
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_ONE_REPORT = gql`
  mutation UpdateOneReportById($id: ID!, $input: UpdateReportInput!) {
    report: updateOneReportById(id: $id, input: $input) {
      id
      creator {
        id
        fullname
      }
      name
      description
      datacollection
      createdAt
      updatedAt
    }
  }
`;

export const REMOVE_ONE_REPORT = gql`
  mutation RemoveOneReportById($id: ID!) {
    report: removeOneReportById(id: $id) {
      id
      name
    }
  }
`;

export const EXECUTE_ONE_REPORT = gql`
  query ExecuteReportById($id: ID!) {
    rows: executeReportById(id: $id)
  }
`;

export const GET_REPORT_COLLECTIONS = gql`
  query GetReportCollections {
    collections: getReportCollections {
      name
      label
      fields
    }
  }
`;
