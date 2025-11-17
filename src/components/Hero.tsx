import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";

const Hero = () => {
  return (
    <section className="min-h-screen flex items-center justify-center pt-20 pb-16 px-6">
      <div className="container mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary rounded-full text-sm">
              <Sparkles className="w-4 h-4 text-accent" />
              <span className="text-muted-foreground">Available for new projects</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-serif font-bold leading-tight">
              Crafting Digital
              <span className="block text-accent">Experiences</span>
            </h1>
            
            <p className="text-lg text-muted-foreground max-w-lg">
              I design and build beautiful, functional websites that help businesses stand out in the digital world. Let's create something extraordinary together.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-medium group">
                View My Work
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button size="lg" variant="outline">
                Learn More
              </Button>
            </div>
          </div>
          
          <div className="relative animate-fade-in">
            <div className="relative rounded-2xl overflow-hidden shadow-medium">
              <img 
                src={heroImage} 
                alt="Professional web design workspace with modern tools and beautiful interfaces"
                className="w-full h-auto object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-gradient-hero rounded-full blur-3xl opacity-50"></div>
            <div className="absolute -top-6 -left-6 w-32 h-32 bg-accent/30 rounded-full blur-3xl opacity-50"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
