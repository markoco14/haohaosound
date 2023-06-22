import { supabase } from '../../../core/infrastructure/adapters/supabaseClient';
import { Sound } from '../../domain/entities/Sound';

class SoundAdapter {
	public async getAllSounds(): Promise<Sound[]> {
		let { data, error } = await supabase.from('sounds').select('name, audio_url');

		 if (error) {
      console.error('Failed to get sounds', { message: error.message });
      throw new Error(`Failed to get sounds.`);
    }

		return data;
	}
}

export const soundAdapter = new SoundAdapter();