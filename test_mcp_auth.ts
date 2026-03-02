const url = "https://mcp.supabase.com/mcp?project_ref=zogfvzzizbbmmmnlzxdg";
const token = "sbp_865a24e32d4a3e50fb9345d3d52f0ec292229c8b";

async function run() {
    const req = await fetch(url + "&version=2024-11-05", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
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
    console.log("Status:", req.status, req.statusText);
    console.log(await req.text());
}
run();
