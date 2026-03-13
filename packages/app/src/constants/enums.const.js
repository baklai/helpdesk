export const USER_ROLE = Object.freeze(
  Object.fromEntries(['ADMIN', 'MANAGER', 'SUPPORT', 'CLIENT'].map(k => [k, k]))
);

export const USER_STATUS = Object.freeze(
  Object.fromEntries(['PENDING', 'ACTIVE', 'BLOCKED', 'DISABLED'].map(k => [k, k]))
);

export const USER_SCOPE = Object.freeze({
  // --- Events ---
  EVENT_CREATE: 'event:create',
  EVENT_READ: 'event:read',
  EVENT_UPDATE: 'event:update',
  EVENT_DELETE: 'event:delete',
  EVENT_NOTICE: 'event:notice',

  // --- IP Addresses ---
  IPADDRESS_CREATE: 'ipaddress:create',
  IPADDRESS_READ: 'ipaddress:read',
  IPADDRESS_UPDATE: 'ipaddress:update',
  IPADDRESS_DELETE: 'ipaddress:delete',
  IPADDRESS_NOTICE: 'ipaddress:notice',

  // --- Mailboxes ---
  MAILBOX_CREATE: 'mailbox:create',
  MAILBOX_READ: 'mailbox:read',
  MAILBOX_UPDATE: 'mailbox:update',
  MAILBOX_DELETE: 'mailbox:delete',
  MAILBOX_NOTICE: 'mailbox:notice',

  // --- Requests ---
  REQUEST_CREATE: 'request:create',
  REQUEST_READ: 'request:read',
  REQUEST_UPDATE: 'request:update',
  REQUEST_DELETE: 'request:delete',
  REQUEST_NOTICE: 'request:notice',

  // --- Reports ---
  REPORT_CREATE: 'report:create',
  REPORT_READ: 'report:read',
  REPORT_UPDATE: 'report:update',
  REPORT_DELETE: 'report:delete',
  REPORT_NOTICE: 'report:notice',

  // --- Organization ---
  ORGANIZATION_CREATE: 'organization:create',
  ORGANIZATION_READ: 'organization:read',
  ORGANIZATION_UPDATE: 'organization:update',
  ORGANIZATION_DELETE: 'organization:delete',
  ORGANIZATION_NOTICE: 'organization:notice',

  // --- Subdivision ---
  SUBDIVISION_CREATE: 'subdivision:create',
  SUBDIVISION_READ: 'subdivision:read',
  SUBDIVISION_UPDATE: 'subdivision:update',
  SUBDIVISION_DELETE: 'subdivision:delete',
  SUBDIVISION_NOTICE: 'subdivision:notice',

  // --- Department ---
  DEPARTMENT_CREATE: 'department:create',
  DEPARTMENT_READ: 'department:read',
  DEPARTMENT_UPDATE: 'department:update',
  DEPARTMENT_DELETE: 'department:delete',
  DEPARTMENT_NOTICE: 'department:notice',

  // --- Location ---
  LOCATION_CREATE: 'location:create',
  LOCATION_READ: 'location:read',
  LOCATION_UPDATE: 'location:update',
  LOCATION_DELETE: 'location:delete',
  LOCATION_NOTICE: 'location:notice',

  // --- Position ---
  POSITION_CREATE: 'position:create',
  POSITION_READ: 'position:read',
  POSITION_UPDATE: 'position:update',
  POSITION_DELETE: 'position:delete',
  POSITION_NOTICE: 'position:notice',

  // --- Devices ---
  DEVICE_CREATE: 'device:create',
  DEVICE_READ: 'device:read',
  DEVICE_UPDATE: 'device:update',
  DEVICE_DELETE: 'device:delete',
  DEVICE_NOTICE: 'device:notice',

  // --- Users ---
  USER_CREATE: 'user:create',
  USER_READ: 'user:read',
  USER_UPDATE: 'user:update',
  USER_DELETE: 'user:delete',

  // --- Settings ---
  SETTING_CREATE: 'setting:create',
  SETTING_READ: 'setting:read',
  SETTING_UPDATE: 'setting:update',
  SETTING_DELETE: 'setting:delete',

  // --- Notices ---
  NOTICE_CREATE: 'notice:create',
  NOTICE_READ: 'notice:read',
  NOTICE_DELETE: 'notice:delete',

  // --- System ---
  STATISTIC_READ: 'statistic:read',
  SYSTOOL_READ: 'systool:read'
});
