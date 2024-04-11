import React from "react";

export default function chats() {
  return (
    <div className="relative isolate px-6 pt-1 lg:px-8 flex-col grid grid-cols-2 gap-4">
      {/*left side */}
      <div className=" w-[40%] flex flex-col gap-4">
        <div className=" flex flex-col gap-4 rounded-2xl h-auto min-h-[80vh] overflow-scroll">
          <h2 className="pl-1">leftchats</h2> 
        <div className=" flex flex-col gap-4">
          conversations
        </div>
      </div>
        </div>
        
      {/*left side */}
      <div className=" w-auto flex flex-col gap-4">rightchats</div>
    </div>
  );
}
