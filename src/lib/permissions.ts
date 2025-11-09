export type Permission = string;
export type Role = string;

export type PermissionSet = Set<Permission>;
export type RoleSet = Set<Role>;

export interface UserPermissions {
  roles: RoleSet;
  permissions: PermissionSet;
}

export class PermissionManager {
  private rolePermissions: Map<Role, PermissionSet> = new Map();
  private userPermissions: Map<string, UserPermissions> = new Map();

  defineRole(role: Role, permissions: Permission[]): void {
    this.rolePermissions.set(role, new Set(permissions));
  }

  assignRole(userId: string, role: Role): void {
    const userPerms = this.userPermissions.get(userId) || {
      roles: new Set(),
      permissions: new Set(),
    };

    userPerms.roles.add(role);

    const rolePerms = this.rolePermissions.get(role);
    if (rolePerms) {
      rolePerms.forEach((perm) => userPerms.permissions.add(perm));
    }

    this.userPermissions.set(userId, userPerms);
  }

  revokeRole(userId: string, role: Role): void {
    const userPerms = this.userPermissions.get(userId);
    if (!userPerms) return;

    userPerms.roles.delete(role);

    const rolePerms = this.rolePermissions.get(role);
    if (rolePerms) {
      rolePerms.forEach((perm) => userPerms.permissions.delete(perm));
    }
  }

  grantPermission(userId: string, permission: Permission): void {
    const userPerms = this.userPermissions.get(userId) || {
      roles: new Set(),
      permissions: new Set(),
    };

    userPerms.permissions.add(permission);
    this.userPermissions.set(userId, userPerms);
  }

  revokePermission(userId: string, permission: Permission): void {
    const userPerms = this.userPermissions.get(userId);
    if (!userPerms) return;

    userPerms.permissions.delete(permission);
  }

  hasPermission(userId: string, permission: Permission): boolean {
    const userPerms = this.userPermissions.get(userId);
    if (!userPerms) return false;

    return userPerms.permissions.has(permission);
  }

  hasAnyPermission(userId: string, permissions: Permission[]): boolean {
    return permissions.some((perm) => this.hasPermission(userId, perm));
  }

  hasAllPermissions(userId: string, permissions: Permission[]): boolean {
    return permissions.every((perm) => this.hasPermission(userId, perm));
  }

  hasRole(userId: string, role: Role): boolean {
    const userPerms = this.userPermissions.get(userId);
    if (!userPerms) return false;

    return userPerms.roles.has(role);
  }

  hasAnyRole(userId: string, roles: Role[]): boolean {
    return roles.some((role) => this.hasRole(userId, role));
  }

  getPermissions(userId: string): PermissionSet {
    const userPerms = this.userPermissions.get(userId);
    return userPerms?.permissions || new Set();
  }

  getRoles(userId: string): RoleSet {
    const userPerms = this.userPermissions.get(userId);
    return userPerms?.roles || new Set();
  }

  clearUser(userId: string): void {
    this.userPermissions.delete(userId);
  }

  clearAll(): void {
    this.userPermissions.clear();
    this.rolePermissions.clear();
  }
}

export const permissionManager = new PermissionManager();

export const PERMISSIONS = {
  PLANTATION_VIEW: "plantation:view",
  PLANTATION_CREATE: "plantation:create",
  PLANTATION_UPDATE: "plantation:update",
  PLANTATION_DELETE: "plantation:delete",
  TASK_VIEW: "task:view",
  TASK_CREATE: "task:create",
  TASK_UPDATE: "task:update",
  TASK_DELETE: "task:delete",
  ANALYTICS_VIEW: "analytics:view",
  COLLABORATION_INVITE: "collaboration:invite",
  COLLABORATION_REMOVE: "collaboration:remove",
  ADMIN: "admin",
} as const;

export const ROLES = {
  OWNER: "owner",
  ADMIN: "admin",
  MANAGER: "manager",
  VIEWER: "viewer",
  COLLABORATOR: "collaborator",
} as const;

permissionManager.defineRole(ROLES.OWNER, [
  PERMISSIONS.PLANTATION_VIEW,
  PERMISSIONS.PLANTATION_CREATE,
  PERMISSIONS.PLANTATION_UPDATE,
  PERMISSIONS.PLANTATION_DELETE,
  PERMISSIONS.TASK_VIEW,
  PERMISSIONS.TASK_CREATE,
  PERMISSIONS.TASK_UPDATE,
  PERMISSIONS.TASK_DELETE,
  PERMISSIONS.ANALYTICS_VIEW,
  PERMISSIONS.COLLABORATION_INVITE,
  PERMISSIONS.COLLABORATION_REMOVE,
  PERMISSIONS.ADMIN,
]);

permissionManager.defineRole(ROLES.ADMIN, [
  PERMISSIONS.PLANTATION_VIEW,
  PERMISSIONS.PLANTATION_CREATE,
  PERMISSIONS.PLANTATION_UPDATE,
  PERMISSIONS.PLANTATION_DELETE,
  PERMISSIONS.TASK_VIEW,
  PERMISSIONS.TASK_CREATE,
  PERMISSIONS.TASK_UPDATE,
  PERMISSIONS.TASK_DELETE,
  PERMISSIONS.ANALYTICS_VIEW,
  PERMISSIONS.COLLABORATION_INVITE,
  PERMISSIONS.COLLABORATION_REMOVE,
]);

permissionManager.defineRole(ROLES.MANAGER, [
  PERMISSIONS.PLANTATION_VIEW,
  PERMISSIONS.PLANTATION_UPDATE,
  PERMISSIONS.TASK_VIEW,
  PERMISSIONS.TASK_CREATE,
  PERMISSIONS.TASK_UPDATE,
  PERMISSIONS.ANALYTICS_VIEW,
]);

permissionManager.defineRole(ROLES.VIEWER, [
  PERMISSIONS.PLANTATION_VIEW,
  PERMISSIONS.TASK_VIEW,
  PERMISSIONS.ANALYTICS_VIEW,
]);

permissionManager.defineRole(ROLES.COLLABORATOR, [
  PERMISSIONS.PLANTATION_VIEW,
  PERMISSIONS.TASK_VIEW,
  PERMISSIONS.TASK_CREATE,
  PERMISSIONS.TASK_UPDATE,
]);

