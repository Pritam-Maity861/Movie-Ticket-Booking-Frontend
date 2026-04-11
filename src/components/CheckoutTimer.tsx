import { useState, useEffect, useCallback } from "react";
import { Timer } from "lucide-react";

interface CheckoutTimerProps {
  expiresAt: string | Date;
  onExpire: () => void;
}

const CheckoutTimer = ({ expiresAt, onExpire }: CheckoutTimerProps) => {
  const calculateTimeLeft = useCallback(() => {
    const difference = +new Date(expiresAt) - +new Date();
    return Math.max(0, Math.floor(difference / 1000));
  }, [expiresAt]);

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    if (timeLeft <= 0) {
      onExpire();
      return;
    }

    const interval = setInterval(() => {
      const remaining = calculateTimeLeft();
      setTimeLeft(remaining);
      if (remaining <= 0) {
        clearInterval(interval);
        onExpire();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [expiresAt, calculateTimeLeft, onExpire]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div
      className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all duration-500 ${
        timeLeft < 60 && timeLeft > 0
          ? "border-red-500/50 bg-red-500/10 text-red-500 animate-pulse"
          : "border-primary/30 bg-primary/10 text-primary"
      }`}
    >
      <Timer className="w-5 h-5" />
      <span className="font-black tabular-nums text-lg">
        {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
      </span>
    </div>
  );
};

export default CheckoutTimer;
