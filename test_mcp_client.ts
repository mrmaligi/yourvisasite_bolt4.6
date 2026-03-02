import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { SSEClientTransport } from '@modelcontextprotocol/sdk/client/sse.js';
import * as fs from 'fs';

const url = "https://mcp.supabase.com/mcp?project_ref=zogfvzzizbbmmmnlzxdg&version=2024-11-05";
const token = "sbp_865a24e32d4a3e50fb9345d3d52f0ec292229c8b";

async function main() {
    const authHeaders = {
        "Authorization": `Bearer ${token}`,
        "Accept": "application/json, text/event-stream"
    };

    const transport = new SSEClientTransport(new URL(url), {
        eventSourceInit: {
            headers: authHeaders
        },
        requestInit: {
            headers: authHeaders
        }
    });

    const client = new Client({
        name: "test-client",
        version: "1.0.0"
    }, {
        capabilities: {}
    });

    console.log("Connecting...");
    await client.connect(transport);
    console.log("Connected!");

    try {
        console.log("Listing tools...");
        const tools = await client.listTools();
        console.log("Tools available:");
        for (const tool of tools.tools) {
            console.log(tool.name);
        }

        // Attempt execution
        const sql = fs.readFileSync('supabase/SQL_6_MOCK_USERS.sql', 'utf8');

        console.log("Executing SQL...");
        const result = await client.callTool({
            name: "query",
            arguments: {
                query: sql
            }
        });

        console.log("Execution Result:", JSON.stringify(result, null, 2));

    } catch (e) {
        console.error("Error listing tools", e);
    } finally {
        process.exit(0);
    }
}

main().catch(console.error);
