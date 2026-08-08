function SpeakingPanel({ question }) {

  return (

    <div
      className="
      mt-6
      bg-[#0E1528]
      rounded-3xl
      border
      border-violet-700
      p-10
      flex
      justify-between
      items-center
    "
    >

      <div>

        <div className="flex items-center gap-4">

          <div
            className="
            w-14
            h-14
            rounded-full
            bg-violet-600
            flex
            items-center
            justify-center
            text-3xl
            "
          >

            🔊

          </div>

          <h2
            className="
            text-4xl
            font-bold
            text-violet-400
            "
          >

            AI Speaking...

          </h2>

        </div>

        <div className="mt-10 space-y-5">

          <h2 className="text-5xl font-bold">

            Good Morning Shreya.

          </h2>

          <h3 className="text-4xl text-gray-300">

            Welcome to your AI Interview.

          </h3>

          <h1 className="text-5xl font-semibold">

            {question}

          </h1>

        </div>

      </div>

      <img

        src="/wave.png"

        className="w-[340px]"

      />

    </div>

  );

}

export default SpeakingPanel;