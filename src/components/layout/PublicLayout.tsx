import { AnimatedOutlet } from '../animations/AnimatedOutlet';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

export function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <AnimatedOutlet />
      </main>
      <Footer />
    </div>
  );
}
