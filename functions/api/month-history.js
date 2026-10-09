export async function onRequest({request,env}) {
  const headers = {"Content-Type":"application/json","Cache-Control":"no-store"};
  if (!env.INTERCEDE_KV) return new Response(JSON.stringify({error:"KV namespace not bound"}),{status:500,headers});
  if (request.method === "GET") {
    const data = await env.INTERCEDE_KV.get("month-history");
    return new Response(data || "[]",{headers});
  }
  if (request.method === "POST") {
    try {
      const data = await request.json();
      if (!Array.isArray(data) || data.length > 24) throw new Error("Invalid history");
      await env.INTERCEDE_KV.put("month-history",JSON.stringify(data));
      return new Response(JSON.stringify({ok:true}),{headers});
    } catch {
      return new Response(JSON.stringify({error:"Invalid history"}),{status:400,headers});
    }
  }
  return new Response(JSON.stringify({error:"Method not allowed"}),{status:405,headers});
}
