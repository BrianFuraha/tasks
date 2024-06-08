import { Carousel } from "@material-tailwind/react";

export default function MyWorks() {
  return (
    <Carousel
      className=" rounded-xl"
      navigation={({ setActiveIndex, activeIndex, length }) => {
        <div className=" absolute bottom-4 left-2/4 z-50 flex -translate-x-2/4 gap-2">
          {new Array(length).fill("").map((_, i) => (
            <span
              key={i}
              className={` block h-1 cursor-pointer rounded-2xl transition-all content-[''] ${
                activeIndex === i ? "w-8 bg-white" : " w-4 bg-white/50"
              }`}
              onClick={() => setActiveIndex(i)}
            />
          ))}
        </div>;
      }}
    >
      <img
        src="https://www.google.com/imgres?q=random%20images&imgurl=https%3A%2F%2Fimages.unsplash.com%2Fphoto-1493612276216-ee3925520721%3Fq%3D80%26w%3D1000%26auto%3Dformat%26fit%3Dcrop%26ixlib%3Drb-4.0.3%26ixid%3DM3wxMjA3fDB8MHxzZWFyY2h8Mnx8cmFuZG9tfGVufDB8fDB8fHww&imgrefurl=https%3A%2F%2Funsplash.com%2Fs%2Fphotos%2Frandom&docid=YpYw_trHdY78IM&tbnid=f7pez_mkWOCBMM&vet=12ahUKEwjXo--hxsyGAxXgg_0HHe_hMF8QM3oECGIQAA..i&w=1000&h=1250&hcb=2&ved=2ahUKEwjXo--hxsyGAxXgg_0HHe_hMF8QM3oECGIQAA"
        alt="image 1"
        className=" h-full w-full object-cover"
      />
      <img
        src="https://www.google.com/imgres?q=random%20images&imgurl=https%3A%2F%2Fi.redd.it%2Fi-got-bored-so-i-decided-to-draw-a-random-image-on-the-v0-4ig97vv85vjb1.png%3Fwidth%3D1280%26format%3Dpng%26auto%3Dwebp%26s%3D7177756d1f393b6e093596d06e1ba539f723264b&imgrefurl=https%3A%2F%2Fwww.reddit.com%2Fr%2FPixelArt%2Fcomments%2F15z47dt%2Fi_got_bored_so_i_decided_to_draw_a_random_image%2F&docid=8oeNXf9H_px_AM&tbnid=WS5PkqrbWh_neM&vet=12ahUKEwjXo--hxsyGAxXgg_0HHe_hMF8QM3oECH0QAA..i&w=1280&h=1280&hcb=2&ved=2ahUKEwjXo--hxsyGAxXgg_0HHe_hMF8QM3oECH0QAA"
        alt="image 2"
        className=" h-full w-full object-cover"
      />
      <img
        src="https://www.google.com/imgres?q=random%20images&imgurl=https%3A%2F%2Fmedia.istockphoto.com%2Fid%2F183821822%2Fphoto%2Fsay.jpg%3Fs%3D612x612%26w%3D0%26k%3D20%26c%3DkRmCjTzA9cq4amgRgeHkZsZuvxezUtC8wdDYfKg-mho%3D&imgrefurl=https%3A%2F%2Fwww.istockphoto.com%2Fphotos%2Frandom-objects&docid=9Jy2uNOTt9MnZM&tbnid=kjgpu5h3pz2FyM&vet=12ahUKEwjXo--hxsyGAxXgg_0HHe_hMF8QM3oECGYQAA..i&w=612&h=612&hcb=2&ved=2ahUKEwjXo--hxsyGAxXgg_0HHe_hMF8QM3oECGYQAA"
        alt="image 3"
        className=" h-full w-full object-cover"
      />
    </Carousel>
  );
}
