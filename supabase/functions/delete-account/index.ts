// Setup type definitions for Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";
Deno.serve(async (req)=>{
  // CORS headers
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type"
      }
    });
  }
  try {
    // Get the authorization header from the request
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({
        error: "Missing authorization header"
      }), {
        status: 401,
        headers: {
          "Content-Type": "application/json"
        }
      });
    }
    // Create a Supabase client using the user's JWT
    const supabaseClient = createClient(Deno.env.get("SUPABASE_URL") ?? "", Deno.env.get("SUPABASE_ANON_KEY") ?? "", {
      global: {
        headers: {
          Authorization: authHeader
        }
      }
    });
    // Get the user's ID from their session
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({
        error: "Unauthorized or user not found"
      }), {
        status: 401,
        headers: {
          "Content-Type": "application/json"
        }
      });
    }
    const userId = user.id;
    // Create an admin client to delete the user's auth account
    // This requires the service role key which has admin privileges
    const adminClient = createClient(Deno.env.get("SUPABASE_URL") ?? "", Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "");
    // Start a transaction to delete all user data
    // You'll need to modify this section to include all tables that contain user data
    const { error: deleteError } = await adminClient.rpc("delete_user_data", {
      user_id: userId
    });
    if (deleteError) {
      console.error("Error deleting user data:", deleteError);
      return new Response(JSON.stringify({
        error: "Failed to delete user data",
        details: deleteError.message
      }), {
        status: 500,
        headers: {
          "Content-Type": "application/json"
        }
      });
    }
    // Finally, delete the user's auth account
    const { error: authDeleteError } = await adminClient.auth.admin.deleteUser(userId);
    if (authDeleteError) {
      console.error("Error deleting auth user:", authDeleteError);
      return new Response(JSON.stringify({
        error: "Failed to delete auth account",
        details: authDeleteError.message
      }), {
        status: 500,
        headers: {
          "Content-Type": "application/json"
        }
      });
    }
    return new Response(JSON.stringify({
      success: true,
      message: "Account successfully deleted"
    }), {
      headers: {
        "Content-Type": "application/json"
      }
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response(JSON.stringify({
      error: "Internal server error",
      details: error.message
    }), {
      status: 500,
      headers: {
        "Content-Type": "application/json"
      }
    });
  }
}); /* 
IMPORTANT: Before using this function, you need to create a stored procedure in your database:

CREATE OR REPLACE FUNCTION public.delete_user_data(user_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Delete from all tables that contain user data
  -- Example: Delete from profiles table
  DELETE FROM public.profiles WHERE id = user_id;
  
  -- Add more DELETE statements for other tables that contain user data
  -- DELETE FROM public.user_posts WHERE user_id = $1;
  -- DELETE FROM public.user_comments WHERE user_id = $1;
  -- etc.
  
  -- Note: The auth.users deletion will be handled by the Edge Function
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.delete_user_data(UUID) TO authenticated;
*/ 
