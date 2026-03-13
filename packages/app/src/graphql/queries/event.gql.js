import { gql } from '@apollo/client/core';

export const FIND_ALL_EVENTS = gql`
  query FindAllEvents($startDateTime: DateTime!, $endDateTime: DateTime!) {
    events: findAllEvents(startDateTime: $startDateTime, endDateTime: $endDateTime) {
      id
      title
      description
      startDateTime
      endDateTime
      location
      eventType
      participants
      expiresAt
      createdAt
      updatedAt
    }
  }
`;

export const FIND_ONE_EVENT = gql`
  query FindOneEventById($id: ID!) {
    event: findOneEventById(id: $id) {
      id
      title
      description
      startDateTime
      endDateTime
      location
      eventType
      participants
      expiresAt
      createdAt
      updatedAt
    }
  }
`;

export const CREATE_ONE_EVENT = gql`
  mutation CreateOneEvent($input: CreateEventInput!) {
    event: createOneEvent(input: $input) {
      id
      title
      description
      startDateTime
      endDateTime
      location
      eventType
      participants
      expiresAt
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_ONE_EVENT = gql`
  mutation UpdateOneEventById($id: ID!, $input: UpdateEventInput!) {
    event: updateOneEventById(id: $id, input: $input) {
      id
      title
      description
      startDateTime
      endDateTime
      location
      eventType
      participants
      expiresAt
      createdAt
      updatedAt
    }
  }
`;

export const REMOVE_ONE_EVENT = gql`
  mutation RemoveOneEventById($id: ID!) {
    event: removeOneEventById(id: $id) {
      id
      title
      description
      startDateTime
      endDateTime
      location
      eventType
      participants
      expiresAt
      createdAt
      updatedAt
    }
  }
`;
