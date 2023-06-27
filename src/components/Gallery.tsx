interface GalleryProps {
  test: string;
}

export default function Gallery(props: GalleryProps) {
  return <div id="gallery">{props.test}</div>;
}
