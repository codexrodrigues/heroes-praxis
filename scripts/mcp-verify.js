#!/usr/bin/env node
// Verifies expected MCP tools are present when running Angular CLI MCP

async function main() {
  const expected = ['get_best_practices', 'list_projects', 'search_documentation'];
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
    });
    await client.connect(transport);
    const list = await client.listTools();
    const names = new Set(list.tools.map(t => t.name));
    const missing = expected.filter(n => !names.has(n));
    await client.close();
    if (missing.length) {
      console.error('[mcp-verify] Missing tools:', missing.join(', '));
      process.exitCode = 1;
    } else {
      console.log('[mcp-verify] OK. Tools present:', expected.join(', '));
    }
  } catch (err) {
    console.error('[mcp-verify] Failed:', err?.message || err);
    process.exitCode = 1;
  }
}

main();

