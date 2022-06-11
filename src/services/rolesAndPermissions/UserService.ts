import { IDENTIFICATION_URL } from "@/main";
import { User } from "@/store/admin/rolesAndPermissions/types";

export default class PermissionsService {

  public async getAllUsers(token: string): Promise<User[]> {
    const url = `${IDENTIFICATION_URL}api/users?authorization=${token}`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    return await response.json();
  }

  public async getUser(id: string, token: string): Promise<User> {
    const url = `${IDENTIFICATION_URL}api/users/${encodeURIComponent(id)}?authorization=${token}`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    return await response.json();
  }

  public async createUser(user: User, token: string): Promise<void> {
    const url = `${IDENTIFICATION_URL}api/users?authorization=${token}`;

    await fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });
  }

  public async updateUser(user: User, token: string): Promise<void> {
    const url = `${IDENTIFICATION_URL}api/users?authorization=${token}`;

    await fetch(url, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });
  }

  public async deleteUser(id: string, token: string): Promise<void> {
    const url = `${IDENTIFICATION_URL}api/users?authorization=${token}&userId=${id}`;

    await fetch(url, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
  }
}
