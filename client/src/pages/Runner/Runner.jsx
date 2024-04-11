import { useNavigate } from "react-router-dom";
import { CustomButton } from "../../components/";


export default function Runner() {
  const navigate = useNavigate();
  
  return (
    <div>
      <div className="flex flex-row gap-4">
        <CustomButton
          btnType="button"
          title="create a wera"
          styles="bg-[#8c6dfd]"
          handleClick={() => {
            navigate("/createJob");
          }}
        />
        <CustomButton
          btnType="button"
          title="auction a wera"
          styles="bg-lime-400"
          handleClick={() => {
            navigate("/createJob");
          }}
        />
      </div>
    </div>
  );
}
