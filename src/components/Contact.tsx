import { Button } from "@/components/ui/button";
import { Mail, ArrowRight } from "lucide-react";

const Contact = () => {
  return (
    <section id="about" className="py-24 px-6 bg-gradient-subtle">
      <div className="container mx-auto">
        <div className="max-w-3xl mx-auto text-center space-y-8 animate-fade-in-up">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-accent/10 rounded-full mb-4">
            <Mail className="w-8 h-8 text-accent" />
          </div>
          
          <h2 className="text-4xl md:text-5xl font-serif font-bold">
            Let's Work Together
          </h2>
          
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            I'm always excited to take on new projects and collaborate with amazing people. 
            Whether you have a clear vision or just an idea, let's bring it to life.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-medium group">
              Start a Project
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button size="lg" variant="outline">
              Schedule a Call
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
