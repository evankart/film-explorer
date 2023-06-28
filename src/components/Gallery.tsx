interface GalleryProps {
  test: string;
}

export default function Gallery(props: GalleryProps) {
  return (
    <div id="gallery" style={{ fontSize: "10px", width: "50%" }}>
      {props.test}
    </div>
  );
}
