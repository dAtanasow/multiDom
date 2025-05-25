import Slider from "./img-slider/Slider";
import Advantages from "./advantages/Advantages";
import BestSellers from "./best-sellers/BestSellers";
import NewProducts from "./new-products/NewProducts";
import SelectedProducts from "./selected-products/SelectedProducts";
import Welcome from "./welcome/Welcome";

export default function Home() {
  return (
    <div className="flex flex-col">
      <Slider />
      <Welcome />
      {/* <BestSellers /> */}
      <NewProducts />
      <SelectedProducts />
      <Advantages />
    </div>
  );
}
