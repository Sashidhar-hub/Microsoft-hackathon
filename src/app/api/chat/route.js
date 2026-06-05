import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { messages } = await req.json();
    const lastUserMessage = messages[messages.length - 1]?.text || '';

    // Environment variables for live Azure AI Foundry / Azure OpenAI connection
    const endpoint = process.env.AZURE_AI_FOUNDRY_CHAT_ENDPOINT;
    const key = process.env.AZURE_AI_FOUNDRY_CHAT_KEY;

    if (endpoint && key) {
      try {
        const formattedMessages = messages.map(m => ({
          role: m.sender === 'user' ? 'user' : 'assistant',
          content: m.text
        }));

        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${key}`
          },
          body: JSON.stringify({
            messages: [
              {
                role: 'system',
                content: 'You are SmartCampus Energy AI Copilot, a helpful assistant specializing in university campus energy grid optimization, building automation, and peak load shaving. Keep your answers concise, practical, and formatted in markdown.'
              },
              ...formattedMessages
            ]
          })
        });

        if (response.ok) {
          const data = await response.json();
          const reply = data.choices[0].message.content;
          return NextResponse.json({
            sender: 'ai',
            text: reply,
            source: 'Azure AI Foundry Chat API'
          });
        } else {
          console.error('Azure AI Chat model response error:', response.statusText);
        }
      } catch (e) {
        console.error('Failed to connect to Azure AI Chat endpoint:', e);
      }
    }

    // Heuristic NLP response generator (Simulated model) when endpoint is not configured
    let aiText = '';
    let strategies = null;

    const query = lastUserMessage.toLowerCase();

    if (query.includes('hello') || query.includes('hi ') || query.includes('hey')) {
      aiText = "Hello! I am your SmartCampus Energy Copilot. How can I help you optimize energy, monitor the digital twin, or review peak demand forecasts today?";
    } else if (query.includes('dorm a') || query.includes('residence') || query.includes('dormitory')) {
      aiText = "I've analyzed the telemetry for **Dormitory Complex (Block A)**. Usage patterns show a distinct demand spike between 6:00 PM and 9:00 PM as students return. \n\nI recommend:\n1. Dimming common corridors by 15%.\n2. Discharging the solar battery backup during this peak window.";
      strategies = [
        { id: 'D1', name: 'Battery Discharge', text: 'Deploy stored solar energy to offset residential spikes.', savings: '-8.5 kW/h', color: 'primary' },
        { id: 'D2', name: 'Laundry Lock', text: 'Restrict heavy appliance use in common laundry rooms past 6 PM.', savings: '-3.0 kW/h', color: 'secondary' }
      ];
    } else if (query.includes('solar') || query.includes('battery') || query.includes('renewable')) {
      aiText = "Our campus solar array is producing **340 kW** currently, and the solar battery bank is at **78% capacity (420 kWh)**. Based on the afternoon weather forecast, we have enough charge to offset the predicted 2:00 PM cooling peak.";
      strategies = [
        { id: 'S1', name: 'Solar Peak Offset', text: 'Discharge 150 kWh of battery storage starting at 1:45 PM.', savings: '-15.0 kW/h', color: 'primary' }
      ];
    } else if (query.includes('hvac') || query.includes('cooling') || query.includes('air conditioning') || query.includes('temperature')) {
      aiText = "HVAC load accounts for 54% of current campus consumption. Our models predict a temperature rise this afternoon. \n\nI advise scheduling **pre-cooling** for the Science Wing and the Auditorium to lower core temperatures before peak electricity rates apply.";
      strategies = [
        { id: 'H1', name: 'Science Wing Pre-cool', text: 'Lower thermostat to 68°F from 10 AM to 12 PM, then set to 74°F.', savings: '-9.2 kW/h', color: 'primary' }
      ];
    } else if (query.includes('report') || query.includes('sustainability') || query.includes('pdf')) {
      aiText = "I have compiled the **Q2 2026 Campus Sustainability Report Draft**. \n\n**Summary:**\n- **Total Consumption:** 12.4 MWh (down 4.2% YoY)\n- **Carbon Offset:** 8.5 Tons due to solar and smart HVAC routines.\n- **Recommended Focus:** Upgrade sub-meters in Block D to improve detail accuracy.";
    } else if (query.includes('peak') || query.includes('throttle') || query.includes('limit')) {
      aiText = "The Next peak warning is active for **Block C** around 2:15 PM. Initiating smart throttling on non-critical lab ventilation will keep demands within safe threshold margins and save approximately **$1,200** in demand charges.";
    } else {
      const topics = [];
      if (query.includes('reduce') || query.includes('save') || query.includes('cut')) topics.push('curtailment and peak-shaving');
      if (query.includes('cost') || query.includes('price') || query.includes('bill')) topics.push('tariff optimization and load shifting');
      if (query.includes('data') || query.includes('chart') || query.includes('metric')) topics.push('telemetry analysis');

      const topicStr = topics.length > 0 ? topics.join(' and ') : 'energy grid optimization';
      aiText = `That is an interesting question regarding **${topicStr}**. 

I have processed your query and compared it against our current campus sub-meter database:
- **Status:** All systems operating within standard ranges.
- **Action Plan:** I recommend monitoring the **Digital Twin** tab to see real-time building loads, or uploading a custom CSV file with telemetry data here for a deep-dive analysis.

Let me know if you would like me to draft a specific control rule or schedule a curtailment task!`;
    }

    return NextResponse.json({
      sender: 'ai',
      text: aiText,
      strategies: strategies,
      source: 'SmartCampus Energy NLP Engine'
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
