import { IDENTIFICATION_URL } from "@/main";
import { Role } from "@/store/admin/rolesAndPermissions/types";

export default class RoleService {

  public async getAllRoles(): Promise<Role[]> {
    const url = `${IDENTIFICATION_URL}api/roles`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    return await response.json();
  }
  
  public async getRole(id: string): Promise<Role> {
    const url = `${IDENTIFICATION_URL}api/roles/${encodeURIComponent(id)}`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    return await response.json();
  }

  public async createRole(permission: Role, token: string): Promise<void> {
    const url = `${IDENTIFICATION_URL}api/roles?authorization=${token}`;

    await fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(permission),
    });
  }

  public async updateRole(permission: Role, token: string): Promise<void> {
    const url = `${IDENTIFICATION_URL}api/role?authorization=${token}`;

    await fetch(url, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(permission),
    });
  }

  public async deleteRole(id: string, token: string): Promise<void> {
    const url = `${IDENTIFICATION_URL}api/role?authorization=${token}&roleId=${id}`;

    await fetch(url, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
  }
}
