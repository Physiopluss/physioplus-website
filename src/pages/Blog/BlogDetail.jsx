import { Link, useParams } from "react-router-dom";
import { CiClock2 } from "react-icons/ci";
import { useEffect, useState } from "react";
import { listAllBlog, singleBlog } from "../../api/blog";
import moment from "moment";
import Loading from "../../components/Loading";
import ReactGA from "react-ga4";

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
						src={blogData.image}
						alt={blogData.title}
						className="object-cover max-h-80"
					/>
					<h2 className="text-3xl font-bold">{blogData.title}</h2>
					{blogData.date && (
						<p className="flex items-center gap-1">
							<CiClock2 />
							{moment(blogData.date).format("ll")}
						</p>
					)}
					<div>
						{blogData.description && <div dangerouslySetInnerHTML={{ __html: blogData.description }} />}
						{/* <div className="mt-4 flex gap-2 flex-row flex-wrap">
							<span>Tags:</span>
							{blogData?.tags?.map((tag, i) => (
								<span
									key={i}
									className="border capitalize border-gray-400 px-2 py-1 mx-1"
								>
									{tag}
								</span>
							))}
						</div> */}
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
										src={blog.image}
										alt={blog.title}
										className="w-24 aspect-square rounded-md object-cover"
									/>
									<div className="flex flex-col gap-1">
										<p className="text-sm">{moment(blogData.date).format("ll")}</p>
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
