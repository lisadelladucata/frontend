// "use client";

// import Image from "next/image";
// import { StarFilled, StarOutlined } from "@ant-design/icons";

// interface ReviewCardProps {
//   comment: string;
//   createdAt: string;
//   customer: { name: string; avatar: string };
//   product: string;
//   rating: number;
//   updatedAt: string;
//   _id: string;
// }

// export default function ReviewCard({
//   comment,
//   customer: { name, avatar },
//   rating,
// }: ReviewCardProps) {
//   const API_URL = process.env.NEXT_PUBLIC_API_URL;

//   return (
//     <div className='bg-white p-6 rounded-lg h-full flex flex-col'>
//       <p className='text-[#000000] leading-7 text-lg mb-6 flex-grow overflow-y-auto'>
//         {comment}
//       </p>
//       <div className='flex items-center justify-between mt-auto'>
//         <div className='flex items-center gap-4'>
//           <div className='relative w-12 h-12 rounded-full overflow-hidden'>
//             <Image
//               src={`${API_URL}${avatar}`}
//               alt={"author"}
//               fill
//               className='object-cover'
//             />
//           </div>
//           <div>
//             <h3 className='font-semibold text-gray-900 capitalize'>{name}</h3>
//           </div>
//         </div>
//         <div className='flex gap-1'>
//           {[...Array(5)].map((_, index) =>
//             index < rating ? (
//               <StarFilled key={index} className='text-yellow-400 text-lg' />
//             ) : (
//               <StarOutlined key={index} className='text-gray-300 text-lg' />
//             )
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import Image from "next/image";
import { StarFilled, StarOutlined } from "@ant-design/icons";

interface ReviewCardProps {
  comment: string;
  createdAt: string;
  customer: { name: string; avatar: string };
  product: string;
  rating: number;
  updatedAt: string;
  _id: string;
}

export default function ReviewCard({
  comment,
  customer: { name, avatar },
  rating,
}: ReviewCardProps) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  return (
    <div className='bg-white p-6 rounded-lg h-full flex flex-col shadow-sm hover:shadow-md transition-shadow'>
      <p className='text-[#000000] leading-7 text-lg mb-6 flex-grow overflow-y-auto'>
        {comment}
      </p>
      <div className='flex items-center justify-between mt-auto'>
        <div className='flex items-center gap-4'>
          <div className='relative w-12 h-12 rounded-full overflow-hidden'>
            <Image
              src={`${API_URL}${avatar}`}
              alt={"author"}
              fill
              className='object-cover'
            />
          </div>
          <div>
            <h3 className='font-semibold text-gray-900 capitalize'>{name}</h3>
          </div>
        </div>
        <div className='flex gap-1'>
          {[...Array(5)].map((_, index) =>
            index < rating ? (
              <StarFilled key={index} className='text-yellow-400 text-lg' />
            ) : (
              <StarOutlined key={index} className='text-gray-300 text-lg' />
            )
          )}
        </div>
      </div>
    </div>
  );
}
