function AIAvatar({ aiSpeaking }) {
  return (
    <div
      className="
      relative
      bg-[#0E1528]
      rounded-3xl
      border
      border-violet-700
      h-[460px]
      overflow-hidden
      "
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#171A42] to-[#0B1026]" />

      {/* Label */}
      <div className="absolute left-5 top-5 z-20 bg-[#1E293B] px-5 py-3 rounded-xl">
        <p className="text-white text-xl font-semibold">
          🤖 AI Interviewer
        </p>
      </div>

      {/* Blue Glow */}
      {aiSpeaking && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="w-80 h-80 rounded-full bg-cyan-500/20 animate-ping" />
        </div>
      )}

      {/* AI Avatar */}
      <img
        src="/ai-avatar.png"
        alt="AI"
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] z-20"
      />

      {/* Wave */}
      {aiSpeaking && (
        <img
          src="/waveform.gif"
          alt="wave"
          className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[340px] z-30"
        />
      )}
    </div>
  );
}

export default AIAvatar;