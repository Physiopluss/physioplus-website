import BlogCard from "../../components/BlogCard";
import { Button, IconButton, Input } from "@material-tailwind/react";
import { useEffect, useState } from "react";
import { CiSearch } from "react-icons/ci";
import { listAllBlog } from "../../api/blog";
import Loading from "../../components/Loading";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import ReactGA from "react-ga4";

const Blog = () => {
	const [allBlog, setAllBlog] = useState();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState();
	const [page, setPage] = useState(1);
	const [totalPage, setTotalPage] = useState();
	const [query, setQuery] = useState();

	// google analytics
	useEffect(() => {
		ReactGA.send({ hitType: "pageview", page: window.location.pathname, title: "Blog" });
	}, []);

	// scroll to top & fetch blog data
	useEffect(() => {
		setLoading(true);
		window.scrollTo({ top: 0, behavior: "smooth" });

		listAllBlog(page, query).then((res) => {
			if (res.status >= 200 && res.status < 300) {
				setAllBlog(res?.data?.blogs);
				setLoading(false);
				setTotalPage(res?.data?.totalPages);
			} else {
				setError(res.data);
				setLoading(false);
			}
		});
	}, [page, query]);

	return (
		<div className="">
			<h3 className="text-3xl font-bold block text-center bg-lightGreen py-20">Our Blog</h3>
			<div className="mx-2 sm:mx-8">
				<div className=" w-full  flex justify-end">
					<div className="relative  max-w-[20rem] mx-4 my-4">
						<Input
							type="text"
							label="Search Blog ..."
							className="pr-[92px] "
							value={query}
							onChange={(e) => setQuery(e.target.value)}
						/>
						<Button className="!absolute right-1 top-1 rounded !shadow-none bg-green px-4 py-2">
							<CiSearch className="text-lg font-bold" />
						</Button>
					</div>
				</div>
				{error ? (
					"error"
				) : loading ? (
					<Loading />
				) : (
					<div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 pt-4 justify-around gap-8">
						{allBlog &&
							allBlog?.map((Blog) => (
								<BlogCard
									key={Blog._id}
									id={Blog._id}
									title={Blog.title}
									description={Blog.body}
									// youTubeLink={Blog.youTubeLink}
									image={Blog.coverImage}
									// status={Blog.status}
									// views={Blog.views}
									// tags={Blog.tags}
									// blogType={Blog.blogType}
									date={Blog.createdAt}
								/>
							))}
					</div>
				)}
				{/* Pagination */}
				<div className="flex items-center justify-between my-8 gap-4">
					{/* Previous Button */}
					<Button
						variant="text"
						className="border-2 border-[#EAEBEC] rounded-lg bg-white text-green flex items-center !shadow-none hover:!shadow-none gap-2 disabled:text-black hover:bg-white active:bg-white"
						onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
						disabled={page === 1}
					>
						<FaArrowLeft className="h-4 w-4" />
						Previous
					</Button>

					{/* Page Numbers */}
					<div className="justify-center items-center hidden sm:flex gap-2">
						{/* First Page & Ellipsis */}
						{page > 3 && (
							<>
								<IconButton
									className="bg-transparent text-[#667085] !shadow-none hover:!shadow-none"
									onClick={() => setPage(1)}
								>
									1
								</IconButton>
								<IconButton
									className="bg-transparent text-[#667085] !shadow-none hover:!shadow-none"
									disabled
								>
									...
								</IconButton>
							</>
						)}

						{/* Main Pagination Numbers */}
						{Array.from({ length: 3 }, (_, i) => page - 1 + i)
							.filter((num) => num > 0 && num <= totalPage)
							.map((num) => (
								<IconButton
									key={num}
									className={`${
										num === page ? "bg-[#E6F4EC] text-green" : "bg-transparent text-[#667085]"
									} !shadow-none hover:!shadow-none`}
									onClick={() => setPage(num)}
								>
									{num}
								</IconButton>
							))}

						{/* Last Page & Ellipsis */}
						{page < totalPage - 2 && (
							<>
								<IconButton
									className="bg-transparent text-[#667085] !shadow-none hover:!shadow-none"
									disabled
								>
									...
								</IconButton>
								<IconButton
									className="bg-transparent text-[#667085] !shadow-none hover:!shadow-none"
									onClick={() => setPage(totalPage)}
								>
									{totalPage}
								</IconButton>
							</>
						)}
					</div>

					{/* Next Button */}
					<Button
						variant="text"
						className="border-2 border-[#EAEBEC] rounded-lg bg-white text-green flex items-center gap-2 disabled:text-black !shadow-none hover:!shadow-none hover:bg-white active:bg-white"
						onClick={() => setPage((prev) => Math.min(prev + 1, totalPage))}
						disabled={page === totalPage}
					>
						Next
						<FaArrowRight className="h-4 w-4" />
					</Button>
				</div>
			</div>
		</div>
	);
};
export default Blog;
