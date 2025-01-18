export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-green-50 to-white dark:from-green-900 dark:to-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Discover, Collect, and Learn: Unlock the World of Plants Around
              You
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Capture photos of plants to identify their families, track your
              discoveries, and grow your plant knowledge effortlessly.
            </p>
            <div className="flex justify-center gap-4">
              <a
                href="/photos"
                className="bg-green-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-green-700 transition-colors"
              >
                Get Started
              </a>
              <a
                href="#how-it-works"
                className="bg-white text-green-600 px-8 py-3 rounded-lg text-lg font-semibold border border-green-600 hover:bg-green-50 transition-colors"
              >
                Learn More
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Step 1 */}
            <div className="text-center">
              <div className="bg-green-100 dark:bg-green-800 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">📸</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Capture a Photo</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Snap a picture of a plant with your phone
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="bg-green-100 dark:bg-green-800 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🤖</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Instant Recognition
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Identify the plant family with AI
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="bg-green-100 dark:bg-green-800 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">📚</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Build Your Collection
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Add it to your collection to track plants you've seen
              </p>
            </div>

            {/* Step 4 */}
            <div className="text-center">
              <div className="bg-green-100 dark:bg-green-800 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🌍</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Explore & Discover</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Learn about similar plants and discover new ones nearby
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Key Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-2">Plant Recognition</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Identify plant families with accuracy using advanced AI
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-2">
                Scratch Card Mechanics
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Gamify the experience by revealing new plants
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-2">
                On-the-Go Collection
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Keep track of all plants you've encountered
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-2">Discovery Tools</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Find plants you haven't seen yet or nearby rare species
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Who Is It For?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Benefit 1 */}
            <div className="text-center">
              <div className="bg-green-100 dark:bg-green-800 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🌿</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Nature Enthusiasts</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Enhance your plant knowledge and appreciation
              </p>
            </div>

            {/* Benefit 2 */}
            <div className="text-center">
              <div className="bg-green-100 dark:bg-green-800 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">👨‍👩‍👧‍👦</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Families</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Make outdoor adventures fun and educational
              </p>
            </div>

            {/* Benefit 3 */}
            <div className="text-center">
              <div className="bg-green-100 dark:bg-green-800 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🎨</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Hobbyists</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Gamify plant discovery and expand your collection
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            What Our Users Say
          </h2>
          <div className="max-w-2xl mx-auto">
            <blockquote className="text-center">
              <p className="text-xl italic text-gray-600 dark:text-gray-300 mb-4">
                "I never thought identifying plants could be this exciting! It
                feels like a treasure hunt every time I discover a new one.
                Building my collection is so addictive—I can't wait to see what
                plant I'll find next!"
              </p>
              <footer className="text-gray-900 dark:text-white">
                - Happy User
              </footer>
            </blockquote>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
              Start Your Plant Discovery Journey Today!
            </h2>
            <a
              href="/photos"
              className="bg-green-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-green-700 transition-colors"
            >
              Get Started
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-gray-100 dark:bg-gray-700">
        <div className="container mx-auto px-4 text-center text-gray-600 dark:text-gray-300">
          <p>Hobby project by Iris Pan</p>
        </div>
      </footer>
    </div>
  );
}
