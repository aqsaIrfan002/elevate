import { useState, useEffect, useRef } from 'react';
import { ChevronDown, ArrowUpRight, ArrowLeft, ArrowRight } from 'lucide-react';

// Custom hook for scroll animations
const useScrollAnimation = (options = {}) => {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef();

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            {
                threshold: 0.1,
                rootMargin: '-50px 0px',
                ...options
            }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => {
            if (ref.current) {
                observer.unobserve(ref.current);
            }
        };
    }, [options]);

    return [ref, isVisible];
};

// Animation component wrapper
const AnimatedSection = ({ children, className = '', delay = 0, direction = 'up' }) => {
    const [ref, isVisible] = useScrollAnimation();

    const getTransform = () => {
        switch (direction) {
            case 'up': return 'translateY(60px)';
            case 'down': return 'translateY(-60px)';
            case 'left': return 'translateX(-60px)';
            case 'right': return 'translateX(60px)';
            default: return 'translateY(60px)';
        }
    };

    return (
        <div
            ref={ref}
            className={className}
            style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0) translateX(0)' : getTransform(),
                transition: `all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${delay}s`,
            }}
        >
            {children}
        </div>
    );
};

// Staggered text animation
const AnimatedText = ({ children, className = '', stagger = false, style = {} }) => {
    const [ref, isVisible] = useScrollAnimation();

    if (!stagger) {
        return (
            <div
                ref={ref}
                className={className}
                style={{
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
                    transition: 'all 0.6s ease-out',
                    ...style
                }}
            >
                {children}
            </div>
        );
    }

    return (
        <div ref={ref} className={className}>
            {typeof children === 'string' ?
                children.split(' ').map((word, index) => (
                    <span
                        key={index}
                        style={{
                            display: 'inline-block',
                            opacity: isVisible ? 1 : 0,
                            transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                            transition: `all 0.6s ease-out ${index * 0.1}s`,
                            marginRight: '0.25rem',
                            ...style
                        }}
                    >
                        {word}
                    </span>
                )) : children
            }
        </div>
    );
};

// Individual Project Card Component
const ProjectCard = ({ project, isSecondItem, isAnimating }) => {
    return (
        <div
            className={`rounded-2xl transition-all duration-700 ease-in-out ${
                isSecondItem ? 'h-64 md:h-80' : 'h-80 md:h-96'
            }`}
            style={{
                width: 'calc(50% - 8px)',
                flexShrink: 0,
                backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${project.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                opacity: isAnimating ? 0.7 : 1,
                transform: isAnimating ? 'scale(0.98)' : 'scale(1)',
            }}
        >
            <div className="relative z-10 p-4 md:p-6 flex flex-col justify-end h-full text-white">
                <h4 className="text-base md:text-lg font-[400] mb-2">{project.title}</h4>
                <p className="text-sm md:text-base font-[300] mb-4">{project.description}</p>
                <button className="bg-white text-gray-900 px-4 md:px-5 py-2 rounded-full text-sm md:text-base font-[400] hover:bg-black hover:text-white transition-colors w-fit">
                    Learn more
                </button>
            </div>
        </div>
    );
};

const App = () => {
    const projects = [
        {
            title: "Green Valley Commons",
            description: "Sustainable family homes with eco-friendly features",
            image: "project1.png"
        },
        {
            title: "Metropolitan Plaza",
            description: "Mixed-use development with retail and office spaces",
            image: "project2.png"
        },
        {
            title: "Skyline Residences",
            description: "Modern luxury apartments with city views",
            image: "project3.png"
        }
    ];

    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);

    // Get current visible projects
    const getCurrentProjects = () => {
        const firstProject = projects[currentIndex];
        const secondProject = projects[(currentIndex + 1) % projects.length];
        return [firstProject, secondProject];
    };

    const nextSlide = () => {
        if (isAnimating) return;

        setIsAnimating(true);

        setTimeout(() => {
            setCurrentIndex((prev) => (prev + 1) % projects.length);
            setIsAnimating(false);
        }, 350);
    };

    const prevSlide = () => {
        if (isAnimating) return;

        setIsAnimating(true);

        setTimeout(() => {
            setCurrentIndex((prev) => (prev - 1 + projects.length) % projects.length);
            setIsAnimating(false);
        }, 350);
    };

    const currentProjects = getCurrentProjects();

    return (
        <div className="min-h-screen bg-[#EBEBEB] text-black tracking-tight" style={{ fontFamily: 'DM Sans' }}>
            {/* Navigation */}
            <nav className="absolute top-6 md:top-10 left-0 right-0 z-50">
                <div className="max-w-7xl mx-auto flex items-center justify-between px-6 md:px-36">
                    <AnimatedSection direction="left" delay={0.2}>
                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center flex-shrink-0">
                                <img src="logo.png" alt="Elevate Logo" className="w-full h-full object-contain" />
                            </div>
                            <span className="text-white font-[500] text-lg md:text-xl">Elevate</span>
                        </div>
                    </AnimatedSection>

                    <AnimatedSection direction="right" delay={0.4}>
                        <div className="hidden md:flex items-center space-x-8">
                            <a href="#" className="text-white text-lg font-[300] hover:text-gray-300 transition-colors">About</a>
                            <a href="#" className="text-white text-lg font-[300] hover:text-gray-300 transition-colors">Projects</a>
                            <a href="#" className="text-white text-lg font-[300] hover:text-gray-300 transition-colors">Investment</a>
                            <a href="#" className="text-white text-lg font-[300] hover:text-gray-300 transition-colors">Contact</a>
                        </div>
                    </AnimatedSection>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative min-h-[75vh] sm:min-h-screen">
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{
                        backgroundImage: `
                                linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)),
                                url('background.png'),
                                url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 800'><defs><pattern id='diagonals' patternUnits='userSpaceOnUse' width='4' height='4'><path d='M0,4 l4,-4 M-1,1 l2,-2 M3,5 l2,-2' stroke='%23333' stroke-width='0.5'/></pattern></defs><rect width='100%' height='100%' fill='%23222'/><rect width='100%' height='100%' fill='url(%23diagonals)' opacity='0.3'/></svg>")
                            `
                    }}
                />

                <div className="relative z-10 text-left text-white max-w-7xl mx-auto flex items-center">
                    <div className="grid lg:grid-rows-1 items-start gap-8 md:gap-12 pt-36 md:pt-42 px-6 md:px-36">
                        <div>
                            <AnimatedText
                                className="text-4xl sm:text-5xl lg:text-4xl xl:text-5xl font-[300] leading-tight tracking-tight mb-4 md:mb-6" // Changed text-2xl to text-3xl, added sm:text-4xl
                                delay={0.5}
                            >
                                Building Tomorrow's <br />Communities Today
                            </AnimatedText>

                            <AnimatedSection delay={0.6}>
                                <p className="text-base sm:text-lg md:text-base font-[300] leading-relaxed"> {/* Changed text-sm to text-base, added sm:text-lg */}
                                    Transform your vision into reality with our premium residential and<br className="hidden md:block" />
                                    commercial developments. We create exceptional spaces where <br className="hidden md:block" />
                                    innovation meets tradition, uncompromising quality, delivering properties <br className="hidden md:block" />
                                    that exceed expectations and build lasting value.
                                </p>
                            </AnimatedSection>
                        </div>

                        {/* Search Filters - Hidden on mobile */}
                        <AnimatedSection delay={0.8} className="hidden md:block">
                            <div className="bg-white rounded-full shadow-2xl p-1 flex items-center">
                                <div className="relative flex-1">
                                    <select className="bg-transparent text-black px-6 py-3 pr-10 rounded-full border-0 outline-none w-full appearance-none">
                                        <option>Property</option>
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-800 pointer-events-none" />
                                </div>

                                <div className="w-px h-12 bg-gray-300"></div>

                                <div className="relative flex-1">
                                    <select className="bg-transparent text-black px-6 py-3 pr-10 rounded-full border-0 outline-none w-full appearance-none">
                                        <option>Location</option>
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-800 pointer-events-none" />
                                </div>

                                <div className="w-px h-12 bg-gray-300"></div>

                                <div className="relative flex-1">
                                    <select className="bg-transparent text-black px-6 py-3 pr-10 rounded-full border-0 outline-none w-full appearance-none">
                                        <option>Budget</option>
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-800 pointer-events-none" />
                                </div>

                                <button className="bg-black text-white px-8 py-3 rounded-full hover:bg-gray-800 transition-colors">
                                    Search
                                </button>
                            </div>
                        </AnimatedSection>
                    </div>
                </div>
            </section>

            {/* Premier Developer Section */}
            <section className="py-12 md:py-20 px-6">
                <div className="max-w-7xl mx-auto md:px-36">
                    <div className="grid lg:grid-rows-1 items-center">
                        <AnimatedSection>
                            <h2 className="text-2xl md:text-3xl lg:text-4xl mb-6 md:mb-8 leading-tight">
                                Premier developer of residential and commercial properties with{' '}
                                <em className="font-normal" style={{ fontFamily: 'Playfair Display, serif' }}>innovative</em> design,{' '}
                                <em className="font-normal" style={{ fontFamily: 'Playfair Display, serif' }}>sustainable</em> practices, <br className="hidden md:block" />and{' '}
                                <em className="font-normal" style={{ fontFamily: 'Playfair Display, serif' }}>exceptional</em> value
                            </h2>
                        </AnimatedSection>

                        <div className="grid lg:grid-cols-[1fr_2fr] gap-8">
                            <AnimatedSection direction="left" delay={0.3}>
                                <div className="flex flex-col justify-between h-full gap-6 md:gap-0">
                                    <div className='relative flex items-center gap-2'>
                                        <p>Featured</p>
                                        <div className="flex-1 h-px bg-black"></div>
                                    </div>

                                    <div className="hidden md:block">
                                        <h2 className="text-2xl md:text-3xl lg:text-4xl tracking-tight mb-4 md:mb-6">
                                            Our Signature <br />
                                            Developments
                                        </h2>

                                        <button className="bg-black text-white pl-4 md:pl-5 pr-1 py-1 rounded-full flex items-center gap-2 hover:bg-gray-800 transition-colors text-sm md:text-base">
                                            View all projects
                                            <div className="bg-white text-black rounded-full p-1 md:p-1.5 hover:bg-black hover:text-white transition-colors">
                                                <ArrowUpRight className="w-5 h-5 md:w-7 md:h-7" />
                                            </div>
                                        </button>
                                    </div>
                                </div>
                            </AnimatedSection>

                            <AnimatedSection direction="right" delay={0.5}>
                                <div className='grid lg:grid-rows-1'>
                                    <div className="relative w-full h-80 md:h-96">
                                        {/* Project Cards Container */}
                                        <div className="flex gap-3 md:gap-4 items-start h-full">
                                            <ProjectCard
                                                project={currentProjects[0]}
                                                isSecondItem={false}
                                                isAnimating={isAnimating}
                                            />

                                            <ProjectCard
                                                project={currentProjects[1]}
                                                isSecondItem={true}
                                                isAnimating={isAnimating}
                                            />
                                        </div>

                                        {/* Navigation Arrows */}
                                        <div className="absolute bottom-0 flex gap-2" style={{ left: `calc(65% + 10px)` }}>
                                            <button
                                                onClick={prevSlide}
                                                disabled={isAnimating}
                                                className="bg-white text-black rounded-full p-1 md:p-1.5 hover:bg-black hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <ArrowLeft className="w-5 h-5 md:w-7 md:h-7" />
                                            </button>

                                            <button
                                                onClick={nextSlide}
                                                disabled={isAnimating}
                                                className="bg-black text-white rounded-full p-1 md:p-1.5 hover:bg-white hover:text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <ArrowRight className="w-5 h-5 md:w-7 md:h-7" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </AnimatedSection>
                        </div>
                    </div>
                </div>
            </section>

            {/* Urban to Suburban Section */}
            <AnimatedSection className="relative grid grid-cols-1 lg:grid-cols-2 min-h-[60vh] md:min-h-[80vh] bg-white rounded-2xl md:rounded-4xl overflow-hidden my-4 mx-4 md:mx-auto">
                <AnimatedSection direction="left" delay={0.2}>
                    <div className="w-full h-full min-h-[40vh] md:min-h-full">
                        <div
                            className="w-full h-full bg-cover bg-center rounded-t-2xl lg:rounded-l-2xl lg:rounded-t-none md:rounded-l-4xl"
                            style={{
                                backgroundImage: `
                                        linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)),
                                        url('urbanToSuburban.png'),
                                        url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 800'><defs><pattern id='diagonals' patternUnits='userSpaceOnUse' width='4' height='4'><path d='M0,4 l4,-4 M-1,1 l2,-2 M3,5 l2,-2' stroke='%23333' stroke-width='0.5'/></pattern></defs><rect width='100%' height='100%' fill='%23222'/><rect width='100%' height='100%' fill='url(%23diagonals)' opacity='0.3'/></svg>")
                                    `
                            }}
                        />
                    </div>
                </AnimatedSection>

                <AnimatedSection direction="right" delay={0.4} className="p-8 md:p-16 flex items-center">
                    <div>
                        <AnimatedText
                            className="text-2xl md:text-3xl lg:text-4xl mb-4 md:mb-6 italic"
                            style={{ fontFamily: 'Playfair Display, serif' }}
                            stagger={false}
                        >
                            From Urban Living to <br />Suburban Dreams,
                        </AnimatedText>

                        <AnimatedText
                            className="text-2xl md:text-4xl lg:text-5xl mb-4 md:mb-6 leading-tight tracking-tight"
                            stagger={true}
                        >
                            We Build for <br />Every Lifestyle.
                        </AnimatedText>

                        <AnimatedSection delay={0.4}>
                            <p className="text-sm md:text-base font-[300] max-w-md leading-relaxed">
                                No matter what your vision entails, we have the expertise and resources to bring it to life. From intimate boutique developments to large-scale communities serving 500+ families or more.
                            </p>
                        </AnimatedSection>
                    </div>
                </AnimatedSection>
            </AnimatedSection>

            {/* Stats and CTA Section */}
            <section className="py-12 md:py-20 px-6">
                <div className="max-w-7xl mx-auto md:px-36">
                    <div className="grid lg:grid-cols-[40%_60%] gap-4">
                        <AnimatedSection direction="left" className="hidden md:block">
                            <div className="h-full bg-black text-white font-[300] p-6 rounded-2xl">
                                <h3 className="text-2xl md:text-3xl lg:text-4xl mb-4 leading-tight tracking-tight">
                                    Ready to Start <br />
                                    Your Next <br />
                                    Chapter?
                                </h3>
                            </div>
                        </AnimatedSection>

                        <AnimatedSection direction="right" delay={0.2}>
                            <div>
                                <div className="grid grid-cols-3 gap-4 md:gap-8 p-2 mb-4">
                                    <AnimatedSection delay={0.1}>
                                        <div>
                                            <div className="text-3xl md:text-4xl lg:text-5xl mb-2">
                                                50+
                                            </div>
                                            <p className="text-sm md:text-lg leading-tight">Projects <br />Completed</p>
                                        </div>
                                    </AnimatedSection>

                                    <AnimatedSection delay={0.2}>
                                        <div>
                                            <div className="text-3xl md:text-4xl lg:text-5xl mb-2">
                                                15
                                            </div>
                                            <p className="text-sm md:text-lg leading-tight">Years <br />Experience</p>
                                        </div>
                                    </AnimatedSection>

                                    <AnimatedSection delay={0.3}>
                                        <div>
                                            <div className="text-3xl md:text-4xl lg:text-5xl mb-2">
                                                10k
                                            </div>
                                            <p className="text-sm md:text-lg leading-tight">Happy <br />Homeowners</p>
                                        </div>
                                    </AnimatedSection>
                                </div>

                                <AnimatedSection delay={0.4}>
                                    <div
                                        className="bg-cover bg-center text-white text-center p-8 md:p-12 rounded-2xl"
                                        style={{
                                            backgroundImage: `
                                                    linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)),
                                                    url('discover.png'),
                                                    url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 800'><defs><pattern id='diagonals' patternUnits='userSpaceOnUse' width='4' height='4'><path d='M0,4 l4,-4 M-1,1 l2,-2 M3,5 l2,-2' stroke='%23333' stroke-width='0.5'/></pattern></defs><rect width='100%' height='100%' fill='%23222'/><rect width='100%' height='100%' fill='url(%23diagonals)' opacity='0.3'/></svg>")
                                                `
                                        }}
                                    >
                                        <h3 className="text-2xl md:text-3xl font-[300] tracking-tight mb-4 md:mb-6">Discover your perfect <br />property today</h3>
                                        <button className="bg-white text-black px-4 md:px-5 py-2 rounded-full text-sm md:text-base font-[400] hover:bg-black hover:text-white transition-colors">
                                            Schedule tour
                                        </button>
                                    </div>
                                </AnimatedSection>
                            </div>
                        </AnimatedSection>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <AnimatedSection>
                <footer className="bg-black text-white py-12 md:py-20 px-6">
                    <div className="max-w-7xl mx-auto md:px-36">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[40%_20%_20%_20%] gap-8">
                            <AnimatedSection direction="left" delay={0.1}>
                                <div>
                                    <div className="flex items-center space-x-2 mb-6 md:mb-8">
                                        <div className="w-12 h-12 md:w-16 md:h-16 flex items-center justify-center">
                                            <img src="logo.png" alt="" />
                                        </div>
                                        <span className="font-[500] text-3xl md:text-4xl">Elevate</span>
                                    </div>

                                    <div className="flex space-x-2">
                                        <div className="w-6 h-6 flex items-center justify-center"><img src="Linkedin.png" /></div>
                                        <div className="w-6 h-6 flex items-center justify-center"><img src="Instagram.png" /></div>
                                        <div className="w-6 h-6 flex items-center justify-center"><img src="Facebook.png" /></div>
                                        <div className="w-6 h-6 flex items-center justify-center"><img src="Twitter.png" /></div>
                                    </div>
                                </div>
                            </AnimatedSection>

                            <AnimatedSection delay={0.2}>
                                <div>
                                    <h4 className="text-lg font-[400] mb-4">Our Story</h4>
                                    <ul className="space-y-2 font-[300]">
                                        <li><a href="#" className="hover:text-gray-300 transition-colors">About Us</a></li>
                                        <li><a href="#" className="hover:text-gray-300 transition-colors">Our Team</a></li>
                                        <li><a href="#" className="hover:text-gray-300 transition-colors">Careers</a></li>
                                        <li><a href="#" className="hover:text-gray-300 transition-colors">News</a></li>
                                    </ul>
                                </div>
                            </AnimatedSection>

                            <AnimatedSection delay={0.3}>
                                <div>
                                    <h4 className="text-lg font-[400] mb-4">What We Do</h4>
                                    <ul className="space-y-2 font-[300]">
                                        <li><a href="#" className="hover:text-gray-300 transition-colors">Residential Projects</a></li>
                                        <li><a href="#" className="hover:text-gray-300 transition-colors">Commercial Spaces</a></li>
                                        <li><a href="#" className="hover:text-gray-300 transition-colors">Investment Opportunities</a></li>
                                        <li><a href="#" className="hover:text-gray-300 transition-colors">Property Management</a></li>
                                    </ul>
                                </div>
                            </AnimatedSection>

                            <AnimatedSection delay={0.4}>
                                <div>
                                    <h4 className="text-lg font-[400] mb-4">Locations</h4>
                                    <ul className="space-y-2 font-[300]">
                                        <li><a href="#" className="hover:text-gray-300 transition-colors">New York</a></li>
                                        <li><a href="#" className="hover:text-gray-300 transition-colors">Chicago</a></li>
                                        <li><a href="#" className="hover:text-gray-300 transition-colors">Los Angeles</a></li>
                                        <li><a href="#" className="hover:text-gray-300 transition-colors">Miami</a></li>
                                    </ul>
                                </div>
                            </AnimatedSection>
                        </div>

                        <AnimatedSection delay={0.4}>
                            <div className="pt-8">
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                                    <div className="mb-4 md:mb-0 space-y-2">
                                        <h4 className="text-lg font-[400] mb-4">Contact</h4>
                                        <p className="text-sm md:text-base">Phone: (555) 123-4567</p>
                                        <p className="text-sm md:text-base">Email: elevate@elevdev.com</p>
                                        <p className="text-sm md:text-base">Address: 123 Development Ave, Suite 100</p>
                                    </div>
                                </div>
                            </div>

                            <p className="text-center mt-8 md:mt-12 text-sm md:text-base">
                                © 2025 Elevate Development. All rights reserved.
                            </p>
                        </AnimatedSection>
                    </div>
                </footer>
            </AnimatedSection>
        </div>
    );
};

export default App;