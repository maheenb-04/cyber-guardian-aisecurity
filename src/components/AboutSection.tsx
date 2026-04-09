const AboutSection = () => {
  return (
    <section className="max-w-2xl mx-auto text-center px-4 py-12" id="about">
      <h2 className="text-2xl font-semibold text-foreground mb-4">About Cyber Guard AI</h2>
      <p className="text-muted-foreground">
        Cyber Guard AI was built as a capstone project for an AI prompt engineering accelerator program. It uses large language model analysis to evaluate URLs, emails, and messages for signs of phishing, social engineering, and other common cyber threats. The goal is to make threat awareness accessible to everyone, not just security professionals.
      </p>
    </section>
  );
};

export default AboutSection;
