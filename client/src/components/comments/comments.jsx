import React, { useEffect, useState } from 'react'

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
          <p>User ID: {commentObj.userId}</p>
          <p>Comment: {commentObj.comment}</p>
          {/* Render other properties here */}
          <p>Created At: {commentObj.createdAt}</p>
        </div>
      ))}
    </div>
  );
}
