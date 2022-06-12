import { moduleActionContext } from "..";
import { RootState } from "../typings";
import { ActionContext } from "vuex";
import { BnetOAuthRegion, OauthState, TwitchToken } from "@/store/oauth/types";

const mod = {
  namespaced: true,
  state: {
    code: "",
    blizzardVerifiedBtag: "",
    token: "",
    twitch_token: {} as TwitchToken,
    isAdmin: false,
    isSuperAdmin: false,
    permissions: [] as string[],
  } as OauthState,
  actions: {
    async authorizeWithCode(context: ActionContext<OauthState, RootState>, code: string): Promise<void> {
      const { commit, rootGetters } = moduleActionContext(context, mod);

      const region = await rootGetters.oauthService.loadAuthRegionCookie();
      const bearer = await rootGetters.oauthService.authorize(code, region);

      commit.SET_BEARER(bearer.jwt);

      const profile = await rootGetters.oauthService.getProfile(bearer.jwt);

      if (profile) {
        commit.SET_PROFILE_NAME(profile.battleTag);
        commit.SET_IS_ADMIN(profile.isAdmin);
        commit.SET_IS_SUPERADMIN(profile.isSuperAdmin);
        commit.SET_PERMISSIONS(profile.permissions);
        await rootGetters.oauthService.saveAuthToken(bearer);
      }

      rootGetters.oauthService.deleteAuthCookie();
    },

    async authorizeWithTwitch(context: ActionContext<OauthState, RootState>): Promise<void> {
      const { commit, rootGetters } = moduleActionContext(context, mod);

      const token = await rootGetters.oauthService.authorizeWithTwitch();
      commit.SET_TWITCH_TOKEN(token);
    },

    async loadAuthCodeToState(context: ActionContext<OauthState, RootState>) {
      const { commit, rootGetters } = moduleActionContext(context, mod);

      const bearer = await rootGetters.oauthService.loadAuthCookie();
      commit.SET_BEARER(bearer);
    },

    async loadBlizzardBtag(context: ActionContext<OauthState, RootState>, bearerToken: string): Promise<void> {
      const { commit, rootGetters } = moduleActionContext(context, mod);

      const profile = await rootGetters.oauthService.getProfile(bearerToken);

      if (profile) {
        commit.SET_PROFILE_NAME(profile.battleTag);
        commit.SET_IS_ADMIN(profile.isAdmin);
        commit.SET_IS_SUPERADMIN(profile.isSuperAdmin);
        commit.SET_PERMISSIONS(profile.permissions);
        await rootGetters.oauthService.saveAuthToken(profile);
      } else {
        rootGetters.oauthService.deleteAuthCookie();
        commit.SET_PROFILE_NAME("");
        commit.SET_IS_ADMIN(false);
        commit.SET_IS_SUPERADMIN(false);
        commit.SET_PERMISSIONS([] as string[]);
        commit.SET_BEARER("");
      }
    },

    async saveLoginRegion(context: ActionContext<OauthState, RootState>, region: BnetOAuthRegion): Promise<void> {
      const { rootGetters } = moduleActionContext(context, mod);
      await rootGetters.oauthService.saveAuthRegion(region);
    },

    logout(context: ActionContext<OauthState, RootState>): void {
      const { commit, rootGetters } = moduleActionContext(context, mod);

      rootGetters.oauthService.deleteAuthCookie();
      commit.SET_PROFILE_NAME("");
      commit.SET_IS_ADMIN(false);
      commit.SET_IS_SUPERADMIN(false);
      commit.SET_PERMISSIONS([] as string[]);
      commit.SET_BEARER("");
    },
  },

  mutations: {
    SET_BEARER(state: OauthState, token: string) {
      state.token = token;
    },
    SET_TWITCH_TOKEN(state: OauthState, token: TwitchToken) {
      state.twitch_token = token;
    },
    SET_PROFILE_NAME(state: OauthState, btag: string) {
      state.blizzardVerifiedBtag = btag;
    },
    SET_IS_ADMIN(state: OauthState, isAdmin: boolean) {
      state.isAdmin = isAdmin;
    },
    SET_IS_SUPERADMIN(state: OauthState, isSuperAdmin: boolean) {
      state.isSuperAdmin = isSuperAdmin;
    },
    SET_PERMISSIONS(state: OauthState, permissions: string[]) {
      state.permissions = permissions;
    },
  },
} as const;

export default mod;
