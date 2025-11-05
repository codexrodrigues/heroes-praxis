#!/usr/bin/env node
// Simple MCP tools lister using @modelcontextprotocol/sdk and Angular CLI MCP server
// Usage: node scripts/mcp-tools.js

const path = require('path');

async function main() {
  try {
    const { Client } = require('@modelcontextprotocol/sdk/dist/cjs/client/index.js');
    const { StdioClientTransport } = require('@modelcontextprotocol/sdk/dist/cjs/client/stdio.js');

    const client = new Client(
      { name: 'heroes-praxis', version: '0.0.1' },
      { capabilities: { tools: {}, resources: {}, prompts: {}, logging: {} } },
    );

    const transport = new StdioClientTransport({
      command: 'npx',
      args: ['-y', '@angular/cli', 'mcp'],
      // cwd defaults to process.cwd() (project root)
    });

    await client.connect(transport);
    const info = client.getServerVersion();
    const tools = await client.listTools();
    console.log('Server:', info);
    console.log('Tools:', tools.tools.map(t => t.name).join(', '));
    await client.close();
  } catch (err) {
    console.error('[mcp-tools] Failed:', err?.message || err);
    process.exitCode = 1;
  }
}

main();

