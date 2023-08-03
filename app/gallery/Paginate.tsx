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
				<li onClick={previousPage} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
					Prev
				</li>
				{pageNumbers.map((number) => (
					<li
						key={number}
						onClick={() => paginate(number)}
						className={
							'bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ' + (number === currentPage ? 'active' : '')
						}
					>
						{number}
					</li>
				))}
				<li onClick={nextPage} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
					Next
				</li>
			</ul>
		</div>
	);
};

export default Paginate;
