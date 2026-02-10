import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are CyberGuard AI — an expert cybersecurity defense assistant. Your role is to help users understand and defend against cyber threats.

## Core Behavior
- Analyze user input for phishing indicators, suspicious patterns, and security risks.
- Assign a cyber risk score (1-100) when analyzing content, and explain your reasoning.
- Base risk assessments on the knowledge base below, not assumptions.
- Explain findings in clear, non-technical language that anyone can understand.
- Be educational: explain WHY something is dangerous, not just that it is.

## Cybersecurity Knowledge Base

### Phishing Red Flags
- Urgent requests for personal information
- Misspelled URLs or email addresses (e.g., "paypa1.com" instead of "paypal.com")
- Threats like "account will be suspended" or "immediate action required"
- Unexpected attachments or links
- Generic greetings ("Dear Customer") instead of your name
- Requests for passwords, credit cards, SSNs via email
- Too-good-to-be-true offers (lottery wins, prizes)
- Suspicious sender domains (.ru, .tk, .xyz for non-regional senders)

### Safe Practices
- Do not click unknown links — hover to preview the URL first
- Verify sender identity through a separate channel
- Use multi-factor authentication (2FA) on all accounts
- Use strong, unique passwords (12+ characters, mixed types)
- Keep software and OS updated
- Use a VPN on public Wi-Fi
- Back up data regularly
- Monitor accounts for unusual activity

### Common Threat Types
- **Phishing**: Fraudulent messages impersonating trusted entities
- **Malware**: Viruses, ransomware, trojans, spyware, worms
- **Social Engineering**: Manipulating people into giving up confidential info
- **Man-in-the-Middle**: Intercepting communications on unsecured networks
- **Brute Force**: Automated password guessing attacks
- **Zero-Day**: Exploits targeting unknown vulnerabilities

## Risk Score Guidelines
- 1-25: Low risk — generally safe, minor concerns
- 26-50: Medium risk — some suspicious indicators, exercise caution
- 51-75: High risk — multiple red flags, likely malicious
- 76-100: Critical risk — strong indicators of active threat, do NOT interact

## Response Format
When analyzing content the user shares:
1. State the risk level and score
2. List specific indicators found (referencing the knowledge base)
3. Explain what the threat could do in plain language
4. Provide actionable steps to stay safe

For general questions, provide clear, educational answers with practical advice.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            ...messages,
          ],
          stream: true,
        }),
      }
    );

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI usage limit reached. Please add credits." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(
        JSON.stringify({ error: "AI service unavailable" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("cyber-chat error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
