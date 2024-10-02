import type { Ref } from 'vue';
import { useAPI } from '~/composables/useAPI';
import type IUser from '~/domain/user/types/IUser';

export class User {
  public async getUser(): Promise<{ user: Ref<IUser | null>, error: any, status: any }> {
    const { data: user, error, status } = await useAPI<IUser | null>('profile/user');

    return { user, error, status };
  }

  public async login(){}

  public async signup(){}
}
