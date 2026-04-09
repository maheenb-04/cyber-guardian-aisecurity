import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

const HeroSection = () => {
  return (
    <section className="pt-24 pb-12 px-4 text-center max-w-3xl mx-auto">
      <motion.h1
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-4xl font-semibold text-foreground"
      >
        AI-Powered Threat Detection
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="text-muted-foreground text-lg max-w-xl mx-auto mt-4"
      >
        Paste any URL, email, or suspicious message. Cyber Guard AI analyzes it in seconds and tells you exactly what to watch out for.
      </motion.p>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.25 }}
        className="flex flex-wrap justify-center gap-2 mt-6"
      >
        <Badge variant="secondary" className="bg-muted text-muted-foreground border-0">URL Analysis</Badge>
        <Badge variant="secondary" className="bg-muted text-muted-foreground border-0">Phishing Detection</Badge>
        <Badge variant="secondary" className="bg-muted text-muted-foreground border-0">Social Engineering Alerts</Badge>
      </motion.div>
    </section>
  );
};

export default HeroSection;
