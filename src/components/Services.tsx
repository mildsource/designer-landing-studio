import { Code, Palette, Zap } from "lucide-react";

const services = [
  {
    icon: Palette,
    title: "UI/UX Design",
    description: "Beautiful, intuitive interfaces that users love. Every pixel crafted with purpose and attention to detail.",
  },
  {
    icon: Code,
    title: "Web Development",
    description: "Clean, performant code that brings designs to life. Built with modern technologies for speed and scalability.",
  },
  {
    icon: Zap,
    title: "Brand Identity",
    description: "Cohesive visual systems that tell your story. From logos to complete brand guidelines.",
  },
];

const Services = () => {
  return (
    <section id="services" className="py-24 px-6 bg-gradient-subtle">
      <div className="container mx-auto">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4">
            What I Do
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Specializing in creating digital experiences that are both beautiful and functional
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div 
              key={index}
              className="bg-card p-8 rounded-2xl shadow-soft hover:shadow-medium transition-all duration-300 hover:-translate-y-1 animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mb-6">
                <service.icon className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-xl font-serif font-semibold mb-3">
                {service.title}
              </h3>
              <p className="text-muted-foreground">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
