import React, { useEffect, useRef, useState } from "react";
import Comment from "./comment";

export default function comments({ data }) {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    if (data && data.comments) {
      setComments(data.comments);
    }
  }, [data]);
  return (
    <div>
      {comments.map((commentObj) => (
        <div key={commentObj._id}>
          <Comment
            userId={commentObj.userId}
            comment={commentObj.comment}
            date={commentObj.createdAt}
            images={commentObj.images}
          />
          {/* {console.log(commentObj)} */}
        </div>
      ))}
    </div>
  );
}
