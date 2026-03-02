import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import * as fs from 'fs';
import { spawn } from 'child_process';

async function main() {
    const transport = new StdioClientTransport({
        command: 'npx',
        args: ['-y', '@modelcontextprotocol/server-supabase'],
        env: {
            ...process.env,
            SUPABASE_ACCESS_TOKEN: 'sbp_865a24e32d4a3e50fb9345d3d52f0ec292229c8b',
            SUPABASE_PROJECT_REF: 'zogfvzzizbbmmmnlzxdg'
        }
    });

    const client = new Client({ name: "test-client", version: "1.0.0" }, { capabilities: {} });

    console.log("Connecting...");
    await client.connect(transport);
    console.log("Connected!");

    try {
        const tools = await client.listTools();
        console.log("Tools available:", tools.tools.map(t => t.name));

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
        console.error("Error", e);
    } finally {
        process.exit(0);
    }
}

main().catch(console.error);
