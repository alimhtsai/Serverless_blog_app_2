import { withAuthenticator } from "@aws-amplify/ui-react";
import { useState, useRef, React } from "react";
import { API, input } from "aws-amplify";
import { useRouter } from "next/router";
import { v4 as uuid } from "uuid";
import { createPost } from "@/src/graphql/mutations";
import dynamic from "next/dynamic";
const SimpleMDE = dynamic(() => import("react-simplemde-editor"), {
  ssr: false,
});
// import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";

const initialState = { title: "", content: ""};
function CreatePost() {
    const [post, setPost] = useState(initialState);
    const { title, content } = post;
    const router = useRouter();

    function onChange(e) {
        setPost(() => ({
            ...post, [e.target.name]: [e.target.value]
        }))
    }

    async function createNewPost() {
        if (!title || !content) return;
        const id = uuid();
        post.id = id;

        await API.graphql({
            query: createPost, 
            variables: { input: post },
            authMode: "AMAZON_COGNITO_USER_POOLS"
        })
        router.push(`/posts/${id}`)
    }
    
    return (
        <div className="mt-16 mb-6 ml-16 me-16">
            <h1 className="text-3xl font-bold mb-3 mt-6">Create a New Post</h1>
            <input
                onChange={onChange}
                name="title"
                placeholder="Title"
                value={post.title}
                className="border-b pb-2 text-lg my-4 focus:outline-none w-full 
                           font-light text-gray-500 placeholder-gray-500 y-2"
            />
            <SimpleMDE
                value={post.content}
                onChange={(value) =>
                    setPost({...post, content: value})
                }
            />
            
            <button type="button" 
                    className="btn btn-dark mb-4 font-semibold px-8 py-2 rounded" 
                    onClick={createNewPost}>
                POST
            </button>
        </div>
    )
}
export default withAuthenticator(CreatePost);