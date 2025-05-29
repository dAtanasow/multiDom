import Slider from "./img-slider/Slider";
import Advantages from "./advantages/Advantages";
// import BestSellers from "./best-sellers/BestSellers";
import NewProducts from "./new-products/NewProducts";
import SelectedProducts from "./selected-products/SelectedProducts";

export default function Home() {
  return (
    <div className="flex flex-col gap-16 bg-gray-100">
      <Slider />
      {/* <BestSellers /> */}
      <NewProducts />
      <SelectedProducts />
      <Advantages />
    </div>
  );
}
