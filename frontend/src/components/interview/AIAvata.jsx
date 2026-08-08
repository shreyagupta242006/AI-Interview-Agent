function AIAvatar() {

  return (

    <div
      className="
      bg-[#0E1528]
      rounded-3xl
      border
      border-violet-700
      h-[460px]
      overflow-hidden
      relative
    "
    >

      <div className="absolute left-5 top-5">

        <div className="bg-[#171F35] rounded-xl px-5 py-3">

          <p className="text-white text-xl">

            🤖 AI Interviewer

          </p>

        </div>

      </div>

      <img

        src="/ai-avatar.png"

        className="
        absolute
        inset-0
        w-full
        h-full
        object-cover
        "

      />

      <div
        className="
        absolute
        bottom-6
        left-0
        right-0
        flex
        justify-center
        "
      >

        <img

          src="/wave.png"

          className="w-[420px]"

        />

      </div>

    </div>

  );

}

export default AIAvatar;