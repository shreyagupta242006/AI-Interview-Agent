import { useEffect, useRef } from "react";

function CameraFeed() {

  const videoRef = useRef(null);

  useEffect(() => {

    async function startCamera() {

      try {

        const stream =
          await navigator.mediaDevices.getUserMedia({

            video: true,
            audio: false,

          });

        if (videoRef.current) {

          videoRef.current.srcObject = stream;

        }

      }

      catch (err) {

        console.log(err);

      }

    }

    startCamera();

  }, []);

  return (

    <div
      className="
      bg-[#0E1528]
      rounded-3xl
      border
      border-[#272E45]
      h-[460px]
      overflow-hidden
      relative
    "
    >

      <div
        className="
        absolute
        left-5
        top-5
        z-20
        bg-[#1B2238]
        rounded-xl
        px-5
        py-3
        flex
        items-center
        gap-3
        "
      >

        📹

        <span className="text-xl">

          Your Camera

        </span>

        <span className="text-green-400">

          ●

        </span>

      </div>

      <video

        ref={videoRef}

        autoPlay

        muted

        playsInline

        className="
        w-full
        h-full
        object-cover
        "

      />

    </div>

  );

}

export default CameraFeed;