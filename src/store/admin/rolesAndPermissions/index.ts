import { moduleActionContext } from "../..";
import { RootState } from "../../typings";
import { ActionContext } from "vuex";
import { AdminRolesAndPermissionsState, Permission, Role, User } from "./types";
const mod = {
  namespaced: true,
  state: {
    allPermissions: [] as Permission[],
    allRoles: [] as Role[],
    allUsers: [] as User[],
  } as AdminRolesAndPermissionsState,

  actions: {
    async loadAllPermissions(context: ActionContext<AdminRolesAndPermissionsState, RootState>) {
      const { commit, rootGetters } = moduleActionContext(context, mod);

      const allPermissions = await rootGetters.permissionService.getAllPermissions();
      commit.SET_ALL_PERMISSIONS(allPermissions);
    },

    async loadAllRoles(context: ActionContext<AdminRolesAndPermissionsState, RootState>) {
      const { commit, rootGetters } = moduleActionContext(context, mod);

      const allRoles = await rootGetters.roleService.getAllRoles();
      commit.SET_ALL_ROLES(allRoles);
    },

    async loadAllUsers(context: ActionContext<AdminRolesAndPermissionsState, RootState>, token: string) {
      const { commit, rootGetters } = moduleActionContext(context, mod);

      const allUsers = await rootGetters.userService.getAllUsers(token);
      commit.SET_ALL_USERS(allUsers);
    },
  },

  mutations: {
    SET_ALL_PERMISSIONS(state: AdminRolesAndPermissionsState, permissions: Permission[]) {
      state.allPermissions = permissions;
    },
    SET_ALL_ROLES(state: AdminRolesAndPermissionsState, roles: Role[]) {
      state.allRoles = roles;
    },
    SET_ALL_USERS(state: AdminRolesAndPermissionsState, users: User[]) {
      state.allUsers = users;
    },
  },
} as const;

export default mod;
