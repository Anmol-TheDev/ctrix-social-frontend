"use client";
import PostInputDialog from "@/components/Dialogs/PostDialogbox";
import Sidebar from "@/components/HomePage/sidebar/sidebar";
import ChatComponent from "@/components/HomePage/friendsSection/chat";
export default function PageLayout() {
  return (
    <div className="flex h-screen w-screen justify-center items-center">
      {/* Main content area (middle) for posts */}

     <div className="container flex border-4 border-muted-foreground rounded-xl  ">
     <Sidebar />
      {/* Chat component (right section) */}

      <div className="flex-1 overflow-y-auto p-4">
        {/* Your posts content will go here */}
        <h1 className="text-2xl font-bold mb-6   px-4">Home Feed</h1>
        <div className="space-y-6">
          {/* Example post items */}
          {[1, 2, 3, 4, 5].map((post) => (
            <div key={post} className="rounded-lg border p-4 bg-white shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-10 w-10 rounded-full bg-gray-200"></div>
                <div>
                  <h3 className="font-semibold">User Name</h3>
                  <p className="text-sm text-gray-500">2 hours ago</p>
                </div>
              </div>
              <p>This is an example post #{post}. Your actual post content will appear here.</p>
            </div>
          ))}
        </div>
      </div>
          <ChatComponent/>
          <PostInputDialog/>
     </div>
      
      {/* Sidebar (right) */}
   
    </div>
  );
}