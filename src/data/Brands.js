/* Image files go in /public/images. Prices are illustrative (the pages say so). */
import womenImg from "../assets/e/01/women.png";
import menImg from "../assets/e/01/men.png";
import unisexImg from "../assets/e/01/uni.png";
import newImg from "../assets/e/01/new.png";
import giftImg from "../assets/e/01/gift.png";
import armani from "../assets/Brands/ysl.png"
import chanel from "../assets/Brands/chanel.png"
import tom from "../assets/Brands/tom.png"
import you from "../assets/Brands/you.png"
import dior from "../assets/Brands/dior.png"
export const brands = [
  { slug: "armani", name: "Armani", image: armani },
  { slug: "chanel", name: "Chanel", image:chanel },
  { slug: "dior", name: "Dior", image: dior },
  {
    slug: "jo-malone",
    name: "Jo Malone",
    image: chanel,
  },
  { slug: "le-labo", name: "Le Labo", image: tom },
  { slug: "tom-ford", name: "Tom Ford", image: you },
  { slug: "ysl", name: "YSL", image: tom },
];

export const products = [
  {
    id: 1,
    brand: "jo-malone",
    brandName: "Jo Malone",
    name: "English Pear & Freesia",
    note: "Fruity floral",
    family: "Floral",
    gender: "Women",
    size: 100,
    concentration: "Cologne",
    price: 1050,
    isNew: false,
    added: 4,
    img: womenImg,
  },
  {
    id: 2,
    brand: "dior",
    brandName: "DIOR",
    name: "Dior Sauvage",
    note: "Aromatic",
    family: "Fresh",
    gender: "Men",
    size: 100,
    concentration: "Eau de Parfum",
    price: 1290,
    isNew: false,
    added: 3,
    img: menImg,
  },
  {
    id: 3,
    brand: "tom-ford",
    brandName: "Tom Ford",
    name: "Tom Ford Oud Wood",
    note: "Woody",
    family: "Woody",
    gender: "Unisex",
    size: 50,
    concentration: "Eau de Parfum",
    price: 1350,
    isNew: true,
    added: 7,
    img: unisexImg,
  },
  {
    id: 4,
    brand: "le-labo",
    brandName: "Le Labo",
    name: "Le Labo Rose 19",
    note: "Fresh",
    family: "Fresh",
    gender: "Unisex",
    size: 50,
    concentration: "Eau de Parfum",
    price: 1490,
    isNew: true,
    added: 6,
    img: newImg,
  },
  {
    id: 5,
    brand: "ysl",
    brandName: "YSL",
    name: "YSL Black Opium",
    note: "Amber",
    family: "Oriental",
    gender: "Women",
    size: 50,
    concentration: "Eau de Parfum",
    price: 450,
    isNew: false,
    added: 2,
    img: giftImg,
  },
  {
    id: 6,
    brand: "chanel",
    brandName: "CHANEL",
    name: "Chance Eau Tendre",
    note: "Floral",
    family: "Floral",
    gender: "Women",
    size: 50,
    concentration: "Eau de Parfum",
    price: 850,
    isNew: true,
    added: 5,
    img: womenImg,
  },
  {
    id: 7,
    brand: "armani",
    brandName: "Armani",
    name: "Armani Acqua di Giò",
    note: "Fresh",
    family: "Fresh",
    gender: "Men",
    size: 100,
    concentration: "Eau de Toilette",
    price: 790,
    isNew: true,
    added: 1,
    img: menImg,
  },
];

/* Products that have a detail page but are not part of the 7-item Shop All grid
   (used by "Make it your everyday" on the product page). */
export const extraProducts = [
  {
    id: 8,
    brand: "dior",
    brandName: "DIOR",
    name: "Dior J\u2019adore",
    note: "Floral",
    family: "Floral",
    gender: "Women",
    size: 50,
    concentration: "Eau de Parfum",
    price: 1190,
    isNew: false,
    added: 8,
    img: womenImg,
    gallery: [womenImg, menImg, unisexImg, giftImg],
    keyNotes:
      "Ylang-ylang, Damascus rose and jasmine. The brand does not specify a top / heart / base pyramid here.",
  },
  {
    id: 9,
    brand: "chanel",
    brandName: "CHANEL",
    name: "Coco Mademoiselle",
    note: "Amber",
    family: "Oriental",
    gender: "Women",
    size: 50,
    concentration: "Eau de Parfum",
    price: 690,
    isNew: true,
    added: 9,
    img: menImg,
  },
  {
    id: 10,
    brand: "ysl",
    brandName: "YSL",
    name: "YSL Libre",
    note: "Floral",
    family: "Floral",
    gender: "Women",
    size: 50,
    concentration: "Eau de Parfum",
    price: 1590,
    isNew: true,
    added: 10,
    img: unisexImg,
  },
];

export const allProducts = [...products, ...extraProducts];

export const countFor = (slug) =>
  products.filter((p) => p.brand === slug).length;
