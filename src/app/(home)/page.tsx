import FolderCard from "~/components/FolderCard";
import TagContainer from "~/components/TagContainer";
import { createRootFolder } from "~/server/actions/folder_action";
import folderService from "~/server/services/folder_service";

const HomePage = async () => {
  await createRootFolder();
  const folders = await folderService.getAll();

  return (
    <>
      <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight first:mt-0">
        Dashboard
      </h2>

      <TagContainer />

      <section className="flex flex-col gap-2 rounded-lg">
        <h3 className="text-balance font-medium">Folders</h3>
        <div className="grid w-full grid-cols-[repeat(auto-fill,minmax(14rem,1fr))] gap-2">
          {folders.length > 0 ? (
            folders.map((item) => <FolderCard data={item} key={item.id} />)
          ) : (
            <p className="text-sm text-muted-foreground">No Folders Here</p>
          )}
        </div>
      </section>
    </>
  );
};

export default HomePage;
