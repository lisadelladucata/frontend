import Container from "@/components/common/Container";
import { ProductCard } from "./ProductCard";

// Array of products
const products = Array(12).fill({
  title: "Xbox",
  series: "Series X",
  price: 399,
  condition: "The device is in excellent condition",
  image: "/products/x-box.png",
});

export function ProductGrid() {
  return (
    <Container>
      <div className="flex items-center my-8">
        <span className="md:px-4 text-white text-xl md:text-5xl font-semibold">
          Console
        </span>
        <div className="flex-grow border-t-2 border-gray-100"></div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((product, index) => (
          <ProductCard key={index} {...product} />
        ))}
      </div>
    </Container>
  );
}
