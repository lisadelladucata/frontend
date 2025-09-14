import Link from 'next/link';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function ProductCard({
	product,
	type = 'grid',
	layout = 'old',
}: {
	product: {
		_id: string;
		name: string;
		model: string;
		images: string[];
		product_type: string;
		slug: string;
		offer_price: number;
		price: number;
		brand: string;
		condition: string;
		controller: string;
		memory: string;
		quantity: number;
		isVariant: boolean;
		caption: string;
	};
	type?: 'grid' | 'list';
	layout?: 'old' | 'new';
}) {
	return (
		<Link
			href={`/buy/${product?.slug}`}
			key={product?._id}
			className={`bg-white hover:bg-gray-200 rounded-lg overflow-hidden shadow-sm ${
				type !== 'grid' ? 'grid grid-cols-2 items-center' : ''
			}`}
		>
			<div
				className={`aspect-square ${layout === 'new' ? 'p-1.5' : 'p-0'} md:p-0`}
			>
				<img
					src={`${API_URL}${product?.images[0]}`}
					alt={product?.name}
					className='w-full aspect-square rounded-t-lg bg-cover bg-center'
					style={{
						backgroundImage: `url('/sell/${product?.product_type}-sq.jpeg')`,
					}}
				/>
			</div>

			{layout === 'old' ? (
				<div className='px-3'>
					<h3 className='text-xl text-[#101010] font-semibold mb-2 mt-5'>
						{product?.name}
					</h3>
					<div className='text-[#2B2B2B] mb-2 flex items-center justify-between'>
						<div>
							Condition: &nbsp;
							<span className='font-medium text-[#2B2B2B] capitalize'>
								{product?.condition}
							</span>
						</div>
					</div>
					<div className='flex items-center gap-3 text-[#2B2B2B] mb-4'>
						<div className='flex items-center gap-2'>
							<p className='text-[#2B2B2B] text-base'>Price:</p>
							<span className='text-[#00B67A] text-lg font-semibold'>
								{product?.offer_price}
							</span>
						</div>
						<span className='text-sm text-[#919191] line-through'>
							New: {product?.price}
						</span>
					</div>
				</div>
			) : (
				<div>
					<div className='p-2 pt-0 md:p-4 grow'>
						<div className='flex justify-between items-start'>
							<div className='flex flex-col'>
								<h3 className='flex-1 font-semibold text-[#101010] text-base mb-0 lg:mb-2.5 flex flex-wrap'>
									<span className=''>
										{product?.name} {product?.model}
									</span>
								</h3>
								<p className='text-[#2B2B2B] text-xs md:text-base space-x-1 pb-1.5'>
									<span>A partire da</span>
									<span className='text-[#00B67A] text-xs md:text-lg font-medium leading-'>
										&euro;{product?.offer_price}
									</span>
								</p>
							</div>
						</div>
					</div>
					{product?.caption && product?.caption !== 'undefined' && (
						<p className='text-[#2B2B2B] text-xs md:text-sm p-2 md:p-4 grow border-t border-gray-300'>
							{product?.caption}
						</p>
					)}
				</div>
			)}
		</Link>
	);
}
