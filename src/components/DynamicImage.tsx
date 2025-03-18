import type { Extension } from "@prisma/client";
import Image from "next/image";
import { z } from "zod";

const schema = z.enum(["png", "jpg", "jpeg", "svg", "gif", "raw"]);

type Props = { fileExtension: Extension };

const DynamicImage = ({ fileExtension }: Props) => {
  const valid = schema.safeParse(fileExtension);
  const validType = valid.success ? valid.data : "raw";
  const type = validType === "jpeg" ? "jpg" : validType;

  return (
    <>
      <div>
        <Image
          src={`/filetype-${type}.svg`}
          className="size-14 transition-all group-hover:-translate-y-1"
          unoptimized
          height={40}
          width={40}
          alt=""
        />
      </div>
    </>
  );
};

export default DynamicImage;
