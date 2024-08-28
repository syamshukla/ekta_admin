"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const PIN_LENGTH = 4;
const CORRECT_PIN = "1234"; // Replace with your desired PIN

export default function Home() {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length <= PIN_LENGTH && /^\d*$/.test(value)) {
      setPin(value);
      setError("");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === CORRECT_PIN) {
      router.push("/dashboard");
    } else {
      setError("Incorrect PIN. Please try again.");
      setPin("");
    }
  };

  return (
    <div className="flex items-center justify-center m-5 flex-col">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            EKTA Admin
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <Input
                type="password"
                placeholder="Enter 4-digit PIN"
                value={pin}
                onChange={handlePinChange}
                maxLength={PIN_LENGTH}
                className="text-center text-2xl"
              />
              {error && (
                <p className="text-red-500 text-sm text-center">{error}</p>
              )}
              <Button
                type="submit"
                className="w-full"
                disabled={pin.length !== PIN_LENGTH}
              >
                Enter
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
