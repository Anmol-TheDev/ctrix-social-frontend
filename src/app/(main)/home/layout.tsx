import PostInputDialog from "@/components/Dialogs/PostDialogbox";
import PostCommentDialog from "@/components/Dialogs/newComment";
import ChatComponent from "@/components/HomePage/friendsSection/chat";
import Sidebar from "@/components/HomePage/sidebar/sidebar";

export default function HomepageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-screen justify-center items-center">
      <div className="container flex border-4 border-muted-foreground rounded-xl  ">
        <Sidebar />
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-6  h-[85vh]">
            {children}
            <PostCommentDialog />
            <PostInputDialog />
          </div>
        </div>
        <ChatComponent />
      </div>
    </div>
  );
}
