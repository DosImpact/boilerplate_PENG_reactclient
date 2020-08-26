import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

import {
  FaRegComment,
  FaRegHeart,
  FaHeart,
  FaRegBookmark,
} from "react-icons/fa";

import Input from "components/Input";
import Avatar from "components/Avatar";
import Card from "components/Card/CardContainer";

import CommentItem from "./CommentItem";
import PostProfile from "./PostProfile";

export default ({
  className,
  id,
  location,
  caption,
  mytalent,
  youtalent,
  content,
  user,
  commentCount,
  comments,
  createdAt,
  isLiked,
  likeCount,
  handleToggleLike,
  formik,
}) => {
  return (
    <Wrapper className={className}>
      <Card
        className="profile"
        size="sm"
        user={user}
        id={id}
        location={location}
        caption={caption}
        mytalent={mytalent}
        youtalent={youtalent}
      />
      <div className="DetailContainer">
        <div className="content">{content}</div>
        <PostProfile
          className="footer"
          commentCount={commentCount}
          handleToggleLike={handleToggleLike}
          isLiked={isLiked}
          likeCount={likeCount}
        />
      </div>
      <div className="commentContainer">
        <div className="commentForm">
          <form onSubmit={formik.handleSubmit}>
             <label htmlFor="comment">댓글</label>
            <Input
              type="text"
              id="comment"
              value={formik.values.comment}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
                    
            {formik.errors.comment && formik.touched.comment && (
              <div>{formik.errors.comment}</div>
            )}
            <button type="submit" disabled={formik.isSubmitting}>
              Submit         
            </button>
          </form>
        </div>
        <div className="commentList">
          {comments?.map((e, idx) => (
            <CommentItem
              className="commentItem"
              user={e.user}
              text={e.text}
              createdAt={e.createdAt}
            />
          ))}
        </div>
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  & > div {
    max-width: 987px;
    width: 100%;
    margin-bottom: 20px;

    border-radius: 6px;
    padding: 30px;
    border: ${(props) => props.theme.boxBorder};
    box-shadow: ${(props) => props.theme.boxShadow};
    margin-bottom: 20px;
  }

  & .profile {
  }
  & .DetailContainer {
    display: flex;
    flex-flow: column wrap;
    justify-content: space-between;
    padding-bottom: 15px;
    & .content {
    }

    & .footer {
      min-height: 40px;
      display: flex;
      flex-flow: row nowrap;
      justify-content: flex-end;
      align-items: flex-end;
      & .item {
        margin-left: 5px;
        & .icon {
          color: ${(props) => props.theme.blueColor};
          margin-right: 1px;
        }
        & .count {
        }
      }
    }
  }
  & .commentContainer {
    min-height: 10px;
    & .commentList {
    }
    & .commentItem {
      min-height: 50px;
    }
    & .commentRow {
      display: flex;
      /* justify-content: center; */
      align-items: center;
    }
  }
`;