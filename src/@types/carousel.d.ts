export interface CarouselI {
  slides: CarouselDataI
  arrows: boolean
  indicators: boolean
  interval: number
}

export type CarouselDataI = {
  src: string;
  alt: string;
  title?: string;
  description?: string;
  button?: string;
  buttonLink?: string;
}[]