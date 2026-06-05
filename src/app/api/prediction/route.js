import { NextResponse } from 'next/server';

export async function GET() {
  const endpoint = process.env.AZURE_AI_FOUNDRY_ENDPOINT;
  const key = process.env.AZURE_AI_FOUNDRY_KEY;

  // If Azure credentials are configured, we make an actual call to the endpoint
  if (endpoint && key) {
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${key}`,
        },
        body: JSON.stringify({
          // Simple payload suitable for Azure AI Foundry deployment
          messages: [
            {
              role: 'system',
              content: 'You are an energy prediction assistant. Return JSON containing nextPeakTime (string, e.g. "14:15 PM"), alertLevel (string: "Low", "Medium", "High", "Critical"), confidenceScore (number 0-100), and reason (string describing peak surge reasons).'
            },
            {
              role: 'user',
              content: 'Predict the next peak usage for the smart campus grid.'
            }
          ],
          response_format: { type: 'json_object' }
        })
      });

      if (response.ok) {
        const data = await response.json();
        const content = JSON.parse(data.choices[0].message.content);
        return NextResponse.json({
          source: 'Azure AI Foundry Live Endpoint',
          nextPeakTime: content.nextPeakTime || '14:30 PM',
          alertLevel: content.alertLevel || 'High',
          confidenceScore: content.confidenceScore || 88,
          reason: content.reason || 'Predicted load surge in engineering wings due to computer lab schedules.'
        });
      } else {
        console.error('Azure AI Foundry response error:', response.statusText);
      }
    } catch (e) {
      console.error('Failed to query Azure AI Foundry:', e);
    }
  }

  // Fallback / Simulated Azure AI Foundry response
  return NextResponse.json({
    source: 'Azure AI Foundry (Simulated Service Connection)',
    nextPeakTime: '14:15 PM',
    alertLevel: 'Critical',
    confidenceScore: 89,
    reason: 'Predicted load exceeds cooling capacity by 12% in Block C due to building HVAC cycles.'
  });
}
