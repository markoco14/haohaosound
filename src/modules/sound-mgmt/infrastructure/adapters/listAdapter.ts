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

    return data;
  }
}

export const listAdapter = new ListAdapter();
