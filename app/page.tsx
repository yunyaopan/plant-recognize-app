'use client';

import { useEffect, useState } from 'react';

interface Photo {
  id: string;
  photoUrl: string;
  family_scientificNameWithoutAuthor: string;
  createdAt: string;
}

export default function Home() {
  const [latestPhotos, setLatestPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null);

  useEffect(() => {
    // Static photo data with your provided URL
    const staticPhotos: Photo[] = [
      {
        id: '1',
        photoUrl: 'https://jcgeygwstgmkqzdpjsqj.supabase.co/storage/v1/object/public/photos/public/1737277090629-IMG_20220508_121035_Original.jpg',
        family_scientificNameWithoutAuthor: 'Sample Plant Family',
        createdAt: new Date().toISOString()
      },
      {
        id: '2',
        photoUrl: 'https://jcgeygwstgmkqzdpjsqj.supabase.co/storage/v1/object/public/photos/public/1737277151986-IMG_20190815_122732_Original.jpg',
        family_scientificNameWithoutAuthor: 'Sample Plant Family',
        createdAt: new Date().toISOString()
      },
      {
        id: '3',
        photoUrl: 'https://jcgeygwstgmkqzdpjsqj.supabase.co/storage/v1/object/public/photos/public/1737286282169-IMG_20220731_172130_Original.jpg',
        family_scientificNameWithoutAuthor: 'Sample Plant Family',
        createdAt: new Date().toISOString()
      },
      {
        id: '4',
        photoUrl: 'https://jcgeygwstgmkqzdpjsqj.supabase.co/storage/v1/object/public/photos/public/1737300744116-IMG_20191103_091932_Original.jpeg',
        family_scientificNameWithoutAuthor: 'Sample Plant Family',
        createdAt: new Date().toISOString()
      },
      {
        id: '5',
        photoUrl: 'https://jcgeygwstgmkqzdpjsqj.supabase.co/storage/v1/object/public/photos/public/1749866039854-IMG_2637.jpeg',
        family_scientificNameWithoutAuthor: 'Sample Plant Family',
        createdAt: new Date().toISOString()
      },
      {
        id: '6',
        photoUrl: 'https://jcgeygwstgmkqzdpjsqj.supabase.co/storage/v1/object/public/photos/public/1737213974803-IMG_0396.jpeg',
        family_scientificNameWithoutAuthor: 'Sample Plant Family',
        createdAt: new Date().toISOString()
      }
    ];

    // Simulate loading delay
    setTimeout(() => {
      setLatestPhotos(staticPhotos);
      setLoading(false);
    }, 500);
  }, []);

  // Animation effect for random image unblur
  useEffect(() => {
    if (latestPhotos.length === 0) return;

    const animateImages = () => {
      const randomIndex = Math.floor(Math.random() * latestPhotos.length);
      setActiveImageIndex(randomIndex);
      
      setTimeout(() => {
        setActiveImageIndex(null);
      }, 2000); // Remove blur for 2 seconds
    };

    // Start animation immediately
    animateImages();
    
    // Repeat every 3 seconds (2s visible + 1s gap)
    const interval = setInterval(animateImages, 3000);

    return () => clearInterval(interval);
  }, [latestPhotos]);

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Hero Section with Clean Minimalist Design */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-stone-50 via-green-50/40 to-amber-50/30">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Column - Title and Tagline */}
            <div className="order-1 lg:order-1 space-y-8">
              <div className="space-y-6">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light text-stone-800 leading-tight">
                  Unlock the World of Plants Around You
                  <br />
                  <span className="text-green-600 font-medium">Explore the Plant World, One Plant Family at a Time</span>
                </h1>
                <p className="text-lg sm:text-xl text-stone-600 leading-relaxed max-w-lg">
                  Explore the plant kingdom — identify plant families with photos and curate your unique botanical collection.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 items-start">
                <a
                  href="/photos"
                  className="inline-flex items-center gap-2 bg-stone-800 text-white px-8 py-4 rounded-full text-lg font-medium hover:bg-stone-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <span>→</span>
                  Try it out using a test account!
                </a>
              </div>
            </div>

            {/* Right Column - Plant Photos Grid */}
            <div className="order-2 lg:order-2">
              <div className="relative">
                <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full opacity-80" style={{ backgroundColor: '#606F49' }}></div>
                <div className="relative bg-white rounded-3xl p-8 shadow-xl">
                  <h3 className="text-xl font-medium text-stone-700 mb-6 text-center">
                    Latest Plant Discoveries
                  </h3>
                  
                  {loading ? (
                    <div className="columns-2 gap-4 space-y-4 h-80">
                      {[...Array(6)].map((_, i) => {
                        const heights = [120, 160, 140, 180, 130, 170];
                        return (
                          <div 
                            key={i} 
                            className="bg-stone-100 rounded-2xl animate-pulse break-inside-avoid mb-4"
                            style={{ height: `${heights[i]}px` }}
                          />
                        );
                      })}
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="columns-2 gap-4">
                        {latestPhotos.map((photo, index) => {
                          // Create varied heights for authentic Pinterest look
                          const heightVariations = [140, 200, 160, 220, 150, 180, 170, 190, 130, 210];
                          const height = heightVariations[index % heightVariations.length];
                          const isActive = activeImageIndex === index;
                          
                          return (
                            <div
                              key={photo.id}
                              className="relative overflow-hidden rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 group break-inside-avoid mb-4"
                              style={{ height: `${height}px` }}
                            >
                              <img
                                src={photo.photoUrl}
                                alt={photo.family_scientificNameWithoutAuthor}
                                className={`w-full h-full object-cover group-hover:scale-105 transition-all duration-500 ${
                                  isActive ? 'blur-none' : 'blur-sm'
                                }`}
                              />
                              {/* Dimming overlay for blurred images */}
                              <div className={`absolute inset-0 bg-black transition-opacity duration-500 ${
                                isActive ? 'opacity-0' : 'opacity-20'
                              }`}></div>
                              <div className="absolute inset-0 bg-gradient-to-t from-stone-900/70 via-stone-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <div className="absolute bottom-3 left-3 right-3">
                                  <p className="text-white text-sm font-medium truncate">
                                    {photo.family_scientificNameWithoutAuthor}
                                  </p>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      
                      {latestPhotos.length === 0 && (
                        <div className="text-center py-12">
                          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-2xl">🌱</span>
                          </div>
                          <p className="text-stone-500">
                            No discoveries yet. Start your plant journey!
                          </p>
                        </div>
                      )}
                      
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-light text-center text-stone-800 mb-16">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Step 1 */}
            <div className="text-center group">
              <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <span className="text-3xl">📸</span>
              </div>
              <h3 className="text-xl font-medium mb-3 text-stone-700">Capture a Photo</h3>
              <p className="text-stone-500 leading-relaxed">
                Snap a picture of any plant with your phone
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center group">
              <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <span className="text-3xl">🤖</span>
              </div>
              <h3 className="text-xl font-medium mb-3 text-stone-700">
                Instant Recognition
              </h3>
              <p className="text-stone-500 leading-relaxed">
                Our AI identifies the plant family instantly
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center group">
              <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <span className="text-3xl">📚</span>
              </div>
              <h3 className="text-xl font-medium mb-3 text-stone-700">
                Build Collection
              </h3>
              <p className="text-stone-500 leading-relaxed">
                Add discoveries to your personal plant collection
              </p>
            </div>

            {/* Step 4 */}
            <div className="text-center group">
              <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <span className="text-3xl">🌍</span>
              </div>
              <h3 className="text-xl font-medium mb-3 text-stone-700">Explore & Learn</h3>
              <p className="text-stone-500 leading-relaxed">
                See all your past photos of the same plant family — compare, learn, and spot the differences.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="py-20 bg-stone-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-light text-center text-stone-800 mb-16">
            Key Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-md transition-shadow duration-300">
              <h3 className="text-xl font-medium mb-4 text-stone-700">Plant Recognition</h3>
              <p className="text-stone-500 leading-relaxed">
                Advanced AI technology for accurate plant family identification
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-md transition-shadow duration-300">
              <h3 className="text-xl font-medium mb-4 text-stone-700">
                Discovery Game
              </h3>
              <p className="text-stone-500 leading-relaxed">
                Gamified experience that makes plant discovery exciting
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-md transition-shadow duration-300">
              <h3 className="text-xl font-medium mb-4 text-stone-700">
                Personal Collection
              </h3>
              <p className="text-stone-500 leading-relaxed">
                Keep track of all your plant discoveries in one place
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-md transition-shadow duration-300">
              <h3 className="text-xl font-medium mb-4 text-stone-700">Smart Suggestions</h3>
              <p className="text-stone-500 leading-relaxed">
                Find new plants based on your interests and location
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-light text-center text-stone-800 mb-16">
            Perfect For
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Benefit 1 */}
            <div className="text-center group">
              <div className="bg-green-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <span className="text-4xl">🌿</span>
              </div>
              <h3 className="text-xl font-medium mb-4 text-stone-700">Nature Lovers</h3>
              <p className="text-stone-500 leading-relaxed">
                Deepen your connection with nature through plant discovery
              </p>
            </div>

            {/* Benefit 2 */}
            <div className="text-center group">
              <div className="bg-green-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <span className="text-4xl">👨‍👩‍👧‍👦</span>
              </div>
              <h3 className="text-xl font-medium mb-4 text-stone-700">Families</h3>
              <p className="text-stone-500 leading-relaxed">
                Create educational outdoor adventures for the whole family
              </p>
            </div>

            {/* Benefit 3 */}
            <div className="text-center group">
              <div className="bg-green-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <span className="text-4xl">🎨</span>
              </div>
              <h3 className="text-xl font-medium mb-4 text-stone-700">Collectors</h3>
              <p className="text-stone-500 leading-relaxed">
                Build and showcase your unique plant discovery collection
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-green-50/30">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-light text-center text-stone-800 mb-16">
            What Plant Lovers Say
          </h2>
          <div className="max-w-3xl mx-auto">
            <div className="bg-white p-12 rounded-3xl shadow-sm text-center">
              <p className="text-xl text-stone-600 leading-relaxed mb-8 italic">
                "This app has completely transformed my nature walks! Every hike becomes a treasure hunt, and I've discovered so many beautiful plants I never noticed before. My collection keeps growing!"
              </p>
              <div className="flex items-center justify-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-lg">🌱</span>
                </div>
                <div className="text-left">
                  <p className="font-medium text-stone-700">Sarah Chen</p>
                  <p className="text-stone-500 text-sm">Nature Enthusiast</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-light text-stone-800 mb-8">
              Ready to Start Your Plant Journey?
            </h2>
            <a
              href="/photos"
              className="inline-flex items-center gap-3 bg-green-600 text-white px-10 py-4 rounded-full text-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
              style={{ backgroundColor: '#606F49' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#4a5a37'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#606F49'}
            >
              <span>🌿</span>
              Begin Discovering
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-stone-100">
        <div className="container mx-auto px-6 text-center">
          <p className="text-stone-500">A passion project by Iris Pan, built in weekends with AI coding bot Cursor</p>
        </div>
      </footer>
    </div>
  );
}
