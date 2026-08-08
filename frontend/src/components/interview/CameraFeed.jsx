function CameraFeed({ videoRef }) {
  return (
    <div className="relative h-[460px] rounded-3xl overflow-hidden border border-slate-700 bg-black">

      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        className="w-full h-full object-cover"
      />

      <div className="absolute top-5 left-5 bg-black/60 backdrop-blur-md px-4 py-2 rounded-xl">
        <p className="text-white font-semibold">
          📹 You
        </p>
      </div>

    </div>
  );
}

export default CameraFeed;