import React, { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

const Newsletter = () => {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e) => {
    e.preventDefault();
    console.log("Subscribe with email:", email);
    setEmail("");
  };

  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
        <p className="text-gray-600 mb-8">
          Subscribe to our newsletter for exclusive deals and travel inspiration
        </p>

        <form onSubmit={handleSubscribe} className="flex gap-2 max-w-2xl mx-auto">
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="flex-1"
          />
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-8">
            Subscribe
          </Button>
        </form>
      </div>
    </section>
  );
};

export default Newsletter;