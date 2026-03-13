import { gql } from '@apollo/client/core';

export const ME = gql`
  query Me {
    me {
      id
      fullname
      email
      phone
      status
      role
      scope
      createdAt
      updatedAt
    }
  }
`;

export const SIGN_IN = gql`
  mutation Signin($input: SigninAuthInput!) {
    signin(input: $input)
  }
`;

export const SIGN_UP = gql`
  mutation Signup($input: SignupAuthInput!) {
    signup(input: $input) {
      id
      fullname
      email
      phone
      status
      role
      scope
      createdAt
      updatedAt
    }
  }
`;

export const SIGN_OUT = gql`
  mutation Signout {
    signout
  }
`;

export const REFRESH = gql`
  mutation Refresh {
    refresh
  }
`;
