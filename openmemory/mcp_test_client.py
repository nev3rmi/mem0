import asyncio
from mcp_client import MCPClient

# The URL of your MCP server, as seen from your host machine.
# Make sure this IP address is the one for the machine running Docker.
SERVER_URL = "http://192.168.31.174:8765/mcp/cursor/sse/user1"

async def run_test():
    """
    Connects to the MCP server, lists available tools, and tests them.
    """
    print("--- MCP Server Test ---")
    print(f"Attempting to connect to: {SERVER_URL}")

    # Ensure you have the client library installed:
    # pip install mcp-client
    client = MCPClient(SERVER_URL)

    try:
        await client.connect()
        print("✅ Connection successful!")

        # Step 1: Check for available tools
        print("\n🔍 Checking for available tools...")
        if not client.tools:
            print("\n❌ TEST FAILED: 0 tools found.")
            print("   This confirms the server-side tools are not initializing correctly.")
            print("   CAUSE: The most likely reason is a missing or invalid API key.")
            print("   FIX: Please ensure the `api/.env` file exists and contains a valid `OPENAI_API_KEY`.")
            return

        print(f"✅ Success! Found {len(client.tools)} tools:")
        for tool_name in client.tools:
            print(f"   - {tool_name}")

        # Step 2: Test the 'add_memories' tool
        print("\n⚡ Testing 'add_memories'...")
        test_memory = "My favorite color is blue and my favorite animal is a dog."
        print(f"   Calling tool with text: '{test_memory}'")
        response = await client.tools.add_memories(text=test_memory)
        print(f"   Server response: {response}")

        # Step 3: Test the 'search_memory' tool
        await asyncio.sleep(1) # Give a moment for the memory to be indexed
        print("\n⚡ Testing 'search_memory'...")
        search_query = "What is my favorite animal?"
        print(f"   Calling tool with query: '{search_query}'")
        response = await client.tools.search_memory(query=search_query)
        print(f"   Server response: {response}")
        
        # Step 4: Test the 'list_memories' tool
        print("\n⚡ Testing 'list_memories'...")
        print("   Calling tool to list all memories...")
        response = await client.tools.list_memories()
        print(f"   Server response: {response}")

        print("\n✅ --- All tests completed successfully! ---")

    except Exception as e:
        print(f"\n❌ TEST FAILED: An error occurred during the test.")
        print(f"   Error: {e}")
        print("   This could be a connection error or an unexpected server-side exception.")

    finally:
        if client.is_connected:
            await client.close()
            print("\n🔌 Connection closed.")


if __name__ == "__main__":
    asyncio.run(run_test()) 