import { ExternalLink } from "lucide-react";

const projects = [
  {
    title: "E-Commerce Platform",
    category: "Web Design & Development",
    color: "from-blue-400 to-cyan-400",
  },
  {
    title: "SaaS Dashboard",
    category: "UI/UX Design",
    color: "from-purple-400 to-pink-400",
  },
  {
    title: "Brand Identity",
    category: "Branding & Design",
    color: "from-orange-400 to-red-400",
  },
  {
    title: "Mobile App",
    category: "App Design",
    color: "from-green-400 to-emerald-400",
  },
];

const Portfolio = () => {
  return (
    <section id="work" className="py-24 px-6">
      <div className="container mx-auto">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4">
            Selected Work
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A collection of projects that showcase my approach to design and development
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <div 
              key={index}
              className="group relative rounded-2xl overflow-hidden shadow-soft hover:shadow-medium transition-all duration-300 hover:-translate-y-1 cursor-pointer animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`aspect-[4/3] bg-gradient-to-br ${project.color} relative`}>
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                <div className="absolute top-4 right-4 w-10 h-10 bg-background/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <ExternalLink className="w-5 h-5" />
                </div>
              </div>
              <div className="bg-card p-6">
                <h3 className="text-xl font-serif font-semibold mb-2">
                  {project.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {project.category}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Portfolio;
