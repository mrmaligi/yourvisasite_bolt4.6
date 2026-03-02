const url = "https://mcp.supabase.com/mcp?project_ref=zogfvzzizbbmmmnlzxdg";

async function run() {
    const req = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            jsonrpc: "2.0",
            id: 1,
            method: "initialize",
            params: {
                protocolVersion: "2024-11-05",
                capabilities: {},
                clientInfo: { name: "test", version: "1.0.0" }
            }
        })
    });
    console.log(await req.text());
}
run();
