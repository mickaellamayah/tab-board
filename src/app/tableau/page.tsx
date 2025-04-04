"use client";

import { useState, useEffect, useRef } from "react";
import Speedometer from "../components/speedometer";
import FuelGauge from "../components/fuel-jauge";


export default function Dashboard() {
  const [speed, setSpeed] = useState(0);
  const [fuel, setFuel] = useState(100);
  const [isAccelerating, setIsAccelerating] = useState(false);
  const [isDescelering,setIsDescelering] = useState(false);
  const maxSpeed = 220;
  const acceleration = 100;

  // Handle keyboard controls
  const acceleratingRef = useRef(false);
  const desceleratingRef = useRef(false);

useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.code === "Space") {
      setIsAccelerating(true);
      acceleratingRef.current = true;
    } else if (e.code === "AltLeft") {
      setIsDescelering(true);
      desceleratingRef.current = true;
    }
  };

  const handleKeyUp = (e: KeyboardEvent) => {
    console.log(e.code);
    if (e.code.startsWith("Numpad")) {
      const chiffre = parseInt(e.code.split("Numpad")[1]);

      if (acceleratingRef.current) {
        setSpeed((prevSpeed) => {
          if (prevSpeed < maxSpeed) {
            prevSpeed += (acceleration * (chiffre * 10)) / 100;
          }
          return Math.min(maxSpeed, prevSpeed);
        });
      } else if (desceleratingRef.current) {
        setSpeed((prevSpeed) => {
          if (prevSpeed > 0) {
            prevSpeed -= (acceleration * (chiffre * 10)) / 100;
          }
          return Math.max(0, prevSpeed);
        });
      }
    }

    if (e.code === "Space") {
      setIsAccelerating(false);
      acceleratingRef.current = false;
    }

    if (e.code === "AltLeft") {
      setIsDescelering(false);
      desceleratingRef.current = false;
    }
  };

  window.addEventListener("keydown", handleKeyDown);
  window.addEventListener("keyup", handleKeyUp);

  return () => {
    window.removeEventListener("keydown", handleKeyDown);
    window.removeEventListener("keyup", handleKeyUp);
  };
}, []);


  // Handle speed and fuel changes
  useEffect(() => {
    let animationId: number;

    const updateDashboard = () => {
      setSpeed((prevSpeed) => {
        // if (isAccelerating && prevSpeed < maxSpeed) {
        //   // Accelerate with increasing rate based on current speed
        //   return Math.min(prevSpeed + acceleration, maxSpeed);
        if (!isAccelerating && prevSpeed > 0) {
          // Decelerate gradually
          return Math.max(0, prevSpeed - 1);
        }
        return prevSpeed;
      });

      // Decrease fuel based on speed
      if (speed > 0) {
        setFuel((prevFuel) => Math.max(0, prevFuel - speed / 10000));
      }

      animationId = requestAnimationFrame(updateDashboard);
    };

    animationId = requestAnimationFrame(updateDashboard);
    return () => cancelAnimationFrame(animationId);
  }, [isAccelerating, speed]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-4">
      <div className="w-full max-w-4xl bg-black rounded-3xl shadow-2xl overflow-hidden border-2 border-gray-800">
        <div className="p-8 relative">
          <div className="text-gray-200 text-2xl mb-2 text-center ">
            TABLEAU DE BORD
          </div>
          <div className="flex flex-col md:flex-row justify-around items-center gap-8 p-4">
            <Speedometer speed={speed} maxSpeed={maxSpeed} />
            <FuelGauge fuelLevel={fuel} />
          </div>

          <div className="mt-8 flex justify-center space-x-2.5">
            <div className="px-3 py-2 text-shadow-md bg-red-600 hover:bg-red-700 rounded-xl shadow-lg text-white text-center ">
                Acceleration : {acceleration} 
            </div>

            <div className="flex flex-col items-center bg-gray-800 p-2 rounded-lg border border-gray-700 shadow-lg">
              <div className="w-6 h-14 bg-black rounded-md flex flex-col items-center justify-between p-1">
                <div
                  className={`w-4 h-4 rounded-full ${isDescelering ? "bg-red-500 shadow-md shadow-red-500/50" : "bg-red-900"}`}
                ></div>
                <div
                  className={`w-4 h-4 rounded-full ${isAccelerating ? "bg-green-500 shadow-md shadow-green-500/50" : "bg-green-900"}`}
                ></div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
