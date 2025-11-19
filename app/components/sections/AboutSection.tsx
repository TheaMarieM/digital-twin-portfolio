export default function AboutSection() {
  return (
    <section id="about" className="py-24">
      <div className="grid gap-12 md:grid-cols-3">
        <div className="md:col-span-1">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            About Me
          </h2>
          <div className="mt-3 h-1.5 w-20 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500"></div>
        </div>
        <div className="md:col-span-2 space-y-5 text-base leading-relaxed text-[rgb(var(--muted))]">
          <p>
            Hello! I am a third-year Information Technology student at St. Paul University Philippines, 
            specializing in Web Development.
          </p>
          <p>
            My passion lies in building and understanding modern web technologies. I am currently enhancing 
            my practical skills through a remote On-the-Job Training (OJT) program with Employability 
            Advantage Australia. I am proficient in using Figma to create detailed wireframes and map out 
            the structure for my web designs, ensuring a thoughtful and organized development process from 
            concept to deployment.
          </p>
          <p>
            While web development is my core focus, I am also actively expanding my knowledge into the 
            critical field of cybersecurity.
          </p>
          <p>
            In addition to my academic and training commitments, I take on freelance design commissions. 
            I enjoy helping small businesses, particularly in the food industry, by creating visual 
            materials such as posters and tarpaulins.
          </p>
        </div>
      </div>
    </section>
  );
}