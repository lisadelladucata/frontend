import { Card, CardContent, CardFooter } from "@/components/ui/card";

interface ProductCardProps {
  image: string;
  title: string;
  series: string;
  price: number; 
  condition: string;
}

export function ProductCard({
  image,
  title,
  series,
  price,
  condition,
}: ProductCardProps) {
  return (
    <Card className="bg-white">    
      <CardContent className="p-4">
        <div className="aspect-square relative mb-4">
          <img
            src={image || "/placeholder.svg"}
            alt={`${title} ${series}`}
            className="object-cover w-full h-full rounded-lg"
          />
        </div>
        <div className="space-y-1 flex justify-between items-srt">
          <div>
            <h3 className="font-semibold text-xl">{title}</h3>
            <p className="text-sm text-gray-500">{series}</p>
          </div>
          <span className="font-bold text-lg">${price}</span>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex flex-col gap-4">
        <div className="w-full">
          <hr className="border-t-2 border-gray-300" />
        </div>
        <p className="text-sm text-gray-500">{condition}</p>
      </CardFooter>
    </Card>
  );
}
