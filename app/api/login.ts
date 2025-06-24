

export async function testAPIKey(server: string, apiKey: string): Promise<boolean> {
    try {
      const response = await fetch(`${server}/api/v1/apikey`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
      });
  
      if (!response.ok) {
        console.error("API Error:", response.status, await response.text());
        return false;
      }else if (response.status === 200) {
        return true;
      }
    } catch (error) {
      console.error("Fetch error:", error);
      return false;
    }
}
  





