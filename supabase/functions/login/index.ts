import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import * as bcrypt from "https://deno.land/x/bcrypt@v0.4.1/mod.ts";
import * as jose from "https://deno.land/x/jose@v4.14.4/index.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { loginId, password } = await req.json();

    if (!loginId || !password) {
      return new Response(JSON.stringify({ error: "Login ID and password are required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Initialize Supabase client using the SERVICE_ROLE_KEY to bypass RLS
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    const jwtSecret = Deno.env.get("JWT_SECRET") ?? "fallback_secret_key_change_in_production";

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch user from team_members table
    const { data: users, error } = await supabase
      .from("team_members")
      .select("*")
      .or(`login_id.ilike.${loginId},employee_id.ilike.${loginId}`)
      .limit(1);

    if (error || !users || users.length === 0) {
      return new Response(JSON.stringify({ error: "Invalid Login ID or Password" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const user = users[0];

    // Compare passwords
    const passwordMatch = await bcrypt.compare(password, user.password);
    
    if (!passwordMatch) {
      // Fallback to check if it's a plaintext match (just in case they haven't migrated yet)
      // Remove this in strict production environments
      if (password !== user.password) {
        return new Response(JSON.stringify({ error: "Invalid Login ID or Password" }), {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    // Password matches. Generate a JWT token.
    const secret = new TextEncoder().encode(jwtSecret);
    const token = await new jose.SignJWT({ id: user.id, name: user.name, role: "employee" })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("24h")
      .sign(secret);

    // Return success with token and user profile (excluding password)
    const { password: _, ...userProfile } = user;

    return new Response(
      JSON.stringify({ success: true, token, user: userProfile }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: "Internal Server Error", details: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
