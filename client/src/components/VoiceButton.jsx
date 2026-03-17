import React from "react";
import { FaVolumeUp } from "react-icons/fa";

export default function VoiceButton({ displayedInstructions }) {
  const speakDirections = () => {
    if (!displayedInstructions || displayedInstructions.length === 0) {
      return alert("No instructions to speak!");
    }

    const synth = window.speechSynthesis;

    // Speak each instruction exactly as shown
    displayedInstructions.forEach((step) => {
      const utterance = new SpeechSynthesisUtterance(step);
      synth.speak(utterance);
    });
  };

  return (
    <button className="voice-btn" onClick={speakDirections}>
      <FaVolumeUp />
    </button>
  );
}