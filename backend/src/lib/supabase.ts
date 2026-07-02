import { createClient } from '@supabase/supabase-js';

// Solo como referencia estructural. En tests usamos vi.mock()
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mock.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'mock-key';

export const supabase = createClient(supabaseUrl, supabaseKey);
