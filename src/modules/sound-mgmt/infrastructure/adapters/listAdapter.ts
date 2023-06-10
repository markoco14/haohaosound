import { supabase } from './supabaseClient';

class ListAdapter {
  public async getList({ url }: { url: string }) {
    let { data, error } = await supabase.rpc('get_list_by_url', {
      list_url: url,
    });

    return { data, error };
  }
}

export const listAdapter = new ListAdapter();
