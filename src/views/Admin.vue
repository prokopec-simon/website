<template>
  <v-container fluid v-show="isAdmin" style="height: 100%">
    <div class="admin-page-wrapper">
      <admin-navigation
        :items="navItemsAfterPermissions"
        v-on:itemSelected="navItemSelected"
      ></admin-navigation>
      <v-card tile>
        <v-card-title>
          {{ selectedNavItem.title }}
        </v-card-title>
        <component v-bind:is="selectedNavItem.component"></component>
      </v-card>
    </div>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import { NavigationItem } from "@/store/admin/types";

import AdminHome from "@/components/admin/AdminHome.vue";
import AdminNavigation from "@/components/admin/AdminNavigation.vue";
import AdminBannedPlayers from "@/components/admin/AdminBannedPlayers.vue";
import AdminLoadingScreenTips from "@/components/admin/AdminLoadingScreenTips.vue";
import AdminNewsForLauncher from "@/components/admin/AdminNewsForLauncher.vue";
import AdminQueueData from "@/components/admin/AdminQueueData.vue";
import AdminProxies from "@/components/admin/AdminProxies.vue";
import AdminAlts from "@/components/admin/AdminAlts.vue";
import AdminGlobalMute from "@/components/admin/AdminGlobalMute.vue";
import AdminAssignPortraits from "@/components/admin/AdminAssignPortraits.vue";
import AdminManagePortraits from "@/components/admin/AdminManagePortraits.vue";
import AdminMaps from "@/components/admin/AdminMaps.vue";

@Component({
  components: {
    AdminNavigation,
    AdminBannedPlayers,
    AdminLoadingScreenTips,
    AdminNewsForLauncher,
    AdminQueueData,
    AdminProxies,
    AdminAlts,
    AdminGlobalMute,
    AdminAssignPortraits,
    AdminManagePortraits,
    AdminMaps,
    AdminHome,
  },
})
export default class Admin extends Vue {
  navItemsAfterPermissions = [] as NavigationItem[];

  getNavItemsWithPermissions(): NavigationItem[] {
    let navItemsWithPermissions = this.navItems.filter(x => x.visible != false);
    navItemsWithPermissions.forEach(x => x.items = x.items?.filter(y => y.visible != false));
    return navItemsWithPermissions.filter(x => x.items != undefined && x.items.length > 0);
  }

  navItems: Array<NavigationItem> = [
    {
      title: "Home",
      icon: "mdi-home-outline",
      visible: true,
      component: "admin-home",
    },
    {
      title: "Moderation",
      icon: "mdi-account-group",
      visible: this.hasPermission("view-moderation-panel"),
      items: [
        {
          key: "banned_players",
          title: "Banned Players",
          icon: "mdi-account-remove",
          component: "admin-banned-players",
          visible: this.hasPermission("view-banned-players-panel"),
        },
        {
          key: "alts",
          title: "Smurf Checker",
          icon: "mdi-account-question",
          component: "admin-alts",
          visible: this.hasPermission("view-smurf-checker-panel"),
        },
        {
          key: "mute",
          title: "Global Mute",
          icon: "mdi-chat-remove",
          component: "admin-global-mute",
          visible: this.hasPermission("view-global-mute-panel"),
        },
      ],
    },
    {
      title: "Player Settings",
      icon: "mdi-cog",
      visible: this.hasPermission("view-player-settings-panel"),
      items: [
        {
          key: "proxy_settings",
          title: "Proxy Settings",
          icon: "mdi-account-network",
          component: "admin-proxies",
          visible: this.hasPermission("view-proxies-panel"),
        },
      ],
    },
    {
      title: "Launcher",
      icon: "mdi-rocket",
      visible: this.hasPermission("view-launcher-panel"),
      items: [
        {
          key: "news",
          title: "News for Launcher",
          icon: "mdi-rss",
          component: "admin-news-for-launcher",
          visible: this.hasPermission("view-launcher-news-panel"),
        },
      ],
    },
    {
      title: "In-Game Settings",
      icon: "mdi-monitor-dashboard",
      visible: this.hasPermission("view-ingame-settings-panel"),
      items: [
        {
          key: "tips",
          icon: "mdi-tooltip-text-outline",
          title: "Loading screen tips",
          component: "admin-loading-screen-tips",
          visible: this.hasPermission("view-loading-tips-panel"),
        },
      ],
    },
    {
      title: "Data Science",
      icon: "mdi-chart-line",
      visible: this.hasPermission("view-data-science-panel"),
      items: [
        {
          key: "queue",
          title: "Live Queue Data",
          icon: "mdi-table",
          component: "admin-queue-data",
          visible: this.hasPermission("view-queues-panel"),
        },
      ],
    },
    {
      title: "Rewards",
      icon: "mdi-gift",
      visible: this.hasPermission("view-rewards-panel"),
      items: [
        {
          key: "portraits",
          title: "Assign Portraits",
          icon: "mdi-account-box-outline",
          component: "admin-assign-portraits",
          visible: this.hasPermission("view-assign-portraits-panel"),
        },
        {
          key: "manage-portraits",
          title: "Manage Portraits",
          icon: "mdi-briefcase",
          component: "admin-manage-portraits",
          visible: this.hasPermission("view-manage-portraits-panel"),
        },
      ],
    },
    {
      title: "Maps",
      icon: "mdi-map-search",
      visible: this.hasPermission("view-maps-panel"),
      items: [
        {
          key: "maps",
          title: "Manage Maps",
          icon: "mdi-map-plus",
          component: "admin-maps",
          visible: this.hasPermission("view-maps-panel"),
        },
      ],
    },
    {
      title: "Permissions",
      icon: "mdi-key",
      visible: this.isSuperAdmin(),
      items: [
        {
          key: "roles-and-permissions",
          title: "Manage Roles and Permissions",
          icon: "mdi-tag-faces",
          component: "super-admin-roles-and-permissions",
        },
      ],
    },
  ];
  selectedNavItem = {};

  isAdmin(): boolean {
    return this.$store.direct.state.oauth.isAdmin;
  }

  isSuperAdmin(): boolean {
    return this.$store.direct.state.oauth.isSuperAdmin;
  }

  hasPermission(permission: string): boolean { // need to revise computed properties
    if (this.isSuperAdmin() || this.isAdmin()) return true;

    return this.$store.direct.state.oauth.permissions.includes(permission);
  }

  navItemSelected(item: NavigationItem): void {
    this.selectedNavItem = item;
  }

  getFirstItem(items: Array<NavigationItem>): NavigationItem {
    for (let item of items) {
      if (!item.items) {
        return item;
      }
      const subItem = this.getFirstItem(item.items);
      if (subItem) {
        return subItem;
      }
    }
    return this.navItems[0];
  }

  mounted(): void {
    this.navItemsAfterPermissions = this.getNavItemsWithPermissions();
    this.navItemSelected(this.getFirstItem(this.navItemsAfterPermissions));
  }
}
</script>

<style lang="scss">
.admin-page-wrapper {
  height: 100%;
  display: grid;
  grid-template-columns: 256px auto;
}
</style>
