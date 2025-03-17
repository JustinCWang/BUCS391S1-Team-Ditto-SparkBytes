'use client'
import { useRouter } from "next/navigation"; //Since we are using app directory
import { Divider } from "antd";
export default function Home() {

  const router = useRouter();

  return (
    <section className="py-24">
      <div className="container">
        <h1 className="text-3x1 font-bold">Welcome to SparkBytes!</h1>
        <p className="mt-4 text-lg">Landing Page...</p>

        <button
         onClick={() => router.push("/about")}>
          About Us 
        </button>
        <Divider />
        <button
         onClick={() => router.push("/events")}>
          Events
        </button>
        <Divider />
        <button
         onClick={() => router.push("/profile")}>
          Profile
        </button>
      </div>
    </section>
  );
}