import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import * as commentsActions from '../features/comments/commnets';
import { Loader } from './Loader';
import { Comment } from '../types/Comment';
import { NewCommentForm } from './NewCommentForm';

import { Post } from '../types/Post';

type Props = {
  post: Post;
};

export const PostDetails: React.FC<Props> = ({ post }) => {
  const [isAddCommnet, setIsAddCommnet] = useState(false);

  const dispatch = useAppDispatch();
  const { comments, loading, error } = useAppSelector(state => state.comments);

  const getCommnetsData = (postId: number) => {
    dispatch(commentsActions.init(postId));
  };

  useEffect(() => {
    getCommnetsData(post.id);
  }, [post.id]);

  const onCommnetsDeleteHandle = (comment: Comment) => {
    dispatch(commentsActions.remove(comment.id));
    dispatch(commentsActions.take(comment));
  };

  return (
    <div className="content" data-cy="PostDetails">
      <div className="block">
        <h2 data-cy="PostTitle">
          {`#${post.id}: ${post.title}`}
        </h2>

        <p data-cy="PostBody">
          {post.body}
        </p>
      </div>

      <div className="block">
        {loading && (
          <Loader />
        )}

        {!loading && error && (
          <div className="notification is-danger" data-cy="CommentsError">
            Something went wrong
          </div>
        )}

        {!loading && !error && comments.length === 0 && (
          <p className="title is-4" data-cy="NoCommentsMessage">
            No comments yet
          </p>
        )}

        {!loading && !error && comments.length > 0 && (
          <>
            <p className="title is-4">Comments:</p>

            {comments.map(comment => (
              <article
                className="message is-small"
                key={comment.id}
                data-cy="Comment"
              >
                <div className="message-header">
                  <a href={`mailto:${comment.email}`} data-cy="CommentAuthor">
                    {comment.name}
                  </a>

                  <button
                    data-cy="CommentDelete"
                    type="button"
                    className="delete is-small"
                    aria-label="delete"
                    onClick={() => onCommnetsDeleteHandle(comment)}
                  >
                    delete button
                  </button>
                </div>

                <div className="message-body" data-cy="CommentBody">
                  {comment.body}
                </div>
              </article>
            ))}
          </>
        )}

        {!loading && !error && !isAddCommnet && (
          <button
            data-cy="WriteCommentButton"
            type="button"
            className="button is-link"
            onClick={() => setIsAddCommnet(true)}
          >
            Write a comment
          </button>
        )}

        {!loading && !error && isAddCommnet && (
          <NewCommentForm />
        )}
      </div>
    </div>
  );
};
