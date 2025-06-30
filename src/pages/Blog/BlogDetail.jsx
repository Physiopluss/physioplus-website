import { Link, useParams } from "react-router-dom";
import { CiClock2 } from "react-icons/ci";
import { useEffect, useState } from "react";
import { listAllBlog, singleBlog } from "../../api/blog";
import moment from "moment";
import Loading from "../../components/Loading";
import ReactGA from "react-ga4";
import ReactMarkdown from 'react-markdown';

const BlogDetail = () => {
	let { blogId } = useParams();
	const [blogData, setBlogData] = useState([]);
	const [allBlog, setAllBlog] = useState();
	const [error, setError] = useState();

	// google analytics
	useEffect(() => {
		ReactGA.send({ hitType: "pageview", page: window.location.pathname, title: "Blog Detail" });
	}, []);

	// scroll to top & fetch blog data
	useEffect(() => {
		window.scrollTo({ top: 0, behavior: "smooth" });

		singleBlog(blogId)
			.then((res) => {
				setBlogData(res.data.data);
			})
			.catch((err) => setError(err));

		listAllBlog()
			.then((res) => {
				setAllBlog(res.data.blogs);
			})
			.catch((err) => setError(err));
	}, [blogId]);

	const reversedAllBlogData = allBlog && [...allBlog]?.reverse();

	if (blogData == [] || blogData == null) {
		return <Loading />;
	}

	return (
		<div>
			<div
				key={blogData._id}
				className="mx-8 mt-8 flex flex-col justify-center md:flex-row gap-4"
			>
				<div className="flex flex-col w-full md:max-w-screen-md gap-4 p-4">
					<img
						src={blogData.coverImage}
						alt={blogData.title}
						className="object-cover max-h-80"
					/>
					<h2 className="text-3xl font-bold">{blogData.title}</h2>
					{blogData.createdAt && (
						<p className="flex items-center gap-1">
							<CiClock2 />
							{moment(blogData.createdAt).format("ll")}
						</p>
					)}
					<div className="markdown-content">
						{blogData.body && (
							<ReactMarkdown
								components={{
									h1: ({ node, ...props }) => <h1 className="text-3xl font-bold my-4" {...props} />,
									h2: ({ node, ...props }) => <h2 className="text-2xl font-bold my-3" {...props} />,
									h3: ({ node, ...props }) => <h3 className="text-xl font-bold my-2" {...props} />,
									p: ({ node, ...props }) => <p className="my-4" {...props} />,
									a: ({ node, ...props }) => (
										<a
											{...props}
											target="_blank"
											rel="noopener noreferrer"
											className="text-blue-600 hover:underline"
										>
											{props.children}
										</a>
									),
									img: ({ node, ...props }) => (
										<div className="my-6 flex justify-center">
											<img
												{...props}
												className="max-w-full h-auto max-h-[70vh] object-contain rounded-lg shadow-md"
												style={{
													height: 'auto',
													width: 'auto',
													maxWidth: '100%',
												}}
												alt={props.alt || 'Blog image'}
												onError={(e) => {
													e.target.onerror = null;
													e.target.src = '/path/to/fallback-image.jpg'; // Add a fallback image path
												}}
											/>
										</div>
									)
								}}
							>
								{blogData.body}
							</ReactMarkdown>
						)}
					</div>
				</div>

				{/* right sidebar */}
				<div className="max-w-screen md:max-w-xs flex flex-col items-center">
					<h6 className="text-2xl font-bold text-center">Recent Blogs</h6>
					{reversedAllBlogData &&
						reversedAllBlogData.slice(0, 5).map((blog, i) => (
							<Link
								key={i}
								to={`/blog/${blog._id}`}
							>
								<div className="flex gap-4 my-4 items-center mx-4">
									<img
										src={blog.coverImage}
										alt={blog.title}
										className="w-24 aspect-square rounded-md object-cover"
									/>
									<div className="flex flex-col gap-1">
										<p className="text-sm">{moment(blog.createdAt).format("ll")}</p>
										<h6 className="font-bold leading-4">{blog.title}</h6>
									</div>
								</div>
							</Link>
						))}
				</div>
			</div>
		</div>
	);
};
export default BlogDetail;
