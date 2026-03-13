import { gql } from '@apollo/client/core';

export const FIND_ALL_SYSCONFS = gql`
  query FindAllSysConfs {
    sysconfs: findAllSysConfs {
      id
      key
      value
    }
  }
`;

export const UPSERT_ONE_SYSCONF = gql`
  mutation UpsertOneSysConf($input: UpsertSysConfInput!) {
    sysconf: upsertOneSysConf(input: $input) {
      id
      key
      value
    }
  }
`;

// --- STATISTICS ---

export const GET_STATISTIC_NETWORK = gql`
  query GetNetworkStatistic {
    network: getNetworkStatistic
  }
`;

export const GET_STATISTIC_MAILBOX = gql`
  query GetMailboxStatistic {
    mailbox: getMailboxStatistic
  }
`;

export const GET_STATISTIC_REQUEST = gql`
  query GetRequestStatistic {
    request: getRequestStatistic
  }
`;

export const GET_STATISTIC_INSPECTOR = gql`
  query GetInspectorStatistic {
    inspector: getInspectorStatistic
  }
`;

export const GET_DASHBOARD_STATISTIC = gql`
  query GetDashboardStatistic {
    dashboard: getDashboardStatistic
  }
`;

// --- TOOLS ---

export const GET_LINK_PING = gql`
  query GetLinkPing($host: String!) {
    getLinkPing(host: $host)
  }
`;

export const GET_LINK_RDP = gql`
  query GetLinkRDP($host: String!) {
    getLinkRDP(host: $host)
  }
`;

export const GET_LINK_VNC = gql`
  query GetLinkVNC($host: String!) {
    getLinkVNC(host: $host)
  }
`;

// --- SYSTEM LOGS ---

export const FIND_ALL_SYSLOGS = gql`
  query FindAllSysLogs($limit: Int = 5, $offset: Int = 0, $sort: JSON, $filters: JSON) {
    syslogs: findAllSysLogs(limit: $limit, offset: $offset, sort: $sort, filters: $filters) {
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
        id
        ipaddress
        user {
          id
          fullname
        }
        method
        methodName
        status
        userAgent
        error
        expiresAt
        createdAt
        updatedAt
      }
    }
  }
`;

export const FIND_ONE_SYSLOG = gql`
  query FindOneSysLogById($id: ID!) {
    syslog: findOneSysLogById(id: $id) {
      id
      ipaddress
      user {
        id
        fullname
      }
      method
      methodName
      status
      userAgent
      error
      expiresAt
      createdAt
      updatedAt
    }
  }
`;

export const REMOVE_ONE_SYSLOG = gql`
  mutation RemoveOneSysLogById($id: ID!) {
    syslog: removeOneSysLogById(id: $id) {
      id
    }
  }
`;

export const REMOVE_ALL_SYSLOGS = gql`
  mutation RemoveAllSysLogs {
    removeAllSysLogs
  }
`;

// --- INSPECTOR REPORT (комбинированный запрос) ---

export const FIND_INSPECTOR_REPORT = gql`
  query FindOneInspectorReportById($id: ID!, $ip: String!) {
    inspector: findOneInspectorById(id: $id) {
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
    }
    ipaddress: findOneIpaddressByIP(ip: $ip) {
      id
      ipaddress
      mask
      gateway
      indexip
      cidr {
        value
        mask
      }
      reqnum
      fullname
      phone
      autoanswer
      internet {
        reqnum
        status
        comment
        createdAt
        updatedAt
      }
      comment
      device {
        id
        name
        description
      }
      location {
        id
        name
        region
      }
      organization {
        id
        name
        address
        description
      }
      subdivision {
        id
        code
        name
        address
        description
        organization
      }
      department {
        id
        name
        description
      }
      position {
        id
        name
      }
      createdAt
      updatedAt
    }
  }
`;
