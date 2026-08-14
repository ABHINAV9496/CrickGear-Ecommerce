import { assets } from "../assets/assets";

const getProductImage = (image) => {
  if (!image) return "";
  if (image.startsWith("http") || image.startsWith("/")) return image;
  return assets[image] || image;
};

export default getProductImage;
