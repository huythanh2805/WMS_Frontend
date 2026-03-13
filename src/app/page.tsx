'use client';
import { Button } from '@/components/ui/button';
import { API_ENDPOINTS } from '@/constants/api-endpoints';
import Link from 'next/link';
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export default function Home() {
  function handleSignIn() {
    window.location.href = apiUrl + API_ENDPOINTS.LOGIN_GOOGLE;
  }

  return (
    <section className="w-screen h-screen flex items-center justify-center">
      <div className="w-full md:max-w-125 lg:max-w-150 px-4 text-center">
        <h1 className="text-5xl font-bold text-center mb-4">
          Your personal workspace for{' '}
          <span className="text-blue-500">better productivity</span>
        </h1>
        <div className="text-lg text-gray-600">
          Lorem ipsum dolor mollitia itaque! Nisi pariatur quaque temporibus
          consequatur adipisci! Suscipit eum dolorum eaque!
        </div>
        <div className="w-full flex justify-center items-center gap-4 py-4">
          <Button variant="default">
            <Link href="/dashboard">Get Started</Link>
          </Button>
          <Button variant="outline" onClick={handleSignIn}>
            Sign In
          </Button>
        </div>
      </div>
    </section>
  );
}
