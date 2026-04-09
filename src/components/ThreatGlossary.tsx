import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

interface ThreatEntry {
  name: string;
  severity: "critical" | "high";
  definition: string;
  example: string;
  redFlags: string[];
}

const threats: ThreatEntry[] = [
  {
    name: "Phishing",
    severity: "critical",
    definition: "A deceptive attempt to steal sensitive information by impersonating a trustworthy entity in electronic communication.",
    example: "An email appearing to be from your bank asking you to verify your account by clicking a link that leads to a fake login page.",
    redFlags: ["Urgency or threats in the message", "Mismatched sender domain", "Generic greeting like 'Dear Customer'", "Requests for credentials or payment information"],
  },
  {
    name: "Smishing",
    severity: "high",
    definition: "Phishing conducted via SMS text messages, typically impersonating delivery services, banks, or government agencies.",
    example: "A text message claiming your package is held and you must pay a small fee to release it via a linked website.",
    redFlags: ["Unexpected delivery notifications", "Shortened or suspicious URLs", "Requests to call an unfamiliar number", "Prize or reward claims"],
  },
  {
    name: "Vishing",
    severity: "high",
    definition: "Voice phishing where attackers call victims by phone pretending to be from a bank, government agency, or tech support.",
    example: "A caller claiming to be from the IRS demanding immediate payment to avoid arrest.",
    redFlags: ["Unsolicited calls creating urgency", "Requests for wire transfers or gift cards", "Refusal to let you call back on a verified number", "Pressure to keep the call secret"],
  },
  {
    name: "Spear Phishing",
    severity: "critical",
    definition: "A targeted phishing attack using personal details gathered from social media or data breaches to appear highly credible.",
    example: "An email addressed to you by name appearing to be from your company's IT department asking you to reset your password.",
    redFlags: ["Unexpected requests from known contacts", "Slightly off sender addresses", "Requests for unusual access or credentials", "Pressure to act quickly without verification"],
  },
  {
    name: "URL Spoofing",
    severity: "high",
    definition: "Creating a fraudulent web address that closely resembles a legitimate one to trick users into visiting a malicious site.",
    example: "The URL paypa1.com instead of paypal.com, or amazon-secure-login.com instead of amazon.com.",
    redFlags: ["Extra words or numbers in the domain", "Hyphens where there should be none", "Misspelled brand names", "HTTP instead of HTTPS on sensitive pages"],
  },
  {
    name: "Homograph Attack",
    severity: "high",
    definition: "Using Unicode characters that look visually identical to standard Latin letters to create convincing fake domains.",
    example: "Using the Cyrillic letter that looks identical to the letter 'a' to register a domain that appears to be apple.com but is not.",
    redFlags: ["Domain looks correct but browser flags it", "URL contains encoded or unusual characters when inspected", "Link was received unsolicited"],
  },
  {
    name: "Business Email Compromise",
    severity: "critical",
    definition: "An attack where criminals impersonate company executives or vendors to trick employees into transferring money or sensitive data.",
    example: "An email appearing to come from the CEO asking the finance team to wire funds urgently to a new vendor account.",
    redFlags: ["Requests to bypass normal approval processes", "Urgency and secrecy requested", "Wire transfer or gift card payment methods", "Slight variations in the executive email address"],
  },
  {
    name: "Social Engineering",
    severity: "high",
    definition: "Manipulating people psychologically to divulge confidential information or perform actions that compromise security.",
    example: "An attacker posing as a new IT employee asking a staff member to share their login temporarily.",
    redFlags: ["Requests that bypass security procedures", "Appeals to authority or urgency", "Flattery or building false rapport", "Requests made outside normal channels"],
  },
  {
    name: "Credential Harvesting",
    severity: "critical",
    definition: "The mass collection of usernames and passwords through fake login pages, malware, or data breaches to gain unauthorized access.",
    example: "A fake Microsoft 365 login page that captures your username and password and redirects you to the real site so you do not notice.",
    redFlags: ["Login pages reached via unexpected links", "Pages that do not match the official design", "Being asked to log in again when already logged in", "URL does not match the service"],
  },
  {
    name: "Malware Delivery via Link",
    severity: "critical",
    definition: "Embedding malicious software download triggers inside URLs that automatically download or execute harmful code when visited.",
    example: "A link that immediately downloads an executable file disguised as a PDF invoice when clicked.",
    redFlags: ["Links that trigger immediate downloads", "Files with double extensions like invoice.pdf.exe", "URLs using URL shorteners in unexpected contexts", "Links received from unknown senders"],
  },
];

const severityColor = (s: "critical" | "high") =>
  s === "critical"
    ? "bg-destructive text-destructive-foreground"
    : "bg-warning text-warning-foreground";

const ThreatGlossary = () => {
  return (
    <section className="max-w-3xl mx-auto px-4 py-12" id="threat-dictionary">
      <h2 className="text-2xl font-semibold text-foreground mb-6 text-center">Threat Dictionary</h2>
      <Accordion type="single" collapsible className="space-y-3">
        {threats.map((t) => (
          <AccordionItem key={t.name} value={t.name} className="bg-card border border-border rounded-lg px-4">
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-3">
                <span className="font-medium text-foreground">{t.name}</span>
                <Badge className={`text-[10px] uppercase tracking-wider ${severityColor(t.severity)}`}>
                  {t.severity}
                </Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-4">
              <p className="text-sm text-foreground">{t.definition}</p>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Real-world example</p>
                <div className="bg-muted/30 border border-border rounded-md p-3 text-sm text-muted-foreground">
                  {t.example}
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Red flags to watch for</p>
                <ul className="space-y-1">
                  {t.redFlags.map((flag) => (
                    <li key={flag} className="text-sm text-foreground flex items-start gap-2">
                      <span className="text-destructive font-bold">-</span>
                      {flag}
                    </li>
                  ))}
                </ul>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
};

export default ThreatGlossary;
