"use client";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css"; // Importa apenas o CSS padrão do Swiper

const Carousel = () => {
  return (
    <div className="relative">
      <Swiper
        loop={true} // Habilitando o loop para que o carrossel seja infinito
        className="h-[500px] w-full"
      >
        <SwiperSlide>
          <Image
            src="/images/1.png"
            alt="Carrossel 1"
            className="object-cover w-auto h-auto"
            width={1600}
            height={500}
          />
        </SwiperSlide>
        <SwiperSlide>
        <Image
            src="/images/2.png"
            alt="Carrossel 2"
            className="object-cover w-auto h-auto"
            width={1600}
            height={500}
          />
        </SwiperSlide>
        <SwiperSlide>
        <Image
            src="/images/3.png"
            alt="Carrossel 3"
            className="object-cover w-auto h-auto"
            width={1600}
            height={500}
          />
        </SwiperSlide>
      </Swiper>
    </div>
  );
};

export default Carousel;
