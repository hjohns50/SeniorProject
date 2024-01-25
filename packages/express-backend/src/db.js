import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://brnsbnjbmbtfgccotsvr.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJybnNibmpibWJ0ZmdjY290c3ZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDYwNDkxODIsImV4cCI6MjAyMTYyNTE4Mn0.XsBPUE8wBtEQsGFWeufx6GuXA5lvsujSf_2TIpslMnc"

const supabase = createClient(supabaseUrl, supabaseKey);


export default supabase;