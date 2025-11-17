import { supabase } from 'src/lib/supabase';
import { v4 as uuidv4 } from 'uuid';

export async function uploadAvatar(
  file: Express.Multer.File,
  userId: string,
): Promise<string> {
  const fileExt = file.originalname.split('.').pop();
  const fileName = `${userId}-${uuidv4()}.${fileExt}`;
  const filePath = `avatars/${fileName}`;

  const { error } = await supabase.storage
    .from('users-avatars')
    .upload(filePath, file.buffer, {
      contentType: file.mimetype,
    });

  if (error) {
    console.error('Erro Supabase:', error);
    throw new Error('Erro ao fazer upload do avatar no Supabase');
  }

  const { data } = supabase.storage
    .from('users-avatars')
    .getPublicUrl(filePath);
  return data.publicUrl;
}
