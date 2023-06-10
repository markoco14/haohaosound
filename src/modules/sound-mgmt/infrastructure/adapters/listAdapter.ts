import { localStorageAdapter } from '../../../core/infrastructure/adapters/localStorageAdapter';
import { List } from '../../domain/entities/List';
import { supabase } from './supabaseClient';

class ListAdapter {
  public async getList({ url }: { url: string }): Promise<List> {
    let { data, error } = await supabase.rpc('get_list_by_url', {
      list_url: url,
    });

    if (error) {
      console.error('Failed to get list by url', { message: error.message });
      throw new Error(`Failed to get list by url: ${url}`);
    }

    const list = {
      name: data[0].list_name,
      sounds: data,
    };

    return list;
  }

  public getFreeLists(): List[] {
    const data = localStorageAdapter.get('nonUserList');

    const lists = data.map((l) => new List(l.name, l.sounds));

    return lists;
  }

  public getFreeList(): List {
    const lists = this.getFreeLists();

    return lists[0];
  }
}

export const listAdapter = new ListAdapter();
