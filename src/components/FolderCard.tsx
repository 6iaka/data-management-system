import Link from "next/link";
import { Card } from "./ui/card";

type Props = {
  name?: string | null;
};

const FolderCard = ({ name }: Props) => {
  return (
    <Link href={"/"} title={`Ressources Folder`}>
      <Card className="group flex min-w-[200px] items-center justify-between gap-2 p-2.5 transition-all hover:bg-secondary">
        <div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            width="100"
            height="100"
            viewBox="0 0 48 48"
            className="size-14 transition-all group-hover:-translate-y-1"
          >
            <path
              fill="#FFA000"
              d="M38,12H22l-4-4H8c-2.2,0-4,1.8-4,4v24c0,2.2,1.8,4,4,4h31c1.7,0,3-1.3,3-3V16C42,13.8,40.2,12,38,12z"
            ></path>
            <path
              fill="#FFCA28"
              d="M42.2,18H15.3c-1.9,0-3.6,1.4-3.9,3.3L8,40h31.7c1.9,0,3.6-1.4,3.9-3.3l2.5-14C46.6,20.3,44.7,18,42.2,18z"
            ></path>
          </svg>
        </div>

        <div className="flex flex-col">
          <h3 className="line-clamp-1 text-sm font-semibold">
            {name ?? "Folder"}
          </h3>
          <div className="flex items-center justify-between gap-2"></div>
          <p className="line-clamp-2 text-xs text-muted-foreground">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Maiores a
            non esse porro error similique ipsum labore. Aspernatur error
            quisquam provident obcaecati aliquam corrupti sequi maxime, sunt
            rerum a quo.
          </p>
        </div>
      </Card>
    </Link>
  );
};

export default FolderCard;
