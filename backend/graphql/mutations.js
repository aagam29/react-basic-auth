import { gql } from 'graphql-request';

export const CreateNextUserMutation = gql`
    mutation CreateNextUser($userData: NextUserCreateInput!) {
      createNextUser(data: $userData) {
      id
      email
    }
  }
`;

export const GetUserByEmailQuery = gql`
    query getUserByEmailQuery($email: String!) {
      nextUser(where: { email: $email }, stage: DRAFT) {
      id
      email
      firstname
      lastname
      password
    }
  }
`;