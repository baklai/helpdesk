import { gql } from '@apollo/client/core';

const CHANNEL_FIELDS = `
  id
  locationFrom
  deviceFrom
  locationTo
  deviceTo
  level
  channelType
  speed
  status
  operator
  composition
  createdAt
  updatedAt
`;

export const FIND_ALL_CHANNELS = gql`
  query FindAllChannels($limit: Int = 5, $offset: Int = 0, $sort: JSON, $filters: JSON) {
    channels: findAllChannels(limit: $limit, offset: $offset, sort: $sort, filters: $filters) {
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
        ${CHANNEL_FIELDS}
      }
    }
  }
`;

export const FIND_ONE_CHANNEL = gql`
  query FindOneChannelById($id: ID!) {
    channel: findOneChannelById(id: $id) {
      ${CHANNEL_FIELDS}
    }
  }
`;

export const CREATE_ONE_CHANNEL = gql`
  mutation CreateOneChannel($input: CreateChannelInput!) {
    channel: createOneChannel(input: $input) {
      ${CHANNEL_FIELDS}
    }
  }
`;

export const UPDATE_ONE_CHANNEL = gql`
  mutation UpdateOneChannelById($id: ID!, $input: UpdateChannelInput!) {
    channel: updateOneChannelById(id: $id, input: $input) {
      ${CHANNEL_FIELDS}
    }
  }
`;

export const REMOVE_ONE_CHANNEL = gql`
  mutation RemoveOneChannelById($id: ID!) {
    channel: removeOneChannelById(id: $id) {
      ${CHANNEL_FIELDS}
    }
  }
`;
