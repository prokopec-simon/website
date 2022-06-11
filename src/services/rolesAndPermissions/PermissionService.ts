import { IDENTIFICATION_URL } from "@/main";
import { Permission } from "@/store/admin/rolesAndPermissions/types";

export default class PermissionsService {

  public async getAllPermissions(): Promise<Permission[]> {
    const url = `${IDENTIFICATION_URL}api/permissions`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    return await response.json();
  }

  public async createPermission(permission: Permission, token: string): Promise<void> {
    const url = `${IDENTIFICATION_URL}api/permissions?authorization=${token}`;

    await fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(permission),
    });
  }

  public async updatePermission(permission: Permission, token: string): Promise<void> {
    const url = `${IDENTIFICATION_URL}api/permissions?authorization=${token}`;

    await fetch(url, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(permission),
    });
  }

  public async deletePermission(id: string, token: string): Promise<void> {
    const url = `${IDENTIFICATION_URL}api/permissions?authorization=${token}&id=${id}`;

    await fetch(url, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
  }
}
