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
  },

  mutations: {
    SET_ALL_PERMISSIONS(state: AdminRolesAndPermissionsState, permissions: Permission[]) {
      state.allPermissions = permissions;
    },
  },
} as const;

export default mod;
