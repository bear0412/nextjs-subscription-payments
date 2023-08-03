import React from 'react';

interface Props {
	postsPerPage: number,
	totalPosts: number,
	currentPage: number,
	paginate: (pageNumber: number) => void,
	previousPage: () => void,
	nextPage: () => void,
}

const Paginate = (props: Props) => {
	const { postsPerPage, totalPosts, currentPage, paginate, previousPage, nextPage, } = props
	const pageNumbers = [];

	for (let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++) {
		pageNumbers.push(i);
	}
	return (
		<div className="pagination-container">
			<ul className="flex justify-center items-center mt-12 gap-5">
				<li onClick={previousPage} className="text-base font-semibold text-blue-500 bg-black cursor-pointer rounded-[10px] px-[10px] py-[20px] ease-linear duration-500 transition-all hover:text-white hover:bg-blue-500">
					Prev
				</li>
				{pageNumbers.map((number) => (
					<li
						key={number}
						onClick={() => paginate(number)}
						className={
							'text-base font-semibold text-blue-500 bg-black cursor-pointer rounded-[10px] px-[10px] py-[20px] ease-linear duration-500 transition-all hover:text-white hover:bg-blue-500 ' + (number === currentPage ? 'active' : '')
						}
					>
						{number}
					</li>
				))}
				<li onClick={nextPage} className="text-base font-semibold text-blue-500 bg-black cursor-pointer rounded-[10px] px-[10px] py-[20px] ease-linear duration-500 transition-all hover:text-white hover:bg-blue-500">
					Next
				</li>
			</ul>
		</div>
	);
};

export default Paginate;
