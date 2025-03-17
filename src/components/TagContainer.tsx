import tagService from "~/server/services/tag_service";
import CreateTagForm from "./forms/CreateTagForm";
import { Badge } from "./ui/badge";

const TagContainer = async () => {
  const tags = await tagService.getAll();

  return (
    <div className="flex w-full max-w-[400px] flex-col gap-2 rounded-md border p-2">
      <CreateTagForm />

      <div className="flex flex-wrap gap-2">
        {tags.length > 0 ? (
          tags.map((item) => (
            <Badge variant={"secondary"} key={item.id}>
              {item.name}
            </Badge>
          ))
        ) : (
          <small>No tags created</small>
        )}
      </div>
    </div>
  );
};

export default TagContainer;
