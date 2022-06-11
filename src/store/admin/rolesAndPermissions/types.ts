export type AdminRolesAndPermissionsState = {
  allPermissions: Permission[];
  allRoles: Role[];
  allUsers: User[];
};

export type Permission = {
  Id: string;
  Description: string;
};

export type Role = {
  Id: string;
  Description: string;
  Permissions: string[];
};

export type User = {
  Id: string;
  Roles: string[];
};
