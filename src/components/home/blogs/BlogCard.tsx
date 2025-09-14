// "use client";

// import { Card } from "antd";
// import Image from "next/image";
// import Link from "next/link";

// interface BlogCardProps {
//   _id?: string;
//   image?: string;
//   title?: string;
//   description?: string;
//   slug?: string;
//   createdAt?: string;
// }

// export function BlogCard({
//   _id,
//   image,
//   title,
//   description,
//   slug,
// }: BlogCardProps) {
//   const API_URL = process.env.NEXT_PUBLIC_API_URL;

//   if (!_id) return null;

//   return (
//     <Link href={`/blog/${slug}`}>
//       <Card
//         // hoverable
//         cover={
//           <Image
//             alt={title || ""}
//             src={`${API_URL}${image}`}
//             className='w-full h-[200px] object-cover'
//             width={300}
//             height={200}
//             style={{
//               height: 200,
//               objectFit: "cover",
//             }}
//           />
//         }
//         styles={{
//           body: { padding: 16 },
//         }}
//       >
//         <div className='flex items-center gap-4 mb-3'>
//           <div className='flex items-center gap-2'>
//             <Image src='/users/user.png' width={12} height={12} alt='User' />
//             <p className='text[#101010] text-sm'>Admin</p>
//           </div>
//           <div className='flex items-center gap-2'>
//             <Image src='/calendar.png' width={12} height={12} alt='Calendar' />
//             {/* <p className="text-[#101010] text-sm">{createdAt.split("T")[0]}</p> */}
//           </div>
//         </div>
//         <h2 className='text-[#101010] text-xl font-semibold mb-2.5'>{title}</h2>
//         <p className='text-base text-[#2B2B2B] mb-2'>{description}</p>
//         <p className='text-[#222C9B] hover:text-[#2c3acf]'>Read More</p>
//       </Card>
//     </Link>
//   );
// }

"use client";

import { Card } from "antd";
import Image from "next/image";
import Link from "next/link";

interface BlogCardProps {
  _id?: string;
  image?: string;
  title?: string;
  description?: string;
  slug?: string;
  createdAt?: string;
}

export function BlogCard({
  _id,
  image,
  title,
  description,
  slug,
  createdAt,
}: BlogCardProps) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  if (!_id) return null;

  // Format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateString.split("T")[0];
    }
  };

  return (
    <Link href={`/blog/${slug}`} className='block h-full'>
      <Card
        hoverable
        cover={
          <div className='relative overflow-hidden'>
            <Image
              alt={title || "Blog image"}
              src={`${API_URL}${image}`}
              className='w-full h-[200px] object-cover transition-transform duration-300 hover:scale-105'
              width={300}
              height={200}
              style={{
                height: 200,
                objectFit: "cover",
              }}
            />
          </div>
        }
        styles={{
          body: { padding: 16 },
        }}
        className='h-full flex flex-col shadow-sm hover:shadow-lg transition-shadow duration-300'
      >
        <div className='flex items-center gap-4 mb-3'>
          <div className='flex items-center gap-2'>
            <Image src='/users/user.png' width={12} height={12} alt='User' />
            <p className='text-[#101010] text-sm'>Admin</p>
          </div>
          <div className='flex items-center gap-2'>
            <Image src='/calendar.png' width={12} height={12} alt='Calendar' />
            <p className='text-[#101010] text-sm'>{formatDate(createdAt)}</p>
          </div>
        </div>
        <h2 className='text-[#101010] text-xl font-semibold mb-2.5 line-clamp-2'>
          {title}
        </h2>
        <p className='text-base text-[#2B2B2B] mb-4 flex-grow line-clamp-3'>
          {description}
        </p>
        <p className='text-[#222C9B] hover:text-[#2c3acf] font-medium transition-colors'>
          Read More →
        </p>
      </Card>
    </Link>
  );
}
