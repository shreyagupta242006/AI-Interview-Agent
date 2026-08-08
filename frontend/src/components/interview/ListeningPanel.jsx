function ListeningPanel({ transcript }) {

  return (

    <div
      className="
      mt-6
      bg-gradient-to-r
      from-[#05261E]
      to-[#081B19]
      rounded-3xl
      border
      border-green-700
      p-8
      flex
      items-center
      gap-8
    "
    >

      <div
        className="
        w-24
        h-24
        rounded-full
        border-4
        border-green-400
        flex
        items-center
        justify-center
        text-5xl
        animate-pulse
        "
      >

        🎤

      </div>

      <div>

        <h2
          className="
          text-4xl
          font-bold
          text-green-400
          "
        >

          Listening...

        </h2>

        <p className="text-2xl mt-4 text-gray-300">

          {transcript || "Speak clearly. We are listening..."}

        </p>

      </div>

    </div>

  );

}

export default ListeningPanel;