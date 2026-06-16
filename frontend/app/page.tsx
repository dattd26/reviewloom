import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { HomeLandingPage } from '@/components/home/HomeLandingPage';

export default function Home() {
  return (
    <>
      <Header />
      <HomeLandingPage />
      <Footer />
    </>
  );
}
