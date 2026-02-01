'use client';

const WhyProomptify = () => {
  return (
    <section className="py-20 bg-[#050520] border-t border-white/5">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-white">Why Creators Choose Us</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Card 1 */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-gray-900 to-black border border-white/10 flex gap-4">
            <div className="mt-1 bg-blue-500/20 p-2 rounded-lg h-fit text-blue-400">
               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white mb-2">Built for Speed</h3>
              <p className="text-gray-400 text-sm">No complex engineering jargon. Just clean prompts that generate results immediately.</p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-gray-900 to-black border border-white/10 flex gap-4">
            <div className="mt-1 bg-purple-500/20 p-2 rounded-lg h-fit text-purple-400">
               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white mb-2">Tested for Accuracy</h3>
              <p className="text-gray-400 text-sm">Every prompt is battle-tested on GPT-4 and Midjourney v6 before it hits our store.</p>
            </div>
          </div>
          
           {/* Card 3 */}
           <div className="p-6 rounded-2xl bg-gradient-to-br from-gray-900 to-black border border-white/10 flex gap-4">
            <div className="mt-1 bg-green-500/20 p-2 rounded-lg h-fit text-green-400">
               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white mb-2">Totally Free to Start</h3>
              <p className="text-gray-400 text-sm">Grab 10 high-quality prompts every single day. No credit card required.</p>
            </div>
          </div>

          {/* Card 4 */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-gray-900 to-black border border-white/10 flex gap-4">
             <div className="mt-1 bg-pink-500/20 p-2 rounded-lg h-fit text-pink-400">
               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white mb-2">Creator First</h3>
              <p className="text-gray-400 text-sm">We don&apos;t care about coding. We care about your engagement, views, and content quality.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyProomptify;