const Footer = () => {
    return (
      <footer className="bg-[#020210] border-t border-white/5 pt-16 pb-8">
        <div className="container mx-auto px-4">
          
          {/* Social Proof Bar */}
          <div className="flex flex-col md:flex-row justify-between items-center pb-12 mb-12 border-b border-white/5">
            <div className="text-center md:text-left mb-6 md:mb-0">
               <h4 className="text-lg font-bold text-white">Join the revolution</h4>
               <p className="text-gray-400 text-sm">Over 1,000+ creators are saving time with Proomptify.</p>
            </div>
            <div className="flex gap-8">
                <div className="text-center">
                    <div className="text-2xl font-bold text-white">500+</div>
                    <div className="text-xs text-gray-500">Prompts</div>
                </div>
                <div className="text-center">
                    <div className="text-2xl font-bold text-white">10k+</div>
                    <div className="text-xs text-gray-500">Copies</div>
                </div>
            </div>
          </div>
  
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-500 rounded-lg flex items-center justify-center text-white font-bold">P</div>
                <span className="text-xl font-bold text-white">PromptHub</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                The #1 AI Prompt Store for creators. Stop guessing, start creating.
              </p>
            </div>
  
            <div>
              <h4 className="text-white font-bold mb-4">Platform</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-purple-400 transition-colors">Trending Prompts</a></li>
                <li><a href="#" className="hover:text-purple-400 transition-colors">New Arrivals</a></li>
                <li><a href="#" className="hover:text-purple-400 transition-colors">Submit a Prompt</a></li>
              </ul>
            </div>
  
            <div>
              <h4 className="text-white font-bold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-purple-400 transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-purple-400 transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-purple-400 transition-colors">Contact</a></li>
              </ul>
            </div>
  
            <div>
              <h4 className="text-white font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-purple-400 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-purple-400 transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
  
          <div className="text-center text-gray-600 text-sm">
            © {new Date().getFullYear()} Proomptify. All rights reserved.
          </div>
        </div>
      </footer>
    );
  };
  
  export default Footer;