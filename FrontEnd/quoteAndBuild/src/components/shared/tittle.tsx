interface ProjectElementProps {
  textValue: string;
}

function Titulo({ textValue }: ProjectElementProps) {
  return (
    <div className="text-[64px] font-bold text-black font-[Latif]">
      {textValue}
    </div>
  );
}

export default Titulo;
